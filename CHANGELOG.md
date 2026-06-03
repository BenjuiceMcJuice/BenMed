# BenMed — Changelog

All notable changes to BenMed are documented here.

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
