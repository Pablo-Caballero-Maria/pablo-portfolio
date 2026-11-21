# Changelog

All notable changes to the portfolio are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/). Every version is tagged (`vX.Y.Z`) in the repository.

## [Unreleased]

## [2.3.0] - 2026-11-21

### Added

- **Vercel Web Analytics** (page views, cookieless) and **Speed Insights** (Core Web Vitals of real visits), only in
  the build Vercel makes (`src/components/layout/vercel-telemetry.tsx`).
- Test coverage with `@vitest/coverage-v8` (`npm run test:coverage`), summarised on every CI run and published as a
  README badge.
- CI split into jobs (types, lint and formatting; tests with coverage; build and end-to-end tests), CodeQL,
  Dependabot (npm and Actions), secret scanning with push protection and a [security policy](SECURITY.md).
- [Licence](LICENSE) (MIT for the code; the personal content stays all rights reserved),
  [code of conduct](CODE_OF_CONDUCT.md), [CITATION.cff](CITATION.cff), issue templates (bug, content correction,
  suggestion) and a pull request template.
- A [wiki](https://github.com/Pablo-Caballero-Maria/pablo-portfolio/wiki) on the architecture, the content model,
  adding a project, theming, testing and deployment.

### Changed

- The project pages follow their repositories: sinophile's 14 and the simulator's 11 Playwright end-to-end tests,
  ESP32 Piano's 197 tests (a new privacy test) and the Vercel telemetry of the deployed apps.
- The README, reorganised with badges, a table of contents, diagrams and screenshots.

## [2.2.0] - 2026-11-21

### Added

- **Edge AI for heart failure** (`/projects/heart-failure-ai`), the fifth project: the ECG pipeline and the INT8
  neural network of the simulador-iot-icc wearable, its results and limits, the alert rules and the congestion
  index, with four new figures and a teal hue.

### Changed

- The molecular activity page describes its new pytest tests; ESP32 Piano counts 196 tests; sinophile, Milan CDR
  and ESP32 Piano mention their CI; Milan's cell 5059 leads received SMS and calls, as in the report.

## [2.1.0] - 2026-11-19

### Added

- Unit, content and component tests (Vitest + Testing Library), end-to-end tests (Playwright) for the home page, the
  theme and every project page, and CI on GitHub Actions.

## [2.0.0] - 2026-11-19

### Changed

- The portfolio rebuilt from a single `index.html` into a **Next.js** app (App Router, Tailwind CSS v4), statically
  generated: typed content in `src/content`, a projects section with a documentation page per project, an
  interactive globe, light and dark themes.

## [1.0.0] - 2026-11-10

### Added

- First version: a single-page portfolio and CV, deployed on Vercel from GitHub.

[Unreleased]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Pablo-Caballero-Maria/pablo-portfolio/releases/tag/v1.0.0
