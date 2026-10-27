# Contributing

**English** · [Türkçe](CONTRIBUTING.tr.md)

Thanks for helping KPSS Rehber. The project is free and non-commercial; the most valuable contributions are **bug reports**, **topic summaries**, **translations** and **prompt improvements**.

## Quick start

```bash
npm ci
npm run dev        # http://localhost:4321/kpss-rehber/
npm test           # unit tests (Vitest)
npm run test:e2e   # end-to-end tests (Playwright, build + preview)
```

Node 22 is required. If `npm install` fails, make sure the repository's `.npmrc` is in place.

## Where the data lives

| Path | Contents |
|---|---|
| `src/content/exams/*.yaml` | Exam → session → test → subject → topic references; visible names as `{ tr, en }` |
| `src/content/topics/<locale>/<subject>/<slug>.md` | One file per topic and language |
| `src/prompts/templates/<locale>/*.md` | Prompt templates per language |
| `src/prompts/levels.yaml`, `lengths.yaml` | Level and length instructions (`{ tr, en }`) |
| `src/i18n/tr.js`, `en.js` | UI strings; both dictionaries must have the same keys |
| `data/sources.json` | Tracked official ÖSYM documents |
| `data/calendar.yaml` | Application and exam dates |
| `data/source-watch.json` | ÖSYM pages the weekly source check reads, and documents it should ignore |

All data is validated at build time. A broken reference, an orphan topic, question counts that do not add up, a record without a source, a missing translation or an unfilled template variable **fails the build**; the error message says what to fix.

A weekly job (`npm run check:sources`) reports new or changed ÖSYM documents as `new-source` issues. How to move the site to a new exam year is in [docs/ANNUAL-REVIEW.md](docs/ANNUAL-REVIEW.md).

## Source rule (the most important rule)

- ÖSYM data (question counts, durations, scopes, dates) is **never entered from memory**. Every record links to an official document in `data/sources.json`.
- Where ÖSYM publishes no detailed list, the topic tree is derived from past question booklets and marked `sourceType: past-exam-analysis`.
- **Past exam questions are never copied to the site** (ÖSYM holds the copyright). Only the booklet link is given and statistics are derived.

## Topic file

`src/content/topics/tr/tarih/osmanli-tarihi.md`:

```markdown
---
title: Osmanlı Tarihi
subject: tarih                   # must match the folder name
state: draft                     # skeleton | draft | published
subtopics: [Kuruluş dönemi, Yükselme dönemi]
keyConcepts: [tımar, devşirme]
questionStyle: Matching and interpreting the period's events and institutions
sourceType: osym-guide           # osym-guide | osym-oabt-scope | past-exam-analysis
sourceYear: 2026
document: kpss-lisans-2026       # id in data/sources.json
verified: true
updated: 2026-10-27
questionDistribution: { 2025: 3, 2026: 2 }   # optional
---

## Core idea
...
```

- `state: skeleton` topics may leave `subtopics`, `keyConcepts` and `questionStyle` empty; they are required for `draft` and `published`.
- The summary must be readable **without prompts**: a student should grasp the core idea without using AI.
- Every topic needs a file in **every language** (`topics/tr/...` and `topics/en/...`). Fields that are not translated (`subject`, `sourceType`, `sourceYear`, `verified`, `document`, `questionDistribution`, `extraPrompts`, `aliases`) must be identical in all languages.
- When you add a topic, add it to at least one exam's `topics` list, or you will get an orphan-topic error.
- Topic ids (`subject/slug`) are stored in students' backups. If you must rename one, list the old id in `aliases` so progress moves over.

## Prompt template

`src/prompts/templates/<locale>/<id>.md`:

```markdown
---
title: Explain the topic
description: Short description shown on the card.
order: 1
special: false       # true: only shown on topics that list it in extraPrompts
---
Exam: {{exam}}
Topic: {{topic}}
Level ({{levelName}}): {{levelInstruction}}
...
[PASTE THE QUESTION HERE]
```

- Available variables: `exam, subject, topic, subtopics, keyConcepts, questionStyle, levelName, levelInstruction, lengthInstruction, preferences`. Any other variable fails the build.
- Write fields the student fills in as `[UPPER CASE]`; they are highlighted on the page.
- The same template id must exist in every language with the same `order` and `special`.
- Remind the model not to present uncertain information as fact.

## Adding a language

1. Add the code to `LOCALES` in `src/i18n/locales.js` and its name to `LANGUAGE_NAMES`/`INTL_LOCALE` in `src/i18n/index.js`.
2. Add `src/i18n/<locale>.js` with the same keys as `tr.js` (a unit test checks this) and register it in `DICTIONARIES`.
3. Add the locale's value to every `{ tr, en }` field, and translate every topic and template folder.
4. `npm run build` lists everything still missing.

## Code style

- Code, file names, identifiers and comments are in **English**. UI text lives only in `src/i18n/*.js`; never hard-code visible text in components.
- In-site links use `localePath(locale, '/path/')`.
- Line endings are LF.

## Pull request flow

1. Fork the repository and create a branch from `main` (`topic/ottoman-history-summary`, `fix/calendar-2027`).
2. Make your change and run `npm test` and `npm run build`.
3. In the PR description, name the official document the change relies on.
4. Nothing is merged until CI is green.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) in English: `feat: …`, `fix: …`, `docs: …`, `chore: …`, `test: …`, `content: …`.

## License

Code contributions are licensed under MIT ([LICENSE](LICENSE)); content contributions (topic texts and prompt templates) under CC BY-SA 4.0 ([LICENSE-CONTENT](LICENSE-CONTENT)). Opening a PR means you agree to this.

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the code of conduct.
