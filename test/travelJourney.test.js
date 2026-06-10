import assert from "node:assert/strict";
import test from "node:test";
import {
  journeyDurationMs,
  vignetteForProgress,
  journeyStage
} from "../public/travelJourney.js";
import { gameData } from "../src/gameData.js";

test("journeyDurationMs clamps to the configured range", () => {
  // Very short route clamps up to the minimum.
  assert.equal(journeyDurationMs(10), 15000);
  // Very long route clamps down to the maximum.
  assert.equal(journeyDurationMs(5000), 30000);
  // Mid-range scales between the bounds.
  const mid = journeyDurationMs(520);
  assert.ok(mid > 15000 && mid < 30000, `expected mid-range duration, got ${mid}`);
});

test("journeyDurationMs is monotonic in mileage", () => {
  assert.ok(journeyDurationMs(260) <= journeyDurationMs(430));
  assert.ok(journeyDurationMs(430) <= journeyDurationMs(780));
});

test("real routes map to the intended ~15s..25s feel", () => {
  assert.equal(journeyDurationMs(260), 15000); // shortest route -> 15s (floor)
  assert.equal(journeyDurationMs(780), 24960); // longest route -> ~25s
});

test("vignetteForProgress returns first at 0 and last at 1", () => {
  const v = ["a", "b", "c"];
  assert.equal(vignetteForProgress(v, 0), "a");
  assert.equal(vignetteForProgress(v, 0.5), "b");
  assert.equal(vignetteForProgress(v, 1), "c");
});

test("vignetteForProgress is safe at the edges and for empty input", () => {
  const v = ["a", "b", "c"];
  assert.equal(vignetteForProgress(v, -1), "a");
  assert.equal(vignetteForProgress(v, 2), "c");
  assert.equal(vignetteForProgress([], 0.5), "");
});

test("journeyStage labels the journey phases", () => {
  assert.equal(journeyStage(0), "Setting out");
  assert.equal(journeyStage(0.5), "On the road");
  assert.equal(journeyStage(1), "Nearing the gates");
});

test("every travel route has journey lore with at least three vignettes", () => {
  const routes = Object.entries(gameData.travelRoutes);
  assert.ok(routes.length > 0);
  for (const [key, route] of routes) {
    assert.ok(route.journey, `${key} is missing journey lore`);
    assert.ok(
      typeof route.journey.terrain === "string" && route.journey.terrain.length > 0,
      `${key} journey needs a terrain descriptor`
    );
    assert.ok(
      Array.isArray(route.journey.vignettes) && route.journey.vignettes.length >= 3,
      `${key} journey needs at least three vignettes`
    );
    for (const vignette of route.journey.vignettes) {
      assert.ok(
        typeof vignette === "string" && vignette.length >= 30,
        `${key} has a too-short journey vignette`
      );
    }
  }
});
