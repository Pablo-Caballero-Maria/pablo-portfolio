/** Deep learning on a heart-failure wearable (sources: the README, the code and the project report). */
import type { Project } from "./types";

export const heart: Project = {
  slug: "heart-failure-ai",
  name: "Edge AI for heart failure",
  kind: "Deep learning · biosignals · Master's coursework",
  year: "2026",
  tagline:
    "A neural network on a chest patch reads the ECG every 8 seconds and raises a dangerous arrhythmia in 50 ms, inside a live 3D simulation of the whole monitoring system.",
  summary:
    "Home monitoring for heart-failure patients after discharge. A chest wearable finds every heartbeat in a single-lead ECG and classifies the rhythm with a 261-parameter INT8 neural network trained on 22,500 windows, while a home station turns weight, thoracic impedance, breathing and activity into a daily congestion index. A web simulator runs the whole chain, from the heartbeat to the hospital console.",
  hue: "heart",
  deployment: { kind: "live", url: "https://simulador-iot-icc.vercel.app" },
  repository: "https://github.com/Pablo-Caballero-Maria/simulador-iot-icc",
  cover: {
    src: "/img/projects/heart-cover.webp",
    alt: "The simulator during a ventricular tachycardia: the patient's house, the mobile network, the cloud and the hospital in 3D, the clinical console with the alert, and the wearable's ECG with the network's verdict",
    width: 1200,
    height: 750,
  },
  highlights: [
    { value: "99.5 %", label: "of 7,500 unseen ECG windows classified right, the same in INT8 as in float" },
    { value: "261", label: "parameters: the network fits a 256 KB microcontroller with room to spare" },
    { value: "5.2 days", label: "of warning before a simulated heart-failure admission" },
  ],
  stack: [
    "TypeScript",
    "TinyML · INT8 quantisation",
    "Pan–Tompkins DSP",
    "Next.js · React",
    "three.js · React Three Fiber",
    "Vitest · Playwright",
    "Vercel",
  ],
  sections: [
    {
      id: "overview",
      title: "Overview",
      blocks: [
        {
          kind: "paragraph",
          text: "Final project of the *Internet of Things* course in the Master's in Computational Intelligence and IoT (University of Córdoba). After an admission for heart failure, 11.8 % of patients in Spain are back in hospital for a cardiovascular cause within 30 days. Two things give warning: fluid builds up days before (weight rises, the impedance of the chest falls), and arrhythmias such as atrial fibrillation or ventricular tachycardia trigger decompensations and sudden death.",
        },
        {
          kind: "paragraph",
          text: "The system pairs a chest patch that records the ECG and thoracic impedance with a home station (scale and diuretic dispenser) and a hospital platform where a cardiologist signs any dose change. This page is about the part that **analyses the body's signals**: the signal processing and the neural network that run on the patch, and the congestion index computed at home. All of it runs in a [live simulator ↗](https://simulador-iot-icc.vercel.app) that executes the full system, from the patient's heartbeat to the hospital console.",
        },
        {
          kind: "callout",
          title: "Synthetic data",
          text: "The physiology is simulated: the ECG, the patient and the decompensation come from models, not from patients. The results show that the analysis works end to end, not its clinical accuracy, which only a pilot study could measure.",
        },
      ],
    },
    {
      id: "pipeline",
      title: "From heartbeat to features",
      blocks: [
        {
          kind: "paragraph",
          text: "The patch samples a single-lead ECG at 256 Hz and 16 bits. In the simulator the signal is synthesised beat by beat: a sum of Gaussians for the P, Q, R, S and T waves, wide QRS complexes for ventricular beats, fibrillatory waves in AF, breathing drift, 50 Hz mains hum, muscle noise that grows with activity, motion artefacts and 16-bit quantisation. The wearable then processes it sample by sample, as its firmware would:",
        },
        {
          kind: "steps",
          items: [
            "**Condition**: a 0.5–40 Hz band-pass and a 50 Hz notch clean the signal for display and for measuring each QRS.",
            "**Emphasise the QRS**: a 5–15 Hz band-pass, the derivative, squaring and a 150 ms moving-window integration.",
            "**Detect**: adaptive thresholds on the integrated signal find each heartbeat (the Pan–Tompkins algorithm), and its QRS width is measured on the conditioned signal. On clean signal the tests require ≥ 99 % sensitivity and positive predictive value.",
            "**Summarise**: every 8-second window becomes ten features of the RR intervals and the QRS, plus a signal-quality index.",
          ],
        },
        {
          kind: "table",
          caption: "The ten features of each window.",
          head: ["Feature", "What it captures"],
          rows: [
            ["Mean heart rate, shortest and longest RR", "Rate, tachycardia, pauses"],
            ["SDNN, RMSSD", "Beat-to-beat variability"],
            ["Irregularity, pNN50", "The *irregularly irregular* rhythm of atrial fibrillation"],
            ["QRS width", "The wide complexes of ventricular beats"],
            ["Premature fraction", "An early beat followed by a compensatory pause (ectopy)"],
            ["Signal-quality index", "Noise outside the QRS and implausible RR intervals"],
          ],
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/heart-ecg-windows.webp",
            alt: "Five 8-second ECG strips (sinus rhythm, atrial fibrillation, ventricular tachycardia, ectopic beats and a motion artefact) with the detected QRS complexes marked, and beside each the network's probabilities for the five classes",
            width: 1600,
            height: 1000,
            caption:
              "Five windows produced by the simulator's own code, with the QRS complexes the detector found (▼) and the network's output. The motion artefact gets a signal quality of 0, and the network calls it noise rather than an arrhythmia.",
          },
        },
      ],
    },
    {
      id: "network",
      title: "A neural network that fits on a chest patch",
      blocks: [
        {
          kind: "paragraph",
          text: "Deep networks on the raw ECG classify rhythms as well as cardiologists (a 34-layer CNN by Hannun et al., 2019, reached an F1 of 0.837 over 12 classes), but they don't fit on a microcontroller with 256 KB of RAM running on a 200 mAh battery for weeks. With well-chosen features a compact network is enough: a dense 10 → 16 → 5 network with ReLU and softmax, **261 parameters** and 240 multiply–accumulates per window.",
        },
        {
          kind: "table",
          caption: "The wearable's network.",
          head: ["Layer", "Output", "Parameters", "MACs"],
          rows: [
            ["Input: the window's 10 features (INT8)", "10", "—", "—"],
            ["Dense + ReLU", "16", "176", "160"],
            ["Dense + softmax", "5", "85", "80"],
            ["**Total**", "", "**261**", "**240**"],
          ],
        },
        {
          kind: "list",
          items: [
            "**Five classes**: normal, atrial fibrillation or flutter, ventricular tachyarrhythmia, frequent ectopy and noise. Pauses and slow rhythms are left to rules, not to the network.",
            "**Data**: 22,500 labelled windows generated by the same chain the simulation runs, 1,500 episodes per class with random heart rate, activity and signal quality. Half go through the full signal path and half through a faster beat-level model of the detector, so one network serves both. The test set, 7,500 windows, comes from another seed.",
            "**Training**, written from scratch in TypeScript (`npm run train:classifier`): He initialisation, Adam on a cross-entropy loss with L2 regularisation, 80 epochs in batches of 64, and the learning rate cut to 30 % for the last 30 % of the epochs.",
          ],
        },
        {
          kind: "paragraph",
          text: "After training, the weights are **quantised to 8 bits** with one scale per neuron. The inputs and the hidden activations get scales calibrated on the 99.9th percentile of the values they actually take, and the biases stay as 32-bit integers. Inference then uses integer arithmetic only, as TensorFlow Lite Micro would on the patch's Cortex-M4, and takes microseconds: filtering and QRS detection, not the network, dominate the processing energy.",
        },
        {
          kind: "code",
          language: "typescript",
          caption: "The hidden layer of the integer inference (src/sim/wearable/classifier.ts).",
          code: `for (let j = 0; j < m.hidden; j++) {
  let acc = m.b1[j];                        // int32 bias, scale inputScale · w1Scale[j]
  const row = j * m.inputs;
  for (let i = 0; i < m.inputs; i++) acc += m.w1[row + i] * this.xq[i];   // int8 × int8
  const real = acc * m.inputScale * m.w1Scale[j];
  this.hq[j] = real > 0 ? clampInt8(Math.round(real / m.hiddenScale)) : 0; // ReLU, back to int8
}`,
        },
      ],
    },
    {
      id: "results",
      title: "Results",
      blocks: [
        {
          kind: "figure",
          figure: {
            src: "/img/projects/heart-confusion.webp",
            alt: "Confusion matrix of the INT8 network on 7,500 test windows, with sensitivity and positive predictive value per class",
            width: 1200,
            height: 800,
            caption:
              "The INT8 network on 7,500 unseen windows: 99.49 % accuracy, exactly the float model's. Every ventricular tachyarrhythmia is caught; the few mistakes are between normal, AF and ectopy windows.",
          },
        },
        {
          kind: "table",
          caption: "Per class, on the test set (INT8).",
          head: ["Class", "Sensitivity", "Positive predictive value"],
          rows: [
            ["Normal", "99.3 %", "99.2 %"],
            ["Atrial fibrillation or flutter", "99.5 %", "99.5 %"],
            ["Ventricular tachyarrhythmia", "100 %", "100 %"],
            ["Frequent ectopy", "98.7 %", "98.8 %"],
            ["Noise", "100 %", "99.9 %"],
          ],
        },
        {
          kind: "paragraph",
          text: "Inside the running simulation, over a whole normal week, the network gets **99.8 % of 75,600 windows** right without raising a single false alert.",
        },
        {
          kind: "callout",
          title: "What a real device would need",
          text: "The network has only seen signals from the same model it is tested on. A real patch would be trained on PhysioNet databases and on recordings from the patch itself (its chest lead differs from theirs), with class weights, and evaluated on patients it never saw, following AAMI EC57. The report's targets: ≥ 95 % sensitivity for sustained ventricular tachycardia, and ≥ 90 % sensitivity with ≥ 80 % PPV for atrial fibrillation of 30 s or more.",
        },
      ],
    },
    {
      id: "rules",
      title: "Rules around the network",
      blocks: [
        {
          kind: "paragraph",
          text: "The network never decides alone. Its output feeds a few explicit rules, and the slowest, most dangerous rhythms are caught without it:",
        },
        {
          kind: "list",
          items: [
            "**Class 1, critical**: ventricular tachyarrhythmia in two consecutive windows above 150 bpm with a valid signal, a pause of 4 s or more, or a heart rate below 30 bpm for two windows. The patch vibrates and beeps within **50 ms** and sends the alert with 30 s of ECG.",
            "**Class 2**: new atrial fibrillation lasting 30 s, AF faster than 110 bpm for 10 minutes, or a rate below 40 bpm for 30 s. The home station re-analyses the 30-second strip with the same detector and network before passing it on, filtering false alarms where they would cost nurses' time.",
            "Pauses, slow rhythms and a detached electrode (more than a minute) are rules independent of the network, so they work even if it errs. The patch only warns and transmits: it never changes the treatment, suppresses an alert or makes a diagnosis.",
          ],
        },
        {
          kind: "paragraph",
          text: "In ten simulated runs of a ventricular tachycardia, the alert reached the hospital console in 2.8 s (median) and 4.0 s (95th percentile) over LTE-M, and in 16.6 s (95th percentile) over NB-IoT, against a target of 30 s.",
        },
      ],
    },
    {
      id: "congestion",
      title: "Reading fluid build-up: the congestion index",
      blocks: [
        {
          kind: "paragraph",
          text: "Every morning the station compares four signals with the patient's own baseline, scales each change and weighs them into an index from 0 to 100. Above 50 it raises a class 2 alert, and the platform proposes up to three extra doses of diuretic that are only dispensed once a cardiologist signs them.",
        },
        {
          kind: "table",
          caption: "The four signals of the index.",
          head: ["Signal", "Compared with", "A full unit of change", "Weight"],
          rows: [
            ["Weight", "Mean of the last 3 days against the 7 before", "+1.5 kg", "30 %"],
            ["Thoracic impedance, at night lying down", "The patient's baseline", "−6 %", "35 %"],
            ["Breathing rate at night", "The patient's baseline", "+3 breaths/min", "20 %"],
            ["Activity the day before", "The patient's baseline", "−25 %", "15 %"],
          ],
        },
        {
          kind: "list",
          items: [
            "Nights in the 48 h after a patch change are left out of the baseline, because fresh electrodes change the impedance; and a weighing only counts if the patient's own wearable is within about 2 m, so a visitor on the scale can't prompt a dose.",
            "In the simulated decompensation the alert fires **5.2 days before** the admission that would otherwise have happened; the cardiologist signs 2.2 extra doses on average and no admission occurs. A stable patient followed for 180 days gets no false alerts.",
          ],
        },
      ],
    },
    {
      id: "edge",
      title: "Why analyse on the device",
      blocks: [
        {
          kind: "paragraph",
          text: "Running the analysis on the patch instead of streaming the raw signals to the cloud is what makes the rest possible. With the same sensors, the report compares both designs (and the simulator reproduces the figures):",
        },
        {
          kind: "table",
          head: ["", "Raw signals to the cloud", "Analysis on the patch"],
          rows: [
            ["Wearable → home station", "65.5 MB a day", "47.7 KB a day"],
            ["Mobile network, with MQTT, TLS and TCP/IP overhead", "70.4 MB a day", "86.2 KB a day"],
            ["Average current of the wearable", "0.491 mA", "0.153 mA"],
            ["Battery life (85 % of 200 mAh)", "14.4 days", "46.3 days"],
            [
              "Ventricular tachycardia alert at the console (median)",
              "12.6 s: the rhythm is classified in the cloud",
              "2.8 s, after a local alarm in 50 ms",
            ],
          ],
        },
        {
          kind: "paragraph",
          text: "The price is that the full ECG can't be re-analysed later. The design softens it with 30-second strips around every event and one scheduled strip a day, a 10-minute rolling buffer on the patch and a symptom button.",
        },
      ],
    },
    {
      id: "simulator",
      title: "The simulator",
      blocks: [
        {
          kind: "paragraph",
          text: "The simulator is not an animation. A discrete-event engine written in TypeScript, independent of the interface, runs the patient, the devices, the radio links, the cloud platform and the clinical staff, with a seeded random generator so that a seed always reproduces the same run. The same code runs in the browser, in the tests and in the script that produced the report's figures. Up to 120× real time the ECG is synthesised and processed sample by sample; faster, the beat-level model takes over, so ten days of decompensation run in a minute.",
        },
        {
          kind: "figure",
          figure: {
            src: "/img/projects/heart-simulator.webp",
            alt: "The simulator in the atrial fibrillation scenario: the 3D scene, an alert for the nurses, the wearable's ECG labelled AF or flutter, and a statistics panel with the network's live confusion matrix",
            width: 1600,
            height: 1000,
            caption:
              "The atrial fibrillation scenario: the patch's network reads “AF or flutter”, the alert reaches the nurses' worklist, and the statistics panel compares the network's live output with the patient's true rhythm (99.91 % of 2,284 windows).",
          },
        },
        {
          kind: "list",
          items: [
            "Ten scenarios (a normal day, ventricular tachycardia, atrial fibrillation, a pause, congestive decompensation, a mobile network outage, the patient away from home, forged dose orders, raw streaming, low battery), plus parameters to change and events to provoke at any time.",
            "Every message carries real bytes: BLE, MQTT 5 over TLS 1.3, SenML on CBOR and HL7 FHIR observations with LOINC codes, all inspectable byte by byte.",
            "It opens and runs without a connection once visited (a Serwist service worker keeps the whole simulator, which runs entirely in the browser), with a light theme by default and a dark one, and a skeleton of the 3D scene while three.js loads.",
            "104 Vitest tests (the QRS detector, the network's accuracy, binary formats, alert rules, energy equations, signed dose orders, every scenario end to end, the theme) and 13 Playwright end-to-end tests that drive the built site in Chromium (the 3D scene, the tachycardia, AF and forged-order scenarios, the panels, the economics calculator, opening offline and the theme). GitHub Actions runs lint, type checking, coverage, the build and the end-to-end tests on every push; Vercel Web Analytics and Speed Insights measure the live site.",
          ],
        },
      ],
    },
  ],
};
