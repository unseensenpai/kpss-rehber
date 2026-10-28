# Annual review

[Türkçe](ANNUAL-REVIEW.tr.md)

ÖSYM publishes new guides, calendars and question booklets every year. This checklist moves the site to the new year. Nothing here is automatic: the weekly source check only **reports** changes, and every number on the site must come from an official document.

## How changes reach us

- `.github/workflows/source-check.yml` runs every Monday, plus on demand from the Actions tab.
- It downloads every document in `data/sources.json` and compares its SHA-256. It also reads the ÖSYM exam-group pages listed in `data/source-watch.json` and looks for guides, question booklets and topic distributions that are not registered yet.
- Each finding opens one issue labelled `new-source`. The same finding never opens a second issue, even after it is closed. Broken links and access errors are the exception: they come back if the problem returns.
- ÖSYM sometimes blocks automated clients. If the issue "Could not reach ÖSYM" appears, run the check locally:

  ```bash
  npm run check:sources
  ```

## When a new year's documents appear

Work exam by exam, in the order the guides are published (usually MEB-AGS in spring, then KPSS Bachelor's, Associate, Secondary and DHBT).

### 1. Register the document

- [ ] Download the PDF from `dokuman.osym.gov.tr` and read the relevant sections.
- [ ] Add an entry to `data/sources.json`: new `id` (e.g. `kpss-lisans-2027`), `title` in every language, `kind`, `sourceType`, `year`, `url`, `sha256`, `checkedAt`.
- [ ] Keep the previous year's entry while any page still cites it.
- [ ] An irrelevant document goes to `ignore` in `data/source-watch.json` with a short `reason`.

### 2. Exam structure (`src/content/exams/*.yaml`)

- [ ] Sessions, tests, question counts and durations.
- [ ] Subject weights and the question counts derived from them.
- [ ] Added or removed tests, fields or ÖABT branches.
- [ ] `source.document` points to the new document; the comment at the top names the section used.

### 3. Calendar (`data/calendar.yaml`)

- [ ] Application, late application and exam dates with times, from the guide's first pages.
- [ ] `document` on each entry points to the new document.
- [ ] Remove past years' entries once the new ones are in.

### 4. Topics (`src/content/topics/<locale>/`)

- [ ] Official scope sentences still match the guide or topic distribution.
- [ ] `document`, `sourceYear` and `updated` in the frontmatter; the same change in every language.
- [ ] New topics referenced from the exam files. When a topic is renamed or merged, list its old id in the new topic's `aliases` so students keep their progress.
- [ ] Have changed `published` topics reviewed again or set them back to draft; re-read legislation topics even when nothing changed ([REVIEW.md](REVIEW.md)).

### 5. Question distribution (after each exam)

- [ ] Register the question booklet (`kind: question-booklet`, `sourceType: past-exam-analysis`) and add it to `source.booklets` of the exam.
- [ ] Count questions per topic and add the year to `questionDistribution` in the topic frontmatter (e.g. `"2027": 3`).
- [ ] Never copy question text into the repository; link to the booklet only.

### 6. Changed document, same year

When an issue reports that a registered document changed:

- [ ] Compare the new PDF with the old one (`pdftotext` and a diff work well).
- [ ] Update every affected value (steps 2–5).
- [ ] Record the new hash:

  ```bash
  npm run check:sources -- --accept <source id>
  ```

### 7. Finish

- [ ] `npm test` and `npm run test:e2e` pass (the build validates references, totals, calendar and translations).
- [ ] Check the exam pages and the countdown in both languages.
- [ ] One pull request per exam, referencing the `new-source` issues it closes.
