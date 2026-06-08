const state = {
  data: null,
  currentCityId: null,
  logEntries: []
};

const elements = {
  year: document.querySelector("#year"),
  placeName: document.querySelector("#place-name"),
  placeEpithet: document.querySelector("#place-epithet"),
  placeDescription: document.querySelector("#place-description"),
  tavernName: document.querySelector("#tavern-name"),
  innkeeperName: document.querySelector("#innkeeper-name"),
  tavernIntro: document.querySelector("#tavern-intro"),
  travelOptions: document.querySelector("#travel-options"),
  dialogueOptions: document.querySelector("#dialogue-options"),
  log: document.querySelector("#log"),
  map: document.querySelector("#map"),
  clearLog: document.querySelector("#clear-log")
};

function cityById(cityId) {
  return state.data.cities[cityId];
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

function travelTo(cityId) {
  const destination = cityById(cityId);
  state.currentCityId = cityId;
  addLog("Travel", `You arrive in ${destination.name}, ${destination.epithet}.`);
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
    const button = document.createElement("button");
    const name = document.createElement("strong");
    const marker = document.createElement("span");
    name.textContent = destination.name;
    marker.textContent = "Travel";
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
  elements.year.textContent = state.data.year;
  elements.placeName.textContent = city.name;
  elements.placeEpithet.textContent = city.epithet;
  elements.placeDescription.textContent = city.description;
  elements.tavernName.textContent = city.tavern.name;
  elements.innkeeperName.textContent = city.tavern.innkeeper;
  elements.tavernIntro.textContent = city.tavern.intro;
  renderTravel(city);
  renderDialogue(city);
  renderMap();
}

async function init() {
  const response = await fetch("/api/game-data");
  state.data = await response.json();
  state.currentCityId = state.data.startCityId;
  const city = cityById(state.currentCityId);
  addLog("Arrival", `You stand in ${city.name}, with ${city.tavern.name} close at hand.`);
  render();
}

elements.clearLog.addEventListener("click", () => {
  state.logEntries = [];
  renderLog();
});

window.addEventListener("resize", renderMap);

init().catch((error) => {
  addLog("Error", "The local chronicle failed to open. Restart the server and try again.");
  console.error(error);
});
