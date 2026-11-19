/** Education, skills, languages and recognition. */
import type { Award, EducationItem, Language, SkillGroup } from "./types";

export const degree = {
  period: "Sep 2021 – May 2025",
  location: "Seville, ES",
  title: "BSc Computer Engineering (Software Engineering)",
  institution: "University of Seville · ETS Ingeniería Informática",
  badge: "Valedictorian, class of 2025",
  gpa: { value: 8.53, max: 10 },
  highlights: [
    {
      code: "TOP 5%",
      text: "Grade point average of **8.53 out of 10**, top 5% of the class, plus **11 other subjects** scoring between 9/10 and 10/10",
    },
    {
      code: "TOP 4",
      text: "University of Seville: among the **top 4 Spanish universities for Computer Science** according to the CWTS Leiden Ranking",
    },
    { code: "MH ×5", text: "Honor degree (*summa cum laude*) in **five subjects**, listed below" },
  ],
  honours: [
    "Computer Structure",
    "Computer Networks",
    "Multimedia Signal Processing",
    "Software Design & Testing",
    "Software Process & Management",
  ],
};

export const otherEducation: EducationItem[] = [
  {
    id: "bit",
    period: "Jul 2025 · Scholarship",
    location: "Zhuhai, CN",
    title: "Artificial Intelligence Program",
    institution: "Beijing Institute of Technology (BIT Zhuhai)",
    description:
      "Selected through a University of Seville–BIT agreement. Covered statistical foundations through to state-of-the-art algorithms, taught by leading Chinese academics and practitioners.",
    score: { value: 97, max: 100, display: "bar" },
  },
  {
    id: "neuro-course",
    period: "Dec 2025 · 72 h",
    location: "Córdoba, ES",
    title: "Neurodegenerative Pathology, Neuroimmunology & Critical Care",
    institution: "Reina Sofía University Hospital",
    description:
      "Dementia, Parkinson's and ALS; multiple sclerosis diagnosis and treatment; airway, haemodynamic and cerebral-injury management for neurological patients.",
  },
];

export const upcomingEducation: EducationItem = {
  id: "master",
  period: "From Oct 2026 · Córdoba, ES",
  location: "Córdoba, ES",
  title: "Master's in Computational Intelligence",
  institution: "University of Córdoba",
  badge: "Starting soon",
  upcoming: true,
};

export const highSchool: EducationItem = {
  id: "high-school",
  period: "Sep 2019 – May 2021 · Córdoba, ES",
  location: "Córdoba, ES",
  title: "High School Diploma, Sciences",
  institution: "Saint Victoria High School",
  score: { value: 9.86, max: 10, display: "number" },
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Data science & ML",
    items: ["Deep learning", "Machine learning", "Biostatistics", "Data pipelines", "Data visualization"],
  },
  {
    title: "Bioinformatics & clinical",
    items: ["RNA-Seq", "16S metagenomics", "Variant calling", "Proteomics", "ICH-GCP E6(R3)"],
  },
  {
    title: "Software & systems",
    items: ["Software design & testing", "Project management", "Computer networks", "Signal processing"],
  },
];

export const languages: Language[] = [
  { name: "Spanish", level: "Native", cefr: 6 },
  {
    name: "English",
    level: "C2 Cambridge · [145 Duolingo ↗](https://certs.duolingo.com/ic47pbqpjheyxl5z)",
    cefr: 6,
  },
  { name: "French", level: "Intermediate", cefr: 3 },
  { name: "Italian", level: "Intermediate", cefr: 3 },
  { name: "Chinese", level: "Basic", cefr: 1 },
];

export const workStyle = [
  "Calm and reliable under pressure",
  "Treats challenges as chances to grow",
  "Quick learner, open to new ideas",
  "Comfortable in international teams",
  "Spanish driving licence (B)",
];

export const awards: Award[] = [
  {
    code: "VAL",
    tone: "warm",
    text: "Valedictorian, graduation ceremony, School of Computer Engineering, University of Seville",
  },
  {
    code: "SCH",
    tone: "accent",
    text: "Competitive scholarship for the AI summer program at Beijing Institute of Technology (China)",
  },
  {
    code: "SCH",
    tone: "accent",
    text: "Ministry of Education & FECYT scholarship for a summer program in Vigo, awarded on academic record",
  },
  {
    code: "TLK",
    tone: "accent",
    text: 'Invited speaker, "Highlighting Talent" conference, University of Seville · [event ↗](https://www.informatica.us.es/index.php/noticias/celebrada-la-ii-jornada-destacando-talento)',
  },
  {
    code: "TLK",
    tone: "accent",
    text: "Invited speaker, 3TR annual meeting (European public–private research project on immunology), Cagliari, Italy · presented multiple sclerosis results for the Spanish node · [event ↗](https://www.linkedin.com/feed/update/urn:li:activity:7514283456894439424/)",
  },
  {
    code: "PRG",
    tone: "accent",
    text: 'IX "Young Researchers" introduction-to-research program, Andalusian universities',
  },
  { code: "PRG", tone: "accent", text: "XXVI summer program for gifted students, Huerta del Rey centre" },
  {
    code: "PRG",
    tone: "accent",
    text: 'Program coordinator, "Enhancing knowledge and skills in scientific and mathematical operations", Kasetsart University (Thailand)',
  },
  {
    code: "OLY",
    tone: "accent",
    text: "Thales Mathematics Olympiad, Andalusian Society of Mathematical Education",
  },
  { code: "1ST", tone: "warm", text: "First place, writing contest, Municipal Water Company of Córdoba" },
  { code: "FIN", tone: "warm", text: 'Finalist, "Educaletras" writing contest, Cajamar' },
  {
    code: "CRT",
    tone: "accent",
    text: "Good Clinical Practice (GCP) E6(R3), International Council for Harmonisation",
  },
  { code: "CRT", tone: "accent", text: "300 h Data Visualization, freeCodeCamp" },
  { code: "CRT", tone: "accent", text: "72 h Neurodegenerative pathology course, Reina Sofía Hospital" },
  { code: "CRT", tone: "accent", text: "10 h Work Hazards Prevention, Quirón group" },
];
