// Aggregates the SRD character dataset into a single `characterRules` object
// served to the browser via GET /api/character-options. The pure builder in
// public/character/builder.js consumes exactly this shape.

import { races } from "./races.js";
import { classes } from "./classes.js";
import { backgrounds } from "./backgrounds.js";
import { spells } from "./spells.js";
import { equipment } from "./equipment.js";
import {
  abilities,
  skills,
  alignments,
  languages,
  abilityScoreMethods
} from "./reference.js";

export const characterRules = {
  abilities,
  skills,
  alignments,
  languages,
  abilityScoreMethods,
  races,
  classes,
  backgrounds,
  spells,
  equipment
};

export { races, classes, backgrounds, spells, equipment };
export {
  abilities,
  skills,
  alignments,
  languages,
  abilityScoreMethods
} from "./reference.js";
