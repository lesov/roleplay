# WORLD SIMULATION SCAFFOLD — SPECIFICATION FOR THE CODING AGENT

You are implementing a living-world RPG set in the Forgotten Realms (Sea of Fallen Stars region), opening **1496 DR** and advancing over ~50 years. This document explains the **hidden historical scaffold** that drives the world. Read it fully before designing the world-simulation, timeline, faction, or save systems.

---

## 1. THE CORE CONCEPT (read this twice)

The world's political history is **secretly authored from a real-world historical timeline** (the Italian Wars / High Renaissance, 1494–1544 AD). Every war, succession, schism, and discovery is a reskinned real event firing on a fixed schedule. **The player must never be able to detect this.**

Two consequences for your architecture:

1. **The world advances on a schedule regardless of the player.** Even if the player character does nothing, wars start, leaders die, cities change hands, and the eastern empire expands. The timeline is the world's heartbeat, not a quest log.
2. **There are two data layers, and they must stay separated.**
   - **SCAFFOLD LAYER (internal):** real-history source tags, the calendar offset, the historical "intended outcome." Used only by the simulation engine for scheduling and default resolution.
   - **PRESENTATION LAYER (player-facing):** purely Faerûnian names, descriptions, rumors, and consequences. This is all the player ever sees.

---

## 2. HARD RULE — THE SCAFFOLD MUST NEVER LEAK

This is a correctness requirement, not a style preference. The illusion is the whole product.

- **NEVER** write any real-world name, year, place, or event ("France", "Ottoman", "1525", "Reformation", "Pavia", "Charles V", "Pope") into anything the player can reach: rendered text, item/quest/NPC names, dialogue, tooltips, lore entries, achievement strings, or human-readable save files.
- Real-history references live **only** in: internal source-tag fields, code comments, design docs, and the GM/debug build. Gate them behind a `DEBUG_SCAFFOLD` flag that is compiled out or hard-disabled in player builds.
- Do not name variables, asset files, enum values, or analytics events after real history (`event_pavia`, `faction_france`). Use neutral or Faerûnian identifiers (`evt_kings_capture`, `cormyr`). The source tag is a separate metadata string, never an identifier.
- If you must store the source mapping at runtime (e.g., for procedural generation), keep it in a server-side / non-shipped data file, never in client-readable assets.

When in doubt: **if a curious player datamining the build could discover we're tracking human history, you've done it wrong.**

---

## 3. THE CALENDAR

```
CAMPAIGN_START_DR = 1496      # what the player sees at game start
HISTORY_START_AD  = 1494      # internal scaffold anchor — NEVER surfaced
DR_AD_OFFSET      = +2        # DR = AD + 2
CAMPAIGN_END_DR   = 1546      # ~50-year arc
```

The player sees only DR dates. Internally, an event scheduled at scaffold year `AD` fires at `DR = AD + 2`. The offset is a single config constant so the whole timeline can be shifted without touching events.

---

## 4. FACTIONS

Use these IDs in code. The `display_name` is player-facing; the `source_tag` is internal-only scaffold metadata (compiled out of player builds).

| `id` | `display_name` | `source_tag` (INTERNAL) | Notes |
|---|---|---|---|
| `cormyr` | Cormyr | valois_france | The lone unified aggressor monarchy. |
| `grand_alliance` | The Grand Alliance | habsburg_bloc | A **coalition**, not one nation — member set changes over time. |
| `sembia` | Sembia | venice | Rich, resented; flips sides; member of/target of alliances. |
| `church_state` | The Church of Torm *[swappable]* | papal_states | Holds territory; switches sides; gets sacked; suffers the schism. |
| `dalelands` | The Dalelands | swiss_and_small_states | Premier mercenaries; princes profit from the schism. |
| `lords_alliance` | The Lords' Alliance | england | Peripheral opportunist (Waterdeep-led). |
| `amn` | Amn | castile_newworld | Colonial silver engine; bankrolls the Grand Alliance. |
| `thay` | Thay | ottoman_empire | The Eastern Tide. Advances on its own fixed schedule. |
| `aglarond` | Aglarond | hungary | The eastern shield; destroyed mid-campaign. |
| `chessenta` | Chessenta (city-states) | italian_city_states | The battleground; `cimbar` is the contested prize city *[swappable]*. |
| `soorenar` | Soorenar *[swappable]* | naples | The southern crown everyone claims. |
| `mulhorand` | Mulhorand | mamluk_egypt | Ancient south; partially swallowed by Thay. |
| `pirate_isles` | The Pirate Isles | barbary_corsairs | Thay-aligned; later dominates Inner Sea waters. |
| `maztica` | Maztica | new_world | Overseas colonial theater (Aztec analog). |

Faction runtime state to model: `treasury`, `army_strength`, `navy_strength`, `prestige`, `territory[]` (city IDs owned), `relations{other_faction: enum[ally|truce|hostile|war|secret_pact]}`, `ruler` (NPC id), and `flags[]`.

---

## 5. THE EVENT MODEL

The timeline is a list of **scheduled events**. Each has scaffold metadata (internal), a player-facing presentation, preconditions, and state effects. Suggested schema:

