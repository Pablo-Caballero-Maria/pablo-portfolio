# Security policy

## Supported versions

| Version                               | Supported |
| ------------------------------------- | :-------: |
| 2.3.x (latest, `main`, the live site) |    ✅     |
| < 2.3.0                               |    ❌     |

Only `main` is maintained: it is what Vercel serves at
[pablo-caballero.vercel.app](https://pablo-caballero.vercel.app).

## Reporting a vulnerability

> [!IMPORTANT]
> Please **do not open a public issue** for a security problem.

Report it privately through GitHub:
**[Report a vulnerability](https://github.com/Pablo-Caballero-Maria/pablo-portfolio/security/advisories/new)**
(Security → Advisories → _Report a vulnerability_). Include what is affected (page, component, file), how to
reproduce it and the impact you expect. I will acknowledge it within **7 days** and credit you in the advisory and
the [changelog](CHANGELOG.md) unless you prefer to stay anonymous.

## Scope

The site is statically generated: no server code runs per request, there are no accounts, forms or databases, and
it stores nothing about visitors (the theme choice lives in `localStorage`). Relevant problems include:

- script injection through content rendering (`src/lib/rich-text.ts` turns a tiny markup into React elements and
  only allows `https:`, relative and anchor links);
- the inline theme script in `<head>` (`src/lib/theme.ts`);
- third-party code: the npm dependencies and the Vercel Web Analytics and Speed Insights scripts (cookieless,
  loaded only in Vercel's build);
- secrets committed by mistake.

Out of scope: typos or outdated facts on the site (use the
[content correction](https://github.com/Pablo-Caballero-Maria/pablo-portfolio/issues/new?template=content_correction.yml)
template).

## What the repository already does

- **Secret scanning** with push protection.
- **Dependabot** alerts and security updates, plus weekly version updates for npm and the GitHub Actions.
- **CodeQL** analysis of the TypeScript and the workflows on every push, pull request and week.
