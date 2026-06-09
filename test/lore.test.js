import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { loadLoreCodex, parseLoreCodex, playerFacingCodexMarkdown } from "../src/lore.js";
import { assertNoScaffoldLeak } from "./scaffoldSafety.js";

test("codex markdown strips the internal appendix", async () => {
  const markdown = await readFile("codex_inner_sea_1496DR.md", "utf8");
  const safeMarkdown = playerFacingCodexMarkdown(markdown);

  assert.equal(/^# INTERNAL APPENDIX/m.test(safeMarkdown), false);
  assert.equal(safeMarkdown.includes("STRIP FROM ALL PLAYER BUILDS"), false);
});

test("codex parser returns player-facing sections only", async () => {
  const codex = await loadLoreCodex(process.cwd());
  const sectionTitles = codex.sections.map((section) => section.title);

  assert.ok(codex.title.includes("CODEX OF THE INNER SEA"));
  assert.ok(sectionTitles.includes("THE STATE OF THE WORLD"));
  assert.ok(sectionTitles.includes("THAY — THE REALM OF THE RED WIZARDS"));
  assert.equal(sectionTitles.some((title) => title.includes("INTERNAL")), false);
  assertNoScaffoldLeak(codex);
});

test("codex parser sanitizes scaffold-adjacent wording in body text", () => {
  const codex = parseLoreCodex("## MAZTICA\nAztec lands across the New World.");

  assert.deepEqual(codex.sections[0].paragraphs, ["Maztican lands across the True World."]);
});
