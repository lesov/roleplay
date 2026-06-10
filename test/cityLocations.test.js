import assert from "node:assert/strict";
import test from "node:test";
import { gameData } from "../src/gameData.js";

const KEBAB = /^[a-z][a-z0-9-]*$/;
const TAVERN_TOPICS = ["world", "rumors", "roads", "local"];

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
      assert.ok(location.contact?.name, `${city.id}/${location.id} missing contact name`);
      assert.ok(location.contact?.role, `${city.id}/${location.id} missing contact role`);
      assert.ok(location.contact?.intro, `${city.id}/${location.id} missing contact intro`);
      assert.ok(
        Object.keys(location.contact?.dialogue || {}).length > 0,
        `${city.id}/${location.id} missing contact dialogue`
      );
    }
  }
});

test("each city has one tavern location with rumor-capable dialogue", () => {
  for (const city of Object.values(gameData.cities)) {
    const taverns = city.locations.filter((location) => location.category === "Tavern");
    assert.equal(taverns.length, 1, `${city.id} should have exactly one tavern location`);

    for (const topic of TAVERN_TOPICS) {
      assert.ok(
        taverns[0].contact.dialogue[topic],
        `${city.id}/${taverns[0].id} missing ${topic} dialogue`
      );
    }
  }
});

test("each city has a market location", () => {
  for (const city of Object.values(gameData.cities)) {
    const markets = city.locations.filter((location) => location.category === "Market");
    assert.ok(markets.length >= 1, `${city.id} should have at least one market location`);
  }
});

test("non-tavern contacts explain their establishment", () => {
  for (const city of Object.values(gameData.cities)) {
    for (const location of city.locations.filter((entry) => entry.category !== "Tavern")) {
      assert.ok(
        location.contact.dialogue.establishment,
        `${city.id}/${location.id} missing establishment dialogue`
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
