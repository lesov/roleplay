import assert from "node:assert/strict";
import test from "node:test";
import {
  createPlayerKnowledge,
  knownWorldState,
  rememberRumors
} from "../public/playerKnowledge.js";
import { assessRouteSafety } from "../public/routeSafety.js";
import { gameData } from "../src/gameData.js";

test("remembered rumors create known world flags", () => {
  const knowledge = createPlayerKnowledge();
  const learned = rememberRumors(knowledge, [
    {
      id: "evt_southern_claim",
      headline: "Cormyr's banners move south.",
      summary: "Riders out of Suzail say purple banners are mustering.",
      flags: ["western_wars_stirring"]
    }
  ]);

  assert.equal(learned.length, 1);
  assert.deepEqual(knownWorldState(knowledge).flags, ["western_wars_stirring"]);
});

test("route safety only reflects world-event factors after the player learns them", () => {
  const knowledge = createPlayerKnowledge();
  const route = gameData.travelRoutes["cimbar:soorenar"];
  const hiddenRisk = assessRouteSafety(route, knownWorldState(knowledge));
  const omniscientRisk = assessRouteSafety(route, { flags: ["western_wars_stirring"] });

  assert.ok(omniscientRisk.score > hiddenRisk.score);

  rememberRumors(knowledge, [
    {
      id: "evt_southern_claim",
      headline: "Cormyr's banners move south.",
      summary: "Riders out of Suzail say purple banners are mustering.",
      flags: ["western_wars_stirring"]
    }
  ]);

  const learnedRisk = assessRouteSafety(route, knownWorldState(knowledge));
  assert.equal(learnedRisk.score, omniscientRisk.score);
});

test("duplicate rumors do not duplicate known events", () => {
  const knowledge = createPlayerKnowledge();
  const rumor = {
    id: "evt_southern_claim",
    headline: "Cormyr's banners move south.",
    summary: "Riders out of Suzail say purple banners are mustering.",
    flags: ["western_wars_stirring"]
  };

  assert.equal(rememberRumors(knowledge, [rumor]).length, 1);
  assert.equal(rememberRumors(knowledge, [rumor]).length, 0);
  assert.equal(knowledge.knownEvents.length, 1);
});
