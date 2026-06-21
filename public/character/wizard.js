// Multi-step character creation wizard. Owns a `selections` object, renders one
// step at a time into the overlay, uses the pure builder for live previews and
// validation, and calls onComplete(character) when the player clicks "Begin
// Adventure". Quick Start loads a preset's selections and jumps to Review.

import {
  abilityModifier,
  formatModifier,
  applyRacialIncreases,
  totalPointBuyCost,
  validateSelections,
  assembleCharacter
} from "./builder.js";
import { renderCharacterSheet } from "./sheet.js";

const ABILITY_IDS = ["str", "dex", "con", "int", "wis", "cha"];
const STEPS = [
  { id: "start", title: "Begin" },
  { id: "race", title: "Race" },
  { id: "class", title: "Class" },
  { id: "background", title: "Background" },
  { id: "abilities", title: "Abilities" },
  { id: "equipment", title: "Equipment" },
  { id: "details", title: "Details" },
  { id: "review", title: "Review" }
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function byId(list, id) {
  return (list || []).find((entry) => entry.id === id) || null;
}

function createInitialSelections() {
  return {
    name: "",
    raceId: null,
    subraceId: null,
    classId: null,
    backgroundId: null,
    abilityMethod: "standard-array",
    baseAbilityScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    abilityAssignment: {},
    rolledPool: null,
    raceAbilityChoices: [],
    skillChoices: [],
    raceSkillChoices: [],
    expertise: [],
    cantrips: [],
    spells: [],
    equipmentChoices: {},
    languageChoices: [],
    alignmentId: null,
    appearance: "",
    personality: {}
  };
}

function rollAbilityScore() {
  const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 6));
  rolls.sort((a, b) => a - b);
  return rolls[1] + rolls[2] + rolls[3]; // drop lowest
}

