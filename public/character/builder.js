// Pure, data-injected D&D 5e (SRD) level-1 character builder. No imports: every
// function takes the rules dataset (from /api/character-options) and a
// selections object, so the same code runs in the browser (live previews) and
// in Node tests. Lives in public/ — mirroring public/time.js — so the browser
// loads it directly and tests import it via ../../public/character/builder.js.
//
// Selections contract (all ids match the dataset):
//   {
//     name, gender, age,
//     raceId, subraceId,
//     classId,
//     backgroundId,
//     abilityMethod,                      // "standard-array" | "point-buy" | "roll"
//     baseAbilityScores: { str,dex,con,int,wis,cha },   // BEFORE racial increases
//     raceAbilityChoices: ["str", ...],   // targets for a race's abilityChoices
//     skillChoices: [...],                // class skill picks
//     raceSkillChoices: [...],            // race skill picks (e.g. Half-Elf)
//     expertise: [...],                   // rogue expertise picks
//     cantrips: [...], spells: [...],     // caster picks (level 1)
//     equipmentChoices: { groupId: optionId },
//     languageChoices: [...],
//     alignmentId,
//     personality: { trait, ideal, bond, flaw }
//   }

const ABILITY_IDS = ["str", "dex", "con", "int", "wis", "cha"];

function byId(list, id) {
  return (list || []).find((entry) => entry.id === id) || null;
}

export function abilityModifier(score) {
  return Math.floor((Number(score) - 10) / 2);
}

export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Proficiency bonus by level (level 1 = +2). Formula supports future levels.
export function proficiencyBonus(level = 1) {
  return 2 + Math.floor((level - 1) / 4);
}

export function pointBuyCost(score) {
  const table = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  return table[score];
}

export function totalPointBuyCost(scores) {
  return ABILITY_IDS.reduce((sum, id) => {
    const cost = pointBuyCost(scores?.[id]);
    return sum + (Number.isFinite(cost) ? cost : Number.POSITIVE_INFINITY);
  }, 0);
}

// Combine race + subrace fixed increases and the player's chosen targets.
export function applyRacialIncreases(baseScores, race, subrace, raceAbilityChoices = []) {
  const result = {};
  for (const id of ABILITY_IDS) {
    result[id] = Number(baseScores?.[id]) || 0;
    if (race?.abilityIncreases?.[id]) result[id] += race.abilityIncreases[id];
    if (subrace?.abilityIncreases?.[id]) result[id] += subrace.abilityIncreases[id];
  }
  const choiceSpec = race?.abilityChoices?.[0];
  const amount = choiceSpec?.amount ?? 1;
  for (const target of raceAbilityChoices) {
    if (ABILITY_IDS.includes(target)) result[target] += amount;
  }
  return result;
}

// Resolve race + chosen subrace into one merged descriptor for convenience.
function resolveRace(rules, selections) {
  const race = byId(rules.races, selections.raceId);
  const subrace = race ? byId(race.subraces, selections.subraceId) : null;
  return { race, subrace };
}

function resolveEquipmentItems(rules, cls, background, equipmentChoices = {}) {
  const itemIds = [];
  for (const group of cls?.startingEquipment || []) {
    if (group.fixed) {
      itemIds.push(...group.fixed);
      continue;
    }
    const option = byId(group.options, equipmentChoices[group.id]);
    if (option) itemIds.push(...option.items);
  }
  itemIds.push(...(background?.startingEquipment || []));

  // Collapse duplicates into { item, quantity } preserving first-seen order.
  const counts = new Map();
  for (const id of itemIds) {
    counts.set(id, (counts.get(id) || 0) + 1);
  }
  return [...counts.entries()].map(([id, quantity]) => ({
    id,
    label: rules.equipment?.[id]?.label || id,
    quantity,
    item: rules.equipment?.[id] || null
  }));
}

function computeArmorClass(resolvedItems, mods, unarmoredDefense) {
  let bodyArmor = null;
  let hasShield = false;
  for (const entry of resolvedItems) {
    const item = entry.item;
    if (!item || item.category !== "armor") continue;
    if (item.armorType === "shield") hasShield = true;
    else if (!bodyArmor) bodyArmor = item;
  }

  let base;
  if (bodyArmor) {
    const rule = bodyArmor.ac;
    if (rule.type === "flat") base = rule.base;
    else if (rule.type === "dex") base = rule.base + mods.dex;
    else if (rule.type === "dex-capped") base = rule.base + Math.min(mods.dex, rule.maxBonus);
    else base = 10 + mods.dex;
  } else if (unarmoredDefense) {
    base = 10 + unarmoredDefense.abilities.reduce((sum, ab) => sum + (mods[ab] || 0), 0);
  } else {
    base = 10 + mods.dex;
  }
  return base + (hasShield ? 2 : 0);
}

