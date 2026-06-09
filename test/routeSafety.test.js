import assert from "node:assert/strict";
import test from "node:test";
import { assessRouteSafety } from "../public/routeSafety.js";
import { gameData } from "../src/gameData.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

function route(key) {
  return gameData.travelRoutes[key];
}

test("route safety returns baseline player-facing levels", () => {
  assert.equal(assessRouteSafety(route("daggerford:waterdeep")).level, "Safe");
  assert.equal(assessRouteSafety(route("neverwinter:waterdeep")).level, "Watchful");
  assert.equal(assessRouteSafety(route("baldurs-gate:daggerford")).level, "Risky");
});

test("world events raise risk on affected routes", () => {
  const baseline = assessRouteSafety(route("daggerford:waterdeep"));
  const wartime = assessRouteSafety(route("daggerford:waterdeep"), {
    flags: ["first_great_war_active"]
  });

  assert.ok(wartime.score > baseline.score);
  assert.equal(wartime.level, "Watchful");
});

test("religious unrest affects pilgrim routes more than northern wilderness", () => {
  const pilgrimBaseline = assessRouteSafety(route("baldurs-gate:elturel"));
  const pilgrimUnrest = assessRouteSafety(route("baldurs-gate:elturel"), {
    flags: ["great_schism_active", "arrabar_sacked"]
  });
  const northernBaseline = assessRouteSafety(route("luskan:neverwinter"));
  const northernUnrest = assessRouteSafety(route("luskan:neverwinter"), {
    flags: ["great_schism_active", "arrabar_sacked"]
  });

  assert.ok(pilgrimUnrest.score > pilgrimBaseline.score);
  assert.equal(northernUnrest.score, northernBaseline.score);
});

test("route safety text does not leak scaffold terms", () => {
  for (const route of Object.values(gameData.travelRoutes)) {
    assertNoScaffoldLeak(assessRouteSafety(route, {
      flags: [
        "western_wars_stirring",
        "second_great_war_active",
        "great_schism_active",
        "arrabar_sacked",
        "thay_naval_supremacy",
        "impious_pact_revealed"
      ]
    }));
  }
});
