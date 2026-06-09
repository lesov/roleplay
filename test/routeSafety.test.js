import assert from "node:assert/strict";
import test from "node:test";
import { assessRouteSafety } from "../public/routeSafety.js";
import { gameData } from "../src/gameData.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

function route(key) {
  return gameData.travelRoutes[key];
}

test("route safety returns baseline player-facing levels", () => {
  assert.equal(assessRouteSafety(route("selgaunt:suzail")).level, "Watchful");
  assert.equal(assessRouteSafety(route("cimbar:soorenar")).level, "Risky");
  assert.equal(assessRouteSafety(route("eltabbar:velprintalar")).level, "Perilous");
});

test("world events raise risk on affected routes", () => {
  const baseline = assessRouteSafety(route("cimbar:soorenar"));
  const wartime = assessRouteSafety(route("cimbar:soorenar"), {
    flags: ["first_great_war_active"]
  });

  assert.ok(wartime.score > baseline.score);
  assert.equal(wartime.level, "Risky");
});

test("religious unrest affects Arrabar routes more than eastern wilderness", () => {
  const religiousBaseline = assessRouteSafety(route("arrabar:cimbar"));
  const religiousUnrest = assessRouteSafety(route("arrabar:cimbar"), {
    flags: ["great_schism_active", "arrabar_sacked"]
  });
  const easternBaseline = assessRouteSafety(route("eltabbar:velprintalar"));
  const easternUnrest = assessRouteSafety(route("eltabbar:velprintalar"), {
    flags: ["great_schism_active", "arrabar_sacked"]
  });

  assert.ok(religiousUnrest.score > religiousBaseline.score);
  assert.equal(easternUnrest.score, easternBaseline.score);
});

test("Thayan events raise risk on eastern routes", () => {
  const baseline = assessRouteSafety(route("eltabbar:velprintalar"));
  const easternWar = assessRouteSafety(route("eltabbar:velprintalar"), {
    flags: ["thay_seizes_eastern_ports", "thay_naval_supremacy"]
  });

  assert.ok(easternWar.score > baseline.score);
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
