// Single source of content for the site. Components only read from here.
// Sources: résumés (yuv_w-resume.pdf, Web_dev_Resume.pdf) + AuthCorp from the previous portfolio.

export type SectionId =
  | "about"
  | "skills"
  | "work"
  | "certifications"
  | "experience"
  | "achievements"
  | "contact";

export const PROFILE = {
  name: "Yuvraj Shishodia",
  firstName: "Yuvraj",
  initials: "YS",
  role: "Full Stack Developer",
  email: "yuvrajshishodia24@gmail.com",
  location: "India",
  resumeSummary:
    "Full-stack web developer skilled in React.js, Node.js, and Express.js with hands-on experience building and deploying production-grade applications. Seeking a Web Developer role to contribute to scalable, user-focused products by leveraging strong fundamentals in JavaScript, REST APIs, and database design.",
  heroLine: "Full-stack web developer skilled in React.js, Node.js, and Express.js — building and deploying production-grade applications.",
  aboutExtra:
    "Currently a Software Development Engineer at YNV Solutions, building SwiftCause — a multi-tenant donation platform for UK nonprofits.",
  quote: "Scalable, user-focused products — built on strong fundamentals.",
  currentRole: "Software Development Engineer @ YNV Solutions",
  degree: "B.Tech, Information Technology",
  college: "Ajay Kumar Garg Engineering College",
  collegeShort: "AKGEC",
  graduation: "May 2026",
  graduationYear: "2026",
  github: "https://github.com/yuvraj-shishodia",
  linkedin: "https://linkedin.com/in/yuvraj-shishodia",
  leetcode: "https://leetcode.com/u/yuvraj-shishodia/",
  resume: "/Yuvraj-Shishodia-Resume.pdf",
} as const;

export type Family = "Languages" | "Frontend" | "Backend" | "Databases" | "Cloud & Deploy" | "Concepts";

export type Skill = { name: string; symbol: string; family: Family; usedIn?: string[] };

export const SKILL_GROUPS: { family: Family; skills: Skill[] }[] = [
  {
    family: "Languages",
    skills: [
      { name: "C", symbol: "C", family: "Languages" },
      { name: "C++", symbol: "Cp", family: "Languages" },
      { name: "Java", symbol: "Ja", family: "Languages" },
      { name: "Python", symbol: "Py", family: "Languages" },
      { name: "TypeScript", symbol: "Ts", family: "Languages" },
    ],
  },
  {
    family: "Frontend",
    skills: [
      { name: "HTML", symbol: "Ht", family: "Frontend" },
      { name: "CSS", symbol: "Cs", family: "Frontend" },
      { name: "JavaScript", symbol: "Js", family: "Frontend" },
      { name: "TailwindCSS", symbol: "Tw", family: "Frontend" },
      { name: "React.js", symbol: "Re", family: "Frontend" },
      { name: "Next.js", symbol: "Nx", family: "Frontend" },
    ],
  },
  {
    family: "Backend",
    skills: [
      { name: "Node.js", symbol: "No", family: "Backend" },
      { name: "Express.js", symbol: "Ex", family: "Backend" },
      { name: "Firebase", symbol: "Fb", family: "Backend" },
      { name: "REST APIs", symbol: "Ra", family: "Backend" },
      { name: "Postman", symbol: "Pm", family: "Backend" },
      { name: "JWT", symbol: "Jw", family: "Backend" },
    ],
  },
  {
    family: "Databases",
    skills: [
      { name: "MySQL", symbol: "My", family: "Databases" },
      { name: "MongoDB", symbol: "Mg", family: "Databases" },
      { name: "SQL Server", symbol: "Sq", family: "Databases" },
    ],
  },
  {
    family: "Cloud & Deploy",
    skills: [
      { name: "Docker", symbol: "Dk", family: "Cloud & Deploy" },
      { name: "Render", symbol: "Rn", family: "Cloud & Deploy", usedIn: ["AuthCorp"] },
      { name: "Netlify", symbol: "Nf", family: "Cloud & Deploy", usedIn: ["2 Day Fitness", "Ink & Think"] },
    ],
  },
  {
    family: "Concepts",
    skills: [
      { name: "OOP", symbol: "Oo", family: "Concepts" },
      { name: "Operating Systems", symbol: "Os", family: "Concepts" },
      { name: "DBMS", symbol: "Db", family: "Concepts" },
      { name: "Computer Networks", symbol: "Cn", family: "Concepts" },
    ],
  },
];

