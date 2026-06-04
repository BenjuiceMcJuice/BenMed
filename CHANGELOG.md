# BenMed — Changelog

All notable changes to BenMed are documented here.

---

## [2.2.0] — 2026-06-04 — Navigation restructure

### Changed (requested)
- **App structure redesigned**: three tabs are now Family / Medicines / Manage — each with a distinct, focused purpose
- **Person view**: tapping a family card on the dashboard slides in a full-screen person view (animated, slides from right); coloured header bar matches that person's accent colour with ← Back and ✚ Log buttons
- **Person view content**: shows that person's active medication cards with inline Log/status buttons, and their recent history below; "+ Add med" closes the view and opens the Medicines tab in context
- **Medicines tab**: now the medication library browser — person strip at top to switch context, full categorised library showing ✓ Active or Add per medication per person
- **Manage tab**: settings-only — family member edit + access/invite management; medication library moved out
- Person strip no longer shown globally; only rendered inside the Medicines tab

### Fixed (requested)
- **Favourites sync**: starred (★) medications in the "Log a medicine" modal now reflect a person's *assigned* medications, not just dose history — so any med added to a person's profile immediately appears first and starred, even before a dose has been logged

### Changed (proactive)
- **Medicines tab cards redesigned**: replaced the old summary table + verbose stat-grid cards with a single compact card per medication; each card shows name, dose/interval/remaining on one row, status badge + inline Log button, and a short "Last / Next" detail line; Settings panel collapsed by default behind a toggle
- Removed redundant summary table (duplicate of card info)
- ✚ Log a medicine button added directly to the Medicines tab (no longer dashboard-only)

---

## [2.0.0] — 2026-06-03 — Family Medication Tracker

### Added
- Multi-person support: 5 family member profiles (name + DOB)
- Age-appropriate dose calculation from DOB (5 age brackets, NHS/BNFc guidelines)
- Family dashboard with per-person status cards (green/amber/red overdue indicators)
- Overdue dose alert banner on dashboard
- Person selector pill strip for quick switching
- Three-tab navigation: Family / Medicines / Manage
- UK medication library with 19 pre-filled medications and age-bracket dose tables
- Custom medication form for anything not in the library
- Family member add/edit/delete (Manage tab)
- Dynamic access management: invite codes, pending request approval, authorized users list
- Auto-migration from v1 single-patient data structure

### Changed
- Firestore document path: `patients/ben` → `family/main`
- Firestore rules: hardcoded UID list → dynamic `family/access` document
- Header subtitle: "Post-surgery log" → "Family medication tracker"
- Service worker cache: `benmed-v2` → `benmed-v3`

### Removed
- Pain level tracking (1–10 scale and graph)
- Hardcoded 2-user UID allowlist in `firestore.rules`

### Migration
- Automatic — runs once on first load, no manual steps
- Old `patients/ben` data preserved as backup

---

## [1.x] — 2025 — Post-surgery Tracker

- Initial release as single-patient post-surgery medication tracker for Ben
- Google Sign-in with Firestore cloud sync
- 5 pre-configured prescription medications
- Pain level logging and daily graph
- PWA support (installable, offline)
- Shared access for Ben and Heather
- Pixel art header icons
