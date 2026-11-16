/* Interaction layer: event delegation for [data-go] navigation and [data-act] actions. */
let modalOk = null;
function ask(title, body, okLabel, onOk, size = '', sub = '') {
  modalOk = onOk;
  openModal(title, body, `<button class="btn ghost" data-act="closeModal">Cancel</button><button class="btn" data-act="modalOk">${okLabel}</button>`, size, sub);
}
const scope = () => $('#modal-root .modal');
const num = v => (v == null || v === '' ? null : !isNaN(v) ? Number(v) : v);
const SOC_DOMAIN = { LinkedIn: 'linkedin.com/in', Instagram: 'instagram.com', GitHub: 'github.com', Facebook: 'facebook.com' };
const passwordPrompt = (then) => {
  modalOk = s => { if (!requireFields(s, ['pw'], { pw: 'Please enter your password' })) return false; then(); };
  openModal('Password Verification', `<p class="muted small mb">Re-enter your password to view masked details.</p>${field('Password', 'pw', '', { req: 1, type: 'password', ph: 'Enter password' })}`, '<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="modalOk">🔒 Verify Password</button>');
};

// ------------------------------------------------------------------ canned AI answers
const ANSWERS = [
  [/cloud|aws|azure|certif/i, 'kb', 'For cloud internships, these certifications are valued by recruiters:<br><br>1. <b>AWS Certified Cloud Practitioner</b> – a strong first step.<br>2. <b>Microsoft Azure Fundamentals (AZ-900)</b>.<br>3. <b>Google Cloud Digital Leader</b>.<br><br>Pair one certification with a small project, such as deploying a Spring Boot app on the cloud, and add both to your <b>Skill Passport</b> so placement companies can find you.'],
  [/mysy|scholar|fees|loan|financ/i, 'kb', 'You may be eligible for <b>MYSY</b> if you scored 80 percentile or above in 12th and your family income is up to ₹6,00,000 a year. It reimburses up to 50% of tuition fees.<br><br>Open <b>Scholarship</b> from Quick Services to check eligibility — your academic details are already filled in.'],
  [/admission|acpc|gujcet|jee|neet/i, 'kb', 'Degree engineering admissions in Gujarat are handled by <b>ACPC</b> using GUJCET / JEE Main merit. Keep your marksheets, domicile certificate and category certificate ready. The supplementary round for vacant seats runs from 5 to 10 November 2026.'],
  [/abroad|ielts|gre|visa|masters/i, 'web', 'For a Master\'s abroad, plan about 12 months ahead:<br>• Take GRE (if required) and IELTS / TOEFL by your final semester.<br>• Shortlist 6–8 universities.<br>• Prepare an SOP, LORs and a financial plan.<br><br>The Gujarat <b>ISEL</b> scheme can cover 100% of the interest on an education loan.'],
  [/stress|mental|anxiety|safety|ragging|wellbeing/i, 'kb', 'I\'m sorry you\'re feeling this way; it\'s important to take it seriously. Please speak to a trusted faculty member, your college counsellor or the student support office. If campus safety is involved, stay with a trusted person and report it to the college in writing. You can also call the Tele-MANAS helpline at <b>14416</b>, free and available 24×7.'],
  [/upsc|gpsc|exam|bank|ssc/i, 'kb', 'For competitive exams, begin with the syllabus and previous years\' papers. GPSC Class 1-2 needs a graduate degree; banking exams (IBPS PO / SBI PO) test aptitude, reasoning and English. A 60–90 minute daily routine alongside college works well.'],
  [/startup|business|entrepreneur|funding/i, 'kb', 'Gujarat\'s <b>SSIP 2.0</b> supports student startups with prototype grants (up to ₹2.5 lakh), mentoring and incubation. Your college\'s SSIP cell or GUSEC can help you apply. Begin with a one-page problem statement and a simple prototype.']
];
const ANSWERS_GU = 'તમારા પ્રશ્ન બદલ આભાર! તમારી શૈક્ષણિક માહિતીના આધારે, <b>MYSY</b> અને <b>CMSS</b> શિષ્યવૃત્તિઓ તમારા માટે ઉપયોગી થઈ શકે છે. વિગત માટે ડેશબોર્ડ પરથી <b>શિષ્યવૃત્તિ</b> વિભાગ ખોલો.';
function answerFor(q) {
  if (S.lang === 'gu' || /[઀-૿]/.test(q)) return ['kb', ANSWERS_GU];
  const m = ANSWERS.find(a => a[0].test(q));
  return m ? [m[1], m[2]] : ['web', 'Here is what I found from official sources and AI for your question:<br><br>Start by checking your <b>Skill Passport</b> — adding certifications and internships improves both event recommendations and placement matches. For anything specific to your college, contact your Student Admin.'];
}
async function sendChat(q) {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  S.chat.push({ me: 1, text: q, time: now }); const msg = { typing: 1 }; S.chat.push(msg); render(); scrollChat();
  await new Promise(r => setTimeout(r, 900));
  const [src, html] = answerFor(q); msg.typing = 0; msg.html = ''; msg.time = now;
  const parts = html.split(/(<[^>]+>)/);
  for (const p of parts) { if (p.startsWith('<')) msg.html += p; else for (let i = 0; i < p.length; i += 4) { msg.html += p.slice(i, i + 4); render(); scrollChat(); await new Promise(r => setTimeout(r, 18)); } }
  msg.src = src; render(); scrollChat(); $('[name="q"]')?.focus();
}
const scrollChat = () => window.scrollTo(0, document.body.scrollHeight);