```jsonc
{
  "id": "evt_kings_capture",
  "fire_dr": 1527,
  "source_tag": "battle_of_pavia_1525",   // INTERNAL — debug builds only
  "category": "war | succession | schism | discovery | naval | territory | reveal",

  // Preconditions: if unmet, event is delayed/skipped per "resolution" below.
  "requires_flags": ["second_great_war_active"],
  "requires_state": [{ "faction": "cormyr", "field": "army_strength", "op": "<", "value": 9999 }],

  // DEFAULT (scaffold) outcome — what history says happens.
  "default_outcome": {
    "set_flags": ["cormyr_king_captured"],
    "deltas": [
      { "faction": "cormyr", "field": "army_strength", "op": "mul", "value": 0.4 },
      { "faction": "cormyr", "field": "ruler_status", "op": "set", "value": "captive" },
      { "faction": "cormyr", "field": "prestige", "op": "sub", "value": 30 }
    ],
    "spawn_threads": ["ransom_negotiation", "regency_power_struggle"]
  },

  // Player-facing ONLY. No real-world references, ever.
  "presentation": {
    "headline_rumor": "The King is taken! Cormyr's host is broken in the south and the crown sits in an enemy's tent.",
    "news_sources": ["caravan_rumor", "war_wizard_sending", "tavern_talk"],
    "long_lore": "..."
  },

  // How the engine resolves if the player has interfered (see §6).
  "perturbable": true,
  "alternate_outcomes": ["king_escapes", "king_dies", "king_ransomed_early"]
}
```

Notes:
- `default_outcome` encodes the historical result. If `perturbable: false`, it fires verbatim (these are the load-bearing tentpoles you generally want to protect).
- All player-facing strings live under `presentation`. A linter should flag any `source_tag` value leaking into a `presentation` field.

---

## 6. THE PERTURBATION MODEL (how player action interacts with the scaffold)

The brief: the world follows history, but the player must not *feel* railroaded, and significant player action should matter locally without derailing the macro-rhythm. Implement a **rubber-band**:

- **Macro layer (protected):** the four braided storylines and their tentpole events (the two great wars, the schism, the king's capture, the sack of the holy city, the eastern siege, the impious-pact reveal). These fire on schedule. If the player removes a *named individual* tied to one, **substitute an equivalent** (a different general, a cousin claimant) rather than cancel the event. History is bigger than any one person.
- **Meso layer (perturbable):** which side wins a given battle, which city flips, whether a leader is captured vs. killed vs. escapes. Player action can pick among `alternate_outcomes`. The *event* still happens at its scheduled time; only the *outcome* bends.
- **Micro layer (free):** local quests, single NPCs, towns, the player's own faction standing. Fully player-driven, no scaffold.

Rubber-band rule of thumb: if player action pushes a faction's strength/territory away from the scaffold's expectation, apply gentle restoring pressure over subsequent ticks (reinforcements arrive, allies intervene, the eastern tide presses) so the world drifts back toward the historical rhythm without snapping. Tune the restoring force; never make it visibly instant.

**A player who deliberately devotes a whole campaign to derailing one tentpole CAN succeed** — that's a satisfying payoff — but the cost is high and the scaffold should route the consequence into the *next* scheduled beat (a delayed war, a different power filling the vacuum) rather than going off-script entirely.

---

## 7. THE EASTERN TIDE — A SEPARATE CLOCK

Thay (`source_tag: ottoman_empire`) advances on its own near-fixed schedule, independent of the western wars: eastern ports (1502 DR) → island fortress (1524) → destruction of Aglarond (1528) → the great eastern siege (1531) → naval supremacy (1540). Model this as a **second, mostly-non-perturbable timeline** so dread keeps building regardless of what the player does in the west. The player can blunt individual advances (defend a city, win a naval skirmish) but cannot stop the tide on the macro layer without an extraordinary, campaign-long effort.

---

## 8. THE NEW WORLD (MAZTICA) SUBSYSTEM

Maztica is a second theater on the same hidden clock (Age of Discovery, from ~1521 DR). It generates the colonial silver that funds the Grand Alliance's wars — model it as an income stream into `amn`/`grand_alliance` treasuries plus its own reskinned events (landfall, conquest, plague, gold-fleet crossings that can be raided). Same two-layer rule applies: no real-world ("Aztec", "conquistador", "Columbus") strings anywhere player-facing.

---

## 9. IMPLEMENTATION CHECKLIST

- [ ] Calendar config with single `DR_AD_OFFSET` constant; only DR ever rendered.
- [ ] Faction entities with the runtime state in §4 and stable IDs.
- [ ] Event list with the schema in §5; `presentation` strings 100% Faerûnian.
- [ ] `source_tag` and all scaffold metadata gated behind `DEBUG_SCAFFOLD`, stripped from player builds.
- [ ] Linter/test: fail the build if any `source_tag` vocabulary appears in any player-facing field or shipped asset.
- [ ] Two independent timelines: Western Wars (perturbable) + Eastern Tide (mostly protected).
- [ ] Perturbation/rubber-band system per §6 (macro/meso/micro layers).
- [ ] Maztica income + event subsystem per §8.
- [ ] World-state advances on tick even with zero player input (verify in a headless "do-nothing" simulation run to 1546 DR).
- [ ] No human-readable save field exposes scaffold metadata.

The companion document, `master_timeline_GM_internal.md`, contains the full 50-year event sequence with per-event state deltas. Treat it as INTERNAL design data — implement its events into the presentation layer; never ship its source tags.

The companion document, `codex_inner_sea_1496_DR.md`, contains starting state lore bible.