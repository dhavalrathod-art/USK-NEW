/* COGENT role screens (institute / government side). All pages render through V.adm with S.sub = page id. */
const SOON = ' <span class="soon">Coming soon</span>';   // tag for menu items that are planned but not built yet
const NAV = {
  // { fold } = collapsible sidebar group; its kids are [page, label]
  admin: [['sa-records', '👥', 'Student Records'], { fold: 'Division Management', icon: '🗂', kids: [['sa-divcfg', 'Division Configuration'], ['sa-divassign', 'Division Assignment']] },
    ['sa-promote', '⬆', `Student Promotion / Detention${SOON}`], ['sa-detained', '⏸', `Detained Students${SOON}`],
    { fold: 'Student Management', icon: '👤', kids: [['sa-os', 'OS Version Compatibility'], ['sa-notif', 'Student Notification Management']] }, ['sa-ann', '📢', 'Government Announcement'], ['sa-dash', '📊', 'Education Dashboard Analytics']],
  hod: [{ fold: 'Student Management', icon: '🎓', kids: [['hod-dash', 'Dashboard'], ['hod-register', 'Attendance Register'], ['hod-report', 'Attendance Report'], ['hod-holiday', 'Holiday Configuration'], ['hod-weekoff', 'Week Off Configuration']] }],
  principal: [['pr-dash', '▦', 'Dashboard'], { fold: 'Shifts Management', icon: '⏱', kids: [['pr-shift', 'Shift Setup'], ['pr-assign', 'Shift Assignment'], ['pr-sched', 'Shift Schedule']] },
    { fold: 'Attendance Management', icon: '🕘', kids: [['pr-records', 'Attendance Record'], ['pr-reports', 'Attendance Reports']] }, ['pr-holidays', '🗓', 'Academic Holiday Calendar'], ['pr-location', '📍', 'Institute Location Management'],
    { fold: 'Faculty Leave Management', icon: '🌴', kids: [['pr-requests', 'Faculty Leave Requests ?'], ['pr-alloc', 'Faculty Leave Allocation ?'], ['pr-policy', 'Leave Policy Configuration ?'], ['pr-workflow', 'Leave Approval Workflow ?']] }],
  staff: [['st-dash', '▦', 'Dashboard'], { grp: 'Staff Management' }, ['st-policy', '📘', 'Leave Configuration ?', 1], ['st-leaves', '🌴', 'Leave History ?', 1], ['st-shift', '🗓', 'My Shift Scheduling', 1], ['st-att', '⏱', 'Attendance History', 1], ['st-holidays', '🎉', 'Academic Holiday Calendar', 1]],
  skill: [['sk-master', '🏅', 'Skill Master'], ['sk-job', '💼', 'Job-Oriented Skill Master'], ['sk-ach', '🏆', 'Student Skill Achievements']],
  scholar: [['so-apps', '🎓', 'Scholarship Applications']],
  placement: [['pc-companies', '🏢', 'Company List']]
};
const searchBox = (ph, name = 'q') => `<div class="search">${I('search')}<input class="inp" name="${name}" placeholder="${ph}" data-act="liveSearch" value="${esc(S.filters[name] || '')}"></div>`;
const matchQ = (row, name = 'q') => { const q = (S.filters[name] || '').toLowerCase(); return !q || Object.values(row).join(' ').toLowerCase().includes(q); };
const statTiles = arr => `<div class="grid${arr.length} mb">${arr.map(([ic, cls, l, v]) => `<div class="card stat"><span class="si ${cls}">${ic}</span><div><small>${l}</small><b>${v}</b></div></div>`).join('')}</div>`;

// All-features demo account: every role becomes one collapsible segment holding that role's pages.
// Order follows the COGENT workspace; nested folds of a role are flattened into its segment.
// segments grouped as in the sidebar: everything about students first, then staff (user request)
const SEG_GROUPS = [['Students', ['admin', 'hod', 'skill', 'scholar', 'placement']], ['Staff', ['principal', 'staff']]];
const SEGMENTS = SEG_GROUPS.flatMap(g => g[1]);
const segPages = k => NAV[k].flatMap(n => n.grp ? [] : n.fold ? n.kids : [[n[0], n[2]]]);
const buildAllNav = () => { NAV.all = [['all-home', '⭐', 'All Features'], ...SEG_GROUPS.flatMap(([g, ks]) => [{ grp: g }, ...ks.map(k => ({ fold: ROLES[k].label, key: 'seg-' + k, icon: ROLES[k].icon, kids: segPages(k) }))])]; };
buildAllNav();
// detail / form pages that belong to a list page in the sidebar
const navParent = p => p === 'so-review' ? 'so-apps' : p === 'sa-annform' ? 'sa-ann' : p.startsWith('pc-co') ? 'pc-companies'
  : ['pc-jobform', 'pc-jobview', 'pc-applicants', 'pc-application'].includes(p) ? 'pc-jobs' : p === 'pc-student' ? 'pc-students' : p === 'so-adminform' ? 'so-admin' : p;
const segOf = page => SEGMENTS.find(k => segPages(k).some(c => c[0] === navParent(page)));

V.adm = () => {
  const page = S.sub || ADMIN_ACCOUNT.home, cur = navParent(page);
  const nav = NAV.all.flatMap(n => {
    if (n.grp) return [n];
    // segments of the all-features account work as an accordion (S.segOpen); other folds remember their own state
    if (n.fold) { const key = n.key || n.fold, on = n.kids.some(c => c[0] === cur), open = key.startsWith('seg-') ? (S.segOpen === undefined ? on : S.segOpen === key) : S.navOpen[key] ?? on;
      return [{ fold: n.fold, key, icon: n.icon, on, open }, ...(open ? n.kids.map(c => ({ go: 'adm', s: c[0], label: c[1], sub: 1, on: cur === c[0] })) : [])]; }
    return [{ go: 'adm', s: n[0], icon: n[1], label: n[2], sub: n[3], on: cur === n[0] }];
  });
  const fn = A[page] || (() => '<div class="empty">Page not found</div>');
  // the header shows the segment of the current page
  const seg = segOf(page);
  return sideLayout({ title: DATA.institute, subtitle: seg ? `ALL FEATURES · ${ROLES[seg].label}` : 'ALL FEATURES · DEMO ADMIN', nav, content: fn(), top: adminTop() });
};
const A = {};

// Landing page of the all-features demo account: one card per segment with links to every page
const SEG_INFO = {
  admin: 'Student records and profile verification, divisions, OS versions, student notifications, government announcements and education dashboards.',
  hod: 'Student attendance dashboard, daily register with manual punches, attendance report, student holidays and week-offs.',
  principal: 'Staff attendance: shifts, shift assignment and schedule, attendance records and reports, holiday calendar, campus geofence and faculty leave.',
  staff: 'A staff member’s own view: dashboard, leave configuration and history, shift schedule, attendance history and the holiday calendar (view only).',
  skill: 'Skill master (categories and sub skills), job-oriented skill master, and student skill achievements with certificate details.',
  scholar: 'Review scholarship applications and approve or reject them.',
  placement: 'Placement company master with details, status and blacklisting.'
};
A['all-home'] = () => `<div class="card sec" style="background:linear-gradient(110deg,#16304F,#2F5583);color:#fff;border-bottom:4px solid var(--gold)"><div class="kicker">⭐ COGENT admin account</div><div style="font-size:1.7rem;font-weight:800;margin:6px 0">All COGENT admin features in one place ${itip("Data is shared across segments, as in the real system: a notification published in Student Admin appears in the student’s bell, and a holiday added in the Principal’s calendar changes staff attendance.", 'light')}</div><div style="opacity:.85">Every feature is grouped into segments in the sidebar: student administration, attendance, staff management, skill passport, scholarship and placement.</div></div>
  ${SEG_GROUPS.map(([g, ks]) => `<div class="seggrp">${g}</div><div class="segcards">${ks.map(k => { const r = ROLES[k], pages = segPages(k);
    return `<div class="card sec"><div class="row mb" style="flex-wrap:nowrap"><span class="si" style="font-size:1.3rem">${r.icon}</span><div style="min-width:0"><b style="font-size:1.05rem">${r.label}</b><div class="muted small">${pages.length} screen${pages.length > 1 ? 's' : ''}</div></div></div><p class="muted small mb">${SEG_INFO[k]}</p>
      <div class="row wrap" style="gap:6px">${pages.map(([p, l]) => `<button class="chip" data-go="adm" data-sub="${p}">${l}</button>`).join('')}</div></div>`; }).join('')}</div>`).join('')}`;

