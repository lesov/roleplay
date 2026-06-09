// Pure, deterministic regional weather for the Sea of Fallen Stars.
//
// Weather is a function of (regionId, year, dayOfYear): the same day always
// yields the same weather (reproducible and consistent), but it varies from one
// day to the next, weighted by the region's lore-climate and the Harptos
// season. No persisted state, no Math.random, no imports — mirrors the pure
// client-module pattern of public/routeSafety.js (imported by app.js and tests).

// ---- Calendar of Harptos: month + season from day-of-year ----
// Self-contained (does not import time.js). Each month is 30 days; the festival
// days that follow certain months are folded into the preceding month for
// season purposes.

const MONTHS = [
  "Hammer", "Alturiak", "Ches", "Tarsakh", "Mirtul", "Kythorn",
  "Flamerule", "Eleasis", "Eleint", "Marpenoth", "Uktar", "Nightal"
];
const FESTIVALS_AFTER_MONTH = {
  Hammer: 1, Tarsakh: 1, Flamerule: 1, Eleint: 1, Uktar: 1
};
const MONTH_SEASON = {
  Hammer: "winter", Alturiak: "winter", Nightal: "winter",
  Ches: "spring", Tarsakh: "spring", Mirtul: "spring",
  Kythorn: "summer", Flamerule: "summer", Eleasis: "summer",
  Eleint: "autumn", Marpenoth: "autumn", Uktar: "autumn"
};

function isShieldmeetYear(year) {
  return year % 4 === 0;
}

export function monthForDayOfYear(year, dayOfYear) {
  let cursor = 0;
  for (const month of MONTHS) {
    let span = 30 + (FESTIVALS_AFTER_MONTH[month] || 0);
    if (month === "Flamerule" && isShieldmeetYear(year)) {
      span += 1; // Shieldmeet
    }
    if (dayOfYear <= cursor + span) {
      return month;
    }
    cursor += span;
  }
  return MONTHS[MONTHS.length - 1];
}

export function seasonForDayOfYear(year, dayOfYear) {
  return MONTH_SEASON[monthForDayOfYear(year, dayOfYear)];
}

// ---- Deterministic PRNG (xmur3 seed -> mulberry32 stream) ----

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(seedString) {
  return mulberry32(xmur3(seedString)());
}

function weightedPick(rng, pairs) {
  const total = pairs.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [value, weight] of pairs) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return pairs[pairs.length - 1][0];
}

// ---- Vocabulary ----

const CONDITION_LABELS = {
  clear: "Clear",
  fair: "Fair",
  cloudy: "Cloudy",
  overcast: "Overcast",
  rain: "Rain",
  storm: "Storm",
  fog: "Fog",
  "sea-mist": "Sea Mist",
  snow: "Snow",
  sleet: "Sleet",
  "heat-haze": "Heat Haze",
  "ash-haze": "Ashen Haze"
};

const PRECIPITATION = new Set(["rain", "storm", "snow", "sleet"]);

const TEMP_LABELS = {
  frigid: "Frigid", cold: "Cold", cool: "Cool", mild: "Mild",
  warm: "Warm", hot: "Hot", sweltering: "Sweltering"
};

const WIND_LABELS = {
  still: "Still", breezy: "Breezy", brisk: "Brisk", windy: "Windy", gale: "Gale"
};

const CONDITION_PHRASES = {
  clear: "Clear skies stretch over",
  fair: "Fair weather settles over",
  cloudy: "Drifting clouds shade",
  overcast: "A grey overcast hangs above",
  rain: "Steady rain falls across",
  storm: "A storm lashes",
  fog: "Thick fog smothers",
  "sea-mist": "Sea mist rolls across",
  snow: "Snow settles over",
  sleet: "Cold sleet rakes",
  "heat-haze": "A shimmering heat-haze blurs",
  "ash-haze": "A pall of ash hazes the air over"
};

const TEMP_PHRASES = {
  frigid: "The air is bitterly cold",
  cold: "It is cold",
  cool: "The air is cool",
  mild: "The air is mild",
  warm: "It is pleasantly warm",
  hot: "The heat lies heavy",
  sweltering: "The heat is sweltering"
};

