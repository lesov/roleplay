// Pure, dependency-free helpers for the travel journey popup. No DOM, no
// Math.random — same client-module pattern as public/weather.js, imported by
// public/app.js (for the animation) and by test/travelJourney.test.js.

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Real-time length of the journey animation, proportional to route mileage and
// clamped to a comfortable range. Paced slow enough to read the en-route lore
// (each trip shows 3 vignettes, so duration/3 per vignette). The player can
// always "Skip ahead". Defaults: 260 mi -> ~15s, 520 mi -> ~17s, 780 mi -> ~25s.
export function journeyDurationMs(miles, options = {}) {
  const { msPerMile = 32, min = 15000, max = 30000 } = options;
  return clamp(Math.round((Number(miles) || 0) * msPerMile), min, max);
}

// Pick the en-route vignette for a 0..1 progress value by splitting the trip
// into equal stages across the vignette array.
export function vignetteForProgress(vignettes, progress) {
  if (!Array.isArray(vignettes) || vignettes.length === 0) {
    return "";
  }
  const p = clamp(Number(progress) || 0, 0, 1);
  const index = Math.min(vignettes.length - 1, Math.floor(p * vignettes.length));
  return vignettes[index];
}

// Short eyebrow label describing where in the journey the traveler is.
export function journeyStage(progress) {
  const p = clamp(Number(progress) || 0, 0, 1);
  if (p < 0.34) return "Setting out";
  if (p < 0.85) return "On the road";
  return "Nearing the gates";
}