// ------------------------------------------------------------------ Student Admin (recording 9)
// Shared table helpers: sortable headers, rounded search, numbered pager with per-page select, filter panel toggle.
const aSortTh = (k, col, label) => { const s = S.asort[k] || {}; return `<button class="sortbtn" data-act="aSort" data-k="${k}" data-v="${col}">${label} ${s.col === col ? (s.dir > 0 ? '↑' : '↓') : '⇅'}</button>`; };
const aSorted = (k, rows) => { const s = S.asort[k]; return s ? [...rows].sort((a, b) => String(a[s.col]).localeCompare(String(b[s.col])) * s.dir) : rows; };
const aSearch = (k, ph) => `<div class="card sec row" style="padding:12px 16px"><span class="sp"></span><div class="nsearch"><input class="inp" name="aq-${k}" placeholder="${ph}" value="${esc(S.af[k + 'q'] || '')}" data-act="aSearch" data-k="${k}"><button class="circ" data-act="aSearch" data-k="${k}" title="Search">${I('search')}</button></div></div>`;
const aQ = k => (S.af[k + 'q'] || '').toLowerCase();
function aPage(k, rows) {
  const per = S.aper[k] || 10, pages = Math.max(1, Math.ceil(rows.length / per)), p = Math.min(S.pg[k] || 0, pages - 1);
  const b = (v, l, dis, on) => `<button class="btn sm ${on ? '' : 'ghost'}" data-act="pg" data-k="${k}" data-v="${v}" data-max="${pages}" ${dis ? 'disabled' : ''}>${l}</button>`;
  return { items: rows.slice(p * per, p * per + per), off: p * per, html: `<div class="pager">Showing ${rows.length ? p * per + 1 : 0} to ${Math.min(rows.length, (p + 1) * per)} of ${rows.length} entries<span class="row" style="gap:6px">${b(0, '«', !p)}${b(p - 1, '‹', !p)}${Array.from({ length: pages }, (_, i) => b(i, i + 1, false, i === p)).join('')}${b(p + 1, '›', p >= pages - 1)}${b(pages - 1, '»', p >= pages - 1)}<select class="inp sm" style="width:auto" data-act="aPer" data-k="${k}">${[10, 25, 50].map(x => `<option ${x === per ? 'selected' : ''}>${x}</option>`).join('')}</select></span></div>` };
}
const aFilterBtn = k => `<button class="btn ${S.afOpen[k] ? '' : 'ghost'} afbtn" data-act="aFilter" data-k="${k}" title="Show / hide filters"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/></svg> Filter</button>`;
const aSel = (label, name, val, options, o = {}) => `<div class="field"><label>${label}${o.req ? ' <i>*</i>' : ''}</label><select class="inp" name="${name}" ${o.act ? `data-act="${o.act}" data-k="${o.k || ''}"` : ''}><option value="">${o.ph || 'Select'}</option>${options.map(x => `<option ${x === val ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select><div class="ferr" data-err="${name}"></div></div>`;
const illus = msg => `<div class="illus"><div class="ib">🗂<span>📄</span></div><p>${msg}</p></div>`;
const branchesOf = deg => DATA.degrees[deg] || [];
const initialsOf = n => { const w = n.split(' '); return (w[0][0] + w[w.length - 1][0]).toUpperCase(); };
const cfgFor = (deg, branch, sem) => S.divcfg.filter(c => c.deg === deg && c.branch === branch && (!sem || c.sem === sem));
const counter = (name, max, val = '') => `<div class="cnt" data-cnt="${name}">${val.length} / ${max} Max. Characters</div>`;
const uploadCircle = (act, label, formats, max, file) => `<div class="upcircle-wrap"><button type="button" class="upcircle ${file ? 'has' : ''}" data-act="${act}">${file ? `<span style="font-size:2.4rem">${file}</span><small>Change image</small>` : `<span style="font-size:1.6rem">📷</span><small>${label}</small>`}</button><div class="small muted center" style="margin-top:10px">Allowed Image formats: <b>${formats}</b><br>Min <b>0 MB</b> &amp; Max <b>${max}</b></div></div>`;

A['sa-records'] = () => {
  const k = 'rec', f = S.af[k] || {}, q = aQ(k), R = S.records;
  const rows = aSorted(k, R.filter(x => (!f.yr || x.yr === f.yr) && (!f.deg || x.deg === f.deg) && (!f.branch || x.branch === f.branch) && (!f.reg || x.reg === f.reg) && (!f.status || x.status === f.status) && (!q || (x.name + ' ' + x.enr).toLowerCase().includes(q))));
  const pg = aPage(k, rows), d = S.afd[k] || f;
  return `<div class="ttlrow"><div class="ttl">👥 Student Records ${itip("Status 'Updated' means the student changed academic or admission details during sign-up. Open the profile to compare and verify; the student cannot log in until it is verified.")}</div><span class="end">${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Academic Year', 'yr', d.yr, [...new Set(R.map(x => x.yr))], { ph: 'Select academic year' })}${aSel('Degree/Program Name', 'deg', d.deg, Object.keys(DATA.degrees), { ph: 'Select degree/program name', act: 'aDraftDeg', k })}${aSel('Branch/Subject Name', 'branch', d.branch, branchesOf(d.deg).length ? branchesOf(d.deg) : [...new Set(Object.values(DATA.degrees).flat())], { ph: 'Select branch/subject name' })}${aSel('Registration Method', 'reg', d.reg, ['DIGILOCKER', 'APAAR'], { ph: 'Select registration method' })}${aSel('Status', 'status', d.status, ['Unverified', 'Verified', 'Updated', 'Rejected'], { ph: 'Select status' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${statTiles([['👤', 'g', 'Registered Students', R.length], ['🛡', 't', 'DigiLocker Verified', R.filter(x => x.dl).length], ['🪪', 'v', 'APAAR / ABC ID Verified', R.filter(x => x.apaarOk).length]])}
  ${aSearch(k, 'Search by name or enrollment no...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'enr', 'Enrollment No.'), aSortTh(k, 'name', 'Name'), 'APAAR / ABC ID', 'Degree / Programme &amp; Branch', 'Academic Year', 'Email Address', 'Mobile No.', 'Registration Method', 'Status', 'Action'],
    pg.items.map((x, i) => `<tr><td>${pg.off + i + 1}</td><td>${x.enr}</td><td style="min-width:170px">${esc(x.name)}</td><td>${x.apaar}</td><td style="min-width:190px"><small style="color:#2563EB">${x.deg}</small><br><b style="color:var(--navy)">${x.branch}</b></td><td>${x.yr}</td><td>${x.email}</td><td>${x.mob}</td><td>${x.reg}</td><td>${st(x.status)}</td>
      <td><span class="rel"><button class="iconbtn" title="Actions" data-act="menu" data-v="rec-${x.id}">⋮</button>${S.menu === 'rec-' + x.id ? `<div class="drop-menu" style="width:190px"><button data-act="viewStudent" data-id="${x.id}">👁 View Profile</button>${x.status === 'Updated' || x.status === 'Unverified' ? `<button data-act="decide" data-id="${x.id}" data-v="Verified">✓ Verify Profile</button><button class="out" data-act="decide" data-id="${x.id}" data-v="Rejected">✕ Reject Profile</button>` : ''}</div>` : ''}</span></td></tr>`), 'No student records found.')}${pg.html}</div>`;
};

// Planned Student Admin features: menu items exist, pages show a "Coming soon" placeholder
const comingSoon = (icon, title, sub, points) => `<div class="ttlrow"><div class="ttl">${icon} ${title} <span class="soon">Coming soon</span><small>${sub}</small></div></div>
  <div class="card sec center" style="padding:48px 24px"><div style="font-size:3rem">🚧</div><h2 style="font-size:1.5rem;margin:12px 0 6px;color:var(--navy)">Coming soon</h2><p class="muted" style="max-width:560px;margin:0 auto 18px">This feature is under development and will be available in an upcoming release.</p>
   <div class="cert" style="max-width:560px;margin:0 auto;text-align:left"><div class="lbl mb">What you will be able to do</div>${points.map(x => `<div class="small" style="padding:4px 0">✓ ${x}</div>`).join('')}</div>
   <button class="btn ghost mt" data-go="adm" data-sub="sa-records">← Back to Student Records</button></div>`;
A['sa-promote'] = () => comingSoon('⬆', 'Student Promotion / Detention', 'Promote eligible students to the next semester or year, or mark them as detained.', ['Select programme, branch and semester to list students', 'Promote students to the next semester / year in bulk', 'Mark a student as detained with a reason', 'Review the promotion summary before confirming']);
A['sa-detained'] = () => comingSoon('⏸', 'Detained Students', 'View and manage students who have been detained in their current semester or year.', ['See all detained students with programme, semester and reason', 'Filter by academic year, programme and branch', 'Release a student from detention and promote later', 'Export the detained students list']);
A['sa-divcfg'] = () => {
  const k = 'cfg', f = S.af[k], d = S.afd[k] || f || {};
  const list = f ? S.divcfg.filter(c => c.deg === f.deg && c.branch === f.branch).sort((a, b) => a.sem.localeCompare(b.sem)) : null;
  return `<div class="ttlrow"><div class="ttl">🗂 Division Configuration</div><span class="end">${aFilterBtn(k)}<button class="btn" data-act="addDivision">＋ Add Division</button></span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Select Degree/Program', 'deg', d.deg, Object.keys(DATA.degrees), { req: 1, ph: 'Select degree/program', act: 'aDraftDeg', k })}${aSel('Select Branch/Subject', 'branch', d.branch, branchesOf(d.deg), { req: 1, ph: 'Select branch/subject' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${!list ? illus('Select Degree/Program and Branch/Subject, then click Apply to view configured divisions.')
    : `<div class="card"><div class="sech" style="padding:16px 16px 0;font-size:1.05rem">${f.deg} · ${f.branch}</div>${table(['Sr No.', 'Semester/Year', 'Divisions', 'Students Assigned', 'Actions'], list.map((c, i) => `<tr><td>${i + 1}</td><td>${c.sem}</td><td>${c.divs.map(v => `<span class="chip">${esc(v)}</span>`).join('')}</td><td>${S.records.filter(r => r.deg === c.deg && r.branch === c.branch && r.sem === c.sem && c.divs.includes(r.div)).length}</td><td><button class="iconbtn" title="Edit" data-act="editDivision" data-id="${c.id}">✎</button><button class="iconbtn del" title="Delete" data-act="delDivision" data-id="${c.id}">🗑</button></td></tr>`), 'No divisions configured for this Degree/Program and Branch/Subject yet. Use + Add Division.')}</div>`}`;
};

A['sa-divassign'] = () => {
  const k = 'asg', f = S.af[k], d = S.afd[k] || f || {};
  let body;
  if (!f) body = illus('Select Degree/Program, Branch/Subject and Semester/Year, then click Apply to view division assignments.');
  else {
    const divs = cfgFor(f.deg, f.branch, f.sem).flatMap(c => c.divs), q = aQ(k);
    const rows = aSorted(k, S.records.filter(r => r.status === 'Verified' && r.deg === f.deg && r.branch === f.branch && r.sem === f.sem && (!q || r.name.toLowerCase().includes(q))));
    const pg = aPage(k, rows), sel = S.asel.filter(id => rows.some(r => r.id === id)), all = rows.length && sel.length === rows.length;
    body = `${divs.length ? '' : `<div class="infobox warn">No divisions are configured for ${f.deg} · ${f.branch} · ${f.sem}. <a style="font-weight:700;color:var(--navy)" data-go="adm" data-sub="sa-divcfg">Configure divisions →</a></div>`}
    <div class="card sec"><div class="row" style="align-items:flex-end"><div><div class="lbl" style="margin-bottom:6px">Bulk Action :</div><div class="row" style="gap:8px"><select class="inp" id="bulkdiv" style="width:180px"><option value="">Assign division</option>${divs.map(v => `<option>${esc(v)}</option>`).join('')}</select><button class="btn" data-act="asBulk" ${sel.length && divs.length ? '' : 'disabled'}>👤+ Assign${sel.length ? ` (${sel.length})` : ''}</button></div></div><span class="sp"></span><div class="nsearch"><input class="inp" name="aq-${k}" placeholder="Search by name..." value="${esc(S.af[k + 'q'] || '')}" data-act="aSearch" data-k="${k}"><button class="circ" data-act="aSearch" data-k="${k}" title="Search">${I('search')}</button></div></div></div>
    <div class="card">${table([`<input type="checkbox" data-act="asAll" ${all ? 'checked' : ''} ${rows.length ? '' : 'disabled'} aria-label="Select all">`, aSortTh(k, 'name', 'Name'), aSortTh(k, 'enr', 'Enrollment No.'), 'Degree/Program', 'Branch/Subject', 'Semester/Year', 'Current Division', 'Assign New Division'],
      pg.items.map(r => `<tr><td><input type="checkbox" data-act="asPick" data-id="${r.id}" ${sel.includes(r.id) ? 'checked' : ''}></td><td>${esc(r.name)}</td><td>${r.enr}</td><td>${r.deg}</td><td>${r.branch}</td><td>${r.sem}</td><td>${r.div ? `<span class="chip on">${esc(r.div)}</span>` : '<span class="muted small">Not assigned</span>'}</td><td><select class="inp sm" style="width:140px" data-act="asOne" data-id="${r.id}" ${divs.length ? '' : 'disabled'}><option value="">Select division</option>${divs.map(v => `<option ${v === r.div ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></td></tr>`), 'No student division assignments found.')}${pg.html}</div>`;
  }
  return `<div class="ttlrow"><div class="ttl">🧩 Division Assignment</div><span class="end">${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Select Degree/Program', 'deg', d.deg, Object.keys(DATA.degrees), { req: 1, ph: 'Select degree/program', act: 'aDraftDeg', k })}${aSel('Select Branch/Subject', 'branch', d.branch, branchesOf(d.deg), { req: 1, ph: 'Select branch/subject' })}${aSel('Select Semester/Year', 'sem', d.sem, DATA.semList, { req: 1, ph: 'Select semester/year' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Cancel</button></div></div>` : ''}${body}`;
};

A['sa-os'] = () => {
  const k = 'os', q = aQ(k), rows = S.osVersions.filter(x => !q || x.app.toLowerCase().includes(q)), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📱 OS Version Compatibility<small>Manage supported OS versions, application compatibility, and version specifications.</small></div><span class="end"><button class="btn" data-act="osForm">＋ Add</button></span></div>
  ${aSearch(k, 'Search by app name')}
  <div class="card">${table(['App Name', 'OS', 'Version', 'Description', 'Actions'], pg.items.map(x => `<tr><td><b>${esc(x.app)}</b></td><td>${x.os === 'iOS' ? '' : '🤖 '}${esc(x.os)}</td><td>${esc(x.ver)} and above</td><td>${esc(x.desc)}</td><td><button class="iconbtn" title="Edit" data-act="osForm" data-id="${x.id}">✎</button><button class="iconbtn del" title="Delete" data-act="osDel" data-id="${x.id}">🗑</button></td></tr>`), 'No OS Version Compatibility Records Available')}${pg.html}</div>`;
};

A['sa-notif'] = () => {
  const k = 'sn', q = aQ(k), rows = S.adminNotifs.filter(x => !q || x.title.toLowerCase().includes(q)), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🔔 Student Notification Management ${itip("Published notifications appear in every student's bell panel and on the Student Notifications page.")}<small>Create, edit, publish, and manage notifications, announcements, and banners for students.</small></div><span class="end"><button class="btn" data-act="snForm">＋ Add Notification</button></span></div>
  ${aSearch(k, 'Search by title')}
  <div class="card">${table(['Image', 'Title', 'Description', 'Published', 'Published Date', 'Actions'], pg.items.map(x => `<tr><td><span class="nthumb lg" style="background:#F1F5F9">${x.img || '🖼'}</span></td><td style="min-width:170px">${esc(x.title)}</td><td><span class="ndesc" style="max-width:360px">${esc(x.desc)}</span></td><td><button class="switch ${x.pub ? 'on' : ''}" data-act="snPub" data-id="${x.id}" title="${x.pub ? 'Published — click to unpublish' : 'Unpublished — click to publish'}" aria-label="Published"></button></td><td>${x.pub ? x.date : '—'}</td><td><button class="iconbtn" title="Edit" data-act="snForm" data-id="${x.id}">✎</button><button class="iconbtn del" title="Delete" data-act="snDel" data-id="${x.id}">🗑</button></td></tr>`), 'No student notifications yet.')}${pg.html}</div>`;
};

A['sa-ann'] = () => {
  const k = 'ann', f = S.af[k] || {}, d = S.afd[k] || f, q = aQ(k), act = a => a.status === 'Published';
  const rows = S.announcements.filter(a => (!f.cat || a.cat === f.cat) && (!f.status || (f.status === 'Active') === act(a)) && (!q || (a.title + ' ' + a.cat).toLowerCase().includes(q))), pg = aPage(k, rows);
  return `${statTiles([['📄', 'b', 'Total Announcements', S.announcements.length], ['📝', 'b', 'Active', S.announcements.filter(act).length], ['🗎', 'b', 'In Active', S.announcements.filter(a => !act(a)).length]])}
  <div class="ttlrow"><div class="ttl">📢 Government Announcement<small>View, search, and manage all government announcements from a single platform.</small></div><span class="end">${aFilterBtn(k)}<button class="btn" data-go="adm" data-sub="sa-annform">＋ Add Announcement</button></span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="row" style="align-items:flex-end">${aSel('Select Category', 'cat', d.cat, Object.keys(DATA.annCats), { ph: 'Select category' })}${aSel('Select Status', 'status', d.status, ['Active', 'Inactive'], { ph: 'Select status' })}<button class="btn" style="margin-bottom:24px" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" style="margin-bottom:24px" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by title, category')}
  <div class="card">${table(['Title', 'Category', 'Status', 'Activation Date', 'Created By', 'Actions'], pg.items.map(a => `<tr><td style="min-width:220px">${esc(a.title)}</td><td>${a.cat}</td><td>${st(act(a) ? 'Active' : 'Inactive')}</td><td>${a.published}</td><td>${esc(a.by)}</td><td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-go="adm" data-sub="sa-annform" data-param="${a.id}">✎</button><button class="iconbtn del" title="Delete" data-act="delAnn" data-id="${a.id}">🗑</button><button class="iconbtn" title="View" data-act="annAdmin" data-id="${a.id}">👁</button></td></tr>`), 'No announcements found.')}${pg.html}</div>`;
};
A['sa-annform'] = () => {
  const a = S.announcements.find(x => x.id === S.param) || {}, on = a.id ? a.status === 'Published' : S.annActive !== false;
  const exp = a.expiry && a.expiry !== '—' && a.expiry !== 'N/A' ? a.expiry.split('/').reverse().join('-') : '';
  return `<div class="ttl mb">📢 ${a.id ? 'Update' : 'Add'} Government Announcement<small>${a.id ? 'Edit the announcement details below.' : 'Create and publish new government announcements for students.'}</small></div>
  <form class="card sec" id="annform" data-act="saveAnn" data-id="${a.id || ''}">
   <div class="grid2">${field('Title', 'title', a.title || '', { req: 1, ph: 'Enter announcement title' })}${field('Category', 'cat', a.cat || '', { req: 1, options: Object.keys(DATA.annCats), ph: 'Select category' })}</div>
   <div class="grid2"><div>${field('Short Summary', 'summary', a.summary || '', { req: 1, area: 1, ph: 'Write short summary' })}${counter('summary', 100, a.summary || '')}</div><div>${field('Full Description', 'desc', a.desc || '', { req: 1, area: 1, ph: 'Write announcement details here' })}${counter('desc', 500, a.desc || '')}</div></div>
   <div class="grid2">${field('Redirection Link (optional)', 'link', a.link ? (a.link.startsWith('http') ? a.link : 'https://' + a.link) : '', { ph: 'https://www.example.com' })}${field('Expiry Date (optional)', 'expiry', exp, { type: 'date' })}</div>
   <div class="grid2"><div class="field"><label>Upload PDF (optional)</label>${a.attach ? `<div class="filebox row" style="background:#F8FAFC"><span>📄 ${esc(a.attach)}</span><span class="sp"></span><button type="button" class="iconbtn" title="View" data-act="attach" data-v="${esc(a.attach)}">👁</button></div>` : `<div class="drop" data-act="fakeUpload"><span style="font-size:1.6rem">⬆</span><div><b>Drag &amp; Drop Your File</b><div class="small">.pdf, .jpeg, .jpg, .png Formats we support<br>Min: 0 MB &amp; Max: 2 MB</div></div></div>`}</div>
    <div class="field"><label>Active</label><button type="button" class="switch ${on ? 'on' : ''}" id="annactive" data-act="annActive" aria-label="Active"></button><div class="small muted" style="margin-top:6px">Active announcements appear on every student dashboard.</div></div></div>
   <div class="row mt"><button type="button" class="btn ghost" data-go="adm" data-sub="sa-ann">← Back</button><span class="sp"></span><button class="btn">💾 ${a.id ? 'Update' : 'Add'} Announcement</button></div></form>`;
};

A['sa-dash'] = () => {
  const k = 'dsh', q = aQ(k), rows = S.dashboards.filter(x => !q || (x.title + ' ' + x.desc).toLowerCase().includes(q)), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📊 Education Dashboard Analytics<small>Manage educational dashboards, analytics integrations, banners, and redirection links.</small></div><span class="end"><button class="btn" data-act="dshForm">＋ Add Dashboard</button></span></div>
  ${aSearch(k, 'Search by title or description')}
  <div class="card">${table(['Image', 'Title', 'Description', 'Redirect URL', 'Actions'], pg.items.map(x => `<tr><td>${dshThumb(x.c)}</td><td style="min-width:170px">${esc(x.title)}</td><td><span class="ndesc" style="max-width:320px">${esc(x.desc)}</span></td><td><a class="ndesc" style="max-width:220px;color:#2563EB" data-act="dshOpen" data-id="${x.id}">${esc(x.url)}</a></td><td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-act="dshForm" data-id="${x.id}">✎</button><button class="iconbtn del" title="Delete" data-act="dshDel" data-id="${x.id}">🗑</button></td></tr>`), 'No dashboards found.')}${pg.html}</div>`;
};
// tiny dashboard preview drawn with bars, used as the table thumbnail
const dshThumb = c => `<span class="dthumb"><i style="height:40%;background:${c}"></i><i style="height:75%;background:${c}"></i><i style="height:55%;background:${c}99"></i><i style="height:90%;background:${c}"></i></span>`;

// ------------------------------------------------------------------ HOD / Teacher: Student Attendance (recording 10)
// Deterministic dummy punches per student per day; manual punches by the HOD (S.punches) override them.
// Holidays (S.stuHolidays) and recurring week-offs (S.weekoff) make a day non-working.
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const hodDept = 'COMPUTER ENGINEERING';
const dOf = s => new Date(s + 'T00:00:00');
function stuDay(stu, d) {
  const key = iso(d), hol = S.stuHolidays.find(h => h.date === key);
  if (d > TODAY) return { status: 'Scheduled', tx: [] };
  if (hol) return { status: 'Holiday', name: hol.name, tx: [] };
  if (S.weekoff.days.includes(DAYS[d.getDay()]) && key >= S.weekoff.from || d.getDay() === 0) return { status: 'Week Off', tx: [] };
  const man = S.punches[stu.enr + '|' + key];
  if (man) return { status: man.length ? 'Present' : 'Absent', tx: man };
  if (stu.enr === S.student.enrollment || stu.name === 'Aarav Patel') { const a = attOf(d); return { status: a.status === 'Present' ? 'Present' : 'Absent', tx: a.tx.map(t => [t[0], t[1], 'app']) }; }
  const h = [...(stu.enr + key)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
  if (h % 7 === 0 || (stu.name === 'Kunal Vora' && h % 3 === 0)) return { status: 'Absent', tx: [] };
  const inM = 525 + h % 40, outM = 980 + (h * 7) % 50;
  return { status: 'Present', tx: key === iso(TODAY) ? [['Punch In', inM, 'app']] : [['Punch In', inM, 'app'], ['Punch Out', outM, 'app']] };
}
const txMins = tx => tx.reduce((s, t, i) => t[0] === 'Punch In' && tx[i + 1] ? s + tx[i + 1][1] - t[1] : s, 0);
const hms = m => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}:00`;
const hodRows = f => DATA.hodStudents.filter(s => (!f.deg || s.deg === f.deg) && (!f.branch || s.branch === f.branch) && (!f.sem || s.sem === f.sem));
const dayStats = (rows, d) => { const a = rows.map(s => stuDay(s, d)), work = a.filter(x => x.status === 'Present' || x.status === 'Absent'), p = work.filter(x => x.status === 'Present').length;
  return { total: rows.length, present: p, absent: work.length - p, working: work.length > 0, pct: work.length ? Math.round(p / work.length * 1000) / 10 : 0, off: a[0]?.status }; };
// line chart for many points: thin labels, no value text
function trendChart(vals, labels) {
  const w = 720, h = 220, pad = 46, step = (w - pad - 24) / Math.max(1, vals.length - 1), every = Math.ceil(vals.length / 7);
  const pts = vals.map((v, i) => [pad + i * step, 20 + (h - 60) * (1 - (v ?? 0) / 100)]);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">${[0, 20, 40, 60, 80, 100].map(g => { const y = 20 + (h - 60) * (1 - g / 100); return `<line x1="${pad}" y1="${y}" x2="${w - 10}" y2="${y}" stroke="#EEF2F6"/><text x="6" y="${y + 4}" font-size="12" fill="#64748B">${g}%</text>`; }).join('')}
    <polyline fill="rgba(79,107,237,.08)" stroke="none" points="${pad},${h - 40} ${pts.map(p => p.join(',')).join(' ')} ${pts[pts.length - 1][0]},${h - 40}"/><polyline fill="none" stroke="#4F6BED" stroke-width="2.5" points="${pts.map(p => p.join(',')).join(' ')}"/>
    ${pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#4F6BED"><title>${labels[i]}: ${vals[i] ?? 0}%</title></circle>${i % every === 0 || i === pts.length - 1 ? `<text x="${p[0]}" y="${h - 16}" font-size="11.5" fill="#64748B" text-anchor="middle">${labels[i]}</text>` : ''}`).join('')}</svg>`;
}
const degSel = (name, val, act, ph = 'Degree/program') => `<select class="inp sm" name="${name}" data-act="${act}" style="width:170px"><option value="">${ph}</option>${Object.keys(DATA.degrees).map(x => `<option ${x === val ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
const brSel = (name, deg, val, act) => `<select class="inp sm" name="${name}" data-act="${act}" style="width:190px"><option value="">Branch/subject</option>${(deg ? branchesOf(deg) : [...new Set(Object.values(DATA.degrees).flat())]).map(x => `<option ${x === val ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
const semSel = (name, val, act) => `<select class="inp sm" name="${name}" data-act="${act}" style="width:150px"><option value="">Semester/year</option>${DATA.semList.map(x => `<option ${x === val ? 'selected' : ''}>${x}</option>`).join('')}</select>`;
function topTable(kind) {
  const f = S.hd[kind], rows = hodRows(f), last = { y: 2026, m: 9 }, days = new Date(last.y, last.m + 1, 0).getDate();
  const list = rows.map(s => { let p = 0, t = 0; for (let i = 1; i <= days; i++) { const a = stuDay(s, new Date(last.y, last.m, i)); if (a.status === 'Present' || a.status === 'Absent') { t++; if (a.status === 'Present') p++; } } return { s, p, a: t - p, t }; })
    .sort((x, y) => kind === 'top' ? y.p - x.p || x.s.name.localeCompare(y.s.name) : y.a - x.a || x.s.name.localeCompare(y.s.name)).slice(0, 5);
  const top = kind === 'top';
  return `<div class="card sec"><div class="sech" style="font-size:1.05rem;color:${top ? '#15803D' : '#DC2626'};flex-wrap:wrap">Top 5 Most ${top ? 'Present' : 'Absent'} Students (Last Month)<span class="end row" style="gap:6px">${degSel('deg', f.deg, 'hdTop', 'Degree/program').replace('data-act="hdTop"', `data-act="hdTop" data-k="${kind}"`)}${brSel('branch', f.deg, f.branch, 'hdTop').replace('data-act="hdTop"', `data-act="hdTop" data-k="${kind}"`)}${semSel('sem', f.sem, 'hdTop').replace('data-act="hdTop"', `data-act="hdTop" data-k="${kind}"`)}</span></div>
    ${table(['Sr No.', 'Name', 'Enrollment No', 'Semester/Year', top ? 'Present/Total' : 'Absent/Total', 'Attendance (%)'], list.map((r, i) => { const pct = r.t ? Math.round((top ? r.p : r.a) / r.t * 100) : 0; return `<tr><td>${pad2(i + 1)}</td><td>${r.s.name}</td><td>${r.s.enr}</td><td>${r.s.sem}</td><td>${top ? r.p : r.a} / ${r.t}</td><td><b style="color:${top ? '#15803D' : '#DC2626'}">${pct}%</b></td></tr>`; }), 'No attendance data available.')}</div>`;
}

A['hod-dash'] = () => {
  const d = dOf(S.hd.date), all = dayStats(DATA.hodStudents, d), n = S.hd.trend;
  // trend over the last n working days (holidays and week-offs are skipped, not plotted as 0%)
  const tdays = []; for (const x = new Date(d); tdays.length < n; x.setDate(x.getDate() - 1)) if (dayStats(DATA.hodStudents, x).working) tdays.unshift(new Date(x));
  const tv = tdays.map(x => dayStats(DATA.hodStudents, x).pct), tl = tdays.map(x => dmy(x, '-').slice(0, 5));
  const sum = S.hd.deg && S.hd.branch ? DATA.semList.map(sem => ({ sem, rows: hodRows({ deg: S.hd.deg, branch: S.hd.branch, sem }) })).filter(x => x.rows.length) : null;
  const tile = (ic, c, l, v) => `<div class="card stat htile" style="border-top:3px solid ${c}"><span class="si" style="background:${c}1A;color:${c}">${ic}</span><div><small>${l}</small><b>${v}</b></div></div>`;
  return `<div class="ttlrow"><div class="ttl">📋 Student Attendance Dashboard</div><span class="end row" style="gap:8px"><b class="small muted">DATE</b><input class="inp" type="date" name="hdDate" value="${S.hd.date}" max="${iso(TODAY)}" data-act="hdDate" style="width:170px"></span></div>
  <div class="card sec" style="background:#E9EEF5"><b style="font-size:1.05rem">Welcome, <span style="color:#2563EB">${ROLES.hod.person.toUpperCase()}</span></b><div class="muted small" style="margin-top:4px">Monitor student attendance, track classroom participation and identify attendance trends at a glance.</div></div>
  <div class="grid4 mb">${tile('🎓', '#2563EB', 'Total Students', all.total)}${tile('✓', '#16A34A', 'Total Present', all.present)}${tile('✕', '#DC2626', 'Total Absent', all.absent)}${tile('◔', '#7C3AED', 'Attendance', all.pct.toFixed(1) + '%')}</div>
  ${all.working ? '' : `<div class="infobox small mb">${dmy(d)} is a ${all.off === 'Holiday' ? 'holiday' : 'week off'} for students, so no attendance is expected.</div>`}
  <div class="card sec"><div class="sech" style="font-size:1.05rem;flex-wrap:wrap">Student Attendance Summary<span class="end row" style="gap:6px">${degSel('deg', S.hd.deg, 'hdSum')}${brSel('branch', S.hd.deg, S.hd.branch, 'hdSum')}</span></div>
   ${!sum ? illus('Select Degree/Program and Branch/Subject to view attendance summary.') : !sum.length ? '<div class="empty">No attendance data available.</div>'
     : table(['Semester/Year', 'Total Students', 'Present', 'Absent', 'Attendance (%)'], sum.map(x => { const s = dayStats(x.rows, d); return `<tr><td>${x.sem}</td><td>${s.total}</td><td style="color:#15803D;font-weight:700">${s.present}</td><td style="color:#DC2626;font-weight:700">${s.absent}</td><td style="width:220px"><div class="bar-track"><i style="width:${s.pct}%"></i></div><small class="muted">${s.pct.toFixed(1)}%</small></td></tr>`; }))}</div>
  <div class="card sec"><div class="sech" style="font-size:1.05rem">Attendance Trend (%)<span class="end">${[[7, 'Week'], [15, '15 Days'], [30, 'Month']].map(([v, l]) => `<button class="chip ${n === v ? 'on' : ''}" data-act="hdTrend" data-v="${v}">${l}</button>`).join('')}</span></div><div class="small muted"><span style="color:#4F6BED">●</span> Attendance Rate · last ${n} working days</div>${trendChart(tv, tl)}</div>
  ${topTable('top')}${topTable('low')}`;
};

A['hod-register'] = () => {
  const k = 'reg', f = S.af[k] || { date: iso(TODAY) }, d = dOf(f.date), dd = S.afd[k] || f, q = aQ(k);
  const rows = aSorted(k, hodRows(f).filter(s => !q || s.name.toLowerCase().includes(q))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📋 Student Attendance Register<small>${dmy(d)} · ${DAYS[d.getDay()]}</small></div><span class="end"><button class="btn ghost" data-act="hodExport" data-k="reg">⬇ Export Excel</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid4">${field('Date', 'date', dd.date, { type: 'date' })}${aSel('Degree/Program', 'deg', dd.deg, Object.keys(DATA.degrees), { ph: 'Select degree/program', act: 'aDraftDeg', k })}${aSel('Branch/Subject', 'branch', dd.branch, branchesOf(dd.deg), { ph: 'Select branch/subject' })}${aSel('Semester/Year', 'sem', dd.sem, DATA.semList, { ph: 'Select semester/year' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'enr', 'Enrollment No.'), aSortTh(k, 'name', 'Name'), 'Degree / Branch', 'Semester/Year', 'Punch In', 'Punch Out', 'Transaction History', 'Total Time'],
    pg.items.map((s, i) => { const a = stuDay(s, d), ins = a.tx.filter(t => t[0] === 'Punch In'), outs = a.tx.filter(t => t[0] === 'Punch Out'), last = a.tx[a.tx.length - 1], open = last && last[0] === 'Punch In', off = a.status === 'Holiday' || a.status === 'Week Off';
      const clock = kind => off ? '' : `<button class="iconbtn sm" title="${kind === 'in' ? 'Punch In' : 'Punch Out'}" data-act="hodPunch" data-enr="${s.enr}" data-v="${kind}">⏱</button>`;
      return `<tr><td>${pg.off + i + 1}</td><td>${s.enr}</td><td class="nw">${s.name}</td><td><small style="color:#2563EB">${s.deg}</small><br><b style="font-weight:600">${s.branch}</b></td><td>${s.sem}</td>
      <td style="white-space:nowrap">${ins.length ? hm(ins[ins.length - 1][1]) : `<span class="muted">--:--</span>`} ${!open ? clock('in') : ''}</td>
      <td style="white-space:nowrap">${outs.length && !open ? hm(outs[outs.length - 1][1]) : `<span class="muted">--:--</span>`} ${open ? clock('out') : ''}</td>
      <td style="white-space:nowrap">${off ? st(a.status === 'Holiday' ? 'Holiday · ' + a.name : 'Week Off') : `Transaction Times : ${a.tx.length} <button class="iconbtn" title="View" data-act="hodTx" data-enr="${s.enr}">👁</button>`}</td><td>${hms(txMins(a.tx))}</td></tr>`; }), 'No students found.')}${pg.html}</div>`;
};

A['hod-report'] = () => {
  const k = 'rpt', f = S.af[k], dd = S.afd[k] || f, q = aQ(k), from = dOf(f.from), to = dOf(f.to);
  const rows = aSorted(k, hodRows(f).filter(s => !q || s.name.toLowerCase().includes(q)).map(s => { let p = 0, m = 0; for (let x = new Date(from); x <= to; x.setDate(x.getDate() + 1)) { const a = stuDay(s, x); if (a.status === 'Present') { p++; m += txMins(a.tx); } } return { ...s, p, m }; })), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📊 Student Attendance Report<small>${dmy(from)} – ${dmy(to)}</small></div><span class="end"><button class="btn ghost" data-act="hodExport" data-k="rpt">⬇ Export Excel</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid4"><div class="field"><label>Date Range</label><div class="row" style="gap:6px;flex-wrap:nowrap"><input class="inp" type="date" name="from" value="${dd.from}" max="${iso(TODAY)}"><span>–</span><input class="inp" type="date" name="to" value="${dd.to}" max="${iso(TODAY)}"></div><div class="ferr" data-err="from"></div></div>${aSel('Degree/Program', 'deg', dd.deg, Object.keys(DATA.degrees), { ph: 'Select degree/program', act: 'aDraftDeg', k })}${aSel('Branch/Subject', 'branch', dd.branch, branchesOf(dd.deg), { ph: 'Select branch/subject' })}${aSel('Semester/Year', 'sem', dd.sem, DATA.semList, { ph: 'Select semester/year' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'enr', 'Enrollment No.'), aSortTh(k, 'name', 'Name'), 'Degree/Program', 'Branch/Subject', 'Semester/Year', 'Present Days', 'Total Time'], pg.items.map((r, i) => `<tr><td>${pg.off + i + 1}</td><td>${r.enr}</td><td class="nw">${r.name}</td><td>${r.deg}</td><td>${r.branch}</td><td>${r.sem}</td><td><b>${r.p}</b></td><td>${pad2(Math.floor(r.m / 60))}:${pad2(r.m % 60)}</td></tr>`), 'No attendance records found for the selected filters.')}${pg.html}</div>`;
};

A['hod-holiday'] = () => {
  const rows = [...S.stuHolidays].sort((a, b) => a.date.localeCompare(b.date)), pg = aPage('hol', rows);
  return `<div class="ttlrow"><div class="ttl">🗓 Student Holiday Configuration<small>Configure holidays for student attendance of your college.</small></div><span class="end"><button class="btn" data-act="holForm">＋ Add Holiday</button></span></div>
  <div class="card">${table(['Sr No.', 'Holiday Name', 'Description', 'Holiday Date', 'Day', 'Actions'], pg.items.map((h, i) => `<tr><td>${pg.off + i + 1}</td><td>${esc(h.name)}</td><td>${esc(h.desc)}</td><td>${dmy(dOf(h.date))}</td><td>${DAYS[dOf(h.date).getDay()]}</td><td><button class="iconbtn" title="Edit" data-act="holForm" data-id="${h.id}">✎</button><button class="iconbtn del" title="Delete" data-act="holDel" data-id="${h.id}">🗑</button></td></tr>`), 'No Student Holiday Configuration Available')}${rows.length ? pg.html : ''}</div>`;
};
A['hod-weekoff'] = () => `<div class="ttlrow"><div class="ttl">🗓 Student Week-off Configuration ${itip("Week-off days are excluded from working days in the dashboard, register and report. Sunday is always a week off.")}<small>Configure recurring weekly off-days for student attendance of your college.</small></div></div>
  <div class="card">${table(['Sr No.', 'Week-off Days', 'Effective From', 'Status', 'Actions'], [`<tr><td>1</td><td>${S.weekoff.days.join(', ')}</td><td>${dmy(dOf(S.weekoff.from))}</td><td>${st('Active')}</td><td><button class="iconbtn" title="Edit" data-act="woForm">✎</button></td></tr>`])}</div>
  <div class="card sec mt"><div class="sech" style="font-size:1.05rem">Previous Week-off Configurations<span class="sub" style="display:inline;margin-left:8px">View only</span></div>${table(['Sr No.', 'Week-off Days', 'Effective From', 'Effective To', 'Updated By', 'Status'], S.weekoffHist.map((h, i) => `<tr><td>${i + 1}</td><td>${h.days.join(', ')}</td><td>${dmy(dOf(h.from))}</td><td>${dmy(dOf(h.to))}</td><td>${esc(h.by)}</td><td>${st('Expired')}</td></tr>`))}</div>`;

// ------------------------------------------------------------------ Principal: staff attendance (recording 13)
// stfDay(staff, date) derives the day from the latest shift assignment, the holiday calendar, week-offs,
// approved leave, manual punches (S.spunch) and deterministic dummy punches.
const toMin = t => { const [h, m] = String(t).split(':').map(Number); return h * 60 + m; };
const isoOfDmy = s => s.split('/').reverse().join('-');
const ordinal = n => n + (['th', 'st', 'nd', 'rd'][n] || 'th');
const WDAY = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shiftOf = id => S.shifts.find(x => x.id === id);
const fullMin = sh => toMin(sh.end) - toMin(sh.start);
function stfShift(s, d) { const key = iso(d), a = S.shiftAssign.filter(x => x.staff.includes(s.id) && x.from <= key).sort((x, y) => y.from.localeCompare(x.from))[0], sh = a && shiftOf(a.shiftId); return sh ? { sh, wo: a.wo } : null; }
function stfDay(s, d) {
  const key = iso(d), hol = S.holidays.find(h => h.date === key), A = stfShift(s, d), sh = A?.sh, base = { shift: sh ? sh.name : 'No Shift', sh };
  if (hol) return { ...base, status: 'Holiday', name: hol.name, tx: [] };
  if (A ? A.wo.includes(`${Math.ceil(d.getDate() / 7)}-${(d.getDay() + 6) % 7 + 1}`) : d.getDay() === 0) return { ...base, status: 'Week Off', tx: [] };
  const lv = S.leaveRequests.find(l => l.status === 'Approved' && l.name === s.name && isoOfDmy(l.from) <= key && key <= isoOfDmy(l.to));
  if (lv) return { ...base, status: 'On Leave', name: lv.type, tx: [] };
  if (d > TODAY) return { ...base, status: 'Scheduled', tx: [] };
  const st = sh ? toMin(sh.start) : 540, en = sh ? toMin(sh.end) : 1020;
  let tx = S.spunch[s.id + '|' + key];
  if (!tx) { const h = [...(s.id + key)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 11);
    if (h % 9 === 0 || (s.id % 13 === 5 && h % 3 === 0)) tx = [];
    else { const inM = st - 14 + h % 36, outM = en - 10 + (h * 7) % 48; tx = key === iso(TODAY) ? [['Punch In', inM, 'app']] : [['Punch In', inM, 'app'], ['Punch Out', outM, 'app']]; } }
  if (!tx.length) return { ...base, status: 'Absent', tx };
  const last = tx[tx.length - 1], late = tx[0][1] > st + (sh ? +sh.late : 15), early = last[0] === 'Punch Out' && last[1] < en - (sh ? +sh.early : 15);
  return { ...base, status: late ? 'Late' : 'Present', late, early, tx };
}
const isWork = a => a.status === 'Present' || a.status === 'Late' || a.status === 'Absent' || a.status === 'On Leave';
const isIn = a => a.status === 'Present' || a.status === 'Late';
const hhmm = m => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
const depts = () => [...new Set(S.staff.map(s => s.dept))].sort(), desigs = () => [...new Set(S.staff.map(s => s.desig))].sort();
const stfFilter = f => S.staff.filter(s => (!f.dept || s.dept === f.dept) && (!f.desig || s.desig === f.desig));
const deptDesig = s => `<small style="color:#2563EB">${esc(s.dept)}</small><br><b>${esc(s.desig)}</b>`;
const ava = (name, c = 'navy') => `<span class="ava ${c}" style="width:34px;height:34px;font-size:.75rem;flex:none">${name.replace(/^(Dr|Prof|Mr|Ms)\.\s*/, '').split(' ').map(w => w[0]).slice(0, 2).join('')}</span>`;
function stfRange(s, from, to) { const r = { work: 0, present: 0, absent: 0, late: 0, early: 0, hol: 0, wo: 0, leave: 0, mins: 0, ot: 0, exp: 0 };
  for (let x = new Date(from); x <= to; x.setDate(x.getDate() + 1)) { const a = stfDay(s, x);
    if (a.status === 'Holiday') r.hol++; else if (a.status === 'Week Off') r.wo++; else if (isWork(a)) { r.work++; r.exp += a.sh ? fullMin(a.sh) : 480;
      if (isIn(a)) { r.present++; const m = txMins(a.tx); r.mins += m; r.ot += Math.max(0, m - (a.sh ? fullMin(a.sh) : 480)); if (a.late) r.late++; if (a.early) r.early++; } else if (a.status === 'Absent') r.absent++; else r.leave++; } }
  return r; }
function workingDaysBack(end, n) { const out = []; for (const x = new Date(end); out.length < n && x > new Date(2026, 0, 1); x.setDate(x.getDate() - 1)) if (S.staff.some(s => isWork(stfDay(s, x)))) out.unshift(new Date(x)); return out; }

A['pr-dash'] = () => {
  const d = dOf(S.pd.date), rows = S.staff.map(s => ({ s, a: stfDay(s, d) })), work = rows.filter(r => isWork(r.a));
  const pres = work.filter(r => isIn(r.a)), late = work.filter(r => r.a.status === 'Late'), abs = work.filter(r => r.a.status === 'Absent'), lv = work.filter(r => r.a.status === 'On Leave');
  const pct = n => work.length ? Math.round(n / work.length * 100) : 0, hr = new Date().getHours(), isT = S.pd.date === iso(TODAY), when = isT ? 'Today' : dmy(d, ' ').replace(/^(\d+) (\d+) /, (m, a, b) => `${a} ${MON[b - 1].slice(0, 3)} `);
  const tile = (ic, c, l, v) => `<div class="card stat htile" style="border-top:3px solid ${c}"><span class="si" style="background:${c}1A;color:${c}">${ic}</span><div><small>${l}</small><b>${v}</b></div></div>`;
  const hol = S.holidays.filter(h => h.date >= S.pd.date).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const byDept = depts().map(dp => { const r = work.filter(x => x.s.dept === dp); return { dp, total: S.staff.filter(s => s.dept === dp).length, p: r.filter(x => isIn(x.a)).length, a: r.filter(x => !isIn(x.a)).length, l: r.filter(x => x.a.status === 'Late').length }; });
  const days = workingDaysBack(d, S.pd.trend), tv = days.map(x => { const w = S.staff.map(s => stfDay(s, x)).filter(isWork); return w.length ? Math.round(w.filter(isIn).length / w.length * 1000) / 10 : 0; });
  const from30 = new Date(d); from30.setDate(from30.getDate() - 29); const rank = S.staff.map(s => ({ s, r: stfRange(s, from30, d) })).filter(x => x.r.work);
  const top = (list, key) => table(['Name', 'Department / Designation', key === 'present' ? 'Present / Total' : 'Absent / Total', 'Attendance'], list.map(x => `<tr><td>${esc(x.s.name)}</td><td>${deptDesig(x.s)}</td><td>${x.r[key]} / ${x.r.work}</td><td><b style="color:${key === 'present' ? '#15803D' : '#DC2626'}">${Math.round(x.r[key] / x.r.work * 100)}%</b></td></tr>`), `No ${key === 'present' ? 'Present' : 'Absent'} Staff Found`);
  return `<div class="ttlrow"><div class="ttl">Good ${hr < 12 ? 'Morning' : hr < 17 ? 'Afternoon' : 'Evening'}, ${ROLES.principal.person}<small>Here's today's attendance, department and leave overview.</small></div><span class="end row" style="gap:8px"><input class="inp" type="date" name="pdDate" value="${S.pd.date}" max="${iso(TODAY)}" data-act="pdDate" style="width:170px"><button class="btn ghost" data-act="pdReset">↻ Reset</button></span></div>
  <div class="grid4 mb">${tile('👥', '#2563EB', 'Total Staff', S.staff.length)}${tile('✓', '#16A34A', 'Total Present', `${pres.length} <small class="muted" style="font-size:.8rem">(${pct(pres.length)}%)</small>`)}${tile('✕', '#DC2626', 'Total Absent', abs.length)}${tile('⏰', '#F59E0B', 'Late Arrival', late.length)}</div>
  ${work.length ? '' : `<div class="infobox mb">${dmy(d)} is ${rows[0].a.status === 'Holiday' ? `a holiday (${esc(rows[0].a.name)})` : 'a week off'} for staff, so no attendance is expected.</div>`}
  <div class="grid2"><div class="card sec"><div class="sech" style="font-size:1.05rem">Staff Availability (${when})</div>${work.length ? donut([['Present Staff', pres.length - late.length, '#16A34A'], ['Late Coming', late.length, '#F59E0B'], ['Absent Staff', abs.length, '#DC2626'], ['On Leave', lv.length, '#8B5CF6']], String(work.length)) : '<div class="empty">No attendance expected.</div>'}</div>
   <div class="card sec"><div class="sech" style="font-size:1.05rem">Upcoming Holidays</div>${table(['Holiday Name', 'Holiday Date', 'Day'], hol.map(h => `<tr><td>${esc(h.name)}</td><td>${dmy(dOf(h.date))}</td><td>${DAYS[dOf(h.date).getDay()]}</td></tr>`), 'No upcoming holidays.')}<div class="center mt"><button class="btn ghost round sm" data-go="adm" data-sub="pr-holidays">View All Holiday Leaves →</button></div></div></div>
  <div class="grid2"><div class="card sec"><div class="sech" style="font-size:1.05rem">Absent Staff (${when}) <span class="tag">${abs.length + lv.length}</span></div><div class="slist">${[...abs, ...lv].map(x => `<div class="row" style="flex-wrap:nowrap">${ava(x.s.name)}<div style="min-width:0"><b>${esc(x.s.name)}</b><div class="muted small">${esc(x.s.dept)} · ${esc(x.s.desig)}</div></div><span class="sp"></span>${st(x.a.status)}</div>`).join('') || '<div class="empty">No absent staff.</div>'}</div></div>
   <div class="card sec"><div class="sech" style="font-size:1.05rem">Staff Attendance (${when})</div><div class="slist" style="padding:0">${table(['Name', 'Designation', 'Clock In', 'Clock Out'], pres.map(x => { const o = x.a.tx.filter(t => t[0] === 'Punch Out').pop(); return `<tr><td>${esc(x.s.name)}</td><td>${esc(x.s.desig)}</td><td>${hm(x.a.tx[0][1])}${x.a.late ? ' <span class="st amber" style="padding:1px 6px">Late</span>' : ''}</td><td>${o && x.a.tx[x.a.tx.length - 1][0] === 'Punch Out' ? hm(o[1]) : '--:--'}</td></tr>`; }), 'No Record Found')}</div></div></div>
  <div class="card sec"><div class="sech" style="font-size:1.05rem">Attendance By Department (${when})</div>${table(['Department', 'Total Staff', 'Present', 'Absent', 'Late', 'Action'], byDept.map(x => { const w = x.p + x.a; return `<tr><td>${esc(x.dp)}</td><td>${x.total}</td><td style="color:#15803D">${x.p} (${w ? Math.round(x.p / w * 100) : 0}%)</td><td style="color:#DC2626">${x.a} (${w ? Math.round(x.a / w * 100) : 0}%)</td><td>${x.l}</td><td><button class="iconbtn" title="View" data-act="pdDept" data-v="${esc(x.dp)}">👁</button></td></tr>`; }))}</div>
  <div class="card sec"><div class="sech" style="font-size:1.05rem">Attendance Trend (%)<span class="end">${[[7, 'Last 07 Days'], [30, 'Last 30 Days']].map(([v, l]) => `<button class="chip ${S.pd.trend === v ? 'on' : ''}" data-act="pdTrend" data-v="${v}">${l}</button>`).join('')}</span></div>${days.length ? trendChart(tv, days.map(x => dmy(x, '-').slice(0, 5))) : '<div class="empty">No Attendance Trend Data Found</div>'}</div>
  <div class="grid2"><div class="card sec"><div class="sech" style="font-size:1.05rem;color:#15803D">Most Present Staff Attendance <small class="muted" style="font-weight:400">· last 30 days</small></div>${top([...rank].sort((a, b) => b.r.present / b.r.work - a.r.present / a.r.work || a.s.name.localeCompare(b.s.name)).slice(0, 5), 'present')}</div>
   <div class="card sec"><div class="sech" style="font-size:1.05rem;color:#DC2626">Most Absent Staff Attendance <small class="muted" style="font-weight:400">· last 30 days</small></div>${top([...rank].filter(x => x.r.absent).sort((a, b) => b.r.absent - a.r.absent || a.s.name.localeCompare(b.s.name)).slice(0, 5), 'absent')}</div></div>`;
};
function deptModalBody() { const { dp, q } = S.pdDept, d = dOf(S.pd.date), rows = S.staff.filter(s => s.dept === dp && (!q || s.name.toLowerCase().includes(q.toLowerCase())));
  return `<div class="row mb"><span class="sp"></span><div class="nsearch" style="width:300px"><input class="inp" name="pdq" placeholder="Search by name" value="${esc(q)}" data-act="pdDeptQ"><button class="circ" data-act="pdDeptQ" title="Search">${I('search')}</button></div></div>
  ${table(['Name', 'Designation', 'Clock In', 'Clock Out', 'Working Hours', 'Status'], rows.map(s => { const a = stfDay(s, d), o = a.tx[a.tx.length - 1]; return `<tr><td>${esc(s.name)}</td><td>${esc(s.desig)}</td><td>${a.tx.length ? hm(a.tx[0][1]) : '--:--'}</td><td>${o && o[0] === 'Punch Out' ? hm(o[1]) : '--:--'}</td><td>${a.tx.length ? hhmm(txMins(a.tx)) : '--:--'}</td><td>${st(a.status === 'Holiday' ? 'Holiday · ' + a.name : a.status)}</td></tr>`; }), 'No staff found.')}`; }

// ---- Shifts Management
A['pr-shift'] = () => {
  const k = 'shf', q = aQ(k), rows = aSorted(k, S.shifts.filter(x => !q || x.name.toLowerCase().includes(q))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">⏱ Shift Setup<small>Manage shift timings, working schedules and staff shift policies.</small></div><span class="end"><button class="btn" data-act="shiftForm">＋ Add</button></span></div>${aSearch(k, 'Search by shift name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Shift Name'), 'Shift Timing', 'Full Day Hours', 'Half Day Duration', 'Late Arrival Limit (min)', 'Early Exit Limit (min)', 'Assigned Staff', 'Action'], pg.items.map((x, i) => { const n = new Set(S.shiftAssign.filter(a => a.shiftId === x.id).flatMap(a => a.staff)).size;
    return `<tr><td>${pg.off + i + 1}</td><td>${esc(x.name)}</td><td>${hm(toMin(x.start))} – ${hm(toMin(x.end))}</td><td>${dur(fullMin(x))}</td><td>${dur(x.half * 60)}</td><td>${x.late}</td><td>${x.early}</td><td>${n}</td><td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-act="shiftForm" data-id="${x.id}">✎</button><button class="iconbtn del" title="Delete" data-act="shiftDel" data-id="${x.id}">🗑</button></td></tr>`; }), 'No Shift Data Available')}${pg.html}</div>`;
};
A['pr-assign'] = () => {
  const G = S.asg, avail = S.staff.filter(s => !G.pick.includes(s.id) && (!G.dept || s.dept === G.dept) && (!G.desig || s.desig === G.desig)), picked = G.pick.map(id => S.staff.find(s => s.id === id));
  const cur = s => stfShift(s, TODAY)?.sh.name;
  const card = (s, btn) => `<div class="scard">${ava(s.name)}<div style="flex:1;min-width:0"><b>${esc(s.name)}</b><div class="muted small">${esc(s.dept)} · ${esc(s.desig)}</div>${btn === 'rm' ? `<div class="small">Shift Assigned: ${cur(s) ? `<b>${cur(s)}</b>` : '<span style="color:#EA580C">Not Assigned Yet</span>'}</div>` : ''}</div>${btn === 'rm' ? `<button class="btn ghost sm" style="color:#DC2626;border-color:#FCA5A5" data-act="asgRm" data-id="${s.id}">− Remove</button>` : `<button class="btn sm" data-act="asgAdd" data-id="${s.id}">＋ Add</button>`}</div>`;
  const wo = [...G.wo].sort((a, b) => toMin(a.replace('-', ':')) - toMin(b.replace('-', ':')));
  return `<div class="ttl mb">👥 Shift Assignment<small>Assign and manage staff shifts based on departments, roles and working schedules.</small></div>
  <div class="card sec" id="asgform"><div class="grid3">${aSel('Select Shift', 'shift', G.shift, S.shifts.map(s => s.name), { req: 1, ph: 'Select shift', act: 'asgField' })}<div class="field"><label>Effective From Date <i>*</i></label><input class="inp" type="date" name="from" value="${G.from}" min="${iso(TODAY)}" data-act="asgField"><div class="ferr" data-err="from"></div></div></div>
   <div class="lbl" style="font-size:.95rem;color:var(--navy)">Select Week Off Days :</div><div class="muted small mb">Select a week pattern and choose applicable week off days. The selected configuration will be considered as weekly offs for this shift.</div>
   <div class="wogrid">${[1, 2, 3, 4, 5].map(w => WDAY.map((n, i) => { const key = `${w}-${i + 1}`; return `<button type="button" class="${G.wo.includes(key) ? 'on' : ''}" data-act="asgWo" data-v="${key}" title="${ordinal(w)} ${n}">Day ${i + 1} | ${n}</button>`; }).join('')).join('')}</div>
   <div class="row mt" style="gap:8px"><button type="button" class="btn ghost sm" data-act="asgWoPreset" data-v="sun">All Sundays</button><button type="button" class="btn ghost sm" data-act="asgWoPreset" data-v="sun24">Sundays + 2nd &amp; 4th Saturday</button><button type="button" class="btn ghost sm" data-act="asgWoPreset" data-v="">Clear</button></div>
   <div class="infobox small mt">ⓘ Selected week offs: ${wo.length ? wo.map(k => { const [w, d] = k.split('-'); return `${ordinal(+w)} ${WDAY[d - 1]}`; }).join(', ') : 'none'}</div></div>
  <div class="grid2"><div class="card sec"><div class="row mb"><b style="font-size:1.05rem">Available Staff (${avail.length})</b><span class="sp"></span><label class="row small" style="gap:6px"><input type="checkbox" data-act="asgAll" ${avail.length ? '' : 'disabled'}> Select All</label></div>
    <div class="row mb" style="gap:8px;align-items:flex-end">${aSel('Select Department', 'adept', G.dept, depts(), { ph: 'Select department', act: 'asgFilt' })}${aSel('Select Designation', 'adesig', G.desig, desigs(), { ph: 'Select designation', act: 'asgFilt' })}<button class="btn ghost sm" style="margin-bottom:24px" data-act="asgFiltReset">Reset</button></div>
    <div class="slist">${avail.map(s => card(s, 'add')).join('') || '<div class="empty">No staff available.</div>'}</div></div>
   <div class="card sec"><div class="row mb"><b style="font-size:1.05rem">Assigned Staff (${pad2(picked.length)})</b><span class="sp"></span><label class="row small" style="gap:6px"><input type="checkbox" data-act="asgNone" ${picked.length ? 'checked' : 'disabled'}> Deselect All</label><button class="btn sm" id="asgbtn" data-act="asgSave">Assign Shift</button></div>
    <div class="slist">${picked.map(s => card(s, 'rm')).join('') || '<div class="empty" style="padding:40px 10px">No staff assigned yet.<br><small>Use ＋ Add or Select All on the left.</small></div>'}</div></div></div>
  <div class="card sec mt"><div class="sech" style="font-size:1.05rem">Existing Shift Assignments<span class="sub" style="display:inline;margin-left:8px">${S.shiftAssign.length} assignments</span></div>${table(['Sr No.', 'Shift', 'Shift Timing', 'Effective From', 'Week Offs', 'Staff Assigned'], [...S.shiftAssign].reverse().map((a, i) => { const sh = shiftOf(a.shiftId) || { name: '—', start: '00:00', end: '00:00' }, wo = [...a.wo].sort();
      return `<tr><td>${i + 1}</td><td>${esc(sh.name)}</td><td>${hm(toMin(sh.start))} – ${hm(toMin(sh.end))}</td><td>${dmy(dOf(a.from))}</td><td style="max-width:320px">${wo.length > 4 ? `${wo.length} days · ` : ''}${wo.slice(0, 4).map(k => { const [w, d] = k.split('-'); return ordinal(+w) + ' ' + WDAY[d - 1].slice(0, 3); }).join(', ')}${wo.length > 4 ? '…' : ''}</td><td><b>${a.staff.length}</b> staff</td></tr>`; }), 'No shift assignments yet.')}</div>`;
};
A['pr-sched'] = () => {
  const k = 'sch', ws = dOf(S.schedWeek), days = Array.from({ length: 7 }, (_, i) => { const x = new Date(ws); x.setDate(x.getDate() + i); return x; }), f = S.af[k] || {}, q = aQ(k);
  const rows = stfFilter(f).filter(s => !q || s.name.toLowerCase().includes(q)), pg = aPage(k, rows), we = days[6], fmt = x => `${MON[x.getMonth()].slice(0, 3)} ${x.getDate()}`;
  const cell = (s, x) => { const a = stfDay(s, x); if (a.status === 'Holiday') return `<span class="shift hol">${esc(a.name)}</span>`; if (a.status === 'Week Off') return '<span class="shift off">Week Off</span>'; if (a.status === 'On Leave') return `<span class="shift lv">On Leave</span>`;
    return a.sh ? `<span class="shift">${a.sh.name.replace(' Shift', '')}<br><small>${hm(toMin(a.sh.start)).replace(' ', '')} – ${hm(toMin(a.sh.end)).replace(' ', '')}</small></span>` : '<span class="muted small">No Shift</span>'; };
  return `<div class="ttlrow"><div class="ttl">🗓 Shift Scheduling<small>Plan and assign daily shift schedules based on staff availability and work requirements.</small></div><span class="end"><button class="btn ${S.afOpen[k] ? '' : 'ghost'} afbtn" data-act="aFilter" data-k="${k}" title="Show / hide filters"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/></svg> Filter</button></span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${aSel('Department', 'dept', (S.afd[k] || f).dept, depts(), { ph: 'All departments' })}${aSel('Designation', 'desig', (S.afd[k] || f).desig, desigs(), { ph: 'All designations' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  <div class="card sec row" style="padding:12px 16px"><button class="btn sm" data-act="schedWk" data-v="-7" title="Previous week">‹</button><span class="card" style="padding:8px 16px;font-weight:600">📅 ${fmt(ws)} – ${fmt(we)}, ${we.getFullYear()}</span><button class="btn sm" data-act="schedWk" data-v="7" title="Next week">›</button><button class="btn ghost sm" data-act="schedWk" data-v="0">This week</button><span class="sp"></span><div class="nsearch" style="width:280px"><input class="inp" name="aq-${k}" placeholder="Search employee..." value="${esc(S.af[k + 'q'] || '')}" data-act="aSearch" data-k="${k}"><button class="circ" data-act="aSearch" data-k="${k}" title="Search">${I('search')}</button></div></div>
  <div class="card schedcard">${table(['Name', ...days.map(x => `${DAYS[x.getDay()]}<br><small class="muted">${x.getDate()}</small>`)], pg.items.map(s => `<tr><td style="min-width:170px"><div class="row" style="flex-wrap:nowrap;gap:8px">${ava(s.name)}<div style="min-width:0"><b class="small">${esc(s.name)}</b><div class="muted" style="font-size:.72rem">${esc(s.desig)}</div></div></div></td>${days.map(x => `<td>${cell(s, x)}</td>`).join('')}</tr>`), 'No staff found.')}${pg.html}</div>`;
};

// ---- Attendance Management
A['pr-records'] = () => {
  const k = 'srec', f = S.af[k], d = dOf(f.date), dd = S.afd[k] || f, q = aQ(k), rows = aSorted(k, stfFilter(f).filter(s => !q || s.name.toLowerCase().includes(q))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📋 Attendance Records<small>Track and manage daily staff attendance, working hours and attendance activities. · ${dmy(d)} ${DAYS[d.getDay()]}</small></div><span class="end"><button class="btn ghost" data-act="prExport" data-k="srec">⬇ Export Excel</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3">${field('Date', 'date', dd.date, { type: 'date' })}${aSel('Department', 'dept', dd.dept, depts(), { ph: 'Select department' })}${aSel('Designation', 'desig', dd.desig, desigs(), { ph: 'Select designation' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Name'), 'Department / Designation', 'Shift Type', 'Punch In', 'Punch Out', 'Status', 'Transaction History', 'Total Time'], pg.items.map((s, i) => { const a = stfDay(s, d), off = !isWork(a) || a.status === 'On Leave', last = a.tx[a.tx.length - 1], open = last && last[0] === 'Punch In';
    const clock = kind => off ? '' : `<button class="iconbtn sm" title="${kind === 'in' ? 'Punch In' : 'Punch Out'}" data-act="spPunch" data-id="${s.id}" data-v="${kind}">⏱</button>`;
    return `<tr><td>${pg.off + i + 1}</td><td style="min-width:150px">${esc(s.name)}</td><td style="min-width:170px">${deptDesig(s)}</td><td>${a.shift}</td><td style="white-space:nowrap">${a.tx.length ? hm(a.tx.filter(t => t[0] === 'Punch In').pop()[1]) : '<span class="muted">--:--</span>'} ${!open ? clock('in') : ''}</td><td style="white-space:nowrap">${last && !open ? hm(last[1]) : '<span class="muted">--:--</span>'} ${open ? clock('out') : ''}</td>
      <td>${st(a.status === 'Holiday' ? 'Holiday · ' + a.name : a.status)}</td><td style="white-space:nowrap">Transaction Times : ${a.tx.length} <button class="iconbtn" title="View" data-act="spTx" data-id="${s.id}">👁</button></td><td>${hms(txMins(a.tx))}</td></tr>`; }), 'No staff found.')}${pg.html}</div>`;
};
A['pr-reports'] = () => {
  const k = 'srpt', f = S.af[k], dd = S.afd[k] || f, q = aQ(k), from = dOf(f.from), to = dOf(f.to);
  const rows = aSorted(k, stfFilter(f).filter(s => !q || s.name.toLowerCase().includes(q)).map(s => ({ ...s, r: stfRange(s, from, to) }))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">📊 Attendance Reports<small>Monitor staff attendance summaries, working hours and department-wise attendance performance. · ${dmy(from)} – ${dmy(to)}</small></div><span class="end"><button class="btn ghost" data-act="prExport" data-k="srpt">⬇ Export Excel</button>${aFilterBtn(k)}</span></div>
  ${S.afOpen[k] ? `<div class="card sec apanel"><div class="grid3"><div class="field"><label>Date Range</label><div class="row" style="gap:6px;flex-wrap:nowrap"><input class="inp" type="date" name="from" value="${dd.from}" max="${iso(TODAY)}"><span>–</span><input class="inp" type="date" name="to" value="${dd.to}" max="${iso(TODAY)}"></div><div class="ferr" data-err="from"></div></div>${aSel('Department', 'dept', dd.dept, depts(), { ph: 'Select department' })}${aSel('Designation', 'desig', dd.desig, desigs(), { ph: 'Select designation' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}
  ${aSearch(k, 'Search by name...')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Name'), 'Department / Designation', 'Working Day', 'Present Day', 'Absent Day', 'Working Hours', 'Overtime Hours', 'Action'], pg.items.map((x, i) => `<tr><td>${pg.off + i + 1}</td><td style="min-width:150px">${esc(x.name)}</td><td style="min-width:170px">${deptDesig(x)}</td><td>${x.r.work}</td><td>${x.r.present}</td><td>${x.r.absent}</td><td>${hhmm(x.r.mins)}</td><td>${hhmm(x.r.ot)}</td><td><button class="iconbtn" title="View summary" data-act="spSum" data-id="${x.id}">👁</button></td></tr>`), 'No attendance records found for the selected filters.')}${pg.html}</div>`;
};

// ---- Academic Holiday Calendar
A['pr-holidays'] = () => {
  const k = 'phol', q = aQ(k), rows = aSorted(k, [...S.holidays].sort((a, b) => a.date.localeCompare(b.date)).filter(h => !q || h.name.toLowerCase().includes(q))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🗓 Academic Holiday Calendar ${itip("Holidays apply to staff attendance: they are skipped as working days in the dashboard, records, reports and shift schedule. Student holidays are set separately by the HOD.")}<small>Manage organizational holidays, public holidays and yearly holiday schedules.</small></div><span class="end"><button class="btn ghost" data-act="prExport" data-k="phol">⬇ Export Excel</button><button class="btn" data-act="phForm">＋ Add</button></span></div>${aSearch(k, 'Search by holiday name')}
  <div class="card">${table([aSortTh(k, 'name', 'Holiday Name'), 'Holiday Date', 'Day', 'Actions'], pg.items.map(h => `<tr class="${h.date < iso(TODAY) ? 'past' : ''}"><td>${esc(h.name)}</td><td>${dmy(dOf(h.date))}</td><td>${DAYS[dOf(h.date).getDay()]}</td><td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-act="phForm" data-id="${h.id}">✎</button><button class="iconbtn del" title="Delete" data-act="phDel" data-id="${h.id}">🗑</button></td></tr>`), 'No Holiday Data Available')}${pg.html}</div>`;
};

// ---- Institute Location Management (map: 20000 px per degree around the institute)
const MAP0 = { lat: 23.0350, lng: 72.5465 }, MAPK = 20000;
const mapXY = L => [400 + (L.lng - MAP0.lng) * MAPK, 210 - (L.lat - MAP0.lat) * MAPK];
// map interior only, so moving the pin or changing the radius redraws the map without re-rendering the form
function locMap(L) {
  const [x, y] = mapXY({ lat: +L.lat, lng: +L.lng }), r = Math.max(6, Math.min(600, L.radius * MAPK / 111000));
  return `<svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" data-act="locPick" style="cursor:crosshair"><rect width="800" height="420" fill="#E8EEF3"/><g stroke="#fff" stroke-width="14"><path d="M0 120 H800"/><path d="M0 300 H800"/><path d="M220 0 V420"/><path d="M560 0 V420"/><path d="M0 40 L800 380" stroke-width="8"/></g>
   <rect x="250" y="140" width="120" height="60" fill="#D7E3D0"/><rect x="430" y="230" width="100" height="50" fill="#D7E3D0"/><text x="250" y="132" font-size="14" fill="#475569">Navrangpura</text><text x="600" y="100" font-size="14" fill="#475569">Gujarat University</text><text x="80" y="350" font-size="14" fill="#475569">Ambawadi</text>
   <circle id="lm-c" cx="${x}" cy="${y}" r="${r}" fill="rgba(37,99,235,.12)" stroke="#2563EB" stroke-width="2"/><g id="lm-p" transform="translate(${x - 400} ${y - 210})"><path d="M400 180 a16 16 0 0 1 16 16 c0 14-16 30-16 30s-16-16-16-30a16 16 0 0 1 16-16z" fill="#DC2626"/><circle cx="400" cy="196" r="6" fill="#fff"/></g></svg>
   <span class="tag" id="lm-r" style="position:absolute;right:14px;top:14px;background:#fff">Radius: ${L.radius} meters</span><span class="tag" style="position:absolute;left:14px;bottom:14px;background:#fff">Click the map to move the pin</span>`;
}
A['pr-location'] = () => {
  const L = S.locDraft || S.location;
  return `<div class="ttlrow"><div class="ttl">📍 Institute Location Management ${itip("Search and select your institute on the map, or click anywhere on the map to pin the exact location. Set the geofencing radius in meters; attendance is marked only inside this boundary.")}<small>Manage institute location and geofencing settings for attendance tracking.</small></div><span class="end"><button class="btn" data-act="saveLocation">📍 Save Location</button></span></div>
  <div class="locgrid2"><div class="card sec"><div class="sech" style="font-size:1.05rem">Location Details</div>${field('Institute Name', 'iname', DATA.institute, { ro: 1 })}
    <div class="field"><label>Latitude <i>*</i></label><input class="inp" name="lat" value="${(+L.lat).toFixed(6)}" data-act="locField"><div class="small muted">Auto populated on location select</div><div class="ferr" data-err="lat"></div></div>
    <div class="field"><label>Longitude <i>*</i></label><input class="inp" name="lng" value="${(+L.lng).toFixed(6)}" data-act="locField"><div class="small muted">Auto populated on location select</div><div class="ferr" data-err="lng"></div></div>
    <div class="sech" style="font-size:1.05rem">Geofencing Configuration</div><div class="field"><label>Geofencing Radius (in meters) <i>*</i></label><input class="inp" type="number" min="80" name="radius" value="${L.radius}" data-act="locField"><div class="small muted">Minimum 80 meters</div><div class="ferr" data-err="radius"></div></div>
    <div class="infobox small">ⓘ Enter radius in meters to create the attendance boundary around the selected location.</div></div>
   <div class="card sec"><div class="row mb" style="flex-wrap:nowrap;gap:8px"><input class="inp" name="locq" placeholder="Search location... (e.g. Navrangpura, Gujarat University)" data-act="locSearch"><button class="btn" data-act="locSearch">Search</button></div>
    <div class="map" id="locmap">${locMap(L)}</div></div></div>`;
};

// ---- Faculty leave management (from the earlier role videos; kept under its own sidebar group)
A['pr-workflow'] = () => `<div class="ttlrow"><div class="ttl">🔁 Leave Approval Workflow ?<small>Configure multi-level leave approval stages for staff leave requests.</small></div><span class="end"><button class="btn" data-act="editWorkflow">✎ Edit</button></span></div>
  ${statTiles([['🔢', 'b', 'Total Stages', String(S.workflow.length).padStart(2, '0')], ['✓', 'g', 'Workflow Status', 'Active']])}
  <div class="card sec"><div class="row wrap" style="gap:16px">${S.workflow.map((w, i) => `<div class="cert" style="min-width:240px"><div class="lbl">Stage ${i + 1} Approver</div><div class="val">${w}</div></div>${i < S.workflow.length - 1 ? '<span style="font-size:1.6rem;color:var(--mute)">→</span>' : ''}`).join('')}</div></div>`;
A['pr-policy'] = () => `<div class="ttlrow"><div class="ttl">📘 Leave Policy Configuration ?<small>Manage leave types, allocation rules and leave policies for staff.</small></div><span class="end"><button class="btn" data-act="addPolicy">＋ Add</button></span></div>
  <div class="card">${table(['Leave Category', 'Code', 'Total Leaves', 'Carry Over', 'Max Carry Forward (Days)', 'Can Be Availed Once', 'Actions'], S.leavePolicy.map((p, i) => `<tr><td><b>${p.cat}</b></td><td>${p.code}</td><td>${p.total}</td><td>${p.carry}</td><td>${p.maxCarry}</td><td>${p.once}</td><td><button class="iconbtn del" data-act="delPolicy" data-i="${i}">🗑</button></td></tr>`))}</div>`;
A['pr-requests'] = () => `<div class="ttlrow"><div class="ttl">📨 Faculty Leave Requests ?<small>Review staff leave applications and approve or reject them.</small></div></div>
  <div class="card filterbar">${field('From Date', 'f', '2026-10-01', { type: 'date' })}${field('To Date', 't', '2026-11-30', { type: 'date' })}${field('Department', 'dep', '', { options: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'], ph: 'All departments' })}<button class="btn" data-act="toastOk" data-v="Filter applied">✓ Apply</button></div>
  <div class="card">${table(['Name', 'Department', 'Designation', 'Leave Name', 'Leave Duration', 'Applied Days', 'Applied Date', 'Status', 'Actions'], S.leaveRequests.map(l => `<tr><td><b>${l.name}</b></td><td>${l.dept}</td><td>${l.desig}</td><td>${l.type}</td><td>${l.dur}</td><td>${l.days}</td><td>${l.applied}</td><td>${st(l.status)}</td><td><button class="iconbtn" data-act="leaveDetail" data-id="${l.id}">👁</button></td></tr>`))}</div>`;
A['pr-alloc'] = () => `<div class="ttlrow"><div class="ttl">⚖ Faculty Leave Allocation ?<small>Manage employee leave balances and allocation settings.</small></div></div>
  <div class="card">${table(['Name', 'Department', 'Designation', ...S.leavePolicy.map(p => `<span title="${p.cat}">${p.code}</span><br><small class="muted" style="font-weight:500">Remaining / Total</small>`), 'Actions'], S.staff.map(s => `<tr><td class="nw"><b>${s.name}</b></td><td>${s.dept}</td><td>${s.desig}</td>${S.leavePolicy.map((p, j) => `<td>${(s.bal ||= S.leavePolicy.map(q => q.total - (s.id + j) % 4))[j]} / ${p.total}</td>`).join('')}<td><button class="iconbtn" data-act="editAlloc" data-id="${s.id}">✎</button></td></tr>`))}</div>`;

// ------------------------------------------------------------------ Staff
A['st-dash'] = () => `<div class="ttlrow"><div class="ttl">Good Afternoon, ${ROLES.staff.person}<small>Your attendance, shifts and leave.</small></div></div>
  ${statTiles([['→', 'g', 'Punch In', '09:10 AM'], ['←', '', 'Punch Out', '—'], ['⏱', 'a', 'Total Duration', '5h 05m'], ['%', 'v', 'Attendance (Oct)', '96%']])}
  <div class="grid2"><div class="card sec"><div class="sech" style="font-size:1.2rem">Attendance Report (October)</div>${donut([['Present Days', 22, '#16A34A'], ['Absent Days', 0, '#DC2626'], ['Late Coming', 1, '#F59E0B'], ['Early Going', 0, '#94A3B8']], '22')}</div>
   <div class="card sec"><div class="sech" style="font-size:1.2rem">Leave Balance<span class="end"><button class="btn sm" data-act="applyLeave">Apply Leave</button></span></div>${S.leavePolicy.map((p, i) => { const rem = p.total - ([3, 1, 0, 2, 1][i] ?? 0); return `<div class="mb"><div class="row"><b>${p.cat}</b><span class="sp"></span>${rem} / ${p.total} remaining</div><div class="bar-track" style="margin-top:6px"><i style="width:${rem / p.total * 100}%;background:${['#16A34A', '#F59E0B', '#2563EB', '#7C3AED', '#0D9488'][i % 5]}"></i></div></div>`; }).join('')}</div></div>
  <div class="grid2"><div class="card sec"><div class="sech" style="font-size:1.2rem">Recent Attendance Activity</div>${table(['Date', 'Punch In', 'Punch Out', 'Status'], [['02 Nov', '09:04 AM', '05:06 PM', 'Present'], ['31 Oct', '09:12 AM', '05:01 PM', 'Present'], ['30 Oct', '09:21 AM', '05:00 PM', 'Late'], ['29 Oct', '08:58 AM', '05:03 PM', 'Present']].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${st(r[3])}</td></tr>`))}</div>
   <div class="card sec"><div class="sech" style="font-size:1.2rem">Recent Leave Requests</div>${table(['Leave Type', 'From – To', 'Days', 'Status'], S.myLeaves.slice(0, 4).map(l => `<tr><td>${l.type}</td><td>${l.from} – ${l.to}</td><td>${l.days}</td><td>${st(l.status)}</td></tr>`))}</div></div>`;
A['st-policy'] = () => `<div class="ttl mb">📘 Leave Configuration ? ${itip("Renew date is when the leave balance resets. Carry forward lets unused leave move to the next cycle, up to the limit.")}<small>Leave types, allocation and carry-forward rules for staff.</small></div><div class="card">${table(['Sr No.', 'Leave Category', 'Code', 'Total Leaves', 'Renew Date', 'Carry Over', 'Max Carry Limit', 'One-Time Use'], S.leavePolicy.map((p, i) => `<tr><td>${i + 1}</td><td><b>${p.cat}</b></td><td>${p.code}</td><td>${p.total}</td><td>31 December</td><td>${p.carry}</td><td>${p.maxCarry}</td><td>${p.once}</td></tr>`))}</div>`;
A['st-leaves'] = () => `<div class="ttlrow"><div class="ttl">🌴 Leave History ? ${itip("Applied Days is the number of leave days requested. Pending requests can be withdrawn before they are approved.")}<small>Track leave requests, approval status and leave activity history.</small></div><span class="end"><button class="btn ghost" data-act="export">⬇ Export Excel</button><button class="btn" data-act="applyLeave">＋ Apply Leave</button></span></div>
  <div class="card">${table(['Sr No.', 'Leave Category', 'Duration', 'Start Date', 'End Date', 'Applied On', 'Applied Days', 'Status', 'Action'], S.myLeaves.map((l, i) => `<tr><td>${i + 1}</td><td>${l.type}</td><td>${l.dur}</td><td>${l.from}</td><td>${l.to}</td><td>${l.applied}</td><td>${l.days}</td><td>${st(l.status)}</td><td>${l.status === 'Pending' ? `<button class="btn red sm" data-act="withdrawLeave" data-i="${i}">Withdraw</button>` : ''}</td></tr>`))}</div>`;
// Staff view of the Principal's Academic Holiday Calendar (S.holidays): read only, list or month view
A['st-holidays'] = () => {
  const k = 'sthol', view = S.sthView || 'list', f = S.sthWhen || 'all', q = aQ(k), now = iso(TODAY), all = [...S.holidays].sort((a, b) => a.date.localeCompare(b.date));
  const up = all.filter(h => h.date >= now), next = up[0], daysTo = next ? Math.round((dOf(next.date) - TODAY) / 864e5) : 0;
  const tabs = (act, cur, list) => list.map(([v, l]) => `<button class="chip ${cur === v ? 'on' : ''}" data-act="${act}" data-v="${v}">${l}</button>`).join('');
  let body;
  if (view === 'list') {
    const rows = all.filter(h => (f === 'all' || (f === 'up' ? h.date >= now : h.date < now)) && (!q || h.name.toLowerCase().includes(q))), pg = aPage(k, rows);
    body = `${aSearch(k, 'Search by holiday name')}<div class="card">${table(['Sr No.', 'Holiday Name', 'Holiday Date', 'Day', 'Status'], pg.items.map((h, i) => { const d = dOf(h.date), past = h.date < now, n = Math.round((d - TODAY) / 864e5);
      return `<tr class="${past ? 'past' : ''}"><td>${pg.off + i + 1}</td><td>${esc(h.name)}</td><td>${dmy(d)}</td><td>${DAYS[d.getDay()]}</td><td>${past ? '<span class="st grey">Completed</span>' : n === 0 ? '<span class="st green">Today</span>' : `<span class="st blue">In ${n} day${n > 1 ? 's' : ''}</span>`}</td></tr>`; }), 'No holidays found.')}${pg.html}</div>`;
  } else {
    const m = S.sthMonth || { y: TODAY.getFullYear(), m: TODAY.getMonth() }, first = new Date(m.y, m.m, 1), lead = (first.getDay() + 6) % 7, days = new Date(m.y, m.m + 1, 0).getDate();
    let cal = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="chd">${d}</div>`).join('') + '<div class="cempty"></div>'.repeat(lead);
    for (let d = 1; d <= days; d++) { const dt = new Date(m.y, m.m, d), h = S.holidays.find(x => x.date === iso(dt)), isT = iso(dt) === now;
      cal += `<div class="cday ${h ? 'ho' : dt.getDay() === 0 ? 'wo' : 'sc'} ${isT ? 'today' : ''}" style="cursor:default"><span class="cnum">${d}</span>${h ? `<span class="cst">${esc(h.name)}</span>` : dt.getDay() === 0 ? '<small>Sunday</small>' : ''}</div>`; }
    const cnt = all.filter(h => h.date.startsWith(`${m.y}-${pad2(m.m + 1)}`)).length;
    body = `<div class="card sec"><div class="row mb"><button class="iconbtn" data-act="sthMonth" data-v="-1" title="Previous month">‹</button><button class="iconbtn" data-act="sthMonth" data-v="1" title="Next month">›</button><b style="font-size:1.1rem">${MON[m.m]} ${m.y}</b><span class="muted small">${cnt} holiday${cnt === 1 ? '' : 's'}</span><span class="sp"></span><button class="btn round sm" data-act="sthMonth" data-v="0">Today</button></div>
      <div class="calwrap"><div class="cal7">${cal}</div></div><div class="row mt small" style="gap:16px"><span class="row" style="gap:6px"><i class="lgd ho"></i>Holiday</span><span class="row" style="gap:6px"><i class="lgd wo"></i>Sunday</span></div></div>`;
  }
  return `<div class="ttlrow"><div class="ttl">🎉 Academic Holiday Calendar ${itip("Holidays are not counted as working days in your attendance. For changes, contact the Principal’s office.")}<small>Holidays assigned by your institute for the academic year.</small></div><span class="end"><span class="tag" style="background:#F1F5F9;color:#334155">🔒 View only · managed by the Principal</span></span></div>
  <div class="grid3 mb">${[['🎉', 'Total Holidays', all.length], ['📅', 'Upcoming Holidays', up.length], ['⏭', 'Next Holiday', next ? `${esc(next.name)}<small class="muted" style="display:block;font-size:.8rem;font-weight:500">${dmy(dOf(next.date))} · ${daysTo === 0 ? 'today' : `in ${daysTo} day${daysTo > 1 ? 's' : ''}`}</small>` : '—']].map(r => `<div class="card stat"><span class="si">${r[0]}</span><div><small>${r[1]}</small><b>${r[2]}</b></div></div>`).join('')}</div>
  <div class="row mb" style="gap:8px">${tabs('sthView', view, [['list', '☰ List'], ['cal', '📅 Calendar']])}${view === 'list' ? `<span class="sp"></span>${tabs('sthWhen', f, [['all', 'All'], ['up', 'Upcoming'], ['past', 'Completed']])}` : ''}</div>${body}`;
};
A['st-shift'] = () => `<div class="ttlrow"><div class="ttl">🗓 My Shift Schedule<small>View monthly shifts, timings and status.</small></div></div><div class="card sec">${monthCal(2026, 10, d => [1, 8, 15, 22, 29].includes(d) ? 'Week Off' : S.holidays.some(h => h.date === `2026-11-${pad2(d)}`) ? 'Holiday' : d < 3 ? 'Present' : 'Future', 'November 2026 · Morning Shift 09:00 AM – 05:00 PM')}</div>`;
A['st-att'] = () => `<div class="ttlrow"><div class="ttl">⏱ Attendance History<small>Track attendance, working hours and overtime.</small></div><span class="end"><button class="btn ghost" data-act="export">⬇ Export Excel</button></span></div>
  <div class="card">${table(['Sr No.', 'Date', 'Attendance Status', 'Shift Type', 'Punch In', 'Punch Out', 'Late Mark', 'Early Count', 'Working Hours', 'Overtime'], [['02 Nov 2026', 'Present', 'Morning Shift', '09:04 AM', '05:06 PM', 0, 0, '08:02', '00:02'], ['01 Nov 2026', 'Week Off', '—', '—', '—', 0, 0, '00:00', '00:00'], ['31 Oct 2026', 'Present', 'Morning Shift', '09:12 AM', '05:01 PM', 0, 0, '07:49', '00:00'], ['30 Oct 2026', 'Late', 'Morning Shift', '09:21 AM', '05:00 PM', 1, 0, '07:39', '00:00'], ['29 Oct 2026', 'Present', 'Morning Shift', '08:58 AM', '05:03 PM', 0, 0, '08:05', '00:05']].map((r, i) => `<tr><td>${i + 1}</td><td>${r[0]}</td><td>${st(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td><td>${r[7]}</td><td>${r[8]}</td></tr>`))}</div>`;

// ------------------------------------------------------------------ Skill Passport Nodal Officer
// Skill Master (recording 11): one card per skill category; chips can be removed straight from the card.
A['sk-master'] = () => `<div class="ttlrow"><div class="ttl">🏅 Skill Master<small>Add and manage student skills to track progress and support growth.</small></div><span class="end"><button class="btn" data-act="skillCat">＋ Add</button></span></div>
  <div class="grid2">${S.skillMaster.map(c => `<div class="card skillcat"><div class="hdr"><span class="si" style="width:30px;height:30px;font-size:.9rem">★</span>${esc(c.name)}<span class="sp"></span><button class="iconbtn" title="Edit Skill Category" data-act="skillCat" data-id="${c.id}">✎</button><button class="iconbtn del" title="Delete Skill Category" data-act="delSkillCat" data-id="${c.id}">🗑</button></div>
    <div class="skbody">${c.subs.map((s, i) => `<span class="chip">${esc(s)} <button type="button" class="chipx" title="Remove" data-act="rmSkill" data-id="${c.id}" data-i="${i}">×</button></span>`).join('') || '<i class="muted small">No sub skills</i>'}</div></div>`).join('')}</div>`;

// Job-Oriented Skill Master (recording 14): one alphabetical list; students pick their job-oriented skills from it
A['sk-job'] = () => { const list = [...S.jobSkills].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  return `<div class="ttlrow"><div class="ttl">💼 Job-Oriented Skill Master ${itip("Students choose their Job Oriented Skills on the Skill Passport from this list, and placement companies search students by these skills.")}<small>Add and manage job-oriented skills to align student skills with industry requirements.</small></div><span class="end"><button class="btn" data-act="jsAdd">＋ Add</button></span></div>
  <div class="card sec skillcat"><div class="hdr"><span class="si" style="width:36px;height:36px">💼</span><div>Job-Oriented Skills<div class="muted small" style="font-weight:400">${list.length} skills available</div></div></div>
   <div class="skbody" style="max-height:none">${list.map(s => `<span class="chip">${esc(s)} <button type="button" class="chipx" title="Edit" data-act="jsEdit" data-v="${esc(s)}">✎</button><button type="button" class="chipx" title="Delete" data-act="jsDel" data-v="${esc(s)}">×</button></span>`).join('') || '<div class="empty">No job-oriented skills yet. Use ＋ Add.</div>'}</div></div>`; };

// Student Skill Achievements: filter, then students listed with expandable achievement rows
A['sk-ach'] = () => {
  const k = 'ach', f = S.af[k], d = S.afd[k] || f || {}, A_ = DATA.achievements, uniq = key => [...new Set(A_.map(a => a[key]))].sort();
  const panel = S.afOpen[k] !== false ? `<div class="card sec apanel"><div class="grid3">${aSel('Skill', 'skill', d.skill, S.skillMaster.flatMap(c => c.subs).sort(), { ph: 'Select skill' })}${aSel('Institute', 'inst', d.inst, uniq('inst'), { ph: 'Select institute' })}${aSel('Programme', 'deg', d.deg, Object.keys(DATA.degrees), { ph: 'Select programme', act: 'aDraftDeg', k })}${aSel('Branch', 'branch', d.branch, d.deg ? branchesOf(d.deg) : [...new Set(Object.values(DATA.degrees).flat())], { ph: 'Select branch' })}${aSel('Semester / Year', 'sem', d.sem, DATA.semList, { ph: 'Select semester / year' })}</div>
   <div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : '';
  let body;
  if (!f) body = illus('Select a skill, institute or programme, then click Apply to view student skill achievements.');
  else {
    const q = aQ(k), hit = A_.filter(a => ['skill', 'inst', 'deg', 'branch', 'sem'].every(x => !f[x] || a[x] === f[x]) && (!q || a.student.toLowerCase().includes(q)));
    const studs = aSorted(k, [...new Map(hit.map(a => [a.enr, { enr: a.enr, student: a.student, inst: a.inst, deg: a.deg, branch: a.branch, sem: a.sem }])).values()]), pg = aPage(k, studs);
    body = `${aSearch(k, 'Search by student name')}<div class="card">${table(['', aSortTh(k, 'enr', 'Enrollment No.'), aSortTh(k, 'student', 'Student Name'), 'Institute', 'Programme', 'Branch', 'Semester'], pg.items.map(s => { const open = S.achOpen === s.enr, list = hit.filter(a => a.enr === s.enr);
      return `<tr class="${open ? 'sel' : ''}"><td><button class="iconbtn" data-act="achRow" data-v="${s.enr}" title="${open ? 'Collapse' : 'Show achievements'}" aria-expanded="${open}">${open ? '⌃' : '⌄'}</button></td><td>${s.enr}</td><td>${esc(s.student)}</td><td style="max-width:220px">${esc(s.inst)}</td><td>${s.deg}</td><td>${s.branch}</td><td><span class="tag">${s.sem}</span></td></tr>
      ${open ? `<tr class="subrow"><td colspan="7">${table(['Skill', 'Achievement Title', 'Level', 'Certificate No.', 'Issued Date', 'Action'], list.map(a => `<tr><td><small style="color:#2563EB">${esc(a.cat)}</small><br><b>${esc(a.skill)}</b></td><td>${esc(a.title)}</td><td>${a.level}</td><td>${a.certNo}</td><td>${a.date}</td><td><button class="iconbtn" title="View" data-act="achView" data-id="${a.id}">👁</button></td></tr>`))}</td></tr>` : ''}`; }), 'No student skill achievements found.')}${pg.html}</div>`;
  }
  return `<div class="ttlrow"><div class="ttl">🏆 Student Skill Achievements<small>View and verify student achievements submitted under various skills and categories.</small></div><span class="end"><button class="btn ${S.afOpen[k] !== false ? '' : 'ghost'} afbtn" data-act="achFilterToggle" title="Show / hide filters"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z"/></svg> Filter</button></span></div>${panel}${body}`;
};

// ------------------------------------------------------------------ Scholarship Nodal Officer
A['so-apps'] = () => {
  const f = S.filters.sst || 'All', rows = S.schApps.filter(a => (f === 'All' || a.status === f) && matchQ(a));
  return `<div class="ttlrow"><div class="ttl">🎓 Scholarship Applications<small>Review student scholarship applications and approve or reject them.</small></div></div>
  ${statTiles([['📄', 'b', 'Total Applications', S.schApps.length], ['⏳', 'a', 'Pending', S.schApps.filter(a => a.status === 'Pending').length], ['✓', 'g', 'Approved', S.schApps.filter(a => a.status === 'Approved').length], ['✕', 'r', 'Rejected', S.schApps.filter(a => a.status === 'Rejected').length]])}
  <div class="card filterbar">${['All', 'Pending', 'Approved', 'Rejected'].map(s => `<button class="chip ${f === s ? 'on' : ''}" data-act="filter" data-k="sst" data-v="${s}">${s}</button>`).join('')}<span class="sp"></span>${searchBox('Search with student name or application ID')}</div>
  <div class="card">${table(['Sr No.', 'Application ID', 'Student Name', 'Scholarship Name', 'Institute Name', 'Application Date', 'Status', 'Action'], rows.map((a, i) => `<tr><td>${i + 1}</td><td>${a.id}</td><td><b>${a.name}</b></td><td>${a.sch}</td><td>${a.inst}</td><td>${a.date}</td><td>${st(a.status)}</td><td><button class="btn ${a.status === 'Pending' ? '' : 'ghost'} sm" data-go="adm" data-sub="so-review" data-param="${a.id}">${a.status === 'Pending' ? 'Review' : 'View'}</button></td></tr>`))}${pager(rows.length)}</div>`;
};
A['so-review'] = () => {
  const a = S.schApps.find(x => x.id === S.param) || S.schApps[0];
  return `<div class="crumb"><a data-go="adm" data-sub="so-apps">Scholarship Applications</a> › ${a.id}</div><div class="card sec"><div class="row mb"><div><div class="ttl">${a.sch}</div><div class="muted">Application ${a.id}</div></div><span class="sp"></span><div class="right"><div class="lbl">Submitted on</div><b style="font-size:1.2rem">${a.date}</b></div></div>
   <div class="sech" style="font-size:1.1rem">▍ Personal Details</div><div class="grid4 mb">${[['Full Name', a.name], ['Gender', a.gender], ['Date of Birth', a.dob], ['Aadhaar (masked)', a.aadhaar], ['Student Category', 'General'], ['District', a.district], ['State', 'Gujarat'], ['Special Category', a.cat]].map(r => `<div><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`).join('')}</div>
   <div class="sech" style="font-size:1.1rem">▍ Academic Record</div><div class="grid4 mb">${[['Institute', a.inst], ['Programme', 'BE/B-Tech'], ['Semester', 'Sem-6'], ['Last Result', 'SGPA 8.67']].map(r => `<div><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`).join('')}</div>
   <div class="sech" style="font-size:1.1rem">▍ Family &amp; Documents</div><div class="grid4">${[['Annual Family Income', a.income], ['Income Certificate', '📄 View'], ['Fee Receipt', '📄 View'], ['Bank Passbook', '📄 View']].map(r => `<div><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`).join('')}</div>
   ${a.status === 'Pending' ? `<div class="row mt"><button class="btn ghost" data-go="adm" data-sub="so-apps">← Back</button><span class="sp"></span><button class="btn red" data-act="schDecide" data-id="${a.id}" data-v="Rejected">Reject Application</button><button class="btn green" data-act="schDecide" data-id="${a.id}" data-v="Approved">Approve Application</button></div>` : `<div class="infobox mt">Decision: ${st(a.status)}</div>`}</div>`;
};

// ------------------------------------------------------------------ Placement Coordinator
// Company List / Company Details / Add-Edit Company (recording 12)
const coLogo = (c, big) => `<span class="colog ${big ? 'big' : ''}" style="background:${c.color}1A;color:${c.color}">${c.short}</span>`;
const coStatus = s => `<span class="st ${s === 'Active' ? 'green' : s === 'Inactive' ? 'grey' : 'red'}">${s}</span>`;
A['pc-companies'] = () => {
  const k = 'co', f = S.af[k] || {}, d = S.afd[k] || f, q = aQ(k);
  const rows = aSorted(k, S.companies.filter(c => (!f.status || c.status === f.status) && (!f.sector || c.sector === f.sector) && (!f.cat || c.cat === f.cat) && (!q || (c.name + ' ' + c.person + ' ' + c.email).toLowerCase().includes(q)))), pg = aPage(k, rows);
  return `<div class="ttlrow"><div class="ttl">🏢 Company List<small>Manage the list of companies registered for campus placements.</small></div><span class="end"><button class="btn" data-go="adm" data-sub="pc-coform">＋ Add</button></span></div>
  <div class="card sec" style="padding:12px 16px"><div class="row"><b>⏷ Advanced Filter</b><span class="sp"></span><button class="btn gold sm" data-act="aFilter" data-k="${k}">Filter ${S.afOpen[k] ? '▴' : '▾'}</button></div>
   ${S.afOpen[k] ? `<div class="apanel" style="padding-top:12px"><div class="grid3">${aSel('Status', 'status', d.status, ['Active', 'Inactive', 'Blacklisted'], { ph: 'All statuses' })}${aSel('Industry Sector', 'sector', d.sector, DATA.sectors, { ph: 'All sectors' })}${aSel('Company Category', 'cat', d.cat, DATA.companyCats, { ph: 'All categories' })}</div><div class="row"><button class="btn" data-act="aApply" data-k="${k}">✓ Apply</button><button class="btn ghost" data-act="aReset" data-k="${k}">✕ Reset</button></div></div>` : ''}</div>
  ${aSearch(k, 'Search by company, contact person or email')}
  <div class="card">${table(['Sr No.', aSortTh(k, 'name', 'Company Info'), 'Head Office Address', 'Contact Person', 'Email', 'Status', 'Actions'], pg.items.map((c, i) => `<tr><td>${pg.off + i + 1}</td><td><div class="row" style="flex-wrap:nowrap">${coLogo(c)}<span style="min-width:150px">${esc(c.name)}</span></div></td><td><span class="ndesc" style="max-width:220px">${esc(c.addr)}, ${esc(c.city)}</span></td><td>${esc(c.person)}</td><td>${esc(c.email)}</td><td>${coStatus(c.status)}</td>
    <td style="white-space:nowrap"><button class="iconbtn" title="Edit" data-go="adm" data-sub="pc-coform" data-param="${c.id}">✎</button><button class="iconbtn" title="View" data-go="adm" data-sub="pc-codetail" data-param="${c.id}">👁</button><span class="rel"><button class="iconbtn" title="Change status" data-act="menu" data-v="co-${c.id}">⋮</button>${S.menu === 'co-' + c.id ? `<div class="drop-menu" style="width:160px">${['Active', 'Inactive', 'Blacklisted'].map(s => `<button class="${s === c.status ? 'on' : ''} ${s === 'Blacklisted' ? 'out' : ''}" data-act="coStatus" data-id="${c.id}" data-v="${s}">${s === 'Active' ? '●' : s === 'Inactive' ? '○' : '⊘'} ${s}</button>`).join('')}</div>` : ''}</span></td></tr>`), 'No Companies Available')}${pg.html}</div>`;
};
A['pc-codetail'] = () => {
  const c = S.companies.find(x => x.id === S.param) || S.companies[0], sec = (ic, t, s, body) => `<div class="card sec"><div class="row mb" style="align-items:flex-start"><span class="si" style="background:#F1F5F9">${ic}</span><div><b style="font-size:1.05rem">${t}</b><div class="muted small">${s}</div></div></div>${body}</div>`, kv = (l, v) => `<div><div class="muted small">${l} :</div><b>${v || '—'}</b></div>`;
  const ids = Object.entries(c.ids);
  return `<div class="crumb"><a data-go="adm" data-sub="pc-companies">Company List</a> › Company Details</div><div class="ttlrow"><div class="ttl">Company Details<small>Complete overview of the company's profile, registration and contact details.</small></div><span class="end"><button class="btn" data-go="adm" data-sub="pc-coform" data-param="${c.id}">✎ Edit Company</button></span></div>
  ${c.status !== 'Active' ? `<div class="infobox ${c.status === 'Blacklisted' ? 'warn' : ''}">${c.status === 'Blacklisted' ? `⊘ This company is blacklisted and permanently restricted from the Placement Module.${c.remark ? ` Remark: ${esc(c.remark)}` : ''}` : '○ This company is inactive and cannot post jobs until it is marked active.'}</div>` : ''}
  <div class="card sec"><div class="row" style="align-items:flex-start"><div style="flex:1"><h2 style="font-size:1.5rem">${esc(c.name)} ${coStatus(c.status)}</h2><div class="row mt small" style="gap:16px"><span>🏢 ${c.type}</span><span>🏭 ${c.sector}</span><span>◈ ${c.cat}</span></div><div class="small mt">🌐 <a style="color:#2563EB" data-act="dshOpen">${esc(c.web)}</a></div>${c.about ? `<div class="small mt"><a style="color:#2563EB" data-act="dshOpen">${esc(c.about)}</a></div>` : c.desc ? `<p class="muted mt">${esc(c.desc)}</p>` : ''}</div>${coLogo(c, 1)}</div></div>
  ${sec('📝', 'Registration Details', 'Official registration and tax identification details of the company.', `<div class="grid3">${kv('Certificate of Incorporation', c.cert ? `<a style="color:#2563EB;font-weight:600" data-act="attach" data-v="${esc(c.cert)}">View Certificate</a>` : '—')}${ids.map(([l, v]) => kv(l, esc(v))).join('')}</div>`)}
  ${sec('📍', 'Head Office Location', 'Registered head office address of the company.', `<div class="grid3 mb">${kv('City/District', c.city)}${kv('State', c.state)}${kv('Country', c.country)}</div>${kv('Head Office Address', esc(c.addr))}`)}
  ${c.branches.length ? sec('🏬', 'Other Office Branches', 'Other office locations of the company.', `<div class="grid2">${c.branches.map(b => `<div class="cert"><b>${esc(b.name)}</b><div class="grid3 mt">${kv('City/District', b.city)}${kv('State', b.state)}${kv('Country', b.country)}</div><div class="mt">${kv('Office Address', esc(b.addr))}</div></div>`).join('')}</div>`) : ''}
  ${sec('👤', 'Contact Person', 'Primary point of contact for placement communication.', `<div class="row" style="gap:32px;align-items:flex-start"><div><b>${esc(c.person)}</b><div class="muted small">${esc(c.desig)}</div></div><div class="small">✉ ${esc(c.email)}<br>☎ +91 ${esc(c.phone)}</div>${c.altEmail || c.altPhone ? `<div class="small">${c.altEmail ? `✉ ${esc(c.altEmail)} <span class="tag" style="background:#FFF7ED;color:#C2410C">Alternate</span><br>` : ''}${c.altPhone ? `☎ +91 ${esc(c.altPhone)}` : ''}</div>` : ''}</div>`)}
  ${c.social.length ? sec('🔗', 'Social Media Links', "Company's official social media profiles.", `<div class="grid2">${c.social.map(u => `<div class="cert row"><span style="flex:1;word-break:break-all;color:#2563EB">${esc(u)}</span><button class="iconbtn" title="Open" data-act="dshOpen">↗</button></div>`).join('')}</div>`) : ''}`;
};
A['pc-coform'] = () => {
  const c = S.companies.find(x => x.id === S.param), F = S.coDraft;
  const opt = (name, val, list, ph, extra = '') => `<select class="inp" name="${name}" ${extra}><option value="">${ph}</option>${list.map(x => `<option ${x === val ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  const geo = (p, v) => { const st = v.country && DATA.geo[v.country] ? Object.keys(DATA.geo[v.country]) : [], ct = st.includes(v.state) ? DATA.geo[v.country][v.state] : [];
    return `${coField('Country', opt(p + 'country', v.country, Object.keys(DATA.geo), 'Select country', `data-act="coGeo"`), p + 'country')}${coField('State', opt(p + 'state', v.state, st, 'Select state', `data-act="coGeo"`), p + 'state')}${coField('City/District', opt(p + 'city', v.city, ct, 'Select city/district'), p + 'city')}`; };
  const head = (t, s) => `<div class="cohead"><b>${t}</b><div class="muted small">${s}</div></div>`;
  return `<div class="crumb"><a data-go="adm" data-sub="pc-companies">Company List</a> › ${c ? 'Edit' : 'Add'} Company</div><div class="ttl mb">${c ? '✎ Edit Company' : '＋ Add Company'}<small>${c ? "Review and update the company's profile, registration and contact details." : "Enter the company's profile, registration and contact details to create a new company."}</small></div>
  <form class="card sec coform" id="coform" data-act="coSave" novalidate>
   ${head('Company Information', 'Basic profile of the company.')}
   <div class="cogrid"><div class="field"><label>Company Logo <i>*</i></label><button type="button" class="upcircle ${F.logo ? 'has' : ''}" style="border-radius:4px;width:100%;height:170px" data-act="coLogo">${F.logo ? `<span style="font-size:2.4rem;font-weight:800;color:${F.color}">${F.short}</span><small>Change logo</small>` : '<span style="font-size:1.6rem">📷</span><small>Upload Company Logo</small>'}</button><div class="small muted center mt">Allowed image formats: <b>.jpeg, .jpg, .png</b> · Max 2 MB</div><div class="ferr" data-err="logo"></div></div>
    <div>${coField('Company Name', `<input class="inp" name="name" value="${esc(F.name)}" placeholder="Enter company name">`, 'name')}
     <div class="grid3">${coField('Company Type', opt('type', F.type, DATA.companyTypes, 'Select company type'), 'type')}${coField('Industry Sector', opt('sector', F.sector, DATA.sectors, 'Select industry sector'), 'sector')}${coField('Company Category', opt('cat', F.cat, DATA.companyCats, 'Select company category'), 'cat')}</div>
     ${coField('Company Website', `<input class="inp" name="web" value="${esc(F.web)}" placeholder="e.g. https://www.company.com">`, 'web')}</div></div>
   <div class="field"><label>Company Description <i>*</i></label><div class="row small" style="gap:16px;margin-bottom:8px"><label class="row" style="gap:6px"><input type="radio" name="dmode" value="w" data-act="coMode" ${F.dmode !== 'l' ? 'checked' : ''}> WRITE DESCRIPTION</label><label class="row" style="gap:6px"><input type="radio" name="dmode" value="l" data-act="coMode" ${F.dmode === 'l' ? 'checked' : ''}> ADD ABOUT US LINK</label></div>
    ${F.dmode === 'l' ? `<input class="inp" name="about" value="${esc(F.about)}" placeholder="Enter About Us page link (e.g. https://www.company.com/about-us)"><div class="ferr" data-err="about"></div>` : `<textarea class="inp" name="desc" maxlength="2000" placeholder="Write a short description of the company">${esc(F.desc)}</textarea><div class="ferr" data-err="desc"></div>${counter('desc', 2000, F.desc)}`}</div>
   ${head('Certificate of Incorporation', "Upload the company's Certificate of Incorporation issued by the Registrar of Companies.")}
   <div class="field" style="max-width:480px"><label>Upload Certificate <i>*</i></label>${F.cert ? `<div class="filebox row" style="background:#F8FAFC"><span>📄 ${esc(F.cert)}</span><span class="sp"></span><button type="button" class="iconbtn" title="View" data-act="attach" data-v="${esc(F.cert)}">👁</button><button type="button" class="iconbtn del" title="Remove" data-act="coCertDel">🗑</button></div>` : `<div class="drop" data-act="coCert"><span style="font-size:1.6rem">⬆</span><div><b>Drag &amp; Drop Your File</b><div class="small">.pdf, .jpg, .jpeg, .png Formats we support · Max: 5 MB</div></div></div>`}<div class="ferr" data-err="cert"></div></div>
   ${head('Registration Details', "Enter the company's official registration and tax identification details.")}
   <div class="field" style="max-width:480px"><label>Company Identification</label><div class="msel">${Object.keys(F.ids).map(l => `<span class="chip on">${esc(l)} <button type="button" class="chipx" data-act="coIdDel" data-v="${esc(l)}" title="Remove">×</button></span>`).join('')}<select class="inp sm" data-act="coIdAdd" style="width:auto;border:0;max-width:100%"><option value="">${Object.keys(F.ids).length ? '+ Add identification' : 'Select company identification'}</option>${DATA.companyIds.filter(x => !(x in F.ids)).map(x => `<option>${esc(x)}</option>`).join('')}</select></div></div>
   ${Object.keys(F.ids).length ? `<div class="grid2">${Object.entries(F.ids).map(([l, v], i) => `<div class="field"><label>${esc(l)} <i>*</i></label><div class="row" style="flex-wrap:nowrap;gap:8px"><input class="inp" name="id_${i}" data-label="${esc(l)}" value="${esc(v)}" placeholder="ENTER ${esc(l.toUpperCase())}" style="text-transform:uppercase"><button type="button" class="iconbtn del" data-act="coIdDel" data-v="${esc(l)}" title="Remove">🗑</button></div><div class="ferr" data-err="id_${i}"></div></div>`).join('')}</div>` : ''}
   ${head('Head Office Location', 'Registered head office address of the company.')}
   <div class="grid3">${geo('', F)}</div>${coField('Head Office Address', `<input class="inp" name="addr" value="${esc(F.addr)}" placeholder="Enter complete head office address">`, 'addr')}
   ${head('Other Office Branches', 'Add other office locations of the company, if any.')}
   ${F.branches.map((b, i) => `<div class="cert mb"><div class="cogrid4">${coField('Branch', `<input class="inp" name="b${i}name" value="${esc(b.name)}" placeholder="Enter branch name">`, `b${i}name`)}${geo(`b${i}`, b)}<button type="button" class="iconbtn del" style="align-self:center" title="Remove branch" data-act="coBranchDel" data-i="${i}">🗑</button></div>${coField('Office Address', `<input class="inp" name="b${i}addr" value="${esc(b.addr)}" placeholder="Enter complete branch office address">`, `b${i}addr`)}</div>`).join('')}
   <button type="button" class="btn ghost block mb" style="border-style:dashed" data-act="coBranchAdd">＋ Add Office Branch</button>
   ${head('Contact Person', 'Primary point of contact for placement communication and coordination.')}
   <div class="grid2">${coField('Contact Person Name', `<input class="inp" name="person" value="${esc(F.person)}" placeholder="Enter contact person's full name">`, 'person')}${coField('Designation', `<input class="inp" name="desig" value="${esc(F.desig)}" placeholder="e.g. Manager, Partner, Talent Acquisition Lead">`, 'desig')}</div>
   <div class="grid4">${coField('Email Address', `<input class="inp" name="email" type="email" value="${esc(F.email)}" placeholder="Enter email address">`, 'email')}${coField('Contact Number', `<div class="row" style="gap:0;flex-wrap:nowrap"><span class="cc">🇮🇳 +91</span><input class="inp" name="phone" value="${esc(F.phone)}" maxlength="10" placeholder="Mobile number" style="border-radius:0 10px 10px 0"></div>`, 'phone')}${coField('Alternate Email', `<input class="inp" name="altEmail" value="${esc(F.altEmail)}" placeholder="Enter email address">`, 'altEmail', 0)}${coField('Alternate Number', `<div class="row" style="gap:0;flex-wrap:nowrap"><span class="cc">🇮🇳 +91</span><input class="inp" name="altPhone" value="${esc(F.altPhone)}" maxlength="10" placeholder="Mobile number" style="border-radius:0 10px 10px 0"></div>`, 'altPhone', 0)}</div>
   ${head('Social Media Links', "Add the company's social media profiles, if available.")}
   ${F.social.map((u, i) => `<div class="field"><div class="row" style="flex-wrap:nowrap;gap:8px"><input class="inp" name="s${i}" value="${esc(u)}" placeholder="Enter profile URL (e.g. LinkedIn, Facebook, Instagram)"><button type="button" class="iconbtn del" data-act="coSocialDel" data-i="${i}" title="Remove">🗑</button></div><div class="ferr" data-err="s${i}"></div></div>`).join('')}
   <button type="button" class="btn ghost block mb" style="border-style:dashed" data-act="coSocialAdd">＋ Add Social Media Link</button>
   <div class="row mt"><span class="sp"></span><button type="button" class="btn ghost" data-go="adm" data-sub="pc-companies">✕ Cancel</button><button class="btn" id="cosave">💾 ${c ? 'Update' : 'Add'} Company</button></div></form>`;
};
const coField = (label, ctl, name, req = 1) => `<div class="field"><label>${label}${req ? ' <i>*</i>' : ''}</label>${ctl}<div class="ferr" data-err="${name}"></div></div>`;
