import assert from "node:assert/strict";
import test from "node:test";
import { factions } from "../src/worldSim/factions.js";
import { simulateWorldState } from "../src/worldSim/sim.js";
import { timelineEvents } from "../src/worldSim/timeline.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

test("all faction relations point to known factions", () => {
  for (const faction of Object.values(factions)) {
    for (const factionId of Object.keys(faction.relations)) {
      assert.ok(factions[factionId], `${faction.id} has a relation to missing ${factionId}`);
    }
  }
});

test("timeline events are ordered and player-facing", () => {
  let previousYear = 0;

  for (const event of timelineEvents) {
    assert.ok(event.id.startsWith("evt_"), `${event.id} should use a neutral event id`);
    assert.ok(event.fire.year >= previousYear, `${event.id} is out of order`);
    assert.ok(event.presentation.headline, `${event.id} needs a headline`);
    assert.ok(event.presentation.summary, `${event.id} needs a summary`);
    assert.equal("source_tag" in event, false, `${event.id} must not expose source_tag`);
    assertNoScaffoldLeak(event.presentation);
    previousYear = event.fire.year;
  }
});

test("world state advances on schedule with no player input", () => {
  const state = simulateWorldState({ year: 1546, dayOfYear: 1 });

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

  assert.equal(state.recentEvents.length, 1);
  assert.equal(state.recentEvents[0].headline, "Cormyr's banners move south.");
  assertNoScaffoldLeak(state);
});
