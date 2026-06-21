import assert from "node:assert/strict";
import test from "node:test";
import { characterRules } from "../../src/character/index.js";
import { presets } from "../../src/character/presets.js";
import { assembleCharacter, validateSelections } from "../../public/character/builder.js";

const rules = characterRules;

test("there are six quick-start presets with unique ids", () => {
  assert.equal(presets.length, 6);
  const ids = presets.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
});

for (const preset of presets) {
  test(`preset "${preset.id}" passes validation`, () => {
    const errors = validateSelections(rules, preset.selections);
    assert.equal(errors.length, 0, errors.join("; "));
  });

  test(`preset "${preset.id}" assembles a complete sheet`, () => {
    const { character, errors } = assembleCharacter(rules, preset.selections);
    assert.equal(errors, undefined, errors ? errors.join("; ") : "");
    assert.ok(character.name);
    assert.ok(preset.selections.appearance?.trim(), "preset must include appearance text");
    assert.ok(character.appearance, "assembled preset must expose appearance text");
    assert.ok(character.race.label);
    assert.ok(character.class.label);
    assert.ok(character.background.label);
    assert.ok(character.hitPoints >= 1, "HP must be positive");
    assert.ok(character.armorClass >= 10, "AC must be at least 10");
    assert.equal(Object.keys(character.abilityScores).length, 6);
    assert.equal(character.savingThrows.length, 6);
    assert.equal(character.skills.length, 18);
    // Casters must have at least one cantrip resolved
    const cls = rules.classes.find((c) => c.id === preset.selections.classId);
    if (cls.spellcasting) {
      assert.ok(character.spellcasting, "caster preset must have spellcasting block");
      assert.ok(character.spellcasting.cantrips.length >= 1);
    }
  });
}