// ------------------------------------------------------------------ PDF previews
const passportPdf = () => { const s = S.student; return `<div class="pdf-bg"><div class="sheet"><div class="row" style="border-bottom:1px solid var(--line);padding-bottom:16px"><img src="img/logo.png" width="70" alt=""><div><b class="h-font" style="font-size:1.3rem">UCCHA SHIKSHA SAMIKSHA KENDRA</b><div class="muted">Higher Education Department - Gujarat</div></div><span class="sp"></span><div class="muted" style="border-left:1px solid var(--line);padding-left:16px;line-height:1.6">EDUCATE<br>EMPOWER<br>ELEVATE</div></div>
  <div class="center" style="padding:40px 0 32px"><div class="h-font" style="font-size:4rem;font-weight:800;color:var(--gold);line-height:1">SKILL</div><div class="h-font" style="font-size:4rem;font-weight:800;color:var(--navy);line-height:1.05">PASSPORT</div><div class="muted" style="letter-spacing:6px;margin-top:12px">BUILDING BRIGHTER FUTURES</div></div>
  <div class="row" style="background:var(--soft);border-radius:4px;padding:24px;gap:24px"><div class="bigava" style="border-color:#E2E8F0">${s.initials}</div><div style="flex:1;line-height:1.9"><b style="font-size:1.4rem">${s.name}</b><br>APAAR / ABC ID: ${s.apaarMasked}<br>${s.programme} · ${s.branch} · ${s.semester}<br>${DATA.institute}</div><div class="center">${I('qr').replace('class="i"', 'style="width:120px;height:120px"')}<div class="small muted">Scan to verify</div></div></div>
  <h3 style="margin:24px 0 10px;color:var(--navy)">JOB ORIENTED SKILLS</h3>${s.skills.map(k => `<span class="chip">${k}</span>`).join('')}
  <h3 style="margin:24px 0 10px;color:var(--navy)">CERTIFICATIONS</h3>${table(['Certificate', 'Issued By', 'Date', 'Level'], S.certs.map(c => `<tr><td>${c.name}</td><td>${c.org}</td><td>${c.issue}</td><td>${c.level}</td></tr>`))}
  <h3 style="margin:24px 0 10px;color:var(--navy)">ACADEMIC RECORD</h3>${table(['Exam', 'Board / University', 'Year', 'Result'], [['BE – Computer Engineering', 'GTU', '2023 – present', 'CGPA 8.46'], ...s.prev.map(p => [p.type, p.board, p.year, p.result])].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`))}
  <h3 style="margin:24px 0 10px;color:var(--navy)">SPECIAL ACHIEVEMENTS</h3>${table(['Achievement', 'Event', 'Date'], S.special.map(x => `<tr><td>${x.title}</td><td>${x.event}</td><td>${x.date}</td></tr>`))}</div></div>`; };
const resumePdf = () => { const s = S.student; return `<div class="pdf-bg"><div class="sheet" style="border:0"><h1 class="h-font" style="font-size:2.4rem;color:var(--navy)">${s.name}</h1><div class="muted" style="margin:4px 0 16px">${s.programme} · ${s.branch} · ${DATA.institute}</div>
  <div class="row small" style="border-bottom:3px solid var(--gold);padding-bottom:16px;gap:24px">✉ ${s.email}<span>☎ +91 ${s.mobile}</span><span>in ${s.social[0]?.url || ''}</span></div>
  <h3 style="color:var(--navy);margin:20px 0 6px">CAREER OBJECTIVE</h3><p style="line-height:1.7">Computer Engineering student with hands-on experience in ${s.skills.slice(0, 3).join(', ')} and cloud technologies, seeking an internship where I can build reliable software and grow as a backend engineer.</p>
  <h3 style="color:var(--navy);margin:20px 0 6px">EDUCATION</h3>${table(['Qualification', 'Year', 'Result'], [['BE – Computer Engineering, GTU', '2023 – present', 'CGPA 8.46'], ...s.prev.slice(0, 2).map(p => [p.type + ', ' + p.board, p.year, p.result])].map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`))}
  <h3 style="color:var(--navy);margin:20px 0 6px">SKILLS</h3><p>${s.skills.join(' · ')}</p>
  <h3 style="color:var(--navy);margin:20px 0 6px">INTERNSHIPS</h3>${S.internships.map(x => `<p><b>${x.company}</b> – ${x.sector} (${x.start} – ${x.end})</p>`).join('')}
  <h3 style="color:var(--navy);margin:20px 0 6px">CERTIFICATIONS</h3>${S.certs.map(c => `<p>${c.name} – ${c.org}, ${c.issue}</p>`).join('')}</div></div>`; };

// ------------------------------------------------------------------ actions
const ACT = {
  shade: (el, e) => { if (e.target !== el) return; if (S.doc) { S.doc = null; renderModal(); } else closeModal(); },
  sidenav: () => { S.nav = !S.nav; render(); },
  closeModal, modalOk: () => { if (modalOk && modalOk(scope()) === false) return; closeModal(); },
  menu: el => { S.menu = S.menu === el.dataset.v ? null : el.dataset.v; render(); },
  lang: el => { const changed = S.lang !== el.dataset.v; S.lang = el.dataset.v; S.menu = null; render(); if (changed) toast(S.lang === 'gu' ? 'ભાષા ગુજરાતી પર બદલાઈ' : 'Language changed to English'); },
  // text size: keeps the language menu open if it was changed from there (phones); focus stays on the pressed button
  fs: el => { const v = Number(el.dataset.v), inMenu = !!el.closest('.langmenu'); if (S.fs === v) return; S.fs = v; render();
    const b = document.querySelector(`${inMenu ? '.langmenu ' : '.shead > .r > '}.fsz [data-v="${v}"]`) || document.querySelector(`.fsz [data-v="${v}"]`); if (b) b.focus(); },
  a11y: () => openModal('Accessibility', `<p class="mb">Change text size and language for easier reading.</p><div class="row">${fontLang()}</div>`, '<button class="btn" data-act="closeModal">Done</button>'),
  soon: () => toast('This page is outside the prototype scope.'),
  forgot: () => ask('Forgot Password', field('Registered Email / Mobile / APAAR ID', 'id', '', { req: 1 }), 'Send Reset Link', s => { if (!requireFields(s, ['id'])) return false; toast('Password reset link sent'); }),
  digilocker: () => spinner('Redirecting to DigiLocker…', 1300, () => openModal('Sign Up With DigiLocker', `<div class="infobox ok">✓ APAAR ID <b>45XXXX7781</b> fetched from DigiLocker.</div><p class="mt">Your admission details were found in the <b>ACPC</b> database and pre-filled:</p><div class="grid2 mt">${[['Name', 'Aarav Patel'], ['Institute', DATA.institute], ['Programme', 'BE/B-Tech · Computer Engineering'], ['Admission Year', '2023-2024']].map(r => `<div><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`).join('')}</div><div class="infobox warn small mt">If you change any academic detail now, your profile goes to your college's Student Admin for approval before you can log in. An APAAR ID that is already registered cannot create a second account.</div>`, '<button class="btn ghost" data-act="closeModal">Edit details</button><button class="btn" data-act="signupDone">Confirm &amp; Create Account</button>')),
  signupDone: () => { closeModal(); toast('Account created — you can now sign in'); },
  studentLogin: (el) => {
    if (!requireFields(el, ['user', 'pass'])) return;
    const u = formData(el).user.toLowerCase();
    if (u === 'pending@usk.in') return openModal('Profile Under Review', '<div class="center"><div style="font-size:3rem">⏳</div><h3 class="mb">Your profile is waiting for approval</h3><p class="muted">You changed academic details during sign-up, so your college\'s Student Admin must review your profile. You will be able to log in on web and mobile once it is approved.</p></div>', '<button class="btn" data-act="closeModal">OK</button>');
    if (S.twofa) return spinner('Signing you in securely', 900, () => { S.otpLeft = 59; go('login', 'otp'); toast('OTP Sent · otp sent successfully'); setTimeout(() => $('.otpc')?.focus(), 50); });
    spinner('Signing you in securely', 1000, () => { go('s-dash'); toast('Login successfully'); });
  },
  verify2fa: el => {
    const code = [...el.querySelectorAll('.otpc')].map(i => i.value).join('');
    if (code !== '482916') { $('#otperr').textContent = '⚠ Invalid verification code. Use the demo code 482916.'; el.querySelectorAll('.otpc').forEach(i => { i.value = ''; i.classList.add('err'); }); el.querySelector('.otpc').focus(); $('#otpsub').disabled = true; return; }
    spinner('Verifying code', 800, () => { go('s-dash'); toast('Login successfully'); });
  },
  resendOtp: () => { if (S.otpLeft > 0) return; S.otpLeft = 59; render(); toast('OTP Sent · otp sent successfully'); },
  toggle2fa: () => {
    const on = !S.twofa;
    openModal('', `<div class="center"><div class="alert-ic">!</div><h2 style="font-size:1.5rem;margin:16px 0 8px">${on ? 'Enable' : 'Disable'} Two-Factor Authentication?</h2><p class="muted">You will be logged out of your account and will need to log in again to continue.</p></div>`,
      `<button class="btn" data-act="confirm2fa">Yes, ${on ? 'Enable' : 'Disable'} &amp; Logout</button><button class="btn ghost" data-act="closeModal">Cancel</button>`, 'alert');
  },
  confirm2fa: () => { S.twofa = !S.twofa; S.reveal = false; closeModal(); spinner('Logging you out', 700, () => { go('login'); toast(`Two-factor authentication ${S.twofa ? 'enabled' : 'disabled'}. Please log in again.`); }); },
  cgLogin: el => { if (!requireFields(el, ['user', 'pass'])) return; spinner('Signing you in securely', 900, () => { S.role = 'all'; go('adm', ADMIN_ACCOUNT.home); }); },   // single admin account, no role choice
  cgTab: el => { S.cgTab = el.dataset.v; render(); },
  cgRegister: el => { if (!requireFields(el, ['email', 'mob', 'pass', 'pass2'])) return; const d = formData(el); let ok = true;
    const err = (n, m) => { el.querySelector(`[data-err="${n}"]`).textContent = '⚠ ' + m; el.querySelector(`[name="${n}"]`).classList.add('err'); ok = false; };
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(d.email)) err('email', 'Enter a valid personal email address');
    if (!/^[6-9]\d{9}$/.test(d.mob)) err('mob', 'Enter a valid 10-digit mobile number');
    if (d.pass.length < 8) err('pass', 'Password must be at least 8 characters'); else if (d.pass !== d.pass2) err('pass2', 'Passwords do not match');
    if (ok) spinner('Creating your account', 800, () => { S.cgTab = 'login'; render(); toast('Account created. Sign in with your email and password.'); }); },
  logout: () => { S.menu = null; ask('Logout', '<p>Are you sure you want to log out?</p>', 'Logout', () => { const staff = !!S.role; S.role = null; S.reveal = false; go(staff ? 'cg-login' : 'login'); }); },
  twofa: () => { S.menu = null; if (S.twofa) { S.twofa = false; render(); return toast('Two-factor authentication disabled'); }
    ask('Enable Two-Factor Authentication', `<p class="mb">We sent a 6-digit code to <b>+91 98XXX X3210</b>.</p>${field('Verification code', 'code', '', { req: 1, ph: 'Demo code: 482916' })}`, 'Enable', s => { if (!requireFields(s, ['code'])) return false; S.twofa = true; render(); toast('Two-factor authentication enabled'); }); },
  reveal: () => { if (S.reveal) { S.reveal = false; render(); } else passwordPrompt(() => { S.reveal = true; render(); toast('Details visible for this session'); }); },
  ann: el => { S.menu = null; const a = S.announcements.find(x => x.id === num(el.dataset.id)); const c = DATA.annCats[a.cat] || ['#F1F5F9', '#334155'];
    openModal('Announcement Details', `<h2 style="margin-bottom:10px">${esc(a.title)}</h2><div class="row mb small muted"><span class="tag" style="background:${c[0]};color:${c[1]}">${a.cat}</span>PUBLISHED: <b style="color:#111">${a.published}</b> EXPIRES: <b style="color:#111">${a.expiry}</b></div>
      <div class="cert mb" style="background:var(--soft)"><div class="lbl">≡ Summary</div><p class="mt" style="margin-top:6px">${esc(a.summary)}</p></div><div class="cert" style="background:var(--soft)"><div class="lbl">📄 Description</div><p style="margin-top:6px;line-height:1.6">${esc(a.desc)}</p></div>
      <div class="row mt">${a.attach ? `<button class="btn ghost" data-act="attach" data-v="${a.attach}">📄 View Attachment</button>` : ''}${a.link ? `<button class="btn ghost" style="color:#15803D;border-color:#86EFAC" data-act="extlink" data-v="${a.link}">↗ Open Official Portal Link</button>` : ''}</div>`, '<button class="btn ghost" data-act="closeModal">✕ Close</button>', 'wide'); },
  attach: el => { S.doc = el.dataset.v; renderModal(); },
  // notifications (bell panel, desktop-alert permission, Student Notifications page)
  notifView: el => { S.menu = null; render(); notifModal(num(el.dataset.id)); },
  notifGo: el => { closeModal(); go(el.dataset.v); },
  notifAll: () => { S.pg.notif = 0; S.view === 's-att' || S.view === 's-place' ? go(S.view, 'notif') : go('s-notif'); },
  notifEnable: () => { S.menu = null; render(); openModal('', `<div class="center"><div class="alert-ic" style="background:#EFF6FF;color:#2563EB;border-color:#BFDBFE">🔔</div><h2 style="font-size:1.4rem;margin:16px 0 8px">Show notifications?</h2><p class="muted mt">The USK portal wants to send you desktop alerts for new notifications.</p></div>`,
    '<button class="btn ghost" data-act="notifPerm" data-v="denied">Block</button><button class="btn" data-act="notifPerm" data-v="granted">Allow</button>', 'alert'); },
  notifPerm: el => { S.notifPerm = el.dataset.v; S.modal = null; S.menu = 'notif'; render(); renderModal(); toast(S.notifPerm === 'granted' ? 'Desktop alerts enabled' : 'Desktop alerts blocked'); },
  notifHelp: () => { S.menu = null; render(); openModal('Allow Desktop Alerts', `<p class="mb">Desktop alerts are blocked for this site. To allow them:</p><ol class="nsteps"><li>Open your browser <b>Settings</b>.</li><li>Go to <b>Privacy, search and services → Site permissions → Notifications</b>.</li><li>Under <b>Allowed to send notifications</b>, click <b>Add site</b> and add the USK Student portal.</li><li>Come back to this page and reopen the bell.</li></ol>`,
    '<button class="btn ghost" data-act="closeModal">Close</button><button class="btn" data-act="notifPerm" data-v="granted">✓ I have allowed it</button>'); },
  notifSearch: () => { S.nq = $('[name="nq"]').value.trim(); S.pg.notif = 0; render(); },
  notifSort: () => { S.nsort = S.nsort === 1 ? -1 : S.nsort === -1 ? 0 : 1; render(); },
  notifPer: el => { S.nper = num(el.value); S.pg.notif = 0; render(); },
  scheme: el => { const x = DATA.schemes.find(z => z.id === num(el.dataset.id)); openModal('Scheme Details', `<span class="tag" style="background:${x.c[0]};color:${x.c[1]}">${x.dept}</span><h2 style="margin:16px 0 10px">${x.name}</h2><div class="cert mb" style="background:var(--soft)"><div class="lbl">Summary</div><p style="margin-top:6px">${x.desc}</p></div><div class="grid3">${[['Eligibility', x.elig], ['Income Limit', x.income], ['Source', x.src + ' ✓']].map(r => `<div><div class="lbl">${r[0]}</div><div class="val" style="font-size:1rem">${r[1]}</div></div>`).join('')}</div><div class="infobox small">Collected by AI from official government sources only (gov.in / nic.in). Closed schemes are removed automatically.</div>`, `<button class="btn ghost" data-act="extlink" data-v="${x.src}">↗ Open Official Website</button><button class="btn" data-act="closeModal">Close</button>`, 'wide'); },
  extlink: el => toast('Opens ' + el.dataset.v + ' in a new tab (not in prototype)'),
  photo: () => ask('Change Profile Photo', `<div class="drop" data-act="fakeUpload"><span style="font-size:1.6rem">📷</span><div><b>Upload a photo</b><div class="small">JPG or PNG · Max 1 MB</div></div></div>`, 'Save', () => toast('Profile photo updated')),
  addSocial: () => {
    const used = S.student.social.map(x => x.type), first = Object.keys(SOC_DOMAIN).find(p => !used.includes(p));
    if (!first) return toast('All four social media links are already added', 1);
    ask('Add Social Media Link', `<p class="muted small mb">Add your social media profile to complete your profile.</p><div class="field"><label>Select Platform <i>*</i></label><div class="grid2 socpick">${Object.keys(SOC_DOMAIN).map(p => `<button type="button" class="radio-card row ${p === first ? 'on' : ''}" ${used.includes(p) ? 'disabled title="Already added" style="opacity:.45"' : `data-act="socPick" data-v="${p}"`}>${socIcon(p)} <b>${p}</b><span class="sp"></span><span class="rdot"></span></button>`).join('')}</div><input type="hidden" name="type" value="${first}"></div>
      ${field('Profile URL', 'url', '', { req: 1, ph: 'Enter your profile url' })}<div class="muted small" id="socex" style="margin-top:-6px">Example: https://www.${SOC_DOMAIN[first]}/your-profile</div>`, 'Add Link',
      s => { const d = formData(s); if (!requireFields(s, ['url'], { url: 'Please enter profile url' })) return false;
        if (!d.url.toLowerCase().includes(SOC_DOMAIN[d.type].split('/')[0])) { s.querySelector('[name="url"]').classList.add('err'); s.querySelector('[data-err="url"]').textContent = `Please enter a valid ${d.type} profile url`; return false; }
        S.student.social.push({ type: d.type, url: d.url.replace(/^https?:\/\/(www\.)?/, '') }); render(); toast(d.type + ' link added'); });
  },
  delSocial: el => { S.student.social.splice(num(el.dataset.i), 1); render(); toast('Link removed'); },
  addRecord: () => recordForm(),
  editRecord: el => { const i = num(el.dataset.i); recordDetail(S.student.prev[i].kind, i); },
  acc: el => { S.acc[el.dataset.v] = !S.acc[el.dataset.v]; render(); },
  pg: el => { S.pg[el.dataset.k] = Math.max(0, Math.min(num(el.dataset.max) - 1, num(el.dataset.v))); render(); },
  closeDoc: () => { S.doc = null; renderModal(); },
  socPick: el => { const s = scope(); s.querySelectorAll('.socpick .radio-card').forEach(c => c.classList.toggle('on', c === el)); s.querySelector('[name="type"]').value = el.dataset.v;
    s.querySelector('#socex').textContent = 'Example: https://www.' + SOC_DOMAIN[el.dataset.v] + '/your-profile'; },
  settings: () => go('s-settings'),
  sendOtp: el => { const k = el.dataset.v, sc = el.closest('[data-scope]'); if (!requireFields(sc, [k])) return; S.otp = { ...(S.otp || {}), [k]: formData(sc)[k] }; render(); toast('OTP sent'); },
  verifyOtp: el => { const k = el.dataset.v, sc = el.closest('[data-scope]'), v = formData(sc)['otp_' + k];
    if (v !== '482916') { sc.querySelector(`[data-err="otp_${k}"]`).textContent = 'Incorrect OTP. Use the demo OTP 482916.'; return; }
    S.student[k] = S.otp[k]; S.student[k + 'Masked'] = k === 'mobile' ? S.otp[k].slice(0, 2) + 'XXXX' + S.otp[k].slice(-4) : S.otp[k][0] + '•••••' + S.otp[k].split('@')[0].slice(-1) + '@' + S.otp[k].split('@')[1];
    delete S.otp[k]; render(); toast((k === 'mobile' ? 'Mobile number' : 'Email address') + ' verified and updated'); },
  resume: () => spinner('Building your resume…', 900, () => openModal('📄 Resume_' + S.student.name.replace(' ', '_') + '.pdf', resumePdf(), '<button class="btn ghost" data-act="closeModal">Close</button><button class="btn" data-act="toastOk" data-v="Resume downloaded">⬇ Download PDF</button>', 'wide')),
  passportPdf: () => spinner('Generating your Skill Passport…', 1200, () => openModal('📄 Skill_Passport_' + S.student.name.replace(' ', '_') + '.pdf', passportPdf(), '<button class="btn ghost" data-act="closeModal">Close</button><button class="btn" data-act="toastOk" data-v="Skill Passport downloaded">⬇ Download PDF</button>', 'wide')),
  share: () => openModal('Share Skill Passport', `<p class="mb">Anyone with this link can view your public Skill Passport and verify your skills.</p><div class="row"><input class="inp" readonly value="usk-portal.example/passport/AP-7781"><button class="btn" data-act="toastOk" data-v="Link copied">Copy</button></div>`, '<button class="btn ghost" data-act="closeModal">Close</button>'),
  editSkills: () => { const mine = S.student.skills.slice(), all = [...new Set([...S.jobSkills].sort((a, b) => a.localeCompare(b)).concat(mine))];   // master list + anything the student already has
    ask('Edit Job Oriented Skills', `<p class="muted mb">Choose from the skill list maintained by the government. Click a skill to add or remove it.</p><div id="skpick">${all.map(k => `<button class="chip ${mine.includes(k) ? 'on' : ''}" data-act="toggleChip" data-v="${esc(k)}">${mine.includes(k) ? '✓ ' : '＋ '}${esc(k)}</button>`).join('')}</div>`, 'Save Skills',
      s => { S.student.skills = [...s.querySelectorAll('#skpick .chip.on')].map(c => c.dataset.v); render(); toast('Skills saved'); }, 'wide'); },
  toggleChip: el => { el.classList.toggle('on'); el.textContent = (el.classList.contains('on') ? '✓ ' : '＋ ') + el.dataset.v; },
  addCert: () => { S.upload = null; const subs = S.skillMaster.flatMap(c => c.subs);
    ask('Add Certificate', `${field('Skill Name', 'skill', '', { req: 1, options: subs, ph: 'Select skill' })}<div class="field"><label>Upload Certificate <i>*</i></label><div class="drop" data-act="certUpload"><span style="font-size:1.8rem">⬆</span><div><b>Drag &amp; drop your certificate or browse</b><div class="small">PDF, JPG, PNG · Max size 2 MB</div></div></div><div id="certfile"></div><div class="ferr" data-err="file"></div></div>
      ${field('Skill Level', 'level', '', { req: 1, options: DATA.skillLevels, ph: 'Select skill level' })}<div class="grid2">${field('Certificate ID', 'cid', '')}${field('Certificate Name', 'name', '', { req: 1 })}${field('Organization Name', 'org', '', { req: 1 })}${field('Issue Date', 'issue', '', { req: 1, type: 'date' })}${field('Expiry Date', 'expiry', '', { type: 'date' })}${field('Description', 'desc', '')}</div>`, 'Save Certificate',
      s => { const okF = requireFields(s, ['skill', 'level', 'name', 'org', 'issue']); if (!S.upload) { s.querySelector('[data-err="file"]').textContent = 'Please upload the certificate.'; return false; } if (!okF) return false;
        const d = formData(s); S.certs.push({ id: Date.now(), name: d.name, skill: d.skill, org: d.org, issue: d.issue.split('-').reverse().join('/'), expiry: d.expiry ? d.expiry.split('-').reverse().join('/') : '—', cid: d.cid || '—', level: d.level }); render(); toast('Certificate added to your Skill Passport'); }, 'wide'); },
  certUpload: () => { S.upload = 'Python_for_Data_Science_Certificate.pdf'; const box = $('#certfile'); box.innerHTML = `<div class="filebox">📄 ${S.upload} · 412 KB <b style="color:var(--green);margin-left:10px">✦ Reading certificate details…</b></div>`;
    setTimeout(() => { const s = scope(); if (!s) return; const set = (n, v) => { const e = s.querySelector(`[name="${n}"]`); if (e && !e.value) { e.value = v; e.style.background = '#F0FDF4'; } };
      set('skill', 'Python'); set('cid', 'GKS-PDS-20264471'); set('name', 'Python for Data Science'); set('org', 'Gujarat Knowledge Society'); set('issue', '2026-09-20'); set('desc', 'Data analysis with NumPy, Pandas and Matplotlib');
      box.innerHTML = `<div class="filebox">📄 ${S.upload} · 412 KB <b style="color:var(--green);margin-left:10px">✓ Details filled from certificate — please check them</b></div>`; }, 1300); },
  viewCert: el => { const c = S.certs.find(x => x.id === num(el.dataset.id)); openModal('Certificate', `<div class="pdf-bg"><div class="sheet center" style="width:640px;border:8px double var(--gold)"><div class="kicker">Certificate of Achievement</div><h2 class="h-font" style="margin:16px 0">${c.name}</h2><p>This certifies that</p><h3 style="margin:8px 0">${S.student.name}</h3><p class="muted">has successfully completed the requirements.</p><div class="row mt" style="justify-content:space-between"><span>${c.org}</span><span>${c.issue}</span><span>ID: ${c.cid}</span></div></div></div>`, '<button class="btn" data-act="closeModal">Close</button>', 'wide'); },
  delCert: el => ask('Delete Certificate', '<p>Remove this certificate from your Skill Passport?</p>', 'Delete', () => { S.certs = S.certs.filter(x => x.id !== num(el.dataset.id)); render(); toast('Certificate removed'); }),
  addIntern: () => ask('Add Internship', `<div class="grid2">${field('Company Name', 'company', '', { req: 1 })}${field('Work Sector', 'sector', '', { req: 1 })}${field('Start Date', 'start', '', { req: 1, type: 'date' })}${field('End Date', 'end', '', { req: 1, type: 'date' })}</div>${field('Internship Projects', 'proj', '')}${field('Project Deliverables', 'del', '', { area: 1 })}${field('Skills Used (comma separated)', 'skills', '', { ph: 'Python, SQL, Power BI' })}<div class="field"><label>Upload Internship Certificate</label><div class="drop" data-act="fakeUpload"><span style="font-size:1.6rem">⬆</span><div><b>Upload file</b><div class="small">PDF, JPG, PNG · Max 2 MB</div></div></div></div>`, 'Save Internship',
    s => { if (!requireFields(s, ['company', 'sector', 'start', 'end'])) return false; const d = formData(s), f = x => new Date(x).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ (\d{4})$/, ', $1');
      const months = Math.max(1, Math.round((new Date(d.end) - new Date(d.start)) / 2.6e9)); S.internships.push({ id: Date.now(), company: d.company, sector: d.sector, start: f(d.start), end: f(d.end), duration: String(months).padStart(2, '0') + (months > 1 ? ' Months' : ' Month'), skills: d.skills ? d.skills.split(',').map(x => x.trim()) : [], file: 'Internship_Certificate.pdf' }); render(); toast('Internship added'); }, 'wide'),
  addSpecial: () => ask('Add Special Achievement', `<div class="grid2">${field('Achievement Title', 'title', '', { req: 1, ph: 'e.g. State Level Winner' })}${field('Event / Competition', 'event', '', { req: 1 })}${field('Organization Name', 'org', '', { req: 1 })}${field('Date', 'date', '', { req: 1, type: 'date' })}${field('Skill', 'skill', '', { options: S.skillMaster.flatMap(c => c.subs) })}${field('Skill Level', 'level', '', { options: DATA.skillLevels })}</div>`, 'Save',
    s => { if (!requireFields(s, ['title', 'event', 'org', 'date'])) return false; const d = formData(s); S.special.push({ id: Date.now(), ...d, date: new Date(d.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }); render(); toast('Special achievement added'); }, 'wide'),
  journeyAll: () => { S.journeyAll = !S.journeyAll; render(); },
  sem: el => { const i = num(el.dataset.i); S.semOpen = S.semOpen === i ? null : i; render(); },
  // attendance: month pickers, trend range, calendar, history range, transactions, export
  mpOpen: el => { const k = el.dataset.v; S.mpYear = (k === 'sum' ? S.attMonth : S.patMonth).y; S.mp = S.mp === k ? null : k; render(); },
  mpYear: el => { S.mpYear = Math.min(TODAY.getFullYear(), S.mpYear + num(el.dataset.v)); render(); },
  mpPick: el => { const v = { y: S.mpYear, m: num(el.dataset.v) }; if (el.dataset.k === 'sum') S.attMonth = v; else S.patMonth = v; S.mp = null; render(); },
  trend: el => { const n = ym(S.trendEnd.y, S.trendEnd.m + num(el.dataset.v)); S.trendEnd = futureYM(n.y, n.m) ? { y: TODAY.getFullYear(), m: TODAY.getMonth() } : n; render(); },
  calNav: el => { S.calMonth = ym(S.calMonth.y, S.calMonth.m + num(el.dataset.v)); render(); },
  calToday: () => { S.calMonth = { y: TODAY.getFullYear(), m: TODAY.getMonth() }; render(); },
  txDay: el => txModal(el.dataset.v),
  histFilter: () => { S.histFilterOpen = S.histFilterOpen === false; render(); },
  rangeApply: () => { const d = formData($('.amain .filterbar')); if (!d.from || !d.to || d.from > d.to) { $('#rangeerr').textContent = '⚠ Select a valid date range (start date before end date).'; return; } S.attRange = [d.from, d.to]; S.pg.hist = 0; render(); },
  rangeReset: () => { S.attRange = ['2026-10-30', '2026-11-05']; S.pg.hist = 0; render(); },
  exportAtt: () => {
    const [from, to] = S.attRange, lines = [['Sr No.', 'Date', 'Punch In', 'Punch Out', 'Transaction Times', 'Total Time', 'Status']]; let n = 0;
    for (let d = new Date(to + 'T00:00:00'); d >= new Date(from + 'T00:00:00'); d.setDate(d.getDate() - 1)) { if (d > TODAY) continue; const a = attOf(d); lines.push([++n, dmy(d, '-'), a.inM ? hm(a.inM) : '-', a.outM ? hm(a.outM) : '-', a.tx.length, dur(worked(a)), a.status]); }
    const blob = new Blob([lines.map(r => r.map(v => `"${v}"`).join(',')).join('\r\n')], { type: 'text/csv' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `attendance_${from}_${to}.csv`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast(`File downloaded · attendance_${from}_${to}.csv`);
  },
  // placement: selection, apply page, job preference, application filter
  selJob: el => { const id = num(el.dataset.id); S.sel = el.checked ? [...new Set([...S.sel, id])] : S.sel.filter(x => x !== id); render(); },
  selAll: el => { S.sel = el.checked ? prefJobs().filter(j => !isApplied(j.id)).map(j => j.id) : []; render(); },
  clearSel: () => { S.sel = []; render(); },
  applyJobs: el => { const ids = el.dataset.id ? [num(el.dataset.id)] : S.sel.filter(id => !isApplied(id)); if (!ids.length) return toast('Select at least one job', 1);
    S.applyIds = ids; S.apply = { resume: 'system', agree: false, file: null }; go('s-place', 'apply'); },
  changeSel: () => { S.sel = [...S.applyIds]; go('s-place', 'list'); },
  removeApply: el => { S.applyIds = S.applyIds.filter(x => x !== num(el.dataset.id)); if (!S.applyIds.length) { S.sel = []; go('s-place', 'list'); return toast('No jobs left in this application'); } render(); },
  cancelApply: () => go('s-place', 'list'),
  resumeOpt: el => { S.apply.resume = el.value; render(); },
  pickResume: () => { S.apply.file = 'Aarav_Patel_Resume.pdf'; render(); toast('Resume uploaded'); },
  delResume: () => { S.apply.file = null; render(); },
  agree: el => { S.apply.agree = el.checked; const e = $('#agreeerr'); if (e) e.textContent = ''; },
  submitApp: () => {
    if (S.apply.resume === 'custom' && !S.apply.file) { $('#reserr').textContent = '⚠ Please upload your resume.'; return; }
    if (!S.apply.agree) { $('#agreeerr').textContent = '⚠ Please accept the declaration to continue.'; return; }
    const n = S.applyIds.length;
    spinner('Submitting application', 900, () => {
      S.applyIds.forEach(id => { S.applications.unshift({ job: id, date: today, status: 'Applied', stages: [] }); DATA.jobs.find(j => j.id === id).applicants++; });
      S.sel = []; S.applyIds = []; go('s-place', 'list'); toast(`Application Submitted · Your application has been submitted for ${n} job${n > 1 ? 's' : ''}.`);
    });
  },
  jobPref: () => { S.tmpLocs = S.jobPref.length ? S.jobPref.map(x => ({ ...x })) : [{ country: '', state: '', city: '' }];
    ask('Add Job Preference', `<div class="card sec" style="box-shadow:none;border:1px solid var(--line);margin:0"><div style="border-left:3px solid var(--navy);padding-left:10px;margin-bottom:12px"><b>Add Location</b><div class="muted small">Select a country, state and city / district, then click Add Location.</div></div><div id="locs">${locRows()}</div>
      <button type="button" class="btn ghost block" style="border-style:dashed" data-act="addLoc">＋ Add Location</button><div class="muted small mt" style="margin-top:8px">Select a country, state and city / district to add a location.</div></div>`, '💾 Save Preference',
      s => { let ok = true; S.tmpLocs.forEach((l, i) => ['country', 'state', 'city'].forEach(k => { const bad = !l[k]; const el = s.querySelector(`[data-i="${i}"][data-k="${k}"]`); el.classList.toggle('err', bad); if (bad) ok = false; }));
        if (!ok) { $('#locerr') || s.querySelector('#locs').insertAdjacentHTML('afterend', '<div class="ferr" id="locerr">⚠ Please select country, state and city / district for every location.</div>'); return false; }
        const seen = new Set(); S.jobPref = S.tmpLocs.filter(l => { const k = l.country + l.state + l.city; if (seen.has(k)) return false; seen.add(k); return true; });
        S.sel = []; render(); toast('Job preference saved'); }, 'wide', 'Choose the places where you want to look for a job.'); },
  addLoc: () => { S.tmpLocs.push({ country: '', state: '', city: '' }); $('#locs').innerHTML = locRows(); },
  delLoc: el => { if (S.tmpLocs.length === 1) S.tmpLocs = [{ country: '', state: '', city: '' }]; else S.tmpLocs.splice(num(el.dataset.i), 1); $('#locs').innerHTML = locRows(); },
  locSel: el => { const l = S.tmpLocs[num(el.dataset.i)], k = el.dataset.k; l[k] = el.value; if (k === 'country') l.state = l.city = ''; if (k === 'state') l.city = ''; $('#locs').innerHTML = locRows(); $('#locerr')?.remove(); },
  clearPref: () => { S.jobPref = []; render(); toast('Job preference cleared'); },
  appFilterToggle: () => { S.appFilterOpen = !S.appFilterOpen; render(); },
  appFilterApply: () => { S.appFilter = formData($('.amain .filterbar')); render(); },
  appFilterReset: () => { S.appFilter = {}; render(); },  viewApp: el => { const a = S.applications[num(el.dataset.i)], j = DATA.jobs.find(x => x.id === a.job);
    openModal('Application · ' + j.title, `<div class="grid3 mb">${[['Company', j.company], ['Status', st(a.status)], ['Applied On', a.date]].map(r => `<div><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`).join('')}</div><div class="lbl mb">Required Skills</div>${j.skills.map(k => `<span class="chip">${k}</span>`).join('')}<div class="lbl mt mb">Selection Process</div><div class="grid3">${j.rounds.map((r, i) => `<div class="cert"><b>${i + 1}. ${r}</b><div class="${a.stages[i] === 'Pending' ? 'muted' : ''}" style="${a.stages[i] !== 'Pending' ? 'color:var(--green)' : ''}">${a.stages[i]}</div></div>`).join('')}</div>`, '<button class="btn" data-act="closeModal">Close</button>', 'wide'); },
  export: () => toast('Excel export downloaded (demo)'),
  correction: () => ask('Request Attendance Correction', `<div class="grid2">${field('From Date', 'from', '2026-10-28', { req: 1, type: 'date' })}${field('To Date', 'to', '2026-10-28', { type: 'date' })}${field('Punch In', 'in', '09:10', { type: 'time' })}${field('Punch Out', 'out', '16:40', { type: 'time' })}</div>${field('Reason', 'reason', '', { req: 1, area: 1, ph: 'Explain why the punch was missed' })}<div class="infobox small">Your request goes to your college for review. You can request several dates at once.</div>`, 'Submit Request',
    s => { if (!requireFields(s, ['from', 'reason'])) return false; const d = formData(s); S.corrections.unshift({ date: d.from.split('-').reverse().join('/'), reason: d.reason, status: 'Pending' }); render(); toast('Correction request sent to your college'); }),
  applyFilter: () => toast('Filter applied'), resetFilter: () => { render(); toast('Filter reset'); },
  newChat: () => { S.chat = []; render(); },
  topic: el => sendChat('Tell me about ' + el.dataset.v.toLowerCase()),
  ask: el => { const q = formData(el).q; if (q) sendChat(q); },
  mic: () => { S.recording = true; render(); setTimeout(() => { S.recording = false; render(); const i = $('[name="q"]'); i.value = S.lang === 'gu' ? 'મને શિષ્યવૃત્તિ વિશે માહિતી આપો' : 'Which certifications help me get a cloud internship?'; i.focus(); toast('Voice captured — press Send'); }, 1800); },
  kyc: () => spinner('Connecting to DigiLocker…', 1200, () => { S.kyc = true; render(); toast('Aadhaar KYC verified via DigiLocker'); }),
  schCat: el => { S.sch.cat = num(el.dataset.i); render(); },
  schContinue: () => { S.sch.step = 0; go('s-sch', 'form', S.param); },
  schStep: el => { S.sch.step = num(el.dataset.i); render(); },
  schSubmit: el => { const x = DATA.scholarships.find(z => z.code === el.dataset.v); S.myScholarships.push({ id: x.code + '26-' + Math.floor(10000 + Math.random() * 89999), name: x.name, date: today, status: 'Submitted' }); S.sch = { cat: null, step: 0 }; go('s-sch'); toast('Scholarship application submitted'); },
  fakeUpload: el => { el.innerHTML = '<span style="font-size:1.6rem">📄</span><div><b>document.pdf</b><div class="small" style="color:var(--green)">✓ Uploaded · 284 KB</div></div>'; },
  toastOk: el => toast(el.dataset.v || 'Done'),
  // ---------------- admin
  filter: el => { S.filters[el.dataset.k] = el.dataset.v; render(); },
  // ---------------- Student Admin (recording 9)
  navFold: el => { const k = el.dataset.v, open = el.classList.contains('open'); if (k.startsWith('seg-')) S.segOpen = open ? null : k; else S.navOpen[k] = !open; render(); },
  aFilter: el => { const k = el.dataset.k; S.afOpen[k] = !S.afOpen[k]; render(); },
  aDraftDeg: el => { const k = el.dataset.k; S.afd[k] = { ...formData($('.apanel')), branch: '' }; render(); },
  aApply: el => { const k = el.dataset.k, p = $('.apanel'), req = { cfg: ['deg', 'branch'], asg: ['deg', 'branch', 'sem'], reg: ['date'], rpt: ['from', 'to'], srec: ['date'], srpt: ['from', 'to'] }[k];
    if (req && !requireFields(p, req, { deg: 'Please select degree/program', branch: 'Please select branch/subject', sem: 'Please select semester/year', date: 'Please select date', from: 'Please select a date range', to: 'Please select a date range' })) return;
    const f = formData(p);
    if (f.date && f.date > iso(TODAY)) { p.querySelector('[data-err="date"]').textContent = '⚠ Date cannot be in the future'; return; }
    if ((k === 'rpt' || k === 'srpt') && (f.from > f.to || f.to > iso(TODAY))) { p.querySelector('[data-err="from"]').textContent = '⚠ Select a valid range (From before To, not in the future)'; return; }
    S.af[k] = f; S.afd[k] = null; S.pg[k] = 0; S.asel = []; render(); },
  aReset: el => { const k = el.dataset.k; S.af[k] = { reg: { date: iso(TODAY) }, rpt: { from: '2026-10-30', to: iso(TODAY) }, srec: { date: iso(TODAY) }, srpt: { from: '2026-11-01', to: iso(TODAY) } }[k] || null; S.afd[k] = null; S.pg[k] = 0; S.asel = []; render(); },
  // ---------------- HOD / Teacher: student attendance (recording 10)
  hdDate: el => { if (!el.value || el.value > iso(TODAY)) return toast('Select a date up to today', 1); S.hd.date = el.value; render(); },
  hdSum: el => { if (el.name === 'deg') { S.hd.deg = el.value; S.hd.branch = ''; } else S.hd.branch = el.value; render(); },
  hdTrend: el => { S.hd.trend = num(el.dataset.v); render(); },
  hdTop: el => { const f = S.hd[el.dataset.k]; f[el.name] = el.value; if (el.name === 'deg') f.branch = ''; render(); },
  hodPunch: el => { const s = DATA.hodStudents.find(x => x.enr === el.dataset.enr), out = el.dataset.v === 'out', date = S.af.reg.date;
    openModal(`Punch ${out ? 'Out' : 'In'} Attendance <i style="font-weight:400">( ${s.name} )</i>`, `<div class="grid2">${field(`Punch ${out ? 'Out' : 'In'} Date`, 'pd', date, { req: 1, type: 'date', ro: 1 })}${field(`Punch ${out ? 'Out' : 'In'} Time`, 'pt', '', { req: 1, type: 'time' })}</div><div class="ferr" data-err="pt2"></div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn" id="punchbtn" data-act="hodPunchSave" data-enr="${s.enr}" data-v="${el.dataset.v}">⎆ Punch ${out ? 'Out' : 'In'}</button>`); },
  hodPunchSave: el => { const sc = scope(); if (!requireFields(sc, ['pt'], { pt: 'Please select time' })) return;
    const s = DATA.hodStudents.find(x => x.enr === el.dataset.enr), date = S.af.reg.date, key = s.enr + '|' + date, out = el.dataset.v === 'out';
    const [h, m] = formData(sc).pt.split(':').map(Number), mins = h * 60 + m, tx = [...stuDay(s, dOf(date)).tx], last = tx[tx.length - 1];
    if (last && mins <= last[1]) { sc.querySelector('[data-err="pt"]').textContent = `⚠ Time must be after the last punch (${hm(last[1])})`; return; }
    el.disabled = true; el.textContent = `⟳ Punching ${out ? 'Out' : 'In'}...`;
    setTimeout(() => { tx.push([out ? 'Punch Out' : 'Punch In', mins, 'web']); S.punches[key] = tx; closeModal(); render(); toast(`${s.name} punched ${out ? 'out' : 'in'} at ${hm(mins)}`); }, 700); },
  hodTx: el => { const s = DATA.hodStudents.find(x => x.enr === el.dataset.enr), d = dOf(S.af.reg.date), a = stuDay(s, d), w = txMins(a.tx);
    openModal(`Transaction History <i style="font-weight:400">(${dmy(d, '-')})</i>`, `<div class="txwrap"><div style="flex:1">${a.tx.length ? `<div class="tline">${a.tx.map((t, i) => `<div class="ti"><span class="dot"></span><span class="nbox">${pad2(i + 1)}</span><span class="muted">${t[0]} :</span> <b>${hm(t[1])}</b> <span class="tag" title="${t[2] === 'web' ? 'Recorded by HOD from the web portal' : 'Marked from the mobile app'}">${t[2] === 'web' ? '🖥 Web' : '📱 App'}</span></div>`).join('')}</div>` : '<div class="empty">No transaction records found.</div>'}</div>
      <div class="cert center" style="min-width:170px;align-self:flex-start"><div class="muted small">Total Time</div><b style="font-size:1.5rem;color:var(--navy)">${w ? dur(w).replace(' hr', ' hr').replace(' min', ' min') : '—'}</b></div></div><div class="muted small mt">${s.name} · ${s.enr}</div>`, '', 'wide'); },
  hodExport: el => { const k = el.dataset.k, f = S.af[k], lines = [];
    if (k === 'reg') { const d = dOf(f.date); lines.push(['Sr No.', 'Enrollment No.', 'Name', 'Degree/Program', 'Branch/Subject', 'Semester/Year', 'Punch In', 'Punch Out', 'Transaction Times', 'Total Time']);
      hodRows(f).forEach((s, i) => { const a = stuDay(s, d), ins = a.tx.filter(t => t[0] === 'Punch In'), outs = a.tx.filter(t => t[0] === 'Punch Out'); lines.push([i + 1, s.enr, s.name, s.deg, s.branch, s.sem, ins.length ? hm(ins[0][1]) : '-', outs.length ? hm(outs[outs.length - 1][1]) : '-', a.tx.length, hms(txMins(a.tx))]); }); }
    else { lines.push(['Sr No.', 'Enrollment No.', 'Name', 'Degree/Program', 'Branch/Subject', 'Semester/Year', 'Present Days', 'Total Time']);
      hodRows(f).forEach((s, i) => { let p = 0, m = 0; for (let x = dOf(f.from); x <= dOf(f.to); x.setDate(x.getDate() + 1)) { const a = stuDay(s, x); if (a.status === 'Present') { p++; m += txMins(a.tx); } } lines.push([i + 1, s.enr, s.name, s.deg, s.branch, s.sem, p, `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`]); }); }
    const name = k === 'reg' ? `student_attendance_register_${f.date}.csv` : `student_attendance_report_${f.from}_${f.to}.csv`;
    const blob = new Blob([lines.map(r => r.map(v => `"${v}"`).join(',')).join('\r\n')], { type: 'text/csv' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('File downloaded · ' + name); },
  holForm: el => { const id = num(el.dataset.id), h = S.stuHolidays.find(x => x.id === id) || {};
    openModal(id ? 'Edit Student Holiday' : 'Add Student Holiday', `<div class="grid2">${field('Holiday Name', 'name', h.name || '', { req: 1, ph: 'Enter holiday name' })}${field('Holiday Date', 'date', h.date || '', { req: 1, type: 'date' })}</div>${field('Description', 'desc', h.desc || '', { req: 1, area: 1, ph: 'Enter description' })}`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" id="holbtn" data-act="holSave" data-id="${id || ''}">💾 ${id ? 'Update' : 'Add'} Holiday</button>`); },
  holSave: el => { const sc = scope(); if (!requireFields(sc, ['name', 'date', 'desc'], { name: 'Please enter holiday name', date: 'Please select holiday date', desc: 'Please enter description' })) return;
    const f = formData(sc), id = num(el.dataset.id);
    if (S.stuHolidays.some(h => h.date === f.date && h.id !== id)) { sc.querySelector('[data-err="date"]').textContent = '⚠ A holiday already exists on this date'; return; }
    el.disabled = true; el.textContent = '⟳ Saving...';
    setTimeout(() => { if (id) Object.assign(S.stuHolidays.find(h => h.id === id), f); else S.stuHolidays.push({ id: Date.now(), ...f }); closeModal(); render(); toast(id ? 'Updated — Holiday updated successfully' : 'Added — Holiday added successfully'); }, 600); },
  holDel: el => ask('Delete Holiday', '<p>Delete this holiday? The date becomes a working day again.</p>', 'Delete', () => { S.stuHolidays = S.stuHolidays.filter(h => h.id !== num(el.dataset.id)); render(); toast('Deleted — Holiday deleted successfully'); }),
  woForm: () => { WO = [...S.weekoff.days];
    openModal('Edit Student Week-off', `<div class="field"><label>Week-off Days <i>*</i></label><div class="msel" id="wochips">${woChips()}</div><div class="ferr" data-err="wo"></div></div>${field('Effective From', 'from', S.weekoff.from, { req: 1, type: 'date' })}`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="woSave">💾 Update Week-off</button>`); },
  woAdd: el => { if (el.value && !WO.includes(el.value)) WO.push(el.value); $('#wochips').innerHTML = woChips(); },
  woDel: el => { WO = WO.filter(d => d !== el.dataset.v); $('#wochips').innerHTML = woChips(); },
  woSave: () => { const sc = scope(), f = formData(sc); let ok = requireFields(sc, ['from'], { from: 'Please select effective from date' });
    sc.querySelector('[data-err="wo"]').textContent = WO.length ? '' : '⚠ Please select at least one week-off day'; if (!WO.length) ok = false;
    if (f.from && f.from < iso(TODAY) && f.from !== S.weekoff.from) { sc.querySelector('[data-err="from"]').textContent = 'Effective from cannot be before minimum allowed date'; ok = false; }
    if (!ok) return; S.weekoff = { days: DAYS.filter(d => WO.includes(d)), from: f.from }; closeModal(); render(); toast('Updated — Week-off updated successfully'); },
  aSearch: el => { const k = el.dataset.k; S.af[k + 'q'] = $(`[name="aq-${k}"]`).value.trim(); S.pg[k] = 0; render(); },
  aSort: el => { const k = el.dataset.k, c = el.dataset.v, s = S.asort[k]; S.asort[k] = !s || s.col !== c ? { col: c, dir: 1 } : s.dir > 0 ? { col: c, dir: -1 } : null; render(); },
  aPer: el => { S.aper[el.dataset.k] = num(el.value); S.pg[el.dataset.k] = 0; render(); },
  viewStudent: el => { S.menu = null; render(); const x = S.records.find(r => r.id === num(el.dataset.id));
    openModal(x.status === 'Verified' ? 'Verified Profile' : 'Student Profile', '<div class="ploading"><div class="ring"></div><div class="muted mt">Loading profile...</div></div>', '', 'xl');
    setTimeout(() => { if (!S.modal) return; S.modal.body = profileBody(x);
      S.modal.foot = x.status === 'Updated' || x.status === 'Unverified' ? `<button class="btn red" data-act="decide" data-id="${x.id}" data-v="Rejected">✕ Reject Profile</button><button class="btn green" data-act="decide" data-id="${x.id}" data-v="Verified">✓ Verify Profile</button>` : ''; renderModal(); }, 500); },
  decide: el => { S.menu = null; const x = S.records.find(r => r.id === num(el.dataset.id)); const ok = el.dataset.v === 'Verified';
    const done = (reason) => { x.status = el.dataset.v; x.reason = reason; if (ok) x.changed = ''; closeModal(); render(); toast(ok ? `${x.name}'s profile verified — the student can now log in` : `${x.name}'s profile rejected — the student sees the reason at login and can correct and resubmit`); };
    if (ok) done(); else ask('Reject Profile', `<p class="mb">Tell <b>${x.name}</b> why the profile was rejected.</p>${field('Reason', 'r', '', { req: 1, area: 1 })}`, 'Reject', s => { if (!requireFields(s, ['r'])) return false; setTimeout(() => done(formData(s).r)); }); },
  // division configuration
  addDivision: () => divForm(), editDivision: el => divForm(num(el.dataset.id)),
  dfDeg: el => { const b = scope().querySelector('[name="branch"]'); b.innerHTML = '<option value="">Select branch/subject</option>' + branchesOf(el.value).map(x => `<option>${x}</option>`).join(''); },
  dfAdd: () => { const s = scope(), i = s.querySelector('[name="divname"]'), v = i.value.trim().toUpperCase(), er = s.querySelector('[data-err="divname"]');
    er.textContent = !v ? '⚠ Please enter division name' : DF.divs.includes(v) ? '⚠ This division is already added' : '';
    if (er.textContent) return i.focus(); DF.divs.push(v); i.value = ''; $('#dfchips').innerHTML = dfChips(); i.focus(); },
  dfDel: el => { DF.divs.splice(num(el.dataset.v), 1); $('#dfchips').innerHTML = dfChips(); },
  dfSave: () => { const s = scope();
    if (!requireFields(s, ['deg', 'branch', 'sem'], { deg: 'Please select degree/program', branch: 'Please select branch/subject', sem: 'Please select semester/year' })) return;
    if (!DF.divs.length) return toast('Division Required — add at least one division', 1);
    const f = formData(s), b = $('#dfsave'); b.disabled = true; b.textContent = '⟳ Saving...';
    setTimeout(() => {
      let c = DF.id ? S.divcfg.find(x => x.id === DF.id) : cfgFor(f.deg, f.branch, f.sem)[0];
      if (c) { const keep = DF.id ? DF.divs : [...new Set([...c.divs, ...DF.divs])];
        S.records.forEach(r => { if (r.deg === c.deg && r.branch === c.branch && r.sem === c.sem && r.div && !keep.includes(r.div)) r.div = ''; });
        Object.assign(c, { deg: f.deg, branch: f.branch, sem: f.sem, divs: keep }); }
      else S.divcfg.push({ id: Date.now(), deg: f.deg, branch: f.branch, sem: f.sem, divs: [...DF.divs] });
      S.af.cfg = { deg: f.deg, branch: f.branch }; S.afd.cfg = null; closeModal(); render(); toast('Saved — Division configuration saved successfully'); }, 700); },
  delDivision: el => ask('Delete Division Configuration', '<p>Delete these divisions? Students assigned to them become unassigned.</p>', 'Delete', () => { const c = S.divcfg.find(x => x.id === num(el.dataset.id));
    S.records.forEach(r => { if (r.deg === c.deg && r.branch === c.branch && r.sem === c.sem && c.divs.includes(r.div)) r.div = ''; }); S.divcfg = S.divcfg.filter(x => x !== c); render(); toast('Division configuration deleted'); }),
  // division assignment
  asAll: el => { S.asel = el.checked ? [...document.querySelectorAll('[data-act="asPick"]')].map(e => num(e.dataset.id)) : []; render(); },
  asPick: el => { const id = num(el.dataset.id); S.asel = el.checked ? [...S.asel, id] : S.asel.filter(x => x !== id); render(); },
  asOne: el => { const x = S.records.find(r => r.id === num(el.dataset.id)); x.div = el.value; render(); toast(el.value ? `${x.name} assigned to Division ${el.value}` : `${x.name} removed from division`); },
  asBulk: () => { const v = $('#bulkdiv').value; if (!v) return toast('Select a division to assign', 1);
    S.asel.forEach(id => { S.records.find(r => r.id === id).div = v; }); toast(`${S.asel.length} student(s) assigned to Division ${v}`); S.asel = []; render(); },
  // OS version compatibility
  osForm: el => { const id = num(el.dataset.id), x = S.osVersions.find(o => o.id === id) || {};
    ask(id ? 'Edit OS Version Compatibility' : 'Add OS Version Compatibility', `<div class="grid2">${field('App Name', 'app', x.app || '', { req: 1, ph: 'e.g. USK Student App' })}${field('OS', 'os', x.os || '', { req: 1, options: ['Android', 'iOS'], ph: 'Select OS' })}</div>${field('Minimum Version', 'ver', x.ver || '', { req: 1, ph: 'e.g. 8.0' })}${field('Description', 'desc', x.desc || '', { area: 1, ph: 'Describe the version requirement' })}`, id ? 'Update' : 'Save', s => {
      if (!requireFields(s, ['app', 'os', 'ver'])) return false; const f = formData(s);
      if (!/^\d+(\.\d+){0,2}$/.test(f.ver)) { s.querySelector('[data-err="ver"]').textContent = '⚠ Enter a version like 8.0 or 14.2.1'; return false; }
      if (id) Object.assign(x, f); else S.osVersions.push({ id: Date.now(), ...f }); render(); toast(id ? 'Record updated' : 'OS version record added'); }); },
  osDel: el => ask('Delete Record', '<p>Delete this OS version compatibility record?</p>', 'Delete', () => { S.osVersions = S.osVersions.filter(o => o.id !== num(el.dataset.id)); render(); toast('Record deleted'); }),
  // student notification management (published ones reach the student bell)
  snForm: el => { const id = num(el.dataset.id), x = S.adminNotifs.find(n => n.id === id) || {}; SN = { id, img: x.img || '' };
    openModal(id ? 'Edit Student Notification' : 'Add Student Notification', `<div class="grid2"><div>${field('Notification Title', 'title', x.title || '', { req: 1, ph: 'Enter notification title' })}${field('Description', 'desc', x.desc || '', { req: 1, area: 1, ph: 'Enter description' })}${counter('desc', 500, x.desc || '')}</div>
      <div class="field"><label>Notification Image / Banner</label>${uploadCircle('snImg', 'Upload Image', '.jpeg, .jpg, .png', '8 MB', SN.img)}</div></div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="snSave">💾 ${id ? 'Update' : 'Add'} Notification</button>`, 'wide'); },
  snImg: el => { SN.img = ['🖼', '🎓', '📢', '🛠', '🏆', '💡'][Math.floor(Math.random() * 6)]; el.closest('.upcircle-wrap').outerHTML = uploadCircle('snImg', 'Upload Image', '.jpeg, .jpg, .png', '8 MB', SN.img); },
  snSave: () => { const s = scope(); if (!requireFields(s, ['title', 'desc'], { title: 'Please enter notification title', desc: 'Please enter description' })) return;
    const f = formData(s); if (f.desc.length > 500) { s.querySelector('[data-err="desc"]').textContent = '⚠ Maximum 500 characters'; return; }
    const x = S.adminNotifs.find(n => n.id === SN.id);
    if (x) Object.assign(x, { title: f.title, desc: f.desc, img: SN.img }); else S.adminNotifs.unshift({ id: Date.now(), img: SN.img, title: f.title, desc: f.desc, pub: true, date: today });
    syncNotifs(); closeModal(); render(); toast(x ? 'Notification updated' : 'Notification published to students'); },
  snPub: el => { const x = S.adminNotifs.find(n => n.id === num(el.dataset.id)); x.pub = !x.pub; if (x.pub) x.date = today; syncNotifs(); render(); toast(x.pub ? 'Notification published to students' : 'Notification unpublished'); },
  snDel: el => ask('Delete Notification', '<p>Delete this notification? Students will no longer see it.</p>', 'Delete', () => { S.adminNotifs = S.adminNotifs.filter(n => n.id !== num(el.dataset.id)); syncNotifs(); render(); toast('Notification deleted'); }),
  // government announcement
  annAdmin: el => { const a = S.announcements.find(x => x.id === num(el.dataset.id)), c = DATA.annCats[a.cat] || ['#F1F5F9', '#334155'];
    openModal('Announcement Details', `<div class="row mb" style="align-items:flex-start"><h2 style="flex:1;font-size:1.4rem">${esc(a.title)}</h2><span class="tag" style="background:${c[0]};color:${c[1]}">${a.cat}</span>${st(a.status === 'Published' ? 'Active' : 'Inactive')}</div>
      <div class="cert mb grid3" style="background:var(--soft)">${[['Created By', a.by], ['Publish Date', a.published], ['Expiry Date', a.expiry === '—' ? 'N/A' : a.expiry]].map(r => `<div><div class="muted small">${r[0]}</div><b>${esc(r[1])}</b></div>`).join('')}</div>
      <div class="cert mb" style="background:var(--soft)"><div class="lbl">≡ Short Summary</div><p style="margin-top:6px">${esc(a.summary)}</p></div><div class="cert mb" style="background:var(--soft)"><div class="lbl">📄 Full Description</div><p style="margin-top:6px;line-height:1.6">${esc(a.desc)}</p></div>
      <div class="grid2"><div class="cert row">📎 <b style="flex:1">View Attachment</b>${a.attach ? `<button class="iconbtn" title="View" data-act="attach" data-v="${a.attach}">👁</button>` : '<span class="muted small">None</span>'}</div><div class="cert row">🔗 <span style="flex:1"><b>Official Portal Link</b>${a.link ? `<br><a class="small" style="color:#2563EB" data-act="extlink" data-v="${a.link}">${esc(a.link)}</a>` : ''}</span>${a.link ? '' : '<span class="muted small">None</span>'}</div></div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="annEdit" data-id="${a.id}">✎ Update Announcement</button>`, 'wide'); },
  annEdit: el => { closeModal(); go('adm', 'sa-annform', num(el.dataset.id)); },
  annActive: () => $('#annactive').classList.toggle('on'),
  delAnn: el => ask('Delete Announcement', '<p>Delete this announcement? It will be removed from student dashboards.</p>', 'Delete', () => { S.announcements = S.announcements.filter(x => x.id !== num(el.dataset.id)); render(); toast('Announcement deleted'); }),
  saveAnn: () => { const form = $('#annform');
    let ok = requireFields(form, ['title', 'cat', 'summary', 'desc'], { title: 'Please enter title', cat: 'Please select category', summary: 'Please enter short summary', desc: 'Please enter full description' });
    const d = formData(form), err = (n, m) => { form.querySelector(`[data-err="${n}"]`).textContent = '⚠ ' + m; ok = false; };
    if (d.summary.length > 100) err('summary', 'Maximum 100 characters'); if (d.desc.length > 500) err('desc', 'Maximum 500 characters');
    if (d.link && !/^https?:\/\/[^\s.]+\.\S+$/i.test(d.link)) err('link', 'Enter a valid link starting with https://');
    if (!ok) return toast('Please fill the required fields', 1);
    const id = num(form.dataset.id), prev = id ? S.announcements.find(x => x.id === id) : null, active = $('#annactive').classList.contains('on');
    const rec = { title: d.title, cat: d.cat, summary: d.summary, desc: d.desc, link: d.link ? d.link.replace(/^https?:\/\//i, '') : null, expiry: d.expiry ? d.expiry.split('-').reverse().join('/') : 'N/A', status: active ? 'Published' : 'Draft',
      published: prev && prev.published !== '—' ? prev.published : active ? today : '—', by: prev ? prev.by : ROLES.admin.person, attach: prev?.attach || (form.querySelector('.drop')?.textContent.includes('Uploaded') ? 'Announcement_Attachment.pdf' : null) };
    if (prev) Object.assign(prev, rec); else S.announcements.unshift({ id: Date.now(), ...rec });
    go('adm', 'sa-ann'); toast(prev ? 'Announcement updated' : active ? 'Announcement added and published to students' : 'Announcement added as inactive'); },
  // education dashboard analytics
  dshForm: el => { const id = num(el.dataset.id), x = S.dashboards.find(d => d.id === id) || {}; DS = { id, img: id ? '📊' : '' };
    openModal(id ? 'Update Education Dashboard' : 'Add Education Dashboard', `<div class="grid2"><div>${field('Dashboard Title', 'title', x.title || '', { req: 1, ph: 'Enter dashboard title' })}${field('Redirect URL', 'url', x.url || '', { req: 1, ph: 'https://example.com/dashboard' })}${field('Description', 'desc', x.desc || '', { req: 1, area: 1, ph: 'Enter dashboard description' })}${counter('desc', 500, x.desc || '')}</div>
      <div class="field"><label>Dashboard Thumbnail / Image</label>${uploadCircle('dshImg', 'Upload dashboard image', '.jpeg, .jpg, .png, .gif, .bmp, .webp, .tiff, .svg, .ico', '8 MB', DS.img)}</div></div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="dshSave">💾 ${id ? 'Update' : 'Add'} Dashboard</button>`, 'wide'); },
  dshImg: el => { DS.img = '📊'; el.closest('.upcircle-wrap').outerHTML = uploadCircle('dshImg', 'Upload dashboard image', '.jpeg, .jpg, .png, .gif, .bmp, .webp, .tiff, .svg, .ico', '8 MB', DS.img); },
  dshSave: () => { const s = scope(); if (!requireFields(s, ['title', 'url', 'desc'], { title: 'Please enter dashboard title', url: 'Please enter redirect URL', desc: 'Please enter description' })) return;
    const f = formData(s); if (!/^https:\/\/[^\s.]+\.\S+$/i.test(f.url)) { s.querySelector('[data-err="url"]').textContent = '⚠ Enter a valid URL starting with https://'; return; }
    if (f.desc.length > 500) { s.querySelector('[data-err="desc"]').textContent = '⚠ Maximum 500 characters'; return; }
    const x = S.dashboards.find(d => d.id === DS.id);
    if (x) Object.assign(x, { title: f.title, url: f.url, desc: f.desc }); else S.dashboards.unshift({ id: Date.now(), title: f.title, url: f.url, desc: f.desc, c: ['#2563EB', '#7C3AED', '#0F766E', '#EA580C'][S.dashboards.length % 4] });
    closeModal(); render(); toast(x ? 'Dashboard updated' : 'Dashboard added'); },
  dshDel: el => ask('Delete Dashboard', '<p>Delete this dashboard link?</p>', 'Delete', () => { S.dashboards = S.dashboards.filter(d => d.id !== num(el.dataset.id)); render(); toast('Dashboard deleted'); }),
  dshOpen: () => toast('The dashboard opens in a new tab — outside the prototype'),
  liveSearch: () => {},
  recordPunch: el => { const x = S.register.find(r => r.enr === el.dataset.enr), k = el.dataset.v;
    ask(`Record Punch ${k === 'in' ? 'In' : 'Out'} · ${x.name}`, `${field('Time', 't', k === 'in' ? '09:30' : '16:45', { req: 1, type: 'time' })}${field('Reason', 'r', '', { req: 1, ph: 'e.g. App could not detect the face' })}`, 'Save', s => { if (!requireFields(s, ['t', 'r'])) return false;
      const [h, m] = formData(s).t.split(':'); const tm = `${String(h % 12 || 12).padStart(2, '0')}:${m} ${h < 12 ? 'AM' : 'PM'}`; x[k] = tm; if (k === 'in') x.status = 'Present'; render(); toast('Punch recorded'); }); },
  helpline: () => openModal('Student Helpline', `<div class="cert mb row" style="gap:16px"><span style="font-size:2rem">☎</span><div><div class="muted small">Toll-free · Monday to Saturday, 9:00 AM – 6:00 PM</div><b style="font-size:1.4rem;color:var(--navy)">1800 233 5500</b></div></div>
      <div class="cert mb row" style="gap:16px"><span style="font-size:1.6rem">✉</span><div><div class="muted small">Email support · reply within 2 working days</div><b>helpdesk@usk.example</b></div></div>
      <div class="infobox small">For profile, attendance or division issues, contact your college Student Admin first.</div>`, '<button class="btn ghost" data-act="closeModal">✕ Close</button>'),
  // ---------------- Principal: staff attendance (recording 13)
  pdDate: el => { if (!el.value || el.value > iso(TODAY)) return toast('Select a date up to today', 1); S.pd.date = el.value; render(); },
  pdReset: () => { S.pd.date = iso(TODAY); render(); },
  pdTrend: el => { S.pd.trend = num(el.dataset.v); render(); },
  pdDept: el => { S.pdDept = { dp: el.dataset.v, q: '' }; openModal(`${esc(el.dataset.v)} - Attendance Details`, deptModalBody(), '', 'xl'); },
  pdDeptQ: () => { S.pdDept.q = scope().querySelector('[name="pdq"]').value.trim(); S.modal.body = deptModalBody(); renderModal(); },
  shiftForm: el => { const x = S.shifts.find(s => s.id === num(el.dataset.id)) || {}, names = ['Morning Shift', 'Evening Shift', 'General Shift', 'Night Shift'];
    openModal(x.id ? 'Edit Shift' : 'Add New Shift', `<div class="grid2">${field('Shift Name', 'name', x.name || '', { req: 1, options: x.name && !names.includes(x.name) ? [x.name, ...names] : names, ph: 'Select shift name' })}${field('Start Time', 'start', x.start || '', { req: 1, type: 'time' })}${field('End Time', 'end', x.end || '', { req: 1, type: 'time' })}${field('Early Going Threshold (Minutes)', 'early', x.early ?? '', { req: 1, type: 'number', ph: 'Enter early going threshold (in minutes)' })}${field('Half Day (Hours)', 'half', x.half ?? '', { req: 1, type: 'number', ph: 'Enter half day (in hours)' })}${field('Late Coming Threshold (Minutes)', 'late', x.late ?? '', { req: 1, type: 'number', ph: 'Enter late coming threshold (in minutes)' })}</div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn" data-act="shiftSave" data-id="${x.id || ''}">＋ ${x.id ? 'Update' : 'Add'} Shift</button>`, 'wide'); },
  shiftSave: el => { const s = scope(), id = num(el.dataset.id);
    if (!requireFields(s, ['name', 'start', 'end', 'early', 'half', 'late'], { name: 'Please select shift name', start: 'Please select time', end: 'Please select end time', early: 'Please enter early going threshold', half: 'Please enter half day hours', late: 'Please enter late coming threshold' })) return;
    const d = formData(s), err = (n, m) => { s.querySelector(`[data-err="${n}"]`).textContent = '⚠ ' + m; return false; }, full = toMin(d.end) - toMin(d.start);
    if (S.shifts.some(x => x.name === d.name && x.id !== id)) return err('name', 'This shift already exists');
    if (full <= 0) return err('end', 'End time must be after start time');
    if (+d.half <= 0 || +d.half * 60 >= full) return err('half', `Half day must be less than the full day (${dur(full)})`);
    if (+d.late < 0 || +d.late > 120) return err('late', 'Enter 0 to 120 minutes'); if (+d.early < 0 || +d.early > 120) return err('early', 'Enter 0 to 120 minutes');
    const rec = { name: d.name, start: d.start, end: d.end, half: +d.half, late: +d.late, early: +d.early };
    if (id) Object.assign(S.shifts.find(x => x.id === id), rec); else S.shifts.push({ id: Date.now(), ...rec }); closeModal(); render(); toast(id ? 'Shift Updated — Shift successfully updated' : 'Shift Added — Shift successfully added'); },
  shiftDel: el => { const x = S.shifts.find(s => s.id === num(el.dataset.id)), n = new Set(S.shiftAssign.filter(a => a.shiftId === x.id).flatMap(a => a.staff)).size;
    if (n) return toast(`${x.name} is assigned to ${n} staff. Reassign them before deleting.`, 1);
    ask('Delete Shift', `<p>Delete <b>${esc(x.name)}</b>?</p>`, 'Delete', () => { S.shifts = S.shifts.filter(s => s !== x); render(); toast('Shift Deleted — Shift successfully deleted'); }); },
  asgField: el => { S.asg[el.name] = el.value; render(); },
  asgWo: el => { const v = el.dataset.v, G = S.asg; G.wo = G.wo.includes(v) ? G.wo.filter(x => x !== v) : [...G.wo, v]; const y = window.scrollY; render(); window.scrollTo(0, y); },
  asgWoPreset: el => { const sun = [1, 2, 3, 4, 5].map(w => w + '-7'); S.asg.wo = el.dataset.v === 'sun' ? sun : el.dataset.v === 'sun24' ? [...sun, '2-6', '4-6'] : []; const y = window.scrollY; render(); window.scrollTo(0, y); },
  asgFilt: el => { S.asg[el.name === 'adept' ? 'dept' : 'desig'] = el.value; render(); },
  asgFiltReset: () => { S.asg.dept = S.asg.desig = ''; render(); },
  asgAdd: el => { S.asg.pick.push(num(el.dataset.id)); render(); },
  asgRm: el => { S.asg.pick = S.asg.pick.filter(i => i !== num(el.dataset.id)); render(); },
  asgAll: () => { const G = S.asg; S.staff.forEach(s => { if (!G.pick.includes(s.id) && (!G.dept || s.dept === G.dept) && (!G.desig || s.desig === G.desig)) G.pick.push(s.id); }); render(); },
  asgNone: () => { S.asg.pick = []; render(); },
  asgSave: () => { const G = S.asg, f = $('#asgform'); let ok = true;
    if (!G.shift) { f.querySelector('[data-err="shift"]').textContent = '⚠ Please select shift'; ok = false; }
    if (!G.from) { f.querySelector('[data-err="from"]').textContent = '⚠ Please select effective from date'; ok = false; }
    if (!ok) { window.scrollTo(0, 0); return toast('Please select a shift.', 1); }
    if (!G.wo.length) return toast('Select at least one week off day', 1); if (!G.pick.length) return toast('Add at least one staff member to assign', 1);
    const sh = S.shifts.find(s => s.name === G.shift), n = G.pick.length, b = $('#asgbtn'); b.disabled = true; b.textContent = '⟳ Assigning...';
    setTimeout(() => { S.shiftAssign.push({ id: Date.now(), shiftId: sh.id, from: G.from, wo: [...G.wo], staff: [...G.pick] }); S.asg = { shift: '', from: '', wo: [], pick: [], dept: '', desig: '' }; render(); window.scrollTo(0, 0);
      toast(`Shift Assigned — ${sh.name} assigned to ${n} staff from ${dmy(dOf(G.from))}`); }, 700); },
  schedWk: el => { const v = num(el.dataset.v), d = v ? dOf(S.schedWeek) : new Date(TODAY); if (!v) d.setDate(d.getDate() - (d.getDay() + 6) % 7); else d.setDate(d.getDate() + v); S.schedWeek = iso(d); render(); },
  spPunch: el => { const s = S.staff.find(x => x.id === num(el.dataset.id)), out = el.dataset.v === 'out';
    openModal(`Punch ${out ? 'Out' : 'In'} Attendance <i style="font-weight:400">( ${esc(s.name)} )</i>`, `<div class="grid2">${field(`Punch ${out ? 'Out' : 'In'} Date`, 'pd', S.af.srec.date, { req: 1, type: 'date', ro: 1 })}${field(`Punch ${out ? 'Out' : 'In'} Time`, 'pt', '', { req: 1, type: 'time' })}</div>${field('Reason', 'reason', '', { req: 1, ph: 'e.g. Face not detected in the mobile app' })}`,
      `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn" id="punchbtn" data-act="spPunchSave" data-id="${s.id}" data-v="${el.dataset.v}">⎆ Punch ${out ? 'Out' : 'In'}</button>`); },
  spPunchSave: el => { const sc = scope(); if (!requireFields(sc, ['pt', 'reason'], { pt: 'Please select time', reason: 'Please enter reason' })) return;
    const s = S.staff.find(x => x.id === num(el.dataset.id)), date = S.af.srec.date, out = el.dataset.v === 'out', [h, m] = formData(sc).pt.split(':').map(Number), mins = h * 60 + m, tx = [...stfDay(s, dOf(date)).tx], last = tx[tx.length - 1];
    if (last && mins <= last[1]) { sc.querySelector('[data-err="pt"]').textContent = `⚠ Time must be after the last punch (${hm(last[1])})`; return; }
    el.disabled = true; el.textContent = `⟳ Punching ${out ? 'Out' : 'In'}...`;
    setTimeout(() => { tx.push([out ? 'Punch Out' : 'Punch In', mins, 'web']); S.spunch[s.id + '|' + date] = tx; closeModal(); render(); toast(`${s.name} punched ${out ? 'out' : 'in'} at ${hm(mins)}`); }, 700); },
  spTx: el => { const s = S.staff.find(x => x.id === num(el.dataset.id)), d = dOf(S.af.srec.date), a = stfDay(s, d), w = txMins(a.tx);
    openModal(`Transaction History <i style="font-weight:400">(${dmy(d, '-')})</i>`, `<div class="txwrap"><div style="flex:1">${a.tx.length ? `<div class="tline">${a.tx.map((t, i) => `<div class="ti"><span class="dot"></span><span class="nbox">${pad2(i + 1)}</span><span class="muted">${t[0]} :</span> <b>${hm(t[1])}</b> <span class="tag">${t[2] === 'web' ? '🖥 Web' : '📱 App'}</span></div>`).join('')}</div>` : `<div class="empty">No transaction records found.${isWork(a) ? '' : `<br><small>${a.status}${a.name ? ' · ' + esc(a.name) : ''}</small>`}</div>`}</div>
      <div class="cert center" style="min-width:170px;align-self:flex-start"><div class="muted small">Total Time</div><b style="font-size:1.5rem;color:var(--navy)">${w ? dur(w) : '—'}</b></div></div><div class="muted small mt">${esc(s.name)} · ${esc(s.dept)} · ${a.shift}</div>`, '', 'wide'); },
  spSum: el => { const s = S.staff.find(x => x.id === num(el.dataset.id)), f = S.af.srpt, r = stfRange(s, dOf(f.from), dOf(f.to));
    const t = (ic, c, n, l) => `<div class="sumtile" style="background:${c}14;border-color:${c}55"><span style="color:${c}">${ic}</span><b>${n}</b><small>${l}</small></div>`;
    openModal('Attendance Summary', `<div class="cert row mb" style="gap:24px;flex-wrap:wrap">${ava(s.name)}<b>${esc(s.name)}</b><div><div class="muted small">Department</div>${esc(s.dept)}</div><div><div class="muted small">Designation</div>${esc(s.desig)}</div><div><div class="muted small">Date Range</div>${dmy(dOf(f.from))} – ${dmy(dOf(f.to))}</div></div>
      <div class="lbl mb">Attendance Overview</div><div class="sumgrid mb">${t('🗓', '#2563EB', r.work, 'Working Days')}${t('✓', '#16A34A', r.present, 'Present Days')}${t('✕', '#DC2626', r.absent, 'Absent Days')}${t('⏰', '#D97706', r.late, 'Late Marks')}${t('⇥', '#0D9488', r.early, 'Early Outs')}${t('🎉', '#2563EB', r.hol, 'Holidays')}${t('☾', '#7C3AED', r.wo, 'Week Offs')}</div>
      <div class="lbl mb">Working Summary</div><div class="cert row" style="justify-content:space-between;flex-wrap:wrap"><span>Working Hours : <b>${hhmm(r.mins)}</b></span><span>Overtime Hours : <b>${hhmm(r.ot)}</b></span><span>Expected Hours : <b>${hhmm(r.exp)}</b></span>${r.leave ? `<span>On Leave : <b>${r.leave} day(s)</b></span>` : ''}</div>`, '<button class="btn ghost" data-act="closeModal">✕ Close</button>', 'xl'); },
  prExport: el => { const k = el.dataset.k, lines = []; let name;
    if (k === 'srec') { const f = S.af.srec, d = dOf(f.date); name = `staff_attendance_records_${f.date}.csv`; lines.push(['Sr No.', 'Name', 'Department', 'Designation', 'Shift Type', 'Punch In', 'Punch Out', 'Status', 'Transaction Times', 'Total Time']);
      stfFilter(f).forEach((s, i) => { const a = stfDay(s, d), o = a.tx[a.tx.length - 1]; lines.push([i + 1, s.name, s.dept, s.desig, a.shift, a.tx.length ? hm(a.tx[0][1]) : '-', o && o[0] === 'Punch Out' ? hm(o[1]) : '-', a.status, a.tx.length, hms(txMins(a.tx))]); }); }
    else if (k === 'srpt') { const f = S.af.srpt; name = `staff_attendance_report_${f.from}_${f.to}.csv`; lines.push(['Sr No.', 'Name', 'Department', 'Designation', 'Working Day', 'Present Day', 'Absent Day', 'Late Marks', 'Working Hours', 'Overtime Hours']);
      stfFilter(f).forEach((s, i) => { const r = stfRange(s, dOf(f.from), dOf(f.to)); lines.push([i + 1, s.name, s.dept, s.desig, r.work, r.present, r.absent, r.late, hhmm(r.mins), hhmm(r.ot)]); }); }
    else { name = 'academic_holiday_calendar_2026.csv'; lines.push(['Holiday Name', 'Holiday Date', 'Day']); [...S.holidays].sort((a, b) => a.date.localeCompare(b.date)).forEach(h => lines.push([h.name, dmy(dOf(h.date)), DAYS[dOf(h.date).getDay()]])); }
    const blob = new Blob([lines.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n')], { type: 'text/csv' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('File downloaded · ' + name); },
  editWorkflow: () => { const opts = ['Principal', 'HOD', 'Registrar', 'Vice Principal'];
    ask('Edit Leave Approval Workflow', `<p class="muted mb">Choose the approver for each stage. Leave requests move through stages in order.</p>${[0, 1, 2].map(i => field('Stage ' + (i + 1) + ' Approver', 'st' + i, S.workflow[i] || '', { options: opts, ph: i ? 'No further stage' : 'Select approver', req: !i })).join('')}`, 'Submit',
      s => { if (!requireFields(s, ['st0'])) return false; const d = formData(s); S.workflow = [d.st0, d.st1, d.st2].filter(Boolean); render(); toast('Workflow updated'); }); },
  // staff holiday calendar (read only)
  sthView: el => { S.sthView = el.dataset.v; render(); },
  sthWhen: el => { S.sthWhen = el.dataset.v; S.pg.sthol = 0; render(); },
  sthMonth: el => { const v = num(el.dataset.v), m = S.sthMonth || { y: TODAY.getFullYear(), m: TODAY.getMonth() }; S.sthMonth = v ? ym(m.y, m.m + v) : { y: TODAY.getFullYear(), m: TODAY.getMonth() }; render(); },
  phForm: el => { const id = num(el.dataset.id), h = S.holidays.find(x => x.id === id) || {};
    openModal(id ? 'Edit Holiday' : 'Add Holiday', `<div class="grid2">${field('Holiday Name', 'name', h.name || '', { req: 1, ph: 'Enter holiday name' })}${field('Holiday Date', 'date', h.date || '', { req: 1, type: 'date' })}</div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="phSave" data-id="${id || ''}">💾 ${id ? 'Update' : 'Add'} Holiday</button>`); },
  phSave: el => { const s = scope(), id = num(el.dataset.id); if (!requireFields(s, ['name', 'date'], { name: 'Please enter holiday name', date: 'Please select holiday date' })) return; const d = formData(s);
    if (S.holidays.some(h => h.date === d.date && h.id !== id)) { s.querySelector('[data-err="date"]').textContent = '⚠ A holiday already exists on this date'; return; }
    if (id) Object.assign(S.holidays.find(h => h.id === id), d); else S.holidays.push({ id: Date.now(), ...d }); closeModal(); render(); toast(id ? 'Holiday Updated — Holiday updated successfully' : 'Holiday Added — Holiday added successfully'); },
  phDel: el => { const h = S.holidays.find(x => x.id === num(el.dataset.id)); ask('Delete Holiday', `<p>Delete <b>${esc(h.name)}</b> (${dmy(dOf(h.date))})? It becomes a working day for staff.</p>`, 'Delete', () => { S.holidays = S.holidays.filter(x => x !== h); render(); toast('Holiday Deleted — Holiday deleted successfully'); }); },
  addPolicy: () => ask('Add Leave Configuration', `<div class="grid2">${field('Leave Type', 'cat', '', { req: 1 })}${field('Leave Code', 'code', '', { req: 1 })}${field('Days Allocated', 'total', '', { req: 1, type: 'number' })}${field('Carry Forward', 'carry', 'No', { options: ['Yes', 'No'] })}${field('Max Carry Forward (days)', 'maxCarry', '—')}${field('Can Be Availed Once', 'once', 'No', { options: ['Yes', 'No'] })}</div>`, 'Add Leave Configuration',
    s => { if (!requireFields(s, ['cat', 'code', 'total'])) return false; const d = formData(s); S.leavePolicy.push({ ...d, total: Number(d.total) }); S.staff.forEach(x => delete x.bal); render(); toast('Leave type added'); }, 'wide'),
  delPolicy: el => { S.leavePolicy.splice(num(el.dataset.i), 1); S.staff.forEach(x => delete x.bal); render(); toast('Leave type removed'); },
  leaveDetail: el => { const l = S.leaveRequests.find(x => x.id === num(el.dataset.id));
    openModal('Leave Request Details', `<div class="grid4 mb">${[['Leave Type', l.type], ['Leave Duration', l.dur], ['Start Date', l.from], ['End Date', l.to], ['Applied Days', l.days], ['Applied Date', l.applied], ['Department', l.dept], ['Status', st(l.status)]].map(r => `<div><div class="lbl">${r[0]}</div><div class="val" style="font-size:1rem">${r[1]}</div></div>`).join('')}</div><div class="lbl">Leave Reason</div><p class="mb" style="margin-top:6px">${l.reason}</p><div class="infobox small">Approval stages: ${S.workflow.join(' → ')}. ${l.status === 'Pending' ? 'Pending with you.' : ''}</div>`,
      l.status === 'Pending' ? `<button class="btn red" data-act="leaveDecide" data-id="${l.id}" data-v="Rejected">Reject</button><button class="btn green" data-act="leaveDecide" data-id="${l.id}" data-v="Approved">Approve</button>` : '<button class="btn" data-act="closeModal">Close</button>', 'wide'); },
  leaveDecide: el => { const l = S.leaveRequests.find(x => x.id === num(el.dataset.id)); l.status = el.dataset.v; closeModal(); render(); toast('Leave ' + el.dataset.v.toLowerCase()); },
  editAlloc: el => { const x = S.staff.find(s => s.id === num(el.dataset.id));
    ask('Update Leave Allocation · ' + x.name, `<p class="muted mb">${x.dept} · ${x.desig}</p><div class="grid3">${S.leavePolicy.map((p, j) => field(p.cat, 'b' + j, x.bal[j], { type: 'number' })).join('')}</div>`, 'Update', s => { const d = formData(s); x.bal = S.leavePolicy.map((p, j) => Number(d['b' + j])); render(); toast('Leave balance updated'); }, 'wide'); },
  // Institute location: fields and the map stay in a draft (S.locDraft) until Save Location
  locField: el => { const L = S.locDraft ||= { ...S.location }, v = el.value.trim(); if (v === '' || isNaN(v)) return; L[el.name] = +v; locRender(); },
  locPick: (el, e) => { const p = el.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(el.getScreenCTM().inverse()), L = S.locDraft ||= { ...S.location };
    L.lat = +(MAP0.lat - (q.y - 210) / MAPK).toFixed(6); L.lng = +(MAP0.lng + (q.x - 400) / MAPK).toFixed(6); locRender(); },
  locSearch: () => { const q = ($('[name="locq"]').value || '').toLowerCase().trim(), P = { 'l.d. college': [23.0350, 72.5465], 'ldce': [23.0350, 72.5465], 'navrangpura': [23.0395, 72.5440], 'gujarat university': [23.0386, 72.5520], 'ambawadi': [23.0270, 72.5420] };
    if (!q) return toast('Enter a location to search', 1); const hit = Object.keys(P).find(k => k.includes(q) || q.includes(k)); if (!hit) return toast('Location not found. Try Navrangpura, Gujarat University or Ambawadi.', 1);
    const L = S.locDraft ||= { ...S.location }; [L.lat, L.lng] = P[hit]; locRender(); toast('Location selected — latitude and longitude updated'); },
  saveLocation: () => { const m = $('.amain'), d = formData(m); let ok = true; const err = (n, t) => { m.querySelector(`[data-err="${n}"]`).textContent = t ? '⚠ ' + t : ''; if (t) ok = false; };
    err('lat', d.lat === '' || isNaN(d.lat) || Math.abs(d.lat) > 90 ? 'Please enter a valid latitude' : ''); err('lng', d.lng === '' || isNaN(d.lng) || Math.abs(d.lng) > 180 ? 'Please enter a valid longitude' : '');
    err('radius', !d.radius ? 'Please enter geofencing radius' : +d.radius < 80 ? 'Minimum radius is 80 meters' : +d.radius > 5000 ? 'Maximum radius is 5000 meters' : '');
    if (!ok) return toast('Please correct the highlighted fields', 1);
    Object.assign(S.location, { lat: +d.lat, lng: +d.lng, radius: +d.radius }); S.locDraft = null; render(); toast(`Location Saved — saved successfully · geofence ${S.location.radius} m`); },
  applyLeave: () => ask('Apply Leave', `<p class="muted mb">Submit your leave request and track approval status easily.</p><div class="grid2">${field('Start Date', 'from', '', { req: 1, type: 'date' })}${field('End Date', 'to', '', { req: 1, type: 'date' })}${field('Leave Type', 'type', '', { req: 1, options: S.leavePolicy.map(p => p.cat) })}${field('Leave Duration', 'dur', 'Full Day', { req: 1, options: ['Full Day', 'First Half', 'Second Half'] })}</div>${field('Reason', 'reason', '', { req: 1, area: 1 })}<div class="field"><label>Upload Document</label><div class="drop" data-act="fakeUpload"><span style="font-size:1.6rem">⬆</span><div><b>Drag &amp; drop your file</b><div class="small">PDF, DOC, DOCX, JPG, PNG · Max 5 MB</div></div></div></div>`, 'Apply Leave',
    s => { if (!requireFields(s, ['from', 'to', 'type', 'reason'])) return false; const d = formData(s), days = Math.max(1, (new Date(d.to) - new Date(d.from)) / 864e5 + 1) * (d.dur === 'Full Day' ? 1 : .5);
      S.myLeaves.unshift({ type: d.type, dur: d.dur, from: d.from.split('-').reverse().join('/'), to: d.to.split('-').reverse().join('/'), days, applied: today, status: 'Pending' });
      S.leaveRequests.unshift({ id: Date.now(), name: ROLES.staff.person, dept: 'Computer Engineering', desig: 'Associate Professor', type: d.type, dur: d.dur, days, from: d.from.split('-').reverse().join('/'), to: d.to.split('-').reverse().join('/'), applied: today, status: 'Pending', reason: d.reason });
      go('adm', 'st-leaves'); toast('Leave request submitted'); }, 'wide'),
  withdrawLeave: el => { S.myLeaves[num(el.dataset.i)].status = 'Withdrawn'; render(); toast('Leave request withdrawn'); },
  // Skill Master (recording 11)
  skillCat: el => { const c = S.skillMaster.find(x => x.id === num(el.dataset.id)) || { subs: [] }; S.tmpSubs = c.subs.slice(); S.tmpCat = c.id || null;
    openModal(c.id ? 'Edit Student Skill' : 'Add Student Skill', `<div class="grid2">${field('Skill', 'name', c.name || '', { req: 1, ph: 'Enter skill name' })}<div class="field"><label>Sub Skill</label><div class="row" style="gap:0;flex-wrap:nowrap"><input class="inp" id="subin" name="subin" placeholder="Enter sub skill name" style="border-radius:4px 0 0 10px"><button type="button" class="btn" style="border-radius:0 10px 10px 0;flex:none" data-act="addSub">＋ Add</button></div><div class="ferr" data-err="subin"></div></div></div>
      <div class="lbl">Sub Skills Added:</div><div id="sublist" style="margin:8px 0 16px;max-height:180px;overflow-y:auto">${subChips()}</div><div class="infobox small">ⓘ You can add multiple skill under the selected category</div>`,
      `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn" data-act="skillSave">💾 ${c.id ? 'Update' : 'Add'} Skill</button>`, 'wide'); },
  addSub: () => { const i = $('#subin'), v = i.value.trim(), er = scope().querySelector('[data-err="subin"]');
    er.textContent = !v ? '⚠ Please enter sub skill name' : S.tmpSubs.some(x => x.toLowerCase() === v.toLowerCase()) ? '⚠ This sub skill is already added' : '';
    if (er.textContent) return i.focus(); S.tmpSubs.push(v); i.value = ''; $('#sublist').innerHTML = subChips(); i.focus(); },
  delSub: el => { const [v] = S.tmpSubs.splice(num(el.dataset.i), 1); $('#sublist').innerHTML = subChips(); toast(`Removed — "${v}" removed successfully`); },
  skillSave: () => { const s = scope(); if (!requireFields(s, ['name'], { name: 'Please enter skill name' })) return; const name = formData(s).name;
    if (S.skillMaster.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== S.tmpCat)) { s.querySelector('[data-err="name"]').textContent = '⚠ This skill category already exists'; return; }
    if (!S.tmpSubs.length) return toast('Sub Skill Required — add at least one sub skill', 1);
    const c = S.skillMaster.find(x => x.id === S.tmpCat);
    if (c) Object.assign(c, { name, subs: S.tmpSubs }); else S.skillMaster.push({ id: Date.now(), name, subs: S.tmpSubs });
    closeModal(); render(); toast(c ? 'Updated — Skill updated successfully' : 'Added — Skill added successfully'); },
  rmSkill: el => { const c = S.skillMaster.find(x => x.id === num(el.dataset.id)), [v] = c.subs.splice(num(el.dataset.i), 1); render(); toast(`Removed — "${v}" removed successfully`); },
  delSkillCat: el => { const c = S.skillMaster.find(x => x.id === num(el.dataset.id));
    ask('Delete Skill Category', `<p>Delete <b>${esc(c.name)}</b> and all its sub skills? Students can no longer pick them for new certificates.</p>`, 'Delete', () => { S.skillMaster = S.skillMaster.filter(x => x !== c); render(); toast(`Deleted — "${c.name}" category deleted successfully`); }); },
  // Job-Oriented Skill Master (recording 14); S.tmpSubs holds the skills queued in the Add pop-up
  jsAdd: () => { S.tmpSubs = [];
    openModal('Add Job-Oriented Skill', `<div class="field"><label>Skill Name</label><div class="row" style="gap:0;flex-wrap:nowrap"><input class="inp" id="subin" name="subin" placeholder="Enter skill name" style="border-radius:4px 0 0 10px"><button type="button" class="btn" style="border-radius:0 10px 10px 0;flex:none" data-act="addSub">＋ Add</button></div><div class="ferr" data-err="subin"></div></div>
      <div class="lbl">Skills Added:</div><div id="sublist" style="margin:8px 0 16px;max-height:180px;overflow-y:auto">${subChips()}</div><div class="infobox small">ⓘ You can add multiple skills at once</div>`,
      '<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="jsSave">💾 Add Skill</button>', '', 'Add one or more job-oriented skills to the skill master.'); },
  jsSave: () => { const i = $('#subin'); if (i.value.trim()) ACT.addSub(); if (scope().querySelector('[data-err="subin"]').textContent && i.value.trim()) return;
    if (!S.tmpSubs.length) { scope().querySelector('[data-err="subin"]').textContent = '⚠ Please add at least one skill'; return; }
    const have = new Set(S.jobSkills.map(x => x.toLowerCase())), dup = S.tmpSubs.filter(x => have.has(x.toLowerCase()));
    if (dup.length) { scope().querySelector('[data-err="subin"]').textContent = `⚠ Already in the skill master: ${dup.join(', ')}. Remove ${dup.length > 1 ? 'them' : 'it'} to continue.`; return; }
    S.jobSkills.push(...S.tmpSubs); const n = S.tmpSubs.length; closeModal(); render(); toast(`Added — ${n > 1 ? n + ' Job-Oriented Skills' : 'Job-Oriented Skill'} added successfully`); },
  jsEdit: el => { const v = el.dataset.v; S.jsEditing = v;
    openModal('Edit Job-Oriented Skill', field('Skill Name', 'name', v, { req: 1, ph: 'Enter skill name' }), '<button class="btn ghost" data-act="closeModal">✕ Close</button><button class="btn" data-act="jsUpdate">💾 Update Skill</button>', '', 'Update the job-oriented skill name and save the changes.'); },
  jsUpdate: () => { const s = scope(); if (!requireFields(s, ['name'], { name: 'Please enter skill name' })) return; const name = formData(s).name, old = S.jsEditing;
    if (S.jobSkills.some(x => x !== old && x.toLowerCase() === name.toLowerCase())) { s.querySelector('[data-err="name"]').textContent = '⚠ This skill already exists'; return; }
    S.jobSkills = S.jobSkills.map(x => x === old ? name : x); S.student.skills = S.student.skills.map(x => x === old ? name : x);   // students keep the renamed skill
    closeModal(); render(); toast('Updated — Job-Oriented Skill updated successfully'); },
  jsDel: el => { const v = el.dataset.v;
    openModal('', `<div class="center"><div class="alert-ic">!</div><h2 style="font-size:1.4rem;margin:16px 0 8px">Delete Job-Oriented Skill</h2><p class="muted">Are you sure you want to delete "${esc(v)}"?</p></div>`, `<button class="btn" data-act="jsDelOk" data-v="${esc(v)}">Delete</button><button class="btn ghost" data-act="closeModal">Cancel</button>`, 'alert'); },
  jsDelOk: el => { S.jobSkills = S.jobSkills.filter(x => x !== el.dataset.v); closeModal(); render(); toast('Deleted — Job-Oriented Skill deleted successfully'); },
  // Student Skill Achievements
  achFilterToggle: () => { S.afOpen.ach = S.afOpen.ach === false; render(); },
  achRow: el => { S.achOpen = S.achOpen === el.dataset.v ? null : el.dataset.v; render(); },
  achView: el => { const a = DATA.achievements.find(x => x.id === num(el.dataset.id)), box = (l, v) => `<div class="cert"><div class="muted small" style="text-transform:uppercase;font-size:.7rem;letter-spacing:.5px">${l}</div><b style="color:var(--navy)">${esc(v)}</b></div>`;
    openModal('Student Skill Details', `<div class="cert mb"><div class="row"><b style="font-size:1.1rem;color:var(--navy)">👤 ${esc(a.student)}</b><span class="sp"></span><span class="tag">${a.sem}</span></div><div class="small mt"><span class="muted">INSTITUTE :</span> ${esc(a.inst)}</div><div class="small"><span class="muted">PROGRAM &amp; BRANCH :</span> ${a.deg} — ${a.branch}</div></div>
      <div class="lbl mb" style="color:var(--navy)">🏅 SKILL &amp; CERTIFICATE DETAILS</div>
      <div class="cert mb row" style="justify-content:space-between"><div><div class="muted small">SKILL NAME</div><b style="font-size:1.2rem;color:var(--navy)">${esc(a.skill)}</b><div class="small" style="color:#2563EB">${esc(a.cat)}</div></div><div style="text-align:right"><div class="muted small">SKILL LEVEL</div><b style="font-size:1.2rem;color:var(--navy)">${a.level}</b></div></div>
      <div class="grid2 mb">${box('Certificate Name', a.title)}${box('Certificate ID', a.certNo)}</div><div class="mb">${box('Organization Name', a.org)}</div><div class="grid2 mb">${box('Issued Date', a.date)}${box('Expiry Date', a.expiry === '—' ? 'No expiry' : a.expiry)}</div><div class="mb">${box('Description', a.desc)}</div>
      <div class="cert row"><span style="font-size:1.4rem">📄</span><div style="flex:1;min-width:0"><div class="muted small">CERTIFICATE ATTACHMENT</div><b style="word-break:break-all">${esc(a.file)}</b></div><button class="btn sm" title="View Document" data-act="attach" data-v="${esc(a.file)}">👁</button></div>`, '', 'wide'); },
  achFilter: () => { const d = formData($('.filterbar')); S.filters.skl = d.skl; S.filters.lvl = d.lvl; render(); },
  achReset: () => { S.filters.skl = S.filters.lvl = ''; render(); },
  viewCertAdmin: el => openModal('Certificate', `<div class="pdf-bg"><div class="sheet center" style="width:600px;border:8px double var(--gold)"><div class="kicker">Certificate</div><h2 class="h-font" style="margin:16px 0">${el.dataset.v}</h2><p class="muted">Uploaded by the student · verified by the Skill Passport Nodal Officer</p></div></div>`, '<button class="btn" data-act="closeModal">Close</button>', 'wide'),
  schDecide: el => { const a = S.schApps.find(x => x.id === el.dataset.id); const fin = () => { a.status = el.dataset.v; go('adm', 'so-apps'); toast('Application ' + el.dataset.v.toLowerCase()); };
    if (el.dataset.v === 'Approved') fin(); else ask('Reject Application', field('Reason for rejection', 'r', '', { req: 1, area: 1 }), 'Reject', s => { if (!requireFields(s, ['r'])) return false; setTimeout(fin); }); },
  // ---------------- Placement Coordinator: companies (recording 12)
  coStatus: el => { S.menu = null; const c = S.companies.find(x => x.id === num(el.dataset.id)), v = el.dataset.v; render();
    if (v === c.status) return;
    if (c.status === 'Blacklisted') return toast('COMPANY_BLACKLISTED_CANNOT_CHANGE — a blacklisted company cannot be reactivated', 1);
    const msg = { Active: ['Mark Company Active', `Are you sure you want to mark ${esc(c.name)} as active? The company will be able to log in and manage job postings.`, 'Active'], Inactive: ['Mark Company Inactive', `Are you sure you want to mark ${esc(c.name)} as inactive? The company will not be able to post new jobs until it is active again.`, 'Inactive'], Blacklisted: ['Blacklist Company', `Are you sure you want to blacklist ${esc(c.name)}? The company will be permanently restricted from the Placement Module and cannot be reactivated.`, 'Blacklisted'] }[v];
    openModal('', `<div class="center"><div class="alert-ic">!</div><h2 style="font-size:1.4rem;margin:16px 0 8px">${msg[0]}</h2><p class="muted">${msg[1]}</p></div>`, `<button class="btn" data-act="coStatusOk" data-id="${c.id}" data-v="${v}">${msg[2]}</button><button class="btn ghost" data-act="closeModal">Cancel</button>`, 'alert'); },
  coStatusOk: el => { const c = S.companies.find(x => x.id === num(el.dataset.id)), v = el.dataset.v;
    if (v !== 'Blacklisted') { c.status = v; closeModal(); render(); return toast(`Updated — Company marked ${v.toLowerCase()} successfully`); }
    openModal('Blacklist Company', `${field('Remark', 'remark', '', { req: 1, area: 1, ph: 'Why is this company being blacklisted?' })}${counter('remark', 500)}`, `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn red" data-act="coBlacklist" data-id="${c.id}">⊘ Blacklist</button>`); },
  coBlacklist: el => { const s = scope(); if (!requireFields(s, ['remark'], { remark: 'Please enter remark' })) return; const r = formData(s).remark;
    if (r.length > 500) { s.querySelector('[data-err="remark"]').textContent = '⚠ Maximum 500 characters'; return; }
    Object.assign(S.companies.find(x => x.id === num(el.dataset.id)), { status: 'Blacklisted', remark: r }); closeModal(); render(); toast('Updated — Company marked blacklisted successfully'); },
  // the add/edit form keeps a draft (S.coDraft) so dynamic rows survive re-renders
  coSync: () => { const f = $('#coform'); if (!f) return; const D = S.coDraft, d = formData(f);
    ['name', 'type', 'sector', 'cat', 'web', 'desc', 'about', 'country', 'state', 'city', 'addr', 'person', 'desig', 'email', 'phone', 'altEmail', 'altPhone'].forEach(k => { if (k in d) D[k] = d[k]; });
    Object.keys(D.ids).forEach((l, i) => { if (('id_' + i) in d) D.ids[l] = d['id_' + i].toUpperCase(); });
    D.branches.forEach((b, i) => ['name', 'country', 'state', 'city', 'addr'].forEach(k => { if (`b${i}${k}` in d) b[k] = d[`b${i}${k}`]; }));
    D.social = D.social.map((u, i) => ('s' + i) in d ? d['s' + i] : u); },
  coRe: () => { const y = window.scrollY; ACT.coSync(); render(); window.scrollTo(0, y); },
  coGeo: el => { ACT.coSync(); const D = S.coDraft, m = el.name.match(/^(b\d+)?(country|state)$/), t = m[1] ? D.branches[num(m[1].slice(1))] : D;
    if (m[2] === 'country') { t.state = ''; t.city = ''; } else t.city = ''; const y = window.scrollY; render(); window.scrollTo(0, y); },
  coMode: el => { ACT.coSync(); S.coDraft.dmode = el.value; const y = window.scrollY; render(); window.scrollTo(0, y); },
  coLogo: () => { ACT.coSync(); const D = S.coDraft, w = (D.name || 'New Company').split(/\s+/); D.logo = 1; D.short = ((w[0][0] || 'N') + (w[1]?.[0] || '')).toUpperCase(); const y = window.scrollY; render(); window.scrollTo(0, y); },
  coCert: () => { ACT.coSync(); S.coDraft.cert = 'Certificate_of_Incorporation.pdf'; ACT.coRe(); },
  coCertDel: () => { ACT.coSync(); S.coDraft.cert = ''; ACT.coRe(); },
  coIdAdd: el => { if (!el.value) return; ACT.coSync(); S.coDraft.ids[el.value] = ''; ACT.coRe(); },
  coIdDel: el => { ACT.coSync(); delete S.coDraft.ids[el.dataset.v]; ACT.coRe(); },
  coBranchAdd: () => { ACT.coSync(); S.coDraft.branches.push({ name: '', country: '', state: '', city: '', addr: '' }); ACT.coRe(); },
  coBranchDel: el => { ACT.coSync(); S.coDraft.branches.splice(num(el.dataset.i), 1); ACT.coRe(); },
  coSocialAdd: () => { ACT.coSync(); S.coDraft.social.push(''); ACT.coRe(); },
  coSocialDel: el => { ACT.coSync(); S.coDraft.social.splice(num(el.dataset.i), 1); ACT.coRe(); },
  coSave: () => { ACT.coSync(); const f = $('#coform'), D = S.coDraft, errs = {}, e = (k, m) => { if (!errs[k]) errs[k] = m; };
    const url = /^https?:\/\/[^\s.]+\.\S+$/i, mail = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, mob = /^[6-9]\d{9}$/;
    if (!D.logo) e('logo', 'Please upload company logo');
    [['name', 'company name'], ['type', 'company type'], ['sector', 'industry sector'], ['cat', 'company category'], ['web', 'company website']].forEach(([k, l]) => { if (!D[k]) e(k, `Please ${['type', 'sector', 'cat'].includes(k) ? 'select' : 'enter'} ${l}`); });
    if (D.web && !url.test(D.web)) e('web', 'Please enter a valid website url');
    if (D.dmode === 'l') { if (!D.about) e('about', 'Please enter about us link'); else if (!url.test(D.about)) e('about', 'Please enter a valid url'); } else if (!D.desc) e('desc', 'Please enter company description');
    if (!D.cert) e('cert', 'Please upload certificate of incorporation');
    Object.keys(D.ids).forEach((l, i) => { if (!D.ids[l]) e('id_' + i, `Please enter ${l.toLowerCase()}`); else if (l === 'Permanent Account Number' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(D.ids[l])) e('id_' + i, 'Enter a valid PAN, e.g. ABCDE1234F'); });
    if (!D.country) e('country', 'Please enter country'); if (!D.state) e('state', 'Please select state'); if (!D.city) e('city', 'Please select city/district'); if (!D.addr) e('addr', 'Please enter head office address');
    D.branches.forEach((b, i) => { if (!b.name) e(`b${i}name`, 'Please enter branch'); if (!b.country) e(`b${i}country`, 'Please select country'); if (!b.state) e(`b${i}state`, 'Please select state'); if (!b.city) e(`b${i}city`, 'Please select city/district'); if (!b.addr) e(`b${i}addr`, 'Please enter office address'); });
    if (!D.person) e('person', 'Please enter contact person name'); if (!D.desig) e('desig', 'Please enter designation');
    if (!D.email) e('email', 'Please enter email address'); else if (!mail.test(D.email)) e('email', 'Please enter a valid email address');
    if (!D.phone) e('phone', 'Please enter contact number'); else if (!mob.test(D.phone)) e('phone', 'Please enter a valid 10-digit number');
    if (D.altEmail && !mail.test(D.altEmail)) e('altEmail', 'Please enter a valid email address'); if (D.altPhone && !mob.test(D.altPhone)) e('altPhone', 'Please enter a valid 10-digit number');
    D.social.forEach((u, i) => { if (!u || !url.test(u)) e('s' + i, 'Please enter a valid website url'); });
    f.querySelectorAll('[data-err]').forEach(x => { x.textContent = errs[x.dataset.err] ? '⚠ ' + errs[x.dataset.err] : ''; });
    f.querySelectorAll('[name]').forEach(x => x.classList.toggle('err', !!errs[x.name]));
    if (Object.keys(errs).length) { const first = f.querySelector('.ferr:not(:empty)'); first?.scrollIntoView({ block: 'center' }); return toast('Please fill the required fields', 1); }
    const b = $('#cosave'); b.disabled = true; b.textContent = '⟳ Saving...';
    setTimeout(() => { const old = S.companies.find(x => x.id === D.id), rec = { ...structuredClone(D), desc: D.dmode === 'l' ? '' : D.desc, about: D.dmode === 'l' ? D.about : '' };
      delete rec.dmode; delete rec.logo; const w = D.name.split(/\s+/); rec.short = (w[0][0] + (w[1]?.[0] || '')).toUpperCase();   // logo initials from the final name
      if (old) Object.assign(old, rec); else S.companies.unshift({ ...rec, id: Date.now(), status: 'Active', acct: 'Invited', invitedOn: dmy(TODAY) });
      go('adm', 'pc-companies'); toast(old ? 'Updated — Company updated successfully' : `Added — Company added. An account setup email was sent to ${rec.email}`); }, 700); },
Opp: () => ask('Create Opportunity', `<div class="grid2">${field('Company', 'company', '', { req: 1, options: S.companies.filter(c => c.status === 'Active').map(c => c.name) })}${field('Job Title', 'title', '', { req: 1 })}${field('Job Type', 'type', '', { options: ['Placement', 'Internship', 'Placements And Internship'] })}${field('Work Type', 'work', '', { options: ['Remote', 'Hybrid', 'On-site'] })}${field('Location', 'loc', '')}${field('Apply By', 'by', '', { type: 'date' })}</div>${field('Required Skills (comma separated)', 'skills', '', { req: 1, ph: 'Java, Spring Boot, SQL' })}${field('Job Description', 'desc', '', { area: 1 })}`, 'Create',
    s => { if (!requireFields(s, ['company', 'title', 'skills'])) return false; const d = formData(s); DATA.jobs.push({ id: Date.now(), company: d.company, short: d.company.slice(0, 2).toUpperCase(), color: '#1E3A5F', title: d.title, type: d.type || 'Placement', work: d.work || 'On-site', loc: d.loc || 'Ahmedabad, Gujarat', by: d.by ? new Date(d.by).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—', applicants: 0, vacancies: 1, timeline: '—', desc: d.desc, skills: d.skills.split(',').map(x => x.trim()), rounds: ['Theory Round', 'Practical Test', 'HR Round'] }); render(); toast('Opportunity created — visible to students with matching skills'); }, 'wide')
};
function locRows() {
  const G = DATA.geo;
  const sel = (i, k, v, opts, ph, dis) => `<select class="inp" data-act="locSel" data-i="${i}" data-k="${k}" ${dis ? 'disabled' : ''}><option value="">${ph}</option>${opts.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  return S.tmpLocs.map((l, i) => `<div class="locrow"><div class="lbl" style="color:#334155">Location ${i + 1}</div><div class="locgrid">
    <div class="field"><label>Country <i>*</i></label>${sel(i, 'country', l.country, Object.keys(G), 'Select country')}</div>
    <div class="field"><label>State <i>*</i></label>${sel(i, 'state', l.state, l.country ? Object.keys(G[l.country]) : [], l.country ? 'Select state' : 'Select country first', !l.country)}</div>
    <div class="field"><label>City / District <i>*</i></label>${sel(i, 'city', l.city, l.state ? G[l.country][l.state] : [], l.state ? 'Select city / district' : 'Select state first', !l.state)}</div>
    <button type="button" class="iconbtn del" title="Remove location" data-act="delLoc" data-i="${i}">🗑</button></div></div>`).join('');
}
const subChips = () => S.tmpSubs.length ? S.tmpSubs.map((s, i) => `<span class="chip on">${esc(s)} <button type="button" class="chipx" title="Remove" data-act="delSub" data-i="${i}">×</button></span>`).join('') : '<i class="muted small">No sub skills added</i>';
// Step 1: pick the education type. Step 2: the type-specific form (also used directly for edits).
function recordForm() {
  ask('Add Academic Record', field('Select Education Type', 'type', '', { req: 1, options: REC_TYPES, ph: 'Select education type' }), '→ Save &amp; Continue',
    s => { if (!requireFields(s, ['type'], { type: 'Please select education type' })) return false; const k = formData(s).type; setTimeout(() => recordDetail(k)); });
}
function recordDetail(k, i) {
  const p = i !== undefined ? S.student.prev[i] : {}, F = REC_FIELDS(k), school = SCHOOL_REC(k);
  const opts = { boards: DATA.boards, streams: DATA.streams, universities: DATA.universities, institutes: DATA.institutes, years: YEARS };
  const body = `<div class="grid2">${F.map(([n, l, , o]) => field(l, n, n === 'result' ? String(p.result || '').replace('%', '') : p[n] || '', { req: 1, options: o ? opts[o] : null, ph: (o ? 'Select ' : 'Enter ') + l.toLowerCase(), type: n === 'result' ? 'number' : 'text' })).join('')}</div>`;
  ask(k, body, '💾 Save', s => {
    if (!requireFields(s, F.map(f => f[0]), Object.fromEntries(F.map(f => [f[0], f[2]])))) return false;
    const d = formData(s), v = Number(d.result), max = school ? 100 : 10;
    if (!(v >= 0 && v <= max)) { s.querySelector('[name="result"]').classList.add('err'); s.querySelector('[data-err="result"]').textContent = school ? 'Percentage must be between 0 and 100' : 'CGPA must be between 0 and 10'; return false; }
    const rec = { kind: k, type: k, ...d, result: school ? v.toFixed(2) + '%' : v.toFixed(2) };
    if (i !== undefined) Object.assign(S.student.prev[i], rec); else S.student.prev.push(rec);
    S.acc.prev = true; render(); toast(`${k} record ${i !== undefined ? 'updated' : 'added'}`);
  }, 'wide');
}
// Add / Edit Division Configuration modal; DF holds the division chips while it is open
let DF = { divs: [] }, SN = {}, DS = {}, WO = [];
// week-off day picker: chips with × plus a select listing the remaining days
const woChips = () => WO.map(d => `<span class="chip on">${d} <button type="button" class="chipx" data-act="woDel" data-v="${d}" title="Remove">×</button></span>`).join('') + `<select class="inp sm" data-act="woAdd" style="width:auto;border:0"><option value="">${WO.length ? '+ Add day' : 'Select week-off days'}</option>${DAYS.filter(d => !WO.includes(d)).map(d => `<option>${d}</option>`).join('')}</select>`;
const dfChips = () => DF.divs.length ? DF.divs.map((v, i) => `<span class="chip on">${esc(v)} <button type="button" class="chipx" data-act="dfDel" data-v="${i}" title="Remove">×</button></span>`).join('') : '<i class="muted small">No divisions added</i>';
function divForm(id) {
  const c = S.divcfg.find(x => x.id === id) || { deg: S.af.cfg?.deg || '', branch: S.af.cfg?.branch || '', sem: '', divs: [] }; DF = { id, divs: [...c.divs] };
  openModal(id ? 'Edit Division Configuration' : 'Add Division Configuration', `<div class="grid3">${aSel('Degree/Program', 'deg', c.deg, Object.keys(DATA.degrees), { req: 1, ph: 'Select degree/program', act: 'dfDeg' })}${aSel('Branch/Subject', 'branch', c.branch, branchesOf(c.deg), { req: 1, ph: 'Select branch/subject' })}${aSel('Semester/Year', 'sem', c.sem, DATA.semList, { req: 1, ph: 'Select semester/year' })}</div>
    <div class="field" style="max-width:360px"><label>Division</label><div class="row" style="gap:0;flex-wrap:nowrap"><input class="inp" name="divname" placeholder="Enter division name" maxlength="20" style="border-radius:4px 0 0 10px"><button type="button" class="btn" style="border-radius:0 10px 10px 0;flex:none" data-act="dfAdd">＋ Add</button></div><div class="ferr" data-err="divname"></div></div>
    <div class="lbl">Divisions Added:</div><div id="dfchips" style="margin:8px 0 16px">${dfChips()}</div>
    <div class="infobox small">ⓘ You can add multiple Division for the selected Degree/Program and Branch/Subject</div>`,
    `<button class="btn ghost" data-act="closeModal">✕ Cancel</button><button class="btn" id="dfsave" data-act="dfSave">💾 Save Configuration</button>`, 'wide');
}
// Verified Profile modal body (left identity card, right academic / address sections)
function profileBody(x) {
  const ch = { Branch: ['INFORMATION TECHNOLOGY', x.branch], Semester: ['Sem-3', x.sem], 'Admission Year': ['2024-2025', x.yr], Programme: ['Diploma', x.deg] };
  return `<div class="pview"><div class="vpcard"><div class="pava">${initialsOf(x.name)}</div><h3>${esc(x.name)}</h3><div class="muted small">APAAR / ABC ID : ${x.apaar}</div>
    <div class="pkv">${[['Date Of Birth', x.dob], ['Gender', x.gender], ['Nationality', 'India'], ['Email Address', x.email], ['Mobile No.', x.mob], ['Category', x.cat], ['Religion', x.religion]].map(r => `<div><span>${r[0]} :</span><b>${esc(r[1])}</b></div>`).join('')}</div></div>
    <div style="flex:1;min-width:0"><details class="pacc" open><summary>🎓 Current Academic Information</summary><div class="pgrid">${[['University', DATA.institute], ['Degree/Program', x.deg], ['Program Level', 'UG'], ['Enrollment No.', x.enr], ['Branch/Subject', x.branch], ['Branch Code', x.code], ['Admission Year', x.yr], ['Admission Type', x.admType], ['Admission System', 'Semester'], ['Admitted Semester/Year', x.admSem], ['Current Semester', x.sem], ['Agency', x.agency], ['Admission Category', x.cat], ['Division', x.div || 'Not assigned']].map(r => `<div><span>${r[0]} :</span><b>${esc(r[1])}</b></div>`).join('')}</div></details>
     <details class="pacc"><summary>📍 Address Information</summary><div style="padding:12px 16px;line-height:1.6">${esc(x.addr)}<br>India</div></details>
     ${x.changed ? `<details class="pacc" open><summary>✎ Details changed at sign-up</summary><div style="padding:10px 16px">${table(['Field', 'From admission database', 'Entered by student'], x.changed.split(', ').map(f => `<tr><td>${f}</td><td style="text-decoration:line-through;color:var(--mute)">${ch[f][0]}</td><td style="background:#FFFBEB;color:#92400E;font-weight:600">${ch[f][1]}</td></tr>`))}</div></details>` : ''}
     ${x.status === 'Rejected' && x.reason ? `<div class="infobox warn small">Rejected: ${esc(x.reason)}</div>` : ''}</div></div>`;
}
// Published admin notifications are mirrored into the student bell list (NOTIFS)
function syncNotifs() {
  for (let i = NOTIFS.length - 1; i >= 0; i--) if (NOTIFS[i].src) NOTIFS.splice(i, 1);
  S.adminNotifs.filter(n => n.pub).reverse().forEach(n => { const [d, m, y] = n.date.split('/').map(Number), days = Math.round((TODAY - new Date(y, m - 1, d)) / 864e5);
    NOTIFS.push({ id: 'a' + n.id, src: n.id, img: n.img || '🖼', bg: '#EEF4FF', title: n.title, desc: n.desc, ago: days <= 0 ? 'Today' : days + 'd ago', panel: 1 }); });
}

// ------------------------------------------------------------------ wiring
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g && !e.target.closest('[data-act]:not([data-go])')) { e.preventDefault(); go(g.dataset.go, g.dataset.sub || null, num(g.dataset.param ?? null)); if (S.modal) closeModal(); return; }
  const a = e.target.closest('[data-act]');
  if (a && a.tagName !== 'FORM' && a.type !== 'range' && a.tagName !== 'INPUT' && a.tagName !== 'SELECT') { const fn = ACT[a.dataset.act]; if (fn) { if (a.tagName === 'BUTTON' && a.closest('form') && !a.closest('.modal')) e.preventDefault(); fn(a, e); } return; }
  if (S.menu && !e.target.closest('.drop-menu')) { S.menu = null; render(); }
});
document.addEventListener('click', e => { if (S.mp && !e.target.closest('.rel')) { S.mp = null; render(); } });
document.addEventListener('submit', e => { e.preventDefault(); const fn = ACT[e.target.dataset.act]; if (fn) fn(e.target, e); });
document.addEventListener('change', e => { const t = e.target, a = t.dataset.act; if ((t.tagName === 'INPUT' || t.tagName === 'SELECT') && t.type !== 'range' && a !== 'liveSearch' && ACT[a]) ACT[a](t); });
document.addEventListener('input', e => {
  const a = e.target.dataset.act;
  if (a === 'radius') ACT.radius(e.target);
  const cnt = document.querySelector(`[data-cnt="${e.target.name}"]`);
  if (cnt) { const max = parseInt(cnt.textContent.split('/')[1]), n = e.target.value.length; cnt.textContent = `${n} / ${max} Max. Characters`; cnt.classList.toggle('over', n > max); }
  if (a === 'liveSearch') { const pos = e.target.selectionStart; S.filters[e.target.name] = e.target.value; render(); const n = $(`[name="${e.target.name}"][data-act="liveSearch"]`); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
});
// redraw only the map and the lat / lng boxes, so a pending click (e.g. Save Location) is not lost
const locRender = () => { const L = S.locDraft || S.location, c = $('#lm-c'); if (!c) return; const [x, y] = mapXY(L);
  c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', Math.max(6, Math.min(600, L.radius * MAPK / 111000))); $('#lm-p').setAttribute('transform', `translate(${x - 400} ${y - 210})`); $('#lm-r').textContent = `Radius: ${L.radius} meters`;
  ['lat', 'lng'].forEach(k => { const i = $(`.amain [name="${k}"]`); if (i && document.activeElement !== i) i.value = (+L[k]).toFixed(6); }); };
// two-factor code boxes: digits only, auto-advance, backspace goes back, paste fills all
const otpBoxes = () => [...document.querySelectorAll('.otpc')];
const otpSync = () => { const b = otpBoxes(), s = $('#otpsub'); if (s) s.disabled = b.some(i => !i.value); if ($('#otperr')) $('#otperr').textContent = ''; b.forEach(i => i.classList.remove('err')); };
document.addEventListener('input', e => { if (!e.target.classList.contains('otpc')) return; const b = otpBoxes(), i = b.indexOf(e.target);
  e.target.value = e.target.value.replace(/\D/g, '').slice(-1); if (e.target.value && b[i + 1]) b[i + 1].focus(); otpSync(); });
document.addEventListener('paste', e => { if (!e.target.classList.contains('otpc')) return; e.preventDefault(); const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
  otpBoxes().forEach((b, i) => b.value = d[i] || ''); (otpBoxes()[Math.min(d.length, 5)]).focus(); otpSync(); });
document.addEventListener('keydown', e => { if (e.target.classList?.contains('otpc') && e.key === 'Backspace' && !e.target.value) { const b = otpBoxes(), i = b.indexOf(e.target); if (i > 0) { b[i - 1].value = ''; b[i - 1].focus(); otpSync(); } } });
setInterval(() => { if (S.view !== 'login' || S.sub !== 'otp' || !(S.otpLeft > 0)) return; S.otpLeft--; const t = $('#otpt');
  if (t) t.innerHTML = S.otpLeft ? `Resend available in ${S.otpLeft}s` : '<a data-act="resendOtp" style="color:var(--navy);font-weight:700;cursor:pointer">Resend code</a>'; }, 1000);
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.name === 'divname') { e.preventDefault(); ACT.dfAdd(); } if (e.key === 'Enter' && e.target.name === 'subin') { e.preventDefault(); ACT.addSub(); } });
// Enter / Space on a focused link-like element or clickable card (see kbd() in app.js) works like a click
document.addEventListener('keydown', e => { const el = e.target; if ((e.key === 'Enter' || e.key === ' ') && el.tabIndex === 0 && !/^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && (el.dataset.act || el.dataset.go) && !el.classList.contains('itip')) { e.preventDefault(); el.click(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (S.doc) { S.doc = null; renderModal(); } else if (S.modal) closeModal(); } });
syncNotifs();
render();
