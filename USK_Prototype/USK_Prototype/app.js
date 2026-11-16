/* USK Student Portal & COGENT admin — clickable prototype.
   Plain HTML/CSS/JS, in-memory state (resets on reload). Dummy data lives in data.js. */

// ------------------------------------------------------------------ state
const S = {
  view: 'login', sub: null, param: null,
  role: null, lang: 'en', fs: 1, reveal: false,
  menu: null, modal: null,
  student: structuredClone(DATA.student),
  certs: structuredClone(DATA.certs), internships: structuredClone(DATA.internships), special: structuredClone(DATA.special),
  announcements: structuredClone(DATA.announcements), applications: structuredClone(DATA.applications),
  corrections: structuredClone(DATA.corrections), records: structuredClone(DATA.records), divcfg: structuredClone(DATA.divcfg), osVersions: structuredClone(DATA.osVersions),
  adminNotifs: structuredClone(DATA.adminNotifs), dashboards: structuredClone(DATA.dashboards),
  // Student Admin page state: open filter panels, applied filters, sort and sidebar groups
  jobSkills: [...DATA.jobSkills], stuHolidays: structuredClone(DATA.stuHolidays), weekoff: { days: ['Saturday', 'Sunday'], from: '2026-10-06' },
  weekoffHist: [{ days: ['Sunday'], from: '2026-06-15', to: '2026-10-05', by: 'Prof. Nirav Shah' }, { days: ['Sunday', '2nd & 4th Saturday'], from: '2025-12-01', to: '2026-06-14', by: 'Prof. Nirav Shah' }], punches: {},
  hd: { date: '2026-11-05', trend: 7, deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', top: {}, low: {} },
  af: { reg: { date: '2026-11-05' }, rpt: { from: '2026-10-30', to: '2026-11-05' }, srec: { date: '2026-11-05' }, srpt: { from: '2026-11-01', to: '2026-11-05' },
    cfg: { deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY' }, asg: { deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', sem: 'Sem-5' }, ach: {} }, afd: {}, afOpen: { asg: true }, asort: {}, aper: {}, navOpen: {}, cgTab: 'login', asel: [],
  register: structuredClone(DATA.register), staff: structuredClone(DATA.staff), shifts: structuredClone(DATA.shifts),
  leaveRequests: structuredClone(DATA.leaveRequests), holidays: structuredClone(DATA.holidays), leavePolicy: structuredClone(DATA.leavePolicy),
  myLeaves: structuredClone(DATA.myLeaves), schApps: structuredClone(DATA.schApplications), skillMaster: structuredClone(DATA.skillMaster),
  companies: structuredClone(DATA.companies), location: { ...DATA.location }, myScholarships: [],
  attMonth: { y: 2026, m: 10 }, patMonth: { y: 2026, m: 10 }, calMonth: { y: 2026, m: 10 }, trendEnd: { y: 2026, m: 10 }, attRange: ['2026-10-30', '2026-11-05'], mp: null,
  notifPerm: 'default', nq: '', nsort: 0, nper: 10,
  sel: [], applyIds: [], jobPref: [], tmpLocs: [], appFilter: {},
  chat: [], filters: {}, pg: {}, acc: { cur: true, prev: true, addr: false }, doc: null, semOpen: null, upload: null, sch: { cat: null, step: 0 }, apply: { resume: 'system', agree: false },
  assigned: [1, 2, 7], workflow: ['Principal'],
  // Principal staff attendance (recording 13). Week-off keys are "<week of month>-<day 1=Mon..7=Sun>".
  shiftAssign: [
    { id: 1, shiftId: 1, from: '2026-10-01', wo: ['1-7', '2-7', '3-7', '4-7', '5-7', '2-6', '4-6'], staff: DATA.staff.filter(s => s.dept !== 'Administration' && s.id < 45).map(s => s.id) },
    { id: 2, shiftId: 2, from: '2026-10-01', wo: ['1-7', '2-7', '3-7', '4-7', '5-7'], staff: DATA.staff.filter(s => s.dept === 'Administration' && s.id < 45).map(s => s.id) }
  ],
  spunch: {}, pd: { date: '2026-11-05', trend: 7 }, asg: { shift: '', from: '', wo: [], pick: [], dept: '', desig: '' }, schedWeek: '2026-11-02'
};

// ------------------------------------------------------------------ helpers
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = '05/11/2026';  // prototype 'today' (matches the recordings)
const TODAY = new Date(2026, 10, 5);
const IC = {
  home: '<path fill="currentColor" d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3z"/>',
  grid: '<g fill="currentColor"><circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></g>',
  bell: '<path fill="none" stroke="currentColor" stroke-width="2" d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  chev: '<path fill="none" stroke="currentColor" stroke-width="2.5" d="M6 9l6 6 6-6"/>',
  globe: '<g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/></g>',
  search: '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path stroke="currentColor" stroke-width="2.5" d="M16 16l5 5"/>',
  eyeoff: '<path fill="none" stroke="currentColor" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2" d="M3 3l18 18"/>',
  eye: '<path fill="none" stroke="currentColor" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>',
  in: '<rect width="24" height="24" rx="3" fill="#0A66C2"/><path fill="#fff" d="M5 9h3v10H5zm1.5-5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM10 9h2.9v1.4c.4-.8 1.4-1.6 3-1.6 3.1 0 3.6 2 3.6 4.7V19h-3v-4.8c0-1.2 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V19h-3z"/>',
  ig: '<rect width="24" height="24" rx="6" fill="#E1306C"/><rect x="5.5" y="5.5" width="13" height="13" rx="4" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="15.9" cy="8.1" r="1" fill="#fff"/>',
  fb: '<circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.3 20v-6.6h2.2l.35-2.6H13.3V9.2c0-.75.2-1.26 1.3-1.26h1.35V5.6a18 18 0 0 0-1.97-.1c-1.95 0-3.28 1.19-3.28 3.37v1.93H8.5v2.6h2.2V20z"/>',
  gh: '<path fill="#111" d="M12 1a11 11 0 0 0-3.5 21.4c.6.1.8-.2.8-.5v-2c-3 .7-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10 10 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.1-5 5.4.4.3.7 1 .7 2v3c0 .3.2.6.8.5A11 11 0 0 0 12 1z"/>',
  mic: '<path fill="none" stroke="currentColor" stroke-width="2" d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/>',
  qr: '<path fill="currentColor" d="M3 3h8v8H3zm2 2v4h4V5zm8-2h8v8h-8zm2 2v4h4V5zM3 13h8v8H3zm2 2v4h4v-4zm8-2h2v2h-2zm4 0h4v2h-4zm-4 4h4v4h-4zm6 0h2v4h-2z"/>'
};
const I = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24">${IC[n]}</svg>`;
const st = s => {
  const m = { Pending: 'amber', 'Pending Review': 'amber', Applied: 'amber', Draft: 'grey', Approved: 'green', Verified: 'green', Selected: 'green', Present: 'green', Published: 'green', Corrected: 'green', Active: 'green',
    Rejected: 'red', Absent: 'red', Expired: 'red', Withdrawn: 'grey', 'Week Off': 'grey', Late: 'amber', 'On Leave': 'violet', Scheduled: 'blue', Unverified: 'grey', Updated: 'amber', Inactive: 'grey' };
  const k = Object.keys(m).find(x => String(s).startsWith(x)); return `<span class="st ${k ? m[k] : 'violet'}">${esc(s)}</span>`;
};
const table = (cols, rows, empty = 'No records found.') => `<div class="tbl-wrap"><table class="t"><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr>${rows.length ? rows.join('') : `<tr><td colspan="${cols.length}"><div class="empty"><div class="big">⚠</div>${empty}</div></td></tr>`}</table></div>`;
// carousel-style paging: dots, "page / pages" and arrows; state kept in S.pg[key]
// compact = small "‹ 1 / 3 ›" control that sits in the section header instead of a pager row under the list
function paged(key, arr, per, compact) {
  const pages = Math.max(1, Math.ceil(arr.length / per)), p = Math.min(S.pg[key] || 0, pages - 1);
  if (compact) return { items: arr.slice(p * per, p * per + per), nav: pages < 2 ? '' : `<span class="pgsm" aria-label="Pages"><button class="iconbtn" title="Previous" data-act="pg" data-k="${key}" data-v="${p - 1}" data-max="${pages}" ${p ? '' : 'disabled'}>‹</button><b>${p + 1}<span>/${pages}</span></b><button class="iconbtn" title="Next" data-act="pg" data-k="${key}" data-v="${p + 1}" data-max="${pages}" ${p < pages - 1 ? '' : 'disabled'}>›</button></span>` };
  const nav = pages < 2 ? '' : `<div class="pgnav"><button class="circ" data-act="pg" data-k="${key}" data-v="${p - 1}" data-max="${pages}" ${p ? '' : 'disabled'}>‹</button><span class="pgdots">${Array.from({ length: pages }, (_, i) => `<i class="${i === p ? 'on' : ''}" data-act="pg" data-k="${key}" data-v="${i}" data-max="${pages}"></i>`).join('')}</span><b>${p + 1} / ${pages}</b><button class="circ" data-act="pg" data-k="${key}" data-v="${p + 1}" data-max="${pages}" ${p < pages - 1 ? '' : 'disabled'}>›</button></div>`;
  return { items: arr.slice(p * per, p * per + per), nav };
}
const pager = (n) => `<div class="pager">Showing 1 to ${n} of ${n} entries<span class="row"><button class="btn ghost sm">‹</button><button class="btn sm">1</button><button class="btn ghost sm">›</button></span></div>`;
const field = (label, name, val = '', o = {}) => {
  const req = o.req ? ' <i>*</i>' : '';
  let ctl;
  if (o.options) ctl = `<select class="inp" name="${name}" ${o.ro ? 'disabled' : ''}><option value="">${o.ph || 'Select'}</option>${o.options.map(x => `<option ${x === val ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  else if (o.area) ctl = `<textarea class="inp" name="${name}" placeholder="${esc(o.ph || '')}" ${o.ro ? 'readonly' : ''}>${esc(val)}</textarea>`;
  else ctl = `<input class="inp" name="${name}" type="${o.type || 'text'}" value="${esc(val)}" placeholder="${esc(o.ph || '')}" ${o.ro ? 'readonly' : ''}>`;
  return `<div class="field"><label>${label}${req}</label>${ctl}${o.ro ? '' : `<div class="ferr" data-err="${name}"></div>`}</div>`;
};
function formData(scope) {
  const d = {}; (scope || document).querySelectorAll('[name]').forEach(e => d[e.name] = e.type === 'checkbox' ? e.checked : e.value.trim()); return d;
}
function requireFields(scope, names, msgs = {}) {
  let ok = true;
  names.forEach(n => { const e = scope.querySelector(`[name="${n}"]`), er = scope.querySelector(`[data-err="${n}"]`); const bad = !e.value.trim();
    e.classList.toggle('err', bad); if (er) er.textContent = bad ? '⚠ ' + (msgs[n] || 'This field is required.') : ''; if (bad) ok = false; });
  return ok;
}
function toast(msg, err) { const t = document.createElement('div'); t.className = 'toast' + (err ? ' err' : ''); t.textContent = (err ? '⚠ ' : '✓ ') + msg; t.style.top = (80 + 54 *document.querySelectorAll('.toast').length) + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }
function spinner(msg, ms, then) { const s = document.createElement('div'); s.className = 'spin'; s.innerHTML = `<div class="box"><div class="ring"></div><b>${msg}</b><div class="muted small">Please wait a moment</div></div>`; document.body.appendChild(s); setTimeout(() => { s.remove(); then && then(); }, ms); }
function openModal(title, body, foot = '', size = '', sub = '') { S.modal = { title, body, foot, size, sub }; renderModal(); }
function closeModal() { S.modal = null; S.doc = null; renderModal(); }
function renderModal() {
  const m = $('#modal-root'), x = S.modal, d = S.doc;
  m.innerHTML = (x ? `<div class="shade" data-act="shade"><div class="modal ${x.size}" role="dialog"><div class="mh"><span>${x.title}${x.sub ? `<small>${x.sub}</small>` : ''}</span><button data-act="closeModal">✕</button></div><div class="mb">${x.body}</div>${x.foot ? `<div class="mf">${x.foot}</div>` : ''}</div></div>` : '')
    + (d ? `${x ? '' : '<div class="shade" data-act="closeDoc"></div>'}<aside class="docpanel" role="dialog"><div class="mh"><span>View Document<small>${esc(d)}</small></span><button data-act="closeDoc" title="Close">✕</button></div><div class="docbody">${docSheet(d)}</div></aside>` : '');
  kbd(m);
}
const docSheet = name => `<div class="sheet" style="width:auto;margin:0;border-width:0 0 0 8px;line-height:1.7"><div class="row" style="border-bottom:2px solid var(--navy);padding-bottom:12px"><img src="img/logo.png" width="50" alt=""><div><b style="color:var(--navy)">Government of Gujarat</b><div class="small">Official Notification</div></div></div>
  <h3 class="center" style="margin:16px 0">${esc(name.replace(/_/g, ' ').replace(/\.pdf$/i, ''))}</h3><p>This sample attachment is shown inside the portal, so students can read it without downloading.</p><p class="mt"><b>1.</b> Read the eligibility conditions carefully.<br><b>2.</b> Keep the listed documents ready.<br><b>3.</b> Apply before the last date.</p><p class="mt muted small">Issued by the Higher Education Department, Government of Gujarat.</p></div>`;
function go(view, sub = null, param = null) {
  if (sub === 'pc-coform') { const c = S.companies.find(x => x.id === param);   // fresh draft for the Add / Edit Company form
    S.coDraft = c ? { ...structuredClone(c), logo: 1, dmode: c.about ? 'l' : 'w' } : { id: null, name: '', short: '', color: '#2563EB', type: '', sector: '', cat: '', web: '', about: '', desc: '', ids: {}, cert: '', country: '', state: '', city: '', addr: '', branches: [], person: '', desig: '', email: '', phone: '', altEmail: '', altPhone: '', social: [''], logo: 0, dmode: 'w' }; }
  if (sub === 'pr-location') S.locDraft = null;   // unsaved map edits are dropped when the page is reopened
  S.segOpen = undefined;                          // all-features sidebar follows the page's segment again
  S.view = view; S.sub = sub; S.param = param; S.menu = null; S.modal = null; S.doc = null; S.nav = false; render(); window.scrollTo(0, 0);
  document.querySelector('.snav button.on:not(.fold)')?.scrollIntoView({ block: 'nearest' });   // keep the active sidebar item visible
}

// ------------------------------------------------------------------ i18n (student header + dashboard)
const GU = { 'AI Career Guide': 'AI કારકિર્દી માર્ગદર્શક', 'Quick Services': 'ઝડપી સેવાઓ', 'Scholarship': 'શિષ્યવૃત્તિ', 'Attendance': 'હાજરી', 'Career & Placement': 'કારકિર્દી અને પ્લેસમેન્ટ', 'Skill Passport': 'સ્કિલ પાસપોર્ટ',
  'Recommended Government Schemes': 'ભલામણ કરેલ સરકારી યોજનાઓ', 'Scholarships': 'શિષ્યવૃત્તિઓ', 'Announcement': 'જાહેરાત', 'Internship/Placement Opportunity': 'ઇન્ટર્નશિપ/પ્લેસમેન્ટ તક', 'Upcoming Events': 'આગામી કાર્યક્રમો',
  'My Attendance Punch': 'મારી હાજરી પંચ', 'Latest Update': 'તાજા સમાચાર', 'Degree/Program': 'ડિગ્રી/પ્રોગ્રામ', 'Semester/Year': 'સેમેસ્ટર/વર્ષ', 'Email': 'ઈમેલ', 'Mobile No.': 'મોબાઈલ નં.', 'Verified': 'ચકાસાયેલ',
  'View Details': 'વિગતો જુઓ', 'View More': 'વધુ જુઓ', 'Today\'s Status': 'આજની સ્થિતિ', 'This Month Summary': 'આ મહિનાનો સારાંશ', 'Higher Education Department - Gujarat': 'ઉચ્ચ શિક્ષણ વિભાગ - ગુજરાત', 'UCCHA-SHIKSHA SAMIKSHA KENDRA': 'ઉચ્ચ શિક્ષણ સમીક્ષા કેન્દ્ર',
  // student home screen
  'Good Morning': 'સુપ્રભાત', 'Good Afternoon': 'શુભ બપોર', 'Good Evening': 'શુભ સાંજ', '＋ Add social links': '＋ સોશિયલ લિંક ઉમેરો',
  'NEW': 'નવું', 'ANNOUNCEMENT': 'જાહેરાત', 'Read details →': 'વિગતો વાંચો →', 'Opens the announcement details': 'જાહેરાતની વિગતો ખોલે છે', 'No latest updates available.': 'કોઈ તાજા સમાચાર ઉપલબ્ધ નથી.',
  'Check eligibility and apply': 'પાત્રતા તપાસો અને અરજી કરો', 'View and monitor your attendance': 'તમારી હાજરી જુઓ અને તપાસો', 'Explore career opportunities': 'કારકિર્દીની તકો શોધો', 'Manage your skills, showcase achievements': 'તમારી કુશળતા સંભાળો, સિદ્ધિઓ દર્શાવો',
  'ⓘ Eligibility is checked using your academic records': 'ⓘ પાત્રતા તમારા શૈક્ષણિક રેકોર્ડથી તપાસાય છે', 'ⓘ Marked from the mobile app with face check': 'ⓘ મોબાઈલ એપથી ચહેરાની ચકાસણી સાથે નોંધાય છે', 'ⓘ Jobs matched to your Skill Passport': 'ⓘ તમારા સ્કિલ પાસપોર્ટ મુજબની નોકરીઓ', 'ⓘ Your verified skills and certificates in one place': 'ⓘ તમારી ચકાસાયેલ કુશળતા અને પ્રમાણપત્રો એક જ જગ્યાએ',
  '✦ AI-curated · official gov.in / nic.in sources': '✦ AI દ્વારા પસંદ · સત્તાવાર gov.in / nic.in સ્રોત', '🏛 Official Gujarat government scholarships': '🏛 ગુજરાત સરકારની સત્તાવાર શિષ્યવૃત્તિઓ', '🏛 Official updates': '🏛 સત્તાવાર સમાચાર', '✦ AI-recommended': '✦ AI ભલામણ', '✦ Picked for your skills': '✦ તમારી કુશળતા મુજબ', 'Popular events across Gujarat': 'ગુજરાતના લોકપ્રિય કાર્યક્રમો', 'Events whose skills match your Skill Passport': 'તમારા સ્કિલ પાસપોર્ટ સાથે મેળ ખાતા કાર્યક્રમો',
  'Each card opens the official scholarship website in a new tab.': 'દરેક કાર્ડ સત્તાવાર શિષ્યવૃત્તિ વેબસાઇટ નવા ટેબમાં ખોલે છે.',
  "From the Education Department and your college. Each announcement disappears after its 'Visible till' date.": "શિક્ષણ વિભાગ અને તમારી કોલેજ તરફથી. દરેક જાહેરાત તેની 'ક્યાં સુધી દેખાશે' તારીખ પછી દૂર થાય છે.",
  'Only remote internships and internships in Gujarat are listed. Listings disappear after the apply-by date.': 'ફક્ત રિમોટ અને ગુજરાતની ઇન્ટર્નશિપ દર્શાવાય છે. અરજીની છેલ્લી તારીખ પછી તે દૂર થાય છે.',
  "Read More opens the organiser's website in a new tab.": '"વધુ વાંચો" આયોજકની વેબસાઇટ નવા ટેબમાં ખોલે છે.',
  'Recorded by the USK mobile app: every punch is face verified and checked to be inside the campus geofence.': 'USK મોબાઈલ એપથી નોંધાય છે: દરેક પંચમાં ચહેરાની ચકાસણી થાય છે અને કેમ્પસ જીઓફેન્સની અંદર હોવાનું તપાસાય છે.',
  'VISIBLE TILL': 'ક્યાં સુધી દેખાશે', 'Until removed': 'દૂર ન થાય ત્યાં સુધી', '📄 Attachment': '📄 જોડાણ', 'View attachment': 'જોડાણ જુઓ', 'Open announcement details': 'જાહેરાતની વિગતો ખોલો', 'No announcements available.': 'કોઈ જાહેરાત ઉપલબ્ધ નથી.', 'Published in the last 7 days': 'છેલ્લા 7 દિવસમાં પ્રકાશિત',
  'APPLY BY': 'અરજીની છેલ્લી તારીખ', 'Read More ↗': 'વધુ વાંચો ↗', '↗ Opens the official website in a new tab': '↗ સત્તાવાર વેબસાઇટ નવા ટેબમાં ખુલે છે', "↗ Organiser's website": '↗ આયોજકની વેબસાઇટ',
  '(In/Out)': '(ઇન/આઉટ)', 'View attendance →': 'હાજરી જુઓ →', 'Punch In': 'પંચ ઇન', 'Punch Out': 'પંચ આઉટ', 'Present': 'હાજર', 'Absent': 'ગેરહાજર', 'Week Off': 'સાપ્તાહિક રજા', 'Holiday': 'રજા',
  'Updated at the time of your last punch': 'તમારા છેલ્લા પંચના સમયે અપડેટ થયું', 'No punch recorded yet today': 'આજે હજુ કોઈ પંચ નોંધાયો નથી', '✎ Corrected by your HOD': '✎ તમારા HOD દ્વારા સુધારેલ',
  'Days Present': 'હાજર દિવસો', 'Social Profiles': 'સોશિયલ પ્રોફાઇલ', '＋ Add': '＋ ઉમેરો', 'Open your': 'તમારી', 'profile': 'પ્રોફાઇલ ખોલો', 'Total Hours': 'કુલ કલાક', 'attendance this month': 'આ મહિનાની હાજરી',
  'Your Student Portal,': 'તમારું વિદ્યાર્થી પોર્ટલ,', 'Now in': 'હવે', 'Your Pocket!': 'તમારા ખિસ્સામાં!', 'Mark attendance with face verification inside your campus geofence.': 'કેમ્પસ જીઓફેન્સની અંદર ચહેરાની ચકાસણી સાથે હાજરી પૂરો.',
  'Text size': 'અક્ષરનું કદ', 'Smaller text': 'નાના અક્ષર', 'Normal text': 'સામાન્ય અક્ષર', 'Larger text': 'મોટા અક્ષર', 'Change language': 'ભાષા બદલો', 'Language': 'Language' };
const t = s => S.lang === 'gu' && GU[s] ? GU[s] : s;

// ------------------------------------------------------------------ shared chrome
const brand = (sm) => `<div class="brand ${sm ? 'sm' : ''}"><img src="img/logo.png" alt=""><div><b>${t('UCCHA-SHIKSHA SAMIKSHA KENDRA')}</b><span>${t('Higher Education Department - Gujarat')}</span></div></div>`;
// text size: one segmented group, smallest → largest; the control itself keeps a fixed size so it doesn't jump when text grows
const FS = [[0.9, 'A', '−', 'Smaller text'], [1, 'A', '', 'Normal text'], [1.12, 'A', '+', 'Larger text']];
const LANGS = [['en', 'English', 'English', 'EN'], ['gu', 'ગુજરાતી', 'Gujarati', 'ગુ']];
const fsGroup = (cls = '') => `<div class="fsz ${cls}" role="group" aria-label="${t('Text size')}">${FS.map(([v, a, s, tip], i) => `<button class="s${i}${S.fs === v ? ' on' : ''}" data-act="fs" data-v="${v}" title="${t(tip)}" aria-label="${t(tip)}" aria-pressed="${S.fs === v}">${a}${s ? `<sup>${s}</sup>` : ''}</button>`).join('')}</div>`;
function fontLang() {
  const cur = LANGS.find(l => l[0] === S.lang) || LANGS[0];
  return `${fsGroup()}
  <span class="rel"><button class="chipbtn langbtn" data-act="menu" data-v="lang" title="${t('Change language')}" aria-haspopup="menu" aria-expanded="${S.menu === 'lang'}">${I('globe')}<span class="lfull">${cur[1]}</span><span class="lshort">${cur[3]}</span>${I('chev')}</button>${S.menu === 'lang' ? `<div class="drop-menu langmenu" role="menu"><div class="lmh">${t('Language')} · ભાષા</div>
    ${LANGS.map(([k, n, en]) => `<button role="menuitemradio" aria-checked="${S.lang === k}" class="${S.lang === k ? 'on' : ''}" data-act="lang" data-v="${k}"><span><b>${n}</b>${n !== en ? `<small>${en}</small>` : ''}</span><span class="ck">${S.lang === k ? '✓' : ''}</span></button>`).join('')}
    <div class="lmfs"><div class="lmh">${t('Text size')}</div>${fsGroup('wide')}</div></div>` : ''}</span>`;
}
function studentMenu() {
  return `<span class="rel"><button class="avawrap" data-act="menu" data-v="ava"><span class="ava">${S.student.initials}</span>${I('chev')}</button>${S.menu === 'ava' ? `<div class="drop-menu"><div class="who row"><span class="ava">${S.student.initials}</span><div><b>${S.student.name}</b><small class="muted">${S.student.emailMasked}</small></div></div>
    <button data-go="s-profile">👤 Profile</button><button data-act="settings">⚙ Settings</button><div style="border-top:1px solid var(--line);margin:6px 0"></div><button class="out" data-act="logout">⎋ Logout</button></div>` : ''}</span>`;
}
// ⓘ info icon placed after a heading; the explanation shows on hover / keyboard focus (styles: .itip)
const itip = (text, cls = '') => `<span class="itip ${cls}" tabindex="0" role="img" aria-label="${esc(text)}" data-tip="${esc(text)}">i</span>`;
function studentHeader(full) {
  return `<header class="shead">${brand()}<div class="r">${full ? `<button class="circ" data-act="helpline" title="Student helpline">☎</button><span class="rel"><button class="circ" data-act="menu" data-v="notif" title="Notifications">${I('bell')}</button>${S.menu === 'notif' ? notifMenu() : ''}</span><button class="chipbtn" data-go="s-chat">🤖 <span class="lbl-txt">${t('AI Career Guide')}</span></button>${fontLang()}` : `<button class="circ" data-go="s-dash" title="Dashboard">${I('home')}</button><span class="rel"><button class="circ" data-act="menu" data-v="apps" title="Services">${I('grid')}</button>${S.menu === 'apps' ? appsMenu() : ''}</span><span class="rel"><button class="circ" data-act="menu" data-v="notif" title="Notifications">${I('bell')}</button>${S.menu === 'notif' ? notifMenu() : ''}</span>`}${studentMenu()}</div></header>`;
}
const appsMenu = () => `<div class="drop-menu qsmenu"><div class="who"><b>▦ Quick Services</b></div><div class="qsgrid">${[['s-sch', '🎓', 'Scholarship', '#F5F3FF'], ['s-att', '🗓️', 'Attendance', '#ECFDF3'], ['s-place', '📋', 'Career & Placement', '#EEF4FF'], ['s-passport', '🏅', 'Skill Passport', '#FFF4EC'], ['s-chat', '🤖', 'AI Career Guide', '#F0FDFA'], ['soon', '🧭', 'Career Counselling', '#FEF3C7']].map(([g, ic, l, bg]) => `<button data-go="${g}"><span style="background:${bg}">${ic}</span>${l}</button>`).join('')}</div></div>`;
// Published student notifications, in the order the Student Notifications table lists them.
// img = thumbnail (shown in the bell panel); items without one show a bell tile. go = page the notification relates to.
const NOTIFS = [
  { title: 'Exam Released', desc: 'Your exam has been released and is now available. Please check the exam details, schedule and instructions on the portal.', list: ['Exam window: 10 November 2026 – 20 November 2026', 'Mode: Online, from the USK portal', 'Keep your Enrollment No. and registered mobile ready'], ago: '2d ago' },
  { title: 'Exam time table released', desc: 'The new government exam timetable for the Forest Department has been released. Please check the following dates and timings for the three papers:', list: ['Paper 1 – General Studies – I: 7 June 2026, 11:00 AM to 2:00 PM', 'Paper 2 – General Studies – II: 28 September 2026, 11:00 AM to 2:00 PM', 'Paper 3 – Main Examination: 13 December 2026, 11:00 AM to 2:00 PM'], ago: '3d ago' },
  { title: 'Result Declared', desc: 'Result for the forensic department exam has been declared. Please log in to the portal to check your result and download the marksheet.', ago: '4d ago' },
  { img: '📋', bg: '#EEF4FF', title: 'Important Update: Student Registration', desc: 'Dear Students, please review your academic records and ensure that all personal and academic details are correct before the registration closes.', ago: '5d ago', go: 's-profile' },
  { img: '📚', bg: '#F5F3FF', title: 'Important Academic Update', desc: 'Dear Students, please check the latest academic updates, upcoming examination schedules and submission deadlines for this semester.', ago: '6d ago' },
  { img: '🏢', bg: '#ECFDF3', title: 'Upcoming Campus Placement Drive', desc: 'Dear Students, we are pleased to inform you that an upcoming Campus Placement Drive will be held at the institute. Register from Career & Placement.', ago: '7d ago', go: 's-place' },
  { img: '🩺', bg: '#FEF2F2', title: 'NEET Examination Schedule Released', desc: 'The National Testing Agency (NTA) has released the updated schedule for the upcoming NEET examination. Check the dates and admit card release.', ago: '7d ago' },
  { img: '🎓', bg: '#FFF7E6', title: 'Scholarship Application Open', desc: 'Students are invited to apply for available scholarships. Please review the eligibility criteria and keep your documents ready.', ago: '8d ago', go: 's-sch' },
  { img: '🎭', bg: '#FDF2F8', title: 'Annual Cultural Fest Registration Open', desc: 'Students are invited to participate in the Annual Cultural Fest. Showcase your talents in music, dance and drama.', ago: '14d ago', panel: 1 },
  { img: '⏰', bg: '#FFF4EC', title: 'Scholarship Application Deadline Approaching', desc: 'Students who wish to apply for scholarships are advised to complete their applications before the deadline of 30/11/2026.', ago: '14d ago', go: 's-sch', panel: 1 },
  { img: '🤝', bg: '#EEF2F6', title: 'Campus Placement Drive Registration Open', desc: 'Eligible students are invited to register for the upcoming campus placement drive. Review the openings and apply before the last date.', ago: '14d ago', go: 's-place', panel: 1 },
  { img: '🪪', bg: '#EFF6FF', title: 'Update and Verify Your Student Profile', desc: 'All students are requested to review their personal and academic details in the student portal. Ensure your profile is complete and verified.', ago: '14d ago', go: 's-profile', panel: 1 },
  { img: '🧑‍💻', bg: '#ECFEFF', title: 'Student Skill Development Workshop Registration Open', desc: 'Registration is now open for the Student Skill Development Workshop designed to enhance practical and industry-ready skills.', ago: '8d ago', go: 's-passport', panel: 1 }
].map((n, i) => ({ id: i + 1, ...n }));
const nthumb = (n, cls = 'nthumb') => n.img ? `<span class="${cls}" style="background:${n.bg}">${n.img}</span>` : `<span class="${cls} nbell">${I('bell')}</span>`;
// Desktop-alert strip follows the browser permission: ask (Enable), blocked (how to allow) or allowed (hidden).
const notifAlert = () => S.notifPerm === 'granted' ? '' : S.notifPerm === 'denied'
  ? `<button class="nalert blocked" data-act="notifHelp"><span>🔕</span>Desktop alerts are blocked. Allow notifications for this site in your browser settings.</button>`
  : `<div class="nalert ask"><span>🔔</span><span style="flex:1">Get desktop alerts for new notifications</span><button class="btn sm" data-act="notifEnable">Enable</button></div>`;
const notifMenu = () => `<div class="drop-menu notifmenu"><div class="nhead"><span class="nbadge">${I('bell')}</span><b>Notifications</b></div>${notifAlert()}<div class="nlist">${NOTIFS.filter(n => n.panel).reverse().map(n => `<button data-act="notifView" data-id="${n.id}">${nthumb(n)}<span style="flex:1;min-width:0"><span class="row" style="gap:6px;align-items:flex-start;flex-wrap:nowrap"><b style="flex:1">${n.title}</b><small class="muted" style="white-space:nowrap">${n.ago}</small></span><small class="muted nclip">${n.desc}</small></span></button>`).join('')}</div><button class="nall" data-act="notifAll">View All Updates →</button></div>`;
function notifModal(id) {
  const n = NOTIFS.find(x => x.id === id), to = { 's-profile': 'My Profile', 's-place': 'Career & Placement', 's-sch': 'Scholarship', 's-passport': 'Skill Passport' }[n.go];
  openModal('Notification', `<div class="ndetail"><div class="nimg">${n.img ? `<span>${n.img}</span>` : ''}</div><div style="flex:1;min-width:0"><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p>${n.list ? `<ul>${n.list.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}<div class="muted small mt">Published ${n.ago}</div></div></div>`,
    to ? `<button class="btn ghost" data-act="closeModal">Close</button><button class="btn" data-act="notifGo" data-v="${n.go}">Go to ${to} →</button>` : '', 'wide nmodal');
}
// "View All Updates" page; inside a sidebar module it keeps that module's sidebar.
function notifPage() {
  const q = (S.nq || '').toLowerCase(), per = S.nper || 10;
  let rows = [...NOTIFS.filter(n => n.src).reverse(), ...NOTIFS.filter(n => !n.src)].filter(n => !q || (n.title + ' ' + n.desc).toLowerCase().includes(q));
  if (S.nsort) rows = [...rows].sort((a, b) => a.title.localeCompare(b.title) * S.nsort);
  const pages = Math.max(1, Math.ceil(rows.length / per)), p = Math.min(S.pg.notif || 0, pages - 1), items = rows.slice(p * per, p * per + per);
  return `<div class="ttl mb">🔔 Student Notifications<small>View all published student notifications and their details.</small></div>
    <div class="card sec row" style="padding:16px 16px"><span class="sp"></span><div class="nsearch"><input class="inp" name="nq" placeholder="Search by title or description" value="${esc(S.nq || '')}" data-act="notifSearch"><button class="circ navy" data-act="notifSearch" title="Search">${I('search')}</button></div></div>
    <div class="card">${table(['Image', `<button class="sortbtn" data-act="notifSort" title="Sort by title">Title ${S.nsort === 1 ? '↑' : S.nsort === -1 ? '↓' : '⇅'}</button>`, 'Description', 'Action'], items.map(n => `<tr><td>${nthumb(n, 'nthumb lg')}</td><td style="min-width:170px">${esc(n.title)}</td><td><span class="ndesc">${esc(n.desc)}</span></td><td><button class="iconbtn" title="View" data-act="notifView" data-id="${n.id}">👁</button></td></tr>`), 'No notifications match your search.')}
     <div class="pager">Showing ${rows.length ? p * per + 1 : 0} to ${Math.min(rows.length, (p + 1) * per)} of ${rows.length} entries<span class="row" style="gap:6px"><button class="btn ghost sm" data-act="pg" data-k="notif" data-v="${p - 1}" data-max="${pages}" ${p ? '' : 'disabled'}>‹</button>${Array.from({ length: pages }, (_, i) => `<button class="btn sm ${i === p ? '' : 'ghost'}" data-act="pg" data-k="notif" data-v="${i}" data-max="${pages}">${i + 1}</button>`).join('')}<button class="btn ghost sm" data-act="pg" data-k="notif" data-v="${p + 1}" data-max="${pages}" ${p < pages - 1 ? '' : 'disabled'}>›</button><select class="inp sm" style="width:auto" data-act="notifPer">${[10, 25].map(x => `<option ${x === per ? 'selected' : ''}>${x}</option>`).join('')}</select></span></div></div>`;
}const studentFoot = () => `<div class="foot"><b>HE USK GUJARAT</b><span>© 2026 Higher Education Department, Govt. of Gujarat. All Rights Reserved.</span></div>`;

function sideLayout({ title, subtitle, nav, content, top, back }) {
  return `<div class="side-shade ${S.nav ? 'on' : ''}" data-act="sidenav"></div><aside class="side ${S.nav ? 'open' : ''}">${brand(true)}<nav class="snav">${nav.map(n => n.grp ? `<div class="grp">${n.grp}</div>` : n.fold ? `<button class="fold ${n.on ? 'on' : ''} ${n.open ? 'open' : ''}" data-act="navFold" data-v="${n.key || n.fold}">${n.icon} ${n.fold}<span class="chev">⌄</span></button>` : `<button class="${n.sub ? 'subitem' : ''} ${n.on ? 'on' : ''}" data-go="${n.go}" data-sub="${n.s || ''}">${n.icon || ''} ${n.label}</button>`).join('')}</nav>
    <button class="lo" data-act="logout">Log out</button><div class="gv"><img src="img/emblem.png" alt="">Government Of Gujarat</div></aside>
    <header class="stop"><button class="iconbtn navbtn" style="font-size:1.6rem" data-act="sidenav" aria-label="Menu">☰</button><h1>${title}${subtitle ? `<small>${subtitle}</small>` : ''}</h1><div class="r">${top || ''}</div></header>
    <main class="amain">${content}</main>`;
}
function adminTop() {
  // single COGENT admin account: home + profile menu (logout only)
  const r = ADMIN_ACCOUNT;
  return `<button class="circ" data-go="adm" data-sub="${r.home}" title="All Features">${I('home')}</button><span class="rel"><button class="avawrap" data-act="menu" data-v="aava"><span class="ava">${r.initials}</span>${I('chev')}</button>${S.menu === 'aava' ? `<div class="drop-menu"><div class="who"><b>${r.person}</b><small class="muted">${r.label} · ${DATA.institute}</small></div><button class="out" data-act="logout">⎋ Logout</button></div>` : ''}</span>`;
}
const studentTop = () => `<button class="circ" data-go="s-dash" title="Dashboard">${I('home')}</button><span class="rel"><button class="circ" data-act="menu" data-v="apps" title="Quick Services">${I('grid')}</button>${S.menu === 'apps' ? appsMenu() : ''}</span><span class="rel"><button class="circ" data-act="menu" data-v="notif" title="Notifications">${I('bell')}</button>${S.menu === 'notif' ? notifMenu() : ''}</span>${studentMenu()}`;

// ------------------------------------------------------------------ charts
function lineChart(vals, labels, h = 220) {
  const w = 720, pad = 46, max = 100, step = (w - pad - 44) / (vals.length - 1);
  const pts = vals.map((v, i) => [pad + i * step, 20 + (h - 60) * (1 - v / max)]);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">${[0, 25, 50, 75, 100].map(g => { const y = 20 + (h - 60) * (1 - g / max); return `<line x1="${pad}" y1="${y}" x2="${w - 10}" y2="${y}" stroke="#EEF2F6"/><text x="8" y="${y + 5}" font-size="13" fill="#64748B">${g}</text>`; }).join('')}
    <polyline fill="none" stroke="#1E3A5F" stroke-width="3.5" points="${pts.map(p => p.join(',')).join(' ')}"/>${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="#C9A46A"/><text x="${p[0]}" y="${h - 14}" font-size="13" fill="#64748B" text-anchor="middle">${labels[i]}</text><text x="${p[0]}" y="${p[1] - 12}" font-size="12" fill="#1E3A5F" text-anchor="middle" font-weight="700">${vals[i]}%</text>`).join('')}</svg>`;
}
function donut(segs, label) {
  const total = segs.reduce((a, s) => a + s[1], 0); let off = 0;
  return `<div class="row" style="gap:24px"><svg width="190" height="190" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="none" stroke="#EEF2F6" stroke-width="7"/>${segs.map(s => { const d = s[1] / total * 100; const c = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${s[2]}" stroke-width="7" stroke-dasharray="${d} ${100 - d}" stroke-dashoffset="${-off + 25}"/>`; off += d; return c; }).join('')}<text x="21" y="22" text-anchor="middle" font-size="7" font-weight="800" fill="#1F2937">${label}</text></svg>
    <div style="line-height:2.2">${segs.map(s => `<div><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:${s[2]};margin-right:8px"></span>${s[0]} · <b>${s[1]}</b></div>`).join('')}</div></div>`;
}
function monthCal(year, month, marks, title) {
  const first = new Date(year, month, 1).getDay(), days = new Date(year, month + 1, 0).getDate();
  const cls = { Present: ['#F0FDF4', '#86EFAC', '#15803D'], Absent: ['#FEF2F2', '#FCA5A5', '#B91C1C'], 'Week Off': ['#F1F5F9', '#CBD5E1', '#475569'], Holiday: ['#F5F3FF', '#C4B5FD', '#6D28D9'], Future: ['#fff', '#EEF2F6', '#94A3B8'] };
  let h = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="hd">${d}</div>`).join('') + '<div></div>'.repeat(first);
  for (let d = 1; d <= days; d++) { const k = marks(d); const c = cls[k]; h += `<div class="dy" style="background:${c[0]};border-color:${c[1]};color:${c[2]}"><b>${d}</b>${k === 'Future' ? '' : k}</div>`; }
  return `${title ? `<div class="sech" style="font-size:1.15rem">${title}</div>` : ''}<div class="calgrid">${h}</div>`;
}

// ------------------------------------------------------------------ PUBLIC
const V = {};
V.login = () => `${`<header class="shead">${brand()}<div class="r">${fontLang()}</div></header>`}
  <div class="login-wrap"><div class="card login-card"><div class="login-img"><div class="tx"><span class="tag" style="background:rgba(255,255,255,.2);color:#fff">ACADEMIC PORTAL</span><h2 class="h-font" style="font-size:1.8rem;line-height:1.25;margin:16px 0 10px">Empowering Gujarat's Future through Digital Excellence.</h2><p style="opacity:.85;line-height:1.5">Access your academic records, scholarships, schedules, and administrative resources in one unified space.</p></div></div>
  ${S.sub === 'otp' ? `<form class="login-form" id="f-otp" data-act="verify2fa"><h1 class="h-font" style="font-size:2rem;color:var(--navy)">Two-Factor Authentication</h1>
    <p class="muted" style="margin:6px 0 12px">For your security, we've sent a 6-digit verification code to your Email Address. Enter it below to complete your login.</p>
    <div class="small">Code sent to<br><b>${S.student.emailMasked}</b></div>
    <div class="otprow">${Array.from({ length: 6 }, (_, i) => `<input class="inp otpc" inputmode="numeric" maxlength="1" aria-label="Digit ${i + 1}" autocomplete="${i ? 'off' : 'one-time-code'}">`).join('')}</div>
    <div class="ferr center" id="otperr" style="justify-content:center"></div>
    <div class="center small muted" style="margin:6px 0 16px">Didn't receive the code? <span id="otpt">${S.otpLeft > 0 ? `Resend available in ${S.otpLeft}s` : '<a data-act="resendOtp" style="color:var(--navy);font-weight:700;cursor:pointer">Resend code</a>'}</span></div>
    <div class="grid2"><button type="button" class="btn ghost" data-go="login">← BACK</button><button class="btn" id="otpsub" disabled>SUBMIT</button></div>
    <div class="infobox mt small">Demo: the verification code is <b>482916</b>.</div></form>`
  : `<form class="login-form" id="f-login" data-act="studentLogin"><h1 class="h-font" style="font-size:2rem;color:var(--navy)">Student Login</h1><p class="muted" style="margin:6px 0 24px">Enter your credentials to access the portal</p>
    ${field('Email Address / Mobile No. / APAAR/ABC ID', 'user', 'aarav.patel.ldce@gmail.com', { req: 1, ph: 'Email address / mobile no. / apaar/abc id' })}
    ${field('Password', 'pass', 'demo1234', { req: 1, type: 'password', ph: 'Enter your password' })}
    <div class="right" style="margin:-2px 0 14px"><a class="small" style="color:var(--navy);font-weight:600" data-act="forgot">Forgot Password?</a></div>
    <button class="btn block" style="height:42px">Sign In →</button>
    <div class="ordiv"><span>New student?</span></div>
    <div class="grid2" style="gap:10px"><button type="button" class="btn ghost" style="height:42px" data-act="signup">＋ Create Account</button><button type="button" class="btn ghost" style="height:42px;border-color:#7C3AED;color:#5B21B6" data-act="digilocker">⇪ Sign Up With DigiLocker</button></div>
    <div class="center mt small">Institute staff or administrator? <a style="color:var(--navy);font-weight:700" data-go="cg-login">Sign in with COGENT →</a></div>
    <div class="infobox mt small">Demo: any password works. Pre-registered student? Open the <a class="lnk" data-act="suInvite">registration link</a>.<br>Profile states: <b>pending@usk.in</b> · <b>rejected@usk.in</b> · <b>blocked@usk.in</b></div></form>`}</div></div>`;

// The only COGENT login: one demo admin account that holds every feature.
const ADMIN_ACCOUNT = { label: 'COGENT Admin (All Features)', person: 'Demo Admin', initials: 'DA', home: 'all-home' };
// Feature segments of that account (not separate logins); person = name shown on that segment's own screens
const ROLES = {
  admin: { label: 'Student Admin', person: 'Ms. Hetal Vyas', initials: 'HV', icon: '👥', desc: 'Student records, divisions, announcements', home: 'sa-records' },
  hod: { label: 'HOD / Teacher', person: 'Prof. Nirav Shah', initials: 'NS', icon: '🧑‍🏫', desc: 'Student attendance dashboard, register, report, holidays and week-offs', home: 'hod-dash' },
  principal: { label: 'Principal', person: 'Dr. Rajesh Bhatt', initials: 'RB', icon: '🏛', desc: 'Staff shifts, attendance, leave and campus geofence', home: 'pr-dash' },
  staff: { label: 'Staff', person: 'Dr. Meera Iyer', initials: 'MI', icon: '🧾', desc: 'My attendance, shifts and leave', home: 'st-dash' },
  skill: { label: 'Skill Passport Nodal Officer', person: 'Mr. Ankit Rao', initials: 'AR', icon: '🏅', desc: 'Skill master and student achievements', home: 'sk-master' },
  scholar: { label: 'Scholarship Nodal Officer', person: 'Ms. Pooja Desai', initials: 'PD', icon: '🎓', desc: 'Review and decide scholarship applications', home: 'so-apps' },
  placement: { label: 'Placement Coordinator', person: 'Mr. Amit Rana', initials: 'AR', icon: '💼', desc: 'Companies and selection steps for placements', home: 'pc-companies' }
};
const cgLeft = `<div class="cg-l"><span class="dept">🏛 HIGHER &amp; TECHNICAL EDUCATION DEPARTMENT</span><h1>One stop digital solution for <span>Education.</span></h1><p>Sign in to COGENT to securely access the digital services connected to your institution and role.</p>
  <div class="cg-feat"><div>🛡<b>Secure identity</b>Protected access to your account and services</div><div>▦<b>All services together</b>Move between approved education portals easily</div><div>🏛<b>Connected to your institution</b>Services are personalised to your role</div></div><button class="btn ghost mt" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)" data-go="login">← Student Login</button></div>`;
const cgTabs = () => `<div class="cg-tabs"><button type="button" class="${S.cgTab === 'reg' ? '' : 'on'}" data-act="cgTab" data-v="login">Login</button><button type="button" class="${S.cgTab === 'reg' ? 'on' : ''}" data-act="cgTab" data-v="reg">Register</button></div>`;
V['cg-login'] = () => S.cgTab === 'reg' ? `<div class="cg-page"><div class="cg-card">${cgLeft}<form class="cg-r" data-act="cgRegister" novalidate>${cgTabs()}
  <div class="kicker">New user</div><h2 style="font-size:2.2rem;margin:8px 0 6px">Create your account</h2><p class="muted" style="margin-bottom:16px">Register using Email ID and Mobile Number.</p>
  <div class="infobox warn small" style="margin-bottom:16px">ⓘ Registration is available only through Personal Email ID and Mobile Number.</div>
  ${field('Personal Email Address', 'email', '', { req: 1, type: 'email', ph: 'Personal Email Address' })}${field('Mobile Number', 'mob', '', { req: 1, ph: 'Mobile Number' })}
  <div class="grid2">${field('Password', 'pass', '', { req: 1, type: 'password', ph: 'Password' })}${field('Confirm Password', 'pass2', '', { req: 1, type: 'password', ph: 'Confirm Password' })}</div>
  <button class="btn block" style="height:50px">Register →</button><div class="center mt small">Already have an account? <a style="color:var(--navy);font-weight:700" data-act="cgTab" data-v="login">Login</a></div></form></div></div>`
  : `<div class="cg-page"><div class="cg-card">${cgLeft}<form class="cg-r" data-act="cgLogin">${cgTabs()}
  <div class="kicker">Portal access</div><h2 style="font-size:2.2rem;margin:8px 0 6px">Welcome back</h2><p class="muted" style="margin-bottom:24px">Sign in securely to continue to your COGENT services.</p>
  ${field('Email, Government ID or Mobile Number', 'user', 'staff@ldce.edu.in', { req: 1 })}${field('Password', 'pass', 'demo1234', { req: 1, type: 'password' })}
  <button class="btn block" style="height:54px">Sign in →</button><div class="center mt"><a style="color:var(--navy);font-weight:600" data-act="forgot">Forgot Password?</a></div><div class="center mt small">Recruiting company? <a style="color:var(--navy);font-weight:700" data-go="co-login">Company Login →</a></div></form></div></div>`;

// ==================================================================== RENDER
function render() {
  document.documentElement.style.setProperty('--fs', S.fs);
  const fn = V[S.view] || (() => `<div class="empty"><div class="big">🚧</div>Screen not found: ${esc(S.view)}</div>`);
  $('#app').innerHTML = fn();
  renderModal();
  kbd($('#app'));
}
// a[data-act] without href and clickable cards (div[data-act]) are not focusable by default: make them reachable with Tab
function kbd(root) { root.querySelectorAll('a[data-act]:not([href]):not([tabindex]), a[data-go]:not([href]):not([tabindex]), div[data-act].opp:not([tabindex])').forEach(e => { e.tabIndex = 0; if (e.tagName === 'DIV') e.setAttribute('role', 'button'); }); }
