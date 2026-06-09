import assert from "node:assert/strict";
import test from "node:test";
import { factions } from "../src/worldSim/factions.js";
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
    assert.equal("source_tag" in event, false, `${event.id} must not expose source_tag`);
    assertNoScaffoldLeak(event.presentation);
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
