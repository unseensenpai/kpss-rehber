# Content review

[Türkçe](REVIEW.tr.md)

Every topic summary on the site is currently a **draft**. The summaries were compiled from official documents, but no subject expert has read them yet. This document explains how a summary is reviewed and moves to **Reviewed**.

## States

| `state` | On the site | Meaning |
|---|---|---|
| `skeleton` | Summary in progress | Only the topic name exists. |
| `draft` | Draft | The summary is written and waits for review. The page shows a "Help review" link. |
| `published` | Reviewed | A reviewer went through the checklist. The page shows the reviewer's name and the date. |

Review is **per language**: `topics/tr/...` and `topics/en/...` files are published separately. A topic can be reviewed in Turkish while its English file is still a draft.

The build rejects:

- a `published` file without `reviewedBy` or `reviewedAt`,
- a topic not verified against an official document (`verified: false`),
- a file edited after its review (`updated` > `reviewedAt`),
- review fields on a `draft` or `skeleton` file.

## Who can review

Anyone who knows the subject: a teacher, an academic, a practitioner, or someone who recently sat the exam and knows the topic well. The reviewer's name is shown on the page. Reviewers who prefer not to give a name can appear under their GitHub handle. The site maintainer may publish topics they reviewed themselves under their own name.

## Checklist

1. **Accuracy:** Are definitions, dates, numbers, names of people and works, and formulas correct? Check every statement you are unsure about against a source.
2. **Currency:** For laws, regulations and curricula, does the text match the version in force? Are article numbers right? Open the source link on the page.
3. **Scope:** Do the subtopics cover the scope named in the official document at the bottom of the page (ÖSYM guide or topic distribution)? Is the summary lost in detail outside that scope?
4. **Key concepts and "How does ÖSYM ask about it?":** Is every listed concept explained in the text? Is the question style description realistic?
5. **Stands on its own:** Can a student grasp the core idea without using the prompts?
6. **Copyright:** Is the text free of past exam questions and paragraphs copied from textbooks or other sites?
7. **Language:** Is the text clear, with correct spelling and punctuation? In the English file, are Turkish terms rendered correctly?

## How to send a review

**Without code (issue):** Follow the "Help review" link on the topic page to this document, then fill in the [Content review](https://github.com/unseensenpai/kpss-rehber/issues/new?template=content-review.yml) form, giving each correction with its source. The maintainer applies the corrections and publishes the topic under your name.

**With a pull request:** Make the corrections in the file, set `updated` to today, then:

```bash
npm run review -- --publish tarih/osmanli-tarihi --locale tr --by "Full Name"
npm test
npm run build
```

`--locale tr,en` publishes both languages at once. Use it only if you reviewed both files.

## Maintainer commands

```bash
npm run review                                      # progress per language
npm run review -- --list draft --subject tarih      # files waiting for review
npm run review -- --publish <subject/topic> --locale tr --by "Name" [--date YYYY-MM-DD]
npm run review -- --unpublish <subject/topic> --locale tr
```

## After review

- Any change to a published file moves `updated` forward and stops the build. Either the reviewer approves the change (`--publish` with a new date) or the file goes back to draft (`--unpublish`).
- The maintainer may re-approve small spelling fixes under their own name. Corrections that change meaning go to the original reviewer or another one.
- Legislation topics are re-read every year during the [annual review](ANNUAL-REVIEW.md).

## Priority

Start with the topics that carry the most questions and go out of date fastest: KPSS Turkish, Mathematics and History, Educational Sciences, and Legislation (Maarif Model, laws).
