/* Screens added after reviewing the full frontend source (usk_frontend):
   A. student sign-up journey (create account → OTP → APAAR / DigiLocker → contact confirmation → password → 6-step registration)
   B. placement company side (job postings, applicants, application review, status master, student view)
   C. principal: department attendance + department leave report
   D. scholarship admin (scheme master)
   E. skill passport: college projects, skill score, cumulative credits; Coming Soon page
   Loaded after actions.js; adds to V / A / ACT and the shared state S. */

// ------------------------------------------------------------------ shared bits
const MONS3 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const byToDmy = s => { const [d, m, y] = String(s).split(' '); const i = MONS3.indexOf(m); return i < 0 ? s : `${pad2(+d)}/${pad2(i + 1)}/${y}`; };
const dmyToIso = s => (s && s.includes('/') ? s.split('/').reverse().join('-') : s || '');
const isoToDmy = s => (s && s.includes('-') ? s.split('-').reverse().join('/') : s || '');
const hashOf = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 99991, 7);
const chipList = (arr, act, k) => arr.length ? arr.map((x, i) => `<span class="chip">${esc(x)}${act ? ` <button type="button" class="chipx" title="Remove" data-act="${act}" data-k="${k}" data-i="${i}">×</button>` : ''}</span>`).join('') : '<span class="muted small">None selected</span>';
const kvRow = (l, v) => `<div><div class="muted small">${l}</div><b>${v || '—'}</b></div>`;
const secHead = (ic, t, s, end = '') => `<div class="sech"><span class="icn">${ic}</span><div>${t}<span class="sub">${s}</span></div>${end ? `<span class="end">${end}</span>` : ''}</div>`;

