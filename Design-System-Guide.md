# USK Portal – Design System Guide

> **Step 1: Review document.** આમાં ફક્ત component ના નામ અને માર્ગદર્શન છે. **Color code, font size, spacing ની values પછીથી નક્કી કરીશું.**

---

## 0. કામ કરવાની રીત (Workflow)

1. **HTML માં design system બનાવવી:** દરેક component નો live નમૂનો, બધા states (hover, focus, disabled, error) સાથે.
2. **Review અને approve કરવું:** તમે અને team જોઈને નક્કી કરો.
3. **Figma માં એ જ નામથી બનાવવું:** HTML અને Figma માં token / component નાં નામ એક સરખાં રાખવાં, જેથી designer અને developer એક જ ભાષા બોલે.
4. **નવું page બને ત્યારે ફક્ત design system ના components વાપરવા.** નવો color કે નવી button style સીધી page માં ન ઉમેરવી. પહેલાં design system માં ઉમેરવી.

---

## 1. Foundations (પાયો – Design Tokens)

આ નાની-નાની values છે જેના પરથી બધા components બને છે. **સૌથી પહેલાં આ નક્કી કરવું.**

### 1.1 Colors

**Brand colors**
- Primary (main blue)
- Secondary (gold / accent)
- Primary hover / pressed
- Secondary hover / pressed
- Primary light (light background tint)

**Text colors**
- Heading text
- Body text
- Secondary / muted text
- Placeholder text
- Disabled text
- Link text, Link hover
- Text on dark background (white)
- Text on primary button

**Background colors**
- Page background
- Surface / Card background
- Sidebar background
- Sidebar active menu background
- Header background
- Table header background
- Row hover background
- Row selected background
- Input background
- Disabled background
- Overlay / Backdrop (modal પાછળનો કાળો પડદો)

**Border & Divider colors**
- Default border (card, input)
- Strong border
- Divider line
- Focus border / Focus ring
- Error border
- Table row divider

**Status (Semantic) colors:** દરેક status માટે ત્રણ color જોઈએ: **text**, **light background**, **border**.
- Success (Approved, Shortlisted)
- Warning (Pending, Applied)
- Error / Danger (Rejected, Delete)
- Info (Under Review)
- Neutral (Draft, Closed)

**Icon colors**
- Default icon
- Muted icon
- Primary icon
- Icon on dark (sidebar)
- Icon background, light, દરેક status માટે (જેમ કે stat card ના icon box)
- Action icons (view, edit, delete, download)

### 1.2 Typography
- Font family (એક જ font. હાલ **Inter** છે. ગુજરાતી લખાણ જોઈએ તો **Noto Sans Gujarati** fallback)
- Headings: H1, H2, H3, H4, H5, H6
- Body Large, Body, Body Small
- Label (form label)
- Caption / Helper text
- Overline (નાના uppercase section labels)
- Button text
- Table header text, Table cell text
- Font weights: Regular, Medium, SemiBold, Bold
- Line height

### 1.3 Spacing
- Spacing scale (જેમ કે 4, 8, 12, 16, 20, 24, 32, 40). **બધી જગ્યાએ ફક્ત આ જ values વાપરવી.**
- Page padding
- Card padding
- Form field વચ્ચેની જગ્યા (gap)
- Section વચ્ચેની જગ્યા

### 1.4 Border Radius
- Small (chip, checkbox)
- Medium (button, input)
- Large (card, modal)
- Full / Pill (status badge, avatar)

### 1.5 Shadow / Elevation
- Level 0: no shadow
- Level 1: card
- Level 2: dropdown, popover
- Level 3: modal, drawer
- Focus shadow (focus ring)

### 1.6 Layout & Grid
- Breakpoints: Mobile, Tablet, Laptop, Desktop
- Grid columns: form માં 4 / 2 / 1 column
- Sidebar width: expanded અને collapsed
- Header height
- Max content width

### 1.7 Others
- Z-index layers: header, sidebar, dropdown, drawer, modal, toast
- Motion: animation speed (fast, normal, slow) અને easing
- Opacity: disabled, overlay

---

## 2. Iconography (Icons)

**તમારો પ્રશ્ન:** "Icon બધે સરખા હોવા જોઈએ કે જ્યાં જરૂર પડે તેવા icon વાપરવા?"

**જવાબ: icon તો જ્યાં જરૂર હોય ત્યાં વાપરવા, પણ બધા icon એક જ icon set (family) માંથી લેવા.** આ નિયમો પાળવા:

- **એક જ library:** જેમ કે Material Symbols, Lucide, Phosphor કે Remix Icon. અલગ-અલગ જગ્યાએથી icon ભેગા ન કરવા.
- **એક જ style:** બધા Outline અથવા બધા Filled. સાથે ભેળવવા નહીં. ખાસ કિસ્સો: active menu માં filled icon વાપરી શકાય.
- **એક જ stroke width.**
- **Fixed sizes:** Small (14–16), Medium (18–20), Large (24). બીજી કોઈ size નહીં.
- **એક કામ માટે એક જ icon:** "View" માટે આંખ, "Edit" માટે pencil, "Delete" માટે trash. આખા portal માં આ બદલવું નહીં.
- **Icon-only button પર tooltip ફરજિયાત.**
- **Icon list (Icon Inventory):** design system માં portal ના બધા icons નું એક પાનું બનાવવું, નામ સાથે.

**Icon container (icon bg) ના પ્રકાર**
- Plain icon (background વગર)
- Icon in soft square box (stat card)
- Icon in circle (avatar જેવું)
- Icon button (hover પર જ background દેખાય)

---

## 3. Components List

### 3.1 Buttons & Actions
- **Button variants:** Primary, Secondary (Gold), Outline, Ghost / Text, Danger, Success, Link button
- **Button sizes:** Small, Medium, Large
- **Button states:** Default, Hover, Pressed / Active, Focus, Disabled, Loading (spinner સાથે)
- Button with left icon / right icon
- Icon-only button (square / round)
- Button group
- Split button / Dropdown button (જેમ કે Export → Excel / PDF)
- Back button
- Add button (+ Add Application)

### 3.2 Form Components
- **Form Label:** required (*) અને optional સાથે
- Text Input
- Password Input (show / hide eye icon સાથે)
- Number Input
- Email / Mobile Input (prefix સાથે, જેમ કે +91)
- Textarea (character counter સાથે)
- Select / Dropdown
- Searchable Select (Combobox)
- Multi-select (chips સાથે)
- Dependent Dropdown (State → District → Taluka)
- Checkbox (checked, unchecked, indeterminate)
- Radio button
- Toggle / Switch
- Date Picker
- Date Range Picker
- Time Picker
- File Upload: button style અને drag & drop area, uploaded file list, progress, remove
- OTP Input
- Search Input
- Input with prefix / suffix icon
- **Helper text**
- **Error message**
- **Success message**

**દરેક input field ના states (બધા fields માટે ફરજિયાત)**
- Default (ખાલી)
- Hover
- Focus
- Filled (value ભરેલી)
- Disabled
- Read-only
- Error
- Success / Valid

**Input field ના ભાગ (Anatomy):** દરેક ભાગનો color પછી નક્કી કરવો.
- Label text
- Required star (*)
- Placeholder text
- Value text
- Field background
- Field border
- Focus border + focus ring
- Prefix / Suffix icon
- Helper / Error text

**Form layout**
- Form section title
- Form grid (4 / 3 / 2 / 1 column)
- Form footer (Save, Cancel, Reset buttons નો ક્રમ અને જગ્યા)
- Multi-step form (Stepper / Wizard). Scholarship application માટે ઉપયોગી.

### 3.3 Navigation
- Sidebar: logo area, menu item, active, hover, sub-menu, collapsed mode, footer (Logout)
- Header / Top bar: title, academic year, notification, settings, profile
- Profile dropdown menu
- Notification dropdown / panel (count badge સાથે)
- Breadcrumb
- Tabs (underline style અને pill style)
- Pagination
- Stepper (step 1 → 2 → 3)
- Page Header (title + subtitle + action buttons)

### 3.4 Data Display
- **Table**
  - Table header
  - Row: default, hover, selected
  - Striped rows (optional)
  - Sticky header / Sticky action column
  - Sort icon
  - Column filter popover (search, checkbox list)
  - Row actions (view, edit, delete, download)
  - Bulk select + bulk action bar
  - Empty state
  - Loading state (skeleton)
  - Table toolbar (rows per page, export)
  - Table footer (showing entries + pagination)
- Card: basic, with header, with footer
- Stat / KPI Card
- Status Badge / Pill (Applied, Under Review, Shortlisted, Rejected, વગેરે)
- Count Badge (notification ના 10 જેવું)
- Chip / Tag: removable, filter chip
- Avatar: image, initials, size
- Description List / Key-Value view (Application details)
- List / List item
- Timeline (application status history)
- Tooltip
- **Divider:** horizontal, vertical, dashed, text સાથે
- Accordion
- Collapse / Expand panel (જેમ કે Advanced Filter)

