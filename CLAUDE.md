# USK Portal – Project Context for Claude

> **Read this first.** The user logs in to Claude with different accounts, so chat history is often lost.
> This file is the full context: what the project is, the design system, the rules, and the work done so far.
> **Before starting any task:** read this file, then open `index.html` and `css/usk-design-system.css`, review them, and only then ask the user for their requirement.
> **After every task (MUST, user request 16/11/2026):** update this file before telling the user the work is done – the feature details in §7 (what the screen does now, JS / CSS names), a dated entry in the change log §9 (what was asked → what was done → what is pending), and §0 / §5 / §8 if a new rule, preference or gap came up. The user switches Claude accounts and must never have to explain anything twice.

## 0. Working flow with this user

1. **Requirement:** the user writes in Gujarati / Gujlish, often with a **screenshot** ("same to same" = match it exactly) or a **spec table**. **Exception – "same to same" for the live gyandiksha site (user, 16/11):** take **only the colours** from the live site; shape, radius, size, spacing, layout, fonts and text stay as in our Design System. (e.g. COM-01 … with fields, rules, empty states). Read everything; follow the screenshot / spec exactly, but always with Design System components and tokens.
2. **Unclear?** Ask before building (the user says "kai na samjay to puchjo"). Use short questions with options; recommend one.
3. **Build** only in this folder (`Downloads\oko\USK-NEW`, GitHub `dhavalrathod-art/USK-NEW`, deployed on Vercel). Older copies elsewhere in Downloads are stale – never edit them.
4. **Design System only** (§4, §5). Missing icon / colour / component → don't invent: use the closest existing one, tell the user, and note it for the UI Designer.
5. **Never change content or data** when the task is about design. Never delete data.
6. **Test** in the browser preview: desktop (1366px) and mobile (375px), no sideways scroll, no console errors, every button / state / error message. Note: the preview pane sometimes freezes transitions or shows stale screenshots – trust DOM checks over screenshots.
7. **Report** to the user in Gujlish: what changed, how it works, what is not done / not verified, open questions. Keep it short and simple.
8. **Git:** never commit or push unless the user asks (a push to GitHub updates the live Vercel site). The user usually commits themselves.
9. **Big or risky changes:** keep a backup first; the user may ask to revert ("jem hatu em kari dyo") – then restore exactly (git checkout / backup copy) and verify byte-for-byte.
10. **Step by step:** the user adds modules one at a time ("step by step kam karishu"). Do only what was asked; propose the next step at the end.
11. **Finish** by updating this file (see the rule at the top).

## 1. About the project

- **USK** = Uccha-Shiksha Samiksha Kendra, Higher Education Department, Government of Gujarat.
- Front-end prototype of the USK portal: plain **HTML + CSS + vanilla JS**. No framework, no build step, no backend (all data is sample data in JS).
- New pages and modals are built **directly in code** (not in Figma), using only the Design System.
- The user writes in **Gujarati / Gujlish** (Gujarati in Latin letters, mixed with English). Reply in the same style: short, clear, simple words.
- Team contacts mentioned in docs: questions on design, colors or icons → **UI Designer**; questions on code → **Savan bhai**.

## 2. Files

| File | What it is |
|---|---|
| `index.html` | **Main file.** Portal with a left sidebar. Every sidebar menu is a "view" inside this one file. Also holds the live **Design System** docs and the **Responsive** guide. |
| `skill-passport.html` | Skill Passport page (student view). Separate page with its own top header (no sidebar). Linked from the sidebar. |
| `css/usk-design-system.css` | **The one source of truth for the Design System** (tokens + all `.ui-*` components). Both pages load it. Change design tokens/components only here. |
| `icons/filled`, `icons/outline`, `icons/line` | Icon SVGs (24×24, single color). |
| `icons/live/` | **Exception (16/11):** 4 Quick Services icons copied as they are from the live gyandiksha site (`qs-scholarship`, `qs-attendance`, `qs-career`, `qs-skill-passport`; 30×30, own fixed colour). Not read by `build-icons.js`; used only as `<img>` on the Dashboard Quick Services; shown on Design System → Icons → "Live Site Icons – Exception". Replace + delete when the UI Designer sends icons in our style. |
| `build-icons.js` → `icons.js` | `node build-icons.js` turns the SVGs into `icons.js` (`window.USK_ICONS`). Never edit `icons.js` by hand. |
| `README.md` | Gujarati guide for the team (how to open, design system tabs, icon rules). |
| `Design-System-Guide.md` | Original planning document (list of components wanted). |
| `LOGO-USK.png`, `LOGO-USK-sm.png`, `img/` | Logos, the Skill Passport banner photo and the Sign In photo `img/sign-in-image.png` (8 MB – compress before going live). `img/USK-SKILL-PASSPORT.jpg` (5.8 MB) is unused; the page uses `-web.jpg`. |
| `USK_Prototype/` | The user's older prototype (untouched reference). Screens from it are brought into `index.html` step by step, **rebuilt with the Design System**, only when the user asks. |

Open `index.html` directly in Chrome/Edge, or run any static server in this folder: `node .claude/serve.js . 5174` → http://localhost:5174/index.html (`.claude/launch.json` config `usk-new`, port 5174). Add `?v=N` to the URL to force a reload in the preview.

## 3. How `index.html` works

- **First screen = Student Sign In** (`#loginScreen`, before `.app`). `.app` stays `hidden` until the student signs in (see §7 "Student Sign In").
- Layout: `.app` → `aside.sidebar` (fixed, 260px; collapses to 80px on desktop; overlay below 992px) + `.main` → `header.header` (64px, sticky) + one `<main class="content" id="view-NAME">` per page.
- **Routing:** sidebar links are `<a href="#NAME" data-view="NAME" data-tip="Label">`. `showView(name)` (bottom of the main `<script>`) shows `#view-NAME` and hides the others. The header title is set in `showView`.
- Views now: `dashboard` (Student Dashboard, **default** + first sidebar item), `applications` (Student Application), `jobs` (Job Opportunities, student), `scholarships` (Scholarships list, student) + its sub-pages `sch-declare` (CMSS Declaration) and `sch-form` (CMSS application form) (both keep "Scholarships" active), `my-apps` (My Applications, student scholarships) + its sub-page `my-apps-view` (View Application), `company-job` (Company Job Post = **Manage Job Posting** table, company) + its sub-page `company-job-form` (Create / Edit Job Posting; not in the sidebar, keeps "Company Job Post" active). The old `company-job-skills` page was removed on 17/11 (its skill picker now lives inside the form), `design-system`, `responsive`, and for the verification roles (Phase 4) `hc` (Help Center list), `co` (Commissioner Office list) and `ver-view` (one review page for both). Skill Passport is a normal link to `skill-passport.html`.
- **Roles (Phase 4, demo):** header **role switcher** `#roleSel` (Student / Help Center / Commissioner Office, kept in `sessionStorage` `usk-role`). Sidebar links have `data-role` (`student` / `hc` / `co`); links without it (Company Job Post, Design System, Responsive) show for every role. Switching goes to the role's home (`ROLE_HOME`); a non-student role never sees the student Dashboard.
- Modals sit near the end of `<body>`, before the `<script>` tags. Open with `data-modal-open="ID"` or `openModal("ID")`; close with `data-modal-close`, ×, Esc or `closeModal(el)`. `data-static` on the backdrop = a backdrop click does not close it (use for forms).
- Icons in HTML: `<span data-icon="NAME:STYLE:SIZE"></span>`, where STYLE is `f` filled / `o` outline / `l` line and SIZE is 14/16/18/20/24. In JS use `iconSvg(name, style, size)`.
- Helpers in the main script: `$`, `$$`, `esc()` (always escape user text), `fmt(date)` → DD/MM/YYYY, `toast(msg)`, `initSelect(el)` (builds a `.ui-select`), `closeSelects()`, `HELP_ICON`, `tbAct("view")` (table action button).
- **Legacy warning:** the Student Application view, the sidebar and the header still use older classes and tokens (`.btn`, `.field`, `.pill`, `.chip`, `.pager`, `--primary:#0f3a66`, `--navy`, `--gold`). **Do not copy them into new work.** Build new pages with the `.ui-*` components and `--color-*` / `--space-*` tokens.

## 4. Design System (summary of `css/usk-design-system.css`)

The full live docs are in `index.html` → sidebar **Design System** (tabs: Logo, Colors, Typography, Spacing, Icons, Buttons, Form Inputs, Form Patterns, Upload, Table, Modal, Drawer, Accordion) and **Responsive**.

**Brand:** Navy `#233C5A` (`--color-primary-600`) and Gold `#D1A76C` (`--color-accent-500`). Font: Inter. Base text 13px.

**Tokens**
- Colors: `--color-primary-50…900`, `--color-accent-50…900`, `--color-gray-0…900`, `--color-text-*` (heading, body, secondary, placeholder, disabled, link, inverse), `--color-bg-*` (page, surface, input, disabled, overlay…), `--color-border-*` (default, strong, hover, focus, error), `--color-focus-ring`.
- Status: `--color-{success|warning|error|info|neutral}` plus `-text`, `-bg`, `-border`.
- Icons: `--color-icon-*`, `--color-icon-bg-*`.
- Typography: `--font-size-{display,h1…h6,body-lg,body,body-sm,caption,label,overline,button,th,td,badge}` with matching `--line-height-*`; classes `.t-h1…`, `.t-body`, `.t-label`, ….
- Spacing (4px grid): `--space-0,2,4,8,12,16,20,24,32,40,48`. Layout names: `--space-page`, `--space-card`, `--space-section`, `--space-form-row`, `--space-form-col`, `--space-btn-group`, `--space-modal`.

**Components**
| Need | Use |
|---|---|
| Button | `.ui-btn` + `-primary` / `-outline` / `-accent` / `-soft` / `-danger` / `-danger-soft` / `-ghost`; size `-sm` (32px) / default (38px) / `-lg` (44px); `-icon`, `-block`; `is-loading` with `.ui-spin` |
| Form field | `.ui-field` > `.ui-label` (+ `.ui-req` for *) + `.ui-input` (also textarea) + `.ui-help` (`is-error` / `is-success`). Input states: `is-error`, `is-success`, `readonly` (dashed), `disabled` |
| Dropdown | `<div class="ui-select" data-ph="…" data-options="A\|B\|C" data-value="A" data-search>`; add `is-multi` for many values; `is-readonly`, `is-disabled`, `is-error`. Fires a bubbling `ui-select-change` event (`e.detail` = values). Read the value from `.ui-option.is-selected` `data-v` |
| Tag select | `.ui-chips` / `.ui-chip` + `.ui-combo` (search + "Add new") |
| Repeatable rows | `.ui-repeat` (+ `is-list`) > `.ui-repeat-item`, remove `.ui-btn-danger-soft.ui-btn-icon`, add button `.ui-add-row` ("Add …", full width, dashed, below the last row, disabled at the max). Optional drag handle `.ui-drag` |
| Section title | `.ui-form-sec` / `.ui-form-sec-head` (navy left bar + h5 + p) |
| Upload | `.ui-drop`, `.ui-file-row`, `.ui-progress`, `.ui-avatar-drop` |
| Table | plain `<table>` in `.table-wrap`; `.ui-cb` checkbox; `.ui-bulk` bar; `.ui-badge-{approved,shortlisted,review,rejected,warning,neutral}` (warning added 16/11); actions `.ui-acts` > `.ui-act .ui-act-{view,edit,delete,resume,more}`; 3-dots menu `.ui-menu`. Table types 1–4 are on the Table tab |
| Modal | `.ui-modal-backdrop` > `.ui-modal` (`-sm` 440 / default 600 / `-lg` 840) > `.ui-modal-head` (`.ui-modal-icon` gold box + `.ui-modal-title` h4+p + `.ui-modal-close`), `.ui-modal-body`, `.ui-modal-foot` (Cancel outline left, one Primary right). Below 560px it becomes a bottom sheet |
| Drawer | `.ui-drawer` (`-sm` / `-lg`) from the right, same header as the modal |
| Accordion | `.ui-acc` > `.ui-acc-item` (`is-open`) > `.ui-acc-head` + `.ui-acc-panel` |
| Stepper | `.ui-steps` > `.ui-step` (`is-done`, `is-current`, `is-failed`) |
| Icon box | `.ui-icon-box` + `is-primary` / `is-accent` / `is-success` / `is-warning` / `is-error` / `is-info` |

**Info tooltip:** `.ui-info` (i) after a label + `.ui-info-tip` (see §7 Design System changes).

**Not in the Design System yet** (add it there first if a page needs it): checkbox/radio/switch styles, date picker, alert/banner, toast, pagination (pages reuse the legacy `.pager`), tabs (Skill Passport has page-level `.sp-tabs`), card/empty state (page-level), focus trap in modals.

## 5. Rules (from the team)

