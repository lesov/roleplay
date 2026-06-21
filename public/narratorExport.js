const DEFAULT_SCENE_INSTRUCTION =
  "Use this context to write a verbose, richly detailed, sensory fantasy narration of the party as they are right now. Preserve facts exactly; embellish only atmosphere, body language, mood, and sensory details.";

function line(label, value) {
  if (value == null || value === "") return null;
  return `${label}: ${value}`;
}

function listSection(title, entries, emptyText = "None known.") {
  const lines = [`## ${title}`];
  const filtered = (entries || []).filter(Boolean);
  if (filtered.length) {
    lines.push(...filtered.map((entry) => `- ${entry}`));
  } else {
    lines.push(`- ${emptyText}`);
  }
  return lines.join("\n");
}

function formatAbilityScores(character) {
  const scores = character?.abilityScores || {};
  return ["str", "dex", "con", "int", "wis", "cha"]
    .map((id) => scores[id] == null ? null : `${id.toUpperCase()} ${scores[id]}`)
    .filter(Boolean)
    .join(", ");
}

function formatSkillHighlights(character) {
  return (character?.skills || [])
    .filter((skill) => skill.proficient)
    .map((skill) => `${skill.label}${skill.expert ? " (expert)" : ""}`)
    .join(", ");
}

function formatSpellcasting(spellcasting) {
  if (!spellcasting) return null;
  const parts = [
    `save DC ${spellcasting.spellSaveDC}`,
    `attack ${spellcasting.spellAttackBonus >= 0 ? "+" : ""}${spellcasting.spellAttackBonus}`
  ];
  if (spellcasting.cantrips?.length) {
    parts.push(`cantrips: ${spellcasting.cantrips.map((spell) => spell.label).join(", ")}`);
  }
  if (spellcasting.spells?.length) {
    const label = spellcasting.prepared ? "prepared spells" : "known spells";
    parts.push(`${label}: ${spellcasting.spells.map((spell) => spell.label).join(", ")}`);
  }
  return parts.join("; ");
}

function formatCharacter(character) {
  const identity = [
    character.subrace?.label || character.race?.label,
    character.class?.label,
    character.background?.label
  ].filter(Boolean).join(" ");
  const personality = character.personality || {};
  const lines = [
    line("Name", character.name),
    line("Identity", identity),
    line("Level", character.level),
    line("Alignment", character.alignment?.label),
    line("Combat", `AC ${character.armorClass}, HP ${character.hitPoints}, speed ${character.speed} ft, initiative ${character.initiative >= 0 ? "+" : ""}${character.initiative}`),
    line("Ability Scores", formatAbilityScores(character)),
    line("Proficient Skills", formatSkillHighlights(character)),
    line("Languages", (character.languages || []).join(", ")),
    line("Appearance & Habits", character.appearance),
    line("Personality Trait", personality.trait),
    line("Ideal", personality.ideal),
    line("Bond", personality.bond),
    line("Flaw", personality.flaw),
    line("Equipment", (character.equipment || []).map((item) => item.quantity > 1 ? `${item.label} x${item.quantity}` : item.label).join(", ")),
    line("Spellcasting", formatSpellcasting(character.spellcasting)),
    line("Features", (character.features || []).join("; "))
  ].filter(Boolean);

  return lines.join("\n");
}

function formatLocation({ city, selectedLocation, timeLabel }) {
  const lines = [
    line("Time", timeLabel),
    line("City", city?.name),
    line("Epithet", city?.epithet),
    line("Region", city?.region),
    line("City Description", city?.description)
  ];

  if (selectedLocation) {
    lines.push(
      "",
      line("Selected Place", selectedLocation.name),
      line("Place Type", selectedLocation.category),
      line("Place Description", selectedLocation.description),
      line("Local Contact", [selectedLocation.contact?.name, selectedLocation.contact?.role].filter(Boolean).join(", ")),
      line("Contact Intro", selectedLocation.contact?.intro)
    );
  }

  return lines.filter((entry) => entry !== null).join("\n");
}

function formatWeather(weather) {
  if (!weather) return "No weather information available.";
  return [
    line("Condition", weather.condition?.label),
    line("Temperature", weather.temperature?.label),
    line("Wind", weather.wind?.label),
    line("Season", weather.season),
    line("Precipitation", weather.precipitation ? "yes" : "no"),
    line("Description", weather.description)
  ].filter(Boolean).join("\n");
}

function formatTravelOption(option) {
  return [
    option.destinationName,
    option.duration,
    option.safetyLevel ? `safety: ${option.safetyLevel}` : null,
    option.safetySummary
  ].filter(Boolean).join(" | ");
}

export function buildNarratorBrief({
  purpose = "scene",
  instruction = DEFAULT_SCENE_INSTRUCTION,
  party = [],
  city = null,
  selectedLocation = null,
  timeLabel = "",
  weather = null,
  knownRumors = [],
  logEntries = [],
  travelOptions = []
} = {}) {
  const sections = [
    "# Narrator Brief",
    "## Purpose",
    purpose,
    "## Narrator Instructions",
    instruction,
    "## Party",
    party.length ? party.map(formatCharacter).join("\n\n") : "No party members available.",
    "## Current Location",
    formatLocation({ city, selectedLocation, timeLabel }),
    "## Current Weather",
    formatWeather(weather),
    listSection(
      "Nearby Places And People",
      selectedLocation ? [
        `${selectedLocation.name} (${selectedLocation.category})`,
        selectedLocation.contact ? `${selectedLocation.contact.name}, ${selectedLocation.contact.role}: ${selectedLocation.contact.intro}` : null
      ] : []
    ),
    listSection(
      "Known Rumors",
      knownRumors.map((rumor) => [rumor.headline, rumor.summary].filter(Boolean).join(": "))
    ),
    listSection(
      "Recent Events",
      logEntries.map((entry) => [entry.title, entry.message].filter(Boolean).join(": "))
    ),
    listSection(
      "Travel Options",
      travelOptions.map(formatTravelOption)
    ),
    "## Tone Request",
    "Write in rich, sensory fantasy prose. Emphasize sight, sound, smell, texture, weather, posture, facial expression, movement, atmosphere, and mood. Keep continuity with the facts above."
  ];

  return sections.join("\n\n").trim();
}
