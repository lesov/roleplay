import assert from "node:assert/strict";
import test from "node:test";
import { factions } from "../src/worldSim/factions.js";
import { people } from "../src/worldSim/people.js";
import {
  dayOfYearForFestival,
  dayOfYearForMonthDay,
  simulateWorldState
} from "../src/worldSim/sim.js";
import { timelineEvents } from "../src/worldSim/timeline.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

function eventDayOfYear(event) {
  if (event.fire.dayOfYear) {
    return event.fire.dayOfYear;
  }

  if (event.fire.festival) {
    return dayOfYearForFestival(event.fire.year, event.fire.festival);
  }

  return dayOfYearForMonthDay(event.fire.year, event.fire.month, event.fire.day);
}

test("all faction relations point to known factions", () => {
  for (const faction of Object.values(factions)) {
    for (const factionId of Object.keys(faction.relations)) {
      assert.ok(factions[factionId], `${faction.id} has a relation to missing ${factionId}`);
    }
  }
});

test("all factions have valid public leadership references", () => {
  for (const faction of Object.values(factions)) {
    assert.ok(faction.government, `${faction.id} needs a government description`);
    assert.ok(faction.leaderIds?.length > 0, `${faction.id} needs at least one leader`);

    for (const personId of [...(faction.leaderIds || []), ...(faction.keyFigureIds || [])]) {
      assert.ok(people[personId], `${faction.id} references missing person ${personId}`);
    }
  }
});

test("all people point to known factions and expose race/class when known", () => {
  for (const person of Object.values(people)) {
    assert.ok(factions[person.factionId], `${person.id} points to missing faction ${person.factionId}`);
    assert.equal("gmNotes" in person, true, `${person.id} should keep private notes explicit`);
    if (person.race != null) assert.equal(typeof person.race, "string", `${person.id} race must be a string or null`);
    if (person.classOrRole != null) assert.equal(typeof person.classOrRole, "string", `${person.id} classOrRole must be a string or null`);
  }
});

test("timeline leadership effects reference known factions and people", () => {
  for (const event of timelineEvents) {
    for (const change of event.effects?.leadership || []) {
      if (change.faction) assert.ok(factions[change.faction], `${event.id} references missing faction ${change.faction}`);
      if (change.person) assert.ok(people[change.person], `${event.id} references missing person ${change.person}`);
      for (const personId of change.leaderIds || []) {
        assert.ok(people[personId], `${event.id} sets missing leader ${personId}`);
      }
    }
  }
});

test("timeline events are ordered and player-facing", () => {
  let previousYear = 0;
  let previousDayOfYear = 0;

  for (const event of timelineEvents) {
    const eventDay = eventDayOfYear(event);
    assert.ok(event.id.startsWith("evt_"), `${event.id} should use a neutral event id`);
    assert.ok(
      event.fire.year > previousYear ||
        (event.fire.year === previousYear && eventDay >= previousDayOfYear),
      `${event.id} is out of order`
    );
    assert.ok(event.presentation.headline, `${event.id} needs a headline`);
    assert.ok(event.presentation.summary, `${event.id} needs a summary`);
    assert.ok(event.rumor?.originCityId, `${event.id} needs a rumor origin city`);
    assert.ok(event.rumor?.text, `${event.id} needs common-folk rumor text`);
    assert.equal("source_tag" in event, false, `${event.id} must not expose source_tag`);
    assertNoScaffoldLeak(event.presentation);
    assertNoScaffoldLeak(event.rumor);
    previousYear = event.fire.year;
    previousDayOfYear = eventDay;
  }
});

