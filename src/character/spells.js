// SRD cantrips (level 0) and level-1 spells, each tagged with the classes whose
// spell list it appears on. The builder filters by the class's `spellListId`
// and spell level so each caster sees only legal choices at character creation.

export const spells = [
  // ---- Cantrips ----
  { id: "acid-splash", label: "Acid Splash", level: 0, school: "Conjuration", classes: ["sorcerer", "wizard"] },
  { id: "chill-touch", label: "Chill Touch", level: 0, school: "Necromancy", classes: ["sorcerer", "warlock", "wizard"] },
  { id: "dancing-lights", label: "Dancing Lights", level: 0, school: "Evocation", classes: ["bard", "sorcerer", "wizard"] },
  { id: "druidcraft", label: "Druidcraft", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "eldritch-blast", label: "Eldritch Blast", level: 0, school: "Evocation", classes: ["warlock"] },
  { id: "fire-bolt", label: "Fire Bolt", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"] },
  { id: "guidance", label: "Guidance", level: 0, school: "Divination", classes: ["cleric", "druid"] },
  { id: "light", label: "Light", level: 0, school: "Evocation", classes: ["bard", "cleric", "sorcerer", "wizard"] },
  { id: "mage-hand", label: "Mage Hand", level: 0, school: "Conjuration", classes: ["bard", "sorcerer", "warlock", "wizard"] },
  { id: "mending", label: "Mending", level: 0, school: "Transmutation", classes: ["bard", "cleric", "druid", "sorcerer", "wizard"] },
  { id: "message", label: "Message", level: 0, school: "Transmutation", classes: ["bard", "sorcerer", "wizard"] },
  { id: "minor-illusion", label: "Minor Illusion", level: 0, school: "Illusion", classes: ["bard", "sorcerer", "warlock", "wizard"] },
  { id: "poison-spray", label: "Poison Spray", level: 0, school: "Conjuration", classes: ["druid", "sorcerer", "warlock", "wizard"] },
  { id: "prestidigitation", label: "Prestidigitation", level: 0, school: "Transmutation", classes: ["bard", "sorcerer", "warlock", "wizard"] },
  { id: "produce-flame", label: "Produce Flame", level: 0, school: "Conjuration", classes: ["druid"] },
  { id: "ray-of-frost", label: "Ray of Frost", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"] },
  { id: "resistance", label: "Resistance", level: 0, school: "Abjuration", classes: ["cleric", "druid"] },
  { id: "sacred-flame", label: "Sacred Flame", level: 0, school: "Evocation", classes: ["cleric"] },
  { id: "shillelagh", label: "Shillelagh", level: 0, school: "Transmutation", classes: ["druid"] },
  { id: "shocking-grasp", label: "Shocking Grasp", level: 0, school: "Evocation", classes: ["sorcerer", "wizard"] },
  { id: "spare-the-dying", label: "Spare the Dying", level: 0, school: "Necromancy", classes: ["cleric"] },
  { id: "thaumaturgy", label: "Thaumaturgy", level: 0, school: "Transmutation", classes: ["cleric"] },
  { id: "true-strike", label: "True Strike", level: 0, school: "Divination", classes: ["bard", "sorcerer", "warlock", "wizard"] },
  { id: "vicious-mockery", label: "Vicious Mockery", level: 0, school: "Enchantment", classes: ["bard"] },

  // ---- 1st-level spells ----
  { id: "bless", label: "Bless", level: 1, school: "Enchantment", classes: ["cleric", "paladin"] },
  { id: "burning-hands", label: "Burning Hands", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"] },
  { id: "charm-person", label: "Charm Person", level: 1, school: "Enchantment", classes: ["bard", "druid", "sorcerer", "warlock", "wizard"] },
  { id: "color-spray", label: "Color Spray", level: 1, school: "Illusion", classes: ["sorcerer", "wizard"] },
  { id: "command", label: "Command", level: 1, school: "Enchantment", classes: ["cleric", "paladin"] },
  { id: "comprehend-languages", label: "Comprehend Languages", level: 1, school: "Divination", classes: ["bard", "sorcerer", "warlock", "wizard"] },
  { id: "cure-wounds", label: "Cure Wounds", level: 1, school: "Evocation", classes: ["bard", "cleric", "druid", "paladin", "ranger"] },
  { id: "detect-magic", label: "Detect Magic", level: 1, school: "Divination", classes: ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "wizard"] },
  { id: "disguise-self", label: "Disguise Self", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "wizard"] },
  { id: "entangle", label: "Entangle", level: 1, school: "Conjuration", classes: ["druid"] },
  { id: "expeditious-retreat", label: "Expeditious Retreat", level: 1, school: "Transmutation", classes: ["sorcerer", "warlock", "wizard"] },
  { id: "faerie-fire", label: "Faerie Fire", level: 1, school: "Evocation", classes: ["bard", "druid"] },
  { id: "false-life", label: "False Life", level: 1, school: "Necromancy", classes: ["sorcerer", "wizard"] },
  { id: "feather-fall", label: "Feather Fall", level: 1, school: "Transmutation", classes: ["bard", "sorcerer", "wizard"] },
  { id: "find-familiar", label: "Find Familiar", level: 1, school: "Conjuration", classes: ["wizard"] },
  { id: "fog-cloud", label: "Fog Cloud", level: 1, school: "Conjuration", classes: ["druid", "ranger", "sorcerer", "wizard"] },
  { id: "goodberry", label: "Goodberry", level: 1, school: "Transmutation", classes: ["druid", "ranger"] },
  { id: "grease", label: "Grease", level: 1, school: "Conjuration", classes: ["wizard"] },
  { id: "guiding-bolt", label: "Guiding Bolt", level: 1, school: "Evocation", classes: ["cleric"] },
  { id: "healing-word", label: "Healing Word", level: 1, school: "Evocation", classes: ["bard", "cleric", "druid"] },
  { id: "heroism", label: "Heroism", level: 1, school: "Enchantment", classes: ["bard", "paladin"] },
  { id: "hideous-laughter", label: "Hideous Laughter", level: 1, school: "Enchantment", classes: ["bard", "wizard"] },
  { id: "hunters-mark", label: "Hunter's Mark", level: 1, school: "Divination", classes: ["ranger"] },
  { id: "identify", label: "Identify", level: 1, school: "Divination", classes: ["bard", "wizard"] },
  { id: "inflict-wounds", label: "Inflict Wounds", level: 1, school: "Necromancy", classes: ["cleric"] },
  { id: "jump", label: "Jump", level: 1, school: "Transmutation", classes: ["druid", "ranger", "sorcerer", "wizard"] },
  { id: "mage-armor", label: "Mage Armor", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"] },
  { id: "magic-missile", label: "Magic Missile", level: 1, school: "Evocation", classes: ["sorcerer", "wizard"] },
  { id: "protection-from-evil-and-good", label: "Protection from Evil and Good", level: 1, school: "Abjuration", classes: ["cleric", "paladin", "warlock", "wizard"] },
  { id: "purify-food-and-drink", label: "Purify Food and Drink", level: 1, school: "Transmutation", classes: ["cleric", "druid", "paladin"] },
  { id: "ray-of-sickness", label: "Ray of Sickness", level: 1, school: "Necromancy", classes: ["sorcerer", "wizard"] },
  { id: "sanctuary", label: "Sanctuary", level: 1, school: "Abjuration", classes: ["cleric"] },
  { id: "shield", label: "Shield", level: 1, school: "Abjuration", classes: ["sorcerer", "wizard"] },
  { id: "shield-of-faith", label: "Shield of Faith", level: 1, school: "Abjuration", classes: ["cleric", "paladin"] },
  { id: "silent-image", label: "Silent Image", level: 1, school: "Illusion", classes: ["bard", "sorcerer", "wizard"] },
  { id: "sleep", label: "Sleep", level: 1, school: "Enchantment", classes: ["bard", "sorcerer", "wizard"] },
  { id: "speak-with-animals", label: "Speak with Animals", level: 1, school: "Divination", classes: ["bard", "druid", "ranger"] },
  { id: "thunderwave", label: "Thunderwave", level: 1, school: "Evocation", classes: ["bard", "druid", "sorcerer", "wizard"] },
  { id: "unseen-servant", label: "Unseen Servant", level: 1, school: "Conjuration", classes: ["bard", "warlock", "wizard"] },
  { id: "witch-bolt", label: "Witch Bolt", level: 1, school: "Evocation", classes: ["sorcerer", "warlock", "wizard"] }
];

export const spellIds = spells.map((spell) => spell.id);

// Convenience: spells available to a given class spell list at a given level.
export function spellsFor(spellListId, level) {
  return spells.filter(
    (spell) => spell.level === level && spell.classes.includes(spellListId)
  );
}
