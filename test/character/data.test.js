import assert from "node:assert/strict";
import test from "node:test";
import { races } from "../../src/character/races.js";
import { classes } from "../../src/character/classes.js";
import { backgrounds } from "../../src/character/backgrounds.js";
import { spells } from "../../src/character/spells.js";
import { equipment, equipmentIds } from "../../src/character/equipment.js";
import { skillIds as refSkillIds, abilityIds } from "../../src/character/reference.js";

const KEBAB = /^[a-z][a-z0-9-]*$/;
const skillSet = new Set(refSkillIds);
const abilitySet = new Set(abilityIds);
const classIdSet = new Set(classes.map((c) => c.id));
const equipmentSet = new Set(equipmentIds);

function assertKebabUnique(list, name) {
  const ids = list.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, `${name} has duplicate ids`);
  for (const id of ids) assert.ok(KEBAB.test(id), `${name} id "${id}" not lowercase-kebab`);
}

test("core lists have unique lowercase-kebab ids", () => {
  assertKebabUnique(races, "races");
  assertKebabUnique(classes, "classes");
  assertKebabUnique(backgrounds, "backgrounds");
  assertKebabUnique(spells, "spells");
  assertKebabUnique(Object.values(equipment), "equipment");
});

test("races: subraces unique and ability increases target valid abilities", () => {
  for (const race of races) {
    if (race.subraces?.length) assertKebabUnique(race.subraces, `${race.id} subraces`);
    const sources = [race, ...(race.subraces || [])];
    for (const src of sources) {
      for (const ability of Object.keys(src.abilityIncreases || {})) {
        assert.ok(abilitySet.has(ability), `${race.id}/${src.id || race.id} bad ability ${ability}`);
      }
    }
    for (const choice of race.abilityChoices || []) {
      const from = choice.from === "all" ? [...abilitySet] : choice.from;
      for (const ability of from) {
        assert.ok(abilitySet.has(ability), `${race.id} abilityChoice bad ability ${ability}`);
      }
    }
  }
});

test("classes: skill choices, saving throws, and equipment reference valid data", () => {
  for (const cls of classes) {
    for (const ability of cls.savingThrows || []) {
      assert.ok(abilitySet.has(ability), `${cls.id} bad saving throw ${ability}`);
    }
    const from = cls.skillChoices?.from === "all" ? [...skillSet] : cls.skillChoices?.from || [];
    for (const skill of from) {
      assert.ok(skillSet.has(skill), `${cls.id} skill choice references unknown skill ${skill}`);
    }
    for (const group of cls.startingEquipment || []) {
      const itemLists = group.fixed
        ? [group.fixed]
        : (group.options || []).map((o) => o.items);
      for (const items of itemLists) {
        for (const itemId of items) {
          assert.ok(equipmentSet.has(itemId), `${cls.id} starting gear references unknown item ${itemId}`);
        }
      }
    }
  }
});

test("backgrounds: skills are valid and equipment exists", () => {
  for (const bg of backgrounds) {
    for (const skill of bg.skillProficiencies || []) {
      assert.ok(skillSet.has(skill), `${bg.id} references unknown skill ${skill}`);
    }
    for (const itemId of bg.startingEquipment || []) {
      assert.ok(equipmentSet.has(itemId), `${bg.id} references unknown item ${itemId}`);
    }
    assert.ok(bg.feature?.name && bg.feature?.text, `${bg.id} missing a feature`);
  }
});

test("spells: class tags reference real classes; levels are 0 or 1", () => {
  for (const spell of spells) {
    assert.ok(spell.level === 0 || spell.level === 1, `${spell.id} bad level`);
    assert.ok(spell.classes.length > 0, `${spell.id} has no class tags`);
    for (const classId of spell.classes) {
      assert.ok(classIdSet.has(classId), `${spell.id} tagged with unknown class ${classId}`);
    }
  }
});

test("every caster class can fill its cantrip and spell quota", () => {
  for (const cls of classes) {
    if (!cls.spellcasting) continue;
    const list = cls.spellcasting.spellListId;
    const cantrips = spells.filter((s) => s.level === 0 && s.classes.includes(list));
    const level1 = spells.filter((s) => s.level === 1 && s.classes.includes(list));
    assert.ok(cantrips.length >= cls.spellcasting.cantrips, `${cls.id} lacks enough cantrips`);
    assert.ok(level1.length >= cls.spellcasting.spells, `${cls.id} lacks enough level-1 spells`);
  }
});
