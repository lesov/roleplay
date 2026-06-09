import assert from "node:assert/strict";
import test from "node:test";
import { gameData } from "../src/gameData.js";
import {
  discoverableRumors,
  rumorArrivalTime,
  shortestTravelMiles
} from "../src/worldSim/rumors.js";
import { dayOfYearForMonthDay } from "../src/worldSim/sim.js";
import { timelineEvents } from "../src/worldSim/timeline.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

function event(id) {
  return timelineEvents.find((entry) => entry.id === id);
}

test("rumor distance uses playable Inner Sea routes", () => {
  assert.equal(shortestTravelMiles(gameData, "suzail", "cimbar"), 1420);
});

test("innkeepers cannot reveal a rumor before fastest-rider spread", () => {
  const southernClaim = event("evt_southern_claim");
  const arrival = rumorArrivalTime(southernClaim, "cimbar", gameData);
  const rumors = discoverableRumors(
    { year: 1496, dayOfYear: arrival.dayOfYear - 1 },
    "cimbar",
    gameData
  );

  assert.equal(arrival.travelDays, 24);
  assert.equal(rumors.some((rumor) => rumor.id === "evt_southern_claim"), false);
});

test("innkeepers can reveal a rumor after fastest-rider spread", () => {
  const southernClaim = event("evt_southern_claim");
  const arrival = rumorArrivalTime(southernClaim, "cimbar", gameData);
  const rumors = discoverableRumors(arrival, "cimbar", gameData);
  const learned = rumors.find((rumor) => rumor.id === "evt_southern_claim");

  assert.ok(learned);
  assert.equal(learned.originCityId, "suzail");
  assert.ok(learned.flags.includes("western_wars_stirring"));
  assertNoScaffoldLeak(learned);
});

test("local rumors can be heard on the event day", () => {
  const rumors = discoverableRumors(
    { year: 1496, dayOfYear: dayOfYearForMonthDay(1496, "Eleint", 18) },
    "suzail",
    gameData
  );

  assert.ok(rumors.some((rumor) => rumor.id === "evt_southern_claim"));
});

test("known rumors are not returned again", () => {
  const southernClaim = event("evt_southern_claim");
  const arrival = rumorArrivalTime(southernClaim, "cimbar", gameData);
  const rumors = discoverableRumors(arrival, "cimbar", gameData, ["evt_southern_claim"]);

  assert.equal(rumors.some((rumor) => rumor.id === "evt_southern_claim"), false);
});
