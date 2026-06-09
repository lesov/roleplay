import assert from "node:assert/strict";
import test from "node:test";
import { gameData } from "../src/gameData.js";

const KEBAB = /^[a-z][a-z0-9-]*$/;

test("every city has a non-empty locations array", () => {
  for (const city of Object.values(gameData.cities)) {
    assert.ok(Array.isArray(city.locations), `${city.id} is missing locations`);
    assert.ok(city.locations.length > 0, `${city.id} has no locations`);
  }
});

test("every location has the required descriptive fields", () => {
  for (const city of Object.values(gameData.cities)) {
    for (const location of city.locations) {
      assert.ok(location.id && typeof location.id === "string", `${city.id} location missing id`);
      assert.ok(location.name && typeof location.name === "string", `${city.id}/${location.id} missing name`);
      assert.ok(
        location.category && typeof location.category === "string",
        `${city.id}/${location.id} missing category`
      );
      assert.ok(
        location.description && typeof location.description === "string",
        `${city.id}/${location.id} missing description`
      );
    }
  }
});

test("location ids are unique within a city and lowercase-kebab", () => {
  for (const city of Object.values(gameData.cities)) {
    const ids = city.locations.map((location) => location.id);
    assert.equal(new Set(ids).size, ids.length, `${city.id} has duplicate location ids`);
    for (const id of ids) {
      assert.ok(KEBAB.test(id), `${city.id} location id "${id}" is not lowercase-kebab`);
    }
  }
});

test("location descriptions are substantial (lore-rich)", () => {
  for (const city of Object.values(gameData.cities)) {
    for (const location of city.locations) {
      assert.ok(
        location.description.length >= 40,
        `${city.id}/${location.id} description is too short to be descriptive`
      );
    }
  }
});
