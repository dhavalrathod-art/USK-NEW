# USK Portal – Project Context for Claude

> **Read this first.** The user logs in to Claude with different accounts, so chat history is often lost.
> This file is the full context: what the project is, the design system, the rules, and the work done so far.
> **Before starting any task:** read this file, then open `index.html` and `css/usk-design-system.css`, review them, and only then ask the user for their requirement.

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
| `build-icons.js` → `icons.js` | `node build-icons.js` turns the SVGs into `icons.js` (`window.USK_ICONS`). Never edit `icons.js` by hand. |
| `README.md` | Gujarati guide for the team (how to open, design system tabs, icon rules). |
| `Design-System-Guide.md` | Original planning document (list of components wanted). |
| `LOGO-USK.png`, `LOGO-USK-sm.png`, `img/` | Logos and the Skill Passport banner photo. `img/USK-SKILL-PASSPORT.jpg` (5.8 MB) is unused; the page uses `-web.jpg`. |

Open `index.html` directly in Chrome/Edge, or run any static server in this folder (`.claude/launch.json` + `.claude/serve.js` start one on port 5173 for Claude Code's browser preview).

## 3. How `index.html` works

- Layout: `.app` → `aside.sidebar` (fixed, 260px; collapses to 80px on desktop; overlay below 992px) + `.main` → `header.header` (64px, sticky) + one `<main class="content" id="view-NAME">` per page.
- **Routing:** sidebar links are `<a href="#NAME" data-view="NAME" data-tip="Label">`. `showView(name)` (bottom of the main `<script>`) shows `#view-NAME` and hides the others. The header title is set in `showView`.
- Views now: `applications` (Student Application, default), `jobs` (Job Opportunities), `design-system`, `responsive`. Skill Passport is a normal link to `skill-passport.html`.
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
| Table | plain `<table>` in `.table-wrap`; `.ui-cb` checkbox; `.ui-bulk` bar; `.ui-badge-{approved,shortlisted,review,rejected,neutral}`; actions `.ui-acts` > `.ui-act .ui-act-{view,edit,delete,resume,more}`; 3-dots menu `.ui-menu`. Table types 1–4 are on the Table tab |
| Modal | `.ui-modal-backdrop` > `.ui-modal` (`-sm` 440 / default 600 / `-lg` 840) > `.ui-modal-head` (`.ui-modal-icon` gold box + `.ui-modal-title` h4+p + `.ui-modal-close`), `.ui-modal-body`, `.ui-modal-foot` (Cancel outline left, one Primary right). Below 560px it becomes a bottom sheet |
| Drawer | `.ui-drawer` (`-sm` / `-lg`) from the right, same header as the modal |
| Accordion | `.ui-acc` > `.ui-acc-item` (`is-open`) > `.ui-acc-head` + `.ui-acc-panel` |
| Stepper | `.ui-steps` > `.ui-step` (`is-done`, `is-current`, `is-failed`) |
| Icon box | `.ui-icon-box` + `is-primary` / `is-accent` / `is-success` / `is-warning` / `is-error` / `is-info` |

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

### Skill Passport (`skill-passport.html`)
- Hero banner, student details (masked email / APAAR / mobile with show/hide), summary tiles, tabs (Skills & Certificates, Experience, Academic Work, Education), Job Oriented Skills modal (search + chips, max 15), Your Journey timeline + Full Journey drawer, education accordion, 3-dots row menu. Page-level classes use the `sp-` prefix.

### Design System changes made during this work
- Added `.ui-badge-neutral` (no dot) for non-status labels.
- `.ui-select` now dispatches a bubbling `ui-select-change` event.
- The `.ui-select` search box focuses with `preventScroll`, so opening a dropdown never scrolls the modal.

## 8. Known gaps / next ideas
- No focus trap in modals and drawers. Esc can close the modal and the mobile sidebar at the same time.
- The legacy Student Application view, sidebar and header should move to `.ui-*` components and `--color-*` tokens.
- Missing Design System components (see §4). The neutral and warning badges are not shown on the Design System Table tab yet.
- Job "View" only shows a toast; there is no job details page yet. Company logos are initials (no images).
- All data is sample data; a backend/API is not connected.
