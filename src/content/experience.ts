/** Experience timeline (newest first) and the research article. */
import type { ExperienceCategory, ExperienceItem, Publication } from "./types";

export const experienceFilters: { id: "all" | ExperienceCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tech", label: "Research & study" },
  { id: "vol", label: "Volunteering" },
];

export const experience: ExperienceItem[] = [
  {
    id: "master",
    period: "Oct 2026 →",
    title: "Master's in Computational Intelligence",
    organisation: "University of Córdoba",
    location: "Córdoba, ES",
    category: "tech",
    upcoming: true,
    body: [
      "Starting in October 2026: advanced machine learning, soft computing and intelligent systems, building on my research work with clinical and biomedical data.",
    ],
  },
  {
    id: "3tr-speaker",
    period: "Oct 2026",
    title: "Invited Speaker · 3TR Annual Meeting",
    organisation: "3TR consortium · Spanish node (IMIBIC)",
    location: "Cagliari, IT",
    category: "tech",
    highlight: true,
    body: [
      "Invited to the annual meeting of 3TR, the European public–private research project on immunology, in Cagliari (Sardinia) to present our multiple sclerosis results on behalf of the Spanish node.",
    ],
    tags: ["Conference talk", "Multiple sclerosis", "Biostatistics"],
    link: {
      label: "See the event ↗",
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7514283456894439424/",
    },
    image: {
      src: "/img/g16.jpg",
      alt: "Pablo presenting multiple sclerosis results at the 3TR annual meeting in Cagliari",
      width: 1000,
      height: 750,
    },
  },
  {
    id: "imibic-researcher",
    period: "Jan 2026 – Present",
    title: "Researcher",
    organisation: "IMIBIC · Neuroplasticity and Oxidative Stress group",
    location: "Córdoba, ES",
    category: "tech",
    body: [
      "I apply statistics and machine learning to patients' clinical, biochemical and survey data to help understand neurological diseases such as Alzheimer's disease and multiple sclerosis.",
      "I am also part of the [3TR project ↗](https://3tr-imi.eu/), the largest European research project in immunology to date, working in its Spanish node on multiple sclerosis and the relationships between biomarkers, drug profiles and patient-reported outcomes (PROMs).",
    ],
    tags: ["Biostatistics", "Machine learning", "Clinical data", "Neurology", "3TR · IMI", "PROMs"],
  },
  {
    id: "thailand-teacher",
    period: "Aug 2025",
    title: "Volunteer Teacher · English, Physics, PE",
    organisation: "School affiliated with Rajabhat University",
    location: "Sakon Nakhon, TH",
    category: "vol",
    body: [
      "After the scholarship in China I taught English, Physics and Physical Education to hundreds of students aged 3 to 16, often leading classes alone. In the afternoons I also took on management tasks and childcare.",
    ],
  },
  {
    id: "esperanza",
    period: "Oct 2024 – May 2025",
    title: "AI Collaborator · Final degree project",
    organisation: "Teléfono de la Esperanza (NGO)",
    location: "Seville, ES",
    category: "tech",
    body: [
      "Through an agreement with this NGO, which provides free psychological assistance, I developed an artificial-intelligence model designed to support its helpline work.",
    ],
  },
  {
    id: "imibic-intern",
    period: "Jan – Apr 2025",
    title: "Bioinformatics Intern",
    organisation: "Maimonides Biomedical Research Institute of Córdoba (IMIBIC)",
    location: "Córdoba, ES",
    category: "tech",
    body: [
      "University internship in bioinformatics and biostatistics for genomics and proteomics: RNA-Seq, 16S, variant calling and machine-learning data-science pipelines.",
    ],
    tags: ["RNA-Seq", "16S rRNA", "Variant calling", "Proteomics"],
  },
  {
    id: "network-technician",
    period: "Nov 2024",
    title: "Network Technician",
    organisation: "GPIC · Hospital Universitario Virgen Macarena",
    location: "Seville, ES",
    category: "tech",
    body: [
      "Installed and configured the access-point infrastructure so the whole hospital complex stays connected, applying wired and wireless networking protocols in a critical-care environment where downtime is not an option.",
    ],
    tags: ["Wi-Fi APs", "LAN", "Critical systems"],
  },
  {
    id: "romania-camp",
    period: "Jul – Aug 2024",
    title: "Summer Camp Counsellor",
    organisation: "Happy Faces, Transylvania",
    location: "Alba Iulia, RO",
    category: "vol",
    body: [
      "Two months with an international team, providing round-the-clock care to children across many roles, from running activities to managing groups.",
    ],
  },
  {
    id: "au-pair",
    period: "Jul 2023",
    title: "Au Pair · Host family",
    organisation: "Italian host family",
    location: "Rimini, IT",
    category: "vol",
    body: ["Looked after the house, three children and several animals in exchange for room and board."],
  },
];

export const publication: Publication = {
  kicker: "Research article · First author",
  title:
    "Deep Learning Model Approach to Predict Diabetes Type 2 Based on Clinical, Biochemical, and Gut Microbiota Profiles",
  authors:
    "Caballero-María P, Caballero-Villarraso J, Arenas-Montes J, Díaz-Cáceres A, Castañeda-Nieto S, Alcalá-Díaz JF, Delgado-Lista J, Rodríguez-Cantalejo F, Pérez-Martínez P, López-Miranda J, Camargo A.",
  highlightAuthor: "Caballero-María P",
  venue: "*Applied Sciences* (MDPI) 2025; 15(4):2228 · ISSN 2076-3417 · Engineering, Multidisciplinary",
  doi: "https://doi.org/10.3390/app15042228",
  metrics: [
    { value: "Q1", label: "rank 19 / 114" },
    { value: "2.5", label: "impact factor" },
  ],
};
