import { cloneFactions } from "./factions.js";
import { clonePeople } from "./people.js";
import { timelineEvents } from "./timeline.js";

const CAMPAIGN_START_YEAR = 1496;
const CAMPAIGN_END_YEAR = 1546;
const MONTHS = [
  "Hammer",
  "Alturiak",
  "Ches",
  "Tarsakh",
  "Mirtul",
  "Kythorn",
  "Flamerule",
  "Eleasis",
  "Eleint",
  "Marpenoth",
  "Uktar",
  "Nightal"
];
const FESTIVALS_AFTER_MONTH = {
  Hammer: 1,
  Tarsakh: 1,
  Flamerule: 1,
  Eleint: 1,
  Uktar: 1
};
const FESTIVAL_DAYS = {
  Midwinter: { afterMonth: "Hammer", offset: 1 },
  Greengrass: { afterMonth: "Tarsakh", offset: 1 },
  Midsummer: { afterMonth: "Flamerule", offset: 1 },
  Shieldmeet: { afterMonth: "Flamerule", offset: 2, leapOnly: true },
  Highharvestide: { afterMonth: "Eleint", offset: 1 },
  Higharvestide: { afterMonth: "Eleint", offset: 1 },
  "Feast of the Moon": { afterMonth: "Uktar", offset: 1 }
};

function isShieldmeetYear(year) {
  return year % 4 === 0;
}

export function daysInYear(year) {
  return 365 + (isShieldmeetYear(year) ? 1 : 0);
}

export function dayOfYearForMonthDay(year, month, day) {
  const monthIndex = MONTHS.indexOf(month);
  if (monthIndex === -1) {
    throw new Error(`Unknown Harptos month: ${month}`);
  }

  let dayOfYear = day;
  for (const priorMonth of MONTHS.slice(0, monthIndex)) {
    dayOfYear += 30 + (FESTIVALS_AFTER_MONTH[priorMonth] || 0);
    if (priorMonth === "Flamerule" && isShieldmeetYear(year)) {
      dayOfYear += 1;
    }
  }

  return dayOfYear;
}

export function dayOfYearForFestival(year, festival) {
  const festivalDay = FESTIVAL_DAYS[festival];
  if (!festivalDay) {
    throw new Error(`Unknown Harptos festival: ${festival}`);
  }

  if (festivalDay.leapOnly && !isShieldmeetYear(year)) {
    throw new Error(`${festival} does not occur in ${year} DR`);
  }

  return dayOfYearForMonthDay(year, festivalDay.afterMonth, 30) + festivalDay.offset;
}

export function fireDayOfYear(fire) {
  if (fire.dayOfYear) {
    return fire.dayOfYear;
  }

  if (fire.festival) {
    return dayOfYearForFestival(fire.year, fire.festival);
  }

  return dayOfYearForMonthDay(fire.year, fire.month, fire.day);
}

function eventHasFired(event, time) {
  const eventDay = fireDayOfYear(event.fire);
  return (
    event.fire.year < time.year ||
    (event.fire.year === time.year && eventDay <= time.dayOfYear)
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

function addUnique(list, value) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

function removeValue(list, value) {
  return list.filter((entry) => entry !== value);
}

function applyLeadership(state, change) {
  const faction = state.factions[change.faction];
  const person = state.people[change.person];

  if (change.op === "setLeaders" && faction) {
    faction.leaderIds = [...(change.leaderIds || [])];
  } else if (change.op === "addKeyFigure" && faction && change.person) {
    addUnique(faction.keyFigureIds, change.person);
  } else if (change.op === "removeKeyFigure" && faction && change.person) {
    faction.keyFigureIds = removeValue(faction.keyFigureIds, change.person);
  } else if (change.op === "setPersonStatus" && person) {
    person.status = change.status;
    if (change.died) person.died = change.died;
    if (change.captured) person.captured = change.captured;
    if (change.deposed) person.deposed = change.deposed;
    if (change.restored) person.restored = change.restored;
    if (change.introduced) person.introduced = change.introduced;
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

  for (const leadershipChange of effects.leadership || []) {
    applyLeadership(state, leadershipChange);
  }
}

function publicPerson(person) {
  if (!person) {
    return null;
  }
  if (person.status === "hidden" || person.status === "waiting") {
    return null;
  }

  return {
    id: person.id,
    displayName: person.displayName,
    title: person.title,
    status: person.status,
    race: person.race ?? null,
    classOrRole: person.classOrRole ?? null,
    publicSummary: person.publicSummary,
    tags: [...(person.tags || [])]
  };
}

function publicFaction(faction, people) {
  return {
    id: faction.id,
    displayName: faction.displayName,
    government: faction.government,
    leaders: (faction.leaderIds || []).map((id) => publicPerson(people[id])).filter(Boolean),
    keyFigures: (faction.keyFigureIds || []).map((id) => publicPerson(people[id])).filter(Boolean),
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
    people: clonePeople(),
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
    factions: Object.values(state.factions).map((faction) => publicFaction(faction, state.people))
  };
}