export type Experience = {
  org: string;
  role: string;
  period: string;
  start: string; // YYYY-MM, for ordering
  mode: string;
  points: string[];
  tech: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    org: "YNV Solutions",
    role: "Software Development Engineer",
    period: "Aug 2025 – Present",
    start: "2025-08",
    mode: "Remote",
    points: [
      "Built SwiftCause, a multi-tenant donation platform for UK nonprofits with Next.js, React, TypeScript and Feature-Sliced Design, using Stripe Connect for one-time/recurring donations and direct charity payouts.",
      "Engineered Gift Aid and GASDS compliance end-to-end: a donation claim-state machine, an HMRC-compliant CSV/ODS export pipeline and daily cron sweeps enforcing claim deadlines.",
      "Implemented transactional email with Brevo — deduplication, audit-logged delivery tracking and race-safe handling of Firestore eventual consistency.",
      "Designed role-based user management with a 5-tier permission hierarchy and organisation-scoped access control.",
    ],
    tech: ["Next.js", "React.js", "TypeScript", "Firebase", "Stripe"],
  },
  {
    org: "Celebal Technologies",
    role: "Data Engineering Intern",
    period: "Jun 2025 – Aug 2025",
    start: "2025-06",
    mode: "Remote / Hybrid",
    points: [
      "Engineered a sales-focused data warehouse using dimensional modelling in SQL Server.",
      "Developed incremental ETL pipelines with staging layers, reducing processing time by 30%.",
      "Implemented Slowly Changing Dimensions (SCD) Types 1, 2 and 3 for accurate historical tracking.",
      "Designed a lineage tracking framework with reconciliation checks for end-to-end data consistency.",
    ],
    tech: ["SQL Server"],
  },
];

export type Education = { school: string; title: string; period: string; start: string; detail: string };

export const EDUCATION: Education[] = [
  {
    school: "St. Xavier’s Sr. Sec. School",
    title: "Class 12th",
    period: "2021",
    start: "2021-05",
    detail: "Percentage: 86",
  },
  {
    school: "Ajay Kumar Garg Engineering College",
    title: "B.Tech, Information Technology",
    period: "May 2026",
    start: "2026-05",
    detail: "Bachelor of Technology in Information Technology — class of 2026.",
  },
];

export type MiniUiKind = "kiosk" | "forensics" | "gym" | "canvas";

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  live?: string;
  github?: string;
  ui: MiniUiKind;
};

