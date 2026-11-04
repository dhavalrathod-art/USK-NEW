# USK Portal – Front End & Design System

> **આખી Design System HTML માં છે:** `index.html` ખોલો → sidebar માં **Design System** પર click કરો.
> કંઈ પણ ખબર ન પડે તો **UI Designer નો contact કરો** અથવા **Savan bhai ને પૂછો**.

---

## 1. Folder માં શું છે

| File | શું છે |
|---|---|
| `index.html` | **Main file.** Sidebar વાળું portal: Student Application, Job Opportunities, Design System, Responsive |
| `skill-passport.html` | Skill Passport page (student view), sidebar માંથી link |
| `css/usk-design-system.css` | **આખી Design System નું એક જ CSS** (tokens + components). બંને page આ વાપરે છે |
| `CLAUDE.md` | Claude માટે આખા project ની માહિતી. નવા account / chat માં આ file આપો |
| `img/` | Skill Passport banner ના photos |
| `Design-System-Guide.md` | Design System નું planning document (કયા components જોઈએ) |
| `LOGO-USK.png` | મોટો logo (original) |
| `LOGO-USK-sm.png` | નાનો logo, sidebar અને header માં વપરાય છે |
| `icons/` | બધા icons ની SVG files: `filled/`, `outline/`, `line/` |
| `build-icons.js` | `icons/` folder માંથી `icons.js` બનાવતી script |
| `icons.js` | Script થી બનેલી file, HTML તેમાંથી icons લે છે. **હાથથી edit ન કરવી.** |

## 2. કેવી રીતે ખોલવું

1. `index.html` browser માં ખોલો (Chrome / Edge). Folder ની બધી files સાથે જ રાખવી (`css/`, `icons.js`, logo, `img/`).
2. Sidebar માં આ menu છે:
   - **Student Application:** filter + table વાળું sample page
   - **Job Opportunities:** student માટે jobs table + Job Preference modal
   - **Skill Passport:** અલગ page (`skill-passport.html`)
   - **Design System:** બધા components અને tokens
   - **Responsive:** mobile, tablet, laptop, desktop પર page કેવું દેખાવું જોઈએ

## 3. Design System ના tabs

| Tab | શું મળશે |
|---|---|
| Logo | Logo lockup, sizes, કયા background પર વાપરવો |
| Colors | Brand (Navy `#233C5A`, Gold `#D1A76C`), text, background, border, status, icon colors |
| Typography | Font (Inter), headings, body, label, button text ની sizes |
| Spacing | 4px grid scale (`--space-4` થી `--space-48`) અને page, card, form, modal ની spacing |
| Icons | એક icon ઘણા colors માં (`currentColor`), Filled / Outline ક્યારે, sizes, basic icon library (click કરવાથી SVG copy થાય) |
| Buttons | 6 variants, states, sizes, icon સાથે buttons, ક્યાં કયું button |
| Form Inputs | Input, dropdown, textarea, બધા states (focus, error, disabled...) |
| Form Patterns | "+ Add" વાળા repeatable fields (drag કરીને ક્રમ બદલાય), search કરીને ઘણા values પસંદ કરવા (chips સાથે) |
| Upload | Drag & drop: profile photo (preview સાથે) અને documents (progress, error, remove) |
| Table | Table colors, status badges, action icons, 3 dots menu, 4 table types |
| Modal | Navy header, gold icon box, sizes, live examples |
| Drawer | જમણી બાજુથી ખૂલતી panel: certificate, image / logo અને details જોવા માટે (zoom, download સાથે) |
| Accordion | ખૂલતા-બંધ થતા sections: FAQ (એક જ ખુલ્લું) અને application sections (icon + status સાથે) |

દરેક color, spacing કે token પર click કરવાથી તેનો code copy થાય છે.

## 4. કામ કરવાના નિયમો

