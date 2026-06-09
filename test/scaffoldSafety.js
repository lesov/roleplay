import assert from "node:assert/strict";

const forbiddenPresentationPatterns = [
  /\bFrance\b/i,
  /\bOttoman\b/i,
  /\bReformation\b/i,
  /\bPavia\b/i,
  /\bCharles V\b/i,
  /\bPope\b/i,
  /\bHabsburg\b/i,
  /\bValois\b/i,
  /\bPapacy\b/i,
  /\bSwiss\b/i,
  /\bVenice\b/i,
  /\bMilan\b/i,
  /\bNaples\b/i,
  /\bEngland\b/i,
  /\bCastile\b/i,
  /\bSpain\b/i,
  /\bMamluk\b/i,
  /\bBarbary\b/i,
  /\bAztec\b/i,
  /\bconquistador\b/i,
  /\bColumbus\b/i,
  /\bNew World\b/i,
  /\bsource_tag\b/i,
  /\breal:\b/i
];

export function assertNoScaffoldLeak(value) {
  const serialized = JSON.stringify(value);

  for (const pattern of forbiddenPresentationPatterns) {
    assert.equal(pattern.test(serialized), false, `Presentation payload leaks ${pattern}`);
  }
}
