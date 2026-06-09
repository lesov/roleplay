// SRD 5.1 classes at level 1. Notable shapes used by the builder:
//   savingThrows: ["str","con"]                       proficient saves
//   skillChoices: { choose: n, from: [skillIds] }
//   unarmoredDefense: { abilities: ["dex","con"] }     AC = 10 + those mods
//   spellcasting: { ability, cantrips, spells, spellListId, prepared }
//     cantrips/spells = how many to choose at creation (level 1)
//   startingEquipment: array of groups; each is either
//     { fixed: [itemIds] } or
//     { id, label, choose: 1, options: [{ id, label, items: [itemIds] }] }
//   armorProficiencies / weaponProficiencies use category tokens
//     (light/medium/heavy/shields, simple/martial) and/or specific item ids.

export const classes = [
  {
    id: "barbarian",
    label: "Barbarian",
    hitDie: 12,
    primaryAbility: "str",
    savingThrows: ["str", "con"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple", "martial"],
    unarmoredDefense: { abilities: ["dex", "con"] },
    skillChoices: { choose: 2, from: ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"] },
    features: ["Rage", "Unarmored Defense (10 + Dex + Con)"],
    startingEquipment: [
      { id: "weapon-a", label: "Primary weapon", choose: 1, options: [
        { id: "greataxe", label: "A greataxe", items: ["greataxe"] },
        { id: "martial", label: "Any martial melee weapon", items: ["battleaxe"] }
      ] },
      { id: "weapon-b", label: "Secondary weapon", choose: 1, options: [
        { id: "handaxes", label: "Two handaxes", items: ["handaxe", "handaxe"] },
        { id: "simple", label: "Any simple weapon", items: ["spear"] }
      ] },
      { fixed: ["explorers-pack", "javelin", "javelin", "javelin", "javelin"] }
    ]
  },
  {
    id: "bard",
    label: "Bard",
    hitDie: 8,
    primaryAbility: "cha",
    savingThrows: ["dex", "cha"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"],
    skillChoices: { choose: 3, from: "all" },
    spellcasting: { ability: "cha", cantrips: 2, spells: 4, spellListId: "bard", prepared: false },
    features: ["Spellcasting", "Bardic Inspiration (d6)"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "rapier", label: "A rapier", items: ["rapier"] },
        { id: "longsword", label: "A longsword", items: ["longsword"] },
        { id: "simple", label: "Any simple weapon", items: ["dagger"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "diplomats", label: "A diplomat's pack", items: ["diplomats-pack"] },
        { id: "entertainers", label: "An entertainer's pack", items: ["entertainers-pack"] }
      ] },
      { fixed: ["lute", "leather-armor", "dagger"] }
    ]
  },
  {
    id: "cleric",
    label: "Cleric",
    hitDie: 8,
    primaryAbility: "wis",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple"],
    skillChoices: { choose: 2, from: ["history", "insight", "medicine", "persuasion", "religion"] },
    spellcasting: { ability: "wis", cantrips: 3, spells: 4, spellListId: "cleric", prepared: true },
    features: ["Spellcasting", "Divine Domain (Life)"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "mace", label: "A mace", items: ["mace"] },
        { id: "warhammer", label: "A warhammer (if proficient)", items: ["warhammer"] }
      ] },
      { id: "armor", label: "Armor", choose: 1, options: [
        { id: "scale", label: "Scale mail", items: ["scale-mail"] },
        { id: "leather", label: "Leather armor", items: ["leather-armor"] },
        { id: "chain", label: "Chain mail (if proficient)", items: ["chain-mail"] }
      ] },
      { id: "ranged", label: "Ranged option", choose: 1, options: [
        { id: "crossbow", label: "Light crossbow and 20 bolts", items: ["light-crossbow", "crossbow-bolts"] },
        { id: "simple", label: "Any simple weapon", items: ["club"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "priests", label: "A priest's pack", items: ["priests-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["shield", "holy-symbol"] }
    ]
  },
  {
    id: "druid",
    label: "Druid",
    hitDie: 8,
    primaryAbility: "wis",
    savingThrows: ["int", "wis"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["club", "dagger", "javelin", "mace", "quarterstaff", "scimitar", "sling", "spear"],
    skillChoices: { choose: 2, from: ["arcana", "animal-handling", "insight", "medicine", "nature", "perception", "religion", "survival"] },
    spellcasting: { ability: "wis", cantrips: 2, spells: 4, spellListId: "druid", prepared: true },
    features: ["Druidic", "Spellcasting"],
    startingEquipment: [
      { id: "shield", label: "Shield option", choose: 1, options: [
        { id: "shield", label: "A wooden shield", items: ["shield"] },
        { id: "simple", label: "Any simple weapon", items: ["quarterstaff"] }
      ] },
      { id: "weapon", label: "Melee weapon", choose: 1, options: [
        { id: "scimitar", label: "A scimitar", items: ["scimitar"] },
        { id: "simple-melee", label: "Any simple melee weapon", items: ["mace"] }
      ] },
      { fixed: ["leather-armor", "explorers-pack", "druidic-focus"] }
    ]
  },
  {
    id: "fighter",
    label: "Fighter",
    hitDie: 10,
    primaryAbility: "str",
    savingThrows: ["str", "con"],
    armorProficiencies: ["light", "medium", "heavy", "shields"],
    weaponProficiencies: ["simple", "martial"],
    skillChoices: { choose: 2, from: ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "perception", "survival"] },
    features: ["Fighting Style", "Second Wind"],
    startingEquipment: [
      { id: "armor", label: "Armor", choose: 1, options: [
        { id: "chain-mail", label: "Chain mail", items: ["chain-mail"] },
        { id: "leather", label: "Leather armor, longbow, 20 arrows", items: ["leather-armor", "longbow", "arrows"] }
      ] },
      { id: "weapon", label: "Weapon & shield", choose: 1, options: [
        { id: "martial-shield", label: "A martial weapon and a shield", items: ["longsword", "shield"] },
        { id: "two-martial", label: "Two martial weapons", items: ["greatsword"] }
      ] },
      { id: "ranged", label: "Ranged option", choose: 1, options: [
        { id: "crossbow", label: "Light crossbow and 20 bolts", items: ["light-crossbow", "crossbow-bolts"] },
        { id: "handaxes", label: "Two handaxes", items: ["handaxe", "handaxe"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "dungeoneers", label: "A dungeoneer's pack", items: ["dungeoneers-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] }
    ]
  },
  {
    id: "monk",
    label: "Monk",
    hitDie: 8,
    primaryAbility: "dex",
    savingThrows: ["str", "dex"],
    armorProficiencies: [],
    weaponProficiencies: ["simple", "shortsword"],
    unarmoredDefense: { abilities: ["dex", "wis"] },
    skillChoices: { choose: 2, from: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] },
    features: ["Unarmored Defense (10 + Dex + Wis)", "Martial Arts (1d4)"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "shortsword", label: "A shortsword", items: ["shortsword"] },
        { id: "simple", label: "Any simple weapon", items: ["quarterstaff"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "dungeoneers", label: "A dungeoneer's pack", items: ["dungeoneers-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["dart", "dart", "dart", "dart", "dart", "dart", "dart", "dart", "dart", "dart"] }
    ]
  },
  {
    id: "paladin",
    label: "Paladin",
    hitDie: 10,
    primaryAbility: "str",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["light", "medium", "heavy", "shields"],
    weaponProficiencies: ["simple", "martial"],
    skillChoices: { choose: 2, from: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"] },
    features: ["Divine Sense", "Lay on Hands"],
    startingEquipment: [
      { id: "weapon", label: "Weapon & shield", choose: 1, options: [
        { id: "martial-shield", label: "A martial weapon and a shield", items: ["longsword", "shield"] },
        { id: "two-martial", label: "Two martial weapons", items: ["greatsword"] }
      ] },
      { id: "ranged", label: "Thrown / simple option", choose: 1, options: [
        { id: "javelins", label: "Five javelins", items: ["javelin", "javelin", "javelin", "javelin", "javelin"] },
        { id: "simple-melee", label: "Any simple melee weapon", items: ["handaxe"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "priests", label: "A priest's pack", items: ["priests-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["chain-mail", "holy-symbol"] }
    ]
  },
  {
    id: "ranger",
    label: "Ranger",
    hitDie: 10,
    primaryAbility: "dex",
    savingThrows: ["str", "dex"],
    armorProficiencies: ["light", "medium", "shields"],
    weaponProficiencies: ["simple", "martial"],
    skillChoices: { choose: 3, from: ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"] },
    features: ["Favored Enemy", "Natural Explorer"],
    startingEquipment: [
      { id: "armor", label: "Armor", choose: 1, options: [
        { id: "scale", label: "Scale mail", items: ["scale-mail"] },
        { id: "leather", label: "Leather armor", items: ["leather-armor"] }
      ] },
      { id: "weapon", label: "Melee weapons", choose: 1, options: [
        { id: "shortswords", label: "Two shortswords", items: ["shortsword", "shortsword"] },
        { id: "simple-melee", label: "Two simple melee weapons", items: ["handaxe", "handaxe"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "dungeoneers", label: "A dungeoneer's pack", items: ["dungeoneers-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["longbow", "arrows"] }
    ]
  },
  {
    id: "rogue",
    label: "Rogue",
    hitDie: 8,
    primaryAbility: "dex",
    savingThrows: ["dex", "int"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple", "hand-crossbow", "longsword", "rapier", "shortsword"],
    toolProficiencies: ["thieves-tools"],
    skillChoices: { choose: 4, from: ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "performance", "persuasion", "sleight-of-hand", "stealth"] },
    expertiseChoose: 2,
    features: ["Expertise", "Sneak Attack (1d6)", "Thieves' Cant"],
    startingEquipment: [
      { id: "weapon", label: "Primary weapon", choose: 1, options: [
        { id: "rapier", label: "A rapier", items: ["rapier"] },
        { id: "shortsword", label: "A shortsword", items: ["shortsword"] }
      ] },
      { id: "ranged", label: "Ranged / secondary", choose: 1, options: [
        { id: "shortbow", label: "A shortbow and 20 arrows", items: ["shortbow", "arrows"] },
        { id: "shortsword", label: "A shortsword", items: ["shortsword"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "burglars", label: "A burglar's pack", items: ["burglars-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["leather-armor", "dagger", "dagger", "thieves-tools"] }
    ]
  },
  {
    id: "sorcerer",
    label: "Sorcerer",
    hitDie: 6,
    primaryAbility: "cha",
    savingThrows: ["con", "cha"],
    armorProficiencies: [],
    weaponProficiencies: ["dagger", "quarterstaff", "light-crossbow", "sling"],
    skillChoices: { choose: 2, from: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"] },
    spellcasting: { ability: "cha", cantrips: 4, spells: 2, spellListId: "sorcerer", prepared: false },
    features: ["Spellcasting", "Sorcerous Origin (Draconic Bloodline)"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "crossbow", label: "Light crossbow and 20 bolts", items: ["light-crossbow", "crossbow-bolts"] },
        { id: "simple", label: "Any simple weapon", items: ["dagger"] }
      ] },
      { id: "focus", label: "Focus", choose: 1, options: [
        { id: "component", label: "A component pouch", items: ["component-pouch"] },
        { id: "arcane", label: "An arcane focus", items: ["arcane-focus"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "dungeoneers", label: "A dungeoneer's pack", items: ["dungeoneers-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["dagger", "dagger"] }
    ]
  },
  {
    id: "warlock",
    label: "Warlock",
    hitDie: 8,
    primaryAbility: "cha",
    savingThrows: ["wis", "cha"],
    armorProficiencies: ["light"],
    weaponProficiencies: ["simple"],
    skillChoices: { choose: 2, from: ["arcana", "deception", "history", "intimidation", "investigation", "nature", "religion"] },
    spellcasting: { ability: "cha", cantrips: 2, spells: 2, spellListId: "warlock", prepared: false },
    features: ["Otherworldly Patron (The Fiend)", "Pact Magic"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "crossbow", label: "Light crossbow and 20 bolts", items: ["light-crossbow", "crossbow-bolts"] },
        { id: "simple", label: "Any simple weapon", items: ["dagger"] }
      ] },
      { id: "focus", label: "Focus", choose: 1, options: [
        { id: "component", label: "A component pouch", items: ["component-pouch"] },
        { id: "arcane", label: "An arcane focus", items: ["arcane-focus"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "scholars", label: "A scholar's pack", items: ["scholars-pack"] },
        { id: "dungeoneers", label: "A dungeoneer's pack", items: ["dungeoneers-pack"] }
      ] },
      { fixed: ["leather-armor", "dagger", "dagger"] }
    ]
  },
  {
    id: "wizard",
    label: "Wizard",
    hitDie: 6,
    primaryAbility: "int",
    savingThrows: ["int", "wis"],
    armorProficiencies: [],
    weaponProficiencies: ["dagger", "quarterstaff", "light-crossbow", "sling"],
    skillChoices: { choose: 2, from: ["arcana", "history", "insight", "investigation", "medicine", "religion"] },
    spellcasting: { ability: "int", cantrips: 3, spells: 6, spellListId: "wizard", prepared: true },
    features: ["Spellcasting", "Arcane Recovery"],
    startingEquipment: [
      { id: "weapon", label: "Weapon", choose: 1, options: [
        { id: "quarterstaff", label: "A quarterstaff", items: ["quarterstaff"] },
        { id: "dagger", label: "A dagger", items: ["dagger"] }
      ] },
      { id: "focus", label: "Focus", choose: 1, options: [
        { id: "component", label: "A component pouch", items: ["component-pouch"] },
        { id: "arcane", label: "An arcane focus", items: ["arcane-focus"] }
      ] },
      { id: "pack", label: "Pack", choose: 1, options: [
        { id: "scholars", label: "A scholar's pack", items: ["scholars-pack"] },
        { id: "explorers", label: "An explorer's pack", items: ["explorers-pack"] }
      ] },
      { fixed: ["spellbook"] }
    ]
  }
];

export const classIds = classes.map((cls) => cls.id);
export const casterClassIds = classes.filter((cls) => cls.spellcasting).map((cls) => cls.id);