// Validate selections; returns an array of human-readable problem strings.
export function validateSelections(rules, selections) {
  const errors = [];
  if (!selections) return ["No selections provided."];

  if (!selections.name || !selections.name.trim()) errors.push("Enter a character name.");

  const { race, subrace } = resolveRace(rules, selections);
  const cls = byId(rules.classes, selections.classId);
  const background = byId(rules.backgrounds, selections.backgroundId);

  if (!race) errors.push("Choose a race.");
  if (race && race.subraces?.length && !subrace) errors.push(`Choose a ${race.label} subrace.`);
  if (!cls) errors.push("Choose a class.");
  if (!background) errors.push("Choose a background.");

  // Ability scores
  const base = selections.baseAbilityScores || {};
  const method = selections.abilityMethod;
  const methods = rules.abilityScoreMethods || {};
  if (!method) {
    errors.push("Choose an ability score method.");
  } else if (method === methods.standardArray?.id) {
    const expected = [...methods.standardArray.values].sort((a, b) => a - b).join(",");
    const got = ABILITY_IDS.map((id) => Number(base[id])).sort((a, b) => a - b).join(",");
    if (expected !== got) errors.push("Assign each standard-array value exactly once.");
  } else if (method === methods.pointBuy?.id) {
    const m = methods.pointBuy;
    for (const id of ABILITY_IDS) {
      const v = Number(base[id]);
      if (!(v >= m.min && v <= m.max)) errors.push(`Point-buy scores must be ${m.min}–${m.max}.`);
    }
    const cost = totalPointBuyCost(base);
    if (cost > m.budget) errors.push(`Point-buy spends ${cost}/${m.budget} points — over budget.`);
  } else if (method === methods.roll?.id) {
    const m = methods.roll;
    for (const id of ABILITY_IDS) {
      const v = Number(base[id]);
      if (!(v >= m.min && v <= m.max)) errors.push(`Rolled scores must be ${m.min}–${m.max}.`);
    }
  }

  // Race ability choices (e.g., Half-Elf picks two)
  const choiceSpec = race?.abilityChoices?.[0];
  if (choiceSpec) {
    const picks = selections.raceAbilityChoices || [];
    if (picks.length !== choiceSpec.count) {
      errors.push(`Pick ${choiceSpec.count} ability score increase(s) for your race.`);
    } else if (new Set(picks).size !== picks.length) {
      errors.push("Race ability increases must target different abilities.");
    }
  }

  // Class skill choices
  if (cls?.skillChoices) {
    const picks = selections.skillChoices || [];
    if (picks.length !== cls.skillChoices.choose) {
      errors.push(`Choose ${cls.skillChoices.choose} class skill(s).`);
    } else if (new Set(picks).size !== picks.length) {
      errors.push("Class skill choices must be different skills.");
    }
  }

  // Race skill choices (Half-Elf versatility)
  if (race?.skillChoices) {
    const picks = selections.raceSkillChoices || [];
    if (picks.length !== race.skillChoices.choose) {
      errors.push(`Choose ${race.skillChoices.choose} skill(s) from your race.`);
    }
  }

  // Rogue expertise
  if (cls?.expertiseChoose) {
    const picks = selections.expertise || [];
    if (picks.length !== cls.expertiseChoose) {
      errors.push(`Choose ${cls.expertiseChoose} expertise skill(s).`);
    }
  }

  // Spellcasting picks
  if (cls?.spellcasting) {
    const sc = cls.spellcasting;
    const cantrips = selections.cantrips || [];
    const spells = selections.spells || [];
    if (cantrips.length !== sc.cantrips) errors.push(`Choose ${sc.cantrips} cantrip(s).`);
    if (spells.length !== sc.spells) errors.push(`Choose ${sc.spells} level-1 spell(s).`);
  }

  // Equipment: every choice group needs a pick
  for (const group of cls?.startingEquipment || []) {
    if (group.fixed) continue;
    if (!byId(group.options, selections.equipmentChoices?.[group.id])) {
      errors.push(`Choose an option for ${group.label || "starting equipment"}.`);
    }
  }

  return errors;
}

