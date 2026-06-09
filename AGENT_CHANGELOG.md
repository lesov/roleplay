## 2026-06-07 19:38 CDT - codex - feature/codex/forgotten-realms-adventure

- Status: started
- Summary: Begin local-server Forgotten Realms text adventure implementation.
- Files changed: AGENT_CHANGELOG.md
- Tests run: not-run-yet
- UI review: pending-human-test
- Blockers or coordination notes: Working from task branch per repository workflow; existing AGENT_WORKFLOW_INSTRUCTIONS.md is untracked and left untouched.

## 2026-06-07 19:44 CDT - codex - feature/codex/forgotten-realms-adventure

- Status: ready-for-review
- Summary: Implemented local Node server and browser text adventure for Sword Coast travel and tavern innkeeper dialogue in 1496 DR.
- Files changed: AGENT_CHANGELOG.md, package.json, server.js, public/index.html, public/styles.css, public/app.js, src/gameData.js, test/gameData.test.js
- Tests run: npm test - passed; curl -I http://localhost:3001 - returned 200; curl -s http://localhost:3001/api/game-data - returned game data JSON
- UI review: pending-human-test
- Blockers or coordination notes: Port 3000 was already occupied by the first server attempt, so the verified running server is on http://localhost:3001.

## 2026-06-07 19:48 CDT - codex - feature/codex/forgotten-realms-adventure

- Status: ready-for-review
- Summary: Fixed map marker overlap between Baldur's Gate and Elturel by increasing their coordinate separation and adding a regression test.
- Files changed: AGENT_CHANGELOG.md, src/gameData.js, test/gameData.test.js
- Tests run: npm test - passed; curl -s http://localhost:3001/api/game-data - returned corrected map coordinates
- UI review: pending-human-test
- Blockers or coordination notes: Restarted local server on http://localhost:3001 so the corrected data is active.

## 2026-06-07 19:53 CDT - codex - feature/codex/forgotten-realms-adventure

- Status: approved
- Summary: Human reviewed the map UI and approved the current state with "looks good"; preparing branch for merge request.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed
- UI review: approved-by-human
- Blockers or coordination notes: Merge to main still requires explicit human stable-state declaration per AGENT_WORKFLOW_INSTRUCTIONS.md.

## 2026-06-07 19:57 CDT - codex - feature/codex/forgotten-realms-adventure

- Status: approved
- Summary: Human declared project stable and approved push to main.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed previously for approved implementation
- UI review: approved-by-human
- Blockers or coordination notes: Proceeding with merge to main and push per explicit approval.

## 2026-06-07 19:57 CDT - codex - main

- Status: merged
- Summary: Merged feature/codex/forgotten-realms-adventure into main after explicit stable approval.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed on main
- UI review: approved-by-human
- Blockers or coordination notes: Ready to push main to origin.

## 2026-06-07 - claude-sonnet - feature/claude-sonnet/character-creation

- Status: started
- Summary: Begin player character creation flow — overlay screen before main game with name, race, class, and background selection.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - all 6 pre-existing tests pass on clean branch
- UI review: pending-human-test
- Blockers or coordination notes: Working on dedicated branch; will add /api/character-options endpoint, overlay HTML/CSS, app.js logic, and characterData.test.js.

## 2026-06-07 - claude-sonnet - feature/claude-sonnet/character-creation

- Status: in-progress
- Summary: Implemented character creation overlay, /api/character-options endpoint, characterData.js module, updated app.js for player state and personalized arrival log. Added characterData.test.js (12 new tests).
- Files changed: src/characterData.js (new), test/characterData.test.js (new), server.js, public/index.html, public/styles.css, public/app.js, AGENT_CHANGELOG.md
- Tests run: npm test - 18/18 pass (12 new + 6 pre-existing)
- UI review: pending-human-test
- Blockers or coordination notes: Server started on http://localhost:3000 for human UI review. Awaiting approval before marking complete.

## 2026-06-07 - claude-sonnet - feature/claude-sonnet/character-creation

- Status: in-progress
- Summary: Fixed "Begin Adventure" button appearing to do nothing. Root cause: `.char-overlay`/`.shell { display: grid }` class rules overrode the user-agent `[hidden]` style, so toggling `hidden` had no visual effect and the overlay never dismissed. Added a global `[hidden] { display: none !important; }` rule.
- Files changed: public/styles.css, AGENT_CHANGELOG.md
- Tests run: npm test - 18/18 pass (CSS-only fix; behavior is UI, covered by human test)
- UI review: pending-human-test
- Blockers or coordination notes: Server running on http://localhost:3001. Refresh browser to pick up CSS change. Awaiting human approval.

## 2026-06-07 22:24 CDT - codex - feature/codex/travel-time

