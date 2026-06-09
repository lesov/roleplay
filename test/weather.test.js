import assert from "node:assert/strict";
import test from "node:test";
import {
  getWeather,
  describeWeather,
  seasonForDayOfYear,
  knownRegions
} from "../public/weather.js";
import { gameData } from "../src/gameData.js";

const YEAR = 1497; // non-leap reference year

function regionsInPlay() {
  return [...new Set(Object.values(gameData.cities).map((city) => city.region))];
}

// Collect every weather result for a region across a whole year.
function yearOfWeather(regionId, year = YEAR) {
  const out = [];
  for (let dayOfYear = 1; dayOfYear <= 365; dayOfYear += 1) {
    out.push({ dayOfYear, weather: getWeather({ regionId, year, dayOfYear }) });
  }
  return out;
}

test("weather is deterministic for the same region/year/day", () => {
  const a = getWeather({ regionId: "Chessenta", year: 1496, dayOfYear: 120 });
  const b = getWeather({ regionId: "Chessenta", year: 1496, dayOfYear: 120 });
  assert.deepEqual(a, b);
});

test("weather changes from day to day within a season", () => {
  // Summer in Chessenta: gather distinct conditions across the season's days.
  const conditions = new Set();
  for (const { weather } of yearOfWeather("Chessenta")) {
    if (weather.season === "summer") conditions.add(weather.condition.id);
  }
  assert.ok(conditions.size > 1, "a season should produce more than one condition");
});

test("every region in gameData has a dedicated climate profile", () => {
  for (const region of regionsInPlay()) {
    assert.ok(knownRegions.includes(region), `no climate profile for region "${region}"`);
  }
});

test("every region yields well-formed weather all year", () => {
  for (const region of regionsInPlay()) {
    for (const { weather } of yearOfWeather(region)) {
      assert.ok(weather.condition.id && weather.condition.label, `${region} bad condition`);
      assert.ok(weather.temperature.id && weather.temperature.label, `${region} bad temperature`);
      assert.ok(weather.wind.id && weather.wind.label, `${region} bad wind`);
      assert.equal(typeof weather.precipitation, "boolean");
      assert.ok(weather.description.length > 10, `${region} weak description`);
      assert.ok(["winter", "spring", "summer", "autumn"].includes(weather.season));
    }
  }
});

test("Chessenta summers are hot and never snow (Mediterranean lore)", () => {
  const summer = yearOfWeather("Chessenta").filter(({ weather }) => weather.season === "summer");
  assert.ok(summer.length > 0);
  assert.equal(
    summer.some(({ weather }) => weather.condition.id === "snow"),
    false,
    "Chessenta should never snow in summer"
  );
  assert.ok(
    summer.some(({ weather }) => ["hot", "sweltering"].includes(weather.temperature.id)),
    "Chessenta summers should trend hot"
  );
});

test("Cormyr winters can snow and trend cold (continental lore)", () => {
  const winter = yearOfWeather("Cormyr").filter(({ weather }) => weather.season === "winter");
  assert.ok(
    winter.some(({ weather }) => weather.condition.id === "snow"),
    "Cormyr should see snow in winter"
  );
  assert.ok(
    winter.some(({ weather }) => ["cold", "frigid"].includes(weather.temperature.id)),
    "Cormyr winters should trend cold"
  );
});

test("Thay shows its signature ashen haze", () => {
  const seen = yearOfWeather("Thay").some(({ weather }) => weather.condition.id === "ash-haze");
  assert.ok(seen, "Thay should produce ashen haze");
});

test("seasonForDayOfYear maps Harptos dates correctly", () => {
  assert.equal(seasonForDayOfYear(YEAR, 1), "winter"); // Hammer 1
  assert.equal(seasonForDayOfYear(YEAR, 153), "summer"); // Kythorn 1
  assert.equal(seasonForDayOfYear(YEAR, 336), "winter"); // Nightal 1
  // Shieldmeet (leap) year still classifies a mid-Flamerule day as summer
  assert.equal(seasonForDayOfYear(1496, 200), "summer");
});

test("describeWeather produces a readable sentence", () => {
  const weather = getWeather({ regionId: "Sembia", year: YEAR, dayOfYear: 350 });
  const sentence = describeWeather(weather, "the northern wharves");
  assert.match(sentence, /the northern wharves/);
  assert.match(sentence, /\.$/);
});

test("unknown regions fall back to a valid default climate", () => {
  const weather = getWeather({ regionId: "Nowhere", year: YEAR, dayOfYear: 50 });
  assert.ok(weather.condition.label && weather.temperature.label && weather.wind.label);
});
