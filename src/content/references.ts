/** Recommendation letters and volunteer hosts' reviews. */
import type { AcademicReference, VolunteerReference } from "./types";

export const academicReferences: AcademicReference[] = [
  {
    quote:
      "Given his proven track record, his honors, his published research, and his prior success at your institution, I am certain he possesses the potential to be a great asset.",
    author: "Dr. María José Escalona Cuaresma",
    initials: "MJE",
    role: "Full Professor · ETS Ingeniería Informática, University of Seville",
    date: "12 Dec 2025",
    letter: [
      "It is a genuine pleasure to recommend Pablo Caballero María for your Master's program in Computer Science and Technology. I know Pablo from his time as a highly dedicated student in my course, Planning and Management of IT Projects (PGPI), during the 2024 academic year at the University of Seville.",
      "Pablo has always stood out. He finished his Software Engineering degree with a notable academic record (a Grade Point Average of 8.53 out of 10). While he achieved the Honor Degree in five subjects, his consistent high performance throughout my course and his overall GPA speak to his quality and dedication.",
      "His theoretical foundation is complemented by his research experience as the first author of a paper published in a first quartile journal (MDPI's Applied Sciences). This achievement, which involved applying deep learning models to medical data, clearly demonstrates the level of ambition and technical ability he will bring to your program. His familiarity with the BIT environment, having already completed a competitive scholarship program in Artificial Intelligence at your institution with a GPA of 97 out of 100, is a distinct advantage.",
      "Pablo is a mature, highly responsible young professional. Given his proven track record, his honors, his published research, and his prior success at your institution, I am certain he possesses the potential to be a great asset in your Computer Science and Technology program, and I recommend him with the utmost confidence.",
    ],
  },
  {
    quote:
      "I have observed an impressive evolution in his maturity, adaptability, initiative, creativity and commitment to the field of study.",
    author: "Dr. María Dolores Frau García",
    initials: "MDF",
    role: "Associate Professor · Dept. of Applied Mathematics I, University of Seville",
    date: "25 Nov 2025",
    letter: [
      "I am pleased to be writing this letter of recommendation of Pablo Caballero María, a promising student. I've had the pleasure of teaching him two subjects while he was studying Computer Engineering at Seville: one in the first semester of the first course, Introduction to Discrete Mathematics (Number Theory), and another in the second semester of the second course, Discrete Mathematics (Graph Theory). I have observed an impressive evolution in his maturity, adaptability, initiative, creativity and commitment to the field of study.",
      "Pablo has been amongst the top 5 of his class while he has been my student. I remember him always attentive to explanations and I have verified that he is a responsible and reliable person. He has shown me that he is a hard worker, and that he is genuinely interested in learning.",
      "I think that Pablo has acquired many skills that fit into the objectives of your program of studies. He is an outstanding student with so much to offer, so I strongly recommend accepting his application.",
    ],
  },
];

export const workaway = {
  badge: "Super Workawayer",
  summary: "6 reviews on Workaway, all rated **Excellent** · 100% response rate",
  profile: "https://www.workaway.info/es/workawayer/PabloCaballero/feedback",
};

export const volunteerReferences: VolunteerReference[] = [
  {
    place: "Sakon Nakhon, TH",
    date: "May 2026",
    quote:
      "Pablo came all the way from Spain with an open mind, positive energy, and a genuine willingness to learn, share, and contribute. He adapted beautifully to our school environment and connected naturally with students of all ages. His background in IT and computer engineering was also a great contribution to our learning activities and school projects.",
    host: "School host · Teaching program",
  },
  {
    place: "Alba Iulia, RO",
    date: "May 2025",
    quote:
      "Pablo was consistently kind, responsible, and enthusiastic. His positive attitude and calm demeanor made him a reliable presence in any situation. He worked well under pressure, communicated clearly, and showed genuine care and patience with the children. We would gladly welcome him back in the future.",
    host: "Summer camp host · Happy Faces",
  },
  {
    place: "Rimini, IT",
    date: "Mar 2024",
    quote:
      "Pablo is a wonderful guy… he likes to spend time with kids, he enjoys a lot to play with them. He is mature and responsible, honest and kind! He can help around house without any problems; he really wants to jump in the culture.",
    host: "Host family",
  },
];
