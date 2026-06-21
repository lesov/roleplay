import assert from "node:assert/strict";
import test from "node:test";
import { characterRules } from "../../src/character/index.js";
import {
  abilityModifier,
  proficiencyBonus,
  pointBuyCost,
  totalPointBuyCost,
  applyRacialIncreases,
  validateSelections,
  assembleCharacter
} from "../../public/character/builder.js";

const rules = characterRules;

// A complete, valid set of selections for a High Elf Wizard used as a baseline.
function highElfWizard() {
  return {
    name: "Aelar",
    raceId: "elf",
    subraceId: "high-elf",
    classId: "wizard",
    backgroundId: "sage",
    abilityMethod: "standard-array",
    baseAbilityScores: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 },
    raceAbilityChoices: [],
    skillChoices: ["arcana", "history"],
    raceSkillChoices: [],
    expertise: [],
    cantrips: ["fire-bolt", "mage-hand", "light"],
    spells: ["magic-missile", "shield", "mage-armor", "sleep", "detect-magic", "identify"],
    equipmentChoices: { weapon: "quarterstaff", focus: "arcane", pack: "scholars" },
    languageChoices: ["draconic", "dwarvish"],
    alignmentId: "neutral-good",
    appearance: "  Tall, pale-eyed, ink-stained, and always smelling faintly of old paper.  ",
    personality: { trait: "Curious", ideal: "Knowledge", bond: "My tome", flaw: "Distracted" }
  };
}

test("abilityModifier matches 5e table", () => {
  assert.equal(abilityModifier(8), -1);
  assert.equal(abilityModifier(10), 0);
  assert.equal(abilityModifier(14), 2);
  assert.equal(abilityModifier(15), 2);
  assert.equal(abilityModifier(20), 5);
});

test("proficiency bonus is +2 at level 1", () => {
  assert.equal(proficiencyBonus(1), 2);
  assert.equal(proficiencyBonus(5), 3);
});

test("point-buy costs and totals follow the 27-point table", () => {
  assert.equal(pointBuyCost(8), 0);
  assert.equal(pointBuyCost(13), 5);
  assert.equal(pointBuyCost(15), 9);
  // standard-array-like spread within point buy bounds
  assert.equal(totalPointBuyCost({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }), 27);
});

test("racial increases stack race + subrace", () => {
  const elf = rules.races.find((r) => r.id === "elf");
  const highElf = elf.subraces.find((s) => s.id === "high-elf");
  const scores = applyRacialIncreases(
    { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 },
    elf,
    highElf
  );
  assert.equal(scores.dex, 16, "Elf +2 Dex");
  assert.equal(scores.int, 16, "High Elf +1 Int");
});

test("half-elf applies chosen +1 increases", () => {
  const halfElf = rules.races.find((r) => r.id === "half-elf");
  const scores = applyRacialIncreases(
    { str: 10, dex: 13, con: 12, int: 8, wis: 14, cha: 15 },
    halfElf,
    null,
    ["dex", "con"]
  );
  assert.equal(scores.cha, 17, "Half-Elf +2 Cha");
  assert.equal(scores.dex, 14);
  assert.equal(scores.con, 13);
});

