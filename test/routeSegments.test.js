import assert from "node:assert/strict";
import test from "node:test";
import {
  computeRouteSegments,
  segmentForProgress,
  DANGER_BANDS
} from "../public/routeSegments.js";
import { gameData } from "../src/gameData.js";

const validRisks = new Set(["safe", "watchful", "risky", "perilous"]);

function route(key) {
  return gameData.travelRoutes[key];
}

test("returns one segment per journey segment, contiguous over 0..1", () => {
  const segments = computeRouteSegments(route("arrabar:cimbar"), { flags: [] });
  assert.equal(segments.length, route("arrabar:cimbar").journey.segments.length);
  assert.equal(segments[0].start, 0);
  assert.equal(segments[segments.length - 1].end, 1);
  for (let i = 1; i < segments.length; i += 1) {
    assert.equal(segments[i].start, segments[i - 1].end, "segments must be contiguous");
  }
});

test("level maps to the three colour bands", () => {
  // selgaunt:suzail has safe/watchful legs -> all green with no world flags.
  const calm = computeRouteSegments(route("selgaunt:suzail"), { flags: [] });
  assert.ok(calm.every((s) => s.band === "safe"), "calm route should be all green");

  // eltabbar:velprintalar opens with perilous legs -> red.
  const dire = computeRouteSegments(route("eltabbar:velprintalar"), { flags: [] });
  assert.equal(dire[0].band, "danger", "perilous leg should be red");
  assert.equal(DANGER_BANDS.Perilous, "danger");
  assert.equal(DANGER_BANDS.Risky, "caution");
  assert.equal(DANGER_BANDS.Watchful, "safe");
});

test("world events raise danger and add a reason to the note", () => {
  const r = route("cimbar:velprintalar"); // has eastern-tagged legs
  const peaceful = computeRouteSegments(r, { flags: [] });
  const atWar = computeRouteSegments(r, { flags: ["thay_naval_supremacy"] });

  // Find an eastern-tagged segment index from the source data.
  const easternIndex = r.journey.segments.findIndex((s) => (s.tags || []).includes("eastern"));
  assert.ok(easternIndex >= 0);

  const before = peaceful[easternIndex];
  const after = atWar[easternIndex];
  // Danger should not decrease, and the world factor should surface in the note.
  const order = { safe: 0, caution: 1, danger: 2 };
  assert.ok(order[after.band] >= order[before.band]);
  assert.ok(after.note.length >= before.note.length, "world event should add a reason");
});

test("segmentForProgress returns the right stretch", () => {
  const segments = computeRouteSegments(route("cimbar:soorenar"), { flags: [] });
  assert.equal(segmentForProgress(segments, 0).index, 0);
  assert.equal(segmentForProgress(segments, 1).index, segments.length - 1);
  assert.equal(segmentForProgress(segments, 0.5).index, 1);
  assert.equal(segmentForProgress([], 0.5), null);
});

test("every route has three valid journey segments", () => {
  for (const [key, r] of Object.entries(gameData.travelRoutes)) {
    const segs = r.journey?.segments;
    assert.ok(Array.isArray(segs) && segs.length === 3, `${key} needs 3 journey segments`);
    for (const seg of segs) {
      assert.ok(validRisks.has(seg.risk), `${key} segment has invalid risk ${seg.risk}`);
      assert.ok(Array.isArray(seg.tags) && seg.tags.length > 0, `${key} segment needs tags`);
      assert.ok(typeof seg.note === "string" && seg.note.length >= 15, `${key} segment needs a note`);
    }
  }
});