### 3.5 Overlays (Modal, Drawer, Popover)

**Modal / Dialog**
- **Modal Header:** title, subtitle (optional), close (×) icon, header background, header bottom border
- **Modal Body:** padding, scroll (લાંબી content હોય ત્યારે)
- **Modal Footer:** background, top border, buttons ની alignment (જમણી બાજુ), Primary / Cancel નો ક્રમ
- **Backdrop / Overlay:** color + opacity
- **Modal sizes:** Small (confirm), Medium (form), Large, Full screen
- **Modal types:**
  - Form modal (Add / Edit)
  - Confirmation modal (Are you sure?)
  - Delete / Danger modal (red)
  - Success modal
  - Info / Warning modal
- Open અને close animation

**Drawer / Side Panel:** View details, filters. Header, body, footer એ જ modal જેવા.

**Popover:** column filter.

**Dropdown Menu:** item, hover, divider, danger item.

### 3.6 Feedback & Status
- Alert / Banner: Success, Warning, Error, Info, dismissible
- Toast / Snackbar: Success, Error, Info
- Loader / Spinner
- Skeleton loader
- Progress bar (linear), Progress circle
- Empty State: no data, no search result
- Error Pages: 404 Not Found, 500 Server Error, 403 No Access, Session Expired
- Inline validation message

### 3.7 Page Templates (આખાં પાનાંના layout)
- Login page
- Dashboard
- List page (filter + table): **Student Applications**
- Detail / View page
- Form page (Add / Edit)
- Multi-step form page
- Settings / Profile page

---

## 4. Government Portal માટે ખાસ ધ્યાન

- **GIGW guidelines** (Guidelines for Indian Government Websites) અને **WCAG 2.1 AA** accessibility નું પાલન.
- Text અને background વચ્ચે પૂરતો contrast (ઓછામાં ઓછો 4.5:1).
- Keyboard થી બધું ચાલવું જોઈએ, અને focus ring દેખાવી જોઈએ.
- Status ફક્ત રંગથી ન બતાવવું: સાથે લખાણ અથવા icon પણ હોવું જોઈએ.
- Click થઈ શકે એવી જગ્યા (button, icon) ઓછામાં ઓછી 40 × 40 px.
- Bilingual (ગુજરાતી / English) લખાણ માટે જગ્યા રાખવી. ગુજરાતી લખાણ લાંબું થઈ શકે.
- Footer માં Government of Gujarat, copyright, last updated, helpline જેવી માહિતી.
- Date format આખા portal માં એક જ: **DD/MM/YYYY**.

---

## 5. Naming Convention (HTML + Figma બંનેમાં સરખું)

- Tokens: `color-primary`, `color-text-heading`, `color-border-default`, `color-success-bg`, `space-16`, `radius-md`, `shadow-2`
- Components: `Button / Primary / Medium / Hover`, `Input / Text / Error`, `Modal / Confirm / Small`
- Figma માં **Variables** અને **Variants** આ જ નામથી બનાવવા.

---

## 6. Step-by-Step Plan (આગળ કેવી રીતે વધીશું)

| Step | કામ | Output |
|---|---|---|
| 1 | Color palette નક્કી કરવી | Color tokens page |
| 2 | Typography | Text styles page |
| 3 | Spacing, Radius, Shadow | Foundation page |
| 4 | Icon set પસંદ કરવો + icon list | Icon page |
| 5 | Buttons (બધા variants અને states) | Button page |
| 6 | Form inputs (બધા states) | Form page |
| 7 | Table | Table page |
| 8 | Modal, Drawer, Popover | Overlay page |
| 9 | Alert, Toast, Badge, Loader, Empty state | Feedback page |
| 10 | Navigation (Sidebar, Header, Tabs, Breadcrumb, Pagination) | Navigation page |
| 11 | Page templates | Sample pages |
| 12 | Figma માં એ જ નામથી components બનાવવા | Figma library |

---

## 7. Review Checklist (તમારા માટે)

- [ ] કોઈ component ઉમેરવાનો કે કાઢવાનો છે?
- [ ] Brand colors ક્યાં-ક્યાં છે (Primary blue, Gold)?
- [ ] Icon library કઈ વાપરવી?
- [ ] ગુજરાતી font જોઈએ છે?
- [ ] Dark mode જોઈએ છે કે નહીં? (Government portal માં સામાન્ય રીતે જરૂરી નથી)
- [ ] Step 1 (Colors) થી શરૂ કરીએ?
