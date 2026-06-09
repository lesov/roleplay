// SRD 5.1 races with subraces. Ability increases combine race + chosen subrace
// in the builder. Shapes:
//   abilityIncreases: { str: 2, ... }                          fixed bonuses
//   abilityChoices:  [{ amount: 1, count: 2, from: [...] }]    player-chosen
//   skillChoices:    { choose: n, from: [...] }                player-chosen
//   languageChoices: n                                         free language picks
// `from: "any"` on abilityChoices means any of the six abilities.

export const races = [
  {
    id: "human",
    label: "Human",
    size: "Medium",
    speed: 30,
    abilityIncreases: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    languages: ["common"],
    languageChoices: 1,
    traits: ["Versatile: +1 to every ability score."],
    subraces: []
  },
  {
    id: "dwarf",
    label: "Dwarf",
    size: "Medium",
    speed: 25,
    darkvision: 60,
    abilityIncreases: { con: 2 },
    languages: ["common", "dwarvish"],
    weaponProficiencies: ["battleaxe", "handaxe", "light-hammer", "warhammer"],
    traits: [
      "Darkvision 60 ft.",
      "Dwarven Resilience: advantage on saves vs. poison, resistance to poison damage.",
      "Stonecunning: proficiency bonus is doubled for History checks about stonework.",
      "Speed is not reduced by wearing heavy armor."
    ],
    subraces: [
      {
        id: "hill-dwarf",
        label: "Hill Dwarf",
        abilityIncreases: { wis: 1 },
        hpBonusPerLevel: 1,
        traits: ["Dwarven Toughness: +1 hit point per level."]
      },
      {
        id: "mountain-dwarf",
        label: "Mountain Dwarf",
        abilityIncreases: { str: 2 },
        traits: ["Dwarven Armor Training: proficiency with light and medium armor."]
      }
    ]
  },
  {
    id: "elf",
    label: "Elf",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    abilityIncreases: { dex: 2 },
    languages: ["common", "elvish"],
    skillProficiencies: ["perception"],
    traits: [
      "Darkvision 60 ft.",
      "Keen Senses: proficiency in Perception.",
      "Fey Ancestry: advantage vs. being charmed; magic can't put you to sleep.",
      "Trance: 4 hours of meditation replaces 8 hours of sleep."
    ],
    subraces: [
      {
        id: "high-elf",
        label: "High Elf",
        abilityIncreases: { int: 1 },
        weaponProficiencies: ["longsword", "shortsword", "shortbow", "longbow"],
        languageChoices: 1,
        traits: [
          "Elf Weapon Training.",
          "Cantrip: one wizard cantrip (Intelligence is the casting ability).",
          "Extra Language of your choice."
        ]
      },
      {
        id: "wood-elf",
        label: "Wood Elf",
        abilityIncreases: { wis: 1 },
        speed: 35,
        weaponProficiencies: ["longsword", "shortsword", "shortbow", "longbow"],
        traits: [
          "Elf Weapon Training.",
          "Fleet of Foot: base walking speed 35 ft.",
          "Mask of the Wild: can hide when lightly obscured by nature."
        ]
      },
      {
        id: "drow",
        label: "Drow",
        abilityIncreases: { cha: 1 },
        darkvision: 120,
        weaponProficiencies: ["rapier", "shortsword", "hand-crossbow"],
        traits: [
          "Superior Darkvision 120 ft.",
          "Sunlight Sensitivity: disadvantage on attacks/Perception in direct sunlight.",
          "Drow Magic: Dancing Lights cantrip (Charisma is the casting ability)."
        ]
      }
    ]
  },
  {
    id: "halfling",
    label: "Halfling",
    size: "Small",
    speed: 25,
    abilityIncreases: { dex: 2 },
    languages: ["common", "halfling"],
    traits: [
      "Lucky: reroll natural 1s on attack rolls, ability checks, and saves.",
      "Brave: advantage on saves vs. being frightened.",
      "Halfling Nimbleness: move through the space of larger creatures."
    ],
    subraces: [
      {
        id: "lightfoot",
        label: "Lightfoot",
        abilityIncreases: { cha: 1 },
        traits: ["Naturally Stealthy: can hide behind a creature one size larger."]
      },
      {
        id: "stout",
        label: "Stout",
        abilityIncreases: { con: 1 },
        traits: ["Stout Resilience: advantage vs. poison, resistance to poison damage."]
      }
    ]
  },
  {
    id: "dragonborn",
    label: "Dragonborn",
    size: "Medium",
    speed: 30,
    abilityIncreases: { str: 2, cha: 1 },
    languages: ["common", "draconic"],
    traits: [
      "Draconic Ancestry: choose a dragon type that sets your breath/resistance.",
      "Breath Weapon: exhale destructive energy (Dex or Con save, 2d6 at level 1).",
      "Damage Resistance to your ancestry's damage type."
    ],
    subraces: []
  },
  {
    id: "gnome",
    label: "Gnome",
    size: "Small",
    speed: 25,
    darkvision: 60,
    abilityIncreases: { int: 2 },
    languages: ["common", "gnomish"],
    traits: [
      "Darkvision 60 ft.",
      "Gnome Cunning: advantage on Int, Wis, and Cha saves vs. magic."
    ],
    subraces: [
      {
        id: "forest-gnome",
        label: "Forest Gnome",
        abilityIncreases: { dex: 1 },
        traits: [
          "Natural Illusionist: you know the Minor Illusion cantrip (Int).",
          "Speak with Small Beasts."
        ]
      },
      {
        id: "rock-gnome",
        label: "Rock Gnome",
        abilityIncreases: { con: 1 },
        traits: [
          "Artificer's Lore: doubled proficiency on History about devices/alchemy.",
          "Tinker: construct tiny clockwork devices."
        ]
      }
    ]
  },
  {
    id: "half-elf",
    label: "Half-Elf",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    abilityIncreases: { cha: 2 },
    abilityChoices: [{ amount: 1, count: 2, from: ["str", "dex", "con", "int", "wis"] }],
    languages: ["common", "elvish"],
    languageChoices: 1,
    skillChoices: { choose: 2, from: "all" },
    traits: [
      "Darkvision 60 ft.",
      "Fey Ancestry: advantage vs. charm; can't be magically put to sleep.",
      "Skill Versatility: proficiency in two skills of your choice."
    ],
    subraces: []
  },
  {
    id: "half-orc",
    label: "Half-Orc",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    abilityIncreases: { str: 2, con: 1 },
    languages: ["common", "orc"],
    skillProficiencies: ["intimidation"],
    traits: [
      "Darkvision 60 ft.",
      "Menacing: proficiency in Intimidation.",
      "Relentless Endurance: drop to 1 HP instead of 0 once per long rest.",
      "Savage Attacks: extra weapon die on melee critical hits."
    ],
    subraces: []
  },
  {
    id: "tiefling",
    label: "Tiefling",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    abilityIncreases: { int: 1, cha: 2 },
    languages: ["common", "infernal"],
    traits: [
      "Darkvision 60 ft.",
      "Hellish Resistance: resistance to fire damage.",
      "Infernal Legacy: Thaumaturgy cantrip (Charisma is the casting ability)."
    ],
    subraces: []
  }
];

export const raceIds = races.map((race) => race.id);
