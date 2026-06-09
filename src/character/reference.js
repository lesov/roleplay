// Shared SRD reference data: abilities, skills, alignments, languages, and the
// ability-score generation methods. Kept dependency-free so every other
// character module and the pure builder can rely on it.

export const abilities = [
  { id: "str", label: "Strength" },
  { id: "dex", label: "Dexterity" },
  { id: "con", label: "Constitution" },
  { id: "int", label: "Intelligence" },
  { id: "wis", label: "Wisdom" },
  { id: "cha", label: "Charisma" }
];

export const abilityIds = abilities.map((ability) => ability.id);

// The 18 SRD skills, each tied to its governing ability.
export const skills = [
  { id: "acrobatics", label: "Acrobatics", ability: "dex" },
  { id: "animal-handling", label: "Animal Handling", ability: "wis" },
  { id: "arcana", label: "Arcana", ability: "int" },
  { id: "athletics", label: "Athletics", ability: "str" },
  { id: "deception", label: "Deception", ability: "cha" },
  { id: "history", label: "History", ability: "int" },
  { id: "insight", label: "Insight", ability: "wis" },
  { id: "intimidation", label: "Intimidation", ability: "cha" },
  { id: "investigation", label: "Investigation", ability: "int" },
  { id: "medicine", label: "Medicine", ability: "wis" },
  { id: "nature", label: "Nature", ability: "int" },
  { id: "perception", label: "Perception", ability: "wis" },
  { id: "performance", label: "Performance", ability: "cha" },
  { id: "persuasion", label: "Persuasion", ability: "cha" },
  { id: "religion", label: "Religion", ability: "int" },
  { id: "sleight-of-hand", label: "Sleight of Hand", ability: "dex" },
  { id: "stealth", label: "Stealth", ability: "dex" },
  { id: "survival", label: "Survival", ability: "wis" }
];

export const skillIds = skills.map((skill) => skill.id);

export const alignments = [
  { id: "lawful-good", label: "Lawful Good" },
  { id: "neutral-good", label: "Neutral Good" },
  { id: "chaotic-good", label: "Chaotic Good" },
  { id: "lawful-neutral", label: "Lawful Neutral" },
  { id: "true-neutral", label: "True Neutral" },
  { id: "chaotic-neutral", label: "Chaotic Neutral" },
  { id: "lawful-evil", label: "Lawful Evil" },
  { id: "neutral-evil", label: "Neutral Evil" },
  { id: "chaotic-evil", label: "Chaotic Evil" }
];

export const languages = [
  { id: "common", label: "Common" },
  { id: "dwarvish", label: "Dwarvish" },
  { id: "elvish", label: "Elvish" },
  { id: "giant", label: "Giant" },
  { id: "gnomish", label: "Gnomish" },
  { id: "goblin", label: "Goblin" },
  { id: "halfling", label: "Halfling" },
  { id: "orc", label: "Orc" },
  { id: "abyssal", label: "Abyssal" },
  { id: "celestial", label: "Celestial" },
  { id: "draconic", label: "Draconic" },
  { id: "deep-speech", label: "Deep Speech" },
  { id: "infernal", label: "Infernal" },
  { id: "primordial", label: "Primordial" },
  { id: "sylvan", label: "Sylvan" },
  { id: "undercommon", label: "Undercommon" }
];

// Ability-score generation methods offered in the wizard.
export const abilityScoreMethods = {
  // Standard array: fixed set the player assigns to the six abilities.
  standardArray: {
    id: "standard-array",
    label: "Standard Array",
    values: [15, 14, 13, 12, 10, 8]
  },
  // Point buy: every score starts at 8; the cost table below is spent from a
  // 27-point budget. Scores are bounded to 8..15 before racial increases.
  pointBuy: {
    id: "point-buy",
    label: "Point Buy",
    budget: 27,
    min: 8,
    max: 15,
    costByScore: { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 }
  },
  // Rolled: 4d6 drop lowest, six times. The client rolls; values are validated
  // to the plausible 3..18 range on build.
  roll: {
    id: "roll",
    label: "Roll (4d6 drop lowest)",
    dice: 4,
    sides: 6,
    drop: 1,
    count: 6,
    min: 3,
    max: 18
  }
};