test("assembleCharacter derives a complete wizard sheet", () => {
  const { character, errors } = assembleCharacter(rules, highElfWizard());
  assert.equal(errors, undefined, errors ? errors.join("; ") : "");
  // Int 15 + 1 (High Elf) = 16 -> +3
  assert.equal(character.abilityScores.int, 16);
  assert.equal(character.abilityModifiers.int, 3);
  // HP = d6 max (6) + Con mod (13 -> +1) = 7
  assert.equal(character.hitPoints, 7);
  // No armor, Dex 14 + Elf +2 = 16 -> +3 -> AC 13
  assert.equal(character.armorClass, 13);
  // Wizard saves: Int + Wis proficient
  const intSave = character.savingThrows.find((s) => s.ability === "int");
  assert.ok(intSave.proficient);
  assert.equal(intSave.bonus, 3 + 2);
  // Spell save DC = 8 + 2 + 3 = 13
  assert.equal(character.spellcasting.spellSaveDC, 13);
  assert.equal(character.spellcasting.spellAttackBonus, 5);
  assert.equal(character.spellcasting.cantrips.length, 3);
  assert.equal(character.spellcasting.spells.length, 6);
  // Arcana skill proficient: Int +3 + prof +2 = +5
  const arcana = character.skills.find((s) => s.id === "arcana");
  assert.ok(arcana.proficient);
  assert.equal(arcana.bonus, 5);
  // Elf grants Perception proficiency: Wis +1 + prof +2 = +3; passive = 13
  assert.equal(character.passivePerception, 13);
  assert.equal(character.appearance, "Tall, pale-eyed, ink-stained, and always smelling faintly of old paper.");
});

test("unarmored defense and armor AC compute correctly", () => {
  // Barbarian: Unarmored Defense 10 + Dex + Con
  const barb = {
    name: "Grok",
    raceId: "half-orc",
    classId: "barbarian",
    backgroundId: "outlander",
    abilityMethod: "standard-array",
    baseAbilityScores: { str: 15, dex: 14, con: 13, int: 8, wis: 12, cha: 10 },
    skillChoices: ["athletics", "survival"],
    equipmentChoices: { "weapon-a": "greataxe", "weapon-b": "handaxes" },
    alignmentId: "chaotic-neutral",
    personality: {}
  };
  const { character, errors } = assembleCharacter(rules, barb);
  assert.equal(errors, undefined, errors ? errors.join("; ") : "");
  // Dex 14 -> +2, Con 14 (13 + Half-Orc +1) -> +2 ; AC = 10 + 2 + 2 = 14
  assert.equal(character.abilityScores.con, 14);
  assert.equal(character.armorClass, 14);
  // HP = d12 (12) + Con +2 = 14
  assert.equal(character.hitPoints, 14);
});

test("cleric with armor + shield computes AC from armor", () => {
  const cleric = {
    name: "Brother Cedric",
    raceId: "dwarf",
    subraceId: "hill-dwarf",
    classId: "cleric",
    backgroundId: "acolyte",
    abilityMethod: "standard-array",
    baseAbilityScores: { str: 14, dex: 10, con: 13, int: 8, wis: 15, cha: 12 },
    skillChoices: ["insight", "religion"],
    cantrips: ["sacred-flame", "guidance", "light"],
    spells: ["cure-wounds", "bless", "guiding-bolt", "healing-word"],
    equipmentChoices: { weapon: "mace", armor: "scale", ranged: "crossbow", pack: "priests" },
    languageChoices: ["celestial", "infernal"],
    alignmentId: "lawful-good",
    personality: {}
  };
  const { character, errors } = assembleCharacter(rules, cleric);
  assert.equal(errors, undefined, errors ? errors.join("; ") : "");
  // Scale mail base 14 + min(Dex 0, 2) = 14, + shield 2 = 16
  assert.equal(character.armorClass, 16);
  // Con 13 + Dwarf +2 = 15 -> +2; Hill Dwarf Toughness: HP = d8 (8) + 2 + 1 = 11
  assert.equal(character.hitPoints, 11);
});

test("validateSelections flags incomplete builds", () => {
  const bad = highElfWizard();
  bad.name = "";
  bad.cantrips = ["fire-bolt"]; // too few
  const errors = validateSelections(rules, bad);
  assert.ok(errors.some((e) => /name/i.test(e)));
  assert.ok(errors.some((e) => /cantrip/i.test(e)));
});

test("standard array must use each value exactly once", () => {
  const bad = highElfWizard();
  bad.baseAbilityScores = { str: 15, dex: 15, con: 13, int: 12, wis: 10, cha: 8 };
  const errors = validateSelections(rules, bad);
  assert.ok(errors.some((e) => /standard-array/i.test(e)));
});