export const PROJECTS: Project[] = [
  {
    id: "swiftcause",
    index: "01",
    title: "SwiftCause",
    kicker: "Donation platform for UK nonprofits",
    description:
      "A production, multi-tenant SaaS donation platform built under YNV Solutions for real UK charities — one-time and recurring donations via Stripe Connect with direct charity payouts.",
    features: [
      "HMRC-compliant Gift Aid engine (+25% eligible donation value)",
      "GASDS claim-state machine & CSV/ODS exports",
      "5-tier, organisation-scoped access control",
      "Dual auth: email admin + PIN kiosk",
      "Brevo email with audit-logged delivery",
      "Feature-Sliced Design, Vitest coverage",
    ],
    tech: ["Next.js", "React.js", "TypeScript", "Firebase", "Stripe", "Vitest"],
    live: "https://swiftcause.com/",
    ui: "kiosk",
  },
  {
    id: "authcorp",
    index: "02",
    title: "AuthCorp",
    kicker: "AI-powered document authentication",
    description:
      "An enterprise-grade document forgery detection platform: 9 FastAPI microservices, forensic detectors, OCR, risk scoring and blockchain anchoring, with a Next.js dashboard for real-time monitoring.",
    features: [
      "9 independent microservices on Render",
      "ELA, quantization & metadata detectors",
      "OCR and risk scoring",
      "Blockchain anchoring (Ethereum & Polygon)",
    ],
    tech: ["Next.js", "FastAPI", "Python", "PostgreSQL", "Redis", "Docker"],
    live: "https://authcorp-phi.vercel.app",
    github: "https://github.com/yuvraj-shishodia/AuthCorp",
    ui: "forensics",
  },
  {
    id: "2dayfitness",
    index: "03",
    title: "2 Day Fitness",
    kicker: "Full stack gym website",
    description:
      "A React gym portal with trainer booking, class scheduling and Stripe payments, plus a personalised ML-based plan recommendation engine.",
    features: [
      "Trainer booking & class scheduling",
      "Stripe payments, 10+ monthly subscriptions",
      "ML recommendations — 15% faster plan search",
      "EmailJS automation — 70% less manual effort",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Flask", "Stripe"],
    live: "https://2dayfitness.netlify.app/",
    ui: "gym",
  },
  {
    id: "inkandthink",
    index: "04",
    title: "Ink & Think",
    kicker: "Real-time multiplayer drawing game",
    description:
      "A real-time multiplayer drawing and guessing game with a WebSocket synchronisation engine, built for instantaneous updates.",
    features: [
      "10+ concurrent players per room",
      "Under 50 ms latency",
      "98% message delivery reliability",
      "500+ words, word packs, chat & leaderboard",
    ],
    tech: ["React.js", "Node.js", "Express.js", "Socket.io"],
    live: "https://inkandthinkbypc.netlify.app/",
    ui: "canvas",
  },
];

export type Certification = { title: string; issuer: string; href?: string };

// None listed on the résumé — the section and its tag are hidden while this is empty.
export const CERTIFICATIONS: Certification[] = [];

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value: number;
  prefix?: string;
  suffix?: string;
  unit: string;
  logo: string; // TechLogo name (brand or concept)
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Gold Medalist",
    caption: "Inter-State Athletics Championship · 2023",
    detail: "1st place in both the 100 m and 200 m sprints",
    value: 450,
    suffix: "+",
    unit: "participants",
    logo: "medal",
  },
  {
    label: "Best Startup Idea Award",
    caption: "Innovation & Entrepreneurship Summit, Thapar University · 2024",
    detail: "1st prize for a technology-driven solution",
    value: 120,
    suffix: "+",
    unit: "startup teams",
    logo: "trophy",
  },
  {
    label: "Gift Aid engine",
    caption: "SwiftCause",
    detail: "HMRC-compliant, with declaration versioning",
    value: 25,
    prefix: "+",
    suffix: "%",
    unit: "eligible donation value",
    logo: "donate",
  },
  {
    label: "Real-time sync",
    caption: "Ink & Think",
    detail: "Under 50 ms latency, 10+ players per room",
    value: 98,
    suffix: "%",
    unit: "message delivery",
    logo: "Socket.io",
  },
  {
    label: "Faster ETL",
    caption: "Celebal Technologies",
    detail: "Incremental pipelines with staging layers",
    value: 30,
    suffix: "%",
    unit: "less processing time",
    logo: "SQL Server",
  },
  {
    label: "Automated onboarding",
    caption: "2 Day Fitness",
    detail: "Email confirmations & receipts via EmailJS",
    value: 70,
    suffix: "%",
    unit: "less manual effort",
    logo: "mail",
  },
];

export const ID_CARD = {
  idNo: "YS-2026",
  dept: "Information Technology",
  validTill: PROFILE.graduationYear,
  back: [
    "Full Stack Developer",
    "B.Tech IT · AKGEC · 2026",
    "Built SwiftCause, AuthCorp & Ink & Think",
    "Inter-State Athletics gold medalist",
    "Best Startup Idea Award winner",
  ],
};

const SECTION_LABELS: Record<SectionId, string> = {
  about: "About",
  skills: "Skills",
  work: "Work",
  certifications: "Certifications",
  experience: "Experience",
  achievements: "Achievements",
  contact: "Contact",
};

const hasData: Record<SectionId, boolean> = {
  about: true,
  skills: SKILL_GROUPS.length > 0,
  work: PROJECTS.length > 0,
  certifications: CERTIFICATIONS.length > 0,
  experience: EXPERIENCE.length + EDUCATION.length > 0,
  achievements: ACHIEVEMENTS.length > 0,
  contact: true,
};

export const SECTIONS = (Object.keys(SECTION_LABELS) as SectionId[]).filter((id) => hasData[id]);

const NAV_IDS: SectionId[] = ["about", "skills", "work", "experience", "achievements", "contact"];

export const NAV = NAV_IDS.filter((id) => hasData[id]).map((id) => ({ id, label: SECTION_LABELS[id] }));

/** "03" for the third rendered section. */
export function sectionIndex(id: SectionId): string {
  return String(SECTIONS.indexOf(id) + 1).padStart(2, "0");
}

/** Every skill with its periodic-table position and the work that uses it. */
export const ELEMENTS = SKILL_GROUPS.flatMap((g) => g.skills).map((s, i) => {
  const usedIn =
    s.usedIn ??
    [
      ...PROJECTS.filter((p) => p.tech.includes(s.name)).map((p) => p.title),
      ...EXPERIENCE.filter((e) => e.tech.includes(s.name)).map((e) => e.org),
    ];
  return { ...s, number: i + 1, usedIn };
});

export type Element = (typeof ELEMENTS)[number];
