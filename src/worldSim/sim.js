import { cloneFactions } from "./factions.js";
import { timelineEvents } from "./timeline.js";

const CAMPAIGN_START_YEAR = 1496;
const CAMPAIGN_END_YEAR = 1546;

function eventHasFired(event, time) {
  return (
    event.fire.year < time.year ||
    (event.fire.year === time.year && event.fire.dayOfYear <= time.dayOfYear)
  );
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function applyFactionDelta(faction, delta) {
  if (!faction) {
    return;
  }

  const current = faction[delta.field];
  if (typeof current !== "number") {
    return;
  }

  if (delta.op === "add") {
    faction[delta.field] = clampScore(current + delta.value);
  } else if (delta.op === "sub") {
    faction[delta.field] = clampScore(current - delta.value);
  } else if (delta.op === "mul") {
    faction[delta.field] = clampScore(current * delta.value);
  }
}

function applyRelation(factions, relation) {
  const a = factions[relation.a];
  const b = factions[relation.b];
  if (!a || !b) {
    return;
  }

  a.relations[relation.b] = relation.value;
  b.relations[relation.a] = relation.value;
}

function applyTerritory(factions, territoryChange) {
  const faction = factions[territoryChange.faction];
  if (!faction) {
    return;
  }

  if (territoryChange.op === "add" && !faction.territory.includes(territoryChange.value)) {
    faction.territory.push(territoryChange.value);
  } else if (territoryChange.op === "remove") {
    faction.territory = faction.territory.filter((territory) => territory !== territoryChange.value);
  }
}

function applyEvent(state, event) {
  const effects = event.effects || {};

  for (const flag of effects.setFlags || []) {
    state.flags.add(flag);
  }

  for (const delta of effects.factionDeltas || []) {
    applyFactionDelta(state.factions[delta.faction], delta);
  }

  for (const relation of effects.relations || []) {
    applyRelation(state.factions, relation);
  }

  for (const territoryChange of effects.territory || []) {
    applyTerritory(state.factions, territoryChange);
  }
}

function publicFaction(faction) {
  return {
    id: faction.id,
    displayName: faction.displayName,
    treasury: faction.treasury,
    armyStrength: faction.armyStrength,
    navyStrength: faction.navyStrength,
    prestige: faction.prestige,
    territory: [...faction.territory],
    relations: { ...faction.relations },
    flags: [...faction.flags]
  };
}

function publicEvent(event) {
  return {
    id: event.id,
    year: event.fire.year,
    category: event.category,
    storyline: event.storyline,
    headline: event.presentation.headline,
    summary: event.presentation.summary,
    newsSources: [...event.presentation.newsSources]
  };
}

export function simulateWorldState(time) {
  const boundedTime = {
    year: Math.max(CAMPAIGN_START_YEAR, Math.min(CAMPAIGN_END_YEAR, time.year)),
    dayOfYear: time.dayOfYear || 1
  };
  const state = {
    time: boundedTime,
    factions: cloneFactions(),
    flags: new Set(),
    firedEvents: []
  };

  for (const event of timelineEvents) {
    if (!eventHasFired(event, boundedTime)) {
      continue;
    }

    applyEvent(state, event);
    state.firedEvents.push(event);
  }

  const recentEvents = state.firedEvents
    .filter((event) => boundedTime.year - event.fire.year <= 3)
    .slice(-6)
    .map(publicEvent);
  const nextEvent = timelineEvents.find((event) => !eventHasFired(event, boundedTime));

  return {
    time: boundedTime,
    flags: [...state.flags],
    recentEvents,
    nextEventYear: nextEvent ? nextEvent.fire.year : null,
    factions: Object.values(state.factions).map(publicFaction)
  };
}