const WIND_CLAUSES = {
  still: "with barely a breath of wind",
  breezy: "on a light breeze",
  brisk: "on a brisk wind",
  windy: "under a steady wind",
  gale: "amid gale-force winds"
};

// ---- Region climates (lore-grounded; see codex_inner_sea_1496DR.md) ----
// Each season lists weighted [id, weight] pairs for conditions / temps / winds.

const REGION_CLIMATES = {
  Chessenta: {
    scenery: ["the marble courts of Chessenta", "the sun-bleached colonnades", "the dueling-yards and harbors"],
    seasons: {
      summer: {
        conditions: [["clear", 50], ["fair", 25], ["heat-haze", 15], ["cloudy", 7], ["storm", 3]],
        temps: [["hot", 45], ["sweltering", 35], ["warm", 20]],
        winds: [["breezy", 40], ["still", 25], ["brisk", 25], ["windy", 10]]
      },
      autumn: {
        conditions: [["clear", 30], ["fair", 25], ["cloudy", 20], ["rain", 18], ["storm", 7]],
        temps: [["warm", 45], ["mild", 40], ["hot", 15]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      },
      winter: {
        conditions: [["fair", 25], ["clear", 20], ["cloudy", 20], ["rain", 20], ["overcast", 12], ["storm", 3]],
        temps: [["mild", 45], ["cool", 40], ["cold", 15]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      },
      spring: {
        conditions: [["clear", 30], ["fair", 30], ["cloudy", 20], ["rain", 15], ["heat-haze", 5]],
        temps: [["warm", 40], ["mild", 45], ["cool", 15]],
        winds: [["breezy", 40], ["brisk", 30], ["still", 20], ["windy", 10]]
      }
    }
  },
  "Vilhon Reach": {
    scenery: ["the humid quays of Arrabar", "the temple-roofs of the Vilhon", "the green Reach shoreline"],
    seasons: {
      summer: {
        conditions: [["fair", 25], ["cloudy", 25], ["rain", 20], ["storm", 15], ["sea-mist", 10], ["clear", 5]],
        temps: [["hot", 45], ["sweltering", 30], ["warm", 25]],
        winds: [["still", 35], ["breezy", 35], ["brisk", 20], ["windy", 10]]
      },
      autumn: {
        conditions: [["rain", 25], ["cloudy", 22], ["fair", 20], ["storm", 12], ["sea-mist", 13], ["clear", 8]],
        temps: [["warm", 45], ["mild", 30], ["hot", 25]],
        winds: [["breezy", 35], ["still", 30], ["brisk", 25], ["windy", 10]]
      },
      winter: {
        conditions: [["rain", 30], ["overcast", 25], ["cloudy", 20], ["sea-mist", 15], ["fair", 10]],
        temps: [["cool", 45], ["mild", 40], ["cold", 15]],
        winds: [["breezy", 35], ["brisk", 30], ["still", 20], ["windy", 15]]
      },
      spring: {
        conditions: [["rain", 25], ["cloudy", 25], ["fair", 20], ["sea-mist", 15], ["clear", 10], ["storm", 5]],
        temps: [["warm", 45], ["mild", 40], ["hot", 15]],
        winds: [["breezy", 40], ["still", 30], ["brisk", 20], ["windy", 10]]
      }
    }
  },
  Sembia: {
    scenery: ["Selgaunt's crowded harbor", "the counting-houses of Sembia", "the northern wharves"],
    seasons: {
      summer: {
        conditions: [["fair", 30], ["cloudy", 25], ["clear", 20], ["rain", 15], ["sea-mist", 10]],
        temps: [["warm", 45], ["mild", 40], ["hot", 15]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      },
      autumn: {
        conditions: [["cloudy", 25], ["overcast", 22], ["rain", 22], ["fog", 15], ["fair", 16]],
        temps: [["cool", 50], ["cold", 25], ["mild", 25]],
        winds: [["windy", 30], ["brisk", 30], ["breezy", 25], ["gale", 15]]
      },
      winter: {
        conditions: [["overcast", 28], ["cloudy", 20], ["rain", 18], ["snow", 12], ["sleet", 8], ["fog", 8], ["fair", 6]],
        temps: [["cold", 50], ["cool", 30], ["frigid", 20]],
        winds: [["windy", 30], ["brisk", 30], ["breezy", 25], ["gale", 15]]
      },
      spring: {
        conditions: [["cloudy", 28], ["fair", 25], ["rain", 22], ["sea-mist", 12], ["clear", 13]],
        temps: [["cool", 50], ["mild", 40], ["warm", 10]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      }
    }
  },
  Cormyr: {
    scenery: ["Suzail's ordered streets", "the eaves of the King's Forest", "the purple banners of Cormyr"],
    seasons: {
      summer: {
        conditions: [["clear", 30], ["fair", 30], ["cloudy", 18], ["rain", 15], ["storm", 7]],
        temps: [["warm", 50], ["mild", 25], ["hot", 25]],
        winds: [["breezy", 40], ["brisk", 30], ["still", 20], ["windy", 10]]
      },
      autumn: {
        conditions: [["cloudy", 26], ["fair", 24], ["rain", 22], ["fog", 14], ["overcast", 14]],
        temps: [["cool", 50], ["cold", 25], ["mild", 25]],
        winds: [["brisk", 35], ["windy", 30], ["breezy", 25], ["gale", 10]]
      },
      winter: {
        conditions: [["snow", 30], ["overcast", 22], ["cloudy", 18], ["sleet", 12], ["fair", 10], ["fog", 8]],
        temps: [["cold", 50], ["frigid", 35], ["cool", 15]],
        winds: [["brisk", 35], ["windy", 30], ["still", 20], ["gale", 15]]
      },
      spring: {
        conditions: [["fair", 28], ["cloudy", 25], ["rain", 22], ["clear", 18], ["sea-mist", 7]],
        temps: [["cool", 45], ["mild", 45], ["warm", 10]],
        winds: [["breezy", 40], ["brisk", 30], ["windy", 20], ["still", 10]]
      }
    }
  },
  Aglarond: {
    scenery: ["the misted pinewoods of Aglarond", "Velprintalar's watchtowers", "the peninsula's wet shore"],
    seasons: {
      summer: {
        conditions: [["fair", 28], ["cloudy", 25], ["rain", 20], ["sea-mist", 15], ["clear", 12]],
        temps: [["warm", 40], ["mild", 45], ["cool", 15]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      },
      autumn: {
        conditions: [["fog", 25], ["rain", 24], ["cloudy", 23], ["overcast", 16], ["fair", 12]],
        temps: [["cool", 55], ["cold", 25], ["mild", 20]],
        winds: [["windy", 30], ["brisk", 30], ["breezy", 25], ["gale", 15]]
      },
      winter: {
        conditions: [["overcast", 25], ["rain", 22], ["fog", 18], ["snow", 14], ["sleet", 12], ["cloudy", 9]],
        temps: [["cold", 50], ["cool", 35], ["frigid", 15]],
        winds: [["windy", 30], ["brisk", 30], ["gale", 20], ["breezy", 20]]
      },
      spring: {
        conditions: [["rain", 25], ["fog", 22], ["cloudy", 22], ["fair", 18], ["clear", 13]],
        temps: [["cool", 55], ["mild", 35], ["warm", 10]],
        winds: [["breezy", 35], ["brisk", 30], ["windy", 25], ["still", 10]]
      }
    }
  },
  Thay: {
    scenery: ["Eltabbar's guarded canals", "the red-tiled roofs of Thay", "the ash-grey Thayan sky"],
    seasons: {
      summer: {
        conditions: [["ash-haze", 30], ["heat-haze", 22], ["clear", 18], ["fair", 15], ["cloudy", 10], ["storm", 5]],
        temps: [["sweltering", 40], ["hot", 45], ["warm", 15]],
        winds: [["still", 40], ["breezy", 25], ["brisk", 20], ["windy", 15]]
      },
      autumn: {
        conditions: [["ash-haze", 28], ["cloudy", 22], ["fair", 20], ["heat-haze", 15], ["clear", 10], ["rain", 5]],
        temps: [["warm", 45], ["hot", 30], ["mild", 25]],
        winds: [["still", 35], ["breezy", 30], ["brisk", 20], ["windy", 15]]
      },
      winter: {
        conditions: [["ash-haze", 25], ["overcast", 22], ["cloudy", 20], ["fair", 15], ["rain", 12], ["fog", 6]],
        temps: [["cool", 40], ["mild", 40], ["cold", 20]],
        winds: [["breezy", 30], ["still", 30], ["brisk", 25], ["windy", 15]]
      },
      spring: {
        conditions: [["ash-haze", 25], ["fair", 22], ["cloudy", 20], ["heat-haze", 13], ["clear", 12], ["rain", 8]],
        temps: [["warm", 50], ["hot", 25], ["mild", 25]],
        winds: [["still", 35], ["breezy", 30], ["brisk", 20], ["windy", 15]]
      }
    }
  }
};

const DEFAULT_CLIMATE = {
  scenery: ["the lands hereabouts", "the road ahead", "the open country"],
  seasons: {
    summer: {
      conditions: [["clear", 35], ["fair", 30], ["cloudy", 20], ["rain", 15]],
      temps: [["warm", 50], ["mild", 30], ["hot", 20]],
      winds: [["breezy", 40], ["brisk", 30], ["still", 20], ["windy", 10]]
    },
    autumn: {
      conditions: [["cloudy", 30], ["fair", 25], ["rain", 25], ["fog", 10], ["overcast", 10]],
      temps: [["cool", 45], ["mild", 35], ["cold", 20]],
      winds: [["brisk", 35], ["breezy", 30], ["windy", 25], ["still", 10]]
    },
    winter: {
      conditions: [["overcast", 28], ["cloudy", 22], ["rain", 20], ["snow", 15], ["fair", 15]],
      temps: [["cold", 50], ["cool", 30], ["frigid", 20]],
      winds: [["windy", 30], ["brisk", 30], ["breezy", 25], ["gale", 15]]
    },
    spring: {
      conditions: [["fair", 30], ["cloudy", 25], ["rain", 25], ["clear", 20]],
      temps: [["cool", 45], ["mild", 45], ["warm", 10]],
      winds: [["breezy", 40], ["brisk", 30], ["windy", 20], ["still", 10]]
    }
  }
};

export const knownRegions = Object.keys(REGION_CLIMATES);

export function climateForRegion(regionId) {
  return REGION_CLIMATES[regionId] || DEFAULT_CLIMATE;
}

export function describeWeather(weather, scenery) {
  const condition = CONDITION_PHRASES[weather.condition.id] || "The weather lies over";
  const temp = TEMP_PHRASES[weather.temperature.id] || "The air is unremarkable";
  const wind = WIND_CLAUSES[weather.wind.id] || "with little wind";
  return `${condition} ${scenery}. ${temp} ${wind}.`;
}

// Main entry point. Deterministic for a given (regionId, year, dayOfYear).
export function getWeather({ regionId, year, dayOfYear }) {
  const season = seasonForDayOfYear(year, dayOfYear);
  const climate = climateForRegion(regionId);
  const profile = climate.seasons[season];
  const rng = makeRng(`${regionId}|${year}|${dayOfYear}`);

  const conditionId = weightedPick(rng, profile.conditions);
  const tempId = weightedPick(rng, profile.temps);
  const windId = weightedPick(rng, profile.winds);
  const scenery = climate.scenery[Math.floor(rng() * climate.scenery.length)];

  const weather = {
    regionId,
    season,
    condition: { id: conditionId, label: CONDITION_LABELS[conditionId] },
    temperature: { id: tempId, label: TEMP_LABELS[tempId] },
    wind: { id: windId, label: WIND_LABELS[windId] },
    precipitation: PRECIPITATION.has(conditionId)
  };
  weather.description = describeWeather(weather, scenery);
  return weather;
}