1. Use **only** Design System tokens and components. A new color, button style or spacing value goes into `css/usk-design-system.css` (and the Design System view) first, never straight into a page.
2. Spacing only from the scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px.
3. Gold is the accent: modal header icon box, the one special CTA (Skill Passport "Generate Passport"), the sidebar Log out button. **Never gold in inputs.**
4. Modal header is always Navy with white text; the icon box is Gold with a white icon. One Primary button in the footer (Danger instead when deleting or rejecting). Forms use `data-static`. No modal on top of another modal.
5. Icons: one SVG per icon, `currentColor`, single color. Filled for buttons, table actions, sidebar and modal header; Outline inside inputs, helper text and empty states. Sizes 14/16/18/20/24 only. **New icon or icon color → ask the UI Designer.** Don't take icons from other libraries.
6. Date format everywhere: **DD/MM/YYYY**.
7. Responsive breakpoints: mobile ≤575.98px, tablet ≤991.98px (sidebar hidden, opens as an overlay), laptop ≥992px, desktop ≥1200px. The page never scrolls sideways; only tables scroll inside their card. Tap targets at least 40×40.
8. Accessibility: keyboard works everywhere, focus ring visible, status never shown by color alone.

## 6. How to add a new sidebar page + modal (recipe)

1. **Sidebar link** in `<nav class="nav">`: `<a href="#xyz" data-view="xyz" data-tip="Page Name">` + an 18px icon + `<span class="nav-label">Page Name</span>`.
2. **View:** `<main class="content" id="view-xyz" hidden>` with `.page-head` (h3 + p) and `.card` sections inside, placed with the other views.
3. **Header title:** set it in `showView()`.
4. **Page CSS:** add a prefixed block (e.g. `.xyz-*`) in the `<style>` of `index.html` using tokens only. Note: a class that sets `display` overrides the `hidden` attribute, so add `.xyz[hidden]{display:none}` when you toggle it.
5. **Modal:** copy the structure of `#mdJobPref` or `#mdRemark` (both near the end of `<body>`).
6. **JS:** add a `/* ===== XYZ ===== */` block before `/* ================= SIDEBAR VIEWS` in the main script.
7. **Test** at 375px, 768px, 991px, 1366px: no sideways scroll, no console errors, the modal works with keyboard + Esc.

## 7. Work done so far

### Student Sign In (`#loginScreen`, first screen of `index.html`) – 16/11/2026
- Plan from the user: **student side first, other roles later.** Modules (Skill Passport, Attendance, …) will be added into this portal step by step. **Sign in only – no sign-up / register on this page.**
- Built to the user's screenshot with Design System components: split screen. **Left:** `img/sign-in-image.png` with a dark overlay, a **3-slide text slider** (each slide = gold pill + heading + text: "Academic Portal", "Scholarships", "Skills & Careers"; the first slide is the user's text, slides 2–3 were written by Claude), dots under it (click to switch), "Government Of Gujarat". **Both work together:** the slider **always** moves by itself every 4 s (`LG_SLIDE_MS`) – no pause on hover or focus and it also runs with "reduced motion" (user request) – and a dot click shows that slide and restarts the 4 s timer. Dots sit 4px apart (8px dot, active 24px). **Right:** logo bar with **A- / A / A+** (zooms the Sign In screen) and **English / ગુજરાતી** menu (`LG_GU` texts), gold-tint graduation icon circle, "Student Login", Email / Mobile No / APAAR ID + Password (`.ui-input`, eye toggle), "Remember me on this device" (`.ui-cb`; remembers only the identifier in `localStorage`), Sign In (`.ui-btn-primary.ui-btn-lg.ui-btn-block`, spinner while signing in), OR, help text, Help Desk link, footer links (Privacy Policy, Terms Of Service, Support, Accessibility – toast for now).
- **Demo credentials:** `abc@gmail.com` / `abc@123` (`LG_DEMO`, sample student **s1** Aarav Patel – Fresh / Delayed scholarship flow). **Second demo student (16/11, Phase 3):** `renew@gmail.com` / `abc@123` (sample student **s2** Riya Shah – CMSS Renewal, MYSY Renewal Delayed). `LG_DEMOS` lists both; the signed-in student id is kept in `sessionStorage` `usk-sid` and applied with `schUseStudent(sid)` (scholarship profile + history, and the Dashboard name / email / mobile). **No hint box** (removed on request): both fields are **filled by default** when the page opens and again after Log out (a remembered identifier from "Remember me" wins over the demo email). Empty fields → "This field is required."; wrong values → "Invalid Email / Mobile No / APAAR ID or password." (red `.ui-help`, inputs `is-error`).
- **After Sign In → Student Dashboard** (`#dashboard`, since 16/11; before that it went to `#applications`) with a toast. Signed-in state is kept for the browser tab in `sessionStorage` (`usk-student`), so a refresh stays inside; a new tab / opening `index.html` again starts at Sign In. Sidebar **Log out** → back to Sign In.
- Icons: Help Desk uses the **phone** icon and the language button has no globe icon, because headset / globe icons are not in the Design System yet (ask the UI Designer).
- JS: `LG_DEMO`, `LG_GU`, `lgShow(signedIn)`, `lgError`, `lgApplyLang`, `lgSignedIn`, slider `lgGoSlide(n)` / `lgPlay()`. CSS prefix `lg-`.

### Student Dashboard (`#view-dashboard`, first page after Sign In) – 16/11/2026
- Taken from `USK_Prototype` (`student.js` → `V['s-dash']`, data from `data.js`) and **rebuilt with the Design System**. Content and sample data are the prototype's (copied into the page, unchanged); only the look changed. It is the default view and the first sidebar item "Dashboard" (home icon).
- **No sidebar on the Dashboard** (user, 16/11). `showView` puts `.app.is-dash` on the app shell when the view is `dashboard`. That hides the sidebar, its backdrop, the toggle button and the header title, and gives the page the full width. The header then shows the **USK logo** (`.h-brand`, reuses `.lg-brand`) and a **Log out** button (`.h-logout`, outline sm; icon only ≤575px), which does the same as the sidebar Log out. Other pages (opened from Quick Services, e.g. Career → `#jobs`) show the sidebar again, and its "Dashboard" link brings the student back.
- **10 sections, in order:**
  1. **Profile banner:** navy panel with a slanted right edge and 2 gold stripes, a gold avatar with initials, the name, APAAR / ABC ID, and a gold "Verified" chip. Next to it a 2×2 grid (`.ui-icon-box.is-primary` + label + value): Degree/Program, Semester/Year, Email, Mobile No. Then a **Social Profiles** box with LinkedIn / GitHub / Instagram / Facebook in the DS brand icons, all navy – **icon only, no names** (user, 16/11): 40×40 square buttons (`.db-soc-btn`, icon 20) in one wrapping row (`.db-soc-grid` is flex now), the name is in `title` (tooltip) and `aria-label` "Open your X profile". One **eye toggle** shows or hides APAAR, email and mobile together (masked by default).
  2. **Latest Update ticker** – our DS shape and layout, **colours from the live gyandiksha bar** (16/11): "Latest Update" label (radius 6px, bell icon 16) in `--color-error-bg` with `--color-error-border` and `--color-error` text; then the published announcements scrolling sideways (45 s loop, **pauses on hover / focus**, stops with "reduced motion"; the label sits above the ticker ≤575px). Each item: a `.db-tag.is-live` tag ("NEW ANNOUNCEMENT" if published in the last 7 days, else "ANNOUNCEMENT") in `--color-accent-300` bg + `--color-warning` border + `--color-error` text; the title in `--color-gray-600`; "Read details →" (`--color-primary-500`), which opens the Announcement modal.
  3. **Quick Services**, **4** tinted cards in the **DS category colours** (taken from the live site, 16/11): card `--color-cat-X-bg` + `-border`, icon and round arrow button `--color-cat-X` (classes `.db-qs.is-purple / is-green / is-blue / is-orange`; `is-teal` unused):
     - Scholarship (purple) → `#scholarships`
     - Attendance (green) → toast, the page is not built yet
     - Career & Placement (blue) → `#jobs`
     - Skill Passport (orange) → `skill-passport.html`
     - The Feedback card (added 16/11) was **removed** on request (16/11).
     - **Compact cards** (16/11, like the live site): padding 12 / 16px, gap 12, icon box 44px, arrow circle 32px (the whole card is the button). Grid: 4 in a row → 2 columns ≤1199px → 1 column ≤575px.
     - **Icons = the live site's own icons** (user, 16/11 – exception to the DS icon rule): `<img src="icons/live/qs-*.svg">` 26px in the white icon box (`.db-qs-ic img`). Their colours are fixed in the files (Skill Passport is amber `#F59E0B`, the card is orange `--color-cat-orange`).
     - Icons are still the closest DS icons (graduation, calendar, star, briefcase, award). New icons are requested from the UI Designer in `icons/REQUEST-Quick-Services-Icons.md` (file names, rules, and the 3 steps to swap them in).
  4. **Recommended Government Schemes:** 4 per page, scholarships left out as in the prototype. Each card has a department tag, name, description and "View Details", which opens the `#mdScheme` modal (eligibility, income limit, source; "Visit Official Website" shows a toast).
  5. **Scholarships:** 9 official links, 6 per page. Each card has a code tag, name, description and an external icon; a click shows a toast.
  6. **Announcement:** only "Published" items that are not past their "Visible till" date, 3 per page. Each card has a category tag, an optional NEW tag (published in the last 7 days), the summary, an Attachment link (toast) and "VISIBLE TILL". A click opens `#mdAnn` (details plus "Visit Website" / "View Attachment").
  7. **Internship/Placement Opportunity:** 3 per page, showing company, role tag, description, location and apply-by date.
  8. **Upcoming Events:** events that match the student's skills (tag "Picked for your skills"), 3 per page. Each card has a date box, name, organiser, type tag, description and "Read More" (toast).
  9. **My Attendance Punch:** Today's Status (Present badge, Punch In / Out, last punch) and This Month Summary (days present, total hours, green progress bar). These are static sample values in `DB_ATT`; "View attendance" shows a toast.
  10. **Mobile app banner:** navy with faded gold stripes; "Now in Your Pocket!" in gold, plus Google Play / App Store buttons (toast).
- Pagers: `‹ 1 / n ›` built from `.ui-btn-outline.ui-btn-sm.ui-btn-icon`, hidden when there is only 1 page.
- **Prototype colours → DS tones:** the prototype hex colours are mapped through `DB_TONE` / `DB_ANN_CAT` to `.db-tag.is-{primary|accent|success|info|warning|error|neutral}`. Emoji are replaced by DS icons (graduation, book, mail, phone, bell, briefcase, calendar, award, resume, star, home, external, document, arrow-left/right).
- **Icons missing from the DS (ask the UI Designer):** megaphone (Latest Update / Announcement use **bell**), clock (Attendance Punch uses **calendar**), location pin (shown as text only), building / government (the "Official" tags use **home**), and the Google Play / App Store logos (text only).
- Sample "today" = **16/11/2026** (`DB_TODAY`), so the ACPC announcement (visible till 10/11) is hidden.
- Responsive:
  - ≥1440px: the profile is 3 columns.
  - Below 1440px: banner + info, with Social Profiles under them in 1 row of 4.
  - ≤1199px: grids show 2 cards per row.
  - ≤991px: everything stacks.
  - ≤575px: 1 column, the banner stacks, and the ticker label sits above the ticker.
  - Checked at 1366 and 375: no sideways scroll, no console errors.
- JS: `DB_STUDENT`, `DB_SCHEMES`, `DB_SCHOL`, `DB_ANN`, `DB_OPP`, `DB_EVENTS`, `DB_ATT`, `DB` (`reveal`, `page`), `dbSlice`, `dbRender` / `dbRenderLists` / `dbRenderMask`, `dbOpenScheme`, `dbOpenAnn`. Click attributes: `data-dbreveal`, `data-dbpage`, `data-dbscheme`, `data-dbann`, `data-dbattach`, `data-dbext` (toast), `data-dbgo`, `data-dbsoon`. CSS prefix `db-`. Modals `#mdScheme` and `#mdAnn` are read-only, so the backdrop closes them.

### Job Opportunities (`#view-jobs`, student view)
- Page: "Explore Job Opportunities". A **Your Job Preference** card shows "Add Job Preference" (primary) until a preference is saved, then the saved locations as tags plus "Edit Job Preference" (outline).
- The modal does **not** open by itself. Before a preference is saved the table shows all jobs; after saving, only jobs in the saved locations.
- **Table** (Design System Table Type 1): checkbox column, Company Information (initials logo box), Job Title / Applicant (company, role, applicant count), Type (`.ui-badge-neutral`), Location, Apply By (DD/MM/YYYY), Action (view icon + Apply; an applied job shows an "Applied" badge and its checkbox is disabled). `.ui-bulk` bar: "N jobs selected" + Clear All (danger-soft) + "Apply to Selected (N)". Pagination 10 per page.
- **Job Preference modal** (`#mdJobPref`, large), the same for Add and Edit:
  - **Top: "Your Preferred Locations" table** with columns Sr No., "Country, State, City / District" (one column, values in that order, e.g. "India, Gujarat, Ahmedabad"), Action (delete icon `.ui-act-delete`). Count "NN / 10". **The table (with its heading) is hidden until the first location is added**, and hides again if all are deleted.
  - **Below: ONE "Add Location" row**: **Country → State → City / District** (single-select with search; each field is disabled until the one before it has a value; changing a parent clears its children). **No "Location 1 / Location 2" rows and no new rows.**
  - **"Add Location"** (`.ui-add-row`) stays disabled until all 3 are selected. Clicking it puts the location in the table and clears the City field (Country + State stay, for the next city). Cities already in the table are disabled in the City list, so duplicates are not possible. Max 10.
  - Delete in the table removes the location, and that city can be picked again.
  - Save: a complete selection not yet added is added automatically; with an empty list it shows "Add at least one location". Edit opens with the saved locations in the table and an empty Add row.
  - JS: `jpList` (draft list), `jpForm`, `jpBuildCountry/State/Dist`, `jpRenderList`, `jpSync`, `jpOpen`.