// Build the full character sheet. Returns { character } or { errors }.
export function assembleCharacter(rules, selections) {
  const errors = validateSelections(rules, selections);
  if (errors.length) return { errors };

  const { race, subrace } = resolveRace(rules, selections);
  const cls = byId(rules.classes, selections.classId);
  const background = byId(rules.backgrounds, selections.backgroundId);
  const profBonus = proficiencyBonus(1);

  const finalScores = applyRacialIncreases(
    selections.baseAbilityScores,
    race,
    subrace,
    selections.raceAbilityChoices
  );
  const mods = {};
  for (const id of ABILITY_IDS) mods[id] = abilityModifier(finalScores[id]);

  // Hit points: max hit die + CON mod (+ subrace bonus per level, e.g. Hill Dwarf)
  const hpBonusPerLevel = subrace?.hpBonusPerLevel || race?.hpBonusPerLevel || 0;
  const hitPoints = cls.hitDie + mods.con + hpBonusPerLevel;

  // Skill proficiencies from class + background + race
  const profSkills = new Set([
    ...(selections.skillChoices || []),
    ...(selections.raceSkillChoices || []),
    ...(background.skillProficiencies || []),
    ...(race.skillProficiencies || [])
  ]);
  const expertiseSkills = new Set(selections.expertise || []);

  const skills = rules.skills.map((skill) => {
    const proficient = profSkills.has(skill.id);
    const expert = expertiseSkills.has(skill.id);
    const bonus =
      mods[skill.ability] + (proficient ? profBonus : 0) + (expert ? profBonus : 0);
    return { id: skill.id, label: skill.label, ability: skill.ability, proficient, expert, bonus };
  });

  const savingThrows = ABILITY_IDS.map((id) => {
    const proficient = (cls.savingThrows || []).includes(id);
    return {
      ability: id,
      proficient,
      bonus: mods[id] + (proficient ? profBonus : 0)
    };
  });

  const resolvedItems = resolveEquipmentItems(rules, cls, background, selections.equipmentChoices);
  const armorClass = computeArmorClass(resolvedItems, mods, cls.unarmoredDefense);
  const passivePerception =
    10 + (skills.find((s) => s.id === "perception")?.bonus || 0);

  // Languages: race + background grants + chosen
  const languages = [
    ...new Set([
      ...(race.languages || []),
      ...(selections.languageChoices || [])
    ])
  ];

  // Spellcasting block for casters
  let spellcasting = null;
  if (cls.spellcasting) {
    const ability = cls.spellcasting.ability;
    const spellMod = mods[ability];
    const labelFor = (id) => byId(rules.spells, id)?.label || id;
    spellcasting = {
      ability,
      spellSaveDC: 8 + profBonus + spellMod,
      spellAttackBonus: profBonus + spellMod,
      prepared: !!cls.spellcasting.prepared,
      cantrips: (selections.cantrips || []).map((id) => ({ id, label: labelFor(id) })),
      spells: (selections.spells || []).map((id) => ({ id, label: labelFor(id) }))
    };
  }

  const proficiencies = {
    armor: [...(cls.armorProficiencies || [])],
    weapons: [
      ...new Set([...(cls.weaponProficiencies || []), ...(race.weaponProficiencies || [])])
    ],
    tools: [
      ...new Set([
        ...(cls.toolProficiencies || []),
        ...(background.toolProficiencies || [])
      ])
    ]
  };

  const features = [
    ...(cls.features || []),
    ...(race.traits || []),
    ...(subrace?.traits || []),
    background.feature ? `${background.feature.name}: ${background.feature.text}` : null
  ].filter(Boolean);

  const character = {
    name: selections.name.trim(),
    gender: selections.gender || null,
    age: selections.age || null,
    level: 1,
    race: { id: race.id, label: race.label, size: race.size, speed: subrace?.speed || race.speed, darkvision: subrace?.darkvision || race.darkvision || 0 },
    subrace: subrace ? { id: subrace.id, label: subrace.label } : null,
    class: { id: cls.id, label: cls.label, hitDie: cls.hitDie },
    background: { id: background.id, label: background.label, feature: background.feature },
    alignment: byId(rules.alignments, selections.alignmentId) || null,
    abilityScores: finalScores,
    abilityModifiers: mods,
    proficiencyBonus: profBonus,
    hitPoints,
    armorClass,
    initiative: mods.dex,
    speed: subrace?.speed || race.speed,
    savingThrows,
    skills,
    passivePerception,
    languages,
    proficiencies,
    equipment: resolvedItems.map(({ id, label, quantity }) => ({ id, label, quantity })),
    spellcasting,
    features,
    personality: selections.personality || {}
  };

  return { character };
}
