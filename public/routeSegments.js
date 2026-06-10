// Pure helper that turns a route's authored journey segments into danger-banded
// stretches for the travel popup. Danger combines lore (each segment's base
// risk) with current world events: each segment is scored through the existing
// assessRouteSafety (public/routeSafety.js), so world-event flags raise the
// danger of the legs they touch with no duplicated logic and no edits there.
//
// This is the intended hook for future random events: an event will add danger
// to a segment exactly as a world flag does today.

import { assessRouteSafety } from "./routeSafety.js";

// The four safety levels collapse into three colour bands for the popup line.
export const DANGER_BANDS = {
  Safe: "safe", // green
  Watchful: "safe", // green
  Risky: "caution", // orange
  Perilous: "danger" // red
};

function clamp01(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

// Compute the coloured stretches for a route under the given world state.
// Returns [{ index, start, end, level, band, note }] spanning 0..1 contiguously.
export function computeRouteSegments(route, worldState = {}) {
  const segments = route?.journey?.segments || [];
  const count = segments.length;
  if (count === 0) {
    return [];
  }

  return segments.map((segment, index) => {
    const synthetic = {
      baseRisk: segment.risk,
      safetyTags: segment.tags || [],
      hazards: [],
      safeSummary: ""
    };
    const safety = assessRouteSafety(synthetic, worldState);
    const band = DANGER_BANDS[safety.level] || "caution";

    // Authored note, plus the strongest world-event reason when one applies so
    // orange/red stretches explain themselves.
    let note = segment.note || "";
    if (safety.factors.length > 0) {
      note = note ? `${note} — ${safety.factors[0]}` : safety.factors[0];
    }

    return {
      index,
      start: index / count,
      end: (index + 1) / count,
      level: safety.level,
      band,
      note
    };
  });
}

// The segment containing a 0..1 progress value (last segment at progress 1).
export function segmentForProgress(segments, progress) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return null;
  }
  const p = clamp01(progress);
  const index = Math.min(segments.length - 1, Math.floor(p * segments.length));
  return segments[index];
}
