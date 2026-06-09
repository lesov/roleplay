const BASE_RISK_SCORES = {
  safe: 18,
  watchful: 34,
  risky: 58,
  perilous: 82
};

const LEVELS = [
  { max: 25, level: "Safe" },
  { max: 49, level: "Watchful" },
  { max: 74, level: "Risky" },
  { max: 100, level: "Perilous" }
];

const WORLD_FACTORS = [
  {
    flag: "western_wars_stirring",
    tags: ["southern", "trade"],
    risk: 4,
    text: "nervous courts make trade roads tense"
  },
  {
    flag: "first_great_war_active",
    tags: ["southern", "trade"],
    risk: 8,
    text: "war contracts pull guards away from the roads"
  },
  {
    flag: "second_great_war_active",
    tags: ["southern", "trade"],
    risk: 12,
    text: "open war makes southern travel unpredictable"
  },
  {
    flag: "great_schism_active",
    tags: ["religious", "pilgrim"],
    risk: 8,
    text: "religious arguments follow the pilgrim roads"
  },
  {
    flag: "arrabar_sacked",
    tags: ["religious", "pilgrim"],
    risk: 12,
    text: "the sack of Arrabar has shaken faithful travelers"
  },
  {
    flag: "thay_seizes_eastern_ports",
    tags: ["trade", "coastal"],
    risk: 3,
    text: "eastern losses make merchants more guarded"
  },
  {
    flag: "thay_naval_supremacy",
    tags: ["trade", "coastal"],
    risk: 6,
    text: "sea raids push more desperate traffic onto the roads"
  },
  {
    flag: "impious_pact_revealed",
    tags: ["religious", "southern"],
    risk: 8,
    text: "scandal and suspicion make strangers less welcome"
  }
];

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function levelForScore(score) {
  return LEVELS.find((level) => score <= level.max).level;
}

function hasRouteTag(route, factor) {
  const routeTags = route.safetyTags || [];
  return factor.tags.some((tag) => routeTags.includes(tag));
}

export function assessRouteSafety(route, worldState = {}) {
  const flags = new Set(worldState.flags || []);
  const factors = [];
  let score = BASE_RISK_SCORES[route.baseRisk] ?? BASE_RISK_SCORES.watchful;

  for (const hazard of route.hazards || []) {
    factors.push(hazard);
  }

  for (const factor of WORLD_FACTORS) {
    if (!flags.has(factor.flag) || !hasRouteTag(route, factor)) {
      continue;
    }

    score += factor.risk;
    factors.push(factor.text);
  }

  const finalScore = clampScore(score);
  const level = levelForScore(finalScore);

  return {
    level,
    score: finalScore,
    summary: route.safeSummary,
    factors
  };
}
