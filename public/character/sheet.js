// Renders a built character object (from builder.assembleCharacter) into a DOM
// container. Used by both the wizard's Review step and the in-game Character
// panel, so the sheet looks identical wherever it appears.

import { formatModifier } from "./builder.js";

const ABILITY_LABELS = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA"
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function statBox(label, value) {
  const box = el("div", "sheet-stat");
  box.append(el("span", "sheet-stat-label", label), el("span", "sheet-stat-value", value));
  return box;
}

function section(title) {
  const wrap = el("section", "sheet-section");
  wrap.append(el("h4", "sheet-section-title", title));
  return wrap;
}

export function renderCharacterSheet(container, character) {
  if (!character) {
    container.replaceChildren(el("p", "sheet-empty", "No character yet."));
    return;
  }

  const root = el("div", "sheet");

  // Header: name + identity line
  const header = el("div", "sheet-header");
  header.append(el("h3", "sheet-name", character.name));
  const identityBits = [
    character.subrace ? character.subrace.label : character.race.label,
    character.class.label,
    `Level ${character.level}`
  ];
  header.append(el("p", "sheet-identity", identityBits.join(" · ")));
  const meta = [character.background.label, character.alignment?.label].filter(Boolean).join(" · ");
  if (meta) header.append(el("p", "sheet-meta", meta));
  root.append(header);

  // Core combat stats
  const core = el("div", "sheet-core");
  core.append(
    statBox("Armor Class", character.armorClass),
    statBox("Hit Points", character.hitPoints),
    statBox("Speed", `${character.speed} ft`),
    statBox("Initiative", formatModifier(character.initiative)),
    statBox("Prof. Bonus", formatModifier(character.proficiencyBonus)),
    statBox("Passive Per.", character.passivePerception)
  );
  root.append(core);

  // Ability scores
  const abilitySection = section("Ability Scores");
  const abilityGrid = el("div", "sheet-abilities");
  for (const id of ["str", "dex", "con", "int", "wis", "cha"]) {
    const box = el("div", "sheet-ability");
    box.append(
      el("span", "sheet-ability-label", ABILITY_LABELS[id]),
      el("span", "sheet-ability-score", character.abilityScores[id]),
      el("span", "sheet-ability-mod", formatModifier(character.abilityModifiers[id]))
    );
    abilityGrid.append(box);
  }
  abilitySection.append(abilityGrid);
  root.append(abilitySection);

  // Saving throws
  const saveSection = section("Saving Throws");
  const saveList = el("div", "sheet-pill-row");
  for (const save of character.savingThrows) {
    const pill = el("span", save.proficient ? "sheet-pill proficient" : "sheet-pill");
    pill.textContent = `${ABILITY_LABELS[save.ability]} ${formatModifier(save.bonus)}`;
    saveList.append(pill);
  }
  saveSection.append(saveList);
  root.append(saveSection);

  // Skills (proficient first, then the rest)
  const skillSection = section("Skills");
  const skillList = el("div", "sheet-skill-grid");
  const orderedSkills = [...character.skills].sort((a, b) => {
    if (a.proficient !== b.proficient) return a.proficient ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
  for (const skill of orderedSkills) {
    const row = el("div", skill.proficient ? "sheet-skill proficient" : "sheet-skill");
    const mark = skill.expert ? "◆" : skill.proficient ? "●" : "○";
    row.append(
      el("span", "sheet-skill-mark", mark),
      el("span", "sheet-skill-name", skill.label),
      el("span", "sheet-skill-bonus", formatModifier(skill.bonus))
    );
    skillList.append(row);
  }
  skillSection.append(skillList);
  root.append(skillSection);

  // Spellcasting
  if (character.spellcasting) {
    const sc = character.spellcasting;
    const spellSection = section("Spellcasting");
    const dcRow = el("div", "sheet-core");
    dcRow.append(
      statBox("Spell DC", sc.spellSaveDC),
      statBox("Spell Atk", formatModifier(sc.spellAttackBonus))
    );
    spellSection.append(dcRow);
    if (sc.cantrips.length) {
      spellSection.append(el("p", "sheet-line", `Cantrips: ${sc.cantrips.map((s) => s.label).join(", ")}`));
    }
    if (sc.spells.length) {
      const label = sc.prepared ? "Prepared (1st)" : "Known (1st)";
      spellSection.append(el("p", "sheet-line", `${label}: ${sc.spells.map((s) => s.label).join(", ")}`));
    }
    root.append(spellSection);
  }

  // Proficiencies & languages
  const profSection = section("Proficiencies & Languages");
  const prof = character.proficiencies;
  if (prof.armor.length) profSection.append(el("p", "sheet-line", `Armor: ${prof.armor.join(", ")}`));
  if (prof.weapons.length) profSection.append(el("p", "sheet-line", `Weapons: ${prof.weapons.join(", ")}`));
  if (prof.tools.length) profSection.append(el("p", "sheet-line", `Tools: ${prof.tools.join(", ")}`));
  if (character.languages.length) profSection.append(el("p", "sheet-line", `Languages: ${character.languages.join(", ")}`));
  root.append(profSection);

  // Equipment
  if (character.equipment.length) {
    const equipSection = section("Equipment");
    const list = el("ul", "sheet-equipment");
    for (const item of character.equipment) {
      const li = el("li", null, item.quantity > 1 ? `${item.label} ×${item.quantity}` : item.label);
      list.append(li);
    }
    equipSection.append(list);
    root.append(equipSection);
  }

  // Features & traits
  if (character.features.length) {
    const featSection = section("Features & Traits");
    const list = el("ul", "sheet-features");
    for (const feature of character.features) list.append(el("li", null, feature));
    featSection.append(list);
    root.append(featSection);
  }

  // Personality
  const p = character.personality || {};
  if (p.trait || p.ideal || p.bond || p.flaw) {
    const persSection = section("Personality");
    if (p.trait) persSection.append(el("p", "sheet-line", `Trait: ${p.trait}`));
    if (p.ideal) persSection.append(el("p", "sheet-line", `Ideal: ${p.ideal}`));
    if (p.bond) persSection.append(el("p", "sheet-line", `Bond: ${p.bond}`));
    if (p.flaw) persSection.append(el("p", "sheet-line", `Flaw: ${p.flaw}`));
    root.append(persSection);
  }

  container.replaceChildren(root);
}
