import {
  advanceWalkingTravel,
  createCalendarTime,
  formatCalendarTime,
  formatWalkingDuration,
  travelMinutesForMiles
} from "./time.js";
import { assessRouteSafety } from "./routeSafety.js";
import {
  createPlayerKnowledge,
  knownWorldState,
  rememberRumors
} from "./playerKnowledge.js";
import { runCharacterWizard } from "./character/wizard.js";
import { renderCharacterSheet } from "./character/sheet.js";
import { getWeather } from "./weather.js";
import { buildNarratorBrief } from "./narratorExport.js";
import { journeyDurationMs, vignetteForProgress, journeyStage } from "./travelJourney.js";
import { computeRouteSegments, segmentForProgress } from "./routeSegments.js";

const state = {
  player: null,
  data: null,
  lore: null,
  worldState: null,
  knowledge: createPlayerKnowledge(),
  currentCityId: null,
  currentTime: null,
  selectedLoreSectionId: null,
  selectedLocationId: null,
  logEntries: []
};

const elements = {
  charOverlay: document.querySelector("#char-creation-overlay"),
  sheetOverlay: document.querySelector("#sheet-overlay"),
  sheetBody: document.querySelector("#sheet-body"),
  sheetClose: document.querySelector("#sheet-close"),
  narratorOverlay: document.querySelector("#narrator-overlay"),
  narratorClose: document.querySelector("#narrator-close"),
  narratorText: document.querySelector("#narrator-text"),
  narratorCopy: document.querySelector("#narrator-copy"),
  narratorStatus: document.querySelector("#narrator-status"),
  narratorBrief: document.querySelector("#narrator-brief"),
  travelOverlay: document.querySelector("#travel-overlay"),
  travelStage: document.querySelector("#travel-stage"),
  travelTitle: document.querySelector("#travel-title"),
  travelSegments: document.querySelector("#travel-segments"),
  travelDanger: document.querySelector("#travel-danger"),
  travelMarker: document.querySelector("#travel-marker"),
  travelOrigin: document.querySelector("#travel-origin"),
  travelDest: document.querySelector("#travel-dest"),
  travelProgress: document.querySelector("#travel-progress"),
  travelVignette: document.querySelector("#travel-vignette"),
  travelMeta: document.querySelector("#travel-meta"),
  travelSkip: document.querySelector("#travel-skip"),
  characterName: document.querySelector("#character-name"),
  characterSummary: document.querySelector("#character-summary"),
  viewSheet: document.querySelector("#view-sheet"),
  shell: document.querySelector(".shell"),
  year: document.querySelector("#year"),
  placeName: document.querySelector("#place-name"),
  placeEpithet: document.querySelector("#place-epithet"),
  placeDescription: document.querySelector("#place-description"),
  weather: document.querySelector("#weather"),
  travelOptions: document.querySelector("#travel-options"),
  dialogueOptions: document.querySelector("#dialogue-options"),
  locationOptions: document.querySelector("#location-options"),
  locationDetail: document.querySelector("#location-detail"),
  worldNews: document.querySelector("#world-news"),
  codexSection: document.querySelector("#codex-section"),
  codexContent: document.querySelector("#codex-content"),
  log: document.querySelector("#log"),
  map: document.querySelector("#map"),
  clearLog: document.querySelector("#clear-log")
};

function renderCharacterPanel() {
  if (!state.player) return;
  const identity = state.player.subrace ? state.player.subrace.label : state.player.race.label;
  elements.characterName.textContent = state.player.name;
  elements.characterSummary.textContent =
    `${identity} ${state.player.class.label} · ${state.player.background.label} · AC ${state.player.armorClass} · HP ${state.player.hitPoints}`;
}

function cityById(cityId) {
  return state.data.cities[cityId];
}

function routeKey(cityId, destinationId) {
  return [cityId, destinationId].sort().join(":");
}

function routeByCities(cityId, destinationId) {
  return state.data.travelRoutes[routeKey(cityId, destinationId)];
}

function selectedLocation(city) {
  const locations = city.locations || [];
  return locations.find((location) => location.id === state.selectedLocationId) || locations[0];
}