- નવું page બનાવો ત્યારે **ફક્ત Design System ના components અને tokens જ વાપરવા** (`--color-*`, `--space-*`, `.ui-btn`, `.ui-input`, `.ui-modal`, ...).
- નવો color, નવી button style કે નવી spacing value સીધી page માં ન ઉમેરવી. પહેલાં Design System માં ઉમેરાવવી.
- Spacing માં ફક્ત scale ની values: 4, 8, 12, 16, 20, 24, 32, 40, 48px.
- 992px થી નાની screen પર sidebar છુપાયેલું રહે છે અને toggle button થી logo સાથે ખુલે છે. વધુ માટે **Responsive** page જુઓ.
- Date format આખા portal માં એક જ: **DD/MM/YYYY**.

## 5. Icons અને તેના colors – ⚠️ ખાસ ધ્યાન

ઘણાં portal માં **icon નો color અને icon નો background color બદલાતો હશે.** એટલે:

- **એક icon ની એક જ SVG રાખવી.** SVG માં color ની જગ્યાએ `currentColor` લખવું, એટલે icon જ્યાં મૂકો ત્યાંનો color લઈ લે: table માં navy, Primary button (જેમ કે "Edit Job Posting") માં white. White કે blue ની અલગ copy ન બનાવવી.
- **Filled** icon: buttons, table actions, sidebar, modal header. **Outline** icon: input ની અંદર, helper text, empty state. એક group (એક row ના buttons, એક Action column) માં બંને style ભેગી ન કરવી.
- Icon ની size ફક્ત 14, 16, 18, 20 કે 24px.
- Icon નો color કે background color **જાતે નક્કી ન કરવો**.
- જે icon Design System માં નથી, તે બીજી library માંથી ન લેવો.
- **Icon, icon color અને icon background color માટે UI Designer ને પૂછવા વિનંતી છે.** UI Designer icon અને color બંને આપશે, અને તે Design System માં ઉમેરાશે.

### નવો icon કેવી રીતે ઉમેરવો

1. Figma માંથી icon **24 × 24 SVG** તરીકે export કરો. File નું નામ નાના અક્ષરમાં અને `-` સાથે: `job-post.svg`.
2. File સાચા folder માં મૂકો:
   - `icons/filled/` → filled icon
   - `icons/outline/` → outline icon
   - `icons/line/` → plus, close, arrow જેવા line icons
   - એક જ નામ બે folder માં હોય તો એ એક જ icon ના filled અને outline રૂપ ગણાય.
3. Project folder માં આ command ચલાવો (Node.js જોઈએ):

   ```bash
   node build-icons.js
   ```

4. Page refresh કરો. નવો icon **Design System → Icons** ની library માં દેખાશે.

Script Figma ના fixed colors (`#233C5A`, `white`...) ને `currentColor` માં બદલી નાખે છે, એટલે icon જ્યાં મૂકો ત્યાંનો color લેશે. જૂનો icon બદલવો હોય તો એ જ નામની નવી file મૂકીને ફરી command ચલાવો.

> **ધ્યાન:** Icon **એક જ color** નો હોવો જોઈએ. Figma માં બે color વાળો icon (જેમ કે navy box માં white line) હોય તો script પછી બંને ભાગ એક જ color ના થઈ જશે અને અંદરની line દેખાશે નહીં. આવા icon માટે UI Designer પાસે એક color વાળો icon માંગવો, જેમાં અંદરનો ભાગ કાપેલો (cut-out) હોય.

## 6. મદદ જોઈએ તો

- Design, color, icon કે spacing વિશે કંઈ પણ ખબર ન પડે → **UI Designer નો contact કરો.**
- Code કે page વિશે પ્રશ્ન હોય → **Savan bhai ને પૂછો.**

> Design System ની કોઈ value (color, spacing...) હજી નક્કી થઈ રહી હોય તો તે provisional છે. Final થયા પછી HTML અને Figma બંનેમાં એક જ નામથી update થશે.
