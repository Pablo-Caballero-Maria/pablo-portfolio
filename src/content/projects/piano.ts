/** Piano lessons with an ESP32 buzzer (sources: the README and the project report). */
import type { Project } from "./types";

export const piano: Project = {
  slug: "piano",
  name: "ESP32 Piano",
  kind: "IoT · university project",
  year: "2026",
  tagline:
    "Piano lessons where the teacher's notes ring out on an ESP32 buzzer and light up on every student's phone.",
  summary:
    "A fog-computing system for a classroom: the teacher's laptop serves the web app, runs the live lesson and drives an ESP32 over MQTT with TLS, while students at home follow the same lesson through Vercel and Ably. The class works without internet, updates itself from GitHub only after its tests pass, and encrypts every stored record.",
  hue: "piano",
  deployment: { kind: "live", url: "https://piano-web-virid.vercel.app" },
  repository: "https://github.com/Pablo-Caballero-Maria/piano",
  cover: {
    src: "/img/projects/piano-cover.webp",
    alt: "The Studio of ESP32 Piano: a piano roll editor with transport controls above an on-screen keyboard",
    width: 1200,
    height: 750,
  },
  highlights: [
    { value: "197", label: "automated tests, 18 of them run on the board" },
    { value: "0", label: "internet needed for a lesson in the classroom" },
    { value: "AES-256", label: "GCM encryption of every stored record" },
  ],
  stack: [
    "ESP32 · MicroPython",
    "MQTT · Mosquitto",
    "Python · FastAPI",
    "Next.js · TypeScript",
    "MongoDB Atlas",
    "Ably",
    "Vercel",
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "paragraph",
          text: "A web piano for teaching piano in a classroom. The teacher and every student use their phone. Whatever the teacher plays, on the keyboard or in the **Studio** (a piano-roll editor), sounds on a buzzer wired to an ESP32 in the room and appears instantly on each student's screen. Outside class everyone can practise alone, save private or public melodies, and follow a lesson from home.",
        },
        {
          kind: "paragraph",
          text: "It works end to end on real hardware: on 18 November 2026, with a phone's hotspot as the classroom router, two phones (teacher and student) held a lesson with the buzzer playing, the board synced with MongoDB Atlas through the laptop, and the laptop updated the board over WiFi three times, each time after its tests passed.",
        },
      ],
    },
    {
      id: "architecture",
      title: "Architecture: a fog node in the classroom",
      blocks: [
        {
          kind: "paragraph",
          text: "There are three zones. In the **classroom**, the phones, the teacher's laptop and the board share one WiFi router. On the **internet** are the services the laptop uses when it is online, and the public site on Vercel. At **home**, students use that site and follow the lesson through Ably.",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/piano-architecture.webp",
            alt: "Architecture diagram: phones, the teacher's laptop (nginx, the fog app, Mosquitto) and the ESP32 in the classroom; GitHub, DuckDNS, MongoDB Atlas, Ably and Vercel on the internet; students at home",
            width: 1600,
            height: 1013,
            caption:
              "The classroom, the internet and home (diagram from the project report, in Spanish). Everything that crosses the WiFi or leaves for the internet is encrypted.",
          },
        },
        {
          kind: "list",
          items: [
            "**The teacher's laptop** is the fog node: nginx terminates HTTPS for `piano-esp32.duckdns.org`, a Python FastAPI app runs the live class, the buzzer queue, sync and updates, and Mosquitto is the MQTT broker between the app and the board. It keeps no database.",
            "**The board** (ESP32, MicroPython) plays the frequencies it receives and stores the class's accounts and melodies as encrypted blobs it cannot read.",
            "**The cloud**: GitHub holds the code, DuckDNS and Let's Encrypt give the classroom a public name and certificate, MongoDB Atlas keeps all the data, Ably carries lessons over the internet and Vercel serves the same site and API. Only Vercel's copy carries Vercel Web Analytics and Speed Insights: the classroom's copy sends nothing anywhere.",
          ],
        },
        {
          kind: "callout",
          title: "Why a fog node",
          text: "Earlier versions asked more of the board: first phones sent notes over Bluetooth, then the board served the website itself. Adding TLS and updates left it out of memory, because MicroPython's heap starts at 56 KB, only grows by doubling and takes the memory WiFi and TLS need. Moving the website, the class logic and the security to the laptop leaves a small firmware on the board, and the class keeps working with no internet at all.",
        },
      ],
    },
    {
      id: "a-note",
      title: "The journey of one note",
      blocks: [
        {
          kind: "steps",
          items: [
            "The teacher presses C5 and it sounds first on their own phone.",
            'The phone sends `{"t": "note", "freq": 523, "midi": [72]}` over a secure WebSocket.',
            "The app checks the buzzer queue: during a lesson it belongs to the teacher, unless they handed it to a student.",
            "It publishes the bytes `0B 02` (523 in little-endian) to `piano/piano1/tone`, and Mosquitto delivers them to the board over TLS.",
            "The board sets its PWM to 523 Hz with a 50 % duty cycle, the loudest setting for a passive buzzer.",
            "The app forwards the note to the students in the room, who see the key marked in amber, while the Ably bridge publishes it for those at home.",
          ],
        },
        {
          kind: "paragraph",
          text: "The buzzer has a single voice, so a chord is sent as its **resultant frequency**: since sin a + sin b = 2·cos((a−b)/2)·sin((a+b)/2), two notes together sound like a wave at their mean frequency whose volume beats at their difference, and the buzzer plays that mean.",
        },
      ],
    },
    {
      id: "firmware",
      title: "Hardware and firmware",
      blocks: [
        {
          kind: "list",
          items: [
            "An ESP32-WROOM board with MicroPython 1.29 and a three-pin passive buzzer on GPIO 33. USB is only needed for the first install; after that everything goes over WiFi.",
            "MicroPython ships no MQTT client, so the project has its own: **MQTT 3.1.1 over TLS** with a last-will message and pings. Its `requests` doesn't verify certificates either, so updates use an HTTPS request of its own that does.",
            "Records live in a key–value store on a btree database in flash, holding opaque bytes that arrive already encrypted.",
            "**Over-the-air updates**: the board reboots into an update mode where only the updater runs (so TLS has memory), downloads the changed files, checks each file's git hash and runs its own test suite on the new code before installing it. A version that crashes three times before reaching the laptop, or an install cut short by a power cut, is rolled back.",
          ],
        },
      ],
    },
    {
      id: "web-app",
      title: "The web app",
      blocks: [
        {
          kind: "paragraph",
          text: "A Next.js and TypeScript project built as a static export, so the same files are served by Vercel on the internet and by the laptop in the classroom, with no internet needed. On load it asks `GET /api/config` who it is talking to: in the classroom the lesson goes over the laptop's WebSocket, online over Ably.",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/piano-studio.webp",
            alt: "The Studio: piano roll with bars, note names and frequencies, transport controls and an on-screen keyboard",
            width: 1600,
            height: 1000,
            caption:
              "The Studio: draw and erase notes with snapping, tempo, zoom, undo and redo, looping, a metronome and recording from the keyboard.",
          },
        },
        {
          kind: "list",
          items: [
            "**Piano**: an on-screen keyboard with glissando when you slide a finger, plus computer keys (A W S E D F T G Y H U J K O L P; Z and X change octave).",
            "**Accounts and melodies**: sign up as a student or teacher; melodies are private, or public for everyone to see and edit (only the owner deletes them or makes them private).",
            "**Class panel**: the teacher starts and ends the lesson, sees what each student is doing and manages who plays the buzzer, with a first-come, first-served queue outside lessons.",
            "The logic lives in TypeScript classes with small stores that React components read; the piano roll is drawn outside React, since hundreds of notes and a playhead moving every frame are faster as direct DOM updates.",
          ],
        },
      ],
    },
    {
      id: "security",
      title: "Data, sync and security",
      blocks: [
        {
          kind: "list",
          items: [
            "Every stored record is sealed with **AES-256-GCM** under a system key held only by the teachers' laptops and Vercel, with the record's key as associated data, so a record copied under another key won't open. The board and Atlas only ever see ciphertext.",
            "**HKDF-SHA256** derives three independent keys from the system key: one for records, one for identifiers (a keyed hash of the user name, so stored keys reveal no names) and one for signing sessions.",
            "The password never leaves the browser: it sends a PBKDF2-SHA256 key instead. Sessions are HMAC-signed 30-day tokens that any server holding the key can check, with no session table.",
            "In transit: HTTPS and secure WebSockets with a Let's Encrypt certificate, MQTT over TLS with a user and an ACL per board in Mosquitto, and TLS to Atlas, Ably, GitHub and DuckDNS.",
            "**Sync** between each board and Atlas runs whenever the laptop has internet and the board at the same time: the newest copy wins, deletions travel as tombstones, and an account created offline whose name is taken online is renamed (ana → ana-2) while the old name keeps working.",
          ],
        },
      ],
    },
    {
      id: "operations",
      title: "Self-updating and tested",
      blocks: [
        {
          kind: "paragraph",
          text: "Once installed with `./install.sh`, the system runs on its own: nginx, Mosquitto and the app start at boot and restart on failure, the DuckDNS name follows the laptop's address on every network within 30 seconds, and the certificate renews itself. Every hour, when online, the laptop tests the newest GitHub commit in a separate git worktree (pytest, then the website's `npm ci`, Vitest and Next.js build) and only switches to it if everything passes; the board is updated at the next class.",
        },
        {
          kind: "table",
          caption: "The automated tests.",
          head: ["Suite", "Tests", "What they cover"],
          rows: [
            [
              "pytest",
              "102",
              "The shared core, the laptop app end to end (REST and WebSocket with the board's real storage code), updates against temporary git repositories, and an integration test through a real MQTT broker",
            ],
            [
              "…on the board",
              "18 of the 102",
              "Written for MicroPython: pytest runs them on the laptop and the board runs them on itself before installing an update",
            ],
            ["Vitest", "90", "Website logic, services, the Studio engine and components"],
            [
              "Playwright",
              "5",
              "End to end in Chrome against the laptop app with a simulated board, including that the classroom page talks to nobody but the laptop",
            ],
          ],
        },
        {
          kind: "paragraph",
          text: "GitHub Actions runs the same suites on every push too, with coverage, a real MongoDB and the end-to-end tests, and CodeQL scans the Python, the TypeScript and the workflows; but the teacher's PCs don't rely on it, and test every commit themselves before installing it.",
        },
      ],
    },
  ],
};