- Dropdowns in this modal **float above the modal** (`position:fixed`, placed by `jpPlaceMenu()`; they open upward when there is no room below), so the modal never gets a scrollbar and the list is never cut off.
- Sample data: `JB_GEO` (Indian states → districts), `JB_WORLD` (India + sample UAE and Canada), `JOBS` (150 generated jobs). The preference is kept in memory only (`JB.pref`) and resets on reload.

### Scholarships (student) – workflow from `USK_Functional_Specifications (7).xlsx` + `Scholarship_Business_Rule (3).xlsx` – Phase 1a + 1b + 2 done 16/11/2026
- Plan (user): Phase 1a ✔ list + eligibility modal + Apply Now type check + CMSS declaration → Phase 1b ✔ CMSS 7-step form + Review / Submit + CMSS-06 eligibility → Phase 2 ✔ MYSY → Phase 3 ✔ Renewal → **Phase 4** Help Center + Commissioner Office (role switcher in the header) + student status / correction / notifications (next) → Phase 3 Renewal → Phase 4 Help Center / Commissioner Office (role switcher in the header) + student status / correction / notifications. Look = our DS + the My Applications pattern.
- **Sidebar "Scholarships"** (graduation icon, before My Applications) → `#view-scholarships`. The Dashboard Quick Service "Scholarship" and My Applications "Go to Scholarships" now open it too.
- **List (CMSS-01 / MYSY-01):** "Scholarships open for the academic year 2026-27". A card per scholarship (`.sch-card`, 2 columns → 1 ≤991px): icon box, code + full name, short description, "Eligibility highlights" (green ticks), Benefit box, "Apply by DD/MM/YYYY" (or red "Applications closed" + Apply Now disabled after the deadline), **View Eligibility Criteria** (outline) + **Apply Now** (primary). Deadlines: CMSS 15/12/2026, MYSY 30/11/2026 (sample today = `DB_TODAY` 16/11/2026). Empty state "No scholarships are open right now."
- **Eligibility modal `#mdSchElig` (CMSS-02 / MYSY-02):** lg, read-only (backdrop closes, one Close button). "<CODE> – eligibility criteria" + full name; Department + Application period boxes; "Eligibility checks" table (#, Criteria, Requirement); CMSS: "Special categories and supporting documents" (7 rows); MYSY: "Special cases" (4 rows).
- **Apply Now → application type (APT-COM-00…04)**, not shown as a step: Renewal (approved last year) → Renewal Delayed (approved earlier) → Fresh (admission year = current) → Delayed. Sample: student admitted 2024-25, approved MYSY in 2025-26 / 2024-25, none for CMSS → **CMSS = Delayed** (declaration), **MYSY = Renewal** (toast "renewal form comes in Phase 3"). MYSY Fresh / Delayed → toast "Phase 2". Drafts are not looked at yet (the CMSS 2026-27 draft in My Applications stays as it is).
- **Declaration `#view-sch-declare` (CMSS-04, Fresh / Delayed only):** title "CMSS – Declaration", line with academic year + application type, Back, yellow deadline bar, card "Special Category" + "View Eligibility Criteria" (opens the modal). 7 category rows + "None of these apply to me" (`.sd-opt` with `.ui-cb`; selected row navy border). **Category 1 is disabled for a non-female profile** with "Only for female students. Your profile gender is Male." "None" unticks the others (and a category unticks "None") and shows the red "You will not be eligible for CMSS." Continue (primary) is disabled until ≥1 category; hint "Select the category that applies to you to continue." / "N categories selected." Continue saves `SCH.cats`, starts a new form (`sfStart`) and opens `#sch-form`. Opening `#sch-declare` directly (no Apply Now) goes back to the list.
- **Application form `#view-sch-form` (CMSS-05 … 05.14, Phase 1b):**
  - Head "CMSS Application" + line (full name · academic year · application type · categories), "Scholarships" back button, yellow **deadline bar on every step**, a card with the **DS stepper** (7 steps: Basic Details, Admission Details, Fees Details, Family Details, Aadhaar Verification, Upload Documents, Review; done steps are clickable; ≤767px the stepper is replaced by "Step N of 7 + name + progress bar"), the step's section cards (`.sf-sec` + `.ui-form-sec-head`, fields in a 3 → 2 → 1 column grid), and a footer card: pending hint (red "Complete: A, B, C and N more" / "All mandatory details of this step are filled."), **Back** (outline), **Save as Draft** (soft), **Next** (primary; "Submit Application" on Review). **Next is disabled until every mandatory field of the step is filled and valid.**
  - **Verified-source fields** (sample `SF_PREFILL`: name, DOB, gender (DigiLocker); email, mobile, address, state, district, taluka, pincode, previous qualification, all current admission (Agency data)) are **readonly with a green lock tag** "DigiLocker" / "Agency data" (`SRC`). Missing ones (Social Category, City / Village, Passing Month, institute address / location, entrance exam, domicile certificate…) are editable.
  - Step 1: Personal (6), Address & Domicile (10; State → District → Taluka → City cascade from sample `SF_GEO`; pincode 6 digits; issue date not in the future), Other Details (disability Yes / No → % 40–100 + UDID; orphan Yes / No → where you live). Disability / orphan questions are mandatory only for Category 4 / 6.
  - Step 2: Previous Qualification (14, institute address max 250 with counter, cascade location), Current Admission (13).
  - Step 3: Annual Institute Fees (> 0), MYSY Assistance received Yes / No → amount.
  - Step 4: Father / Mother (`sfParent`: name always; Defence / Police (Cat 2) → service status; Shramik (Cat 3) → worker subcategory; disability (Cat 4) → % + UDID); Mother's marital status (Cat 5 / 7; "Marital status does not match the selected category."); Guardian / Orphanage section only when orphan = Yes; **Income**: certificate number + **Fetch** – the sample number `INC/AHD/2026/45120` is "received" from the income API (amount ₹2,40,000 + date locked, tag "Income API"); any other number → "Details were not received" → the student types amount (≤ ₹4,50,000) + date, and the Income Certificate upload becomes mandatory.
  - Step 5: Aadhaar 12 digits + **Verify with DigiLocker** (spinner). Last 4 digits must be **4321** (sample DigiLocker) – else "Aadhaar number does not match your DigiLocker Aadhaar."; success = locked + green note.
  - Step 6 Upload Documents: Common (Student Photograph = auto from DigiLocker; Domicile Certificate, Previous Qualification Marksheet, Fee Payment Receipt; Income Certificate only if the API failed) + **category-wise groups only for the selected categories** (tag "YOUR CATEGORY", rule "Upload all" / "Upload any one" / custom): Cat 3 by worker subcategory (3.1–3.4), Cat 6 + Guardian Affidavit when living with a guardian, Cat 7 by mother's marital status (7.1 Divorced / 7.2 Abandoned), Cat 1 document optional ("to be confirmed"). PDF (photo JPG / PNG), max 2 MB: "Only PDF files are allowed." / "File size must be up to 2 MB.". Upload / Remove (`.sf-doc`).
  - Step 7 Review: 3 counters (fields verified from records / entered by you / documents), each section with **Edit** (goes to that step) and every value marked "Verified · <source>" or "Entered by you", Aadhaar masked, declaration checkbox (`#sfDecl`) – Submit enabled only when ticked.
  - **Submit → CMSS-06** (`sfEligibility`): Step 1 at least one selected category matches the data (Cat 1 gender only – taluka literacy is for the Help Center), Step 2 pathway (Class 12 Science / General → UG etc.), Step 3 income ≤ ₹4,50,000, Step 4 domicile state = Gujarat. Fail → modal `#mdSfElig` "Not eligible for CMSS – Your application is not submitted." with the failed checks. Deadline over → toast, not submitted. Pass → success card (Application ID, **Download Application** PDF, Go to My Applications) and the application is added to My Applications as **Submitted** (replaces its draft).
  - **Save as Draft** adds / updates a Draft row in My Applications (saved step + all data, `a.form`). **Continue** on such a draft opens the form at that step (`sfContinueDraft`). Older sample drafts (without saved data) still show the toast.
  - My Applications View / PDF use the application's own details (`a.details`, `a.docs`) when it came from this form.
  - **The engine is shared by CMSS and MYSY** (Phase 2): `sfSecs()` → `SF_CMSS_SECS` / `SF_MYSY_SECS`, `sfDocGroups()` → `sfCmssDocs` / `sfMysyDocs`, `sfEligibility()` → `sfCmssElig` / `sfMysyElig`, prefill `SF_PREFILL` / `SF_MYSY_PREFILL()`. Values with source "Declaration" are locked and shown in Review as "From your declaration" (not counted as verified).
  - JS: `SF_GEO`, `SF_STEPS`, `SF_CMSS_SECS` (field schema: `k`, `l`, `t` text / num / date / sel / radio / area / fetch / aadhaar, `o`, `r` / `en` functions, `v` validator, `kids` cleared when the parent changes), `SF_PREFILL`, `F` (values + `files`), `SRC`, `SF` (step, maxStep, draftId), `sfStart`, `sfOpen`, `sfRender`, `sfSync`, `sfPendingOf`, `sfDocGroups`, `sfReviewData`, `sfEligibility`, `sfSubmit`, `sfSaveDraft`, `sfContinueDraft`. CSS prefix `sf-`.
- JS: `SCH` (today, year, prevYear, sample `student`, `approved`, current `code` / `type` / `cats`), `SCH_LIST`, `SCH_CRIT`, `SCH_CATS`, `schRender`, `schOpenCriteria`, `schAppType`, `schApply`, `sdOpen`, `sdSync`. `showView` calls `sdOpen` / `schRender`. CSS prefix `sch-` / `sd-`.

- **MYSY (Phase 2):**
  - Sample `SCH.approved.MYSY` was emptied (it held 2025-26 / 2024-25), so MYSY is now **Delayed** and shows the Fresh / Delayed flow. `SCH.student` also has `lastPassed` "Class 12", `stream` "Science", `admittedIn` "UG", `course`, `mbbs` false, `mysyCourse` true. Renewal is shown in Phase 3.
  - **Declaration MYSY-04** (same page `#view-sch-declare`, section `#smSec`; the CMSS section `#sdSec` is hidden): "Checked from your admission record" list (`smPreChecks`: pathway ELG-MYSY-F01.1, eligible course F01.2, MBBS NEET F01.3 – a failure blocks with its message); **dynamic marks label** ("Your Class 10 percentile" / "Your Class 12 percentile" / "Your Diploma percentage"); NRI seat, main earning member died, parent jawan died on duty (Yes / No, all mandatory). Errors: "Enter a number from 0 to 100." / "Your Class 12 percentile is below the minimum required for MYSY. You are not eligible." (80 percentile, Diploma 65%) / "No MYSY benefit is given on an NRI seat.". Jawan = Yes skips the marks (and later income) limit with a hint. Continue → `sfStart` → MYSY form. State `SM`.
  - **Form MYSY-05** (`SF_MYSY_SECS`, same 7 steps): Personal (Student Category), Address & Domicile (Village); Previous Qualification **only of the last passed qualification** (Class 12 / Class 10 / Diploma sections; the percentile / percentage is locked with source "Declaration"); Current Admission (TFW seat, Management Quota Yes / No; NRI seat locked from the declaration); Fees (Yearly Tuition > 0, Other ≥ 0, **Total Fees auto sum, read only**); Hostel (Are You Hosteller → 9 hostel fields with Gujarat district / taluka / village cascade); Parents / Guardian (5 fields, mobile 10 digits); Income (Fetch, limit ₹6,00,000 – not applied when jawan = Yes); Aadhaar (same as CMSS).
  - **Documents MYSY-05.10** (`sfMysyDocs`, one list, no category groups): Passport Size Photo (DigiLocker), Domicile Certificate, marksheet of the last passed qualification (SSC / HSC / Diploma), Admission Letter, Tuition Fee Receipts, Hostel Fees Receipt (if hosteller), Income Certificate (if the API failed).
  - **Eligibility MYSY-06** (`sfMysyElig`): admission pre-checks + NRI, marks (unless jawan), income ≤ ₹6,00,000 (unless jawan), domicile Gujarat → same fail modal / success card / My Applications row as CMSS.
  - Drafts also save the declaration answers (`a.form.sm`).
- **Renewal (Phase 3, CMSS-07 / 08, MYSY-07 / 08)** – shown with the 2nd demo student (Sign In `renew@gmail.com`):
  - `SCH_STUDENTS` = `s1` (no approved history) and `s2` (CMSS approved 2025-26 + 2024-25 → **Renewal**; MYSY approved 2024-25 only → **Renewal Delayed**), each with `profile`, `approved`, and for s2 `db` (dashboard), `verified` (locked values) and `prev` (what she entered herself in the earlier application: CMSS categories ["5"] + data, MYSY declaration answers + data).
  - Apply Now with type Renewal / Renewal Delayed **skips the declaration** and calls `sfStartRenewal()` → the same form, title "<CODE> Renewal Application": verified data locked, earlier manual data **prefilled and editable**, income fields **empty** (asked again, Fetch), result declared default **Yes**, Aadhaar shown masked + locked (DigiLocker, not asked again).
  - `sfRenewSecs()` = the scholarship's schema + new section **"Previous Year / Semester Result and Attendance"** in Admission Details: result declared Yes / No; marks (if Yes, ≥ 50: "Minimum 50% marks are required to apply for renewal."); attendance (always, ≥ 75: "Minimum 75% attendance is required to apply for renewal."); MYSY also **ATKT** Yes / No (if result Yes) → cleared in first attempt Yes / No + ATKT marks ≥ 50 ("ATKT must be cleared in the first attempt with minimum 50% marks to apply for renewal."). Fees hint "Prefilled with last year's amount. Check and update if your fee has changed."; income limit message "… to apply for renewal."
  - `sfRenewDocs()` (only new documents): Previous Year Marksheet (if result declared), Principal / Head of Institution Certificate (Annexure 5 / 6), CMSS Fee Payment Receipt / MYSY Tuition Fee Receipts, MYSY Hostel Fees Receipt (if hosteller), Income Certificate (if API failed), Self-Declaration Annexure 7 (CMSS) / Annexure 9 (MYSY) if the result is not declared.
  - `sfRenewElig()`: marks ≥ 50 (if declared), attendance ≥ 75, income limit, MYSY ATKT rule → same fail modal / success / My Applications row ("CMSS Renewal Submitted").
  - Dispatchers check `sfIsRenew()` first (`sfSecs`, `sfDocGroups`, `sfEligibility`).

### Scholarship verification – Help Center + Commissioner Office (Phase 4a done 16/11/2026; spec tab "Verification", rules VER-01 … 18)
- **Data `VER`:** 9 sample applications (`verSeed`: LDCE / VGEC / GEC Gandhinagar; statuses Submitted, Resubmitted (with an earlier Send back remark), On Hold (student action No), Expired, Under Review ×2) + **every application a student submits from the form** (`verFromForm(a, rv)` in `sfSubmit`, linked to the My Applications row by `r.ma`, so actions change the student's status too – `verSetStatus`). Each record: sections `[label, value, source]` (source "" = entered by student), docs, remarks (rounds), log, classification.
- **Help Center list `#view-hc` (HC-01, VER-01):** filters card (College – decides whose applications, default LDCE; Scholarship, Academic Year, Application Type, Status, Search ID / name) + table (Application ID, Student Name, Scholarship, College short name, Course, Application Type, Submitted / Resubmitted date-time, Status badge, View). Only Submitted / Resubmitted / On Hold / Expired; Correction Required and Under Review leave the list. Empty "No applications to verify."
- **Review page `#view-ver-view` (HC-02, VER-02 / 13):** title "<Scheme> Application <ID>", line with name · type · year · status; legend; **Earlier remarks** card (all rounds, latest first, formatted); section cards where every field shows "Verified by DigiLocker / Agency data / Income API" (green) or "**Entered by student**"; Uploaded Documents with View (toast); **classification card (HC-02.1, VER-03 / 04):** CMSS Department (prefilled from admission data) + Course group, MYSY Course Type – dropdowns with a "Suggested" tag when an earlier classification of the same program exists (`VER_SUGGEST`: BE/B-Tech, B.Pharm, Diploma Engineering; e.g. B.Sc has none); changes go to the log. **Sticky action bar** (always visible): Hold (outline), Send back (danger-soft), **Lock** (primary).
- **Lock (HC-03, VER-05):** blocked with "Select the department and course group before locking." / "Select the course type before locking." (red under the field + toast); else `#mdVerLock` "Have you reviewed all fields and documents?" → Confirm → status **Under Review**, classification saved, log, back to the list.
- **Send back (HC-04, VER-06 / 07) and Hold (HC-06, VER-14 / 15)** use `#mdVerAct` with a small **rich-text editor** (`.ver-rte`: B, I, U, bullet list; `contenteditable`; HTML cleaned to b / i / u / ul / ol / li / br / p / div by `verClean`). Remarks mandatory ("Add remarks for the student."). Send back → **Correction Required** (+ send-back date), leaves the list. Hold also needs **Student action required Yes / No** ("Select whether student action is required.") → **On Hold**, stays in the list and on the page (Lock / Send back / Hold again possible).
- **Commissioner Office list `#view-co` (CO-01, VER-12):** scholarship tabs **CMSS** (default) / **MYSY** (page-level buttons – the DS has no tabs); filters change with the tab (CMSS: Department + Course group; MYSY: Course Type) + College + Search; columns incl. Department / Course group or Course Type, Tuition fee, Locked on. Only **Under Review**. Empty "No applications to review."
- **Commissioner view (CO-02):** same page read-only – every manual field shows "**Verified by Help Center**", classification + Tuition fee read-only, **Activity log** card, no action buttons (decision buttons come in the next spec).
- **Student side:** My Applications badges – Draft neutral, Submitted / Resubmitted review (blue), Under Review shortlisted (navy), Correction Required / On Hold **warning** (new DS badge), Expired rejected; the Status filter lists the statuses present.
- **Phase 4b (done):**
  - **Status + progress tracker (COM-03)** on View Application (`stTracker`, added by `showView` above the details; **also for the old sample rows** of My Applications – they are not in `VER`, so the tracker uses the row's own status, without remarks / Update, and they do not appear in the Help Center list): status badge + message (e.g. "Waiting for the Help Center…", On Hold Yes / No, Correction Required "Resubmit by DD/MM/YYYY (N days left)"), DS stepper Submitted → Help Center Check (red when Correction Required / Expired) → Commissioner Review → Decision, the latest Help Center remarks, and **Update Application** when allowed. View / PDF now work for every non-draft status.
  - **My Applications rows:** **Update** button (Correction Required, or On Hold with student action Yes) + a note "N days left to resubmit" / "No action needed" / "Expired – no action possible" (`maUpdBtn`, `maStNote` – hoisted functions with try / catch, because `maRender` runs at page load before VER exists).
  - **Update page `#view-ma-update` (COM-04, VER-08 / 09 / 10 / 18):** deadline bar (resubmit allowed after the application deadline), remarks card, legend, every section with verified fields **locked** (source tag) and the student's own fields **editable**, documents with **Replace** (PDF, 2 MB). **Resubmit** is disabled until at least one item really changed (same value re-typed does not count; a new file counts) – hint "Please update the items mentioned in the remarks." / "N items changed." Resubmit → status **Resubmitted**, values saved, `r.updated` = changed items, log.
  - **Help Center review of a resubmitted application (HC-05, VER-11):** card "**N updated**" with each field old (struck) → new and each new document (View), changed fields highlighted in their section, earlier remarks above. Seed Joshi Dev has 2 updated items.
  - **Timeline (HC-07, VER-16 / 17):** Send back date + 15 days; reminders on day **10, 13, 14** (only while Correction Required; they stop after resubmit); day 16 → **Expired** + expiry notification; Expired cannot be updated; the Help Center can send it back again (new 15 days). Runs in `verTick()` against `VER_CLOCK`. **Demo button "+1 day"** with "Demo date: …" in the My Applications page head moves the clock (demo only).
  - **Notifications (COM-05):** header bell shows the student's unread count (hidden when 0 or for other roles); click → drawer `#drNoti` (DS drawer sm) listing Sent back / Put on hold (remarks as **plain text**, `verPlain`) / Reminder (days left) / Expired, each "sent by mail and in the app"; opening marks them read. Only the student's own applications (`r.ma`) notify.
- JS: `ROLE`, `roleSet`, `VER`, `verSeed`, `verFromForm`, `verSetStatus`, `verBadge`, `HC` (filters, `current`, `from`), `hcInit` / `hcRender`, `CO`, `coInit` / `coRender`, `vvOpen`, `verOpenAct`, `verClean`; 4b: `VER_CLOCK`, `NOTI`, `notify`, `verTick`, `verDue` / `verDaysLeft`, `verCanUpdate`, `notiBadge` / `notiOpen`, `stTracker`, `UP` / `upOpen` / `upChanges` / `upSync`, `vvUpdatedAdd`, `verClockRender`. CSS prefixes `ver-`, `st-`, `noti-`.

### My Applications (`#view-my-apps`, student view, scholarships) – spec COM-01, COM-01.1, COM-01.2, COM-02
- Common for every scholarship (CMSS, MYSY, Post Matric (SC)…). Shows only the logged-in student's applications, **latest first**.
- **Filters are in the table head** (no filter card above the table), the same pattern as Design System **Table Type 4**: a filter icon (`.ui-th-btn`) next to **Scholarship**, **Academic Year** and **Status**. It opens a popover (`#maPop`, `.pop`) with a search box + checkbox list (many values; count per option) + Clear / Apply. An active filter shows a filled icon and a chip above the table (`#maChips`, `.tb-chips` + `.chip`, × to remove, "Clear all"). The popover closes on outside click, Esc, page resize, table scroll or page change.
- **Table columns:** Application ID, Scholarship (code + full name), Academic Year, Application Type (Fresh / Renewal / Delayed / Renewal Delayed), Submitted Date (only for submitted, "–" for drafts), Status (Draft = `.ui-badge-neutral`, Submitted = `.ui-badge-review`), Action.
- **Actions:** Draft → **Continue** only; after the deadline it is disabled with "Application deadline is over." (the application form is not built yet, so Continue shows a toast with the saved step). Submitted → **View** + **Download Application**.
- Empty states: no application → "You have not applied for any scholarship yet." + "Go to Scholarships" (toast, page not built yet). Filter with no rows → "No applications found."
- **View Application** (`#my-apps-view`, Back + Download Application): read-only cards in the Review-step order – Submission Details, Basic Details, Admission Details, Fees Details, Family Details, Aadhaar Verification (number masked), Uploaded Documents (rows with View, shows a toast). Fields verified from a source show a green "✓ Verified" (legend at the top). Opening it without a selected application shows "Application not found."
- **Download Application** = real PDF via **jsPDF** (cdnjs `jspdf/2.5.1`): title "<Scholarship> Application", submission details + all sections, Aadhaar masked, page footer; file name `<Scholarship>_<Application ID>.pdf` (e.g. `MYSY_01232324334343.pdf`). If the library fails: "Unable to download. Please try again." Drafts cannot be downloaded.
- More statuses (Under Verification, Approved, Rejected) will come with the Nodal Officer spec.
- JS: `MA_APPS` (7 sample applications), `MA_SCHEMES`, `MA_STEPS`, `MA` (filter Sets `scheme` / `year` / `status`, `current` app id, `today` = 14/11/2026 for the deadline check), `MA_COLS`, `maMatch`, `maOpenPop` / `maClosePop`, `maRender`, `maOpenView`, `maDetails`, `maDownload`. CSS prefix `ma-`.

### Company Job Post (company view) – Manage Job Posting + Create / Edit Job Posting – 17/11/2026
- Built from the user's 3 screenshots (Manage Job Posting table, Create Job Posting, Edit Job Posting), **with the Design System only**. The screenshots' own filter icon button was **not** copied (user): the filter is our **Advanced Filter** pattern.
- **Manage Job Posting** (`#view-company-job`, sidebar "Company Job Post"):
  - Page head "Manage Job Posting" + **Add Placement** (primary + plus; full width ≤575px).
  - **Advanced Filter** card: the same pattern as the Student Application page, rebuilt with `.ui-*`.
    - The title has a navy icon box. A gold **Filter** button (`.ui-btn-accent`, count badge, chevron) opens and collapses the panel.
    - Fields (grid of 4 → 3 → 2 → 1): Job Title, Branch, Job Location (city, state), Work Type, Status, Start Date From, End Date To (dd/mm/yyyy, slashes added while typing).
    - A live "N job postings match these filters" line, plus Reset (outline) and Apply (primary).
    - Apply collapses the panel and shows **chips** ("Status: Draft ×") with "Clear all".
  - **Table** (Design System Table Type 2): Sr No., Job Title, Branch (first one + "+N" badge with all in the tooltip), Job Location, Start Date, End Date, Status (Published = `.ui-badge-approved`, Draft = `.ui-badge-neutral`), Action.
  - **Actions** (user's choice "Edit for all rows"):
    - Published: View (eye) · **Edit** · Applicants (people icon = `user`, `.ui-act-resume` gold).
    - Draft: View · 3 dots menu `#cjpMenu` (**Edit**, **Review & Publish**, **Delete**).
    - Edit and Review & Publish both open the filled form.
    - Delete asks in `#mdCjpDel` (sm modal, Danger button).
    - **View and Applicants only show a toast for now** (user).
  - 10 per page, legacy `.pager` + "Showing X to Y of N entries". Empty states: "No job postings found. Try changing or clearing the filters." / "No job postings yet…".
- **Create / Edit Job Posting** (`#view-company-job-form`, one form for both):
  - Titles:
    - Create: "Create Job Posting" with "Add the job details below…"; the button is **Publish**.
    - Edit: "**Edit Job Posting**" with "Update the job details…"; the button is **Update Job Posting** for a published job, or **Publish** for a draft.
    - The Edit screenshot said "Create Job Posting"; Claude used "Edit" so the two are clear.
  - Back button → table. Sections (`.cjp-sec` cards with `.ui-form-sec-head`), texts as in the screenshots:
  1. **Registration Details:** Job Title*, Work Type* (On-site / Hybrid / Remote), Application Start / End Date* (dd/mm/yyyy text + auto slashes; there is no DS date picker yet), Vacancies* (number ≥1), Job Location* (dropdown of the company's addresses, with search).
  2. **Selection Process & Status Mapping** (since 16/11, from the user's doc `Selection Process Templates – USK Placement Module 2.docx`):
     - **Two choice cards** (`#cjpChoiceField`, `.cjp-choice-card`, radio style; since the 16/11 change "templates in a modal"): **Use a Ready Template** and **Create Custom Process**. Nothing is picked by default; Publish needs one ("Choose a ready template or create a custom process."). Arrow keys move between the cards.
     - **Use a Ready Template** opens the modal **`#mdCjpTpl`** (lg, "Selection Process Templates", subtitle "Pick a ready selection process for this job. Its rounds and statuses are added for you." – changed on request 16/11): the 5 templates as radio cards (name, "N steps" badge, the path "Resume Screening → … → Final Selection"; **no "Suitable for"** – removed on request 16/11, the `for` text stays only in the `CJP_TPL` data). The picked card opens its read-only Step / Round / Mapped Statuses table. Footer: Cancel + **Use This Template** (disabled until one is picked). Cancel keeps the old choice.
     - After "Use This Template" the form shows "SELECTED TEMPLATE &lt;name&gt;" (no "Suitable for") + **Change Template** (outline sm, opens the modal again with the current one picked) and the read-only flow table.
     - Templates (`CJP_TPL`): Quick Hiring (Interview Round), Standard Interview (Technical, HR), Test and Interview (Aptitude, Technical, HR), Practical Assessment (Practical, Technical, HR), Multi-Stage (Aptitude, Group Discussion, Technical, Managerial, HR).
     - The flow shows as a table (`.cjp-flow`: Step | Round | Mapped Statuses as neutral badges). **Resume Screening (Under Review) is always Step 1 and Final Selection (Shortlisted, Rejected, On Hold) always last** – both marked "Fixed step" with a lock icon, also in Custom (user's choice). Status mapping per round = `CJP_SEL_ST` (same in every template). A template's rounds are read-only.
     - **Custom**: Design System Form Patterns rows (`.ui-repeat.is-list`) between the fixed steps: "Step N – Round Name*" text + "**Mapped Statuses***", which **works like Skills Required** (since the 16/11 change "Add Status modal"):
       - A **compact** multi `.ui-select` with search (`data-rnd-sts`, full width, `data-max-tags="2"`: the box stays one line – 2 tags + "+N more", see §7 Design System changes) of `CJP_STS_LIST` (starts as `CJP_CUSTOM_ST`: Scheduled, Appeared, Not Appeared, Joined, Not Joined, Cleared, Not Cleared, On Hold). **No "Add Status" button** (removed on request, 16/11) – the modal opens only from the "+ Add “X” as a new status" line in the search (below). No hint under the dropdown (added, then removed on request 16/11). Instead an **info icon (i)** after the "Mapped Statuses*" label (DS `.ui-info`) with the tooltip "Status not in the list? Type it in the search box and click “+ Add … as a new status” to add your own." (hover, keyboard focus or tap).
       - The Add Status modal **`#mdCjpSts`** (data-static, copy of the Add Skill modal): type a status + Enter / "Add" → chips "Statuses to add N" → **Add Statuses**. Errors: empty, already in the list, already added below, none added.
       - Saved statuses go to the **top of every round's dropdown** (not picked automatically, same as skills), and that round's dropdown opens so the owner can pick them.
       - **Info line inside the open dropdown** (`.cjp-sts-tip`, under the search, outline info icon, caption grey): "Can't find a status? Type it above to add your own." It shows when the list opens and while the search has no new name; it is replaced by the "+ Add" line below as soon as a new name is typed. The (i) label tooltip stays too (user: "icon rakho").
       - In the dropdown search, a text with no exact match shows "**+ Add “X” as a new status**" at the **top of the menu**, right under the search and above the list (`.cjp-sts-addnew`, click / Enter; moved there on request so small screens don't need to scroll) → the modal opens with X filled in.
       - Drag ⠿, delete, "+ Add Round".
     - **"Add Round" is disabled until the last round has a name and at least 1 status** (help text says so). Min 1, max 8 rounds. Errors: empty name, duplicate name (also "Resume Screening" / "Final Selection"), "Add at least one status.". Custom rows stay in memory if the user switches to a template and back.
     - JS state `CJS` (`mode` "" / "template" / "custom", `tpl`, `pick` = choice inside the modal); a row keeps its statuses in `row._sts`.
     - Note under the flow: "When a student applies, the application status is Applied."
     - Data: a post has `tpl` (template name, "Custom" or "") and `rounds` (`[{name, sts}]`, Custom only). The old `steps` array was removed.
  3. **Job Description:** radios Upload Document / Write Description (native radio + `accent-color` navy, because the DS has no radio yet). Upload = `.ui-drop` (PDF/JPG/PNG, max 5 MB, drag & drop or click) → `.ui-file-row` with Remove. Write = textarea.
  4. **Candidate Eligibility:** Degree/Program* and Branch/Subject* (multi `.ui-select` with search, tags).
  5. **Eligibility Criteria:** Select Eligibility Criteria* (multi: Percentage, CGPA, Age Criteria, Backlogs, Passing Year). Each picked criterion becomes a row (CSS-grid "table" `.cjp-crit`, so dropdowns are never cut): Criteria | Condition (Greater Than Or Equal To / Less Than Or Equal To / Equal To; Age defaults to Less Than Or Equal To) | Value | delete (removes it from the select too). On mobile each row stacks.
  6. **Skills Required:** **our Job Oriented Skills picker** (user's choice): skill dropdown + navy **Add Skill** (`#mdCjSkill` modal) + info box "Skill not in the list? + Add Skill" + the "Is X required or optional?" box + Required / Optional groups (plain chips, no edit / delete).
  - Footer: **Save as draft** (`.ui-btn-soft`) + Publish / Update Job Posting (primary).
  - Validation:
    - Publish needs everything: each empty field shows a red `.ui-help` under it; End ≥ Start date; a template selected (Custom: each round with a unique name + at least 1 status); a file or a description; at least 1 degree, 1 branch and 1 criterion with condition + value; **at least 1 required skill**, and no skill still waiting for Required / Optional.
    - Save as draft needs only the Job Title, plus valid dates / vacancies if they are filled.
    - The page scrolls to the first error and shows a toast.
    - Errors clear as soon as the field changes.
  - Saving: a new job goes to the top of the table; an edit updates the row (Save as draft makes it Draft, Publish / Update makes it Published). Then it returns to the table with a toast.
- Sample data: `CJP.posts` (14 jobs; rows 1–5 are the screenshot's, no. 3 "Software Developer" is the Edit screenshot's data). `CJP_LOCS`, `CJP_DEGREES`, `CJP_BRANCHES`, `CJP_CRIT`, `CJP_COND`. In memory only.
- JS:
  - Table + filter: `cjpRender`, `cjpMatch`, `cjpPager`, `cjpFilterFields` / `cjpReadFields` / `cjpPreview`, `cjpEdit(id)`, `cjpCloseMenu`.
  - Form: `cjpOpenForm` (called by `showView`; `CJP.editId` = the job being edited or null), `cjpSetTpl(name|"Custom"|"")` / `cjpTplRender` / `cjpTplValue`, modal `cjpTplOpen` / `cjpTplList`, `cjpStep` (one Custom round row) / `cjpStepsSync` (also the Add Round rule), status dropdown `cjpStsSelect(row, values)` / `cjpStsHas`, Add Status modal `CJN` / `cjpStsOpenModal(row, prefill)` / `cjnAdd` / `cjnRender` / `cjnHelp`, `cjpFlowRow`, `cjpDescMode`, `cjpTakeFile` / `cjpFileRender`, `cjpCritRender` (`CJF.crit` Map), `cjpCollect`, `cjpValidate`, `cjpSave(publish)`.
  - Helpers: `cjpDate` (dd/mm/yyyy → Date), `cjpVal` / `cjpVals` / `cjpSel` (read / set a `.ui-select`), `cjpErr(field, msg)`.
  - Skills: `cjLoadSkills(skills)` + the existing `cj*` picker code (`CJ_SKILLS`, `CJ.draft`, `cjPick`, `cjAnswer`, `cjOpenAddModal`, …).
- CSS prefix `cjp-` (+ the `cj-` picker styles). The old "Post a Job" skills card, the `#company-job-skills` page, `cjRenderPage` / `cjOpenPage` / `#cjSave` were removed.

### Skill Passport (`skill-passport.html`)
- Hero banner, student details (masked email / APAAR / mobile with show/hide), summary tiles, tabs, in this order since 16/11/2026: **1 Academic** (open by default; Your Journey timeline + Education accordion), **2 Projects & Research** (dissertation, research papers, college projects), **3 Skills & Certificates**, **4 Experience** (internship, special achievements). The tab / panel **ids are the old ones** (`tab-education` = Academic, `tab-academic` = Projects & Research), so the summary tiles (`data-go`) keep working, Job Oriented Skills modal (search + chips, max 15), Your Journey timeline + Full Journey drawer, education accordion, 3-dots row menu. Page-level classes use the `sp-` prefix.

### Design System changes made during this work
- Added `.ui-badge-neutral` (no dot) for non-status labels.
- `.ui-select` now dispatches a bubbling `ui-select-change` event.
- **Category colours** (16/11, user: take the live site's colours): `--color-cat-{purple|green|teal|blue|orange}` (#7C3AED, #16A34A, #0D9488, #2563EB, #EA580C) + `-bg` (10%) + `-border` (15%), in `usk-design-system.css` after the status colours, shown on Design System → Colors → "Category colors". Only for service / category cards – never for status.
- **Info tooltip** (16/11): `<button class="ui-info" type="button" aria-label="Info: …">` + outline info icon 14 + `<span class="ui-info-tip" role="tooltip">…</span>`, placed inside a `.ui-label` after the `.ui-req`. Navy bubble (`--color-primary-900`, white text, arrow) above the icon, max 260px / 70vw. Shows on hover and keyboard focus (CSS) and on tap / click (`.is-open`, toggled by a document click handler right after `initSelect`); outside click or Esc closes it. The label height does not change, so fields in a row stay aligned. Demo: Design System → Form Inputs → Dropdown ("Label with Info"). Use it when help text under a field would break the alignment.
- **Compact multi-select** (16/11): `.ui-select.is-multi` + `data-max-tags="N"` → the box stays one line (38px): the first N tags (long names cut with "…", max 160px, × still works) + a grey `.ui-tag-more` "+X more" (tooltip = the other names). Open the list to see / change all. CSS in `usk-design-system.css` (after `.ui-tag`), JS in `initSelect` → `sync()`. Shown on Design System → Form Inputs → Dropdown ("Multi-select – Compact"). Used by the Custom round Mapped Statuses.
- The `.ui-select` search box focuses with `preventScroll`, so opening a dropdown never scrolls the modal.
- Disabled inputs and dropdowns are one step darker than Default (Default looked the same before): `--input-bg-disabled` = gray-200 `#E4E9F0`, new `--input-border-disabled` = gray-300 `#D4DBE4`, `--input-text-disabled` = gray-400 `#9AA8B8`. Disabled buttons, the accordion and `.ui-add-row` still use `--color-bg-disabled`.

## 8. Known gaps / next ideas
- No focus trap in modals and drawers. Esc can close the modal and the mobile sidebar at the same time.
- The legacy Student Application view, sidebar and header should move to `.ui-*` components and `--color-*` tokens.
- Missing Design System components (see §4). The neutral and warning badges are not shown on the Design System Table tab yet.
- Dashboard: `.db-tag` (label tag in 7 tones) and the `‹ 1 / n ›` pager are page-level for now; they should move into the Design System (Badge / Pagination). Megaphone, clock, location, building and store-logo icons are missing (see §7 Student Dashboard). Attendance, scholarship links, events and the app store buttons only show toasts.
- Company Job Post: View job posting and Applicants only show a toast. There is no DS date picker or radio style yet (the form uses dd/mm/yyyy text and a native radio). The filter / pagination are page-level (legacy `.pager`). The data is lost on reload.
- Job "View" only shows a toast; there is no job details page yet. Company logos are initials (no images).
- All data is sample data; a backend/API is not connected.
- Sign In: `img/sign-in-image.png` is 8 MB (compress before going live); headset / globe icons missing; slides 2–3 text written by Claude (user may replace); small dots = small tap targets on phones.

## 9. Change log (flow-wise, oldest first)

Each entry: **asked** → **done** → **open**. Dates are DD/MM/YYYY (2026).

**04/11 – Review + Job Opportunities (in the old "USK-FRONT END Changes" folder, later moved here)**
- Asked: review the Skill Passport + front-end design system; add a sidebar page **Job Opportunities** (table from a screenshot) + a **Job Preference** modal (country / state / district).
- Done (in this order, each on request): table in Design System Table Type 1 → modal with India fixed + multi-select state / district → modal must **not** open by itself, "Add Job Preference" button instead → location rows (Country, State, District) with "Add More Location" (Form Patterns style) → remove Country, remove drag, dropdown floats above the modal (no scrollbar) → Country back, 3 fields per row, Add More disabled until the row is complete → rows replaced by **one Add row + a table above** (Sr No, Country, State, City/District, delete), no "Location 1/2" → table hidden until the first location → less table padding → Country / State / City merged into one column "Country, State, City / District".
- Design System: disabled inputs made one step darker than Default; Form Inputs → Input States got an "On a white background" box (Default / Disabled / Read-only).
- Folder: both projects (USK-FRONT END Changes + USK Skill Passport) combined into `USK-NEW` with this CLAUDE.md; the user then moved it to `Downloads\oko\USK-NEW` (GitHub + Vercel).

**05/11 – Company Job Post (commit "job post skill added")**
- Asked: a company-side sidebar page where the company owner posts a job; the job-oriented skills picker like Skill Passport, plus asking **Required or Optional** for each skill.
- Done: page "Post a Job" + skills modal with the Required / Optional question → then (on request) **no modal**: "Add Skills" opens its own page `#company-job-skills`; custom (typed) skills can be renamed in place (typo fix).

**14/11 – My Applications (commit "my applications done")**
- Asked: from a spec table (COM-01, 01.1, 01.2, 02) a student **My Applications** menu: list, Continue draft, View, Download PDF.
- Done: page + View Application page + jsPDF download → then filters moved from a card above the table **into the table head** (Table Type 4 popover: Scholarship, Academic Year, Status).

**14/11 – USK_Prototype review, two experiments, full revert**
- The user added `USK_Prototype/` (older clickable prototype: student portal, COGENT admin with 7 roles, company portal; own CSS, emoji icons, dummy `data.js`). Reviewed – no changes.
- Experiment 1: re-skin the prototype to the Design System (DS CSS + skin layer, colours → tokens, emoji → SVG icons, DS docs page + md files inside the prototype).
- Experiment 2: combine both projects – new `index.html` with a role switcher (Student / COGENT Admin / Company), student login + full student dashboard rebuilt with the DS; old portal renamed `portal.html`.
- **The user asked to revert everything** → root restored to commit `d9488de` and `USK_Prototype/` restored byte-for-byte from the original. **Don't redo these experiments unless asked.** The agreed way forward: take screens from the prototype **one by one, when the user asks**, and rebuild them inside this portal with the Design System. (A backup of the original prototype also exists in an old Claude scratchpad; `USK_Prototype/` itself is the original.)

**16/11 – Student Sign In (first screen)**
- Asked: `index.html` must open on a **Student Sign In** page matching a screenshot (student side only, other roles later; **sign in only, no sign-up**); left photo `img/sign-in-image.png`; demo login `abc@gmail.com` / `abc@123`; after sign in → **Student Application** page. Plan: modules (Skill Passport, Attendance, …) will be added into this portal step by step.
- Done: Sign In screen (§7) → demo hint box removed, both fields **pre-filled** instead → left text became a **3-slide slider** (Claude wrote slides 2–3) → slider **always auto-moves** (no pause on hover / reduced motion) and dots still work → **4 s** per slide, dots 4px apart.
- Also: this §0 working flow + this change log added; rule: update CLAUDE.md after every task.
- Open: commit / push not done (user does it); image size; missing icons (headset, globe); next module to be chosen by the user.

**16/11 – Sign In left overlay: Figma colour on trial**
- Asked: in Figma the user set the photo overlay to `#1E1E1E` at 70%. Which looks better, Claude's or the Figma one? Then: "try yours… mine too, so I get an idea".
- Claude's advice: keep the navy gradient. It uses `--color-primary-900` (same as `--color-bg-overlay`), runs from 45% at the top to 85% at the bottom so the photo shows, and fits the brand. `#1E1E1E` is not a Design System token.
- Done: `.lg-left::before` now uses the Figma `rgba(30,30,30,.7)`, flat. The old navy gradient is kept in a CSS comment on the same line, so it can be put back in one step.
- **Decision (user): Navy gradient stays.** The Figma flat overlay was removed and line 313 restored exactly: `linear-gradient(180deg, rgba(15,31,49,.45) 0%, .55 45%, .85 100%)`. Don't switch to `#1E1E1E` again unless the user asks.

**16/11 – Student Dashboard (first page after Sign In)**
- Asked: after Sign In, show a student dashboard like the `USK_Prototype` index page (screenshot: profile banner, Latest Update, Quick Services, Govt Schemes). Keep the layout, but use **our Design System** for colours, icons and components. The prototype was made by another designer, so modules are taken from it **little by little**.
- Answers to Claude's questions: build **all 10** prototype sections; Sign In must open the Dashboard (built inside the portal, with the sidebar, as the first menu item); Quick Services colours = **DS tints** (navy / green / blue / gold).
- Done: `#view-dashboard` (§7), plus modals `#mdScheme` and `#mdAnn`. Sign In and the default route now go to `#dashboard`. A backup of the old index.html is in the Claude scratchpad (`index.before-dashboard.html`).
- Open: the user to check the look. Missing icons go to the UI Designer. `.db-tag` and the pager should move into the DS. The real Attendance and Scholarship pages are still to come. Nothing committed.

**16/11 – Dashboard without sidebar**
- Asked: "dashboard ma sidebar nai aave".
- Done: the Dashboard is now full width with no sidebar; the header shows the logo + notifications + settings + avatar + Log out (§7 Student Dashboard). The sidebar still shows on every other page. Tested at 1366 and 375, no console errors.
- Open: whether other pages also need a way back to the Dashboard besides the sidebar link (e.g. a header logo click). Nothing committed.

**16/11 – Review of the live gyandiksha dashboard (review only)**
- Asked: review https://auth.gyandiksha.in/portal-selection (the live student dashboard, already signed in in the user's Chrome). **Only a review, no changes.**
- Found, among other things:
  - The LinkedIn link goes to `linkdin.com` (typo).
  - The floating helpline button covers content.
  - Every announcement says "NEW", and the ticker says "apply now" for announcements.
  - Attendance shows N/A, but the hours show 00h 00m.
  - Text is cut with "...".
  - About 53 colours, with a different colour for every "View Details" button.
  - 9px text.
  - 13 unnamed buttons, 2 images without alt text, no H1, empty headings, a `<marquee>` ticker.
  - The browser tab title is "USK-Auth".
  - The App Store button goes to the generic apple.com page.
- Mobile was not checked (the Chrome window did not resize).

**16/11 – Skill Passport tab order**
- Asked: Skill Passport tabs: Education becomes "Academic" and is the **first** tab, **Projects and Research** is second, **Skills and Certificates** is third, and the Academic tab has **Your Journey**.
- Done: the tabs are renamed and reordered, and Academic is open by default (`aria-selected`, `hidden` moved). Your Journey was already inside that panel. The "Academic Work" tab was renamed "Projects & Research" (research icon). The **Experience** tab was not mentioned, so it stays as the 4th tab (nothing deleted). The summary tiles, click and arrow keys work; no sideways scroll at 375; no console errors.
- Backup: `skill-passport.before-tabs.html` in the Claude scratchpad.
- Open: whether Experience should stay as tab 4, merge into another tab, or go. Nothing committed.

**16/11 – Company Job Post: "Add Skill" modal, no edit / delete**
- Asked: on Add Job Oriented Skills, put an **Add Skill** button next to the skill dropdown. It opens a modal where the owner types and adds **many** skills. After closing it, they are in the skill dropdown. **Remove edit and delete for now.** Picking from the dropdown only asks Required or Optional.
- Done: as in §7 Company Job Post. The "Add new" option in the dropdown was removed, because new skills now come only from the modal. In the modal a skill can still be removed with × before saving, which is not the delete on the page. Tested: duplicates, empty, Enter, Esc, the dropdown shows the new skills on top, the Required/Optional box, chips with no buttons. No sideways scroll at 375, no console errors.
- Backup: `index.before-cj-modal.html` in the Claude scratchpad.
- Open: should new skills also be added straight to the job (asking Required/Optional) instead of only to the list? Should the × inside the modal stay? Nothing committed.

**16/11 – Company Job Post: tell owners about "Add Skill"**
- Asked: owners think skills can only come from the dropdown; show some information that a missing skill can be added with Add Skill. Claude was asked to suggest ideas: 4 were given, and the user chose **1 + 2**.
- Done:
  - (1) A permanent hint with an "+ Add Skill" link under the dropdown.
  - (2) When the search has no exact match, a "+ Add “X” as a new skill" option opens the modal with X filled in (`cjOpenAddModal(prefill)`, `CJ_HINT`).
  - Tested: the link, Enter, mouse, prefill, a partial match ("jav" → Java, JavaScript + add option), an exact match (no add option); no sideways scroll at 375; no console errors.
- Backup: `index.before-cj-hint.html` in the Claude scratchpad. Nothing committed.

**16/11 – Add Skill button navy**
- Asked: "add skill button navy kari dyo". Done: `#cjAddSkillBtn` changed from `.ui-btn-outline` to `.ui-btn-primary` (navy). The page now has two primary buttons (Add Skill + Save Skills), as the user asked. Nothing committed.

**16/11 – Info box text changed**
- Asked: remove "Required = the candidate must have this skill. Optional = good to have, it gives the candidate extra points." and write "Skill not in the list? + Add Skill to add a new one." in its place.
- Done: the blue info box now holds the Add Skill hint (with a working link). The same hint under the dropdown was removed, so it is not shown twice. The Required / Optional explanation is gone. Nothing committed.

**17/11 – Placement module: Manage Job Posting + Create / Edit Job Posting (company side)**
- Asked: with 3 screenshots, clicking **Company Job Post** must open the job posting **table**. The filter must **not** be like the screenshot, but our Design System **Advanced Filter**. **Add Placement** → **Create Job Posting**; Edit from the table → the **edit** screen. Everything with the Design System.
- Claude asked, and the user answered:
  - Skills section = **our Required / Optional picker** (not plain chips).
  - **Edit for all rows** (Published: View + Edit + Applicants; Draft: View + 3 dots with Edit, Review & Publish, Delete).
  - View + Applicants = **toast for now**.
- Done: §7 "Company Job Post". The old skills-only page was removed (its picker moved into the form).
- Tested at 1366 and 375:
  - Filter: preview count, date check, chips, Clear all, empty state.
  - Create: all errors, then publish.
  - Edit: a draft via Review & Publish, then a published job (Update).
  - Delete with confirm; pager page 2; file row + remove; criteria add / remove; steps add / remove.
  - No sideways scroll (the table scrolls inside its card); no console errors.
- Backup: `index.before-placement.html` in the Claude scratchpad.
- Open:
  - View job posting page and the Applicants list (next steps).
  - ~~Selection steps as text inputs~~ → replaced by templates on 16/11 (next entry).
  - Real date picker and radio in the DS.
  - Nothing committed.

**16/11 – Company Job Post: Selection Process Templates**
- Asked: review the user's doc `Selection Process Templates – USK Placement Module 2.docx` and change the Selection Process in Create Job Posting to match.
- Claude asked, and the user answered: Resume Screening / Final Selection are **fixed in Custom too**; a Custom round = **name + multi-select statuses**; the template dropdown is **empty by default and required** for Publish (optional for a draft).
- Done: §7 Company Job Post, section 2. Sample data: most posts "Standard Interview", no. 3 Custom (Technical Assessment), no. 6 "Test and Interview", no. 13 (draft) no template.
- Tested at 1024 and 375: every template, Custom add / remove, numbering of the last step, errors (template, empty round, duplicate, no status), Edit of a Custom / template / no-template post, Update saves the template; no sideways scroll; no console errors.
- Backup: `index.before-sel-templates.html` in the Claude scratchpad.
- Open:
  - The doc's last point (while reviewing applications the company picks Stage → Status) belongs to the Applicants page, which is not built yet.
  - The Design System "Form Patterns" demo and the "Student View – Selection Process" demo still show the old free-text steps.
  - Nothing committed.

**16/11 – Selection Process: templates in a modal, typed statuses in Custom**
- Asked: the company owner should see the 5 templates **read-only**, **or** choose Custom. The templates go in a **modal**; the one selected shows on the form. In Custom, Mapped Statuses can be **typed and added like the skills**. **Add Round works only when the round above is filled.** Good UX.
- Done: the template dropdown was replaced by 2 choice cards + the `#mdCjpTpl` modal + a selected-template summary with "Change Template". Custom statuses now use the DS Tag Select (type or pick). Add Round is gated. Details in §7 section 2. Claude chose the design without asking (the user asked for "good UX").
- Tested at 1366 and 375: errors, modal pick / cancel / use / change, Custom typed + picked statuses, Add Round gating, edit of a Custom / template / no-template post, save. No sideways scroll, no console errors.
- Backup: `index.before-tpl-modal.html` in the Claude scratchpad.
- Open: should typed custom statuses get a colour / type (e.g. positive / negative) for the Applicants page later? Nothing committed.

**16/11 – Custom process: Mapped Statuses like Skills Required (Add Status modal)**
- Asked: in Create Custom Process, Mapped Statuses must work like Skills Required: a modal where many statuses are added at once, and the added statuses then show in the Mapped Statuses dropdown.
- Claude asked, and the user answered: **"Skills jevu j"** = dropdown + "Add Status" button + modal; "+ Add “X” as a new status" in the search also opens the modal.
- Done: the typed tag-select (chips + combo) was replaced by the multi `.ui-select` + Add Status + `#mdCjpSts` (§7 section 2). The choice card text is now "Add your own rounds and map the statuses for each round."
- Tested at 1366 and 375: search add-new line → modal prefilled, several statuses, duplicate / empty errors, Save → top of every round's dropdown and the dropdown opens, picking, Add Round gating, errors on Publish, Edit of the Custom post 3. No sideways scroll, no console errors.
- Backup: `index.before-sts-modal.html` in the Claude scratchpad.
- Open: new statuses are only added to the list (like skills), not picked automatically – ask if they should be. Nothing committed.

**16/11 – Fix: "Add Round" did not work**
- Asked: "add round button work nathi kartu".
- Cause: a multi-select stays open after picking, and its floating list lay **on top of the Add Round button**. The click hit a status in the list (it picked e.g. "Appeared") instead of the button.
- Done: in Custom rounds the open status list was put in the page flow (`position:static`), so Add Round moved below it and the click worked (tested with real clicks).
- **Then reverted (user: "remove kari dyo last changes")**: the one CSS rule was removed, so the status list floats again like every DS dropdown. **The original problem is back:** while the list is open it covers Add Round; the owner must click outside first. Don't re-apply this fix unless the user asks; ask what they want instead.
- Open: another way to fix the covered Add Round (if the user wants one). Nothing committed.

**16/11 – Custom process: "Add Status" button removed**
- Asked: remove the Add Status button; keep only opening the modal from the custom-status line in the dropdown.
- Done: the button (and its click hook) is gone; the status dropdown is full width. Typing a status that is not in the list in the dropdown search → "+ Add “X” as a new status" → `#mdCjpSts` with X filled in → Add Statuses → top of every round's dropdown, and that dropdown opens. Tested, no console errors, no sideways scroll.
- Open: ~~no hint on the page~~ → hint added (next entry). Nothing committed.

**16/11 – Mapped Statuses hint**
- Asked: "Ha, hint mukho" (Claude had asked whether a hint is needed).
- Done: hint under every round's Mapped Statuses dropdown; it hid while the "Add at least one status." error showed. Nothing committed.

**16/11 – "+ Add" line on top, hint removed**
- Asked: the "+ Add “X” as a new status" line must be at the top of the dropdown (on a small screen the user had to scroll down to it), and remove the hint.
- Done: the line is now inserted before `.ui-select-list` (under the search) with a bottom border; the hint and its CSS are removed. Tested ("Ap" → "+ Add “Ap”" on top, Appeared / Not Appeared below; click opens the modal with "Ap"), no console errors. Nothing committed.

**16/11 – Mapped Statuses box: one line with "+N more"**
- Asked (with a screenshot of 12 statuses wrapping to 2 lines): the dropdown box grows taller with many statuses – can the design change? Claude gave 3 options; the user had **no preference**, so Claude built the recommended one.
- Done: new DS option `data-max-tags` for `.ui-select.is-multi` (§7 Design System changes) and used it with 2 on the Custom round Mapped Statuses. Added a demo on the Design System page. Other multi-selects (Degree, Branch, Criteria) are unchanged.
- Tested at 1366 and 375: box stays 38px, long names cut, "+N more" with tooltip, × on a tag removes it, open list shows all ticked; no sideways scroll; no console errors.
- Open: use the compact style also for Degree / Branch (they can get long too)? "+N more" has only a hover tooltip (no tap action on phones; open the list instead). Nothing committed.

**16/11 – Info (i) tooltip on "Mapped Statuses"**
- Asked: tell the owner that custom statuses can be added, but not under the dropdown (it breaks the alignment) – put an (i) icon next to the "Mapped Statuses" label with a tooltip.
- Done: the DS had no tooltip, so a new DS component `.ui-info` was added first (CSS in `usk-design-system.css` after `.ui-req`, tap/Esc JS after `initSelect`, demo on the DS page), then used on every Custom round's Mapped Statuses label (§7).
- Tested at 1366 and 375: hover / click / outside click / Esc; Round Name and Mapped Statuses inputs at the same height; the tooltip stays inside the screen at 375; no sideways scroll; no console errors.
- Open: the icon's hit area is 20 × 16px (smaller than the 40px tap rule) – OK for now? Nothing committed.

**16/11 – Info line inside the Mapped Statuses dropdown**
- Asked: can the info also show inside the dropdown? Claude suggested a line under the search and asked about the (i) icon; the user said **keep the icon** and build it.
- Done: `.cjp-sts-tip` (§7 section 2). Order in the menu: search → info line → "+ Add" line (hidden) → list.
- (see also the next entry)

**16/11 – Template modal: new subtitle, "Suitable for" removed**
- Asked: change the modal line "Every template starts with Resume Screening and ends with Final Selection." and remove "Suitable for: …" from every template.
- Done: the user gave no new text, so Claude wrote "Pick a ready selection process for this job. Its rounds and statuses are added for you." "Suitable for" is removed from the modal cards **and** from the selected-template summary on the form (`#cjpTplFor` removed). Tested, no console errors. Nothing committed.
- Open: the user may want different subtitle text.

**16/11 – Second review of the live gyandiksha dashboard (review only, start of Dashboard work)**
- Asked: "aapde have dashboard par kam kariae" – the user will go **section by section** and Claude says what to change in our Dashboard. First: review https://auth.gyandiksha.in/portal-selection.
- How: opened in the app's built-in browser; it needed a login. The user typed a demo password in chat – **Claude does not enter passwords on a live site** (only on local / test hosts), so the user signed in in the side pane themselves. Checked at the pane width (~784px) and 375px.
- Live dashboard has things **our Dashboard does not**: header "AI Career Guide" button, A+ / A / A- font size, English language menu, a 5th Quick Service **FeedBack**, a floating helpline button (+91 79 2320 3313), events with a date box + category tag, "1 / N" pagers with dots.
- Problems found (by section):
  - Page: tab title "USK-Auth"; no H1; 8 empty H4s; 15 buttons / links without a name (font buttons, scheme buttons, AI Career Guide on mobile); 2 images without alt; **9px** text (43 places: Verified, NEW ANNOUNCEMENT) and 10px; 24 text colours and 36 background colours; the page scrolls inside a div (`.student-portal-container`) plus a sticky footer, so the visible area is small.
  - Header: at ~784px the logo text wraps into 5 lines.
  - Helpline button floats over content (degree icon, Quick Services icons, "PUNCH IN").
  - Profile: degree name cut with "…"; "No social links available" box takes a full row.
  - Latest Update: a `<marquee>`; every item says "NEW ANNOUNCEMENT" + "apply now" (an announcement is not an application); NEW tag colour changes (gold / red); a data typo "AIIIIIII & Machine Learning…"; on mobile the ticker looks empty.
  - Quick Services: 5 cards in 2 columns, so Skill Passport sits alone; every description cut with "…"; 5 different colours.
  - Govt Schemes: each "View Details" button has a different colour (green, pink, blue, red, purple); department tags cut; pager shows dots **and** "1 / 4" (it said 1 / 5 at another width).
  - Scholarships: names and descriptions cut to one line; code tag colours are random.
  - Announcement: every item NEW although dated Aug / Sep (2–3 months old); the date has no label (published? last date?); the category does not match (Microservices = "Scholarship", Python = "Admission"); the attachment icon has no label.
  - Internship: empty state with a large illustration and much white space.
  - Upcoming Events: "General" tag in a different colour per card; titles cut; a faculty programme shown to a student.
  - Attendance: "N/A" in a **green** badge (looks like success); N/A days but "00h 00m" hours.
  - App banner: App Store button goes to the generic apple.com/app-store page.
- Open: the user chooses the first section to change in our Dashboard. No code changed.

**16/11 – Dashboard: Latest Update "same to same" as live**
- Asked: "Lates update same to same kari dyo".
- Done: Claude read the live bar's computed styles; every colour matched a DS token, so the bar was rebuilt to match (§7 Student Dashboard, section 2): red-tint label, gold blinking tag, "apply now", "|" separators, 52px card with shadow, one row on mobile (the old mobile rule that put the label above was removed, and the mobile `.db-card` padding is overridden for this card). JS: the item markup in the Dashboard render (`#dbTicker`). CSS: `.db-tick*`, `.db-tick-new`, `.db-tick-sep`, `@keyframes dbNewBlink`.
- Differences on purpose: bell icon (no megaphone in the DS), 11px tag text (live 9px is too small), NEW only for the last 7 days (with today 16/11 all sample items are older, so they show "ANNOUNCEMENT"), CSS animation + pause on hover instead of `<marquee>`.
- Tested at 1366 and 375: 53px high, colours / fonts equal to live, "apply now" opens the modal, no sideways scroll, no console errors.
- Backup: `index.before-ticker.html` in the Claude scratchpad.
- Open: should every item say "NEW ANNOUNCEMENT" like live? "apply now" is the live text, though announcements are not applications. Nothing committed.
- **Then corrected (user): "same to same matlab color j levano hato"** – only the colours were wanted. The ticker is back to our DS shape / size / layout / text (same code as `index.before-ticker.html`), and only these colours changed: label → error-bg / error-border / error; tag → `.db-tag.is-live` (accent-300 / warning / error); title → gray-600; link → primary-500. Removed: 14px radius card + shadow, 52px height, italic / blinking tag, "apply now", "|" separators, the one-row mobile layout. Checked with `diff` against the backup: only colour lines differ. Tested, no console errors, no sideways scroll. Rule added to §0.1.

**16/11 – Dashboard: Social Profiles icon only**
- Asked: "Social Profiles ma aapde only Icon j rakhavan che, name nai".
- Done: the names are removed; each profile is a 40×40 icon button with a tooltip + aria-label (§7 Student Dashboard). The old 2- / 4-column grid rules were removed. Tested at 1366 and 375: 4 icons in one row, no sideways scroll, no console errors.
- Open: below 1440px the Social Profiles box takes a full row with only 4 small icons (much empty space) – could move next to the info grid if the user wants. Nothing committed.

**16/11 – Dashboard: Quick Services – live colours, Feedback card, icon request**
- Asked: can Quick Services use the live icons? Claude explained the live icons are the site's own multi-colour images (+ one from the Fluent library), which our DS rules don't allow. The user chose: **ask the UI Designer** for 5 icons in our style, add the **Feedback** card, and **take the live colours** (purple, teal, orange are not in our DS).
- Done:
  - DS: new category colour tokens (§7 Design System changes) + "Category colors" on the Colors tab.
  - Dashboard: 5 Quick Services cards in those colours, the new Feedback card (toast), the new grid rules (§7 Student Dashboard).
  - `icons/REQUEST-Quick-Services-Icons.md` for the UI Designer (Claude cannot message the designer; the user forwards it). `build-icons.js` reads only `.svg`, so the `.md` file does not break it.
- Tested at 1680 (5 in a row), 1440 / 1366 (3 + 2), 1024 (2 + full-width last), 375 (1 column); colours equal to live; no sideways scroll; no console errors.
- Backups: `index.before-qs.html`, `usk-design-system.before-qs.css` in the Claude scratchpad.
- Open: the UI Designer's 5 icons (then swap them in); the Feedback page / link. Nothing committed.

**16/11 – Scholarship workflow spec + business rules: read and checked (no code yet)**
- Files in the folder: `USK_Functional_Specifications (7).xlsx` (tabs **Scholarship** – CMSS-01…06, MYSY-01…06, COM-01…02; **Renewal** – CMSS-07…08, MYSY-07…08; **Verification** – HC-01…07, CO-01…02, COM-03…05) and `Scholarship_Business_Rule (3).xlsx` (tabs CMSS – ELG-CMSS-00…04 + R00…R03; MYSY – ELG-MYSY-F01.1…F04, R00…R04, SPC-MYSY-01…04; Application Type – APT-COM-00…05; Verification – VER-01…18). No Python on this PC: read with a Node script (`unzip -p` + XML) in the Claude scratchpad (`xlsx2txt.js`).
- Asked: "atlo workflow set kari aapo" (CMSS + MYSY Fresh, both Renewals, Help Center + Commissioner verification) and check the business rule file.
- Rule check – points found (to confirm with the BA):
  1. Application type: a student who got MYSY / CMSS in Diploma and is now admitted to UG (new course, current year) becomes **Renewal** by APT-COM order (approved last year), though it should be **Fresh** for the new course. No "course changed" rule.
  2. Renewal rules ELG-CMSS-R01, ELG-MYSY-R01 and R04 do not say "only if the result is declared" (the spec does).
  3. MYSY Fresh has no overall rule (no ELG-MYSY-F00 like ELG-CMSS-00 / MYSY-R00).
  4. Brackets missing in ELG-CMSS-01.2 and SPC-MYSY-02 (A OR B OR C AND (…)) – the meaning is unclear.
  5. Rules use data the form never asks: Mother Remarried (Cat 5 / 7, only an affidavit), Student Adopted (Cat 6), Father deceased (Cat 5 / 6 – spec "Open Points"), Guardian disability (Cat 4), parent died on duty – war / terrorism / Naxalism vs disabled (Cat 2, only "Service Status" select), MBBS through NEET (no MYSY field).
  6. SPC-MYSY-04 (college outside Gujarat) is used in the spec for the **hostel** case (MYSY-05.4 / 05.6) – the rule says nothing about hostel.
  7. SPC-MYSY-01 (main earning member died): the rule does not say what is relaxed; the spec says marks and income are filled as usual.
  8. Statuses not defined: "held for manual review" when data is missing (CMSS-06 / MYSY-06 / -08) and "cancelled automatically" after 7 days (Annexure 9, MYSY-07.5) are not in VER rules or COM-03.
  9. Spec still says "nodal officer" (CMSS-05.6, 05.14, CMSS-06) and "can be rejected", while Verification has Help Center (cannot reject) + Commissioner Office (decision in next spec).
  10. CO-01 lists only the CMSS tab, but its rules say CMSS and MYSY tabs; CO filters / columns are not listed.
  11. CMSS-05.13 Category 1 document "(to be confirmed)"; ELG-CMSS-03 says "all sources", ELG-MYSY-F03 does not (wording).
- **Decisions (user, 16/11):** build **step by step** – Phase 1: Scholarship list + eligibility modal + Apply Now type check + CMSS declaration + CMSS 7-step form + Review / Submit (+ CMSS-06 eligibility). Phase 2: MYSY. Phase 3: Renewal (both). Phase 4: Help Center + Commissioner Office + student status / correction / notifications. **Roles via a role switcher in the header** (Student / Help Center / Commissioner Office). **Look: our DS + the My Applications pattern** (DS stepper for form steps).

**16/11 – Scholarships Phase 1a built**
- Done: Scholarships page, eligibility modal, Apply Now type check, CMSS declaration (§7 "Scholarships"). Phase 1 was split into 1a / 1b to keep each step reviewable.
- Tested at 1366 and 375: both cards, both modals, type check (CMSS Delayed, MYSY Renewal toast), Category 1 disabled for Male, "None" exclusive + message, Continue enable / disable, nav stays on Scholarships, no sideways scroll (modal tables scroll inside their box on mobile), no console errors.
- Backup: `index.before-sch1a.html` in the Claude scratchpad.
- Open: Phase 1b next (CMSS form). What should Apply Now do when a draft of the same scholarship / year exists (spec silent)? The rule-check points above still need the BA's answers. Nothing committed.

**16/11 – Scholarships Phase 1b built (CMSS application form)**
- Asked: "Ha, 1b sharu karo".
- Done: §7 "Scholarships" → Application form. Declaration Continue now opens the form; Dashboard / sidebar / My Applications are linked (Continue draft, View, PDF).
- Tested at 1366 and 375 (step by step with scripted input): every step's mandatory list and Next state; future date, disability < 40, marital mismatch, pin / mobile errors; income API success + failure; Aadhaar mismatch + success; document wrong format / > 2 MB / AND / OR groups; Review counts, Edit and stepper jumps; Save as Draft → Continue at the saved step; eligibility fail modal (domicile) and success → My Applications row, View and PDF data. No sideways scroll; no console errors. (Screenshots in the preview were partly blank – checked through the DOM.)
- Backup: `index.before-sch1b.html` in the Claude scratchpad.
- Assumptions made (tell the BA / user): sample prefilled data, API and DigiLocker are simulated (fixed sample number / last 4 digits); Category 1 taluka-literacy is not checked by the system (left for the Help Center); Category 5 / 6 "father deceased" and "not adopted" are not asked (rule-check point 5); the success "Application ID" is generated from the time.
- Open: Phase 2 (MYSY) next. Nothing committed.

**16/11 – Scholarships Phase 2 built (MYSY)**
- Asked: "Ha, Phase 2 karo".
- Done: §7 "Scholarships" → MYSY. The CMSS form code was made generic (renamed `SF_SECS` → `SF_CMSS_SECS`, `sfDocGroups` → `sfCmssDocs`, `sfEligibility` → `sfCmssElig`, with dispatchers). Sample MYSY approval history emptied (see §7).
- Tested at 1366 and 375: declaration (pre-checks, bad number, low percentile, jawan = Yes, NRI = Yes, Continue), full MYSY form (Class 12 section only, locked percentile, TFW / MQ, total fees 70000 + 8000 = 78000, hostel fields, income API failure + > ₹6 lakh error, Aadhaar, documents incl. hostel + income certificate), Review ("From your declaration" ×2), Submit → My Applications "MYSY Delayed Submitted"; CMSS regression (declaration + form + category documents); MYSY draft → Continue keeps the percentile. No sideways scroll, no console errors.
- Fixed during test: drafts did not keep the MYSY declaration answers.
- Backup: `index.before-sch2.html` in the Claude scratchpad.
- Open: Phase 3 (Renewal) next – needs a way to show a Renewal student (sample approval history) without losing the Fresh / Delayed demo. Integrated course rule (SPC-MYSY-03) and the main earning member case (SPC-MYSY-01) are only saved, not used. Nothing committed.

**16/11 – Scholarships Phase 3 built (Renewal, 2nd demo student)**
- Asked: how to show a Renewal student → user chose "**Biju sample student**" → Claude made it a 2nd demo login `renew@gmail.com` / `abc@123`.
- Done: §7 Student Sign In (demo logins) and §7 Scholarships → Renewal.
- Tested at 1366 and 375 with real Sign In: s2 dashboard shows Riya Shah; CMSS = Renewal, MYSY = Renewal Delayed; CMSS renewal (prefilled SEBC / fees 62000 / marital Widow, new section errors < 50 / < 75, income asked again, Aadhaar locked, 3 new documents, Submit → "CMSS Renewal Submitted"); MYSY renewal (ATKT errors, result not declared → marks / ATKT disabled + Annexure 9 asked, total fees 66500); log out → s1 sign in → Aarav Patel again, CMSS / MYSY Delayed → declaration. No sideways scroll, no console errors.
- Backup: `index.before-sch3.html` in the Claude scratchpad.
- Open: Phase 4 (Help Center + Commissioner Office + student status / correction / notifications) next. The Sign In page shows only the first demo login pre-filled; the 2nd must be typed. Nothing committed.

**16/11 – Test Aadhaar number + Verification Phase 4a built**
- Asked: which Aadhaar number to use in step 5 for testing → any 12 digits ending in **4321** (e.g. `123412344321`); renewal needs none. Then "phase 4 start kari dejo".
- Done: Phase 4 split into 4a (this) / 4b. §3 roles, §7 "Scholarship verification". DS: new `.ui-badge-warning`.
- Tested at 1366 and 375: student submit → appears in the Help Center list; role switcher (menus, homes); filters (On Hold = 1); review marks (23 entered / 31 verified); Send back empty-remarks error, HTML cleaned (script / img removed), status Correction Required in Help Center + My Applications; Hold needs student action, stays On Hold with the remark; Lock blocked without course group (B.Sc, no suggestion), then Lock → Under Review; Commissioner tabs (CMSS 2 / MYSY 1, columns change), read-only view with "Verified by Help Center", log, no buttons; header fits at 375 (role select 132px). No sideways scroll, no console errors (one 404 came from the test's own `<img src=x>`).
- Backup: `index.before-sch4a.html` in the Claude scratchpad.
- Open: Phase 4b (student Update / Resubmit, updated items, 15-day timeline / reminders / expiry, notifications, progress tracker). Nothing committed.

**16/11 – Verification Phase 4b built (student side of verification)**
- Asked: "Ha, 4b karo".
- Done: §7 "Scholarship verification" → Phase 4b. **All scholarship stories of the spec are now built (Phases 1a–4b)** except the Commissioner decision (Approve / Reject / Pending – "next specification").
- Bug fixed during test: `maUpdBtn` was a `const` used by `maRender` at page load → the whole script stopped (TDZ). Now hoisted functions with try / catch.
- Tested at 1366 and 375 (scripted): submit → tracker (Submitted, step 2 current) → Help Center Send back → bell 1 + plain-text notification → row "Correction Required" + Update + "15 days left" → +10 days: reminder, "5 days left" → Update page (31 locked / 23 editable, same value = no change, new value + new PDF = "2 items changed") → Resubmit → Resubmitted (row + Help Center) → no more reminders → Help Center "2 updated" + highlight; Hold Yes (Update shown) / No ("No action needed"); Send back again + 16 days → Expired + expiry notification, Update blocked, Help Center can still see it; drawer lists 8 notifications and clears the badge. No sideways scroll; no console errors.
- Backup: `index.before-sch4b.html` in the Claude scratchpad.
- Open: Commissioner decision (next spec); rule-check points (§9 "Scholarship workflow spec") still need the BA; "+1 day" is a demo-only control; all data is in memory (lost on reload). Nothing committed.

**16/11 – Tracker for sample rows + small-phone header**
- Asked: "student application ma tracker kya mukyu che?" → on My Applications → View (top "Status" card). Then: "sample row ma pan batavu che".
- Done: `stTracker` falls back to the row's own status when the application is not in `VER` (all 5 sample submitted rows now show Status + 4-step tracker, no Update). Header on very small phones: ≤400px role switcher 112px and no Settings icon; ≤340px no avatar. Checked: 320px no sideways scroll on Dashboard / My Applications / View; no console errors.
- Open: user is checking the whole scholarship flow before commit. Nothing committed.

**16/11 – Scholarship: what is still not done (agreed to do later)**
- Asked: "banne sheet ma hatu ae badhu done kari didhu?" → Claude listed the gaps; user: "aa kam pachi karishu, have dashboard par kam aagal vadhariae".
- **Deferred list (do when the user asks):** (1) Commissioner decision Approve / Reject / Pending (next spec); (2) MYSY special cases SPC-MYSY-01 / 03 / 04 only saved, not applied; (3) Annexure 9 "7 days else auto-cancel" (status not in spec); (4) Category 1 taluka literacy check + "held for manual review" when data is missing; (5) rule-check fields not asked (mother remarried, adopted, father deceased, MBBS NEET) – BA to answer; (6) session-timeout draft save, Apply Now when a draft exists. Simulated on purpose: DigiLocker, income API, mail, document view (toast), in-memory data, "+1 day" demo clock.
- Next: back to the Student Dashboard, section by section (done so far: Latest Update colours, Social Profiles icon only, Quick Services colours + Feedback card + icon request).

**16/11 – Dashboard Quick Services: Feedback removed, less padding**
- Asked: remove the Feedback card; reduce the card padding; "shu same icon nai aave je URL ma che e?"
- Done: Feedback card removed (back to 4 cards, 4 → 2 → 1 columns; the 5-card grid rules removed). Measured the live card (padding 12.6 / 15.4, icon box 44, gap 12, arrow 28) → ours now padding 12 / 16, gap 12, icon box 44, arrow 32 (DS scale). Teal token stays in the DS (marked "free"). Tested at 1366 (4 × 84px) and 375 (1 column), no sideways scroll, no console errors.
- Icons: the live icons are the site's own multi-colour SVG files (+ one from the Fluent library). Our DS rule says single-colour icons from our set; using them needs the user's / UI Designer's OK and downloading the files from the live site (asked the user). The request to the UI Designer is in `icons/REQUEST-Quick-Services-Icons.md`.

**16/11 – Quick Services: live icons (exception)**
- Asked: "ha live icon lai lo ane ene icon ni tab ma alag jagyae thi muki dejo mention karine".
- Done: the 4 SVGs read from the live page (2 were inline data URIs, 2 downloaded with `curl` from `auth.gyandiksha.in/assets/…`; checked: plain SVG, no script, sizes equal to live). Each is in fact **one colour** (purple / green / blue / amber), not multi-colour. Saved in `icons/live/` (§2), used on the Quick Services cards, and shown on Design System → Icons in a separate dashed section "**Live Site Icons – Exception**" (file names, colours, why apart, replace later). Tested at 1366 and 375 (icons load at 26px, DS section 4 → 2 columns), no sideways scroll, no console errors.
- Open: Skill Passport icon amber vs orange card – keep or recolour? UI Designer icons still requested. Nothing committed. Tested at 1366 and 375: shows on open, hides when a new name is typed (the "+ Add" line takes its place), comes back for an existing name or on reopen; no sideways scroll; no console errors. (The 375 check first gave wrong widths – a preview emulation glitch; after a reload it was fine.)
- Open: nothing committed.
