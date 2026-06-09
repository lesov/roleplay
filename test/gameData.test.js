import assert from "node:assert/strict";
import test from "node:test";
import { gameData } from "../src/gameData.js";

const requiredTopics = ["world", "rumors", "roads", "local"];

function routeKey(cityId, connectionId) {
  return [cityId, connectionId].sort().join(":");
}

test("start city exists", () => {
  assert.ok(gameData.cities[gameData.startCityId]);
});

test("play starts in the Sea of Fallen Stars region", () => {
  const seaOfFallenStarsRegions = new Set([
    "Aglarond",
    "Chessenta",
    "Cormyr",
    "Sembia",
    "Thay",
    "Vilhon Reach"
  ]);
  const startCity = gameData.cities[gameData.startCityId];

  assert.ok(seaOfFallenStarsRegions.has(startCity.region));
});

test("Sword Coast cities are not currently travelable", () => {
  for (const cityId of [
    "baldurs-gate",
    "daggerford",
    "elturel",
    "luskan",
    "neverwinter",
    "waterdeep"
  ]) {
    assert.equal(gameData.cities[cityId], undefined, `${cityId} should not be playable now`);
  }
});

test("every city has complete descriptive data", () => {
  for (const city of Object.values(gameData.cities)) {
    assert.ok(city.name, `${city.id} is missing a name`);
    assert.ok(city.description, `${city.id} is missing a description`);
    assert.equal("tavern" in city, false, `${city.id} should model taverns as locations`);
  }
});

test("every travel connection points to a valid city", () => {
  for (const city of Object.values(gameData.cities)) {
    assert.ok(city.connections.length > 0, `${city.id} has no roads`);

    for (const connectionId of city.connections) {
      assert.ok(gameData.cities[connectionId], `${city.id} links to missing ${connectionId}`);
    }
  }
});

test("travel connections are bidirectional", () => {
  for (const city of Object.values(gameData.cities)) {
    for (const connectionId of city.connections) {
      const connectedCity = gameData.cities[connectionId];
      assert.ok(
        connectedCity.connections.includes(city.id),
        `${city.id} links to ${connectionId}, but not back`
      );
    }
  }
});

test("every travel connection has walking route mileage", () => {
  for (const city of Object.values(gameData.cities)) {
    for (const connectionId of city.connections) {
      const route = gameData.travelRoutes[routeKey(city.id, connectionId)];
      assert.ok(route, `${city.id} to ${connectionId} is missing route mileage`);
      assert.ok(route.miles > 0, `${city.id} to ${connectionId} needs positive mileage`);
    }
  }
});

test("travel routes match valid connected cities", () => {
  for (const [key, route] of Object.entries(gameData.travelRoutes)) {
    const [cityId, connectionId] = key.split(":");
    assert.ok(gameData.cities[cityId], `${key} starts from a missing city`);
    assert.ok(gameData.cities[connectionId], `${key} ends at a missing city`);
    assert.ok(Number.isInteger(route.miles), `${key} mileage should be an integer`);
    assert.ok(
      gameData.cities[cityId].connections.includes(connectionId),
      `${key} is not represented in city connections`
    );
    assert.ok(
      gameData.cities[connectionId].connections.includes(cityId),
      `${key} is not represented bidirectionally in city connections`
    );
  }
});

test("every travel route has player-facing safety metadata", () => {
  const validRisks = new Set(["safe", "watchful", "risky", "perilous"]);

  for (const [key, route] of Object.entries(gameData.travelRoutes)) {
    assert.ok(validRisks.has(route.baseRisk), `${key} needs a valid baseRisk`);
    assert.ok(route.safeSummary, `${key} needs a safety summary`);
    assert.ok(route.hazards?.length > 0, `${key} needs route hazards`);
    assert.ok(route.safetyTags?.length > 0, `${key} needs safety tags`);
  }
});

test("all dialogue topic labels are represented in required topics", () => {
  assert.deepEqual(Object.keys(gameData.topicLabels), requiredTopics);
});

test("Cimbar and Soorenar map labels are spaced apart", () => {
  const cimbar = gameData.cities.cimbar.map;
  const soorenar = gameData.cities.soorenar.map;

  assert.ok(
    Math.abs(cimbar.x - soorenar.x) >= 8,
    "Cimbar and Soorenar need enough horizontal separation for map labels"
  );
  assert.ok(
    Math.abs(cimbar.y - soorenar.y) >= 15,
    "Cimbar and Soorenar need enough vertical separation for map labels"
  );
});

test("Velprintalar and Eltabbar map labels are spaced apart", () => {
  const velprintalar = gameData.cities.velprintalar.map;
  const eltabbar = gameData.cities.eltabbar.map;

  assert.ok(
    Math.abs(velprintalar.x - eltabbar.x) >= 12,
    "Velprintalar and Eltabbar need enough horizontal separation for map labels"
  );
  assert.ok(
    Math.abs(velprintalar.y - eltabbar.y) >= 15,
    "Velprintalar and Eltabbar need enough vertical separation for map labels"
  );
});