function dialogueLabel(topicId) {
  return state.data.topicLabels[topicId] || {
    establishment: "Establishment"
  }[topicId] || topicId;
}

function addLog(title, message) {
  state.logEntries.unshift({ title, message });
  state.logEntries = state.logEntries.slice(0, 18);
  renderLog();
}

function renderLog() {
  elements.log.replaceChildren(
    ...state.logEntries.map((entry) => {
      const item = document.createElement("li");
      const title = document.createElement("strong");
      title.textContent = `${entry.title}: `;
      item.append(title, document.createTextNode(entry.message));
      return item;
    })
  );
}

function currentWeather(city) {
  return getWeather({
    regionId: city.region,
    year: state.currentTime.year,
    dayOfYear: state.currentTime.dayOfYear
  });
}

function travelOptionsForBrief(city) {
  return city.connections.map((connectionId) => {
    const destination = cityById(connectionId);
    const route = routeByCities(city.id, connectionId);
    const safety = assessRouteSafety(route, knownWorldState(state.knowledge));
    return {
      destinationName: destination.name,
      duration: `${formatWalkingDuration(route.miles, state.data.travelPace)} on foot`,
      safetyLevel: safety.level,
      safetySummary: safety.summary
    };
  });
}

function createNarratorBrief() {
  const city = cityById(state.currentCityId);
  return buildNarratorBrief({
    purpose: "scene",
    party: state.player ? [state.player] : [],
    city,
    selectedLocation: selectedLocation(city),
    timeLabel: formatCalendarTime(state.currentTime),
    weather: currentWeather(city),
    worldState: state.worldState,
    knownRumors: state.knowledge.knownEvents,
    logEntries: state.logEntries,
    travelOptions: travelOptionsForBrief(city)
  });
}

async function refreshWorldState() {
  const params = new URLSearchParams({
    year: `${state.currentTime.year}`,
    dayOfYear: `${state.currentTime.dayOfYear}`
  });
  const response = await fetch(`/api/world-state?${params}`);
  state.worldState = await response.json();
}

let journeyInProgress = false;

