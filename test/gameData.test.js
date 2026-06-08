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

test("every city has complete tavern and innkeeper dialogue data", () => {
  for (const city of Object.values(gameData.cities)) {
    assert.ok(city.name, `${city.id} is missing a name`);
    assert.ok(city.description, `${city.id} is missing a description`);
    assert.ok(city.tavern?.name, `${city.id} is missing a tavern name`);
    assert.ok(city.tavern?.innkeeper, `${city.id} is missing an innkeeper`);
    assert.ok(city.tavern?.intro, `${city.id} is missing a tavern intro`);

    for (const topic of requiredTopics) {
      assert.ok(
        city.tavern.dialogue?.[topic],
        `${city.id} is missing ${topic} dialogue`
      );
    }
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

test("all dialogue topic labels are represented in required topics", () => {
  assert.deepEqual(Object.keys(gameData.topicLabels), requiredTopics);
});

test("Baldur's Gate and Elturel map labels are spaced apart", () => {
  const baldursGate = gameData.cities["baldurs-gate"].map;
  const elturel = gameData.cities.elturel.map;

  assert.ok(
    Math.abs(baldursGate.x - elturel.x) >= 35,
    "Baldur's Gate and Elturel need enough horizontal separation for map labels"
  );
  assert.ok(
    Math.abs(baldursGate.y - elturel.y) >= 10,
    "Baldur's Gate and Elturel need enough vertical separation for map labels"
  );
});
