# BenMed — Development Log

---

## Feedback: shared Benjuicey Apps standard

Feedback across all of Ben's apps follows one standard — see `benjuicey-apps/docs/feedback-standard.md` (the single source of truth). Submissions from every app land in one shared backend, each stamped with the app's trigram.

- **This app's trigram:** `MED`
- **Status:** ❌ **not yet wired up** — to adopt.
- **How to adopt:** add `benmed`'s live origin to the Worker's `ALLOWED_ORIGINS`, then drop in the shared widget:
  ```html
  <script defer src="https://benjuicey-feedback.benjuicemcjuice.workers.dev/widget.js" data-app-id="benmed" data-accent="#RRGGBB"></script>
  ```
  Uniform schema + canonical categories (`bug`/`content`/`request`/`general`) come for free. Note: BenMed's own Firebase project is for medication data sync — feedback is separate and must go to the shared Worker, not a local collection.

---

## 2026-06-03 — Family Medication Tracker Refactor

**Branch:** `claude/family-medication-tracker-2jdip`
**Status:** Code complete — awaiting Firebase deployment

### What was built

Full refactor of BenMed from a single-patient post-surgery tracker into a multi-person family medication manager.

#### Features added

**Multi-person support**
- Family of 5: Ben, Heather, and 3 kids
- Each person has a profile with name and optional date of birth
- DOB drives automatic age-appropriate dose calculation at medication add and log time
- Age brackets: Adult (16+), Child 12–15, Child 6–11, Child 2–5, Infant (3mo–1yr)

**Family Dashboard (new default tab)**
- 2-column card grid showing all family members at a glance
- Card colour-coding: green (all ok), amber (dose due), red (overdue >2hrs)
- Overdue alert banner at top listing any missed doses across the whole family
- Tap any card → jumps to that person's Medicines tab

**Per-person Medicines tab**
- Person selector strip (horizontal scroll pills) persists across tabs
- Summary table + expandable medication cards scoped to selected person
- Settings panel per med (edit dose/interval/max, remove med)
- History filtered to selected person only
- Warning banner shown only if person has conflicting prescription meds (Codeine+Oramorph, Naproxen+Ibuprofen)

**Medication library (Manage tab)**
- 19 pre-filled UK common medications with per-age-bracket dose tables
- Categories: Analgesic/Antipyretic, Antihistamine, Gastrointestinal, Eye, Topical, Sleep, Supplement, Prescription
- Meds shown with age-appropriate dose for the selected person; age-inappropriate meds greyed out
- "Add" button activates a med for the current person with auto-filled dose
- Custom medication form to add anything not in the library

**Family member management (Manage tab)**
- Add/edit/delete family members
- Edit name and date of birth
- Delete clears that person's history (with confirmation)

**Access management (Manage tab — admin only)**
- Dynamic authorised users list stored in `family/access` Firestore document
- First user to sign in becomes admin (Ben)
- Admin generates a 6-character invite code (48hr expiry) to share with Heather or others
- New user signs in with Google → enters code → request sent to admin
- Admin sees pending request notification → one-tap approve/deny
- Remove access for any non-admin user
- Replaces hardcoded UID list in Firestore rules

**Data migration (automatic)**
- On first load with new code, detects old `patients/ben` document
- Migrates Ben's existing med configs and dose history to new `family/main` structure
- All old history entries tagged as `personId: 'ben'`
- Old document left in place as backup

#### Features removed
- Pain level tracking (1–10 scale and daily graph) — removed as no longer needed for family use

#### Files changed
| File | Change |
|---|---|
| `index.html` | Full refactor — ~2,000 lines (was 1,118) |
| `firestore.rules` | Rewritten for dynamic access control model |
| `manifest.json` | Description updated |
| `sw.js` | Cache version bumped to `benmed-v3` |

### Firestore structure (new)

```
family/access       → { adminUid, authorizedUids[], userNames{}, createdAt }
family/invites      → { codes: { CODE: { createdAt, expiresAt, used } } }
family/requests/pending/{uid}  → { uid, email, displayName, code, requestedAt }
family/main         → { schemaVersion:2, members[], medLibrary[], personMeds{}, hist[], updatedAt }
```

Previous structure (`patients/ben`) kept for migration fallback.

### Pending actions

- [ ] **Deploy Firestore rules** — `firebase deploy --only firestore:rules`
- [ ] **Deploy hosting** — `firebase deploy --only hosting`
- [ ] **First-run setup** — Ben signs in, becomes admin automatically
- [ ] **Invite Heather** — generate code from Manage → Access & Users, share via text
- [ ] **Set kids' DOBs** — Manage → Family members → Edit each child
- [ ] **Add family meds** — select each person, tap "+ Add med", choose from library

### Notes
- No backend / Cloud Functions required — all auth logic handled client-side + Firestore rules
- Single-document Firestore model retained (1 read on load, 1 write on sync) — same cost as before
- Firestore rules deploy must happen before hosting deploy to avoid permission errors on first load

---

## Pre-2026-06-03 — Original BenMed (Post-surgery tracker)

Single-patient app for Ben's post-surgery recovery. Features:
- 5 pre-configured prescription meds (Oramorph, Codeine, Paracetamol, Naproxen, Ibuprofen)
- Dose logging with date/time and "who logged it" attribution
- Pain level tracking (1–10) with 2-hour bucketed daily graph
- Firestore cloud sync shared between Ben and Heather
- PWA — installable, offline-capable
- Google Sign-in with hardcoded UID allowlist (2 users)
- Pixel art header icons