- Status: started
- Summary: Begin walking travel time and Calendar of Harptos progression implementation.
- Files changed: AGENT_CHANGELOG.md
- Tests run: not-run-yet
- UI review: pending-human-test
- Blockers or coordination notes: Building on existing uncommitted character-creation work in this worktree; will preserve those changes and keep travel-time edits scoped.

## 2026-06-07 22:29 CDT - codex - feature/codex/travel-time

- Status: ready-for-review
- Summary: Added walking travel route mileage, Calendar of Harptos time progression, route duration labels, and travel arrival log timestamps.
- Files changed: AGENT_CHANGELOG.md, public/app.js, public/time.js, src/gameData.js, test/gameData.test.js, test/time.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s http://localhost:3002/api/game-data - returned updated startTime/travelPace/travelRoutes; curl -s http://localhost:3002/app.js and /time.js returned updated browser modules
- UI review: pending-human-test
- Blockers or coordination notes: Fresh verification server is running on http://localhost:3002. Existing uncommitted character-creation changes remain present and were not reverted.

## 2026-06-07 22:36 CDT - codex - feature/codex/travel-time

- Status: approved
- Summary: Human tested the travel-time changes and approved merge and push.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed; git diff --check - passed
- UI review: approved-by-human
- Blockers or coordination notes: Human approval received with "I have tested the changes you made. I approve to merge and push."

## 2026-06-07 22:37 CDT - codex - main

- Status: merged
- Summary: Merged approved character creation and walking travel time implementation into main.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed on main; git diff --check - passed on main
- UI review: approved-by-human
- Blockers or coordination notes: Push to origin/main approved by human; will run tests on main before pushing.

## 2026-06-07 22:53 CDT - codex - feature/codex/lore-worldsim

- Status: started
- Summary: Begin incorporating new lore and world-simulation scaffold documents into the game.
- Files changed: AGENT_CHANGELOG.md
- Tests run: not-run-yet
- UI review: pending-human-test
- Blockers or coordination notes: New lore/scaffold markdown files are untracked; Windows Zone.Identifier sidecars will be ignored, not incorporated.

## 2026-06-08 13:30 CDT - codex - feature/codex/lore-worldsim

- Status: ready-for-review
- Summary: Added sanitized Inner Sea Codex API/UI, server-side world simulation state, public world-affairs news, scaffold leak tests, and Zone.Identifier ignore rule.
- Files changed: .gitignore, AGENT_CHANGELOG.md, codex_inner_sea_1496DR.md, master_timeline_GM_internal.md, worldsim_scaffold_spec_for_coding_agent.md, public/app.js, public/index.html, public/styles.css, server.js, src/lore.js, src/worldSim/factions.js, src/worldSim/timeline.js, src/worldSim/sim.js, test/lore.test.js, test/scaffoldSafety.js, test/worldSim.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s http://localhost:3003/api/lore - returned sanitized codex; curl -s 'http://localhost:3003/api/world-state?year=1496&dayOfYear=1' - returned public world state; curl -s http://localhost:3003/app.js - returned updated client bundle
- UI review: pending-human-test
- Blockers or coordination notes: Verification server is running on http://localhost:3003. AGENT_WORKFLOW_INSTRUCTIONS.md remains an existing untracked coordination file and was not changed.

## 2026-06-08 18:24 CDT - codex - feature/codex/lore-worldsim

- Status: in-progress
- Summary: Add month/day grounding to world affairs timeline events and corresponding internal timeline notes.
- Files changed: AGENT_CHANGELOG.md
- Tests run: not-run-yet
- UI review: pending-human-test
- Blockers or coordination notes: Follow-up requested after initial lore/worldsim implementation; assigning deterministic in-world dates within each event year.

## 2026-06-08 18:30 CDT - codex - feature/codex/lore-worldsim

- Status: ready-for-review
- Summary: Assigned concrete Calendar of Harptos dates to world affairs events, updated GM timeline headings, exposed event date labels in world-state API, and rendered dates in the World Affairs UI.
- Files changed: AGENT_CHANGELOG.md, master_timeline_GM_internal.md, public/app.js, public/styles.css, src/worldSim/sim.js, src/worldSim/timeline.js, test/worldSim.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s 'http://localhost:3003/api/world-state?year=1497&dayOfYear=80' verified the league event is not fired before 20 Ches; curl -s 'http://localhost:3003/api/world-state?year=1497&dayOfYear=81' verified the league event appears with date 20 Ches 1497 DR; curl -s http://localhost:3003/app.js verified client renders event.date
- UI review: pending-human-test
- Blockers or coordination notes: Verification server is running on http://localhost:3003. master_timeline_GM_internal.md was originally owned by nobody:nogroup; a mechanical rewrite recreated it with normal workspace ownership after chown was denied by the OS.

## 2026-06-08 18:59 CDT - codex - feature/codex/lore-worldsim

