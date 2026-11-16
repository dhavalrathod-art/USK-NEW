# Icon request for the UI Designer – Student Dashboard "Quick Services"

**From:** USK portal front-end (16/11/2026)
**Where:** `index.html` → Student Dashboard → section 3 "Quick Services" (5 cards).
**Reference:** the live dashboard https://auth.gyandiksha.in/portal-selection → Quick Services. Please draw the same idea, but in **our** icon style.

## What we need

5 new icons, each in our 3 styles:

| # | Card | File name | Idea (from the live site) | Used now (temporary) |
|---|---|---|---|---|
| 1 | Scholarship | `scholarship.svg` | graduation cap with a small badge / plus | `graduation` |
| 2 | Attendance | `attendance.svg` | calendar with a tick | `calendar` |
| 3 | Feedback | `feedback.svg` | speech bubble or bot with a sparkle | `star` |
| 4 | Career & Placement | `career.svg` | clipboard / document with a pencil | `briefcase` |
| 5 | Skill Passport | `skill-passport.svg` | head with gears | `award` |

## Rules (our Design System)

- **24 × 24** viewBox, one SVG per icon.
- **One colour only:** `fill="currentColor"` (filled) or `stroke="currentColor"` (outline / line). No fixed colours, no gradients, no second colour. The card sets the colour (purple, green, teal, blue, orange).
- Three versions, same file name in each folder:
  - `icons/filled/` – used on the Quick Services cards (24px).
  - `icons/outline/`
  - `icons/line/`
- Same stroke weight and corner style as the existing icons in these folders.
- Not copied from an outside icon library.

## After the icons arrive (front-end)

1. Put the files in `icons/filled`, `icons/outline` and `icons/line`.
2. Run `node build-icons.js` (rebuilds `icons.js`).
3. In `index.html`, Quick Services: change `data-icon="graduation:f:24"` → `scholarship:f:24`, and the same for the other 4 cards.

## Other icons still missing (from earlier work)

megaphone (Latest Update / Announcement), clock (Attendance Punch), location pin, building / government, headset (Help Desk), globe (language), Google Play and App Store logos.
