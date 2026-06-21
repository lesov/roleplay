// Six ready-made level-1 characters for the wizard's Quick Start screen. Each is
// a full *selections* object (same contract the custom builder produces), so the
// browser and tests run them through the identical assembleCharacter() path —
// presets are validated exactly like hand-built characters.

export const presets = [
  {
    id: "human-fighter",
    label: "Sir Garrick",
    role: "Martial Defender",
    summary: "A disciplined Human Fighter and former soldier — sword, shield, and steady nerves.",
    selections: {
      name: "Sir Garrick",
      raceId: "human",
      classId: "fighter",
      backgroundId: "soldier",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 15, dex: 13, con: 14, int: 10, wis: 12, cha: 8 },
      skillChoices: ["athletics", "perception"],
      languageChoices: ["dwarvish"],
      equipmentChoices: { armor: "chain-mail", weapon: "martial-shield", ranged: "handaxes", pack: "explorers" },
      alignmentId: "lawful-good",
      appearance: "Broad-shouldered and square-jawed, Garrick keeps his dark hair cropped close and his beard shaved to stubble. A pale saber scar cuts across his left cheek, his shield hand is missing the tip of one finger, and his kit is brushed clean even when the road is mud. He stands at attention without noticing it and checks doorways before he sits.",
      personality: {
        trait: "I'm always polite and respectful.",
        ideal: "Responsibility: I do what I must and obey just authority.",
        bond: "I would still lay down my life for the people I served with.",
        flaw: "My hatred of my enemies is blinding and unreasoning."
      }
    }
  },
  {
    id: "hill-dwarf-cleric",
    label: "Brother Dural",
    role: "Divine Healer",
    summary: "A steadfast Hill Dwarf Cleric of the Life domain — mace, shield, and restoring light.",
    selections: {
      name: "Brother Dural",
      raceId: "dwarf",
      subraceId: "hill-dwarf",
      classId: "cleric",
      backgroundId: "acolyte",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 13, dex: 10, con: 14, int: 8, wis: 15, cha: 12 },
      skillChoices: ["history", "medicine"],
      cantrips: ["sacred-flame", "guidance", "light"],
      spells: ["cure-wounds", "bless", "guiding-bolt", "healing-word"],
      languageChoices: ["celestial", "infernal"],
      equipmentChoices: { weapon: "mace", armor: "scale", ranged: "crossbow", pack: "priests" },
      alignmentId: "lawful-good",
      appearance: "Dural is stout even for a dwarf, with warm brown eyes, a copper beard braided around small brass prayer rings, and hands scrubbed raw from temple work. His vestments smell faintly of clean wool, beeswax, and incense. He taps two fingers against his holy symbol before speaking and hums old hymns while tending wounds.",
      personality: {
        trait: "I see omens in every event and action.",
        ideal: "Charity: I always try to help those in need.",
        bond: "I owe my life to the priest who took me in when my parents died.",
        flaw: "I put too much trust in those who wield power within my temple's hierarchy."
      }
    }
  },
  {
    id: "high-elf-wizard",
    label: "Aelar Moonwhisper",
    role: "Arcane Caster",
    summary: "A studious High Elf Wizard and sage — fire bolt, magic missile, and a well-worn spellbook.",
    selections: {
      name: "Aelar Moonwhisper",
      raceId: "elf",
      subraceId: "high-elf",
      classId: "wizard",
      backgroundId: "sage",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 },
      skillChoices: ["arcana", "investigation"],
      cantrips: ["fire-bolt", "mage-hand", "light"],
      spells: ["magic-missile", "shield", "mage-armor", "sleep", "detect-magic", "identify"],
      languageChoices: ["draconic", "dwarvish"],
      equipmentChoices: { weapon: "quarterstaff", focus: "arcane", pack: "scholars" },
      alignmentId: "neutral-good",
      appearance: "Aelar is tall and slender, with moon-pale hair, gray-violet eyes, and ink stains that never quite leave his fingertips. His robes are neatly patched rather than fine, and a thin burn scar marks one wrist from an experiment gone wrong. He speaks with careful precision, blinks slowly when interrupted, and absentmindedly smells old parchment before reading it.",
      personality: {
        trait: "I use polysyllabic words that convey the impression of great erudition.",
        ideal: "Knowledge: The path to power and self-improvement is through knowledge.",
        bond: "I've been searching my whole life for the answer to a certain question.",
        flaw: "I am easily distracted by the promise of information."
      }
    }
  },
  {
    id: "lightfoot-halfling-rogue",
    label: "Pippa Underbough",
    role: "Skirmisher / Skill",
    summary: "A nimble Lightfoot Halfling Rogue with a criminal past — daggers, stealth, and quick fingers.",
    selections: {
      name: "Pippa Underbough",
      raceId: "halfling",
      subraceId: "lightfoot",
      classId: "rogue",
      backgroundId: "criminal",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 8, dex: 15, con: 14, int: 12, wis: 10, cha: 13 },
      skillChoices: ["stealth", "perception", "acrobatics", "investigation"],
      expertise: ["stealth", "perception"],
      equipmentChoices: { weapon: "rapier", ranged: "shortbow", pack: "burglars" },
      alignmentId: "chaotic-neutral",
      appearance: "Pippa is small even by halfling standards, with sharp hazel eyes, chestnut curls tucked under a soft cap, and a nicked left ear she hides when nervous. Her clothes are tidy but full of hidden pockets, and one glove covers a crooked little finger that healed badly. She picks at loose threads, grins too quickly, and can never keep her hands still around valuables.",
      personality: {
        trait: "I always have a plan for what to do when things go wrong.",
        ideal: "Freedom: Chains are meant to be broken.",
        bond: "Someone I loved died because of a mistake I made. That will never happen again.",
        flaw: "When I see something valuable, I can't think about anything but how to steal it."
      }
    }
  },
  {
    id: "half-elf-bard",
    label: "Lyric Vance",
    role: "Support Caster",
    summary: "A charming Half-Elf Bard and entertainer — rapier, lute, and songs that mend or mock.",
    selections: {
      name: "Lyric Vance",
      raceId: "half-elf",
      classId: "bard",
      backgroundId: "entertainer",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 8, dex: 14, con: 13, int: 10, wis: 12, cha: 15 },
      raceAbilityChoices: ["dex", "con"],
      raceSkillChoices: ["perception", "insight"],
      skillChoices: ["persuasion", "deception", "acrobatics"],
      cantrips: ["vicious-mockery", "mage-hand"],
      spells: ["cure-wounds", "healing-word", "charm-person", "faerie-fire"],
      languageChoices: ["elvish"],
      equipmentChoices: { weapon: "rapier", pack: "entertainers" },
      alignmentId: "chaotic-good",
      appearance: "Lyric has bright green eyes, warm brown skin, and black hair worn in oiled waves pinned with tiny silver bells. Their clothes are colorful, mended with theatrical flair, and usually carry a trace of rose perfume and pipe smoke. They polish their nails before performances, practice smiles in reflective glass, and stammer only when speaking honestly.",
      personality: {
        trait: "I know a story relevant to almost every situation.",
        ideal: "Beauty: When I perform, I make the world better than it was.",
        bond: "My instrument is my most treasured possession.",
        flaw: "I'll do anything to win fame and renown."
      }
    }
  },
  {
    id: "half-orc-barbarian",
    label: "Grosh Ironhide",
    role: "Frontline Bruiser",
    summary: "A towering Half-Orc Barbarian from the wilds — greataxe, rage, and raw endurance.",
    selections: {
      name: "Grosh Ironhide",
      raceId: "half-orc",
      classId: "barbarian",
      backgroundId: "outlander",
      abilityMethod: "standard-array",
      baseAbilityScores: { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
      skillChoices: ["athletics", "survival"],
      languageChoices: ["giant"],
      equipmentChoices: { "weapon-a": "greataxe", "weapon-b": "handaxes" },
      alignmentId: "chaotic-neutral",
      appearance: "Grosh towers over most folk, with gray-green skin, heavy tusks, amber eyes, and a broken nose that never set straight. Old claw marks cross his ribs and one ear is torn nearly in half. He smells of smoke, sweat, and crushed bitterleaf, which he chews when thinking, and he scratches at old scars whenever a room gets too quiet.",
      personality: {
        trait: "I'm driven by a wanderlust that led me away from home.",
        ideal: "Glory: I must earn glory in battle, for myself and my clan.",
        bond: "My family, clan, or tribe is the most important thing in my life.",
        flaw: "I remember every insult and nurse a silent resentment."
      }
    }
  }
];

export const presetIds = presets.map((preset) => preset.id);