export function runCharacterWizard({ rules, presets, mountId = "char-wizard", onComplete }) {
  const mount = document.getElementById(mountId);
  let selections = createInitialSelections();
  let stepIndex = 0;

  const stepId = () => STEPS[stepIndex].id;
  const go = (id) => {
    stepIndex = STEPS.findIndex((s) => s.id === id);
    render();
  };

  // ---- helpers shared by steps ----

  function selectionCard(label, sub, selected, onClick) {
    const card = el("button", selected ? "wiz-card selected" : "wiz-card");
    card.type = "button";
    card.append(el("strong", "wiz-card-title", label));
    if (sub) card.append(el("span", "wiz-card-sub", sub));
    card.addEventListener("click", onClick);
    return card;
  }

  function toggleInList(list, value, max) {
    const i = list.indexOf(value);
    if (i >= 0) {
      list.splice(i, 1);
    } else if (list.length < max) {
      list.push(value);
    }
  }

  function checkboxRow(label, checked, disabled, onChange) {
    const row = el("label", disabled && !checked ? "wiz-check disabled" : "wiz-check");
    const box = el("input");
    box.type = "checkbox";
    box.checked = checked;
    box.disabled = disabled && !checked;
    box.addEventListener("change", onChange);
    row.append(box, el("span", null, label));
    return row;
  }

  function finalScores() {
    const race = byId(rules.races, selections.raceId);
    const subrace = race ? byId(race.subraces, selections.subraceId) : null;
    return applyRacialIncreases(selections.baseAbilityScores, race, subrace, selections.raceAbilityChoices);
  }

  // ---- step renderers ----

  function renderStart(body) {
    body.append(el("p", "wiz-lead", "Jump in with a ready-made hero, or build your own from the full rule set."));

    const choose = el("div", "wiz-start-actions");
    const custom = el("button", "wiz-primary");
    custom.type = "button";
    custom.textContent = "Custom Build";
    custom.addEventListener("click", () => {
      selections = createInitialSelections();
      go("race");
    });
    choose.append(custom);
    body.append(choose);

    body.append(el("h3", "wiz-subhead", "Quick Start"));
    const grid = el("div", "wiz-grid presets");
    for (const preset of presets) {
      const card = el("button", "wiz-card preset");
      card.type = "button";
      card.append(el("strong", "wiz-card-title", `${preset.label}`));
      card.append(el("span", "wiz-card-role", preset.role));
      card.append(el("span", "wiz-card-sub", preset.summary));
      card.addEventListener("click", () => {
        selections = JSON.parse(JSON.stringify(preset.selections));
        // normalise optional fields the custom flow expects
        selections.abilityAssignment = selections.abilityAssignment || {};
        selections.raceAbilityChoices = selections.raceAbilityChoices || [];
        selections.raceSkillChoices = selections.raceSkillChoices || [];
        selections.expertise = selections.expertise || [];
        selections.cantrips = selections.cantrips || [];
        selections.spells = selections.spells || [];
        selections.languageChoices = selections.languageChoices || [];
        selections.appearance = selections.appearance || "";
        go("review");
      });
      grid.append(card);
    }
    body.append(grid);
  }

  function renderRace(body) {
    body.append(el("p", "wiz-lead", "Choose a race. Some races let you choose a subrace."));
    const grid = el("div", "wiz-grid");
    for (const race of rules.races) {
      grid.append(
        selectionCard(race.label, `Speed ${race.speed} ft`, selections.raceId === race.id, () => {
          selections.raceId = race.id;
          selections.subraceId = null;
          selections.raceAbilityChoices = [];
          selections.raceSkillChoices = [];
          render();
        })
      );
    }
    body.append(grid);

    const race = byId(rules.races, selections.raceId);
    if (!race) return;

    if (race.subraces?.length) {
      body.append(el("h3", "wiz-subhead", "Subrace"));
      const sub = el("div", "wiz-grid");
      for (const subrace of race.subraces) {
        sub.append(
          selectionCard(subrace.label, null, selections.subraceId === subrace.id, () => {
            selections.subraceId = subrace.id;
            render();
          })
        );
      }
      body.append(sub);
    }

    // Half-Elf style skill choice
    if (race.skillChoices) {
      body.append(el("h3", "wiz-subhead", `Skill Versatility — choose ${race.skillChoices.choose}`));
      const opts = race.skillChoices.from === "all" ? rules.skills : rules.skills.filter((s) => race.skillChoices.from.includes(s.id));
      const list = el("div", "wiz-checklist");
      for (const skill of opts) {
        const checked = selections.raceSkillChoices.includes(skill.id);
        list.append(
          checkboxRow(skill.label, checked, selections.raceSkillChoices.length >= race.skillChoices.choose, () => {
            toggleInList(selections.raceSkillChoices, skill.id, race.skillChoices.choose);
            render();
          })
        );
      }
      body.append(list);
    }

    const traits = [...(race.traits || []), ...((byId(race.subraces, selections.subraceId)?.traits) || [])];
    if (traits.length) {
      const info = el("div", "wiz-info");
      info.append(el("h4", null, "Racial Traits"));
      const ul = el("ul");
      for (const t of traits) ul.append(el("li", null, t));
      info.append(ul);
      body.append(info);
    }
  }

  function renderClass(body) {
    body.append(el("p", "wiz-lead", "Choose a class, its skills, and (if a caster) your spells."));
    const grid = el("div", "wiz-grid");
    for (const cls of rules.classes) {
      grid.append(
        selectionCard(cls.label, `d${cls.hitDie} · ${cls.primaryAbility.toUpperCase()}`, selections.classId === cls.id, () => {
          selections.classId = cls.id;
          selections.skillChoices = [];
          selections.expertise = [];
          selections.cantrips = [];
          selections.spells = [];
          selections.equipmentChoices = {};
          render();
        })
      );
    }
    body.append(grid);

    const cls = byId(rules.classes, selections.classId);
    if (!cls) return;

    // Skill choices
    if (cls.skillChoices) {
      body.append(el("h3", "wiz-subhead", `Skills — choose ${cls.skillChoices.choose}`));
      const opts = cls.skillChoices.from === "all" ? rules.skills : rules.skills.filter((s) => cls.skillChoices.from.includes(s.id));
      const list = el("div", "wiz-checklist");
      for (const skill of opts) {
        const checked = selections.skillChoices.includes(skill.id);
        list.append(
          checkboxRow(skill.label, checked, selections.skillChoices.length >= cls.skillChoices.choose, () => {
            toggleInList(selections.skillChoices, skill.id, cls.skillChoices.choose);
            // keep expertise valid
            selections.expertise = selections.expertise.filter((id) => selections.skillChoices.includes(id));
            render();
          })
        );
      }
      body.append(list);
    }

    // Rogue expertise
    if (cls.expertiseChoose) {
      body.append(el("h3", "wiz-subhead", `Expertise — choose ${cls.expertiseChoose} of your skills`));
      const list = el("div", "wiz-checklist");
      const chosen = selections.skillChoices.length ? selections.skillChoices : [];
      for (const skillId of chosen) {
        const skill = byId(rules.skills, skillId);
        const checked = selections.expertise.includes(skillId);
        list.append(
          checkboxRow(skill?.label || skillId, checked, selections.expertise.length >= cls.expertiseChoose, () => {
            toggleInList(selections.expertise, skillId, cls.expertiseChoose);
            render();
          })
        );
      }
      if (!chosen.length) list.append(el("p", "wiz-hint", "Pick your class skills first."));
      body.append(list);
    }

    // Spellcasting
    if (cls.spellcasting) {
      const sc = cls.spellcasting;
      const cantripOpts = rules.spells.filter((s) => s.level === 0 && s.classes.includes(sc.spellListId));
      const spellOpts = rules.spells.filter((s) => s.level === 1 && s.classes.includes(sc.spellListId));

      body.append(el("h3", "wiz-subhead", `Cantrips — choose ${sc.cantrips}`));
      const cantripList = el("div", "wiz-checklist columns");
      for (const spell of cantripOpts) {
        const checked = selections.cantrips.includes(spell.id);
        cantripList.append(
          checkboxRow(spell.label, checked, selections.cantrips.length >= sc.cantrips, () => {
            toggleInList(selections.cantrips, spell.id, sc.cantrips);
            render();
          })
        );
      }
      body.append(cantripList);

      const spellLabel = sc.prepared ? `Level 1 spells — prepare ${sc.spells}` : `Level 1 spells — choose ${sc.spells}`;
      body.append(el("h3", "wiz-subhead", spellLabel));
      const spellList = el("div", "wiz-checklist columns");
      for (const spell of spellOpts) {
        const checked = selections.spells.includes(spell.id);
        spellList.append(
          checkboxRow(spell.label, checked, selections.spells.length >= sc.spells, () => {
            toggleInList(selections.spells, spell.id, sc.spells);
            render();
          })
        );
      }
      body.append(spellList);
    }

    if (cls.features?.length) {
      const info = el("div", "wiz-info");
      info.append(el("h4", null, "Level 1 Features"));
      const ul = el("ul");
      for (const f of cls.features) ul.append(el("li", null, f));
      info.append(ul);
      body.append(info);
    }
  }

  function renderBackground(body) {
    body.append(el("p", "wiz-lead", "Your background grants skills and a special feature."));
    const grid = el("div", "wiz-grid");
    for (const bg of rules.backgrounds) {
      const skills = (bg.skillProficiencies || []).map((id) => byId(rules.skills, id)?.label || id).join(", ");
      grid.append(
        selectionCard(bg.label, skills, selections.backgroundId === bg.id, () => {
          selections.backgroundId = bg.id;
          selections.personality = {};
          render();
        })
      );
    }
    body.append(grid);

    const bg = byId(rules.backgrounds, selections.backgroundId);
    if (bg?.feature) {
      const info = el("div", "wiz-info");
      info.append(el("h4", null, bg.feature.name));
      info.append(el("p", null, bg.feature.text));
      body.append(info);
    }
  }

  function renderAbilities(body) {
    const methods = rules.abilityScoreMethods;
    body.append(el("p", "wiz-lead", "Generate your six ability scores, then see racial bonuses applied."));

    // Method tabs
    const tabs = el("div", "wiz-tabs");
    for (const method of [methods.standardArray, methods.pointBuy, methods.roll]) {
      const tab = el("button", selections.abilityMethod === method.id ? "wiz-tab active" : "wiz-tab");
      tab.type = "button";
      tab.textContent = method.label;
      tab.addEventListener("click", () => {
        selections.abilityMethod = method.id;
        selections.abilityAssignment = {};
        selections.rolledPool = null;
        if (method.id === "point-buy") {
          selections.baseAbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
        } else {
          selections.baseAbilityScores = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
        }
        render();
      });
      tabs.append(tab);
    }
    body.append(tabs);

    if (selections.abilityMethod === "point-buy") {
      renderPointBuy(body, methods.pointBuy);
    } else if (selections.abilityMethod === "roll") {
      renderPoolAssign(body, selections.rolledPool, true);
    } else {
      renderPoolAssign(body, methods.standardArray.values, false);
    }

    // Live final scores
    const final = finalScores();
    const preview = el("div", "wiz-ability-preview");
    for (const id of ABILITY_IDS) {
      const cell = el("div", "wiz-ability-cell");
      cell.append(el("span", "wiz-ability-name", id.toUpperCase()));
      cell.append(el("span", "wiz-ability-final", final[id]));
      cell.append(el("span", "wiz-ability-mod", formatModifier(abilityModifier(final[id]))));
      preview.append(cell);
    }
    body.append(el("h3", "wiz-subhead", "Final Scores (with racial bonuses)"));
    body.append(preview);

    // Race ability choice (e.g. Half-Elf)
    const race = byId(rules.races, selections.raceId);
    const choiceSpec = race?.abilityChoices?.[0];
    if (choiceSpec) {
      body.append(el("h3", "wiz-subhead", `Racial Increase — choose ${choiceSpec.count} (+${choiceSpec.amount} each)`));
      const list = el("div", "wiz-checklist");
      const from = choiceSpec.from === "any" ? ABILITY_IDS : choiceSpec.from;
      for (const ab of from) {
        const checked = selections.raceAbilityChoices.includes(ab);
        list.append(
          checkboxRow(ab.toUpperCase(), checked, selections.raceAbilityChoices.length >= choiceSpec.count, () => {
            toggleInList(selections.raceAbilityChoices, ab, choiceSpec.count);
            render();
          })
        );
      }
      body.append(list);
    }
  }

  function renderPointBuy(body, spec) {
    const spent = totalPointBuyCost(selections.baseAbilityScores);
    const meter = el("div", spent > spec.budget ? "wiz-budget over" : "wiz-budget");
    meter.textContent = `Points spent: ${Number.isFinite(spent) ? spent : "—"} / ${spec.budget}`;
    body.append(meter);

    const grid = el("div", "wiz-pointbuy");
    for (const id of ABILITY_IDS) {
      const row = el("div", "wiz-pb-row");
      row.append(el("span", "wiz-pb-name", id.toUpperCase()));
      const minus = el("button", "wiz-step");
      minus.type = "button";
      minus.textContent = "−";
      minus.addEventListener("click", () => {
        selections.baseAbilityScores[id] = Math.max(spec.min, selections.baseAbilityScores[id] - 1);
        render();
      });
      const val = el("span", "wiz-pb-val", selections.baseAbilityScores[id]);
      const plus = el("button", "wiz-step");
      plus.type = "button";
      plus.textContent = "+";
      plus.addEventListener("click", () => {
        selections.baseAbilityScores[id] = Math.min(spec.max, selections.baseAbilityScores[id] + 1);
        render();
      });
      row.append(minus, val, plus);
      grid.append(row);
    }
    body.append(grid);
  }

  function renderPoolAssign(body, pool, isRoll) {
    if (isRoll && !pool) {
      const rollBtn = el("button", "wiz-primary");
      rollBtn.type = "button";
      rollBtn.textContent = "Roll 4d6 (drop lowest) ×6";
      rollBtn.addEventListener("click", () => {
        selections.rolledPool = Array.from({ length: 6 }, rollAbilityScore);
        selections.abilityAssignment = {};
        render();
      });
      body.append(rollBtn);
      return;
    }
    const usePool = pool || [];
    if (isRoll) {
      const reroll = el("button", "wiz-secondary");
      reroll.type = "button";
      reroll.textContent = "Reroll";
      reroll.addEventListener("click", () => {
        selections.rolledPool = Array.from({ length: 6 }, rollAbilityScore);
        selections.abilityAssignment = {};
        render();
      });
      body.append(reroll);
    }

    body.append(el("p", "wiz-hint", `Assign each value (${usePool.join(", ")}) to an ability.`));
    const grid = el("div", "wiz-assign");
    for (const id of ABILITY_IDS) {
      const row = el("div", "wiz-assign-row");
      row.append(el("span", "wiz-assign-name", id.toUpperCase()));
      const select = el("select", "wiz-assign-select");
      const blank = el("option", null, "—");
      blank.value = "";
      select.append(blank);
      usePool.forEach((value, index) => {
        const used = Object.entries(selections.abilityAssignment).some(
          ([ab, idx]) => idx === index && ab !== id
        );
        const opt = el("option", null, `${value}`);
        opt.value = String(index);
        if (used) opt.disabled = true;
        if (selections.abilityAssignment[id] === index) opt.selected = true;
        select.append(opt);
      });
      select.addEventListener("change", () => {
        const v = select.value;
        if (v === "") {
          delete selections.abilityAssignment[id];
        } else {
          selections.abilityAssignment[id] = Number(v);
        }
        // recompute base scores from assignment
        for (const ab of ABILITY_IDS) {
          const idx = selections.abilityAssignment[ab];
          selections.baseAbilityScores[ab] = idx == null ? 10 : usePool[idx];
        }
        render();
      });
      row.append(select);
      grid.append(row);
    }
    body.append(grid);
  }

  function renderEquipment(body) {
    const cls = byId(rules.classes, selections.classId);
    const bg = byId(rules.backgrounds, selections.backgroundId);
    if (!cls) {
      body.append(el("p", "wiz-hint", "Choose a class first."));
      return;
    }
    body.append(el("p", "wiz-lead", "Select your starting equipment options."));

    for (const group of cls.startingEquipment) {
      if (group.fixed) continue;
      body.append(el("h3", "wiz-subhead", group.label));
      const list = el("div", "wiz-radio-list");
      for (const option of group.options) {
        const id = `${group.id}-${option.id}`;
        const row = el("label", "wiz-radio");
        const input = el("input");
        input.type = "radio";
        input.name = group.id;
        input.checked = selections.equipmentChoices[group.id] === option.id;
        input.addEventListener("change", () => {
          selections.equipmentChoices[group.id] = option.id;
          render();
        });
        row.append(input, el("span", null, option.label));
        list.append(row);
      }
      body.append(list);
    }

    // Fixed / granted items, read-only
    const fixed = [];
    for (const group of cls.startingEquipment) if (group.fixed) fixed.push(...group.fixed);
    fixed.push(...(bg?.startingEquipment || []));
    if (fixed.length) {
      const info = el("div", "wiz-info");
      info.append(el("h4", null, "Also granted"));
      info.append(el("p", null, fixed.map((id) => rules.equipment[id]?.label || id).join(", ")));
      body.append(info);
    }
  }

  function renderDetails(body) {
    body.append(el("p", "wiz-lead", "Finishing touches: name, alignment, and personality."));

    const nameWrap = el("div", "wiz-field");
    nameWrap.append(el("label", null, "Name"));
    const name = el("input", "wiz-input");
    name.type = "text";
    name.maxLength = 40;
    name.value = selections.name;
    name.placeholder = "Enter your character's name";
    name.addEventListener("input", () => {
      selections.name = name.value;
      updateNav();
    });
    nameWrap.append(name);
    body.append(nameWrap);

    const alignWrap = el("div", "wiz-field");
    alignWrap.append(el("label", null, "Alignment"));
    const align = el("select", "wiz-input");
    align.append(el("option", null, "— choose —"));
    for (const a of rules.alignments) {
      const opt = el("option", null, a.label);
      opt.value = a.id;
      if (selections.alignmentId === a.id) opt.selected = true;
      align.append(opt);
    }
    align.addEventListener("change", () => {
      selections.alignmentId = align.value || null;
    });
    alignWrap.append(align);
    body.append(alignWrap);

    const appearanceWrap = el("div", "wiz-field");
    appearanceWrap.append(el("label", null, "Appearance & Habits"));
    const appearance = el("textarea", "wiz-input wiz-textarea");
    appearance.maxLength = 1200;
    appearance.value = selections.appearance || "";
    appearance.placeholder = "Size, build, hair, eyes, scars, missing digits, clothing, grooming, hygiene, speech, nervous habits, pipe smoke, leaf chewing, posture, and overall look.";
    appearance.addEventListener("input", () => {
      selections.appearance = appearance.value;
    });
    appearanceWrap.append(appearance);
    body.append(appearanceWrap);

    // Personality from background tables
    const bg = byId(rules.backgrounds, selections.backgroundId);
    const p = bg?.personality || {};
    const fields = [
      ["trait", "Personality Trait", p.traits],
      ["ideal", "Ideal", p.ideals],
      ["bond", "Bond", p.bonds],
      ["flaw", "Flaw", p.flaws]
    ];
    for (const [key, label, options] of fields) {
      const wrap = el("div", "wiz-field");
      wrap.append(el("label", null, label));
      const select = el("select", "wiz-input");
      select.append(el("option", null, "— optional —"));
      for (const value of options || []) {
        const opt = el("option", null, value);
        opt.value = value;
        if (selections.personality[key] === value) opt.selected = true;
        select.append(opt);
      }
      select.addEventListener("change", () => {
        if (select.value) selections.personality[key] = select.value;
        else delete selections.personality[key];
      });
      wrap.append(select);
      body.append(wrap);
    }
  }

  function renderReview(body) {
    const result = assembleCharacter(rules, selections);
    if (result.errors) {
      const box = el("div", "wiz-errors");
      box.append(el("h3", null, "Almost there — please resolve:"));
      const ul = el("ul");
      for (const e of result.errors) ul.append(el("li", null, e));
      box.append(ul);
      body.append(box);
      return;
    }
    const sheetWrap = el("div", "wiz-sheet");
    renderCharacterSheet(sheetWrap, result.character);
    body.append(sheetWrap);
  }

  // ---- step completeness (gates the Next button) ----

  function stepComplete(id) {
    const race = byId(rules.races, selections.raceId);
    const cls = byId(rules.classes, selections.classId);
    switch (id) {
      case "start":
        return true;
      case "race": {
        if (!race) return false;
        if (race.subraces?.length && !selections.subraceId) return false;
        if (race.skillChoices && selections.raceSkillChoices.length !== race.skillChoices.choose) return false;
        return true;
      }
      case "class": {
        if (!cls) return false;
        if (cls.skillChoices && selections.skillChoices.length !== cls.skillChoices.choose) return false;
        if (cls.expertiseChoose && selections.expertise.length !== cls.expertiseChoose) return false;
        if (cls.spellcasting) {
          if (selections.cantrips.length !== cls.spellcasting.cantrips) return false;
          if (selections.spells.length !== cls.spellcasting.spells) return false;
        }
        return true;
      }
      case "background":
        return !!selections.backgroundId;
      case "abilities": {
        const errors = validateSelections(rules, { ...selections, name: "x", classId: selections.classId || "fighter", backgroundId: selections.backgroundId || "soldier" });
        // only block on ability-related errors
        return !errors.some((e) => /point-buy|standard-array|rolled|ability score increase/i.test(e)) &&
          (selections.abilityMethod !== "roll" || !!selections.rolledPool);
      }
      case "equipment": {
        if (!cls) return false;
        return (cls.startingEquipment || []).every(
          (g) => g.fixed || byId(g.options, selections.equipmentChoices[g.id])
        );
      }
      case "details":
        return !!selections.name.trim();
      case "review":
        return validateSelections(rules, selections).length === 0;
      default:
        return true;
    }
  }

  // ---- nav + frame ----

  let navEl = null;
  function updateNav() {
    // Refresh only the nav (e.g. enable Next as the name is typed) without
    // re-rendering the step body, so the focused input keeps focus.
    const previous = navEl;
    const fresh = buildNav();
    if (previous && previous.parentNode) previous.replaceWith(fresh);
  }

  function buildNav() {
    const nav = el("div", "wiz-nav");
    navEl = nav;
    if (stepId() === "start") return nav; // start has its own actions

    const back = el("button", "wiz-secondary");
    back.type = "button";
    back.textContent = stepIndex <= 1 ? "Start Over" : "Back";
    back.addEventListener("click", () => {
      stepIndex = Math.max(0, stepIndex - 1);
      render();
    });
    nav.append(back);

    if (stepId() === "review") {
      const begin = el("button", "wiz-primary");
      begin.type = "button";
      begin.textContent = "Begin Adventure";
      begin.disabled = !stepComplete("review");
      begin.addEventListener("click", () => {
        const result = assembleCharacter(rules, selections);
        if (!result.errors) onComplete(result.character);
      });
      nav.append(begin);
    } else {
      const next = el("button", "wiz-primary");
      next.type = "button";
      next.textContent = "Next";
      next.disabled = !stepComplete(stepId());
      next.addEventListener("click", () => {
        stepIndex = Math.min(STEPS.length - 1, stepIndex + 1);
        render();
      });
      nav.append(next);
    }
    return nav;
  }

  function buildStepIndicator() {
    const bar = el("div", "wiz-steps");
    STEPS.forEach((step, i) => {
      const dot = el("span", i === stepIndex ? "wiz-step-dot active" : i < stepIndex ? "wiz-step-dot done" : "wiz-step-dot");
      dot.textContent = step.title;
      bar.append(dot);
    });
    return bar;
  }

  function render() {
    const frame = el("div", "wiz-frame");
    const header = el("div", "wiz-header");
    header.append(el("p", "char-era", "1496 DR - Sea of Fallen Stars"));
    header.append(el("h1", null, "Create Your Adventurer"));
    frame.append(header);
    frame.append(buildStepIndicator());

    const body = el("div", "wiz-body");
    const renderer = {
      start: renderStart,
      race: renderRace,
      class: renderClass,
      background: renderBackground,
      abilities: renderAbilities,
      equipment: renderEquipment,
      details: renderDetails,
      review: renderReview
    }[stepId()];
    renderer(body);
    frame.append(body);
    frame.append(buildNav());

    mount.replaceChildren(frame);
  }

  render();
}