// Plays the travel popup: an origin->destination line with the marker advancing,
// rotating en-route lore, and a wait proportional to mileage. Resolves on
// completion or when the player clicks "Skip ahead".
function runJourneyAnimation({ origin, destination, route, departTime, arriveTime }) {
  return new Promise((resolve) => {
    const duration = journeyDurationMs(route.miles);
    const vignettes = route.journey?.vignettes || [route.safeSummary];
    const segments = computeRouteSegments(route, knownWorldState(state.knowledge));
    const weather = getWeather({
      regionId: destination.region,
      year: arriveTime.year,
      dayOfYear: arriveTime.dayOfYear
    });

    elements.travelTitle.textContent = `${origin.name} → ${destination.name}`;
    elements.travelOrigin.textContent = origin.name;
    elements.travelDest.textContent = destination.name;

    // Render the danger-banded stretches behind the marker.
    elements.travelSegments.replaceChildren(
      ...segments.map((segment) => {
        const span = document.createElement("span");
        span.className = `travel-seg travel-seg--${segment.band}`;
        span.style.width = `${(segment.end - segment.start) * 100}%`;
        span.title = `${segment.level}: ${segment.note}`;
        return span;
      })
    );
    elements.travelMeta.textContent =
      `${route.miles} miles on foot over the ${route.journey?.terrain || "open road"}. ` +
      `Set out ${formatCalendarTime(departTime)}; arrival ${formatCalendarTime(arriveTime)}. ` +
      `Skies ahead: ${weather.condition.label.toLowerCase()}, ${weather.temperature.label.toLowerCase()}.`;
    elements.travelSkip.textContent = "Skip ahead";
    elements.travelMarker.style.left = "0%";
    elements.travelOverlay.hidden = false;

    let rafId = null;
    let startTs = null;
    let finished = false;

    function finish() {
      if (finished) {
        return;
      }
      finished = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      elements.travelSkip.removeEventListener("click", finish);
      elements.travelOverlay.hidden = true;
      resolve();
    }

    elements.travelSkip.addEventListener("click", finish);

    function frame(ts) {
      if (startTs === null) {
        startTs = ts;
      }
      const progress = Math.min(1, (ts - startTs) / duration);
      elements.travelMarker.style.left = `${progress * 100}%`;
      elements.travelStage.textContent = journeyStage(progress);
      elements.travelVignette.textContent = vignetteForProgress(vignettes, progress);
      const segment = segmentForProgress(segments, progress);
      if (segment) {
        elements.travelDanger.className = `travel-danger travel-danger--${segment.band}`;
        elements.travelDanger.textContent = `This stretch — ${segment.level}: ${segment.note}`;
      }
      const milesDone = Math.round(route.miles * progress);
      elements.travelProgress.textContent = `${Math.round(progress * 100)}% — ${milesDone} of ${route.miles} miles`;

      if (progress >= 1) {
        elements.travelSkip.textContent = "Arrive";
        setTimeout(finish, 600);
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);
  });
}

async function travelTo(cityId) {
  if (journeyInProgress) {
    return;
  }
  const origin = cityById(state.currentCityId);
  const destination = cityById(cityId);
  const route = routeByCities(origin.id, destination.id);
  const pace = state.data.travelPace;
  const travelMinutes = travelMinutesForMiles(route.miles, pace.milesPerHour);
  const departTime = state.currentTime;
  const arriveTime = advanceWalkingTravel(state.currentTime, travelMinutes, pace);

  journeyInProgress = true;
  await runJourneyAnimation({ origin, destination, route, departTime, arriveTime });
  journeyInProgress = false;

  state.currentTime = arriveTime;
  state.currentCityId = cityId;
  state.selectedLocationId = null;
  await refreshWorldState();
  addLog(
    "Travel",
    `You walk ${route.miles} miles from ${origin.name} to ${destination.name} over ${formatWalkingDuration(route.miles, pace)} on foot. You arrive in ${destination.name}, ${destination.epithet}, on ${formatCalendarTime(state.currentTime)}.`
  );
  render();
}

async function fetchLocalRumors() {
  const params = new URLSearchParams({
    cityId: state.currentCityId,
    year: `${state.currentTime.year}`,
    dayOfYear: `${state.currentTime.dayOfYear}`,
    known: [...state.knowledge.knownEventIds].join(",")
  });
  const response = await fetch(`/api/rumors?${params}`);
  const result = await response.json();
  return result.rumors || [];
}

async function speak(topicId) {
  const city = cityById(state.currentCityId);
  const location = selectedLocation(city);
  const contact = location?.contact;
  const dialogue = contact?.dialogue?.[topicId];
  if (!contact || !dialogue) {
    return;
  }

  const label = dialogueLabel(topicId);
  const rumorTopics = new Set(["world", "rumors"]);
  const localRumors = rumorTopics.has(topicId) ? await fetchLocalRumors() : [];
  const learnedRumors = rememberRumors(state.knowledge, localRumors);
  const learnedText = learnedRumors.length
    ? ` ${learnedRumors.map((rumor) => `Word going around: ${rumor.summary}`).join(" ")}`
    : "";

  addLog(`${contact.name} on ${label}`, `${dialogue}${learnedText}`);
  renderWorldNews();
  renderTravel(city);
}

function renderTravel(city) {
  const buttons = city.connections.map((connectionId) => {
    const destination = cityById(connectionId);
    const route = routeByCities(city.id, connectionId);
    const safety = assessRouteSafety(route, knownWorldState(state.knowledge));
    const button = document.createElement("button");
    const details = document.createElement("span");
    const name = document.createElement("strong");
    const safetySummary = document.createElement("span");
    const meta = document.createElement("span");
    const duration = document.createElement("span");
    const badge = document.createElement("span");
    details.className = "travel-details";
    meta.className = "travel-meta";
    duration.className = "travel-duration";
    badge.className = `safety-badge safety-${safety.level.toLowerCase()}`;
    safetySummary.className = "travel-safety-summary";
    name.textContent = destination.name;
    duration.textContent = `${formatWalkingDuration(route.miles, state.data.travelPace)} on foot`;
    badge.textContent = safety.level;
    safetySummary.textContent = safety.summary;
    button.type = "button";
    details.append(name, safetySummary);
    meta.append(duration, badge);
    button.append(details, meta);
    button.addEventListener("click", () => travelTo(connectionId));
    return button;
  });

  elements.travelOptions.replaceChildren(...buttons);
}

function renderLocations(city) {
  const locations = city.locations || [];
  if (locations.length === 0) {
    elements.locationOptions.replaceChildren();
    elements.locationDetail.replaceChildren();
    return;
  }

  const selected =
    locations.find((location) => location.id === state.selectedLocationId) || locations[0];
  state.selectedLocationId = selected.id;

  const buttons = locations.map((location) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = location.name;
    if (location.id === selected.id) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      state.selectedLocationId = location.id;
      renderLocations(city);
      renderDialogue(city);
    });
    return button;
  });
  elements.locationOptions.replaceChildren(...buttons);

  const category = document.createElement("p");
  const name = document.createElement("h3");
  const description = document.createElement("p");
  const contact = document.createElement("p");
  const intro = document.createElement("p");
  category.className = "location-category";
  category.textContent = selected.category;
  name.className = "location-name";
  name.textContent = selected.name;
  description.className = "location-description";
  description.textContent = selected.description;
  contact.className = "location-contact";
  contact.textContent = `${selected.contact.name}, ${selected.contact.role}`;
  intro.className = "location-intro";
  intro.textContent = selected.contact.intro;
  elements.locationDetail.replaceChildren(category, name, description, contact, intro);
}

