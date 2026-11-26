/** sinophile: the Mandarin vocabulary trainer (source: the project's README). */
import type { Project } from "./types";

export const sinophile: Project = {
  slug: "sinophile",
  name: "sinophile",
  kind: "Web app · personal project",
  year: "2026",
  tagline: "A Duolingo-style trainer for the Mandarin vocabulary I learn in class.",
  summary:
    "A Next.js app that turns every Chinese lesson into spaced-repetition practice: listening, tones, sentence building, guided stroke order and free handwriting for the iPad and Apple Pencil. Guests can use all of it; an account syncs progress across devices through MongoDB Atlas.",
  hue: "sinophile",
  deployment: { kind: "live", url: "https://sinophile.vercel.app" },
  repository: "https://github.com/Pablo-Caballero-Maria/sinophile",
  cover: {
    src: "/img/projects/sinophile-cover.webp",
    alt: "A sinophile lesson introducing 你好 (nǐ hǎo, hello) with its pinyin, audio buttons and animated stroke order",
    width: 1200,
    height: 750,
  },
  highlights: [
    { value: "12+", label: "exercise types, from tones to handwriting" },
    { value: "108k", label: "CC-CEDICT dictionary entries" },
    { value: "1–2 min", label: "from a new lesson file to the live site" },
  ],
  stack: [
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "MongoDB Atlas",
    "Better Auth",
    "Serwist (PWA)",
    "Zustand",
    "TanStack Query",
    "React Hook Form · Zod",
    "Motion",
    "Vercel",
    "Vitest",
    "Playwright",
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "paragraph",
          text: "I study Mandarin, and after every class I want to practise exactly the words we saw, not a generic course. sinophile is the app I built for that: each lesson is a folder of data, and the site turns it into new-word introductions, exercises, reviews and exams, with streaks, XP and achievements to keep the habit going.",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/sinophile-home.webp",
            alt: "sinophile's home page: daily goal, streak, practice modes and the vocabulary summary",
            width: 1600,
            height: 1000,
            caption:
              "The home page in guest mode: daily goal and streak, practice modes, and *Your vocabulary* compared with HSK 2 of HSK 3.0. The interface is in Spanish, the language of my classes.",
          },
        },
      ],
    },
    {
      id: "lesson-pipeline",
      title: "From class to app in two minutes",
      blocks: [
        {
          kind: "steps",
          items: [
            "After class I create `data/lección N/vocab.json` on GitHub with the new words (hanzi, pinyin and meaning). They can be practised straight away with the automatic exercises.",
            "I give Claude `instructions.txt`, the new `vocab.json` and the previous lessons' files, and it writes the lesson's `exercises.json`: notes, example sentences, gap fills, translations, dialogues and questions that only use words I already know.",
            "I commit it and Vercel rebuilds the site. A build step validates every file, bundles the vocabulary into the JavaScript, splits the exercises into a file downloaded on demand and extracts the stroke data of every character used.",
          ],
        },
        {
          kind: "callout",
          title: "Bad data never reaches the site",
          text: "Invalid entries are skipped and listed under *Settings → Data status*; a file that isn't even valid JSON fails the build, so Vercel keeps serving the previous version.",
        },
      ],
    },
    {
      id: "learning",
      title: "What you can practise",
      blocks: [
        {
          kind: "list",
          items: [
            "**Spaced repetition** with Leitner boxes per word *and* skill, smart review, an infinite mode with three lives, exams graded from 0 to 10, and flashcards that start on the face you choose: the Spanish, the hanzi, the pinyin or the sound (left out in silent mode), with the rest and the pronunciation on the back.",
            "**Exercises**: meaning, Spanish → Chinese, listening, sentence dictation, pinyin and tones (choose or type), matching, gap filling, tile translation in both directions, dialogues, questions and pronunciation (speech recognition, or recording and comparing).",
            "**Handwriting**: guided stroke order with Hanzi Writer, and a free mode designed for the iPad and Apple Pencil: you see the Spanish word, draw it on a blank canvas and the hanzi is revealed. Exams grade handwriting stroke by stroke.",
            "**Silent mode** for practising in public: it removes listening and pronunciation exercises and mutes every sound.",
            "**Your vocabulary**: how many words you know and how much of HSK 2 you cover, the 500 words of the 2025 HSK 3.0 syllabus (300 of level 1 and 200 of level 2), counting words hidden inside others (书 in 本书, 月 in 一月).",
            "**Dictionary and translator**: my vocabulary plus CC-CEDICT, searchable by hanzi, pinyin with or without tones, Spanish or English, with animated strokes and examples on every word page.",
          ],
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/sinophile-word.webp",
            alt: "The word page for 北京 (Běijīng) with tone colours, audio and stroke-order diagrams",
            width: 1600,
            height: 1000,
            caption:
              "A word page: each syllable is coloured by tone (1st blue, 2nd green, 3rd yellow, 4th red), with audio and the stroke order of each character.",
          },
        },
      ],
    },
    {
      id: "accounts",
      title: "Accounts, sync and security",
      blocks: [
        {
          kind: "paragraph",
          text: "Everything works without an account, but a guest's progress disappears when the app closes: the browser keeps nothing but the session cookie and the offline cache. With an account, XP, streaks, spaced-repetition state, exams, achievements and settings are kept in MongoDB Atlas and shared between devices, and the guest's practice can be added on sign-up. Accounts are [Better Auth](https://www.better-auth.com)'s (username and password), on its official MongoDB adapter.",
        },
        {
          kind: "list",
          items: [
            "**Better Auth** hashes passwords with scrypt and keeps sessions for 180 days in an HttpOnly cookie, with its own per-IP rate limit and origin check. Accounts from before Better Auth moved over on their first sign-in, keeping their id, password and progress.",
            "Every MongoDB collection is typed: a `Collection<…>` of its document type, Better Auth's included.",
            "Progress changes are sent in the background, only what changed, and the server **merges** them with what it has, so work done on another device is never lost.",
            "Ten wrong passwords in a row lock the account for 15 minutes (a Better Auth hook), and every request that changes something must be JSON, a simple defence against CSRF.",
            "The API runs as Vercel functions in Paris, next to the Atlas cluster in GCP europe-west1. Zod checks every request body, the server's environment and everything downloaded from elsewhere.",
            "Every response carries a **Content Security Policy** (code only from the site itself; connections only to it and the three services it uses), HSTS, no framing, a strict referrer policy and a Permissions-Policy that grants only the microphone; zod runs without `eval` because of it. The **Vercel Firewall** logs scanners' probes and bot traffic.",
          ],
        },
      ],
    },
    {
      id: "engineering",
      title: "Engineering",
      blocks: [
        {
          kind: "paragraph",
          text: "The pages are prerendered and served from Vercel's CDN; only a small API (`src/app/api`) runs on the server. After the first visit a service worker (Serwist) keeps the whole app, its lessons and stroke data on the device, so practice works **offline**; there is a light theme (the default) and a dark one, and skeletons while anything loads. The domain logic lives in plain TypeScript modules (spaced repetition, pinyin parsing with erhua, tolerant answer checking, handwriting scoring, speech, dictionary search, the HSK comparison), and the React components only present it. Settings, progress and the account live in **zustand** stores; **TanStack Query** loads the exercises, the dictionary, stroke data and translations; the forms are **React Hook Form** with **Zod** schemas shared with the server; and **Motion** adds a few subtle animations.",
        },
        {
          kind: "list",
          items: [
            "**166 tests** with Vitest (the data files, the learning logic, the API and Better Auth's flows against an in-memory MongoDB, the stores, what is downloaded and validated, the security headers, the service worker's routing, and components with Testing Library) and **23 Playwright end-to-end tests** that drive the built site in Chromium: guest practice, every lesson in `data/`, the flashcards, the dictionary, signing up, in and out against the real API and MongoDB, unvisited pages opening offline, the theme and the security headers; any Content Security Policy violation fails them.",
            "`npm run validate` checks every lesson folder. GitHub Actions validates the data, runs ESLint, Prettier, type checking, the tests with coverage, the build and the end-to-end tests on every push, alongside CodeQL and Dependabot. Vercel Web Analytics and Speed Insights measure visits and Core Web Vitals, without cookies.",
            "Open data: CC-CEDICT (CC BY-SA 4.0), Make Me a Hanzi stroke data, Hanzi Writer and pinyin-pro.",
          ],
        },
      ],
    },
  ],
};