test("world state advances on schedule with no player input", () => {
  const state = simulateWorldState({
    year: 1546,
    dayOfYear: dayOfYearForMonthDay(1546, "Eleint", 29)
  });

  for (const flag of [
    "second_great_war_active",
    "great_schism_active",
    "maztica_rush_begins",
    "cormyr_king_captured",
    "arrabar_sacked",
    "aglarond_destroyed",
    "thay_naval_supremacy",
    "campaign_peace_1546"
  ]) {
    assert.ok(state.flags.includes(flag), `expected ${flag}`);
  }

  assertNoScaffoldLeak(state);
  assert.equal(JSON.stringify(state).includes("gmNotes"), false, "public world state must not expose gmNotes");
});

test("early world state exposes only current public news", () => {
  const state = simulateWorldState({ year: 1496, dayOfYear: 1 });

  assert.equal(state.recentEvents.length, 0);
  assert.equal(state.flags.includes("cormyr_southern_claim"), false);
  assertNoScaffoldLeak(state);
});

test("Cormyr southern claim starts on 18 Eleint 1496 DR", () => {
  const before = simulateWorldState({
    year: 1496,
    dayOfYear: dayOfYearForMonthDay(1496, "Eleint", 17)
  });
  const after = simulateWorldState({
    year: 1496,
    dayOfYear: dayOfYearForMonthDay(1496, "Eleint", 18)
  });

  assert.equal(before.flags.includes("cormyr_southern_claim"), false);
  assert.equal(after.flags.includes("cormyr_southern_claim"), true);
  assert.equal(after.recentEvents[0].headline, "Cormyr's banners move south.");
});

test("festival timeline events fire on their festival date", () => {
  const before = simulateWorldState({
    year: 1497,
    dayOfYear: dayOfYearForMonthDay(1497, "Tarsakh", 30)
  });
  const after = simulateWorldState({
    year: 1497,
    dayOfYear: dayOfYearForFestival(1497, "Greengrass")
  });

  assert.equal(before.flags.includes("first_grand_alliance_forms"), false);
  assert.equal(after.flags.includes("first_grand_alliance_forms"), true);
});

test("world state exposes current leaders with race and class or role", () => {
  const state = simulateWorldState({ year: 1496, dayOfYear: 1 });
  const cormyr = state.factions.find((faction) => faction.id === "cormyr");
  assert.equal(cormyr.leaders[0].displayName, "King Baerovus Obarskyr");
  assert.equal(cormyr.leaders[0].race, "Human");
  assert.equal(cormyr.leaders[0].classOrRole, "Noble Fighter");
  assert.equal("gmNotes" in cormyr.leaders[0], false);
});

test("timeline leadership changes update public leaders and statuses", () => {
  const after1500 = simulateWorldState({
    year: 1500,
    dayOfYear: dayOfYearForMonthDay(1500, "Tarsakh", 1)
  });
  const cormyr1500 = after1500.factions.find((faction) => faction.id === "cormyr");
  assert.equal(cormyr1500.leaders[0].displayName, "King Aldren Obarskyr");

  const after1517 = simulateWorldState({
    year: 1517,
    dayOfYear: dayOfYearForMonthDay(1517, "Eleint", 13)
  });
  const cormyr1517 = after1517.factions.find((faction) => faction.id === "cormyr");
  assert.equal(cormyr1517.leaders[0].displayName, "King Corath Obarskyr");
  assert.equal(cormyr1517.leaders[0].status, "active");

  const after1527 = simulateWorldState({
    year: 1527,
    dayOfYear: dayOfYearForMonthDay(1527, "Alturiak", 24)
  });
  const cormyr1527 = after1527.factions.find((faction) => faction.id === "cormyr");
  assert.equal(cormyr1527.leaders[0].status, "captured");

  const after1528 = simulateWorldState({
    year: 1528,
    dayOfYear: dayOfYearForMonthDay(1528, "Eleasis", 29)
  });
  const aglarond = after1528.factions.find((faction) => faction.id === "aglarond");
  assert.equal(aglarond.leaders[0].displayName, "Queen Lurathra Aerlonde");
  assert.equal(aglarond.leaders[0].status, "dead");
});