function renderDialogue(city) {
  const location = selectedLocation(city);
  const dialogue = location?.contact?.dialogue || {};
  const buttons = Object.keys(dialogue).map((topicId) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = dialogueLabel(topicId);
    button.addEventListener("click", () => {
      void speak(topicId);
    });
    return button;
  });

  elements.dialogueOptions.replaceChildren(...buttons);
}

function renderWorldNews() {
  const events = state.knowledge.knownEvents;
  if (events.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No rumors learned yet.";
    elements.worldNews.replaceChildren(item);
    return;
  }

  elements.worldNews.replaceChildren(
    ...events.map((event) => {
      const item = document.createElement("li");
      const headline = document.createElement("strong");
      const summary = document.createElement("p");
      headline.textContent = event.headline;
      summary.textContent = event.summary;
      item.append(headline, summary);
      return item;
    })
  );
}

function renderCodex() {
  const sections = state.lore?.sections || [];
  if (sections.length === 0) {
    elements.codexSection.replaceChildren();
    elements.codexContent.replaceChildren();
    return;
  }

  if (!state.selectedLoreSectionId) {
    state.selectedLoreSectionId = sections[0].id;
  }

  elements.codexSection.replaceChildren(
    ...sections.map((section) => {
      const option = document.createElement("option");
      option.value = section.id;
      option.textContent = section.title;
      return option;
    })
  );
  elements.codexSection.value = state.selectedLoreSectionId;

  const selectedSection =
    sections.find((section) => section.id === state.selectedLoreSectionId) || sections[0];
  elements.codexContent.replaceChildren(
    ...selectedSection.paragraphs.map((paragraph) => {
      const item = document.createElement("p");
      item.textContent = paragraph;
      return item;
    })
  );
}

function renderMap() {
  const mapBounds = elements.map.getBoundingClientRect();
  const cityEntries = Object.values(state.data.cities);
  const renderedRoads = new Set();
  const fragments = [];

  for (const city of cityEntries) {
    for (const connectionId of city.connections) {
      const key = [city.id, connectionId].sort().join(":");
      if (renderedRoads.has(key)) {
        continue;
      }

      const destination = cityById(connectionId);
      const x1 = (city.map.x / 100) * mapBounds.width;
      const y1 = (city.map.y / 100) * mapBounds.height;
      const x2 = (destination.map.x / 100) * mapBounds.width;
      const y2 = (destination.map.y / 100) * mapBounds.height;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const road = document.createElement("div");
      road.className = "road-line";
      road.style.left = `${x1}px`;
      road.style.top = `${y1}px`;
      road.style.width = `${Math.hypot(dx, dy)}px`;
      road.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      fragments.push(road);
      renderedRoads.add(key);
    }
  }

  for (const city of cityEntries) {
    const node = document.createElement("div");
    node.className = city.id === state.currentCityId ? "map-node current" : "map-node";
    node.style.left = `${city.map.x}%`;
    node.style.top = `${city.map.y}%`;
    node.textContent = city.name;
    fragments.push(node);
  }

  elements.map.replaceChildren(...fragments);
}