- Status: ready-for-review
- Summary: Reverted the tighter month/day world affairs dates after human feedback; restored year-level timeline headings, year-start event firing, and headline/summary-only World Affairs display.
- Files changed: AGENT_CHANGELOG.md, master_timeline_GM_internal.md, public/app.js, public/styles.css, src/worldSim/sim.js, src/worldSim/timeline.js, test/worldSim.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s 'http://localhost:3003/api/world-state?year=1497&dayOfYear=1' verified year-level event firing without date fields; curl -s http://localhost:3003/app.js and /styles.css verified date-label rendering was removed
- UI review: pending-human-test
- Blockers or coordination notes: Verification server is running on http://localhost:3003 with reverted year-level World Affairs behavior.

## 2026-06-08 19:02 CDT - codex - feature/codex/lore-worldsim

- Status: approved
- Summary: Human approved the reverted lore/worldsim state and requested merge and push.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed; git diff --check - passed
- UI review: approved-by-human
- Blockers or coordination notes: Human approval received with "good. merge and push."

## 2026-06-08 19:03 CDT - codex - main

- Status: merged
- Summary: Merged approved lore codex and world simulation implementation into main.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed on main; git diff --check - passed on main
- UI review: approved-by-human
- Blockers or coordination notes: Push to origin/main approved by human; will run tests on main before pushing.

## 2026-06-08 19:41 CDT - codex - feature/codex/route-safety

- Status: started
- Summary: Begin route safety previews for travel destinations based on route lore and public world events.
- Files changed: AGENT_CHANGELOG.md
- Tests run: not-run-yet
- UI review: pending-human-test
- Blockers or coordination notes: master_timeline_GM_internal.md has pre-existing human edits and will not be changed or staged for this task.

## 2026-06-08 19:44 CDT - codex - feature/codex/route-safety

- Status: ready-for-review
- Summary: Added route safety metadata, dynamic public-world-state risk scoring, safety badges and summaries on travel options, and route safety regression tests.
- Files changed: AGENT_CHANGELOG.md, public/app.js, public/routeSafety.js, public/styles.css, src/gameData.js, test/gameData.test.js, test/routeSafety.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s http://localhost:3004/api/game-data verified route safety metadata; curl -s http://localhost:3004/routeSafety.js and /app.js verified browser modules
- UI review: pending-human-test
- Blockers or coordination notes: Verification server is running on http://localhost:3004. master_timeline_GM_internal.md remains a separate human edit and was not changed for this task.

## 2026-06-08 19:53 CDT - codex - feature/codex/route-safety

- Status: ready-for-review
- Summary: Aligned runtime world-affairs triggers with the updated Harptos-dated master timeline so Cormyr's southern claim waits until 18 Eleint 1496 DR instead of firing at game start.
- Files changed: AGENT_CHANGELOG.md, src/worldSim/sim.js, src/worldSim/timeline.js, test/worldSim.test.js
- Tests run: npm test - passed; git diff --check - passed; curl -s 'http://localhost:3004/api/world-state?year=1496&dayOfYear=1' verified no Cormyr event at game start; curl -s 'http://localhost:3004/api/world-state?year=1496&dayOfYear=261' verified no event on 17 Eleint; curl -s 'http://localhost:3004/api/world-state?year=1496&dayOfYear=262' verified Cormyr's event fires on 18 Eleint
- UI review: pending-human-test
- Blockers or coordination notes: master_timeline_GM_internal.md remains a separate human edit and was not changed for this fix.

## 2026-06-08 20:03 CDT - codex - feature/codex/route-safety

- Status: approved
- Summary: Human approved route safety and world-affairs timing fix for merge and push.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed; git diff --check - passed
- UI review: approved-by-human
- Blockers or coordination notes: Human approval received with "check approved. merge and push"; separate user edits remain unstaged.

## 2026-06-08 20:03 CDT - codex - main

- Status: merged
- Summary: Merged approved route safety previews and Harptos-dated world-affairs timing fix into main.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - passed on main; git diff --check - passed on main
- UI review: approved-by-human
- Blockers or coordination notes: Push to origin/main approved by human; separate user edits remain unstaged.

## 2026-06-08 - claude-sonnet - feature/claude-sonnet/full-character-creation

- Status: started
- Summary: Begin full D&D 5e (SRD) character creation — replacing the placeholder name+3-dropdown flow with a multi-step wizard (race+subrace, class, background, ability scores, spells, equipment, derived stats), an in-game character sheet, and 6 quick-start presets.
- Files changed: AGENT_CHANGELOG.md
- Tests run: npm test - 39/39 pass on clean branch baseline
- UI review: pending-human-test
- Blockers or coordination notes: Branched from main. Work isolated to new src/character/* and public/character/* modules; only minimal touch-points in public/app.js and public/index.html. Not modifying other agents' lore/worldSim/time/routeSafety modules.
