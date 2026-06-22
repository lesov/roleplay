import assert from "node:assert/strict";
import test from "node:test";
import { buildNarratorBrief } from "../public/narratorExport.js";

function sampleCharacter() {
  return {
    name: "Aelar",
    level: 1,
    race: { label: "Elf" },
    subrace: { label: "High Elf" },
    class: { label: "Wizard" },
    background: { label: "Sage" },
    alignment: { label: "Neutral Good" },
    armorClass: 13,
    hitPoints: 7,
    speed: 30,
    initiative: 3,
    abilityScores: { str: 8, dex: 16, con: 13, int: 16, wis: 12, cha: 10 },
    skills: [
      { label: "Arcana", proficient: true, expert: false },
      { label: "Investigation", proficient: true, expert: false },
      { label: "Stealth", proficient: false, expert: false }
    ],
    languages: ["Common", "Elvish", "Draconic"],
    appearance: "Tall, pale-eyed, ink-stained, and always smelling faintly of old paper.",
    personality: {
      trait: "Curious",
      ideal: "Knowledge",
      bond: "My tome",
      flaw: "Distracted"
    },
    equipment: [{ label: "Quarterstaff", quantity: 1 }, { label: "Dagger", quantity: 2 }],
    spellcasting: {
      spellSaveDC: 13,
      spellAttackBonus: 5,
      prepared: false,
      cantrips: [{ label: "Fire Bolt" }],
      spells: [{ label: "Magic Missile" }]
    },
    features: ["Darkvision", "Arcane Recovery"]
  };
}

const sampleCity = {
  name: "Cimbar",
  epithet: "City of Sages",
  region: "Chessenta",
  description: "A marble-bright city of arguments, duels, and old learning."
};

const sampleLocation = {
  name: "The Brazen Flagon",
  category: "Tavern",
  description: "A loud tavern near the harbor where sailors trade lies and coin.",
  contact: {
    name: "Mara",
    role: "Innkeeper",
    intro: "Mara wipes down the bar while weighing every newcomer."
  }
};

const sampleWeather = {
  season: "summer",
  condition: { label: "Clear" },
  temperature: { label: "Hot" },
  wind: { label: "Breezy" },
  precipitation: false,
  description: "Clear skies stretch over the marble courts of Chessenta."
};

const sampleWorldState = {
  factions: [
    {
      displayName: "Cormyr",
      government: "Hereditary monarchy.",
      leaders: [
        {
          displayName: "King Baerovus Obarskyr",
          title: "King of Cormyr",
          status: "active",
          race: "Human",
          classOrRole: "Noble Fighter",
          publicSummary: "A young Obarskyr monarch."
        }
      ],
      keyFigures: [
        {
          displayName: "Araleth Rowanmantle",
          title: "Senior War Wizard",
          status: "active",
          race: "Human",
          classOrRole: "Wizard",
          publicSummary: "A cool-voiced War Wizard."
        }
      ]
    }
  ]
};

test("buildNarratorBrief includes party appearance, personality, location, weather, rumors, and log", () => {
  const brief = buildNarratorBrief({
    party: [sampleCharacter()],
    city: sampleCity,
    selectedLocation: sampleLocation,
    timeLabel: "1 Hammer 1496 DR, 08:00",
    weather: sampleWeather,
    worldState: sampleWorldState,
    knownRumors: [{ headline: "War Stirs", summary: "Cormyr watches the eastern roads." }],
    logEntries: [{ title: "Arrival", message: "Aelar stands in Cimbar." }],
    travelOptions: [{ destinationName: "Soorenar", duration: "2 days on foot", safetyLevel: "Caution", safetySummary: "Bandit signs on the road." }]
  });

  assert.match(brief, /Appearance & Habits: Tall, pale-eyed/);
  assert.match(brief, /Personality Trait: Curious/);
  assert.match(brief, /City: Cimbar/);
  assert.match(brief, /Selected Place: The Brazen Flagon/);
  assert.match(brief, /Condition: Clear/);
  assert.match(brief, /King Baerovus Obarskyr \(King of Cormyr\) - Human Noble Fighter/);
  assert.match(brief, /Araleth Rowanmantle \(Senior War Wizard\) - Human Wizard/);
  assert.match(brief, /War Stirs: Cormyr watches the eastern roads\./);
  assert.match(brief, /Arrival: Aelar stands in Cimbar\./);
  assert.match(brief, /Soorenar \| 2 days on foot \| safety: Caution/);
});

test("buildNarratorBrief handles empty rumors and log cleanly", () => {
  const brief = buildNarratorBrief({
    party: [sampleCharacter()],
    city: sampleCity,
    selectedLocation: sampleLocation,
    timeLabel: "1 Hammer 1496 DR, 08:00",
    weather: sampleWeather,
    worldState: { factions: [] },
    knownRumors: [],
    logEntries: [],
    travelOptions: []
  });

  assert.match(brief, /## Known Rumors\n- None known\./);
  assert.match(brief, /## Recent Events\n- None known\./);
  assert.match(brief, /## Travel Options\n- None known\./);
});

test("buildNarratorBrief keeps deterministic section order", () => {
  const brief = buildNarratorBrief({
    party: [sampleCharacter()],
    city: sampleCity,
    selectedLocation: sampleLocation,
    timeLabel: "1 Hammer 1496 DR, 08:00",
    weather: sampleWeather
  });
  const expectedOrder = [
    "# Narrator Brief",
    "## Purpose",
    "## Narrator Instructions",
    "## Party",
    "## Current Location",
    "## Current Weather",
    "## Known Powers And Leaders",
    "## Nearby Places And People",
    "## Known Rumors",
    "## Recent Events",
    "## Travel Options",
    "## Tone Request"
  ];

  let cursor = -1;
  for (const heading of expectedOrder) {
    const index = brief.indexOf(heading);
    assert.ok(index > cursor, `${heading} should appear after previous section`);
    cursor = index;
  }
});
