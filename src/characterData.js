// Backwards-compatible shim. The character dataset now lives in src/character/.
// Existing importers of `races`/`classes`/`backgrounds` keep working; new code
// should import from "./character/index.js" for the full rule set.
export { races, classes, backgrounds } from "./character/index.js";
export { characterRules } from "./character/index.js";
