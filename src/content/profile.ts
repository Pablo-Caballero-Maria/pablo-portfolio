/** Who the site is about: identity, contact details and the headline figures. */
import type { ImageAsset, NavItem, Stat } from "./types";

export const profile = {
  name: "Pablo Caballero María",
  shortName: "Pablo Caballero",
  initials: "PC",
  role: "Software Engineer · Machine learning for health",
  description:
    "Software engineer working on machine learning for biomedical research. Portfolio and CV of Pablo Caballero María.",
  intro:
    "I build statistical and deep-learning pipelines that turn clinical, genomic and survey data into answers researchers can use. Currently a researcher in neurology at IMIBIC, Córdoba, and from October 2026 a Master's student in Computational Intelligence at the University of Córdoba.",
  location: "Córdoba, Spain",
  languagesLine: "ES · EN C2 · FR · IT · ZH",
  availability: "Open to master's & research roles",
  email: "pablo.caballero@imibic.org",
  github: "https://github.com/Pablo-Caballero-Maria",
  cv: {
    href: "/Pablo_Caballero_CV.pdf",
    downloadName: "Pablo_Caballero_Maria_CV.pdf",
  },
  portrait: {
    src: "/img/g04.jpg",
    alt: "Pablo giving the valedictorian speech at his graduation from the University of Seville",
    width: 800,
    height: 533,
  } satisfies ImageAsset,
  portraitCaption: "Valedictorian speech · Graduation, University of Seville",
  portraitTag: "Class of 2025",
} as const;

export const stats: Stat[] = [
  { label: "Degree GPA", value: "8.53", unit: "/10", note: "Top 5% of class · +11 subjects at 9–10" },
  { label: "Published", value: "Q1", note: "First author, Applied Sciences" },
  { label: "BIT AI program", value: "97", unit: "/100", note: "Scholarship, Zhuhai, China" },
  { label: "Honours (MH)", value: "5", note: "Honor degree, summa cum laude" },
  { label: "Countries", value: "11", note: "Studied, worked or travelled ↓", href: "#world" },
];

export const about = {
  title: "Engineer by training, researcher by choice",
  paragraphs: [
    "I graduated in Computer Engineering (Software Engineering) from the University of Seville with a GPA of 8.53/10, in the top 5% of my class, and honours in five subjects. My final degree project was an AI model built with the Teléfono de la Esperanza, an NGO that offers free psychological support.",
    "Since then my work has moved toward medicine. At the Maimonides Biomedical Research Institute of Córdoba (IMIBIC) I have worked on RNA-Seq, 16S and variant-calling pipelines, and I now apply statistics and machine learning to patient data in the Neuroplasticity and Oxidative Stress group, studying Alzheimer's disease and multiple sclerosis. I am also part of the Spanish node of 3TR, the largest European research project in immunology to date, and was invited to present our multiple sclerosis results at its annual meeting in Cagliari. In October 2026 I start a Master's in Computational Intelligence at the University of Córdoba. I am also first author of a deep-learning paper on predicting type 2 diabetes from gut microbiota.",
    "Outside the lab I have taught, coached and cared for children in Thailand, Romania and Italy. Those months taught me to stay calm under pressure, communicate across languages and take responsibility when nobody else can.",
  ],
};

/** The home page's sections, in order; the header links to each one. */
export const navigation: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "world", label: "World" },
  { id: "references", label: "References" },
  { id: "contact", label: "Contact" },
];