function renderWeather(city) {
  const weather = currentWeather(city);
  const badge = document.createElement("span");
  badge.className = `weather-badge weather-${weather.condition.id}`;
  badge.textContent = `${weather.condition.label} · ${weather.temperature.label}`;
  const desc = document.createElement("span");
  desc.className = "weather-desc";
  desc.textContent = weather.description;
  elements.weather.replaceChildren(badge, desc);
}

function render() {
  const city = cityById(state.currentCityId);
  elements.year.textContent = formatCalendarTime(state.currentTime);
  elements.placeName.textContent = city.name;
  elements.placeEpithet.textContent = city.epithet;
  elements.placeDescription.textContent = city.description;
  renderWeather(city);
  renderTravel(city);
  renderLocations(city);
  renderDialogue(city);
  renderWorldNews();
  renderCodex();
  renderMap();
}

async function startGame() {
  const response = await fetch("/api/game-data");
  state.data = await response.json();
  state.currentCityId = state.data.startCityId;
  state.currentTime = createCalendarTime(
    state.data.startTime.year,
    state.data.startTime.dayOfYear,
    state.data.startTime.hour,
    state.data.startTime.minute
  );
  const loreResponse = await fetch("/api/lore");
  state.lore = await loreResponse.json();
  await refreshWorldState();
  const city = cityById(state.currentCityId);
  const identity = state.player.subrace ? state.player.subrace.label : state.player.race.label;
  addLog(
    "Arrival",
    `${state.player.name}, a ${identity} ${state.player.class.label}, stands in ${city.name}, with several places nearby to visit.`
  );
  renderCharacterPanel();
  elements.shell.hidden = false;
  render();
}

elements.viewSheet.addEventListener("click", () => {
  renderCharacterSheet(elements.sheetBody, state.player);
  elements.sheetOverlay.hidden = false;
});

elements.sheetClose.addEventListener("click", () => {
  elements.sheetOverlay.hidden = true;
});

elements.sheetOverlay.addEventListener("click", (e) => {
  if (e.target === elements.sheetOverlay) elements.sheetOverlay.hidden = true;
});

elements.narratorBrief.addEventListener("click", () => {
  elements.narratorText.value = createNarratorBrief();
  elements.narratorStatus.textContent = "";
  elements.narratorOverlay.hidden = false;
  elements.narratorText.focus();
  elements.narratorText.select();
});

elements.narratorClose.addEventListener("click", () => {
  elements.narratorOverlay.hidden = true;
});

elements.narratorOverlay.addEventListener("click", (e) => {
  if (e.target === elements.narratorOverlay) elements.narratorOverlay.hidden = true;
});

elements.narratorCopy.addEventListener("click", async () => {
  const text = elements.narratorText.value;
  try {
    await navigator.clipboard.writeText(text);
    elements.narratorStatus.textContent = "Copied.";
  } catch {
    elements.narratorText.focus();
    elements.narratorText.select();
    elements.narratorStatus.textContent = "Copy unavailable. Text selected for manual copy.";
  }
});

elements.clearLog.addEventListener("click", () => {
  state.logEntries = [];
  renderLog();
});

elements.codexSection.addEventListener("change", () => {
  state.selectedLoreSectionId = elements.codexSection.value;
  renderCodex();
});

window.addEventListener("resize", () => {
  if (!elements.shell.hidden) renderMap();
});

async function boot() {
  const [optionsRes, presetsRes] = await Promise.all([
    fetch("/api/character-options"),
    fetch("/api/character-presets")
  ]);
  const rules = await optionsRes.json();
  const { presets } = await presetsRes.json();
  runCharacterWizard({
    rules,
    presets,
    onComplete: async (character) => {
      state.player = character;
      elements.charOverlay.hidden = true;
      await startGame();
    }
  });
}

boot().catch((error) => {
  console.error(error);
  const mount = document.querySelector("#char-wizard");
  if (mount) {
    mount.textContent = "Failed to load character options. Please restart the server and reload.";
  }
});