// ------------------------------------------------------------------ seed data
const APP_ST = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Pending'];
const SOFT_SKILLS = ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Time Management', 'Critical Thinking', 'Adaptability', 'Presentation'];
const CITIES = ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Anand', 'Bhavnagar', 'Remote'];
Object.assign(S, {
  posts: [...DATA.jobs.map(j => ({ id: j.id, company: j.company, title: j.title, work: j.work, type: j.type, start: j.start, end: byToDmy(j.by), vac: j.vacancies, loc: j.loc, status: 'Published', descType: 'text', desc: j.desc, doc: '', skills: [...j.skills], soft: ['Communication', 'Teamwork'], steps: [...j.rounds],
      elig: { deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', univ: 'Gujarat Technological University', inst: '', sem: 'Sem-7', sgpaOp: 'Greater than or equal to ( ≥ )', sgpa: '7.0', country: 'India', state: 'Gujarat', city: '', ageOp: 'Less than or equal to ( ≤ )', age: '25' } })),
    { id: 101, company: 'Nexora Softech', title: 'QA Automation Intern', work: 'On-site', type: 'Internship', start: '', end: '', vac: '', loc: 'Ahmedabad, Gujarat', status: 'Draft', descType: 'text', desc: '', doc: '', skills: ['Selenium'], soft: [], steps: [], elig: {} },
    { id: 102, company: 'Nexora Softech', title: 'DevOps Trainee', work: 'Hybrid', type: 'Placement', start: '01/12/2026', end: '20/12/2026', vac: '3', loc: 'Gandhinagar, Gujarat', status: 'Draft', descType: 'doc', desc: '', doc: 'DevOps_Trainee_JD.pdf', skills: ['Docker', 'Linux'], soft: ['Teamwork'], steps: ['Aptitude Test', 'Technical Interview'], elig: { deg: 'BE/B-Tech' } }],
  statusMaster: ['Aptitude Test', 'Group Discussion', 'Coding Round', 'Technical Interview', 'HR Round', 'Offer Letter'],
  schemesAdmin: DATA.scholarshipLinks.map((x, i) => ({ id: i + 1, short: x[0], name: x[3], desc: x[4], type: ['Merit Based', 'Means Based', 'Category Based', 'Special Scheme'][i % 4], status: i === 7 ? 'Inactive' : 'Active', amount: [50000, 100000, 25000, 150000, 30000, 200000, 20000, 18000, 40000][i] || 25000, start: '01/08/2026', deadline: ['31/12/2026', '30/11/2026', '15/12/2026', '31/01/2027', '30/11/2026', '31/12/2026', '31/10/2026', '15/01/2027', '28/02/2027'][i] || '31/12/2026', state: 'Gujarat', provider: 'Education Department, Government of Gujarat', cats: i % 3 === 0 ? ['General', 'SEBC', 'SC', 'ST', 'EWS'] : ['SC', 'ST'], states: ['Gujarat'], genders: ['Male', 'Female', 'Other'], groups: ['Diploma', 'Under Graduate'], ssc: '60', hsc: i % 2 ? '' : '65', income: i % 2 ? '250000' : '600000', pwd: 'No (Not mandatory)', criteria: 'Student must be a domicile of Gujarat and studying in a recognised institute.' })),
  projects: [{ id: 1, title: 'Smart Campus Attendance System', role: 'Backend Developer', team: '4', tech: ['Java', 'Spring Boot', 'MySQL'], start: '07/2025', end: '11/2025', link: 1, desc: 'Face-verified attendance app with a geofenced punch API; I built the REST API and the attendance reports.' },
    { id: 2, title: 'Crop Price Predictor', role: 'Team Lead', team: '3', tech: ['Python', 'Pandas', 'scikit-learn'], start: '01/2026', end: '', link: 1, desc: 'Predicts mandi prices for five crops using five years of public price data. Ongoing semester project.' }],
  su: { step: 'account', method: 'Mobile No.', d: {}, reg: 0, search: null, agree: false, confirm: false },
  jd: null
});
// applicants of each published posting, built from the student records + HOD class list
const POOL = [...DATA.records.map(r => ({ name: r.name, deg: r.deg, branch: r.branch, sem: r.sem, enr: r.enr, email: r.email, mob: r.mob })), ...(DATA.hodStudents || []).map(r => ({ name: r.name, deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: r.sem || 'Sem-5', enr: r.enr, email: '', mob: '' }))]
  .map((r, i) => { const h = hashOf(r.name); return { ...r, id: i + 1, sgpa: (7 + (h % 25) / 10).toFixed(2), pref: [CITIES[h % CITIES.length], CITIES[(h + 3) % CITIES.length]], skills: S.jobSkills.filter((_, k) => (h + k * 7) % 9 === 0).slice(0, 4), soft: SOFT_SKILLS.filter((_, k) => (h + k) % 3 === 0).slice(0, 3), univ: 'Gujarat Technological University', inst: i % 3 ? DATA.institute : 'Government Engineering College, Gandhinagar', state: 'Gujarat', city: CITIES[h % 7], taluka: ['Daskroi', 'Gandhinagar', 'Vadodara', 'Choryasi', 'Rajkot', 'Anand', 'Bhavnagar'][h % 7] }; });
S.applicants = S.posts.filter(p => p.status === 'Published').flatMap(p => POOL.filter((_, i) => (i + p.id) % 3 !== 0).slice(0, 4 + p.id % 5).map((st, i) => { const status = APP_ST[(i + p.id) % APP_ST.length], d = 1 + ((i * 3 + p.id) % 4);
  return { id: p.id * 100 + i, postId: p.id, stuId: st.id, date: `${pad2(Math.min(+p.start.slice(0, 2) + d, 28))}/${p.start.slice(3)}`, status, hist: [{ s: 'Applied', on: `${pad2(Math.min(+p.start.slice(0, 2) + d, 28))}/${p.start.slice(3)}`, by: 'Student', remark: '' }, ...(status !== 'Applied' ? [{ s: status, on: '05/11/2026', by: 'Placement Coordinator', remark: status === 'Rejected' ? 'Does not meet the minimum SGPA for this role.' : status === 'Selected' ? 'Cleared all rounds.' : '' }] : [])] }; }));
const stuOf = id => POOL.find(x => x.id === id) || POOL[0];
const postOf = id => S.posts.find(x => x.id === id) || S.posts[0];
const appStCls = s => ({ Applied: 'blue', 'Under Review': 'amber', Shortlisted: 'violet', 'Interview Scheduled': 'blue', Selected: 'green', Rejected: 'red', Pending: 'grey' }[s] || 'violet');
const appSt = s => `<span class="st ${appStCls(s)}">${esc(s)}</span>`;

// ------------------------------------------------------------------ menus (new pages join the existing role menus → all-features segments)
NAV.placement.splice(1, 0, ['pc-jobs', '📝', 'Job Postings'], ['pc-students', '🎓', 'Student View'], ['pc-status', '🏷', 'Status Master']);
NAV.scholar.unshift(['so-admin', '🗂', 'Scholarship Admin']);
NAV.principal.forEach(n => { if (n.fold === 'Attendance Management') n.kids.push(['pr-deptatt', 'Department Attendance']); if (n.fold === 'Faculty Leave Management') n.kids.push(['pr-deptleave', 'Department Leave Report']); });
buildAllNav();   // rebuild the grouped sidebar with the pages added above
Object.assign(SEG_INFO, {
  principal: SEG_INFO.principal + ' Department attendance and department leave reports.',
  scholar: 'Scholarship admin (create and manage schemes with eligibility rules) and review of scholarship applications.',
  placement: 'Company master, job postings with eligibility and selection steps, applicants and application review, status master and student search.'
});

// ================================================================== A. student sign-up — one simple journey
// Every way in (Create Account, Sign Up With DigiLocker, the registration link sent to pre-registered students) follows the same 4 steps:
//   ① Account → ② Verify (OTP) → ③ Password → ④ Your Details (link APAAR first only if it is missing) → submitted for college approval.
// Stopping after step ③ is fine: signing in later resumes at step ④. Login then shows the approval status (see the end of this file).
const SU_MAIN = ['Account', 'Verify', 'Password', 'Your Details'];
const SU_STEPS = ['Academic Search', 'Basic Details', 'Address Details', 'Academic Details'];
const suNew = (o = {}) => ({ step: 'account', method: 'Mobile No.', d: {}, reg: 0, search: null, agree: false, confirm: false, ...o });
const suSteps = () => { const i = S.su.step === 'done' ? 4 : ({ account: 0, otp: 1, pwd: 2 }[S.su.step] ?? 3);
  return `<div class="sustep" aria-label="Sign-up progress">${SU_MAIN.map((l, k) => `<div class="${k < i ? 'done' : k === i ? 'on' : ''}"><span>${k < i ? '✓' : k + 1}</span><b>${l}</b></div>`).join('')}</div>`; };
const suFrom = () => S.su.link ? 'your institute' : S.su.dl ? 'DigiLocker' : '';
const suShell = (body, wide) => `<header class="shead">${brand()}<div class="r">${fontLang()}${S.su.step === 'reg' ? '<button class="btn ghost sm sulogout" data-act="suLogout">⎋ Logout</button>' : ''}</div></header>
  ${wide ? `<div class="swrap su-wide">${S.su.step === 'reg' ? '' : suSteps()}<div id="su">${body}</div></div>` : `<div class="login-wrap su-wrap"><div class="card login-card"><div class="login-img"><div class="tx">${S.su.link
    ? '<span class="tag" style="background:rgba(255,255,255,.2);color:#fff">ENROLLMENT</span><h2 class="h-font" style="font-size:1.8rem;line-height:1.25;margin:16px 0 10px">Complete your Enrollment</h2><p style="opacity:.85;line-height:1.5">Your institute has already registered you. Confirm your details, verify your mobile or email and set a password.</p>'
    : '<span class="tag" style="background:rgba(255,255,255,.2);color:#fff">NEW STUDENT</span><h2 class="h-font" style="font-size:1.8rem;line-height:1.25;margin:16px 0 10px">Create your student account</h2><p style="opacity:.85;line-height:1.5">Four short steps. Your college approves your profile before you can use the portal.</p>'}</div></div><div class="login-form" id="su">${suSteps()}${body}</div></div></div>`}`;
const pwChecks = p => [['8+ characters', p.length >= 8], ['Uppercase letter (A-Z)', /[A-Z]/.test(p)], ['Lowercase letter (a-z)', /[a-z]/.test(p)], ['Number (0-9)', /\d/.test(p)], ['Special character (!@#$%^&*)', /[^A-Za-z0-9]/.test(p)]];
const pwMeter = p => { const n = pwChecks(p).filter(c => c[1]).length, lvl = !p ? '' : n <= 2 ? 'Weak' : n === 3 ? 'Moderate' : n === 4 ? 'Good' : 'Strong';
  return `<div class="pwm"><div class="row small"><span>Security Strength</span><span class="sp"></span><b class="pwl ${lvl.toLowerCase()}">${lvl || '—'}</b></div><div class="pwbar">${[1, 2, 3, 4].map(k => `<i class="${p && n >= k + 1 ? lvl.toLowerCase() : ''}"></i>`).join('')}</div>
    <div class="pwreq"><b class="small">Password Requirements</b>${pwChecks(p).map(([l, ok]) => `<div class="${ok ? 'ok' : ''}">${ok ? '✓' : '○'} ${l}</div>`).join('')}</div></div>`; };
const maskMob = m => m ? '+91 ' + String(m).replace(/^(\d{2})\d{4}/, '$1XXXX') : '';
const maskMail = e => String(e || '').replace(/^(.).*@/, '$1•••••@');

V.signup = () => {
  const su = S.su, d = su.d, st = su.step, from = suFrom();
  if (st === 'reg') return suShell(suWizard(), 1);
  if (st === 'apaar') return suShell(`<div class="card sec su-narrow">${su.justCreated ? '<div class="infobox ok small mb">✓ Account created. You can finish later — sign in with your email and password and you will continue from here.</div>' : ''}
    <div class="ttl mb">Link your APAAR / ABC ID<small>Your APAAR / ABC ID is needed before you fill in your details. It takes a few seconds.</small></div>
    ${su.apaarFound ? `<div class="cert center"><div class="okcirc">✓</div><div class="muted small mt">APAAR / ABC ID linked from DigiLocker</div><b style="font-size:1.3rem;letter-spacing:2px">${esc(d.apaar.replace(/^(\d{6})\d{4}/, '$1XXXX'))}</b></div><button class="btn block mt" style="height:42px" data-act="suTo" data-v="reg">Continue to Your Details →</button>`
    : `<div class="grid2"><div class="opp"><b>🔐 Fetch from DigiLocker</b><span class="tag ai" style="margin-left:6px">Recommended</span><p class="small mt">Sign in to DigiLocker with your Aadhaar-linked mobile number and allow access. Your APAAR / ABC ID is fetched automatically.</p><button class="btn block mt" style="background:#5B21B6" data-act="suDigi">Continue with DigiLocker</button></div>
      <div class="opp"><b>🆕 Don't have an APAAR / ABC ID?</b><p class="small mt">Generate it on the official ABC Portal with your Aadhaar-linked mobile number, then come back and fetch it from DigiLocker.</p><button class="btn ghost block mt" data-act="suAbc">How to generate it</button></div></div>`}</div>`, 1);
  if (st === 'done') return suShell(`<div class="card sec su-narrow center"><div class="okcirc">✓</div><h2 class="h-font" style="font-size:1.6rem;color:var(--navy);margin:12px 0 6px">Submitted for approval</h2>
    <p class="muted">Your college will review your details. You can use the portal once your profile is approved — we will let you know by SMS and email.</p>
    <div class="infobox small mt" style="text-align:left">Demo: the record is now in COGENT → Student Admin → Student Records as <b>${su.doneStatus}</b>. Verify or reject it there, then sign in as this student to see what happens.</div>
    <button class="btn mt" data-act="suToLogin" data-v="${esc(d.email || '')}">Go to Login</button></div>`, 1);
  let b = '';
  if (st === 'account') b = `<h1 class="h-font" style="font-size:1.8rem;color:var(--navy)">${su.link ? 'Confirm your details' : 'Create Account'}</h1><p class="muted" style="margin:4px 0 14px">${from ? `Details from ${from} are filled in and locked.` : 'Enter your details to create your student account.'}</p>
    <div class="grid2">${field('First Name', 'first', d.first || '', { req: 1, ro: !!from, ph: 'e.g. Rahul' })}${field('Surname', 'last', d.last || '', { req: 1, ro: !!from, ph: 'e.g. Sharma' })}</div>
    ${field('Email Address', 'email', d.email || '', { req: 1, ro: !!from, ph: 'Enter email address' })}${field('Mobile No.', 'mobile', d.mobile || '', { req: 1, ro: !!from, ph: '10-digit mobile number' })}
    ${field('APAAR / ABC ID', 'apaar', d.apaar || '', { ro: !!from && su.apaarLocked, ph: 'Optional — 12 digits' })}${from ? '' : '<div class="muted small" style="margin:-6px 0 12px">Optional. If you leave it empty, you can link it from DigiLocker in step 4.</div>'}
    <div class="field"><label>Send verification code to <i>*</i></label><div class="row" style="gap:18px">${['Mobile No.', 'Email Address'].map(m => `<label class="check"><input type="radio" name="method" value="${m}" data-act="suMethod" ${su.method === m ? 'checked' : ''}> ${m}</label>`).join('')}</div></div>
    <label class="check small" style="margin:6px 0 4px"><input type="checkbox" name="agree" ${su.agree ? 'checked' : ''}> I agree to the terms &amp; conditions and privacy policy.</label><div class="ferr" data-err="agree"></div>
    <button class="btn block mt" style="height:42px" data-act="suAccount">Send Verification Code →</button>
    <div class="center mt small">Already have an account? <a style="color:var(--navy);font-weight:700" data-go="login">Sign In</a></div>
    ${from ? '' : '<div class="infobox mt small">Demo: enter APAAR <b>111111111111</b> to see "account already exists".</div>'}`;
  else if (st === 'otp') b = `<h1 class="h-font" style="font-size:1.8rem;color:var(--navy)">Enter Verification Code</h1><p class="muted" style="margin:4px 0 14px">We sent a 6-digit code to <b>${su.method === 'Mobile No.' ? maskMob(d.mobile) : esc(maskMail(d.email))}</b></p>
    ${field('Verification Code', 'code', '', { req: 1, ph: '6-digit code' })}<div class="center small muted" style="margin:0 0 14px">Didn't receive it? <a data-act="suResend" style="color:var(--navy);font-weight:700">Resend code</a></div>
    <div class="grid2"><button class="btn ghost" data-act="suTo" data-v="account">← Back</button><button class="btn" data-act="suOtp">Verify →</button></div><div class="infobox mt small">Demo: the code is <b>482916</b>.</div>`;
  else if (st === 'pwd') b = `<h1 class="h-font" style="font-size:1.8rem;color:var(--navy)">Create Password</h1><p class="muted" style="margin:4px 0 14px">You will use it with your email or mobile number to sign in.</p>
    ${field('New Password', 'pw', '', { req: 1, type: 'password', ph: 'Enter new password' })}<div id="pwm">${pwMeter('')}</div>${field('Confirm Password', 'pw2', '', { req: 1, type: 'password', ph: 'Re-enter new password' })}
    <button class="btn block mt" style="height:42px" data-act="suPwd">Create Account →</button>`;
  return suShell(b);
};
// ---- registration form
const UNIVS = ['Gujarat Technological University, Ahmedabad', 'Gujarat University, Ahmedabad', 'Sardar Patel University, Vallabh Vidyanagar'];
const INSTS = [DATA.institute, 'Government Engineering College, Gandhinagar', 'Lukhdhirji Engineering College (Degree), Morbi'];
const SEMS = ['Sem-1', 'Sem-2', 'Sem-3', 'Sem-4', 'Sem-5', 'Sem-6', 'Sem-7', 'Sem-8'];
const SEARCH_BY = d => d.level === 'PG' ? ['UG Seat No.', 'UG Enrollment No.'] : d.admType === 'D to D' ? ['Diploma Seat No.'] : ['12th Seat No.'];
const SEARCH_LBL = { 'Diploma Seat No.': 'Diploma Seat Number / Application Number', '12th Seat No.': '12th Seat Number / Application Number', 'UG Seat No.': 'UG Seat Number', 'UG Enrollment No.': 'UG Enrollment Number' };
const REC_GRID = [['Admission Year', 'admYear'], ['Admission Institute', 'inst'], ['Programme Level', 'level'], ['Degree/Program', 'deg'], ['Branch', 'branch'], ['Admission System', 'admSys'], ['Admitted Semester', 'admSem'], ['Agency', 'agency'], ['Admission Category', 'admCat'], ['Enrollment No.', 'enr'], ['Admission Type', 'admType'], ['Current Semester', 'curSem']];
// enrollment number is required from semester 3 onwards (semester 5 for D to D admissions)
const enrReq = d => (+String(d.curSem || '').replace(/\D/g, '') || 0) >= (d.admType === 'D to D' ? 5 : 3);
const maskApaar = s => { s = String(s || ''); return s.length > 6 ? s.slice(0, 2) + 'XXXX' + s.slice(-4) : s; };   // 62XXXX0123
function suWizard() {
  const su = S.su, d = su.d, k = su.reg, found = su.search === 'found';
  const inp = (l, n, o = {}) => `<div class="field ${o.cls || ''}"><label>${l}${o.req ? ' <i>*</i>' : ''}${o.tick ? ' <span class="vtick" title="Verified">✓</span>' : ''}</label><input class="inp" name="${n}" type="${o.type || 'text'}" value="${esc(o.v ?? d[n] ?? '')}" placeholder="${esc(o.ph || '')}" ${o.ro ? 'readonly' : ''}><div class="ferr" data-err="${n}"></div></div>`;
  const sel = (l, n, opts, o = {}) => `<div class="field"><label>${l}${o.req ? ' <i>*</i>' : ''}</label><select class="inp" name="${n}" ${o.ro ? 'disabled' : ''} ${o.act ? `data-act="${o.act}"` : ''}><option value="">${o.ph || 'Select'}</option>${opts.map(x => `<option ${x === d[n] ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select><div class="ferr" data-err="${n}"></div></div>`;
  const radios = (l, n, opts, o = {}) => `<div class="field"><label>${l} <i>*</i></label><div class="row" style="gap:18px;min-height:40px">${opts.map(v => `<label class="check"><input type="radio" name="${n}" value="${v}" ${(d[n] || o.def) === v ? 'checked' : ''} ${o.ro ? 'disabled' : `data-act="${o.act || 'suRadio'}"`}> ${v}</label>`).join('')}</div><div class="ferr" data-err="${n}"></div></div>`;
  const rsec = (t, s, end = '') => `<div class="row" style="align-items:flex-start;margin-bottom:12px"><div class="rsec">${t}${s ? `<small>${s}</small>` : ''}</div><span class="sp"></span>${end}</div>`;
  const banners = `${su.justCreated && k === 0 ? '<div class="infobox ok small mb">✓ Account created. You can log out and finish later — sign in with your email and password and you will continue from here.</div>' : ''}${su.rejReason ? `<div class="infobox warn mb"><b>Your profile was rejected.</b> Reason: ${esc(su.rejReason)}<br>Correct your details and submit again.</div>` : ''}`;
  if (k === 4) return `${banners}${suReview()}`;
  let body = '';
  if (k === 0) { const by = SEARCH_BY(d), sb = by.includes(d.searchBy) ? d.searchBy : by[0];
    body = `<div class="infobox mb">ⓘ Enter your academic details to search for your academic record. If a matching record is found, your registration form will be automatically populated. If no record is found, contact the Helpdesk to continue your registration.</div>
    ${rsec('Academic Details', 'Add your academic details to search for your academic records.')}
    <div class="grid4">${sel('Admission Year', 'admYear', ['2023-2024', '2024-2025', '2025-2026', '2026-2027'], { req: 1, act: 'suSearchChg' })}${sel('Agency', 'agency', ['ACPC', 'ACPDC', 'GCAS', 'Institute Level'], { req: 1, act: 'suSearchChg' })}${sel('Programme Level', 'level', ['Diploma', 'UG', 'PG', 'Ph.D.'], { req: 1, act: 'suSearchChg' })}${sel('Admission Type', 'admType', ['Regular', 'D to D', 'Lateral Entry'], { req: 1, act: 'suSearchChg' })}</div>
    ${radios('Search By', 'searchBy', by, { def: sb, act: 'suSearchChg' })}
    <div class="grid4">${inp(SEARCH_LBL[sb], 'searchVal', { req: 1, ph: 'Enter ' + SEARCH_LBL[sb].toLowerCase() })}</div>
    <div class="row"><span class="sp"></span><button class="btn" data-act="suSearch">🔎 Search</button></div>
    ${su.search === 'none' ? '<div class="infobox warn mt"><b>Record not found.</b> Your academic record was not found. Please try searching with another option before proceeding, or contact the Helpdesk.</div>' : ''}<div class="ferr" data-err="search"></div>
    <div class="recgrid mt">${REC_GRID.map(([l, n]) => `<div><small>${l}</small><b>${found && d[n] ? esc(d[n]) : 'N/A'}</b></div>`).join('')}</div>
    <div class="infobox small mt">Demo: a number ending in <b>0</b> is not found; any other number finds a record.</div>`; }
  else if (k === 1) body = `${rsec('Basic Student Details')}
    ${inp('Full Name (As per Committee)', 'fullName', { req: 1, ro: 1, v: d.fullName || [d.first, d.middle, d.last].filter(Boolean).join(' ') })}
    <div class="grid3">${inp('Surname', 'last', { req: 1 })}${inp('First Name', 'first', { req: 1 })}${inp('Middle Name', 'middle')}</div>
    <div class="dashsep"></div>
    <div class="grid4">${inp('APAAR / ABC ID', 'apaarR', { ro: 1, tick: !!d.apaar, v: d.apaar || '—' })}${inp('Mobile No.', 'mobR', { req: 1, ro: 1, v: d.mobile ? '+91 ' + d.mobile : '' })}${inp('Email Address', 'emailR', { req: 1, ro: 1, tick: true, v: d.email || '' })}${inp('Date of Birth', 'dob', { req: 1, type: 'date', ro: found && !!d.dob })}
      ${sel('Gender', 'gender', ['Male', 'Female', 'Transgender', 'Non-binary', 'Prefer not to say'], { req: 1, ph: 'Please select gender' })}${sel('Student Category', 'cat', ['General', 'SEBC', 'SC', 'ST', 'EWS'], { req: 1 })}${sel('Religion', 'religion', ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Other'], { req: 1 })}${radios('Person with Disability (PWD)', 'pwd', ['Yes', 'No'], { def: 'No' })}
      ${radios('Are you a Non-Gujarat Domicile?', 'nonGuj', ['Yes', 'No'], { def: 'No' })}${d.nonGuj === 'Yes' ? sel('Domicile State', 'domState', ['Maharashtra', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Other'], { req: 1 }) : ''}</div>`;
  else if (k === 2) body = `${rsec('Current Address Details', '', '<button class="btn ghost" data-act="suAddrPreview">👁 Preview Address</button>')}
    <div class="field"><label>Address <i>*</i></label><textarea class="inp" name="addr" maxlength="150" placeholder="House no., street, area">${esc(d.addr || '')}</textarea>${counter('addr', 150, d.addr || '')}<div class="ferr" data-err="addr"></div></div>
    <div class="grid4">${inp('Pincode', 'pin', { req: 1, ph: '6-digit pincode' })}${sel('Country', 'country', ['India'], { req: 1 })}${sel('State', 'state', ['Gujarat', 'Maharashtra', 'Rajasthan'], { req: 1 })}${sel('District', 'district', ['Ahmedabad', 'Gandhinagar', 'Vadodara', 'Surat', 'Rajkot', 'Morbi'], { req: 1 })}
      ${sel('Taluka', 'taluka', ['Vejalpur', 'Daskroi', 'Sanand', 'Dholka', 'City'], { req: 1 })}${sel('City / Village', 'city', ['Vastrapur', 'Bopal', 'Ghatlodiya', 'Navrangpura', 'Satellite'], { req: 1 })}</div>`;
  else body = `${rsec('Admission Details')}
    <div class="grid4">${sel('Admission Year', 'admYear', ['2023-2024', '2024-2025', '2025-2026', '2026-2027'], { req: 1, ro: found })}${sel('Agency', 'agency', ['ACPC', 'ACPDC', 'GCAS', 'Institute Level'], { req: 1, ro: found })}${sel('University', 'univ', UNIVS, { req: 1 })}${sel('Admission Institute', 'inst', INSTS, { req: 1 })}
      ${sel('Programme Level', 'level', ['Diploma', 'UG', 'PG', 'Ph.D.'], { req: 1 })}${sel('Degree/Program', 'deg', Object.keys(DATA.degrees), { req: 1, act: 'suRadio' })}${sel('Branch', 'branch', DATA.degrees[d.deg] || [], { req: 1 })}${sel('Admission Category', 'admCat', ['OP', 'SEBC', 'SC', 'ST', 'EWS', 'TFWS'], { req: 1, ro: found })}
      ${sel('Admission Type', 'admType', ['Regular', 'D to D', 'Lateral Entry'], { req: 1, ro: found })}${radios('Admission System', 'admSys', ['Semester', 'Yearly'], { def: 'Semester', ro: found })}${sel('Admitted Semester', 'admSem', SEMS, { req: 1, ro: found })}${sel('Current Semester', 'curSem', SEMS, { req: 1, act: 'suRadio' })}
      ${inp('Enrollment No', 'enr', { req: enrReq(d), ph: 'Please enter enrollment no' })}</div>
    <div class="muted small">Enrollment No. is required from Semester 3 onwards (Semester 5 for D to D admissions).</div>`;
  return `${banners}<div class="card sec">
    <div class="rstep">${SU_STEPS.map((l, i) => `${i ? `<span class="ln ${i <= k ? 'done' : ''}"></span>` : ''}<button class="s ${i < k ? 'done' : i === k ? 'on' : ''}" ${i < k ? `data-act="suGoStep" data-v="${i}"` : 'disabled'}><i>${i < k ? '✓' : i + 1}</i><span>${l}</span></button>`).join('')}</div>
    ${body}
    <div class="row mt"><span class="sp"></span><button class="btn ghost" data-act="suPrev" ${k ? '' : 'disabled'}>⇤ Previous</button><button class="btn" data-act="suNext">${k === 3 ? 'Preview &amp; Submit' : 'Next Step ⇥'}</button></div></div>`;
}
// Review & Submit Registration (its own page; Edit jumps back to that part of the form)
function suReview() {
  const d = S.su.d, card = (ic, t, to, body) => `<div class="rvcard"><div class="rvhead"><span class="ic">${ic}</span>${t}<button class="btn ghost sm" data-act="suGoStep" data-v="${to}">Edit</button></div><div class="rvbody">${body}</div></div>`;
  const cell = (l, v) => `<div><small>${l}</small><b>${v || '—'}</b></div>`;
  return `<div class="card sec"><div class="row mb" style="gap:10px"><span class="rvicon">📄</span><h2 style="font-size:1.25rem;color:var(--navy)">Review &amp; Submit Registration</h2></div>
    ${card('👤', 'Basic Student Details', 1, `<div class="rvgrid">${cell('APAAR / ABC ID', d.apaar ? mask(esc(d.apaar), maskApaar(d.apaar)) + eye() : '—')}${cell('Mobile No.', mask(esc(d.mobile || ''), String(d.mobile || '').replace(/^(\d{2})\d{4}/, '$1XXXX')) + eye())}${cell('Email Address', mask(esc(d.email || ''), esc(maskMail(d.email))) + eye())}${cell('Date of Birth', isoToDmy(d.dob))}
      ${cell('Surname', esc(d.last))}${cell('First Name', esc(d.first))}${cell('Middle Name', esc(d.middle))}${cell('Gender', esc((d.gender || '').toUpperCase()))}${cell('Person with Disability (PWD)', d.pwd || 'No')}${cell('Student Category', esc(d.cat))}${cell('Religion', esc(d.religion))}${d.nonGuj === 'Yes' ? cell('Domicile State', esc(d.domState)) : ''}</div>`)}
    ${card('📍', 'Address Details', 2, `<div class="small" style="font-weight:700;margin:8px 0">🏠 Address</div><div class="rvaddr"><div class="full"><small>Full Address</small><b>${esc(d.addr)}</b></div><div class="rvgrid c2">${cell('City / Village', esc(d.city))}${cell('Taluka', esc(d.taluka))}${cell('District', esc(d.district))}${cell('State', esc(d.state))}${cell('Pincode', esc(d.pin))}${cell('Country', esc(d.country || 'India'))}</div></div>`)}
    ${card('🏛', 'Admission Details', 3, `<div class="rvgrid c3">${cell('University', esc(d.univ))}${cell('Admission Institute', esc(d.inst))}${cell('Programme Level', esc(d.level))}${cell('Degree/Program', esc(d.deg))}${cell('Branch', esc(d.branch))}${cell('Enrollment No', esc(d.enr))}${cell('Admission Year', esc(d.admYear))}${cell('Admission Type', esc(d.admType))}${cell('Agency', esc(d.agency))}${cell('Admission System', esc(d.admSys || 'Semester'))}${cell('Current Semester', esc(d.curSem))}${cell('Admitted Semester', esc(d.admSem))}${cell('Admission Category', esc(d.admCat))}</div>`)}
    <div class="row mt" style="align-items:center"><label class="check small"><input type="checkbox" name="confirm" data-act="suConfirmChk" ${S.su.confirm ? 'checked' : ''}> I confirm that all personal and admission details have been reviewed carefully.</label><span class="sp"></span><button class="btn" data-act="suNext" ${S.su.confirm ? '' : 'disabled title="Tick the confirmation first"'}>✓ Confirm &amp; Submit</button></div><div class="ferr" data-err="confirm"></div></div>`;
}
const suSync = () => { const r = $('#su'); if (r) { const f = formData(r); r.querySelectorAll('input[type=radio]').forEach(x => { if (x.checked) f[x.name] = x.value; }); ['agree', 'confirm'].forEach(x => { if (x in f) S.su[x] = f[x]; delete f[x]; }); delete f.method; Object.keys(f).forEach(n => { if (!/R$/.test(n)) S.su.d[n] = f[n]; }); } };
const suErr = (n, msg) => { const e = $(`#su [data-err="${n}"]`), i = $(`#su [name="${n}"]`); if (e) e.textContent = '⚠ ' + msg; if (i) i.classList.add('err'); return false; };
const SU_REQ = [['first', 'last', 'dob', 'gender', 'cat', 'religion', 'income', 'state', 'district', 'taluka', 'pin', 'addr'], ['searchBy', 'searchVal'], ['level', 'admYear', 'agency', 'univ', 'inst', 'deg', 'branch', 'admSys', 'curSem', 'enr', 'sscBoard', 'sscSeat', 'sscPct', 'sscYear', 'hscBoard', 'hscSeat', 'hscPct', 'hscYear'], []];
const suTop = () => window.scrollTo(0, 0);

Object.assign(ACT, {
  signup: () => { S.su = suNew(); go('signup'); },
  // "Sign Up With DigiLocker" on the login page starts the same journey with the details DigiLocker returns
  digilocker: () => spinner('Redirecting to DigiLocker…', 1100, () => { S.su = suNew({ dl: true, apaarLocked: true, viaDL: true, d: { first: 'Karan', last: 'Mehta', email: 'karan.mehta@mail.example', mobile: '9898012345', apaar: '734512908816' } }); go('signup'); toast('Details fetched from DigiLocker'); }),
  suMethod: el => { suSync(); S.su.method = el.value; render(); },
  suTo: el => { suSync(); S.su.step = el.dataset.v; if (el.dataset.v === 'reg') S.su.reg = 0; render(); suTop(); },
  suAccount: () => { const r = $('#su'); suSync(); const d = S.su.d; let ok = requireFields(r, ['first', 'last', 'email', 'mobile'], { first: 'Please enter first name', last: 'Please enter surname', email: 'Please enter email address', mobile: 'Please enter mobile number' });
    if (d.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) ok = suErr('email', 'Please enter a valid email address');
    if (d.mobile && !/^[6-9]\d{9}$/.test(d.mobile)) ok = suErr('mobile', 'Please enter a valid 10-digit mobile number');
    if (d.apaar && !/^\d{12}$/.test(d.apaar)) ok = suErr('apaar', 'APAAR / ABC ID must be 12 digits');
    if (!S.su.agree) { $('#su [data-err="agree"]').textContent = '⚠ Please agree to the Terms & Conditions and Privacy Policy'; ok = false; }
    if (!ok) return;
    if (d.apaar === '111111111111' || S.accounts.some(a => a.email === d.email || a.mobile === d.mobile)) return toast('User Already Exist. Please Try to Login', 1);
    spinner('Sending verification code…', 600, () => { S.su.step = 'otp'; render(); toast(`Verification code sent to your ${S.su.method}`); }); },
  suResend: () => toast('A new verification code has been sent'),
  suOtp: () => { const v = $('#su [name="code"]').value.trim(); if (v !== '482916') return suErr('code', v ? 'Invalid verification code. Please try again.' : 'Please enter the verification code'); S.su.step = 'pwd'; render(); },
  suPwd: () => { const r = $('#su'), p = r.querySelector('[name="pw"]').value, p2 = r.querySelector('[name="pw2"]').value;
    if (!requireFields(r, ['pw', 'pw2'], { pw: 'Please enter a new password', pw2: 'Please confirm your password' })) return;
    if (pwChecks(p).some(c => !c[1])) return suErr('pw', 'Password does not meet all the requirements');
    if (p !== p2) return suErr('pw2', 'Passwords do not match');
    const d = S.su.d, acc = { email: d.email, mobile: d.mobile, apaar: d.apaar || '', via: S.su.link ? 'LINK' : S.su.dl ? 'DIGILOCKER' : 'SELF', d: structuredClone(d), recId: null, reviewed: false };
    S.accounts.push(acc); Object.assign(S.su, { acc, post: true, justCreated: true, step: d.apaar ? 'reg' : 'apaar', reg: 0 }); render(); suTop(); toast('Account created'); },
  suDigi: () => spinner('Connecting to DigiLocker…', 1100, () => { S.su.apaarFound = true; S.su.viaDL = true; S.su.d.apaar = '453912337781'; if (S.su.acc) { S.su.acc.apaar = S.su.d.apaar; S.su.acc.d.apaar = S.su.d.apaar; S.su.acc.viaDL = true; } render(); toast('APAAR / ABC ID linked from DigiLocker'); }),
  suAbc: () => openModal('Generate your APAAR / ABC ID', `<ol class="sulist">${['Open the official ABC Portal.', 'Sign in with your Aadhaar-linked mobile number.', 'Complete the APAAR / ABC ID generation steps.', 'Come back here and choose "Continue with DigiLocker".'].map(x => `<li>${x}</li>`).join('')}</ol><div class="infobox warn small">Make sure the mobile number linked with your Aadhaar is active.</div>`, '<button class="btn ghost" data-act="closeModal">Close</button><button class="btn" data-act="extlink" data-v="the ABC Portal">Open ABC Portal ↗</button>'),
  suRadio: () => { suSync(); render(); },
  suLocate: () => spinner('Fetching Location…', 800, () => { suSync(); Object.assign(S.su.d, { state: 'Gujarat', district: 'Ahmedabad', taluka: 'City', pin: '380015' }); render(); toast('Location filled from your device'); }),
  suSearchChg: () => { suSync(); S.su.search = null; render(); },
  suSearch: () => { suSync(); const r = $('#su'), d = S.su.d; if (!requireFields(r, ['admYear', 'agency', 'level', 'admType', 'searchVal'])) return;
    spinner('Searching your academic record…', 800, () => { const found = !/0$/.test(d.searchVal); S.su.search = found ? 'found' : 'none';
      if (found) { const dd = d.admType === 'D to D';
        Object.assign(d, { searchBy: d.searchBy || SEARCH_BY(d)[0], univ: UNIVS[0], inst: dd ? INSTS[2] : INSTS[0], deg: 'BE/B-Tech', branch: dd ? 'INFORMATION TECHNOLOGY' : 'COMPUTER ENGINEERING', admSys: 'Semester', admSem: dd ? 'Sem-3' : 'Sem-1', curSem: dd ? 'Sem-3' : 'Sem-5', admCat: 'OP', enr: dd ? '' : '230280107045',
          fullName: [d.first, d.middle, d.last].filter(Boolean).join(' '), dob: d.dob || '2005-08-21', cat: d.cat || 'General', religion: d.religion || 'Hindu', pwd: d.pwd || 'No', nonGuj: d.nonGuj || 'No' }); }
      render(); }); },
  suGoStep: el => { suSync(); S.su.reg = +el.dataset.v; render(); suTop(); },
  suPrev: () => { suSync(); S.su.reg--; render(); suTop(); },
  suNext: () => { suSync(); const su = S.su, r = $('#su'), k = su.reg, d = su.d;
    const REQ = [['admYear', 'agency', 'level', 'admType', 'searchVal'], ['last', 'first', 'dob', 'gender', 'cat', 'religion', ...(d.nonGuj === 'Yes' ? ['domState'] : [])], ['addr', 'pin', 'country', 'state', 'district', 'taluka', 'city'], ['univ', 'inst', 'level', 'deg', 'branch', 'admCat', 'admType', 'admSem', 'curSem', ...(enrReq(d) ? ['enr'] : [])]];
    if (k < 4 && !requireFields(r, REQ[k])) return toast('Please fill in all required fields', 1);
    if (k === 0 && su.search !== 'found') return suErr('search', 'Please search for your academic record first before proceeding to the next step.');
    if (k === 2 && !/^\d{6}$/.test(d.pin)) return suErr('pin', 'Please enter a valid 6-digit pincode');
    if (k < 4) { su.reg++; render(); suTop(); return; }
    if (!su.confirm) return suErr('confirm', 'Please confirm that you have reviewed your details');
    const acc = su.acc, rec0 = acc && S.records.find(x => x.id === acc.recId);
    const fields = { enr: d.enr, name: [d.first, d.middle, d.last].filter(Boolean).join(' '), apaar: (d.apaar || '453912337781').replace(/^(\d{6})\d{4}/, '$1XXXX'), deg: d.deg, branch: d.branch, yr: d.admYear, email: d.email || 'new.student@mail.example', mob: (d.mobile || '9800003210').replace(/^(\d{2})\d{4}/, '$1XXXX'), reg: su.viaDL ? 'DIGILOCKER' : 'APAAR', dl: !!su.viaDL, apaarOk: !!d.apaar, sem: d.curSem, gender: d.gender, cat: d.cat, religion: d.religion, agency: d.agency, addr: [d.addr, d.city, d.taluka, d.district, d.state, d.pin].filter(Boolean).join(', '), changed: '' };
    let status;
    if (rec0) { status = 'Updated'; Object.assign(rec0, fields, { status, reason: '' }); }
    else { status = 'Unverified'; const rec = { ...structuredClone(S.records[0]), ...fields, id: Date.now(), status, reason: '' }; S.records.unshift(rec); if (acc) acc.recId = rec.id; }
    if (acc) { acc.reviewed = true; acc.d = structuredClone(d); acc.apaar = d.apaar || acc.apaar; }
    Object.assign(su, { step: 'done', doneStatus: status, justCreated: false, rejReason: '' }); render(); suTop(); },
  // back to the login page with the account's email filled in
  suToLogin: el => { closeModal(); const email = el.dataset.v; S.su = suNew(); go('login');
    if (email) { const u = $('[name="user"]'), p = $('[name="pass"]'); if (u) u.value = email; if (p) { p.value = ''; p.focus(); } } },
  suConfirmChk: el => { S.su.confirm = el.checked; render(); },
  suAddrPreview: () => { suSync(); const d = S.su.d, line = [d.addr, d.city, d.taluka, d.district, d.state, d.pin, d.country || 'India'].filter(Boolean).join(', ');
    openModal('Address Preview', `<div class="addrprev"><div class="mapbox"><span>📍</span></div><div><small class="muted">CURRENT ADDRESS</small><p style="margin-top:4px;line-height:1.6"><b>${esc(line) || 'Fill in the address fields to preview it.'}</b></p></div></div>`, '<button class="btn" data-act="closeModal">Close</button>'); },
  suLogout: () => ask('Logout', '<p>Your account is saved. Sign in any time with your email and password to continue your registration.</p><p class="muted small mt">Details on this page are kept only after you go to the next step.</p>', 'Logout', () => { const email = S.su.d.email; S.su = suNew(); go('login'); const u = $('[name="user"]'); if (u && email) u.value = email; }),
  suResubmit: () => { const acc = S.su.pendingAcc, rec = S.records.find(x => x.id === acc.recId); closeModal(); S.su = suNew({ step: 'reg', post: true, acc, d: structuredClone(acc.d), search: 'found', agree: true, reg: 1, rejReason: rec ? rec.reason : '' }); go('signup'); suTop(); },
  // ---- the registration link sent to pre-registered students (their institute already registered them)
  suInvite: () => openModal('Registration link', `<div class="mailprev"><div class="mh2"><b>Complete your USK registration</b><small>From: Higher Education Department, Gujarat · To: d•••••@mail.example</small></div>
    <p>Dear Diya Shah,</p><p class="mt"><b>${esc(DATA.institute)}</b> has registered you on the Uccha Shiksha Samiksha Kendra (USK) student portal. Click below to confirm your details and set your password.</p>
    <div class="center mt"><button class="btn" data-act="suLink">Complete Registration →</button></div><p class="muted small mt">This link is personal and can be used only once.</p></div>`, '<button class="btn ghost" data-act="closeModal">Close</button>', '', 'What a pre-registered student receives by SMS and email'),
  suLink: () => { closeModal(); if (S.accounts.some(a => a.email === 'diya.shah@mail.example')) return ACT.suLinkUsed(); spinner('Opening your registration link…', 600, () => { S.su = suNew({ link: true, apaarLocked: true, method: 'Email Address', d: { first: 'Diya', last: 'Shah', email: 'diya.shah@mail.example', mobile: '9824517712', apaar: '521904331287' } }); go('signup'); }); },
  suLinkUsed: () => openModal('Link already used', '<div class="center"><div class="okcirc" style="background:#FEF3C7;color:#B45309">!</div><p class="mt">Your account has already been activated. Please log in to proceed.</p></div>', '<button class="btn" data-act="suLinkDone">OK</button>'),
  suLinkDone: () => { closeModal(); S.su = suNew(); go('login'); },
  soonNotify: () => toast('Thank you! We will notify you once this portal is live.')
});
// live password strength (input event, so typing doesn't re-render the form)
document.addEventListener('input', e => { if (e.target.name === 'pw' && e.target.closest('#su')) $('#pwm').innerHTML = pwMeter(e.target.value); });

// Coming Soon page (portal-selection items that are not live yet)
V.soon = () => `${studentHeader()}<div class="swrap"><div class="card sec center soonpg"><div style="font-size:3rem">🚧</div><span class="tag" style="background:#FEF3C7;color:#92400E">Coming Soon</span><h2 class="h-font" style="font-size:1.8rem;color:var(--navy);margin:10px 0 6px">Career Counselling</h2><p class="muted">We are crafting a seamless digital experience for you! We're working on this feature to bring you an even better experience. Stay tuned for upcoming updates.</p>
  <div class="grid3 mt" style="text-align:left">${[['🧭', 'Career Planning', 'Plan your path after graduation'], ['🎓', 'Higher Studies', 'Guidance on PG, abroad and entrance exams'], ['💼', 'Job Readiness', 'Resume, interview and skill-gap tips'], ['🗓', 'Counsellor Sessions', 'Book one-to-one sessions'], ['📊', 'Aptitude Insights', 'Understand your strengths'], ['🔔', 'Alerts', 'Get notified about new sessions']].map(r => `<div class="opp"><b>${r[0]} ${r[1]}</b><p class="small">${r[2]}</p></div>`).join('')}</div>
  <div class="row mt" style="justify-content:center"><button class="btn ghost" data-go="s-dash">← Back</button><button class="btn" data-act="soonNotify">🔔 Get Notified</button></div></div></div>${studentFoot()}`;

// ================================================================== B. placement — company side
const jdBlank = () => ({ id: null, company: 'Nexora Softech', title: '', work: '', type: '', start: '', end: '', vac: '', loc: '', status: 'Draft', descType: 'text', desc: '', doc: '', skills: [], soft: [], steps: [''], elig: {} });
const jdSync = () => { const r = $('#jobform'); if (!r || !S.jd) return; const f = formData(r), e = S.jd.elig;
  ['title', 'work', 'type', 'vac', 'loc', 'desc'].forEach(n => { if (n in f) S.jd[n] = f[n]; }); ['start', 'end'].forEach(n => { if (n in f) S.jd[n] = isoToDmy(f[n]); });
  ['deg', 'branch', 'univ', 'inst', 'sem', 'sgpaOp', 'sgpa', 'country', 'state', 'city', 'ageOp', 'age'].forEach(n => { if ('e_' + n in f) e[n] = f['e_' + n]; });
  S.jd.steps = S.jd.steps.map((s, i) => 'step' + i in f ? f['step' + i] : s); };
const OPS = ['Greater than ( > )', 'Greater than or equal to ( ≥ )', 'Less than ( < )', 'Less than or equal to ( ≤ )', 'Equal to ( = )', 'Not equal to ( ≠ )'];
const opSym = o => (o || '').replace(/^.*\(\s*(.+?)\s*\)$/, '$1');

A['pc-jobs'] = () => {
  const k = 'jp', f = S.af[k] || {}, d = S.afd[k] || f, q = aQ(k);
  const rows = aSorted(k, S.posts.filter(p => (!f.work || p.work === f.work) && (!f.type || p.type === f.type) && (!f.loc || p.loc === f.loc) && (!f.skill || p.skills.includes(f.skill)) && (!f.status || p.status === f.status) && (!q || p.title.toLowerCase().includes(q)))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📝 Job Postings<small>Create job postings with eligibility and selection steps, publish them to eligible students and track applicants.</small></div><span class="end">${aFilterBtn(k)}<button class="btn" data-act="jdNew">＋ Add</button></span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Work Type', 'work', d.work, ['Remote', 'Hybrid', 'On-site'], { ph: 'Select Work Type' })}${aSel('Job Type', 'type', d.type, ['Placement', 'Internship', 'Placements And Internship'], { ph: 'Select Job Type' })}${aSel('Job Location', 'loc', d.loc, [...new Set(S.posts.map(p => p.loc))], { ph: 'Select Job Location' })}${aSel('Skills Required', 'skill', d.skill, [...new Set(S.posts.flatMap(p => p.skills))].sort(), { ph: 'Select Skill' })}${aSel('Status', 'status', d.status, ['Draft', 'Published'], { ph: 'Select Status' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by job title')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'title', 'Job Title'), 'Start Date', 'End Date', 'Job Location', 'Applicants', 'Status', 'Action'], pg.items.map((p, i) => { const n = S.applicants.filter(a => a.postId === p.id).length;
    return `<tr><td>${pg.off + i + 1}</td><td style="min-width:180px"><b>${esc(p.title)}</b><div class="muted small">${esc(p.type || '—')} · ${esc(p.work || '—')}</div></td><td>${p.start || '—'}</td><td>${p.end || '—'}</td><td>${esc(p.loc || '—')}</td><td>${p.status === 'Published' ? `<a class="lnk" data-go="adm" data-sub="pc-applicants" data-param="${p.id}">👥 ${n}</a>` : '—'}</td><td><span class="st ${p.status === 'Published' ? 'green' : 'grey'}">${p.status}</span></td>
    <td style="white-space:nowrap"><button class="iconbtn" title="View" data-go="adm" data-sub="pc-jobview" data-param="${p.id}">👁</button><button class="iconbtn" title="Edit" data-act="jdEdit" data-id="${p.id}">✎</button>${p.status === 'Published' ? `<button class="iconbtn" title="Applicants" data-go="adm" data-sub="pc-applicants" data-param="${p.id}">👥</button>` : ''}<button class="iconbtn del" title="Delete" data-act="jdDel" data-id="${p.id}">🗑</button></td></tr>`; }), 'No job postings found.')}${pg.html}</div>`;
};
A['pc-jobform'] = () => {
  const j = S.jd || (S.jd = jdBlank()), e = j.elig, ef = (l, n, o = {}) => field(l, 'e_' + n, e[n] || '', o);
  const skillPick = (key, opts, ph) => `<div class="row" style="gap:8px;flex-wrap:nowrap"><select class="inp" id="pick-${key}"><option value="">${ph}</option>${opts.filter(x => !j[key].includes(x)).map(x => `<option>${esc(x)}</option>`).join('')}</select><button type="button" class="btn ghost" data-act="jdChip" data-k="${key}">＋ Add</button></div><div class="mt">${chipList(j[key], 'jdChipRm', key)}</div>`;
  const card = (n, t, s, body) => `<div class="card sec"><div class="sech"><span class="stepn">${n}</span><div>${t}<span class="sub">${s}</span></div></div>${body}</div>`;
  return `<div class="crumb"><a data-go="adm" data-sub="pc-jobs">Job Postings</a> › ${j.id ? 'Edit Job Posting' : 'Add Job Posting'}</div><div class="ttlrow"><div class="ttl">${j.id ? '✎ Edit Job Posting' : '＋ Add Job Posting'}<small>Fields marked * are required to publish. You can save a draft with any detail filled in.</small></div></div>
  <div id="jobform">
  ${card(1, 'Basic Details', 'Job title, type, application period and vacancies.', `<div class="grid3">${field('Job Title', 'title', j.title, { req: 1, ph: 'Enter job title' })}${field('Work Type', 'work', j.work, { req: 1, options: ['Remote', 'Hybrid', 'On-site'], ph: 'Select work type' })}${field('Job Type', 'type', j.type, { req: 1, options: ['Placement', 'Internship', 'Placements And Internship'], ph: 'Select job type' })}
    ${field('Application Start Date', 'start', dmyToIso(j.start), { req: 1, type: 'date' })}${field('Application End Date', 'end', dmyToIso(j.end), { req: 1, type: 'date' })}${field('Vacancies', 'vac', j.vac, { req: 1, type: 'number', ph: 'Enter number of vacancies' })}${field('Job Location', 'loc', j.loc, { req: 1, options: [...new Set([...S.posts.map(p => p.loc), 'Rajkot, Gujarat', 'Remote'])], ph: 'Select job location' })}</div>`)}
  ${card(2, 'Job Description', 'Upload a description document or write it here.', `<div class="seg mb">${[['doc', 'UPLOAD DOCUMENT'], ['text', 'WRITE DESCRIPTION']].map(([v, l]) => `<button type="button" class="${j.descType === v ? 'on' : ''}" data-act="jdDescType" data-v="${v}">${l}</button>`).join('')}</div>
    ${j.descType === 'doc' ? `<div class="field"><label>Job Description Document <i>*</i></label><div class="drop" data-act="jdUpload"><span style="font-size:1.6rem">⬆</span><div><b>${j.doc ? '📄 ' + esc(j.doc) : 'Upload job description'}</b><div class="small">PDF · Max size 5 MB</div></div></div><div class="ferr" data-err="doc"></div></div>` : `${field('Description', 'desc', j.desc, { req: 1, area: 1, ph: 'Describe the role, responsibilities and requirements' })}`}`)}
  ${card(3, 'Candidate Eligibility', 'Only students who match these rules see the posting.', `<b class="small">Academic Criteria</b><div class="grid3 mt">${ef('Degree/Program', 'deg', { options: Object.keys(DATA.degrees), ph: 'Select degree/program' })}${ef('Branch/Subject', 'branch', { options: DATA.degrees[e.deg] || DATA.degrees['BE/B-Tech'], ph: 'Select branch/subject' })}${ef('University', 'univ', { options: ['Gujarat Technological University', 'Gujarat University', 'Sardar Patel University'], ph: 'Select university' })}${ef('Institute', 'inst', { options: [DATA.institute, 'Government Engineering College, Gandhinagar'], ph: 'Select institute' })}${ef('Current Semester/Year', 'sem', { options: ['Sem-5', 'Sem-6', 'Sem-7', 'Sem-8'], ph: 'Select current semester/year' })}
      <div class="field"><label>Previous SGPA</label><div class="row" style="gap:6px;flex-wrap:nowrap"><select class="inp" name="e_sgpaOp"><option value="">Select condition</option>${OPS.map(o => `<option ${o === e.sgpaOp ? 'selected' : ''}>${o}</option>`).join('')}</select><input class="inp" style="width:90px" name="e_sgpa" type="number" step="0.1" min="0" max="10" value="${esc(e.sgpa || '')}" placeholder="Value"></div></div></div>
    <b class="small">Location Criteria</b><div class="grid3 mt">${ef('Country', 'country', { options: ['India'], ph: 'Select country' })}${ef('State', 'state', { options: ['Gujarat', 'Maharashtra', 'Rajasthan'], ph: 'Select state' })}${ef('City/District', 'city', { options: CITIES.slice(0, 7), ph: 'Select city/district' })}</div>
    <b class="small">Age Criteria</b><div class="grid3 mt"><div class="field"><label>Age</label><div class="row" style="gap:6px;flex-wrap:nowrap"><select class="inp" name="e_ageOp"><option value="">Select condition</option>${OPS.map(o => `<option ${o === e.ageOp ? 'selected' : ''}>${o}</option>`).join('')}</select><input class="inp" style="width:90px" name="e_age" type="number" min="15" max="60" value="${esc(e.age || '')}" placeholder="Value"></div></div></div>`)}
  ${card(4, 'Skills Required', 'Technical skills come from the Job-Oriented Skill Master; students are matched on them.', `<div class="grid2"><div class="field"><label>Skills Required <i>*</i></label>${skillPick('skills', S.jobSkills, 'Select technical skills (e.g. HTML, CSS, JavaScript)')}<div class="ferr" data-err="skills"></div></div><div class="field"><label>Soft Skills</label>${skillPick('soft', SOFT_SKILLS, 'Select soft skills')}</div></div>`)}
  ${card(5, 'Selection Process', 'Steps come from the Status Master; applicants move through them in order.', `${j.steps.map((s, i) => `<div class="row mb" style="gap:8px;flex-wrap:nowrap"><span class="stepn sm">${i + 1}</span><select class="inp" name="step${i}"><option value="">Select Selection Step ${i + 1}</option>${S.statusMaster.map(x => `<option ${x === s ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>${j.steps.length > 1 ? `<button type="button" class="iconbtn del" title="Remove" data-act="jdStepRm" data-i="${i}">🗑</button>` : ''}</div>`).join('')}<button type="button" class="btn ghost sm" data-act="jdStepAdd">＋ Add Selection Step</button><div class="muted small mt">Need a new step? Add it in <a class="lnk" data-go="adm" data-sub="pc-status">Status Master</a>.</div>`)}
  <div class="row mt"><button class="btn ghost" data-go="adm" data-sub="pc-jobs">Cancel</button><span class="sp"></span><button class="btn ghost" data-act="jdSave" data-v="Draft">💾 Save as draft</button><button class="btn" data-act="jdSave" data-v="Published">🚀 Publish</button></div></div>`;
};
A['pc-jobview'] = () => {
  const p = postOf(S.param), e = p.elig || {}, n = S.applicants.filter(a => a.postId === p.id).length;
  return `<div class="crumb"><a data-go="adm" data-sub="pc-jobs">Job Postings</a> › Job Posting Details</div><div class="ttlrow"><div class="ttl">${esc(p.title)} <span class="st ${p.status === 'Published' ? 'green' : 'grey'}">${p.status}</span><small>${esc(p.company)} · ${esc(p.loc || 'Location not set')}</small></div><span class="end"><button class="btn ghost" data-go="adm" data-sub="pc-jobs">← Back</button>${p.status === 'Published' ? `<button class="btn ghost" data-go="adm" data-sub="pc-applicants" data-param="${p.id}">👥 Applicants (${n})</button>` : ''}<button class="btn" data-act="jdEdit" data-id="${p.id}">✎ Edit Job Posting</button></span></div>
  <div class="card sec"><div class="grid4">${kvRow('Work Type', p.work)}${kvRow('Job Type', p.type)}${kvRow('Application Period', p.start ? `${p.start} – ${p.end}` : '')}${kvRow('Vacancies', p.vac)}</div></div>
  <div class="card sec">${secHead('📄', 'Job Description', 'Role, responsibilities and requirements.')}${p.descType === 'doc' ? (p.doc ? `<button class="btn ghost" data-act="attach" data-v="${esc(p.doc)}">📄 ${esc(p.doc)}</button>` : '<span class="muted">No document uploaded.</span>') : `<p>${esc(p.desc) || '<span class="muted">No description yet.</span>'}</p>`}</div>
  <div class="grid2"><div class="card sec">${secHead('🎓', 'Candidate Eligibility', 'Who can see and apply for this posting.')}<div class="grid2">${kvRow('Degree / Program :', e.deg)}${kvRow('Branch / Subject :', e.branch)}${kvRow('University :', e.univ)}${kvRow('Institute :', e.inst || 'Any institute')}${kvRow('Current Semester/Year :', e.sem)}${kvRow('Previous SGPA :', e.sgpaOp ? `${opSym(e.sgpaOp)} ${e.sgpa}` : '')}${kvRow('Location :', [e.city, e.state, e.country].filter(Boolean).join(', '))}${kvRow('Age :', e.ageOp ? `${opSym(e.ageOp)} ${e.age}` : '')}</div></div>
   <div class="card sec">${secHead('🛠', 'Skills Required', 'Matched against the student\'s Skill Passport.')}<div class="small"><b>Technical :</b></div><div class="mt mb">${chipList(p.skills)}</div><div class="small"><b>Soft Skill :</b></div><div class="mt">${chipList(p.soft)}</div></div></div>
  <div class="card sec">${secHead('🪜', 'Selection Process', 'Steps applicants go through, in order.')}${p.steps.filter(Boolean).length ? `<div class="tl">${p.steps.filter(Boolean).map((s, i) => `<div class="n"><span class="yr">Step ${i + 1}</span><div class="dot">${i + 1}</div><div class="bx"><b>${esc(s)}</b></div></div>`).join('')}</div>` : '<span class="muted">No selection steps added.</span>'}</div>`;
};
A['pc-applicants'] = () => {
  const p = postOf(S.param), k = 'apl' + p.id, q = aQ(k), fs = S.af[k] || {};
  const all = S.applicants.filter(a => a.postId === p.id), rows = all.filter(a => (!fs.status || a.status === fs.status) && (!q || stuOf(a.stuId).name.toLowerCase().includes(q))), pg = aPage(k, rows);
  const cnt = s => all.filter(a => a.status === s).length;
  return `<div class="crumb"><a data-go="adm" data-sub="pc-jobs">Job Postings</a> › Student Applicants</div><div class="ttlrow"><div class="ttl">👥 Student Applicants<small>Review applications and move students through the selection steps.</small></div><span class="end"><button class="btn ghost" data-go="adm" data-sub="pc-jobs">← Back</button><button class="btn ghost" data-act="xlsx" data-v="Applicants_${esc(p.title.replace(/\W+/g, '_'))}.xlsx">⬇ Export Excel</button></span></div>
  <div class="card sec"><div class="grid4">${kvRow('Job Title :', esc(p.title))}${kvRow('Location :', esc(p.loc))}${kvRow('Total Applicant :', all.length)}${kvRow('Application Period :', `${p.start} – ${p.end}`)}</div></div>
  <div class="row wrap mb" style="gap:8px"><button class="chip ${!fs.status ? 'on' : ''}" data-act="aplSt" data-k="${k}" data-v="">All (${all.length})</button>${APP_ST.map(s => `<button class="chip ${fs.status === s ? 'on' : ''}" data-act="aplSt" data-k="${k}" data-v="${s}">${s} (${cnt(s)})</button>`).join('')}</div>
  ${aSearch(k, 'Search by name')}
  <div class="card">${table(['Sr No.', 'Student Name', 'Program', 'Branch', 'Application Date', 'Status', 'Action'], pg.items.map((a, i) => { const s = stuOf(a.stuId);
    return `<tr><td>${pg.off + i + 1}</td><td style="min-width:170px"><b>${esc(s.name)}</b><div class="muted small">SGPA ${s.sgpa} · ${esc(s.sem)}</div></td><td>${esc(s.deg)}</td><td>${esc(s.branch)}</td><td>${a.date}</td><td>${appSt(a.status)}</td><td style="white-space:nowrap"><button class="iconbtn" title="View application" data-go="adm" data-sub="pc-application" data-param="${a.id}">👁</button><button class="btn ghost sm" data-act="aplUpd" data-id="${a.id}">Update Status</button></td></tr>`; }), 'No applicants found.')}${pg.html}</div>`;
};
A['pc-application'] = () => {
  const a = S.applicants.find(x => x.id === S.param) || S.applicants[0], s = stuOf(a.stuId), p = postOf(a.postId);
  return `<div class="crumb"><a data-go="adm" data-sub="pc-jobs">Job Postings</a> › <a data-go="adm" data-sub="pc-applicants" data-param="${p.id}">Student Applicants</a> › Application</div><div class="ttlrow"><div class="ttl">${esc(s.name)} ${appSt(a.status)}<small>Applied for ${esc(p.title)} on ${a.date}</small></div><span class="end"><button class="btn ghost" data-go="adm" data-sub="pc-applicants" data-param="${p.id}">← Back</button><button class="btn ghost" data-act="attach" data-v="${esc(s.name.split(' ')[0])}_Resume.pdf">📄 View Resume</button></span></div>
  <div class="grid2" style="align-items:start"><div><div class="card sec">${secHead('👤', 'Student Information', 'From the student\'s verified profile and Skill Passport.')}<div class="grid2">${kvRow('Enrollment No.', s.enr)}${kvRow('Program', s.deg)}${kvRow('Branch', s.branch)}${kvRow('Semester/Year', s.sem)}${kvRow('SGPA', s.sgpa)}${kvRow('Institute', esc(s.inst))}${kvRow('Email', esc(s.email ? s.email.replace(/^(.).*@/, '$1•••••@') : '—'))}${kvRow('Mobile No.', esc(s.mob || '—'))}</div></div>
    <div class="card sec">${secHead('🛠', 'Skills', 'Job-oriented and soft skills.')}<div class="small"><b>Job-Oriented Skills :</b></div><div class="mt mb">${chipList(s.skills)}</div><div class="small"><b>Soft Skills :</b></div><div class="mt mb">${chipList(s.soft)}</div><div class="small"><b>Preferred Job Location :</b></div><div class="mt">${chipList(s.pref)}</div></div></div>
   <div><div class="card sec">${secHead('🏷', 'Application Status', 'Update the status and add a remark for the student.')}<div id="aplform">${field('Update Status', 'status', a.status, { req: 1, options: [...APP_ST, ...p.steps.filter(Boolean)], ph: 'Select application status' })}${field('Remark', 'remark', '', { area: 1, ph: 'Enter remarks (optional)' })}<button class="btn" data-act="aplSave" data-id="${a.id}">Update Status</button></div></div>
    <div class="card sec">${secHead('🕘', 'Status History', 'Every change made to this application.')}<div class="tl">${a.hist.map((h, i) => `<div class="n"><span class="yr">${h.on}</span><div class="dot">${i + 1}</div><div class="bx"><b>${esc(h.s)}</b><small>${esc(h.by)}${h.remark ? ' · ' + esc(h.remark) : ''}</small></div></div>`).join('')}</div></div></div></div>`;
};
A['pc-status'] = () => {
  const k = 'stm', q = aQ(k), rows = S.statusMaster.map((n, i) => ({ n, i })).filter(x => !q || x.n.toLowerCase().includes(q)), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🏷 Status Master<small>Selection steps used in job postings (for example aptitude test or HR round). Applicants move through them in order.</small></div><span class="end"><button class="btn" data-act="stmAdd">＋ Add</button></span></div>
  ${aSearch(k, 'Search by status name')}
  <div class="card">${table(['Sr No.', 'Status Name', 'Used In', 'Actions'], pg.items.map((x, i) => { const used = S.posts.filter(p => p.steps.includes(x.n)).length; return `<tr><td>${pg.off + i + 1}</td><td><b>${esc(x.n)}</b></td><td>${used ? `${used} job posting${used > 1 ? 's' : ''}` : '<span class="muted">Not used</span>'}</td><td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-act="stmEdit" data-i="${x.i}">✎</button><button class="iconbtn del" title="Delete" data-act="stmDel" data-i="${x.i}">🗑</button></td></tr>`; }), 'No statuses added.')}${pg.html}</div>`;
};
A['pc-students'] = () => {
  const k = 'psv', f = S.af[k] || {}, d = S.afd[k] || f, q = aQ(k);
  const sg = r => !f.sgpa || (f.sgpa === '9 and above' ? r.sgpa >= 9 : f.sgpa === '8 – 8.99' ? r.sgpa >= 8 && r.sgpa < 9 : f.sgpa === '7 – 7.99' ? r.sgpa >= 7 && r.sgpa < 8 : r.sgpa < 7);
  const rows = aSorted(k, POOL.filter(r => (!f.univ || r.univ === f.univ) && (!f.inst || r.inst === f.inst) && (!f.deg || r.deg === f.deg) && (!f.branch || r.branch === f.branch) && (!f.sem || r.sem === f.sem) && sg(r) && (!f.state || r.state === f.state) && (!f.city || r.city === f.city) && (!f.taluka || r.taluka === f.taluka) && (!f.skill || r.skills.includes(f.skill)) && (!f.soft || r.soft.includes(f.soft)) && (!q || r.name.toLowerCase().includes(q)))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🎓 Student View<small>Find students by academics, location and Skill Passport skills, and view their profiles.</small></div><span class="end">${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid4">${aSel('University', 'univ', d.univ, [...new Set(POOL.map(r => r.univ))], { ph: 'Select university' })}${aSel('Institute', 'inst', d.inst, [...new Set(POOL.map(r => r.inst))], { ph: 'Select institute' })}${aSel('Program', 'deg', d.deg, [...new Set(POOL.map(r => r.deg))], { ph: 'Select program' })}${aSel('Branch/Subject', 'branch', d.branch, [...new Set(POOL.map(r => r.branch))], { ph: 'Select branch/subject' })}
    ${aSel('Current Semester/Year', 'sem', d.sem, [...new Set(POOL.map(r => r.sem))].sort(), { ph: 'Select current semester/year' })}${aSel('SGPA', 'sgpa', d.sgpa, ['9 and above', '8 – 8.99', '7 – 7.99', 'Below 7'], { ph: 'Select SGPA range' })}${aSel('Country', 'country', d.country, ['India'], { ph: 'Select country' })}${aSel('State', 'state', d.state, ['Gujarat'], { ph: 'Select state' })}
    ${aSel('City/District', 'city', d.city, [...new Set(POOL.map(r => r.city))].sort(), { ph: 'Select city/district' })}${aSel('Taluka', 'taluka', d.taluka, [...new Set(POOL.map(r => r.taluka))].sort(), { ph: 'Select taluka' })}${aSel('Job-Oriented Skill', 'skill', d.skill, [...new Set(POOL.flatMap(r => r.skills))].sort(), { ph: 'Select job-oriented skill' })}${aSel('Soft Skill', 'soft', d.soft, SOFT_SKILLS, { ph: 'Select soft skill' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by student name')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Student Name'), 'Program', 'Preferred Location', 'Semester/Year', aSortTh(k, 'sgpa', 'SGPA'), 'Action'], pg.items.map((r, i) => `<tr><td>${pg.off + i + 1}</td><td style="min-width:170px"><b>${esc(r.name)}</b><div class="muted small">${esc(r.branch)}</div></td><td>${esc(r.deg)}</td><td>${r.pref.map(esc).join(', ')}</td><td>${esc(r.sem)}</td><td><b>${r.sgpa}</b></td><td><button class="iconbtn" title="View" data-go="adm" data-sub="pc-student" data-param="${r.id}">👁</button></td></tr>`), 'No students match the selected filters.')}${pg.html}</div>`;
};
A['pc-student'] = () => {
  const s = stuOf(S.param), apps = S.applicants.filter(a => a.stuId === s.id);
  return `<div class="crumb"><a data-go="adm" data-sub="pc-students">Student View</a> › Student Profile</div><div class="ttlrow"><div class="ttl">${esc(s.name)}<small>${esc(s.deg)} · ${esc(s.branch)} · ${esc(s.sem)}</small></div><span class="end"><button class="btn ghost" data-go="adm" data-sub="pc-students">← Back</button><button class="btn ghost" data-act="attach" data-v="${esc(s.name.split(' ')[0])}_Skill_Passport.pdf">📄 View Skill Passport</button></span></div>
  <div class="grid2" style="align-items:start"><div class="card sec">${secHead('🎓', 'Academic Details', 'Current admission and performance.')}<div class="grid2">${kvRow('University', esc(s.univ))}${kvRow('Institute', esc(s.inst))}${kvRow('Program', s.deg)}${kvRow('Branch/Subject', s.branch)}${kvRow('Semester/Year', s.sem)}${kvRow('SGPA', s.sgpa)}${kvRow('City/District', s.city)}${kvRow('Taluka', s.taluka)}</div></div>
   <div><div class="card sec">${secHead('🛠', 'Skills', 'From the Skill Passport.')}<div class="small"><b>Job-Oriented Skills :</b></div><div class="mt mb">${chipList(s.skills)}</div><div class="small"><b>Soft Skills :</b></div><div class="mt">${chipList(s.soft)}</div></div>
    <div class="card sec">${secHead('📍', 'Preferred Job Location', 'Where the student wants to work.')}${chipList(s.pref)}</div>
    <div class="card sec">${secHead('📨', 'Applications', 'This student\'s applications to your job postings.')}${apps.length ? apps.map(a => `<div class="opp" data-go="adm" data-sub="pc-application" data-param="${a.id}"><div class="t"><b>${esc(postOf(a.postId).title)}</b>${appSt(a.status)}</div><div class="loc"><span>Applied ${a.date}</span></div></div>`).join('') : '<span class="muted">No applications yet.</span>'}</div></div></div>`;
};
Object.assign(ACT, {
  jdNew: () => { S.jd = jdBlank(); go('adm', 'pc-jobform'); },
  jdEdit: el => { S.jd = structuredClone(postOf(num(el.dataset.id))); if (!S.jd.steps.length) S.jd.steps = ['']; go('adm', 'pc-jobform'); },
  jdChip: el => { jdSync(); const k = el.dataset.k, v = $('#pick-' + k).value; if (!v) return toast('Select a skill first', 1); S.jd[k].push(v); render(); },
  jdChipRm: el => { jdSync(); S.jd[el.dataset.k].splice(+el.dataset.i, 1); render(); },
  jdDescType: el => { jdSync(); S.jd.descType = el.dataset.v; render(); },
  jdUpload: () => { jdSync(); S.jd.doc = (S.jd.title || 'Job').replace(/\W+/g, '_') + '_Description.pdf'; render(); toast('Document uploaded'); },
  jdStepAdd: () => { jdSync(); S.jd.steps.push(''); render(); },
  jdStepRm: el => { jdSync(); S.jd.steps.splice(+el.dataset.i, 1); render(); },
  jdSave: el => { jdSync(); const j = S.jd, pub = el.dataset.v === 'Published', r = $('#jobform');
    if (j.start && j.end && dmyToIso(j.end) < dmyToIso(j.start)) { r.querySelector('[data-err="end"]').textContent = '⚠ Application end date cannot be before the start date.'; return toast('Application end date cannot be before the start date.', 1); }
    if (pub) { let ok = requireFields(r, ['title', 'work', 'type', 'start', 'end', 'vac', 'loc'].concat(j.descType === 'text' ? ['desc'] : []));
      if (j.descType === 'doc' && !j.doc) { r.querySelector('[data-err="doc"]').textContent = '⚠ Please upload the job description document'; ok = false; }
      if (!j.skills.length) { r.querySelector('[data-err="skills"]').textContent = '⚠ Select at least one skill'; ok = false; }
      if (!ok) return toast('Please complete all required fields correctly before publishing.', 1); }
    else if (![j.title, j.work, j.type, j.start, j.end, j.vac, j.loc, j.desc, j.doc].some(Boolean) && !j.skills.length) return toast('Enter at least one detail to save the job posting as a draft.', 1);
    j.steps = j.steps.filter(Boolean); j.status = pub ? 'Published' : 'Draft';
    if (j.id) S.posts[S.posts.findIndex(p => p.id === j.id)] = j; else { j.id = Date.now(); S.posts.unshift(j); }
    // a published posting also appears to students in Career & Placement
    if (pub && !DATA.jobs.some(x => x.id === j.id)) { const c = S.companies.find(x => x.name === j.company) || S.companies[0]; DATA.jobs.unshift({ id: j.id, company: j.company, short: c.short, color: c.color, web: c.web, title: j.title, type: j.type, work: j.work, loc: j.loc, start: j.start, by: `${+j.end.slice(0, 2)} ${MONS3[+j.end.slice(3, 5) - 1]} ${j.end.slice(6)}`, applicants: 0, vacancies: +j.vac, timeline: `${j.start} – ${j.end}`, desc: j.desc || 'See the attached job description.', skills: [...j.skills], rounds: [...j.steps] }); }
    S.jd = null; go('adm', 'pc-jobs'); toast(pub ? 'Job posting published — eligible students can now apply' : 'Job posting saved as draft'); },
  jdDel: el => { const p = postOf(num(el.dataset.id)); ask('Delete Job Posting', `<p>Are you sure you want to delete <b>${esc(p.title)}</b>? ${S.applicants.some(a => a.postId === p.id) ? 'Its applicants will no longer be listed.' : ''}</p>`, 'Delete', () => { S.posts = S.posts.filter(x => x.id !== p.id); S.applicants = S.applicants.filter(a => a.postId !== p.id); render(); toast('Job posting deleted successfully'); }); },
  aplSt: el => { const k = el.dataset.k; S.af[k] = { status: el.dataset.v }; S.pg[k] = 0; render(); },
  aplUpd: el => { const a = S.applicants.find(x => x.id === num(el.dataset.id)), p = postOf(a.postId);
    ask('Update Status', `<p class="muted mb">${esc(stuOf(a.stuId).name)} · ${esc(p.title)}</p>${field('Application Status', 'status', a.status, { req: 1, options: [...APP_ST, ...p.steps.filter(Boolean)], ph: 'Select application status' })}${field('Remark', 'remark', '', { area: 1, ph: 'Enter remarks (optional)' })}`, 'Update Status', s => { if (!requireFields(s, ['status'])) return false; const d = formData(s); aplSet(a, d.status, d.remark); render(); toast('Application status updated successfully'); }); },
  aplSave: el => { const a = S.applicants.find(x => x.id === num(el.dataset.id)), r = $('#aplform'); if (!requireFields(r, ['status'])) return; const d = formData(r); aplSet(a, d.status, d.remark); render(); toast('Application status updated successfully'); },
  stmAdd: () => { S.stmNew = []; const body = () => `<p class="muted small mb">You can add multiple statuses at once.</p><div class="row" style="gap:8px;flex-wrap:nowrap"><input class="inp" name="sname" placeholder="Enter status name"><button type="button" class="btn ghost" data-act="stmPush">＋ Add</button></div><div class="ferr" data-err="sname"></div><div class="mt"><b class="small">Statuses Added:</b> <span id="stmlist">${S.stmNew.length ? S.stmNew.map(esc).join(', ') : '<span class="muted">No statuses added</span>'}</span></div>`;
    ask('Add Status Master', body(), 'Save', s => { const v = s.querySelector('[name="sname"]').value.trim(); if (v) ACT.stmPush(); if (!S.stmNew.length) { s.querySelector('[data-err="sname"]').textContent = '⚠ Add at least one status'; return false; } S.statusMaster.push(...S.stmNew); render(); toast(`${S.stmNew.length} status${S.stmNew.length > 1 ? 'es' : ''} added successfully`); }); },
  stmPush: () => { const s = scope(), i = s.querySelector('[name="sname"]'), v = i.value.trim(), er = s.querySelector('[data-err="sname"]');
    if (!v) { er.textContent = '⚠ Enter status name'; return; } if ([...S.statusMaster, ...S.stmNew].some(x => x.toLowerCase() === v.toLowerCase())) { er.textContent = '⚠ Duplicate — this status already exists'; return; }
    S.stmNew.push(v); i.value = ''; er.textContent = ''; s.querySelector('#stmlist').textContent = S.stmNew.join(', '); i.focus(); },
  stmEdit: el => { const i = +el.dataset.i, old = S.statusMaster[i]; ask('Edit Status Master', field('Status Name', 'sname', old, { req: 1, ph: 'Enter Status Name' }), 'Update', s => { if (!requireFields(s, ['sname'], { sname: 'Enter status name' })) return false; const v = formData(s).sname;
    if (S.statusMaster.some((x, k) => k !== i && x.toLowerCase() === v.toLowerCase())) { s.querySelector('[data-err="sname"]').textContent = '⚠ Duplicate — this status already exists'; return false; }
    S.statusMaster[i] = v; S.posts.forEach(p => { p.steps = p.steps.map(x => x === old ? v : x); }); render(); toast('Status updated successfully'); }); },
  stmDel: el => { const i = +el.dataset.i, n = S.statusMaster[i], used = S.posts.filter(p => p.steps.includes(n)).length;
    if (used) return toast(`"${n}" is used in ${used} job posting${used > 1 ? 's' : ''} and cannot be deleted`, 1);
    ask('Delete Status', `<p>Are you sure you want to delete <b>${esc(n)}</b>?</p>`, 'Delete', () => { S.statusMaster.splice(i, 1); render(); toast('Status deleted successfully'); }); }
});
function aplSet(a, status, remark) { a.status = status; a.hist.push({ s: status, on: dmy(TODAY), by: 'Placement Coordinator', remark: remark || '' }); }

// ================================================================== C. principal — department attendance + department leave report
A['pr-deptatt'] = () => {
  const k = 'dpa', f = S.af[k] || { date: iso(TODAY) }, dd = S.afd[k] || f, q = aQ(k), day = dOf(f.date);
  const rows = aSorted(k, depts().filter(n => !q || n.toLowerCase().includes(q)).map(n => { const ss = S.staff.filter(s => s.dept === n), r = { name: n, emp: ss.length, present: 0, absent: 0, late: 0, early: 0, mins: 0, ot: 0, list: [] };
    ss.forEach(s => { const a = stfDay(s, day), m = txMins(a.tx) || 0, len = a.sh ? toMin(a.sh.end) - toMin(a.sh.start) : 480; if (isIn(a)) r.present++; if (a.status === 'Absent') r.absent++; if (a.late) r.late++; if (a.early) r.early++; r.mins += m; r.ot += Math.max(0, m - len); r.list.push([s, a]); }); return r; })), pg = aPage(k, rows);
  const tot = rows.reduce((t, r) => ({ emp: t.emp + r.emp, present: t.present + r.present, absent: t.absent + r.absent, late: t.late + r.late }), { emp: 0, present: 0, absent: 0, late: 0 });
  return `<div class="ttlrow"><div class="ttl">🏢 Department Attendance Report<small>Department-wise staff attendance for ${dmy(day)}: presence, late marks, early outs and hours.</small></div><span class="end"><button class="btn ghost" data-act="xlsx" data-v="Department_Attendance_${f.date}.xlsx">⬇ Export Excel</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3"><div class="field"><label>Date</label><input class="inp" type="date" name="date" value="${dd.date}" max="${iso(TODAY)}"><div class="ferr" data-err="date"></div></div></div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="dpaReset">✕ Reset</button></div></div>` : ''}
  ${statTiles([['👥', 't', 'Total Employees', tot.emp], ['✓', 'g', 'Present', tot.present], ['✕', 'r', 'Absent', tot.absent], ['⏰', 'a', 'Late Marks', tot.late]])}
  ${aSearch(k, 'Search by department name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Department Name'), 'Employees', 'Present', 'Absent', 'Late Marks', 'Early Outs', 'Overtime Hours', 'Working Hours', 'Action'], pg.items.map((r, i) => `<tr><td>${pg.off + i + 1}</td><td style="min-width:180px"><b>${esc(r.name)}</b></td><td>${r.emp}</td><td style="color:var(--green);font-weight:700">${r.present}</td><td style="color:var(--red);font-weight:700">${r.absent}</td><td>${r.late}</td><td>${r.early}</td><td>${hhmm(r.ot)}</td><td>${hhmm(r.mins)}</td><td><button class="iconbtn" title="View staff" data-act="dpaView" data-v="${esc(r.name)}">👁</button></td></tr>`), 'No departments found.')}${pg.html}</div>`;
};
A['pr-deptleave'] = () => {
  const k = 'dlr', f = S.af[k] || {}, dd = S.afd[k] || f, q = aQ(k), types = S.leavePolicy.map(l => l.cat);
  const appr = S.leaveRequests.filter(l => l.status === 'Approved');
  const rows = aSorted(k, depts().filter(n => (!f.dept || n === f.dept) && (!q || n.toLowerCase().includes(q))).map(n => { const r = { name: n, emp: S.staff.filter(s => s.dept === n).length, total: 0 };
    types.forEach(t => { r[t] = appr.filter(l => l.dept === n && l.type === t).reduce((a, l) => a + (+l.days || 0), 0); r.total += r[t]; }); return r; })), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📑 Department Leave Report<small>Approved leave days taken in each department, by leave type.</small></div><span class="end"><button class="btn ghost" data-act="xlsx" data-v="Department_Leave_Report.xlsx">⬇ Export Excel</button><button class="btn ghost" data-act="dlrPdf">⬇ Export PDF</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Department', 'dept', dd.dept, depts(), { ph: 'Select Department' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search with department name')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Department Name'), 'Total Employees', ...types.map(t => `${esc(t)} <small class="muted">(days)</small>`), 'Total'], pg.items.map((r, i) => `<tr><td>${pg.off + i + 1}</td><td style="min-width:180px"><b>${esc(r.name)}</b></td><td>${r.emp}</td>${types.map(t => `<td>${r[t] || '<span class="muted">0</span>'}</td>`).join('')}<td><b>${r.total}</b></td></tr>`), 'No leave records found.')}${pg.html}</div>`;
};
Object.assign(ACT, {
  dpaReset: () => { S.af.dpa = { date: iso(TODAY) }; S.afd.dpa = null; render(); },
  dpaView: el => { const n = el.dataset.v, day = dOf((S.af.dpa || { date: iso(TODAY) }).date);
    openModal(`${esc(n)} · ${dmy(day)}`, table(['Name', 'Designation', 'Shift', 'Punch In', 'Punch Out', 'Status'], S.staff.filter(s => s.dept === n).map(s => { const a = stfDay(s, day), pin = a.tx.find(t => t[0] === 'Punch In'), pout = [...a.tx].reverse().find(t => t[0] === 'Punch Out');
      return `<tr><td>${esc(s.name)}</td><td>${esc(s.desig)}</td><td>${esc(a.shift)}</td><td>${pin ? hhmm(pin[1]) : '—'}</td><td>${pout ? hhmm(pout[1]) : '—'}</td><td>${st(a.status)}${a.early ? ' <span class="st amber">Early Out</span>' : ''}</td></tr>`; })), '<button class="btn" data-act="closeModal">Close</button>', 'wide', 'Department Attendance Details'); },
  xlsx: el => spinner('Preparing Excel file…', 600, () => toast(el.dataset.v + ' downloaded')),
  dlrPdf: () => spinner('Preparing PDF…', 700, () => toast('Department_Leave_Report.pdf downloaded'))
});

// ================================================================== D. scholarship admin (scheme master)
const SCH_TYPES = ['Merit Based', 'Means Based', 'Category Based', 'Special Scheme'];
A['so-admin'] = () => {
  const k = 'sch', f = S.af[k] || {}, d = S.afd[k] || f, q = aQ(k);
  const rows = aSorted(k, S.schemesAdmin.filter(x => (!f.type || x.type === f.type) && (!f.status || x.status === f.status) && (!q || (x.name + ' ' + x.short).toLowerCase().includes(q)))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🗂 Scholarship Admin<small>Create and manage scholarship schemes: amount, application window and eligibility rules. Active schemes appear to eligible students.</small></div><span class="end">${aFilterBtn(k)}<button class="btn" data-act="schNew">＋ Add Scholarship</button></span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Scholarship Type', 'type', d.type, SCH_TYPES, { ph: 'Select Scholarship Type' })}${aSel('Status', 'status', d.status, ['Active', 'Inactive'], { ph: 'Select Status' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by scholarship name or code...')}
  <div class="card">${table(['Sr. No', aSortTh(k, 'short', 'Short Name'), aSortTh(k, 'name', 'Scholarship Name'), 'Type', 'Assistance Amount (₹)', 'Deadline', 'Status', 'Actions'], pg.items.map((x, i) => `<tr><td>${pg.off + i + 1}</td><td><b>${esc(x.short)}</b></td><td style="min-width:220px">${esc(x.name)}</td><td>${x.type}</td><td>₹${(+x.amount).toLocaleString('en-IN')}</td><td>${x.deadline}</td><td><span class="row" style="gap:8px;flex-wrap:nowrap"><button class="switch ${x.status === 'Active' ? 'on' : ''}" title="Mark ${x.status === 'Active' ? 'inactive' : 'active'}" aria-pressed="${x.status === 'Active'}" data-act="schToggle" data-id="${x.id}"></button><small>${x.status}</small></span></td>
    <td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-act="schEdit" data-id="${x.id}">✎</button><button class="iconbtn del" title="Delete" data-act="schDel" data-id="${x.id}">🗑</button></td></tr>`), 'No scholarships found.')}${pg.html}</div>`;
};
A['so-adminform'] = () => {
  if (!S.schDraft) S.schDraft = { id: null, short: '', name: '', desc: '', type: '', status: 'Active', amount: '', start: '', deadline: '', state: 'Gujarat', provider: '', cats: [], states: ['Gujarat'], genders: ['Male', 'Female', 'Other'], groups: [], ssc: '', hsc: '', income: '', pwd: 'No (Not mandatory)', criteria: '' };
  const x = S.schDraft, multi = (l, key, opts) => `<div class="field"><label>${l}</label><div class="row wrap" style="gap:6px">${opts.map(o => `<label class="chipck ${x[key].includes(o) ? 'on' : ''}"><input type="checkbox" data-act="schMulti" data-k="${key}" value="${esc(o)}" ${x[key].includes(o) ? 'checked' : ''}>${esc(o)}</label>`).join('')}</div></div>`;
  return `<div class="crumb"><a data-go="adm" data-sub="so-admin">Scholarship Admin</a> › ${x.id ? 'Edit' : 'Add'} Scholarship</div><div class="ttlrow"><div class="ttl">${x.id ? '✎ Edit' : '＋ Add'} Scholarship<small>The overview is shown to students; the eligibility rules decide who can apply.</small></div><span class="end"><button class="btn ghost" data-go="adm" data-sub="so-admin">← Back to List</button></span></div>
  <div id="schform"><div class="card sec">${secHead('📋', 'Scholarship General Overview', 'Name, provider, amount and application window.')}<div class="grid3">${field('Full Name', 'name', x.name, { req: 1, ph: 'Enter full scholarship name' })}${field('Short Name', 'short', x.short, { req: 1, ph: 'e.g. MYSY' })}${field('Scholarship Type', 'type', x.type, { req: 1, options: SCH_TYPES })}
    ${field('State', 'state', x.state, { options: ['Gujarat', 'All India'], ph: 'Select State' })}${field('Provider', 'provider', x.provider, { req: 1, ph: 'Department / agency' })}${field('Fixed Financial Amount (₹)', 'amount', x.amount, { req: 1, type: 'number' })}
    ${field('Official Portal Link', 'portal', x.portal || '', { ph: 'Official scholarship portal' })}${field('Start Date', 'start', dmyToIso(x.start), { req: 1, type: 'date' })}${field('Application Deadline Date', 'deadline', dmyToIso(x.deadline), { req: 1, type: 'date' })}</div>
    ${field('Scholarship Description', 'desc', x.desc, { req: 1, area: 1, ph: 'Enter general description and objectives...' })}${field('Descriptive Criteria Statements', 'criteria', x.criteria, { area: 1, ph: 'Enter key criteria statements...' })}</div>
  <div class="card sec">${secHead('✅', 'Eligibility Criteria Rules', 'Students who do not meet these rules see the scheme as "Not eligible".')}
    ${multi('Eligible Categories', 'cats', ['General', 'SEBC', 'SC', 'ST', 'EWS'])}${multi('Eligible Domicile States', 'states', ['Gujarat', 'Other States'])}${multi('Eligible Genders', 'genders', ['Male', 'Female', 'Other'])}${multi('Programme Groups', 'groups', ['Diploma', 'Under Graduate', 'Post Graduate', 'Ph.D.'])}
    <div class="grid4">${field('Minimum SSC Percentage (%)', 'ssc', x.ssc, { type: 'number' })}${field('Minimum HSC Percentage (%)', 'hsc', x.hsc, { type: 'number' })}${field('Max Annual Family Income (₹)', 'income', x.income, { type: 'number' })}${field('PWD / Disability Required?', 'pwd', x.pwd, { options: ['No (Not mandatory)', 'Yes (Only PWD)'] })}</div></div>
  <div class="row"><button class="btn ghost" data-go="adm" data-sub="so-admin">Cancel</button><span class="sp"></span><button class="btn" data-act="schSave">💾 Save Scholarship</button></div></div>`;
};
const schSync = () => { const r = $('#schform'); if (!r) return; const f = formData(r); Object.keys(f).forEach(n => { if (!(n in { cats: 1 })) S.schDraft[n] = ['start', 'deadline'].includes(n) ? isoToDmy(f[n]) : f[n]; }); };
Object.assign(ACT, {
  schNew: () => { S.schDraft = { id: null, short: '', name: '', desc: '', type: '', status: 'Active', amount: '', start: '', deadline: '', state: 'Gujarat', provider: '', cats: [], states: ['Gujarat'], genders: ['Male', 'Female', 'Other'], groups: [], ssc: '', hsc: '', income: '', pwd: 'No (Not mandatory)', criteria: '' }; go('adm', 'so-adminform'); },
  schEdit: el => { S.schDraft = structuredClone(S.schemesAdmin.find(x => x.id === num(el.dataset.id))); go('adm', 'so-adminform'); },
  schMulti: el => { schSync(); const a = S.schDraft[el.dataset.k], v = el.value; el.checked ? a.includes(v) || a.push(v) : a.splice(a.indexOf(v), 1); render(); },
  schSave: () => { schSync(); const r = $('#schform'), x = S.schDraft;
    if (!requireFields(r, ['name', 'short', 'type', 'provider', 'amount', 'start', 'deadline', 'desc'])) return toast('Please fill in all required fields', 1);
    if (dmyToIso(x.deadline) < dmyToIso(x.start)) { r.querySelector('[data-err="deadline"]').textContent = '⚠ Deadline cannot be before the start date'; return; }
    if (!x.cats.length) return toast('Select at least one eligible category', 1);
    if (x.id) S.schemesAdmin[S.schemesAdmin.findIndex(s => s.id === x.id)] = x; else { x.id = Date.now(); S.schemesAdmin.unshift(x); DATA.scholarshipLinks.push([x.short, '#EEF2FF', '#3730A3', x.name, `₹${(+x.amount).toLocaleString('en-IN')} assistance`]); }
    go('adm', 'so-admin'); toast('Scholarship saved successfully'); },
  schToggle: el => { const x = S.schemesAdmin.find(s => s.id === num(el.dataset.id)); x.status = x.status === 'Active' ? 'Inactive' : 'Active'; render(); toast(`${x.short} marked ${x.status.toLowerCase()}`); },
  schDel: el => { const x = S.schemesAdmin.find(s => s.id === num(el.dataset.id)); ask('Delete Scholarship', `<p>Are you sure you want to delete <b>${esc(x.name)}</b>? Students will no longer see this scheme.</p>`, 'Delete', () => { S.schemesAdmin = S.schemesAdmin.filter(s => s !== x); render(); toast('Scholarship deleted successfully'); }); }
});

// ================================================================== E. skill passport additions (rendered from student.js)
const skillScore = () => { const s = ME(), parts = [['Skills', Math.min(25, s.skills.length * 4)], ['Certifications', Math.min(25, S.certs.length * 6)], ['Internships', Math.min(20, S.internships.length * 10)], ['Projects', Math.min(15, S.projects.length * 6)], ['Achievements', Math.min(15, S.special.length * 5)]], tot = parts.reduce((a, p) => a + p[1], 0);
  return `<div class="skscore"><div class="ring" style="--p:${tot}"><b>${tot}</b><small>/100</small></div><div style="flex:1"><b>Skill Score</b> ${itip('Calculated from your skills, certifications, internships, college projects and special achievements. Add more to raise it.')}<div class="muted small">Companies see this score with your Skill Passport.</div>
    <div class="skparts">${parts.map(([l, v]) => `<span><i style="width:${v / (l === 'Skills' || l === 'Certifications' ? 25 : l === 'Internships' ? 20 : 15) * 100}%"></i>${l}</span>`).join('')}</div></div></div>`; };
const projSec = () => `<div class="card sec">${secHead('🛠', 'College Projects', 'What you built, and how you built it.', '<button class="btn round" data-act="projAdd">＋ Add Project</button>')}
  ${S.projects.length ? `<div class="grid3">${S.projects.map(p => `<div class="cert"><div class="h"><span class="ci">🛠</span><span class="tag" style="background:var(--navy);color:#fff">${esc(p.role || 'Team member')}</span></div><h4>${esc(p.title)}</h4><div class="kv2"><span>Duration</span><b>${p.start} – ${p.end || 'Ongoing'}</b></div><div class="kv2"><span>Team Size</span><b>${esc(p.team || '—')}</b></div><div class="mt">${p.tech.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    <div class="row mt"><button class="btn ghost sm" style="flex:1" data-act="projView" data-id="${p.id}">👁 View Project</button><button class="iconbtn" title="Edit" data-act="projAdd" data-id="${p.id}">✎</button><button class="iconbtn del" title="Delete" data-act="projDel" data-id="${p.id}">🗑</button></div></div>`).join('')}</div>` : '<div class="empty">No college projects added yet.</div>'}</div>`;
Object.assign(ACT, {
  projAdd: el => { const p = S.projects.find(x => x.id === num(el.dataset.id)) || { tech: [] }, ym = s => s ? s.split('/').reverse().join('-') : '';
    ask(p.id ? 'Edit College Project' : 'Add College Project', `<div class="grid2">${field('Project Title', 'title', p.title || '', { req: 1, ph: 'Enter Project Title' })}${field('Your Role', 'role', p.role || '', { ph: 'e.g. Backend Developer' })}${field('Team Size', 'team', p.team || '', { type: 'number', ph: 'Enter Team Size' })}${field('Technologies / Skills Used', 'tech', p.tech.join(', '), { req: 1, ph: 'Comma separated, e.g. Java, MySQL' })}${field('Start Date', 'start', ym(p.start), { req: 1, type: 'month' })}${field('End Date', 'end', ym(p.end), { type: 'month' })}</div><div class="muted small" style="margin:-8px 0 10px">Leave the end date empty if the project is ongoing.</div>
      ${field('Project Link', 'link', p.link ? 'https://' : '', { ph: 'GitHub / live demo link (https://…)' })}${field('Description', 'desc', p.desc || '', { area: 1, ph: 'Briefly describe the problem, your contribution and the outcome.' })}`, 'Save', s => { if (!requireFields(s, ['title', 'tech', 'start'])) return false; const d = formData(s);
      if (d.link && d.link !== 'https://' && !/^https?:\/\/\S+\.\S+/.test(d.link)) { s.querySelector('[data-err="link"]').textContent = '⚠ Please enter a valid project link starting with https://'; return false; }
      if (d.end && d.end < d.start) { s.querySelector('[data-err="end"]').textContent = '⚠ End date cannot be before the start date'; return false; }
      const v = { id: p.id || Date.now(), title: d.title, role: d.role, team: d.team, tech: d.tech.split(',').map(x => x.trim()).filter(Boolean), start: d.start.split('-').reverse().join('/'), end: d.end ? d.end.split('-').reverse().join('/') : '', link: d.link && d.link !== 'https://' ? 1 : 0, desc: d.desc };
      if (p.id) S.projects[S.projects.indexOf(p)] = v; else S.projects.push(v); render(); toast(p.id ? 'College project updated successfully' : 'College project added successfully'); }, 'wide'); },
  projView: el => { const p = S.projects.find(x => x.id === num(el.dataset.id));
    openModal(esc(p.title), `<div class="grid3 mb">${kvRow('Your Role', esc(p.role))}${kvRow('Team Size', esc(p.team))}${kvRow('Duration', `${p.start} – ${p.end || 'Ongoing'}`)}</div><div class="small mb"><b>Technologies / Skills Used</b></div>${p.tech.map(t => `<span class="chip">${esc(t)}</span>`).join('')}<div class="small mt"><b>Description</b></div><p>${esc(p.desc) || '—'}</p>`, `${p.link ? '<button class="btn ghost" data-act="extlink" data-v="the project link">↗ Open Project Link</button>' : ''}<button class="btn" data-act="closeModal">Close</button>`, '', 'College Project Details'); },
  projDel: el => { const p = S.projects.find(x => x.id === num(el.dataset.id)); ask('Delete College Project', `<p>Delete <b>${esc(p.title)}</b> from your Skill Passport?</p>`, 'Delete', () => { S.projects = S.projects.filter(x => x !== p); render(); toast('College project deleted successfully'); }); }
});

// ------------------------------------------------------------------ student login after sign-up (profile status, first-login registration)
S.accounts = [{ email: 'rejected@usk.in', mobile: '9811122233', apaar: '612244551190', via: 'SELF', reviewed: true, recId: 9001,
  d: { first: 'Neha', middle: 'Rameshbhai', last: 'Patel', email: 'rejected@usk.in', mobile: '9811122233', apaar: '612244551190', dob: '2006-08-21', gender: 'Female', cat: 'SEBC', religion: 'Hindu', income: '₹2,50,001 – ₹4,50,000', pwd: 'No', nonGuj: 'No', state: 'Gujarat', district: 'Vadodara', taluka: 'City', pin: '390007', addr: '22, Narmada Park, Akota', city: 'Vastrapur', country: 'India', fullName: 'Neha Rameshbhai Patel', searchBy: '12th Seat No.', searchVal: 'C5512341', level: 'UG', admYear: '2024-2025', agency: 'ACPC', univ: 'Gujarat Technological University', inst: DATA.institute, deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', admCat: 'SEBC', admType: 'Regular', admSys: 'Semester', admSem: 'Sem-1', curSem: 'Sem-3', enr: '240280116077', univ: UNIVS[0], sscBoard: 'GSEB', sscSeat: 'B5512340', sscPct: '88.40', sscYear: '2022', hscBoard: 'GSEB', hscSeat: 'C5512340', hscPct: '79.60', hscYear: '2024' } },
  { email: 'blocked@usk.in', mobile: '9811144455', apaar: '612244559912', via: 'SELF', reviewed: true, blocked: true, recId: null, d: {} }];
S.records.push({ ...structuredClone(S.records[0]), id: 9001, enr: '240280116077', name: 'Neha Rameshbhai Patel', apaar: '612244XXXX90', branch: 'INFORMATION TECHNOLOGY', yr: '2024-2025', email: 'rejected@usk.in', mob: '98XXXX2233', reg: 'APAAR', status: 'Rejected', reason: 'The HSC seat number does not match the uploaded marksheet. Please enter the seat number exactly as printed.', dl: false, apaarOk: true, sem: 'Sem-3', gender: 'Female', cat: 'SEBC', changed: '' });
const stuLoginBase = ACT.studentLogin;
const statusBox = (icon, title, msg, foot = '<button class="btn" data-act="closeModal">OK</button>') => openModal(title, `<div class="center"><div style="font-size:3rem">${icon}</div><p class="mt">${msg}</p></div>`, foot);
ACT.studentLogin = el => {
  if (!requireFields(el, ['user', 'pass'])) return;
  const u = formData(el).user.trim().toLowerCase(), acc = S.accounts.find(a => [a.email, a.mobile, a.apaar].filter(Boolean).map(x => x.toLowerCase()).includes(u));
  if (!acc) return stuLoginBase(el);
  if (acc.blocked) return statusBox('⛔', 'Account Blocked', 'Your account has been blocked. Please contact your administrator for further assistance.');
  // account created but details not submitted yet → continue at step 4 (Your Details)
  if (!acc.reviewed) return spinner('Signing you in…', 600, () => { S.su = suNew({ step: acc.apaar ? 'reg' : 'apaar', post: true, acc, d: structuredClone(acc.d), agree: true, viaDL: acc.via === 'DIGILOCKER' || !!acc.viaDL });
    go('signup'); window.scrollTo(0, 0); toast('Welcome back! Continue filling in your details.'); });
  const rec = S.records.find(x => x.id === acc.recId), st = rec ? rec.status : 'Unverified';
  if (st === 'Verified') return stuLoginBase(el);
  if (st === 'Rejected') { S.su.pendingAcc = acc; return openModal('Profile Verification Rejected', `<div class="center"><div style="font-size:3rem">✕</div></div><div class="infobox warn mt"><b>Reason:</b> ${esc(rec.reason || 'No remarks provided.')}</div><p class="mt">Please update your information and submit your profile again.</p>`, '<button class="btn" data-act="suResubmit">OK</button>'); }
  if (st === 'Updated') return statusBox('⏳', 'Profile Under Review', "Your profile has been updated and is currently under review. You'll be able to access the portal once it has been approved.");
  return statusBox('⏳', 'Profile Verification Pending', 'Your profile has not been approved yet. Once your administrator approves your profile, you will be able to access the portal.');
};


// ================================================================== Company Admin (recruiting company's own login)
// Placement Coordinator adds a company → a setup email goes to the company's email → the contact sets a password →
// signs in at Company Login → Company Admin workspace with Job Postings and Student View (own postings only).
ROLES.company = { label: 'Company Admin', person: 'Company contact', initials: 'CA', icon: '🏭', desc: 'Job postings and student search for a recruiting company', home: 'pc-jobs' };
NAV.company = [['pc-jobs', '📝', 'Job Postings'], ['pc-students', '🎓', 'Student View']];
NAV.placement = NAV.placement.filter(n => !['pc-jobs', 'pc-students'].includes(n[0]));
// Company Admin is NOT a COGENT segment: companies use their own Company Login (user request); NAV.company drives that workspace only
Object.assign(SEG_INFO, {
  placement: 'Company master (adding a company emails its contact to set up a Company Admin account), and the status master of selection steps used in job postings.'
});
buildAllNav();
// company accounts: the first company is set up already (demo login), the second is still waiting for its setup email to be used
S.companies.forEach((c, i) => { if (!c.acct) c.acct = c.status === 'Blacklisted' ? 'Disabled' : i === 1 ? 'Invited' : 'Active'; if (!c.invitedOn) c.invitedOn = '28/10/2026'; });
const COMPANY_PAGES = ['pc-jobs', 'pc-jobform', 'pc-jobview', 'pc-applicants', 'pc-application', 'pc-students', 'pc-student'];
const coMe = () => S.companies.find(c => c.id === S.coUser) || S.companies[0];
const sameCo = (a, b) => { const n = s => String(s || '').toLowerCase().replace(/\b(pvt|private|ltd|limited|llp|inc)\b\.?/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); return n(a) === n(b); };
const isMine = p => sameCo(p.company, coMe().name);
const acctSt = a => `<span class="st ${a === 'Active' ? 'green' : a === 'Invited' ? 'amber' : 'grey'}">${a === 'Invited' ? 'Invited · setup email sent' : a}</span>`;

// company workspace: same layout as COGENT, but only the Company Admin menus and the company's own data
const admBase = V.adm;
V.adm = () => {
  if (S.role !== 'company') return admBase();
  const c = coMe(); let page = S.sub || 'pc-jobs'; if (!COMPANY_PAGES.includes(page)) page = S.sub = 'pc-jobs';
  const cur = navParent(page), nav = NAV.company.map(n => ({ go: 'adm', s: n[0], icon: n[1], label: n[2], on: cur === n[0] }));
  const top = `<span class="rel"><button class="avawrap" data-act="menu" data-v="coava"><span class="ava">${esc(c.short)}</span>${I('chev')}</button>${S.menu === 'coava' ? `<div class="drop-menu"><div class="who"><b>${esc(c.person)}</b><small class="muted">Company Admin · ${esc(c.name)}</small></div><button class="out" data-act="logout">⎋ Logout</button></div>` : ''}</span>`;
  return sideLayout({ title: c.name, subtitle: 'COMPANY ADMIN · PLACEMENT PORTAL', nav, content: (A[page] || A['pc-jobs'])(), top });
};
// own postings only; new postings belong to the signed-in company
const jobsBase = A['pc-jobs'];
A['pc-jobs'] = () => { if (S.role !== 'company') return jobsBase(); const all = S.posts; S.posts = all.filter(isMine); try { return jobsBase(); } finally { S.posts = all; } };
const jdBlankBase = jdBlank;
ACT.jdNew = () => { S.jd = { ...jdBlankBase(), company: S.role === 'company' ? coMe().name : 'Nexora Softech' }; go('adm', 'pc-jobform'); };
const jobFormBase = A['pc-jobform'];
A['pc-jobform'] = () => { const h = jobFormBase(); return S.role === 'company' ? h.replace(/Need a new step\? Add it in <a[^>]*>Status Master<\/a>\./, 'Need another step? Ask the placement coordinator to add it to the Status Master.') : h; };
// a company can only open its own postings and applications
const guard = (k, ok) => { const base = A[k]; A[k] = () => S.role === 'company' && !ok() ? A['pc-jobs']() : base(); };
guard('pc-jobview', () => isMine(postOf(S.param))); guard('pc-applicants', () => isMine(postOf(S.param)));
guard('pc-application', () => { const a = S.applicants.find(x => x.id === S.param); return a && isMine(postOf(a.postId)); });

// Company Details: the company's admin account (setup email)
const coDetailBase = A['pc-codetail'];
A['pc-codetail'] = () => { const h = coDetailBase(), c = S.companies.find(x => x.id === S.param) || S.companies[0], at = h.indexOf('Registration Details'); if (at < 0) return h;
  const start = h.lastIndexOf('<div class="card sec">', at);
  const box = `<div class="card sec coacct">${secHead('🔑', 'Company Admin Account', 'The company signs in at Company Login to post jobs and view students.', c.acct === 'Disabled' ? '' : `<button class="btn ghost sm" data-act="coInvite" data-id="${c.id}">👁 Preview setup email</button>${c.acct === 'Invited' ? `<button class="btn sm" data-act="coResend" data-id="${c.id}">↻ Resend setup email</button>` : ''}`)}
    <div class="grid3">${kvRow('Account Status', acctSt(c.acct))}${kvRow('Login Email', esc(c.email))}${kvRow(c.acct === 'Active' ? 'Password Set' : 'Setup Email Sent', c.acct === 'Active' ? 'Yes — company can sign in' : c.acct === 'Invited' ? esc(c.invitedOn) : 'Not available while the company is ' + c.status.toLowerCase())}</div></div>`;
  return h.slice(0, start) + box + h.slice(start); };

V['co-shell'] = (body, left) => `<header class="shead">${brand()}<div class="r">${fontLang()}</div></header><div class="login-wrap su-wrap"><div class="card login-card"><div class="login-img"><div class="tx"><span class="tag" style="background:rgba(255,255,255,.2);color:#fff">PLACEMENT PORTAL</span><h2 class="h-font" style="font-size:1.8rem;line-height:1.25;margin:16px 0 10px">${left[0]}</h2><p style="opacity:.85;line-height:1.5">${left[1]}</p></div></div><div class="login-form" id="su">${body}</div></div></div>`;
V['co-setup'] = () => { const c = S.companies.find(x => x.id === S.coSet) || S.companies[0];
  if (c.acct === 'Active') return V['co-shell'](`<h1 class="h-font" style="font-size:1.7rem;color:var(--navy)">Link already used</h1><p class="muted mt">The password for <b>${esc(c.name)}</b> has already been set. Please sign in.</p><button class="btn block mt" style="height:42px" data-go="co-login">Go to Company Login →</button>`, ['Set up your company account', 'Create the password your company will use to post jobs and view eligible students.']);
  return V['co-shell'](`<h1 class="h-font" style="font-size:1.8rem;color:var(--navy)">Set Up Password</h1><p class="muted" style="margin:4px 0 14px">Create a password for your company account.</p>
    ${field('Company', 'coname', c.name, { ro: 1 })}${field('Login Email', 'coemail', c.email, { ro: 1 })}
    ${field('New Password', 'pw', '', { req: 1, type: 'password', ph: 'Enter new password' })}<div id="pwm">${pwMeter('')}</div>${field('Confirm Password', 'pw2', '', { req: 1, type: 'password', ph: 'Re-enter new password' })}
    <button class="btn block mt" style="height:42px" data-act="coSetPw" data-id="${c.id}">Set Password →</button>`, ['Set up your company account', `${esc(DATA.institute)} has added ${esc(c.name)} to the placement portal. Set your password to post jobs and view eligible students.`]); };
V['co-login'] = () => { const demo = S.companies.find(c => c.acct === 'Active') || S.companies[0];
  return V['co-shell'](`<form id="f-co" data-act="coLogin"><h1 class="h-font" style="font-size:2rem;color:var(--navy)">Company Login</h1><p class="muted" style="margin:6px 0 20px">Sign in to manage your job postings</p>
    ${field('Email Address', 'user', '', { req: 1, ph: 'Company email address' })}${field('Password', 'pass', '', { req: 1, type: 'password', ph: 'Enter your password' })}
    <div class="right" style="margin:-2px 0 14px"><a class="small" style="color:var(--navy);font-weight:600" data-act="forgot">Forgot Password?</a></div>
    <button class="btn block" style="height:42px">Sign In →</button>
    <div class="center mt small">Placement coordinator or institute staff? <a style="color:var(--navy);font-weight:700" data-go="cg-login">Sign in with COGENT →</a></div>
    <div class="infobox mt small">Demo: <b>${esc(demo.email)}</b> with any password. A company added by the Placement Coordinator first gets a setup email to create its password.</div></form>`, ['For recruiting companies', 'Post jobs with eligibility and selection steps, review applicants and find students by their Skill Passport skills.']); };

Object.assign(ACT, {
  coInvite: el => { const c = S.companies.find(x => x.id === num(el.dataset.id));
    openModal('Account setup email', `<div class="mailprev"><div class="mh2"><b>Set up your company account — USK Placement Portal</b><small>From: Placement Cell, ${esc(DATA.institute)} · To: ${esc(maskMail(c.email))}</small></div>
      <p>Dear ${esc(c.person)},</p><p class="mt"><b>${esc(DATA.institute)}</b> has added <b>${esc(c.name)}</b> to the USK Placement Portal. Set your password to sign in, create job postings and view eligible students.</p>
      <div class="center mt"><button class="btn" data-act="coSetup" data-id="${c.id}">Set Up Password →</button></div><p class="muted small mt">This link is personal and can be used only once.</p></div>`, '<button class="btn ghost" data-act="closeModal">Close</button>', '', 'Demo: what the company receives'); },
  coResend: el => { const c = S.companies.find(x => x.id === num(el.dataset.id)); c.invitedOn = dmy(TODAY); render(); toast(`Setup email sent again to ${maskMail(c.email)}`); },
  coSetup: el => { closeModal(); S.coSet = num(el.dataset.id); go('co-setup'); window.scrollTo(0, 0); },
  coSetPw: el => { const c = S.companies.find(x => x.id === num(el.dataset.id)), r = $('#su'), p = r.querySelector('[name="pw"]').value, p2 = r.querySelector('[name="pw2"]').value;
    if (!requireFields(r, ['pw', 'pw2'], { pw: 'Please enter a new password', pw2: 'Please confirm your password' })) return;
    if (pwChecks(p).some(x => !x[1])) return suErr('pw', 'Password does not meet all the requirements');
    if (p !== p2) return suErr('pw2', 'Passwords do not match');
    c.acct = 'Active'; openModal('Password created successfully', '<div class="center"><div class="okcirc">✓</div><p class="mt">Please login with your new password.</p></div>', `<button class="btn" data-act="coToLogin" data-v="${esc(c.email)}">Go to Company Login</button>`); },
  coToLogin: el => { closeModal(); S.role = null; go('co-login'); const u = $('#f-co [name="user"]'); if (u && el.dataset.v) { u.value = el.dataset.v; $('#f-co [name="pass"]').focus(); } },
  coLogin: el => { if (!requireFields(el, ['user', 'pass'])) return; const u = formData(el).user.trim().toLowerCase(), c = S.companies.find(x => (x.email || '').toLowerCase() === u);
    if (!c) return toast('Invalid email or password', 1);
    if (c.acct === 'Invited') return openModal('Set up your password first', `<p>Your company account is not set up yet. Use the link in the setup email sent to <b>${esc(maskMail(c.email))}</b> to create your password.</p>`, `<button class="btn ghost" data-act="coResend" data-id="${c.id}">↻ Resend email</button><button class="btn" data-act="coInvite" data-id="${c.id}">Open the email (demo)</button>`);
    if (c.acct !== 'Active' || c.status !== 'Active') return openModal('Account not active', `<p>The account for <b>${esc(c.name)}</b> is not active. Please contact the placement coordinator of ${esc(DATA.institute)}.</p>`, '<button class="btn" data-act="closeModal">OK</button>');
    spinner('Signing you in securely', 800, () => { S.role = 'company'; S.coUser = c.id; S.segOpen = undefined; go('adm', 'pc-jobs'); toast(`Welcome, ${c.person}`); }); }
});
const logoutBase = ACT.logout;
ACT.logout = () => { if (S.role !== 'company') return logoutBase(); S.menu = null; ask('Logout', '<p>Are you sure you want to log out?</p>', 'Logout', () => { S.role = null; go('co-login'); }); };

// ------------------------------------------------------------------ demo data for the Company Admin workspace (Nexora Softech)
(() => { const NX = 'Nexora Softech', E = (o = {}) => ({ deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', univ: 'Gujarat Technological University', inst: '', sem: 'Sem-7', sgpaOp: 'Greater than or equal to ( ≥ )', sgpa: '7.0', country: 'India', state: 'Gujarat', city: '', ageOp: 'Less than or equal to ( ≤ )', age: '25', ...o });
  const more = [
    { id: 201, title: 'React JS Developer Intern', work: 'Hybrid', type: 'Internship', start: '25/10/2026', end: '25/11/2026', vac: '4', loc: 'Ahmedabad, Gujarat', status: 'Published', descType: 'text', desc: 'Build responsive web screens in React and TypeScript with our product team, write unit tests and fix UI bugs. Six-month internship with a stipend of ₹15,000 per month.', doc: '', skills: ['React', 'JavaScript', 'HTML', 'CSS'], soft: ['Teamwork', 'Communication'], steps: ['Coding Round', 'Technical Interview', 'HR Round'], elig: E({ branch: 'INFORMATION TECHNOLOGY' }) },
    { id: 202, title: 'QA Engineer Trainee', work: 'On-site', type: 'Placement', start: '01/11/2026', end: '30/11/2026', vac: '3', loc: 'Ahmedabad, Gujarat', status: 'Published', descType: 'text', desc: 'Write manual and automated test cases with Selenium and Java for our banking products. Annual package ₹4.2 LPA after a three-month training period.', doc: '', skills: ['Selenium', 'Java', 'SQL'], soft: ['Problem Solving', 'Communication'], steps: ['Aptitude Test', 'Technical Interview', 'HR Round'], elig: E({ sgpa: '6.5' }) },
    { id: 203, title: 'Cloud Support Associate', work: 'Remote', type: 'Placements And Internship', start: '10/10/2026', end: '31/10/2026', vac: '5', loc: 'Remote', status: 'Published', descType: 'text', desc: 'Monitor and support customer workloads on AWS, handle tickets and automate routine tasks with shell scripts. Applications closed on 31 Oct 2026.', doc: '', skills: ['AWS', 'Linux', 'Networking'], soft: ['Time Management', 'Communication'], steps: ['Aptitude Test', 'Group Discussion', 'HR Round', 'Offer Letter'], elig: E({ deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY' }) },
    { id: 204, title: 'Data Analyst Intern', work: 'Hybrid', type: 'Internship', start: '05/11/2026', end: '05/12/2026', vac: '2', loc: 'Gandhinagar, Gujarat', status: 'Published', descType: 'doc', desc: '', doc: 'Data_Analyst_Intern_JD.pdf', skills: ['Python', 'SQL', 'Power BI'], soft: ['Critical Thinking'], steps: ['Coding Round', 'HR Round'], elig: E({ sem: 'Sem-5', ageOp: '', age: '' }) },
    { id: 205, title: 'UI/UX Design Intern', work: 'Remote', type: 'Internship', start: '01/12/2026', end: '', vac: '1', loc: 'Remote', status: 'Draft', descType: 'text', desc: 'Design mobile app screens in Figma and run usability tests with students.', doc: '', skills: ['Figma'], soft: ['Presentation'], steps: ['Technical Interview'], elig: E({ branch: '' }) }
  ].map(p => ({ company: NX, ...p }));
  S.posts.push(...more);
  // applicants: recent postings still in early stages; the closed posting has final results
  const early = ['Applied', 'Applied', 'Under Review', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Pending', 'Rejected'], done = ['Selected', 'Selected', 'Rejected', 'Selected', 'Rejected', 'Rejected', 'Selected', 'Rejected', 'Selected'];
  more.filter(p => p.status === 'Published').forEach((p, k) => { const closed = p.id === 203, n = closed ? 9 : 5 + (k * 2) % 4;
    POOL.filter((_, i) => (i + p.id) % 4 !== 0).slice(0, n).forEach((st, i) => { const status = (closed ? done : early)[i % (closed ? done.length : early.length)];
      const d = Math.min(+p.start.slice(0, 2) + 1 + i % 6, 28), on = `${pad2(d)}/${p.start.slice(3)}`;
      S.applicants.push({ id: p.id * 100 + i, postId: p.id, stuId: st.id, date: on, status, hist: [{ s: 'Applied', on, by: 'Student', remark: '' }, ...(status !== 'Applied' ? [{ s: status, on: closed ? '04/11/2026' : '05/11/2026', by: 'Company Admin', remark: status === 'Selected' ? 'Cleared all selection rounds. Offer letter shared.' : status === 'Rejected' ? 'Did not clear the technical interview.' : status === 'Interview Scheduled' ? 'Technical interview on 12/11/2026 at 11:00 AM.' : '' }] : [])] }); }); });
})();
