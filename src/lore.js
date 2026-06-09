import { readFile } from "node:fs/promises";
import { join } from "node:path";

const INTERNAL_APPENDIX_MARKER = "# INTERNAL APPENDIX";
const PRESENTATION_REPLACEMENTS = [
  [/\bAztec\b/g, "Maztican"],
  [/\bNew World\b/g, "True World"]
];

function cleanInlineMarkdown(text) {
  const cleaned = text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();

  return PRESENTATION_REPLACEMENTS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    cleaned
  );
}

function isContentLine(line) {
  return line.trim() && !line.startsWith("---") && !line.startsWith(">");
}

export function playerFacingCodexMarkdown(markdown) {
  const markerIndex = markdown.indexOf(INTERNAL_APPENDIX_MARKER);
  return markerIndex === -1 ? markdown : markdown.slice(0, markerIndex);
}

export function parseLoreCodex(markdown) {
  const safeMarkdown = playerFacingCodexMarkdown(markdown);
  const lines = safeMarkdown.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# "));
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentSection = {
        id: line
          .replace(/^##\s+/, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
        title: cleanInlineMarkdown(line.replace(/^##\s+/, "")),
        paragraphs: []
      };
      sections.push(currentSection);
      continue;
    }

    if (!currentSection || !isContentLine(line)) {
      continue;
    }

    currentSection.paragraphs.push(cleanInlineMarkdown(line));
  }

  return {
    title: titleLine ? cleanInlineMarkdown(titleLine.replace(/^#\s+/, "")) : "Codex",
    sections: sections.filter((section) => section.paragraphs.length > 0)
  };
}

export async function loadLoreCodex(rootDir) {
  const markdown = await readFile(join(rootDir, "codex_inner_sea_1496DR.md"), "utf8");
  return parseLoreCodex(markdown);
}
