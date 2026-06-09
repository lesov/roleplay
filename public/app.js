import {
  advanceWalkingTravel,
  createCalendarTime,
  formatCalendarTime,
  formatWalkingDuration,
  travelMinutesForMiles
} from "./time.js";

const state = {
  player: null,
  data: null,
  lore: null,
  worldState: null,
  currentCityId: null,
  currentTime: null,
  selectedLoreSectionId: null,
  logEntries: []
};

const elements = {
  charOverlay: document.querySelector("#char-creation-overlay"),
  charForm: document.querySelector("#char-creation-form"),
  charName: document.querySelector("#char-name"),
  charRace: document.querySelector("#char-race"),
  charClass: document.querySelector("#char-class"),
  charBackground: document.querySelector("#char-background"),
  charError: document.querySelector("#char-error"),
  shell: document.querySelector(".shell"),
  year: document.querySelector("#year"),
  placeName: document.querySelector("#place-name"),
  placeEpithet: document.querySelector("#place-epithet"),
  placeDescription: document.querySelector("#place-description"),
  tavernName: document.querySelector("#tavern-name"),
  innkeeperName: document.querySelector("#innkeeper-name"),
  tavernIntro: document.querySelector("#tavern-intro"),
  travelOptions: document.querySelector("#travel-options"),
  dialogueOptions: document.querySelector("#dialogue-options"),
  worldNews: document.querySelector("#world-news"),
  codexSection: document.querySelector("#codex-section"),
  codexContent: document.querySelector("#codex-content"),
  log: document.querySelector("#log"),
  map: document.querySelector("#map"),
  clearLog: document.querySelector("#clear-log")
};

function populateSelect(selectEl, options) {
  selectEl.replaceChildren(
    ...options.map(({ id, label }) => {
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = label;
      return opt;
    })
  );
}

function showCharacterCreation(options) {
  populateSelect(elements.charRace, options.races);
  populateSelect(elements.charClass, options.classes);
  populateSelect(elements.charBackground, options.backgrounds);
  elements.charOverlay.hidden = false;
  elements.charName.focus();
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

async function refreshWorldState() {
  const params = new URLSearchParams({
    year: `${state.currentTime.year}`,
    dayOfYear: `${state.currentTime.dayOfYear}`
  });
  const response = await fetch(`/api/world-state?${params}`);
  state.worldState = await response.json();
}

async function travelTo(cityId) {
  const origin = cityById(state.currentCityId);
  const destination = cityById(cityId);
  const route = routeByCities(origin.id, destination.id);
  const pace = state.data.travelPace;
  const travelMinutes = travelMinutesForMiles(route.miles, pace.milesPerHour);
  state.currentTime = advanceWalkingTravel(state.currentTime, travelMinutes, pace);
  state.currentCityId = cityId;
  await refreshWorldState();
  addLog(
    "Travel",
    `You walk ${route.miles} miles from ${origin.name} to ${destination.name} over ${formatWalkingDuration(route.miles, pace)} on foot. You arrive in ${destination.name}, ${destination.epithet}, on ${formatCalendarTime(state.currentTime)}.`
  );
  render();
}

function speak(topicId) {
  const city = cityById(state.currentCityId);
  const label = state.data.topicLabels[topicId];
  addLog(`${city.tavern.innkeeper} on ${label}`, city.tavern.dialogue[topicId]);
}

function renderTravel(city) {
  const buttons = city.connections.map((connectionId) => {
    const destination = cityById(connectionId);
    const route = routeByCities(city.id, connectionId);
    const button = document.createElement("button");
    const name = document.createElement("strong");
    const marker = document.createElement("span");
    name.textContent = destination.name;
    marker.textContent = `${formatWalkingDuration(route.miles, state.data.travelPace)} on foot`;
    button.type = "button";
    button.append(name, marker);
    button.addEventListener("click", () => travelTo(connectionId));
    return button;
  });

  elements.travelOptions.replaceChildren(...buttons);
}

function renderDialogue(city) {
  const buttons = Object.entries(state.data.topicLabels).map(([topicId, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => speak(topicId));
    return button;
  });

  elements.dialogueOptions.replaceChildren(...buttons);
}

function renderWorldNews() {
  const events = state.worldState?.recentEvents || [];
  elements.worldNews.replaceChildren(
    ...events.slice().reverse().map((event) => {
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

function render() {
  const city = cityById(state.currentCityId);
  elements.year.textContent = formatCalendarTime(state.currentTime);
  elements.placeName.textContent = city.name;
  elements.placeEpithet.textContent = city.epithet;
  elements.placeDescription.textContent = city.description;
  elements.tavernName.textContent = city.tavern.name;
  elements.innkeeperName.textContent = city.tavern.innkeeper;
  elements.tavernIntro.textContent = city.tavern.intro;
  renderTravel(city);
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
  addLog(
    "Arrival",
    `${state.player.name} stands in ${city.name}, with ${city.tavern.name} close at hand.`
  );
  elements.shell.hidden = false;
  render();
}

elements.charForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = elements.charName.value.trim();
  if (!name) {
    elements.charError.textContent = "Please enter a name for your adventurer.";
    elements.charError.hidden = false;
    elements.charName.focus();
    return;
  }
  elements.charError.hidden = true;
  state.player = {
    name,
    race: elements.charRace.value,
    characterClass: elements.charClass.value,
    background: elements.charBackground.value,
  };
  elements.charOverlay.hidden = true;
  await startGame();
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
  const response = await fetch("/api/character-options");
  const options = await response.json();
  showCharacterCreation(options);
}

boot().catch(() => {
  elements.charError.textContent = "Failed to load character options. Please restart the server.";
  elements.charError.hidden = false;
});
