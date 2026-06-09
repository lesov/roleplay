// SRD equipment referenced by class and background starting gear. Only the
// fields the builder needs to derive a sheet are modelled: armor carries an AC
// rule, weapons carry damage, everything carries a category for display.
//
// Armor `ac` shapes:
//   { type: "flat", base }                  -> AC = base (no Dex)
//   { type: "dex", base }                   -> AC = base + Dex mod
//   { type: "dex-capped", base, maxBonus }  -> AC = base + min(Dex mod, maxBonus)
//   { type: "shield", bonus }               -> adds bonus to AC

export const equipment = {
  // ---- Armor ----
  "padded-armor": { id: "padded-armor", label: "Padded Armor", category: "armor", armorType: "light", ac: { type: "dex", base: 11 }, weight: 8 },
  "leather-armor": { id: "leather-armor", label: "Leather Armor", category: "armor", armorType: "light", ac: { type: "dex", base: 11 }, weight: 10 },
  "studded-leather": { id: "studded-leather", label: "Studded Leather", category: "armor", armorType: "light", ac: { type: "dex", base: 12 }, weight: 13 },
  "hide-armor": { id: "hide-armor", label: "Hide Armor", category: "armor", armorType: "medium", ac: { type: "dex-capped", base: 12, maxBonus: 2 }, weight: 12 },
  "chain-shirt": { id: "chain-shirt", label: "Chain Shirt", category: "armor", armorType: "medium", ac: { type: "dex-capped", base: 13, maxBonus: 2 }, weight: 20 },
  "scale-mail": { id: "scale-mail", label: "Scale Mail", category: "armor", armorType: "medium", ac: { type: "dex-capped", base: 14, maxBonus: 2 }, weight: 45 },
  "ring-mail": { id: "ring-mail", label: "Ring Mail", category: "armor", armorType: "heavy", ac: { type: "flat", base: 14 }, weight: 40 },
  "chain-mail": { id: "chain-mail", label: "Chain Mail", category: "armor", armorType: "heavy", ac: { type: "flat", base: 16 }, weight: 55 },
  "shield": { id: "shield", label: "Shield", category: "armor", armorType: "shield", ac: { type: "shield", bonus: 2 }, weight: 6 },

  // ---- Simple melee weapons ----
  "club": { id: "club", label: "Club", category: "weapon", weaponType: "simple-melee", damage: "1d4 bludgeoning", weight: 2 },
  "dagger": { id: "dagger", label: "Dagger", category: "weapon", weaponType: "simple-melee", damage: "1d4 piercing", properties: ["finesse", "light", "thrown"], weight: 1 },
  "handaxe": { id: "handaxe", label: "Handaxe", category: "weapon", weaponType: "simple-melee", damage: "1d6 slashing", properties: ["light", "thrown"], weight: 2 },
  "javelin": { id: "javelin", label: "Javelin", category: "weapon", weaponType: "simple-melee", damage: "1d6 piercing", properties: ["thrown"], weight: 2 },
  "mace": { id: "mace", label: "Mace", category: "weapon", weaponType: "simple-melee", damage: "1d6 bludgeoning", weight: 4 },
  "quarterstaff": { id: "quarterstaff", label: "Quarterstaff", category: "weapon", weaponType: "simple-melee", damage: "1d6 bludgeoning", properties: ["versatile"], weight: 4 },
  "spear": { id: "spear", label: "Spear", category: "weapon", weaponType: "simple-melee", damage: "1d6 piercing", properties: ["thrown", "versatile"], weight: 3 },
  "light-hammer": { id: "light-hammer", label: "Light Hammer", category: "weapon", weaponType: "simple-melee", damage: "1d4 bludgeoning", properties: ["light", "thrown"], weight: 2 },

  // ---- Simple ranged weapons ----
  "light-crossbow": { id: "light-crossbow", label: "Light Crossbow", category: "weapon", weaponType: "simple-ranged", damage: "1d8 piercing", properties: ["ammunition", "two-handed"], weight: 5 },
  "shortbow": { id: "shortbow", label: "Shortbow", category: "weapon", weaponType: "simple-ranged", damage: "1d6 piercing", properties: ["ammunition", "two-handed"], weight: 2 },
  "sling": { id: "sling", label: "Sling", category: "weapon", weaponType: "simple-ranged", damage: "1d4 bludgeoning", properties: ["ammunition"], weight: 0 },
  "dart": { id: "dart", label: "Dart", category: "weapon", weaponType: "simple-ranged", damage: "1d4 piercing", properties: ["finesse", "thrown"], weight: 0.25 },

  // ---- Martial melee weapons ----
  "battleaxe": { id: "battleaxe", label: "Battleaxe", category: "weapon", weaponType: "martial-melee", damage: "1d8 slashing", properties: ["versatile"], weight: 4 },
  "greataxe": { id: "greataxe", label: "Greataxe", category: "weapon", weaponType: "martial-melee", damage: "1d12 slashing", properties: ["heavy", "two-handed"], weight: 7 },
  "greatsword": { id: "greatsword", label: "Greatsword", category: "weapon", weaponType: "martial-melee", damage: "2d6 slashing", properties: ["heavy", "two-handed"], weight: 6 },
  "longsword": { id: "longsword", label: "Longsword", category: "weapon", weaponType: "martial-melee", damage: "1d8 slashing", properties: ["versatile"], weight: 3 },
  "rapier": { id: "rapier", label: "Rapier", category: "weapon", weaponType: "martial-melee", damage: "1d8 piercing", properties: ["finesse"], weight: 2 },
  "scimitar": { id: "scimitar", label: "Scimitar", category: "weapon", weaponType: "martial-melee", damage: "1d6 slashing", properties: ["finesse", "light"], weight: 3 },
  "shortsword": { id: "shortsword", label: "Shortsword", category: "weapon", weaponType: "martial-melee", damage: "1d6 piercing", properties: ["finesse", "light"], weight: 2 },
  "warhammer": { id: "warhammer", label: "Warhammer", category: "weapon", weaponType: "martial-melee", damage: "1d8 bludgeoning", properties: ["versatile"], weight: 2 },
  "maul": { id: "maul", label: "Maul", category: "weapon", weaponType: "martial-melee", damage: "2d6 bludgeoning", properties: ["heavy", "two-handed"], weight: 10 },
  "glaive": { id: "glaive", label: "Glaive", category: "weapon", weaponType: "martial-melee", damage: "1d10 slashing", properties: ["heavy", "reach", "two-handed"], weight: 6 },

  // ---- Martial ranged weapons ----
  "longbow": { id: "longbow", label: "Longbow", category: "weapon", weaponType: "martial-ranged", damage: "1d8 piercing", properties: ["ammunition", "heavy", "two-handed"], weight: 2 },
  "hand-crossbow": { id: "hand-crossbow", label: "Hand Crossbow", category: "weapon", weaponType: "martial-ranged", damage: "1d6 piercing", properties: ["ammunition", "light"], weight: 3 },

  // ---- Ammunition & focuses ----
  "arrows": { id: "arrows", label: "Arrows (20)", category: "ammunition", weight: 1 },
  "crossbow-bolts": { id: "crossbow-bolts", label: "Crossbow Bolts (20)", category: "ammunition", weight: 1.5 },
  "sling-bullets": { id: "sling-bullets", label: "Sling Bullets (20)", category: "ammunition", weight: 1.5 },
  "component-pouch": { id: "component-pouch", label: "Component Pouch", category: "focus", weight: 2 },
  "arcane-focus": { id: "arcane-focus", label: "Arcane Focus", category: "focus", weight: 1 },
  "holy-symbol": { id: "holy-symbol", label: "Holy Symbol", category: "focus", weight: 1 },
  "druidic-focus": { id: "druidic-focus", label: "Druidic Focus", category: "focus", weight: 1 },

  // ---- Adventuring packs & gear ----
  "explorers-pack": { id: "explorers-pack", label: "Explorer's Pack", category: "pack", weight: 59 },
  "dungeoneers-pack": { id: "dungeoneers-pack", label: "Dungeoneer's Pack", category: "pack", weight: 61.5 },
  "priests-pack": { id: "priests-pack", label: "Priest's Pack", category: "pack", weight: 24 },
  "scholars-pack": { id: "scholars-pack", label: "Scholar's Pack", category: "pack", weight: 10 },
  "diplomats-pack": { id: "diplomats-pack", label: "Diplomat's Pack", category: "pack", weight: 38 },
  "entertainers-pack": { id: "entertainers-pack", label: "Entertainer's Pack", category: "pack", weight: 38 },
  "burglars-pack": { id: "burglars-pack", label: "Burglar's Pack", category: "pack", weight: 44.5 },

  // ---- Tools & sundries referenced by backgrounds ----
  "thieves-tools": { id: "thieves-tools", label: "Thieves' Tools", category: "tool", weight: 1 },
  "spellbook": { id: "spellbook", label: "Spellbook", category: "gear", weight: 3 },
  "lute": { id: "lute", label: "Lute", category: "instrument", weight: 2 },
  "explorers-clothes": { id: "explorers-clothes", label: "Traveler's Clothes", category: "gear", weight: 4 },
  "common-clothes": { id: "common-clothes", label: "Common Clothes", category: "gear", weight: 3 },
  "fine-clothes": { id: "fine-clothes", label: "Fine Clothes", category: "gear", weight: 6 },
  "costume": { id: "costume", label: "Costume", category: "gear", weight: 4 },
  "belt-pouch": { id: "belt-pouch", label: "Belt Pouch", category: "gear", weight: 1 },
  "vestments": { id: "vestments", label: "Vestments", category: "gear", weight: 4 },
  "incense": { id: "incense", label: "Stick of Incense", category: "gear", weight: 0 }
};

export const equipmentIds = Object.keys(equipment);
