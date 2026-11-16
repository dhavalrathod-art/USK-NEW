// Dummy data for the USK prototype. All names, IDs and contacts are fictional.
const DATA = {
  institute: 'L.D. College of Engineering, Ahmedabad',
  student: {
    name: 'Aarav Patel', initials: 'AP', apaar: '452819367781', apaarMasked: '45XXXX7781',
    email: 'aarav.patel.ldce@gmail.com', emailMasked: 'a•••••l@gmail.com', mobile: '9876543210', mobileMasked: '98XXXX3210',
    dob: '14/03/2005', gender: 'Male', category: 'General', religion: 'Hindu', domicile: 'No', pwd: 'No',
    enrollment: '230280107014', programme: 'BE/B-Tech', branch: 'Computer Engineering', semester: 'Sem-5', year: 'Year 3',
    university: 'Gujarat Technological University', admissionYear: '2023-2024', admissionType: 'Regular', agency: 'ACPC', status: 'Studying',
    address: '12, Shantinagar Society, Near Vastrapur Lake, Ahmedabad – 380015, Gujarat',
    social: [{ type: 'LinkedIn', url: 'linkedin.com/in/aarav-patel' }, { type: 'GitHub', url: 'github.com/aaravpatel-dev' }, { type: 'Instagram', url: 'instagram.com/aarav.codes' }, { type: 'Facebook', url: 'facebook.com/aarav.patel.dev' }],
    // board = Board / University, school = School / Institute (kept generic so passport and PDF views stay simple)
    prev: [
      { kind: 'HSC', type: 'HSC', board: 'GSEB', school: 'Shree Swaminarayan Vidyalaya', seat: 'E 1XXXX52', year: '2022-2023', result: '86.40%', stream: 'Science' },
      { kind: 'SSC', type: 'SSC', board: 'GSEB', school: 'Shree Swaminarayan Vidyalaya', seat: 'B 4XXXX17', year: '2020-2021', result: '91.20%' }
    ],
    skills: ['Java', 'Python', 'SQL', 'Spring Boot', 'React JS', 'Data Structures and Algorithms', 'Git', 'Docker'],
    softSkills: ['Tech-Fest', 'Technical Quiz']
  },
  skillMaster: [
    { id: 1, name: 'Technical & Digital Skills', subs: ['Artificial Intelligence', 'Cloud Computing', 'Cyber Security', 'Data Analytics', 'Docker', 'Git', 'Java', 'Kubernetes', 'Python', 'React JS', 'Spring Boot', 'SQL', 'Web Development', 'Data Structures and Algorithms', 'Power BI'] },
    { id: 2, name: 'Community Outreach & Social Initiatives', subs: ['Community Service (One Academic Year)', 'Community Service (One Month)', 'Community Service (One Semester)', 'NSS / NCC (one-year programme)'] },
    { id: 3, name: 'Induction Program', subs: ['Aptitude / Reasoning', 'Group Discussion', 'STTP', 'Tech-Fest', 'Technical Quiz'] },
    { id: 4, name: 'Innovation / IPR / Entrepreneurship', subs: ['Attracted External Funding', 'Filed a Patent', 'Completed Prototype Development', 'Awards / Recognitions for Products'] },
    { id: 5, name: 'Leadership', subs: ['Academic Special Initiatives', 'Festival (Technical / Business) Events', 'GTU Innovation Club / SA Exts', 'Professional Societies (ASME / ACM / IEEE)'] },
    { id: 6, name: 'Arts & Cultural Skills', subs: ['Acting', 'Ballet', 'Bharatanatyam', 'Calligraphy', 'Classical Vocal', 'Craft Making', 'Creative Writing', 'Dandiya Raas', 'Drama', 'Elocution', 'Flute', 'Folk Dance', 'Garba', 'Guitar', 'Harmonium', 'Hip Hop', 'Instrumental Music', 'Kathak', 'Kathakali', 'Keyboard', 'Kuchipudi', 'Light Vocal', 'Manipuri', 'Mehndi Art', 'Mimicry', 'Mohiniyattam', 'Odissi', 'Painting', 'Photography', 'Poetry Recitation', 'Rangoli', 'Sculpture', 'Sketching', 'Tabla', 'Theatre', 'Violin', 'Western Dance'] },
    { id: 7, name: 'Communication Skills', subs: ['Active Listening', 'Anchoring', 'Business Communication', 'Debate', 'Email Etiquette', 'Group Discussion', 'Interview Skills', 'Negotiation', 'Persuasion', 'Presentation Skills', 'Public Speaking', 'Report Writing', 'Storytelling', 'Verbal Communication', 'Written Communication'] },
    { id: 8, name: 'Creativity & Innovation', subs: ['Design Thinking', 'Ideation', 'Innovation Challenge', 'Problem Solving', 'Product Design'] },
    { id: 9, name: 'Digital Citizenship', subs: ['Cyber Safety Awareness', 'Digital Privacy Awareness', 'Digital Responsibility', 'Online Etiquette', 'Responsible Social Media Use'] },
    { id: 10, name: 'Entrepreneurship', subs: ['Business Plan Competition', 'Startup Incubation', 'Market Research', 'Pitching to Investors'] },
    { id: 11, name: 'Ethics & Values', subs: ['Academic Integrity', 'Environmental Ethics', 'Professional Ethics', 'Social Responsibility'] },
    { id: 12, name: 'Life Skills', subs: ['Civic Responsibility', 'Disaster Management', 'Environmental Responsibility', 'Financial Literacy', 'Health & Wellness', 'Personal Hygiene', 'Road Safety', 'Work-Life Balance'] },
    { id: 13, name: 'Technical / Research Skill', subs: ['Consultancy Projects', 'Industrial / Exhibition Visit', 'MOOC with Final Assessment', 'Paper Presentation', 'Poster Presentation', 'Project (Non Curricular)', 'Student Skill Development', 'Training / Internship / Professional Certification'] },
    { id: 14, name: 'Volunteer & Community Engagement', subs: ['Community Outreach', 'Disaster Relief', 'Election Awareness', 'Health Camp', 'Literacy Campaign', 'NCC', 'Red Cross', 'Road Safety Campaign', 'Scout & Guide'] }
  ],
  // Job-Oriented Skill Master (recording 14): flat list students choose their "Job Oriented Skills" from
  jobSkills: ['Accounting', 'Artificial Intelligence', 'AWS', 'Business Analysis', 'C', 'C++', 'Cloud Computing', 'Communication', 'Content Writing', 'Critical Thinking', 'CSS', 'Customer Service', 'Cybersecurity', 'Data Analysis', 'Data Entry', 'Data Structures and Algorithms',
    'Digital Marketing', 'Docker', 'Financial Analysis', 'Git', 'Graphic Design', 'Hibernate', 'HTML', 'Human Resource Management', 'Java', 'JavaScript', 'Kubernetes', 'Leadership', 'Machine Learning', 'Microservices', 'MySQL', 'Networking', 'PostgreSQL',
    'Problem Solving', 'Project Management', 'Python', 'Quality Assurance', 'React.js', 'REST API Development', 'Sales', 'Software Testing', 'Spring Boot', 'Spring Framework', 'SQL', 'Teamwork', 'Time Management'],
  universities: ['Gujarat Technological University', 'Gujarat University, Ahmedabad', 'Maharaja Sayajirao University, Vadodara', 'Sardar Patel University, Anand', 'Veer Narmad South Gujarat University, Surat', 'Saurashtra University, Rajkot', 'Hemchandracharya North Gujarat University, Patan', 'Nirma University, Ahmedabad'],
  institutes: ['L.D. College of Engineering, Ahmedabad', 'Government Engineering College, Gandhinagar', 'Government Polytechnic, Ahmedabad', 'Sarvajanik College of Engineering, Surat', 'Faculty of Technology & Engineering, MSU', 'Birla Vishvakarma Mahavidyalaya, Anand', 'Vijaynagar Arts College, Vijaynagar'],
  boards: ['GSEB', 'CBSE', 'ICSE', 'NIOS', 'Other State Board'],
  streams: ['Science', 'Commerce', 'Arts', 'Vocational'],
  skillLevels: ['College', 'District', 'State', 'National', 'International', 'University', 'Zonal'],
  certs: [
    { id: 1, name: 'AWS Certified Cloud Practitioner', skill: 'Cloud Computing', org: 'Amazon Web Services', issue: '18/06/2026', expiry: '18/06/2029', cid: 'AWS-CCP-58H2K9', level: 'International' },
    { id: 2, name: 'Java Programming Fundamentals', skill: 'Java', org: 'NPTEL · IIT Kharagpur', issue: '12/04/2026', expiry: '—', cid: 'NPTEL26CS41S3', level: 'National' }
  ],
  internships: [
    { id: 1, company: 'Nexora Softech', sector: 'Web Development', start: '01 May, 2026', end: '30 Jun, 2026', duration: '02 Months', skills: ['React JS', 'REST APIs', 'Git'], file: 'Internship_Certificate.pdf' },
    { id: 2, company: 'Sabar Fintech', sector: 'Backend Engineering', start: '08 Dec, 2025', end: '06 Jan, 2026', duration: '01 Month', skills: ['Spring Boot', 'SQL'], file: 'Completion_Letter.pdf' }
  ],
  special: [{ id: 1, title: 'State Level Winner', event: 'Smart Gujarat Hackathon 2025 · Agri-Tech Track', org: 'Student Startup & Innovation Hub', date: '15 Feb, 2026', skill: 'Problem Solving', level: 'State' }],
  semesters: [
    { n: 'I', term: 'DEC 2023 (WINTER)', credits: 20, sgpa: 8.12, courses: [['3110005', 'Basic Electrical Engineering', 4, 'AB'], ['3110014', 'Mathematics – I', 5, 'AA'], ['3110003', 'Programming for Problem Solving', 5, 'AA'], ['3110013', 'Engineering Graphics & Design', 5, 'BB'], ['3110002', 'English', 1, 'AB']] },
    { n: 'II', term: 'MAY 2024 (SUMMER)', credits: 22, sgpa: 8.35, courses: [['3120007', 'Physics', 5, 'AB'], ['3120001', 'Mathematics – II', 5, 'AA'], ['3120008', 'Basic Mechanical Engineering', 4, 'BB'], ['3120009', 'Basic Civil Engineering', 4, 'AB'], ['3120002', 'Environmental Science', 2, 'AA'], ['3120003', 'Workshop', 2, 'AA']] },
    { n: 'III', term: 'DEC 2024 (WINTER)', credits: 21, sgpa: 8.61, courses: [['3130702', 'Data Structures', 4, 'AA'], ['3130704', 'Digital Fundamentals', 4, 'AB'], ['3130703', 'Database Management Systems', 4, 'AA'], ['3130006', 'Probability & Statistics', 4, 'AB'], ['3130007', 'Indian Constitution', 0, 'PP'], ['3130008', 'Design Engineering 1A', 5, 'AA']] },
    { n: 'IV', term: 'MAY 2025 (SUMMER)', credits: 21, sgpa: 8.55, courses: [['3140702', 'Operating System', 4, 'AA'], ['3140705', 'Object Oriented Programming – I', 4, 'AA'], ['3140707', 'Computer Organization', 4, 'AB'], ['3140708', 'Discrete Mathematics', 4, 'BB'], ['3140709', 'Principles of Economics', 3, 'AB'], ['3140005', 'Design Engineering 1B', 2, 'AA']] },
    { n: 'V', term: 'DEC 2025 (WINTER)', credits: 20, sgpa: 8.67, courses: [['3150703', 'Analysis & Design of Algorithms', 5, 'AA'], ['3150709', 'Professional Ethics', 0, 'PP'], ['3150710', 'Computer Networks', 5, 'AB'], ['3150711', 'Software Engineering', 5, 'AA'], ['3150713', 'Python for Data Science', 5, 'AA']] }
  ],
  schemes: [
    { id: 1, dept: 'Education Department, Govt. of Gujarat', c: ['#DCFCE7', '#15803D'], name: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY)', desc: 'Provides 50% tuition fee reimbursement for meritorious students in professional courses.', elig: '80 percentile in 10th / 12th', income: '₹6,00,000 per annum', src: 'mysy.guj.nic.in' },
    { id: 2, dept: 'Government of Gujarat', c: ['#FCE7F3', '#BE185D'], name: 'Digital Gujarat Post-Matric Scholarship for Scheduled Tribes', desc: 'Financial assistance covering tuition fees, hostel costs and study materials.', elig: 'ST students in post-matric courses', income: '₹2,50,000 per annum', src: 'digitalgujarat.gov.in' },
    { id: 3, dept: 'Ministry of Education, GoI', c: ['#DBEAFE', '#1D4ED8'], name: 'Central Sector Scheme of Scholarships for College Students', desc: 'Annual scholarship for meritorious students from low-income families.', elig: 'Above 80th percentile in Class XII', income: '₹4,50,000 per annum', src: 'scholarships.gov.in' },
    { id: 4, dept: 'Gujarat Knowledge Society', c: ['#FEF3C7', '#B45309'], name: 'Student Startup & Innovation Policy (SSIP 2.0)', desc: 'Support for student innovators: prototype grants, mentoring and incubation.', elig: 'Students of Gujarat institutions', income: 'No income limit', src: 'ssip.gujarat.gov.in' },
    { id: 5, dept: 'Government of Gujarat', c: ['#FCE7F3', '#BE185D'], name: 'Digital Gujarat Scholarship Portal', desc: 'Offers over 33 scholarship schemes for students from SC, ST, OBC, SEBC, EWS and minority communities.', elig: 'Gujarat domicile students', income: 'Varies by scheme', src: 'digitalgujarat.gov.in' },
    { id: 6, dept: 'Social Justice and Empowerment Dept.', c: ['#DBEAFE', '#1D4ED8'], name: 'Post-Matric Scholarship for Scheduled Caste (SC) Students', desc: 'Financial assistance for SC students pursuing post-matriculation studies in Gujarat.', elig: 'SC students in post-matric courses', income: '₹2,50,000 per annum', src: 'sje.gujarat.gov.in' },
    { id: 7, dept: 'Tribal Development Dept.', c: ['#FEE2E2', '#B91C1C'], name: 'Post-Matric Scholarship for Scheduled Tribe (ST) Students', desc: 'Financial assistance for ST students pursuing post-matriculation studies in Gujarat.', elig: 'ST students in post-matric courses', income: '₹2,50,000 per annum', src: 'tribal.gujarat.gov.in' },
    { id: 8, dept: 'Social Justice and Empowerment Dept.', c: ['#DCFCE7', '#15803D'], name: 'Post-Matric Scholarship for Other Backward Classes (OBC)', desc: 'Financial assistance for OBC students pursuing post-matriculation studies.', elig: 'OBC students in post-matric courses', income: '₹2,50,000 per annum', src: 'sje.gujarat.gov.in' },
    { id: 9, dept: 'Social Justice and Empowerment Dept.', c: ['#FCE7F3', '#BE185D'], name: 'Post-Matric Scholarship for Economically Backward Classes (EBC)', desc: 'Support for EBC students in higher secondary and higher education.', elig: 'EBC students in post-matric courses', income: '₹1,50,000 per annum', src: 'sje.gujarat.gov.in' },
    { id: 10, dept: 'Tribal Development Dept.', c: ['#DCFCE7', '#15803D'], name: 'Pre-Matric Scholarship for Scheduled Tribe (ST) Students', desc: 'Financial assistance for ST students studying in Classes 1 to 10 in Gujarat.', elig: 'ST students in Classes 1–10', income: '₹2,50,000 per annum', src: 'tribal.gujarat.gov.in' },
    { id: 11, dept: 'Social Justice and Empowerment Dept.', c: ['#DBEAFE', '#1D4ED8'], name: 'Pre-Matric Scholarship for Minority Students', desc: 'Financial assistance for minority community students studying in Classes 1 to 10.', elig: 'Minority students in Classes 1–10', income: '₹1,00,000 per annum', src: 'scholarships.gov.in' },
    { id: 12, dept: 'Education Department, Govt. of Gujarat', c: ['#FEE2E2', '#B91C1C'], name: 'NAMO E-Tablet Yojana', desc: 'Provides tablets at a subsidised price to first-year college students in Gujarat to promote digital learning.', elig: 'First-year UG / Diploma students', income: '₹1,00,000 per annum', src: 'digitalgujarat.gov.in' },
    { id: 13, dept: 'Ministry of Corporate Affairs, GoI', c: ['#E0F2FE', '#0369A1'], name: 'PM Internship Scheme', desc: 'Twelve-month paid internships with top companies, with a monthly assistance and a one-time grant.', elig: 'Age 21–24, not in full-time study or job', income: '₹8,00,000 per annum', src: 'pminternship.mca.gov.in' },
    { id: 14, dept: 'Labour & Employment Dept., Gujarat', c: ['#DCFCE7', '#15803D'], name: 'Mukhyamantri Apprenticeship Yojana', desc: 'Stipend support for apprentices trained in Gujarat industries, with part of the stipend paid by the State.', elig: 'ITI / Diploma / Graduate apprentices', income: 'No income limit', src: 'apprenticeshipindia.gov.in' },
    { id: 15, dept: 'Ministry of Skill Development, GoI', c: ['#FEF3C7', '#B45309'], name: 'Skill India Digital Hub', desc: 'Free industry-recognised courses, assessments and certificates, with links to jobs and apprenticeships.', elig: 'All students and job seekers', income: 'No income limit', src: 'skillindiadigital.gov.in' },
    { id: 16, dept: 'Ministry of Education, GoI', c: ['#EDE9FE', '#6D28D9'], name: 'SWAYAM Online Courses', desc: 'Free online courses from IITs and universities; credits can be transferred to your degree programme.', elig: 'All enrolled students', income: 'No income limit', src: 'swayam.gov.in' }
  ],
  scholarshipLinks: [
    ['MYSY', '#DCFCE7', '#15803D', 'Mukhyamantri Yuva Swavalamban Yojana', 'Tuition, hostel and book assistance for meritorious students'],
    ['MKKN', '#FCE7F3', '#BE185D', 'Mukhyamantri Kanya Kelavani Nidhi', 'Additional MBBS tuition fee support'],
    ['CMSS', '#DBEAFE', '#1D4ED8', 'Hon. Chief Minister Scholarship Scheme', 'Tuition assistance for Diploma / Degree'],
    ['ISEL', '#FEE2E2', '#B91C1C', 'Interest Subsidy Scheme on Education Loan', '100% interest subsidy on education loans'],
    ['SHODH', '#EDE9FE', '#6D28D9', 'Scheme of Developing High Quality Research', '₹15,000 / month fellowship plus contingency'],
    ['PMS-SC', '#FFEDD5', '#C2410C', 'Post Matric Scholarship for SC Students', 'Fees and academic allowance for Scheduled Castes'],
    ['PMS-ST', '#E0F2FE', '#0369A1', 'Post Matric Scholarship for ST Students', 'Fees and monthly allowance for Scheduled Tribes'],
    ['PMS-SEBC', '#FEE2E2', '#9F1239', 'Post Matric Scholarship for SEBC Students', 'Post-matric scholarship for SEBC students'],
    ['OTHER', '#F1F5F9', '#334155', 'Other Scholarships', 'All other Gujarat state scholarships']
  ],
  announcements: [
    { id: 1, title: 'MYSY 2026-27 – Fresh & Renewal Applications', cat: 'Scholarship', summary: 'Online applications are open for fresh and renewal MYSY students for 2026-27.', desc: 'Eligible students must apply with their APAAR ID, admission details and income certificate. Renewal students must upload the previous year\'s mark sheet. The last date to apply is 31 December 2026.', published: '01/11/2026', expiry: '31/12/2026', status: 'Published', by: 'Education Dept.', link: 'mysy.guj.nic.in', attach: 'MYSY_2026-27_Notification.pdf' },
    { id: 2, title: 'ACPC Supplementary Admission Round', cat: 'Admission', summary: 'Vacant seats in degree engineering will be allotted in a supplementary round.', desc: 'Students who have registered with ACPC can fill choices for the supplementary round between 5 and 10 November 2026.', published: '28/10/2026', expiry: '10/11/2026', status: 'Published', by: 'ACPC', link: 'acpc.gujarat.gov.in', attach: null },
    { id: 3, title: 'Digital Skills Training Program', cat: 'Training', summary: 'Free digital skill development program for final-year students.', desc: 'A six-week online program covering cloud, data analytics and cyber security fundamentals with certificates.', published: '24/10/2026', expiry: '30/11/2026', status: 'Published', by: 'Gujarat Knowledge Society', link: null, attach: 'Training_Schedule.pdf' },
    { id: 4, title: 'GTU Winter Examination Timetable', cat: 'Examination', summary: 'Timetable for the Winter 2026 examinations is published.', desc: 'Students can download the subject-wise timetable. Hall tickets will be available one week before the exams.', published: '20/10/2026', expiry: '15/12/2026', status: 'Published', by: 'GTU', link: 'gtu.ac.in', attach: 'Winter_2026_Timetable.pdf' },
    { id: 5, title: 'Career Guidance & Job Fair', cat: 'Event', summary: 'Attend the career guidance seminar and job fair.', desc: 'Over 40 companies will participate. Register through your college placement cell.', published: '15/10/2026', expiry: '25/11/2026', status: 'Published', by: 'Education Dept.', link: null, attach: null },
    { id: 8, title: 'Student Skill Assessment Registration', cat: 'Examination', summary: 'Online registration has started for the Skill Assessment Test.', desc: 'Final-year students can register for the state skill assessment test. The test is free and certificates are added to the Skill Passport.', published: '10/09/2026', expiry: '30/11/2026', status: 'Published', by: 'Education Dept.', link: null, attach: 'Skill_Assessment_Guidelines.pdf' },
    { id: 9, title: 'Merit Scholarship Applications Open', cat: 'Scholarship', summary: 'Applications are now open for the State Merit Scholarship.', desc: 'Students with 85% or above in their last examination may apply before 15 December 2026.', published: '17/09/2026', expiry: '15/12/2026', status: 'Published', by: 'Education Dept.', link: 'digitalgujarat.gov.in', attach: 'Merit_Scholarship_Notice.pdf' },
    { id: 10, title: 'Final-Year Mega Placement Week', cat: 'Placement', summary: 'Register for the largest placement drive of the academic year.', desc: 'More than 60 companies will recruit final-year students across branches during the placement week.', published: '05/09/2026', expiry: '20/12/2026', status: 'Published', by: 'Education Dept.', link: null, attach: null },
    { id: 6, title: 'Campus Placement Drive 2026', cat: 'Placement', summary: 'Placement drive for final-year students across branches.', desc: 'Details to be shared with colleges.', published: '—', expiry: '—', status: 'Draft', by: 'Education Dept.', link: null, attach: null },
    { id: 7, title: 'National Innovation Challenge 2025', cat: 'Event', summary: 'Submissions for the 2025 challenge are closed.', desc: 'Results have been declared.', published: '01/08/2025', expiry: '30/09/2025', status: 'Expired', by: 'Education Dept.', link: null, attach: null }
  ],
  annCats: { Scholarship: ['#FEE2E2', '#B91C1C'], Admission: ['#DBEAFE', '#1D4ED8'], Training: ['#FEF3C7', '#B45309'], Examination: ['#DCFCE7', '#15803D'], Event: ['#E0E7FF', '#4338CA'], Placement: ['#CCFBF1', '#0F766E'], Internship: ['#FCE7F3', '#BE185D'], Other: ['#F1F5F9', '#334155'] },
  opportunities: [
    { id: 1, company: 'Nexora Softech', color: '#EA580C', role: 'React JS Developer Intern', desc: 'Build responsive web applications using React, work on reusable UI components.', loc: 'Ahmedabad, Gujarat, India', by: '15/12/2026' },
    { id: 2, company: 'Sabar Fintech', color: '#0F766E', role: 'Spring Boot & Angular Intern', desc: 'Work on secured Spring Boot APIs and the Angular front-end that talks to them.', loc: 'Surat, Gujarat, India', by: '30/11/2026' },
    { id: 3, company: 'Kaveri Data Labs', color: '#7C3AED', role: 'Data Analyst Intern · Remote', desc: 'Clean, analyse and visualise data sets for business dashboards using Python and SQL.', loc: 'Remote', by: '10/12/2026' },
    { id: 4, company: 'Narmada Infotech', color: '#B45309', role: 'Summer Internship 2027', desc: 'Eight-week internship across cloud, testing and full-stack development teams.', loc: 'Vadodara, Gujarat, India', by: '31/12/2026' },
    { id: 5, company: 'Sabarmati Robotics', color: '#2563EB', role: 'Embedded Systems Intern', desc: 'Assist in developing and testing embedded firmware for industrial robots.', loc: 'Gandhinagar, Gujarat, India', by: '20/12/2026' },
    { id: 6, company: 'Kutch AgroTech', color: '#16A34A', role: 'Precision Agriculture Intern', desc: 'Apply GIS, remote sensing and data analysis to crop monitoring projects.', loc: 'Bhuj, Gujarat, India', by: '18/12/2026' },
    { id: 7, company: 'Saurashtra Analytics', color: '#7C3AED', role: 'Python Automation Intern', desc: 'A hands-on, mentor-led internship focusing on Python scripting and process automation.', loc: 'Rajkot, Gujarat, India', by: '28/12/2026' },
    { id: 8, company: 'Tapi Design Studio', color: '#DB2777', role: 'Creative Video Editor Intern', desc: 'Create short-form videos and motion graphics for education campaigns.', loc: 'Remote', by: '27/12/2026' },
    { id: 9, company: 'Gir BioSciences', color: '#B45309', role: 'Laboratory Technologist Intern', desc: 'Support lab research in molecular biology and quality testing.', loc: 'Junagadh, Gujarat, India', by: '31/12/2026' },
    { id: 10, company: 'Mahi Cloudworks', color: '#0F766E', role: 'DevOps Intern · Remote', desc: 'Build CI/CD pipelines and container deployments on AWS.', loc: 'Remote', by: '05/01/2027' }
  ],
  events: [
    { d: '18', m: 'NOV 2026', c: ['#EDE9FE', '#6D28D9', '#7C3AED'], name: 'Gujarat State Hackathon 2026', org: 'Student Startup & Innovation Hub', type: 'Hackathon', desc: 'A 36-hour hackathon on smart governance, agri-tech and health.', skills: ['Java', 'Python', 'React JS'] },
    { d: '22', m: 'NOV 2026', c: ['#FEF3C7', '#D97706', '#F59E0B'], name: 'CodeSprint Gujarat – Round 1', org: 'GTU Innovation Council', type: 'Coding Contest', desc: 'Online competitive programming contest in Java, Python and C++.', skills: ['Java', 'Python', 'Data Structures and Algorithms'] },
    { d: '27', m: 'NOV 2026', c: ['#DCFCE7', '#15803D', '#16A34A'], name: 'Cloud & DevOps Bootcamp', org: 'L.D. College of Engineering', type: 'Bootcamp', desc: 'Hands-on Docker, Kubernetes and AWS fundamentals for students.', skills: ['Docker', 'Kubernetes'] },
    { d: '04', m: 'DEC 2026', c: ['#DBEAFE', '#1D4ED8', '#2563EB'], name: 'Tech Fest Vadodara 2026', org: 'Regional Engineering Colleges', type: 'Tech-Fest', desc: 'Robotics, coding and project exhibitions across three days.', skills: ['Tech-Fest'] },
    { d: '09', m: 'DEC 2026', c: ['#FCE7F3', '#BE185D', '#DB2777'], name: 'Design Thinking Workshop', org: 'GUSEC', type: 'Workshop', desc: 'A one-day workshop on user research and rapid prototyping.', skills: ['Problem Solving'] },
    { d: '14', m: 'DEC 2026', c: ['#E0F2FE', '#0369A1', '#0284C7'], name: 'Startup Gujarat Pitch Day', org: 'iCreate', type: 'Startup Program', desc: 'Pitch your student startup to a panel of investors and mentors.', skills: ['Attracted External Funding'] },
    { d: '18', m: 'DEC 2026', c: ['#FEE2E2', '#B91C1C', '#DC2626'], name: 'Cyber Security Webinar', org: 'Gujarat Police Cyber Cell', type: 'Webinar', desc: 'Stay safe online: phishing, UPI fraud and data privacy.', skills: ['Cyber Security'] },
    { d: '22', m: 'DEC 2026', c: ['#F5F3FF', '#6D28D9', '#8B5CF6'], name: 'State Science Quiz 2026', org: 'GUJCOST', type: 'Government Event', desc: 'Inter-college quiz on science, technology and innovation.', skills: ['Technical Quiz'] }
  ],
  jobs: [
    { id: 1, company: 'Nexora Softech', short: 'NX', color: '#EA580C', web: 'nexorasoftech.example', title: 'Java Backend Developer', type: 'Placements And Internship', work: 'Hybrid', loc: 'Ahmedabad, Gujarat', start: '01/11/2026', by: '20 Nov 2026', applicants: 12, vacancies: 6, timeline: '01 Nov – 20 Nov 2026', desc: 'Design and build REST APIs with Java and Spring Boot, write unit tests and work with SQL databases. Final-year BE/B-Tech (CE / IT) students with CGPA 7.0 or above may apply.', skills: ['Java', 'Spring Boot', 'SQL', 'Git'], rounds: ['Aptitude Test', 'Technical Interview', 'HR Round'] },
    { id: 2, company: 'Sabar Fintech', short: 'SF', color: '#0F766E', web: 'sabarfintech.example', title: 'Spring Boot Developer Intern', type: 'Internship', work: 'On-site', loc: 'Surat, Gujarat', start: '28/10/2026', by: '25 Nov 2026', applicants: 8, vacancies: 4, timeline: '28 Oct – 25 Nov 2026', desc: 'Six-month internship building payment microservices with Spring Boot.', skills: ['Spring Boot', 'Java', 'SQL'], rounds: ['Online Test', 'Technical Interview', 'HR Round'] },
    { id: 3, company: 'Kaveri Data Labs', short: 'KD', color: '#7C3AED', web: 'kaveridata.example', title: 'Data Analyst Trainee', type: 'Internship', work: 'Remote', loc: 'Bengaluru, Karnataka', start: '20/10/2026', by: '30 Nov 2026', applicants: 21, vacancies: 10, timeline: '20 Oct – 30 Nov 2026', desc: 'Analyse business data with Python, SQL and Power BI.', skills: ['Python', 'SQL', 'Power BI'], rounds: ['Theory Round', 'Practical Test', 'HR Round'] },
    { id: 4, company: 'Narmada Infotech', short: 'NI', color: '#B45309', web: 'narmadainfotech.example', title: 'Cloud Support Engineer', type: 'Placement', work: 'Hybrid', loc: 'Gandhinagar, Gujarat', start: '01/11/2026', by: '05 Dec 2026', applicants: 5, vacancies: 3, timeline: '01 Nov – 05 Dec 2026', desc: 'Support customers on AWS and Azure workloads.', skills: ['Docker', 'Kubernetes', 'Cloud Computing'], rounds: ['Aptitude Test', 'HR Round'] },
    { id: 5, company: 'Sahyadri Systems', short: 'SS', color: '#DC2626', web: 'sahyadrisystems.example', title: 'React JS Developer', type: 'Placement', work: 'Hybrid', loc: 'Pune, Maharashtra', start: '04/11/2026', by: '19 Nov 2026', applicants: 0, vacancies: 10, timeline: '04 Nov – 19 Nov 2026', desc: 'Build responsive, reusable UI components in React and work with REST APIs.', skills: ['React JS', 'JavaScript', 'Git'], rounds: ['Aptitude Test', 'HR Round'] },
    { id: 6, company: 'Charotar Analytics', short: 'CA', color: '#2563EB', web: 'charotaranalytics.example', title: 'Data Analyst', type: 'Placement', work: 'Hybrid', loc: 'Vadodara, Gujarat', start: '01/11/2026', by: '07 Dec 2026', applicants: 1, vacancies: 4, timeline: '01 Nov – 07 Dec 2026', desc: 'Prepare dashboards and reports from operational data using SQL and Python.', skills: ['SQL', 'Python', 'Data Analytics'], rounds: ['Aptitude Test', 'Technical Interview', 'HR Round'] },
    { id: 7, company: 'Deccan Cloud Labs', short: 'DC', color: '#0369A1', web: 'deccancloud.example', title: 'Cloud Engineer', type: 'Placements And Internship', work: 'Remote', loc: 'Hyderabad, Telangana', start: '01/11/2026', by: '10 Dec 2026', applicants: 2, vacancies: 5, timeline: '01 Nov – 10 Dec 2026', desc: 'Automate cloud infrastructure with Terraform and manage Kubernetes clusters.', skills: ['Docker', 'Kubernetes', 'Cloud Computing'], rounds: ['Online Test', 'HR Round'] }
  ],
  geo: {
    India: { Gujarat: ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Anand'], Maharashtra: ['Pune', 'Mumbai', 'Nagpur', 'Nashik'], Karnataka: ['Bengaluru', 'Mysuru'], Telangana: ['Hyderabad', 'Warangal'], Rajasthan: ['Jaipur', 'Udaipur'] },
    'United Arab Emirates': { Dubai: ['Dubai'], 'Abu Dhabi': ['Abu Dhabi'] },
    'United States': { California: ['San Francisco', 'San Jose'], Texas: ['Austin', 'Dallas'] }
  },
  applications: [
    { job: 3, date: '28/10/2026', status: 'Selected', stages: ['Cleared', 'Cleared', 'Selected'] },
    { job: 2, date: '30/10/2026', status: 'Rejected', stages: ['Cleared', 'Not cleared'] },
    { job: 4, date: '02/11/2026', status: 'Applied', stages: [] },
    { job: 6, date: '03/11/2026', status: 'Applied', stages: [] },
    { job: 7, date: '04/11/2026', status: 'Applied', stages: [] }
  ],  attHistory: [
    ['30/10/2026', 'Friday', '09:02 AM', '04:41 PM', 'in', '7h 39m', 'Present'], ['29/10/2026', 'Thursday', '09:11 AM', '04:35 PM', 'in', '7h 24m', 'Present'],
    ['28/10/2026', 'Wednesday', '—', '—', '', '0h 00m', 'Absent'], ['27/10/2026', 'Tuesday', '09:05 AM', '04:50 PM', 'in', '7h 45m', 'Present'],
    ['26/10/2026', 'Monday', '08:58 AM', '04:32 PM', 'in', '7h 34m', 'Present'], ['25/10/2026', 'Sunday', '—', '—', '', '—', 'Week Off'],
    ['24/10/2026', 'Saturday', '—', '—', '', '—', 'Holiday · Dussehra'], ['23/10/2026', 'Friday', '09:14 AM', '04:38 PM', 'in', '7h 24m', 'Present'],
    ['22/10/2026', 'Thursday', '09:01 AM', '04:44 PM', 'in', '7h 43m', 'Present'], ['21/10/2026', 'Wednesday', '09:09 AM', '04:30 PM', 'in', '7h 21m', 'Present']
  ],
  corrections: [{ date: '03/11/2026', reason: 'Face not detected at punch-out; left at 04:40 PM', status: 'Pending' }, { date: '14/10/2026', reason: 'Phone battery drained at gate', status: 'Approved' }, { date: '22/09/2026', reason: 'Outside geofence during NSS camp at Sabarmati riverfront', status: 'Rejected' }],
  scholarships: [
    { code: 'MYSY', icon: '🎓', name: 'Mukhyamantri Yuva Swavalamban Yojana', line: 'Tuition, hostel and book assistance for meritorious students', who: ['Minimum marks — see criteria', 'Not admitted on an NRI seat', 'Family income ≤ ₹6,00,000'], benefit: 'Up to 50% tuition fee', eligible: null },
    { code: 'CMSS', icon: '🏅', name: 'Chief Minister Scholarship Scheme', line: 'For students from seven special categories, Diploma and UG courses', who: ['Special category', 'Education pathway', 'Family income ≤ ₹4,50,000'], benefit: 'Annual scholarship up to ₹20,000', eligible: true },
    { code: 'ISEL', icon: '🛡', name: 'Interest Subsidy on Education Loan', line: '100% interest subsidy on education loans up to ₹10 lakh', who: ['UG / PG course', 'Minimum marks — see criteria', 'Family income ≤ ₹6,00,000'], benefit: '100% interest subsidy', eligible: null },
    { code: 'SHODH', icon: '🔬', name: 'Scheme of Developing High Quality Research', line: 'Fellowship for full-time PhD scholars in Gujarat', who: ['Full-time PhD', 'Registered in Gujarat university'], benefit: '₹15,000 / month fellowship', eligible: false },
    { code: 'MKKN', icon: '👩‍⚕️', name: 'Mukhyamantri Kanya Kelavani Nidhi', line: 'Additional MBBS tuition support for girl students', who: ['Girl student', 'MBBS admission', 'Family income ≤ ₹6,00,000'], benefit: '50% tuition fee', eligible: false }
  ],
  cmssCats: [
    ['Category 1 — Child of defence / police personnel', 'Parent is serving, retired or deceased'],
    ['Category 2 — Child of a registered construction worker', 'Parent registered with the welfare board'],
    ['Category 3 — Orphan student', 'Both father and mother deceased'],
    ['Category 4 — Child of a widow', 'Mother receiving widow assistance'],
    ['Category 5 — Person with disability (40%+)', 'Valid disability certificate'],
    ['None of these apply to me', 'You will not be eligible for CMSS']
  ],
  // ---------------- admin data
  // Student Admin: students registered under the institute (dummy). status: Verified / Unverified / Updated (changed details at sign-up) / Rejected
  records: [
    { id: 1, enr: '250283116014', name: 'Kavya Nileshbhai Joshi', apaar: '334086XXXX13', deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', code: '516', yr: '2025-2026', email: 'kavya.joshi@mail.example', mob: '98XXXX6810', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: 'A', dob: '31/03/2007', gender: 'Female', cat: 'SEBC', religion: 'Hindu', agency: 'ACPC', addr: '14, Shantinath Society, Ghatlodiya, Ahmedabad, Gujarat 380061', changed: '' },
    { id: 2, enr: '250283116005', name: 'Rohan Pritesh Pandya', apaar: '788343XXXX81', deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', code: '516', yr: '2025-2026', email: 'rohan.pandya@mail.example', mob: '94XXXX9353', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: '', dob: '12/08/2006', gender: 'Male', cat: 'General', religion: 'Hindu', agency: 'ACPC', addr: 'B-203, Shyamal Residency, Satellite, Ahmedabad, Gujarat 380015', changed: '' },
    { id: 3, enr: '240280116122', name: 'Saumya Sanketkumar Patel', apaar: '606925XXXX03', deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', code: '516', yr: '2024-2025', email: 'saumya.patel@mail.example', mob: '94XXXX5908', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-1', admType: 'Regular', div: '', dob: '05/01/2006', gender: 'Female', cat: 'General', religion: 'Hindu', agency: 'ACPC', addr: '7, Vrundavan Bungalows, Bopal, Ahmedabad, Gujarat 380058', changed: '' },
    { id: 4, enr: '250283107021', name: 'Harsh Mukeshbhai Desai', apaar: '612245XXXX30', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', code: '507', yr: '2025-2026', email: 'harsh.desai@mail.example', mob: '99XXXX6021', reg: 'DIGILOCKER', status: 'Updated', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: '', dob: '22/11/2006', gender: 'Male', cat: 'OBC', religion: 'Hindu', agency: 'ACPC', addr: '31, Gokuldham Society, Naranpura, Ahmedabad, Gujarat 380013', changed: 'Branch, Semester' },
    { id: 5, enr: '250283107033', name: 'Ishita Rajeshbhai Mehta', apaar: '412259XXXX04', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', code: '507', yr: '2025-2026', email: 'ishita.mehta@mail.example', mob: '95XXXX6604', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: 'A', dob: '17/06/2007', gender: 'Female', cat: 'General', religion: 'Jain', agency: 'ACPC', addr: '5, Parshwanath Flats, Paldi, Ahmedabad, Gujarat 380007', changed: '' },
    { id: 6, enr: '250283119032', name: 'Diya Ketanbhai Shah', apaar: '521904XXXX87', deg: 'BE/B-Tech', branch: 'MECHANICAL ENGINEERING', code: '519', yr: '2025-2026', email: 'diya.shah@mail.example', mob: '97XXXX2387', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: '', dob: '09/02/2007', gender: 'Female', cat: 'General', religion: 'Hindu', agency: 'ACPC', addr: '22, Sahjanand Park, Maninagar, Ahmedabad, Gujarat 380008', changed: '' },
    { id: 7, enr: '250283111045', name: 'Meet Jayeshbhai Chauhan', apaar: '473368XXXX58', deg: 'BE/B-Tech', branch: 'ELECTRICAL ENGINEERING', code: '511', yr: '2025-2026', email: 'meet.chauhan@mail.example', mob: '94XXXX1158', reg: 'DIGILOCKER', status: 'Unverified', dl: true, apaarOk: false, sem: 'Sem-3', admSem: 'Sem-1', admType: 'Regular', div: '', dob: '28/09/2007', gender: 'Male', cat: 'SC', religion: 'Hindu', agency: 'ACPC', addr: '9, Ambika Nagar, Odhav, Ahmedabad, Gujarat 382415', changed: '' },
    { id: 8, enr: '250283116027', name: 'Riya Bhaveshbhai Parmar', apaar: '598812XXXX92', deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', code: '516', yr: '2025-2026', email: 'riya.parmar@mail.example', mob: '96XXXX5092', reg: 'DIGILOCKER', status: 'Verified', dl: true, apaarOk: false, sem: 'Sem-5', admSem: 'Sem-3', admType: 'D to D', div: '', dob: '14/04/2007', gender: 'Female', cat: 'SEBC', religion: 'Hindu', agency: 'ACPC', addr: '18, Jalaram Society, Vastral, Ahmedabad, Gujarat 382418', changed: '' }
  ],
  // Programmes and branches offered (Division Management dropdowns)
  degrees: { 'BE/B-Tech': ['INFORMATION TECHNOLOGY', 'COMPUTER ENGINEERING', 'MECHANICAL ENGINEERING', 'ELECTRICAL ENGINEERING', 'CIVIL ENGINEERING', 'CHEMICAL ENGINEERING'], 'Diploma': ['COMPUTER ENGINEERING', 'MECHANICAL ENGINEERING', 'CIVIL ENGINEERING'], 'ME/M-Tech': ['COMPUTER ENGINEERING', 'STRUCTURAL ENGINEERING'], 'MCA': ['COMPUTER APPLICATIONS'] },
  semList: ['Sem-1', 'Sem-2', 'Sem-3', 'Sem-4', 'Sem-5', 'Sem-6', 'Sem-7', 'Sem-8'],
  divcfg: [
    { id: 1, deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', sem: 'Sem-5', divs: ['A', 'B'] },
    { id: 2, deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', sem: 'Sem-3', divs: ['A'] },
    { id: 3, deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: 'Sem-5', divs: ['A', 'B', 'C'] },
    { id: 4, deg: 'BE/B-Tech', branch: 'MECHANICAL ENGINEERING', sem: 'Sem-5', divs: ['A'] },
    { id: 5, deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', sem: 'Sem-1', divs: ['A', 'B', 'C'] },
    { id: 6, deg: 'BE/B-Tech', branch: 'INFORMATION TECHNOLOGY', sem: 'Sem-7', divs: ['A', 'B'] }
  ],
  osVersions: [
    { id: 1, app: 'USK Student App', os: 'Android', ver: '8.0', desc: 'Minimum Android version for face-based attendance and notifications.' },
    { id: 2, app: 'USK Student App', os: 'iOS', ver: '14.0', desc: 'Minimum iOS version; Face ID permission required for attendance.' },
    { id: 3, app: 'Vidhya Setu', os: 'Android', ver: '9.0', desc: 'Geofence punch-in needs location services enabled.' },
    { id: 4, app: 'Vidhya Setu', os: 'iOS', ver: '15.0', desc: 'Location "While Using the App" and Face ID permissions are required for punch-in.' },
    { id: 5, app: 'USK Staff App', os: 'Android', ver: '10.0', desc: 'Used by faculty for attendance punch and leave requests; needs Google Play services.' }
  ],
  adminNotifs: [
    { id: 1, img: '🛠', title: 'Smart Campus One-day Workshop', desc: 'Demo notification from admin: register for the one-day workshop on smart campus tools.', pub: true, date: '03/11/2026' },
    { id: 2, img: '🛡', title: 'Cyber Security Awareness Pledge', desc: 'Take the cyber security awareness pledge and learn how to stay safe online.', pub: true, date: '09/10/2026' },
    { id: 3, img: '🏛', title: 'Welcome to USK Portal!', desc: 'Dear Student, you have successfully registered on the USK portal. Complete your profile to get started.', pub: true, date: '06/10/2026' },
    { id: 4, img: '📝', title: 'Mid-Semester Exam Schedule', desc: 'Mid-semester examinations for all branches start on 23 November 2026. Check the timetable with your HOD.', pub: false, date: '05/11/2026' },
    { id: 5, img: '🩸', title: 'Blood Donation Camp on Campus', desc: 'The NSS unit is organising a blood donation camp on 20 November 2026 in the main auditorium. Register with your class coordinator.', pub: false, date: '04/11/2026' }
  ],
  dashboards: [
    { id: 1, title: 'Higher Education at a Glance', desc: 'Get a consolidated overview of Gujarat\'s higher education ecosystem, including key indicators on students, faculty and institutions.', url: 'https://analytics.usk.example/higher-education', c: '#2563EB' },
    { id: 2, title: 'Knowledge Bank Dashboard', desc: 'Explore educational resources, knowledge assets and content usage across institutions.', url: 'https://analytics.usk.example/knowledge-bank', c: '#7C3AED' },
    { id: 3, title: 'University & Institute Dashboard', desc: 'View key information and insights about universities and institutes across the state.', url: 'https://analytics.usk.example/institutes', c: '#0F766E' },
    { id: 4, title: 'Student Dashboard', desc: 'Track key student-related information and insights such as enrolment and progression.', url: 'https://analytics.usk.example/students', c: '#EA580C' },
    { id: 5, title: 'Faculty Dashboard', desc: 'Explore faculty-related data and insights supporting staffing and academic planning.', url: 'https://analytics.usk.example/faculty', c: '#DB2777' },
    { id: 6, title: 'Attendance Dashboard', desc: 'Monitor attendance data and insights to support student engagement.', url: 'https://analytics.usk.example/attendance', c: '#16A34A' },
    { id: 7, title: 'NEP Dashboard', desc: 'Explore progress, initiatives and key indicators related to NEP 2020 implementation.', url: 'https://analytics.usk.example/nep', c: '#B45309' }
  ],
  // HOD / Teacher (recording 10): students of the department whose daily attendance the HOD manages
  hodStudents: [
    ['230280107014', 'Aarav Patel', 'Sem-5'], ['230280107021', 'Kavya Joshi', 'Sem-5'], ['230280107033', 'Ishita Mehta', 'Sem-5'], ['230280107040', 'Dev Rana', 'Sem-5'],
    ['230280107047', 'Nisha Solanki', 'Sem-5'], ['230280107052', 'Kunal Vora', 'Sem-5'], ['230280107058', 'Tanvi Rathod', 'Sem-5'], ['230280107063', 'Parth Gohil', 'Sem-5'],
    ['240280107011', 'Mihir Trivedi', 'Sem-3'], ['240280107019', 'Pooja Chavda', 'Sem-3'], ['240280107026', 'Yash Panchal', 'Sem-3'], ['240280107038', 'Sneha Bhatt', 'Sem-3']
  ].map(([enr, name, sem]) => ({ enr, name, sem, deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING' })),
  stuHolidays: [
    { id: 1, name: 'Diwali', desc: 'Festival of lights', date: '2026-11-08' },
    { id: 2, name: 'Gujarati New Year', desc: 'Bestu Varas', date: '2026-11-09' },
    { id: 3, name: 'Dussehra', desc: 'Vijayadashami', date: '2026-10-20' },
    { id: 4, name: 'Christmas', desc: 'Christmas Day', date: '2026-12-25' },
    { id: 5, name: 'Uttarayan', desc: 'Makar Sankranti kite festival', date: '2027-01-14' },
    { id: 6, name: 'Republic Day', desc: 'National holiday', date: '2027-01-26' }
  ],
  register: [
    { enr: '230280107014', name: 'Aarav Patel', in: '09:08 AM', out: '—', status: 'Present' },
    { enr: '230280107021', name: 'Kavya Joshi', in: '09:15 AM', out: '—', status: 'Present' },
    { enr: '230280107033', name: 'Ishita Mehta', in: '—', out: '—', status: 'Absent' },
    { enr: '230280107040', name: 'Dev Rana', in: '09:02 AM', out: '—', status: 'Present' },
    { enr: '230280107047', name: 'Nisha Solanki', in: '09:21 AM', out: '—', status: 'Present' },
    { enr: '230280107052', name: 'Kunal Vora', in: '—', out: '—', status: 'Absent' },
    { enr: '230280107058', name: 'Tanvi Rathod', in: '08:57 AM', out: '—', status: 'Present' },
    { enr: '230280107063', name: 'Parth Gohil', in: '09:11 AM', out: '—', status: 'Present' }
  ],
  staff: [
    { id: 1, name: 'Prof. Nirav Shah', dept: 'Computer Engineering', desig: 'Professor & HOD', shift: 'Morning Shift', in: '09:02 AM', out: '—', status: 'Present' },
    { id: 2, name: 'Dr. Meera Iyer', dept: 'Computer Engineering', desig: 'Associate Professor', shift: 'Morning Shift', in: '09:10 AM', out: '—', status: 'Present' },
    { id: 3, name: 'Prof. Alpesh Rana', dept: 'Mechanical Engineering', desig: 'Assistant Professor', shift: 'Morning Shift', in: '—', out: '—', status: 'On Leave' },
    { id: 4, name: 'Prof. Sneha Pandya', dept: 'Electrical Engineering', desig: 'Assistant Professor', shift: 'Morning Shift', in: '09:24 AM', out: '—', status: 'Late' },
    { id: 5, name: 'Mr. Bharat Dave', dept: 'Administration', desig: 'Office Superintendent', shift: 'General Shift', in: '09:58 AM', out: '—', status: 'Present' },
    { id: 6, name: 'Prof. Kiran Joshi', dept: 'Civil Engineering', desig: 'Assistant Professor', shift: 'Morning Shift', in: '—', out: '—', status: 'Absent' },
    { id: 7, name: 'Dr. Hetal Shah', dept: 'Chemical Engineering', desig: 'Associate Professor', shift: 'Morning Shift', in: '08:55 AM', out: '—', status: 'Present' },
    // 41 more dummy staff across departments (recording 13 shows a 326-person institute; a smaller set keeps the prototype readable)
    ...(() => {
      const F = ['Ankit', 'Bhavna', 'Chirag', 'Dhara', 'Hardik', 'Jinal', 'Ketan', 'Komal', 'Manish', 'Nidhi', 'Paresh', 'Rinku', 'Sagar', 'Trupti', 'Umang', 'Varsha', 'Yogesh', 'Zeel', 'Bhavik', 'Foram', 'Jignesh'];
      const L = ['Acharya', 'Bhatt', 'Chauhan', 'Desai', 'Gohil', 'Jadeja', 'Mehta', 'Modi', 'Parikh', 'Raval', 'Soni', 'Thakkar', 'Vyas'];
      const D = ['Computer Engineering', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Textile Technology', 'Biomedical Engineering', 'Instrumentation & Control Engineering', 'Applied Mechanics', 'Administration'];
      const G = ['Professor', 'Associate Professor', 'Assistant Professor', 'Assistant Professor', 'Lab Assistant'];
      return Array.from({ length: 41 }, (_, i) => { const dept = D[i % D.length], desig = dept === 'Administration' ? ['Office Superintendent', 'Senior Clerk', 'Accountant'][i % 3] : G[(i * 3) % G.length];
        return { id: i + 8, name: `${desig === 'Professor' ? 'Dr.' : desig.includes('Professor') ? 'Prof.' : i % 2 ? 'Ms.' : 'Mr.'} ${F[i % F.length]} ${L[(i * 7 + 3) % L.length]}`, dept, desig }; });
    })()
  ],
  // Shift master (recording 13): times are 24h "HH:MM"; half = half-day hours; late / early = grace minutes
  shifts: [
    { id: 1, name: 'Morning Shift', start: '09:00', end: '17:00', half: 4, late: 15, early: 15 },
    { id: 2, name: 'General Shift', start: '10:00', end: '18:00', half: 4, late: 10, early: 10 },
    { id: 3, name: 'Lab Shift', start: '08:00', end: '16:00', half: 4, late: 10, early: 10 },
    { id: 4, name: 'Library Shift', start: '11:00', end: '19:00', half: 4, late: 15, early: 15 }
  ],
  leaveRequests: [
    { id: 1, name: 'Prof. Alpesh Rana', dept: 'Mechanical Engineering', desig: 'Assistant Professor', type: 'Casual Leave', dur: 'Full Day', days: 2, from: '03/11/2026', to: '04/11/2026', applied: '30/10/2026', status: 'Approved', reason: 'Family function out of town.' },
    { id: 2, name: 'Dr. Meera Iyer', dept: 'Computer Engineering', desig: 'Associate Professor', type: 'Sick Leave', dur: 'Full Day', days: 1, from: '06/11/2026', to: '06/11/2026', applied: '02/11/2026', status: 'Pending', reason: 'Medical appointment.' },
    { id: 3, name: 'Prof. Sneha Pandya', dept: 'Electrical Engineering', desig: 'Assistant Professor', type: 'Casual Leave', dur: 'First Half', days: 0.5, from: '07/11/2026', to: '07/11/2026', applied: '03/11/2026', status: 'Pending', reason: 'Personal work at bank.' },
    { id: 4, name: 'Prof. Kiran Joshi', dept: 'Civil Engineering', desig: 'Assistant Professor', type: 'Casual Leave', dur: 'Full Day', days: 3, from: '20/10/2026', to: '22/10/2026', applied: '15/10/2026', status: 'Rejected', reason: 'Travel.' }
  ],
  // Academic holiday calendar for staff (ISO dates)
  holidays: [
    { id: 1, name: 'Gandhi Jayanti', date: '2026-10-02' }, { id: 2, name: 'Dussehra', date: '2026-10-20' }, { id: 3, name: 'Dhantrayodash', date: '2026-11-06' },
    { id: 4, name: 'Diwali', date: '2026-11-08' }, { id: 5, name: 'Govardhan Puja', date: '2026-11-10' }, { id: 6, name: 'Bhaidooj / Balipratipada', date: '2026-11-11' },
    { id: 7, name: "Guru Nanak's Birthday", date: '2026-11-24' }, { id: 8, name: 'Christmas Day', date: '2026-12-25' }
  ],
  leavePolicy: [
    { cat: 'Casual Leave', code: 'CL', total: 12, carry: 'No', maxCarry: '—', once: 'No' },
    { cat: 'Sick Leave', code: 'SL', total: 10, carry: 'Yes', maxCarry: '20', once: 'No' },
    { cat: 'Earned Leave', code: 'EL', total: 15, carry: 'Yes', maxCarry: '300', once: 'No' },
    { cat: 'Duty Leave', code: 'DL', total: 10, carry: 'No', maxCarry: '—', once: 'No' },
    { cat: 'Compensatory Off', code: 'CO', total: 6, carry: 'No', maxCarry: '—', once: 'No' }
  ],
  myLeaves: [
    { type: 'Casual Leave', dur: 'Full Day', from: '15/10/2026', to: '15/10/2026', days: 1, applied: '12/10/2026', status: 'Approved' },
    { type: 'Sick Leave', dur: 'First Half', from: '02/09/2026', to: '02/09/2026', days: 0.5, applied: '02/09/2026', status: 'Approved' },
    { type: 'Casual Leave', dur: 'Full Day', from: '18/08/2026', to: '19/08/2026', days: 2, applied: '10/08/2026', status: 'Withdrawn' },
    { type: 'Duty Leave', dur: 'Full Day', from: '24/07/2026', to: '25/07/2026', days: 2, applied: '18/07/2026', status: 'Approved' },
    { type: 'Earned Leave', dur: 'Full Day', from: '01/06/2026', to: '05/06/2026', days: 5, applied: '20/05/2026', status: 'Approved' },
    { type: 'Sick Leave', dur: 'Full Day', from: '12/05/2026', to: '12/05/2026', days: 1, applied: '12/05/2026', status: 'Rejected' }
  ],
  schApplications: [
    { id: 'CMSS26-04417', name: 'Kavya Joshi', sch: 'Chief Minister Scholarship Scheme', inst: 'L.D. College of Engineering', date: '01/11/2026', status: 'Pending', income: '₹3,20,000', cat: 'Category 2', gender: 'Female', dob: '02/07/2005', aadhaar: 'XXXX XXXX 4417', district: 'Ahmedabad' },
    { id: 'MYSY26-11829', name: 'Harsh Desai', sch: 'Mukhyamantri Yuva Swavalamban Yojana', inst: 'L.D. College of Engineering', date: '31/10/2026', status: 'Pending', income: '₹4,80,000', cat: '—', gender: 'Male', dob: '19/11/2004', aadhaar: 'XXXX XXXX 1829', district: 'Anand' },
    { id: 'ISEL26-02213', name: 'Riya Parmar', sch: 'Interest Subsidy Scheme on Education Loan', inst: 'L.D. College of Engineering', date: '29/10/2026', status: 'Approved', income: '₹5,10,000', cat: '—', gender: 'Female', dob: '05/02/2005', aadhaar: 'XXXX XXXX 2213', district: 'Vadodara' },
    { id: 'MYSY26-10985', name: 'Yash Trivedi', sch: 'Mukhyamantri Yuva Swavalamban Yojana', inst: 'L.D. College of Engineering', date: '27/10/2026', status: 'Rejected', income: '₹7,40,000', cat: '—', gender: 'Male', dob: '23/09/2004', aadhaar: 'XXXX XXXX 0985', district: 'Surat' }
  ],
  // Student Skill Achievements (Skill Passport Nodal Officer, recording 11): certificates students added, grouped by student on screen
  achievements: [
    { id: 1, student: 'Aarav Patel', enr: '230280107014', inst: 'L.D. College of Engineering, Ahmedabad', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: 'Sem-5', cat: 'Technical & Digital Skills', skill: 'Cloud Computing', title: 'AWS Certified Cloud Practitioner', level: 'International', certNo: 'AWS-CCP-58H2K9', org: 'Amazon Web Services', date: '18/06/2026', expiry: '18/06/2029', desc: 'Foundational certification covering cloud concepts, security and billing.', file: 'AWS_Cloud_Practitioner.pdf' },
    { id: 2, student: 'Aarav Patel', enr: '230280107014', inst: 'L.D. College of Engineering, Ahmedabad', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: 'Sem-5', cat: 'Creativity & Innovation', skill: 'Problem Solving', title: 'State Level Winner – Smart Gujarat Hackathon', level: 'State', certNo: 'SGH-2026-0412', org: 'Student Startup & Innovation Hub', date: '15/02/2026', expiry: '—', desc: 'First prize for a smart attendance solution built in 36 hours.', file: 'Hackathon_Winner.pdf' },
    { id: 3, student: 'Kavya Joshi', enr: '230280107021', inst: 'L.D. College of Engineering, Ahmedabad', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: 'Sem-5', cat: 'Arts & Cultural Skills', skill: 'Classical Vocal', title: 'Youth Festival – First Prize', level: 'University', certNo: 'GTU-YF-2026-118', org: 'Gujarat Technological University', date: '12/01/2026', expiry: '—', desc: 'First prize in classical vocal at the inter-college youth festival.', file: 'Youth_Festival_Certificate.pdf' },
    { id: 4, student: 'Saumya Patel', enr: '240280116122', inst: 'Government Engineering College, Gandhinagar', deg: 'BE/B-Tech', branch: 'ELECTRICAL ENGINEERING', sem: 'Sem-1', cat: 'Arts & Cultural Skills', skill: 'Acting', title: 'Drama Certificate', level: 'University', certNo: '123123123123', org: 'Gujarat Drama Club', date: '12/01/2026', expiry: '04/10/2026', desc: 'Drama certificate of participation.', file: 'Drama_Certificate.pdf' },
    { id: 5, student: 'Diya Shah', enr: '250283119032', inst: 'L.D. College of Engineering, Ahmedabad', deg: 'BE/B-Tech', branch: 'MECHANICAL ENGINEERING', sem: 'Sem-5', cat: 'Volunteer & Community Engagement', skill: 'NCC', title: 'NCC ‘B’ Certificate', level: 'National', certNo: 'NCC-B-26-7734', org: 'National Cadet Corps', date: '30/04/2026', expiry: '—', desc: 'Completed NCC ‘B’ certificate examination.', file: 'NCC_B_Certificate.pdf' },
    { id: 6, student: 'Harsh Desai', enr: '250283107021', inst: 'L.D. College of Engineering, Ahmedabad', deg: 'BE/B-Tech', branch: 'COMPUTER ENGINEERING', sem: 'Sem-5', cat: 'Innovation / IPR / Entrepreneurship', skill: 'Filed a Patent', title: 'Patent filed – Smart Energy Meter', level: 'National', certNo: 'IN202621004512', org: 'Indian Patent Office', date: '08/08/2026', expiry: '—', desc: 'Provisional patent application for an IoT based smart energy meter.', file: 'Patent_Filing_Receipt.pdf' },
    { id: 7, student: 'Mihir Trivedi', enr: '240280107011', inst: 'Government Polytechnic, Ahmedabad', deg: 'Diploma', branch: 'MECHANICAL ENGINEERING', sem: 'Sem-3', cat: 'Communication Skills', skill: 'Debate', title: 'Inter-College Debate – Runner Up', level: 'District', certNo: 'DEB-AHD-2026-22', org: 'District Youth Board, Ahmedabad', date: '21/09/2026', expiry: '—', desc: 'Runner-up in the district inter-college debate competition.', file: 'Debate_Runner_Up.pdf' },
    { id: 8, student: 'Pooja Chavda', enr: '240280107019', inst: 'Sarvajanik College of Engineering, Surat', deg: 'BE/B-Tech', branch: 'CIVIL ENGINEERING', sem: 'Sem-3', cat: 'Digital Citizenship', skill: 'Cyber Safety Awareness', title: 'Cyber Safety Ambassador', level: 'State', certNo: 'CSA-GJ-26-0981', org: 'Gujarat Police Cyber Cell', date: '02/10/2026', expiry: '02/10/2027', desc: 'Completed the cyber safety ambassador programme and ran two awareness sessions.', file: 'Cyber_Safety_Ambassador.pdf' }
  ],
  // Placement Coordinator company master (recording 12); status: Active / Inactive / Blacklisted
  companies: [
    { id: 1, name: 'Nexora Softech Pvt. Ltd.', short: 'NX', color: '#EA580C', type: 'Private Limited Company', sector: 'Information Technology', cat: 'MNC', web: 'https://www.nexorasoftech.example', about: 'https://www.nexorasoftech.example/about-us', desc: '', ids: { 'Permanent Account Number': 'AAXCN4821K', 'Corporate Identification Number': 'U72900GJ2015PTC082341' }, cert: 'Nexora_Incorporation.pdf', country: 'India', state: 'Gujarat', city: 'Ahmedabad', addr: '7th Floor, Shivalik Shilp, Iscon Cross Road, Ahmedabad', branches: [{ name: 'Pune Office', country: 'India', state: 'Maharashtra', city: 'Pune', addr: 'Level 4, Tech Park One, Yerwada, Pune' }], person: 'Ritu Malhotra', desig: 'Senior HR Business Partner', email: 'hr@nexorasoftech.example', phone: '98XXXX1120', altEmail: 'campus@nexorasoftech.example', altPhone: '', social: ['https://www.linkedin.com/company/nexora-softech'], status: 'Active' },
    { id: 2, name: 'Sabar Fintech Ltd.', short: 'SF', color: '#0F766E', type: 'Public Limited Company', sector: 'Banking & Financial Services', cat: 'Large Enterprise', web: 'https://www.sabarfintech.example', about: '', desc: 'Sabar Fintech builds digital payment and lending products for small businesses across India.', ids: { 'Permanent Account Number': 'AAPCS7712L', 'Goods and Services Tax Identification Number': '24AAPCS7712L1Z3' }, cert: 'Sabar_Incorporation.pdf', country: 'India', state: 'Gujarat', city: 'Surat', addr: 'Office 1102, Swastik Towers, Ring Road, Surat', branches: [], person: 'Kunal Mehta', desig: 'Talent Acquisition Lead', email: 'careers@sabarfintech.example', phone: '97XXXX4450', altEmail: '', altPhone: '', social: ['https://www.linkedin.com/company/sabar-fintech', 'https://twitter.com/sabarfintech'], status: 'Active' },
    { id: 3, name: 'Kaveri Data Labs', short: 'KD', color: '#7C3AED', type: 'Limited Liability Partnership (LLP)', sector: 'Information Technology', cat: 'Startup', web: 'https://www.kaveridata.example', about: '', desc: 'Analytics consultancy helping manufacturers turn plant data into dashboards and forecasts.', ids: { 'Limited Liability Partnership Identification Number': 'AAB-4471' }, cert: 'Kaveri_LLP_Deed.pdf', country: 'India', state: 'Karnataka', city: 'Bengaluru', addr: '3rd Floor, Koramangala 5th Block, Bengaluru', branches: [], person: 'Sneha Iyer', desig: 'People Operations Manager', email: 'talent@kaveridata.example', phone: '80XXXX7781', altEmail: '', altPhone: '', social: [], status: 'Inactive' },
    { id: 4, name: 'Narmada Infotech Pvt. Ltd.', short: 'NI', color: '#B45309', type: 'Private Limited Company', sector: 'Information Technology', cat: 'Medium Enterprise', web: 'https://www.narmadainfotech.example', about: '', desc: 'Cloud support and managed services company serving government and enterprise clients.', ids: { 'Permanent Account Number': 'AAHCN2290Q' }, cert: 'Narmada_Incorporation.pdf', country: 'India', state: 'Gujarat', city: 'Gandhinagar', addr: 'Block 9, GIFT City, Gandhinagar', branches: [], person: 'Mahima Sharma', desig: 'HR Manager', email: 'hr@narmadainfotech.example', phone: '99XXXX3021', altEmail: '', altPhone: '', social: [], status: 'Active' },
    { id: 5, name: 'Saurashtra Analytics', short: 'SA', color: '#2563EB', type: 'Partnership', sector: 'Education', cat: 'Small Enterprise', web: 'https://www.saurashtraanalytics.example', about: '', desc: 'Education analytics firm building reporting tools for colleges.', ids: {}, cert: 'Saurashtra_Partnership_Deed.pdf', country: 'India', state: 'Gujarat', city: 'Rajkot', addr: '201, Crystal Mall, Kalawad Road, Rajkot', branches: [], person: 'Ananya Patel', desig: 'Founder & Partner', email: 'ananya@saurashtraanalytics.example', phone: '96XXXX5509', altEmail: '', altPhone: '', social: [], status: 'Blacklisted', remark: 'Did not honour offer letters issued in the 2025 placement drive.' }
  ],
  companyTypes: ['Sole Proprietorship', 'Partnership', 'Limited Liability Partnership (LLP)', 'Private Limited Company', 'Public Limited Company', 'One Person Company (OPC)', 'Section 8 / Non-Profit Company', 'Trust', 'Branch Office (Foreign Company)', 'Liaison Office (Foreign Company)'],
  sectors: ['Agriculture, Forestry & Fishing', 'Mining & Quarrying', 'Manufacturing', 'Construction', 'Electricity, Gas, Steam & Water Supply', 'Wholesale & Retail Trade', 'Transportation & Logistics', 'Information Technology', 'Banking & Financial Services', 'Education', 'Healthcare & Pharmaceuticals', 'Hospitality & Tourism', 'Food & Beverage', 'Textile & Apparel', 'Automotive', 'Media & Entertainment', 'Government & Public Administration'],
  companyCats: ['Small Enterprise', 'MSME', 'Startup', 'MNC', 'Medium Enterprise', 'Large Enterprise', 'Product-Based', 'Service-Based'],
  companyIds: ['Permanent Account Number', 'Tax Deduction and Collection Account Number', 'Corporate Identification Number', 'Limited Liability Partnership Identification Number', 'Goods and Services Tax Identification Number', 'MSME Registration Number', 'Foreign Contribution Regulation Act Registration', 'Society Registration Certificate Number', 'NGO Darpan Unique ID', 'Trust Registration Number', 'Real Estate Regulatory Authority Registration', 'State Professional Tax Registration', 'Employees\' State Insurance Corporation Code', 'Employees\' Provident Fund Organisation ID', 'Import Export Code'],
  location: { lat: 23.0350, lng: 72.5465, radius: 200 }
};
