# KPSS Rehber

**English** · [Türkçe](README.tr.md)

A **free, non-commercial** study guide for people preparing for KPSS and MEB-AGS, Turkey's public personnel and teacher selection exams: a map of the whole curriculum, prompt-free static topic summaries, and ready-made prompts you can use in your own ChatGPT or Claude account. The site is available in Turkish and English.

**Site:** https://unseensenpai.github.io/kpss-rehber/

![KPSS Rehber home page](docs/screenshot.png)

## Features

- **Curriculum tree:** exam → session → test → subject → topic. Question counts, durations and exam dates come from official ÖSYM documents; every record shows its source and year.
- **Topic pages:** static summary, which exams use the topic, links to ÖSYM question booklets, and a "report a mistake" link.
- **Ready-made prompts:** explain the topic, generate questions, step-by-step solution, mistake analysis, flashcards, study plan (plus a current events list for Current Affairs). Choose a level (1–5) and length; feedback adapts them per topic. **Copy**, **Open in ChatGPT**, **Open in Claude**.
- **Progress and backup:** mark topics as studying / done / to review, add notes, see progress bars, and move your progress to another computer with a JSON backup.
- **Search:** full-text site search (Pagefind, runs in the browser), per language.
- **Privacy:** no accounts, server, cookies or analytics. Progress is stored only in your browser.

## Exams covered (2026)

| Exam | Structure |
|---|---|
| KPSS Bachelor's, Associate, Secondary | General Ability 60 + General Culture 60 questions, 130 min |
| KPSS Bachelor's Field Knowledge (Group A) | 9 tests of 40 questions, 3 sessions |
| DHBT | 40 questions, 60 min |
| MEB-AGS | 80 questions, 110 min (Educational Sciences is now here) |
| ÖABT | 17 fields, 50 questions each, 70/90 min |

Details and the official documents are on the site's **Sources** page.

## Running locally

```bash
npm ci
npm run dev        # http://localhost:4321/kpss-rehber/
```

```bash
npm test           # unit tests
npm run test:e2e   # end-to-end tests (build + preview)
npm run build      # dist/ + search index
```

Requires Node 22. Built with Astro (static output), Vitest, Playwright and Pagefind.

## Project layout

| Path | Contents |
|---|---|
| `src/content/exams/*.yaml` | Exam → session → test → subject → topic references |
| `src/content/topics/<locale>/<subject>/<slug>.md` | Topic metadata and static summary, one file per language |
| `src/prompts/templates/<locale>/*.md` | Prompt templates, one folder per language |
| `src/prompts/levels.yaml`, `lengths.yaml` | Level and length instructions |
| `src/i18n/` | UI dictionaries (`tr.js`, `en.js`) and helpers |
| `data/sources.json`, `data/calendar.yaml` | Tracked ÖSYM documents; application and exam dates |

All data is validated during the build: a broken reference, a record without a source, question counts that do not add up, a missing translation or an unfilled template variable fails the build. See [CONTRIBUTING.md](CONTRIBUTING.md).

If you spot wrong or outdated information, use the **Report a mistake** link on the page.

## License

- Code: [MIT](LICENSE)
- Content (topic texts and prompt templates): [CC BY-SA 4.0](LICENSE-CONTENT)
- ÖSYM documents and question booklets belong to ÖSYM; this repository only links to them.

## Disclaimer

This site is **not affiliated with ÖSYM**. Information is compiled from official documents but may contain mistakes; topic summaries may be written with AI assistance. For authoritative information on applications, exams and results, always rely on [osym.gov.tr](https://www.osym.gov.tr).
