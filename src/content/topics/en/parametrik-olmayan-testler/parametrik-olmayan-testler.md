---
title: "Nonparametric Tests"
subject: parametrik-olmayan-testler
state: draft
subtopics:
  - When to use nonparametric tests
  - One-sample and goodness-of-fit tests
  - Tests for two dependent samples
  - Tests for two independent samples
  - Tests for k samples
  - Rank correlation and tests of independence
keyConcepts: [distribution-free, rank, sign test, Wilcoxon signed-rank test, Mann-Whitney U, Kruskal-Wallis H, Friedman test, chi-square goodness of fit, chi-square test of independence, Kolmogorov-Smirnov, McNemar test, Cochran's Q, runs test, Spearman rank correlation, Kendall's tau]
questionStyle: "Choosing the nonparametric test that fits a research situation; naming its parametric counterpart; a short Spearman or chi-square calculation"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Nonparametric tests (*parametrik olmayan testler*) make no strong assumption about the population distribution (such as normality); most work by turning data into **ranks**. They are preferred with small samples, when normality fails, or when data are ordinal or nominal. When the assumptions of a parametric test do hold, they are usually less powerful. The test has **2 questions**, and they are mostly "which test should be used here?"

## Tests and their parametric counterparts

- **Sign test:** uses only the signs, for a one-sample median or paired differences.
- **Wilcoxon signed-rank test:** two dependent samples (before-after); uses both the sign and the rank of the size of each difference. Counterpart: paired t test.
- **Mann–Whitney U:** two independent samples. Counterpart: independent-samples t test.
- **Kruskal–Wallis H:** k independent samples. Counterpart: one-way ANOVA.
- **Friedman test:** k dependent samples (repeated measures or blocks). Counterpart: repeated-measures ANOVA.
- **Spearman rank correlation:** rₛ = 1 − 6∑d² / [n(n² − 1)], where d is the difference between the two ranks (with no ties). Counterpart: Pearson correlation. **Kendall's tau** also measures ordinal association.

## Nominal data and goodness-of-fit tests

- **Chi-square goodness of fit:** do observed frequencies match an expected distribution? χ² = ∑(O − E)²/E.
- **Chi-square test of independence:** are two variables in an r × c table independent? Degrees of freedom (r − 1)(c − 1); expected frequencies should generally not be below 5.
- **McNemar test:** tests before-after (dependent) change in a two-category variable; **Cochran's Q** extends it to k dependent measurements.
- **Kolmogorov–Smirnov:** compares a sample's cumulative distribution with a theoretical continuous distribution (or two samples with each other); also used to check normality.
- **Runs test:** checks whether a sequence of observations is random.

## Commonly confused

- The *Wilcoxon signed-rank test* is for two dependent samples; *Mann–Whitney U* (the Wilcoxon rank-sum test) is for two independent samples.
- *Kruskal–Wallis* is for k independent groups, *Friedman* for k measurements on the same subjects.
- *McNemar* looks at a change in proportions across two dependent measurements; the *chi-square test of independence* looks at the relationship between two variables in one sample.

## Study tip

Make a two-column table: parametric test on the left, nonparametric counterpart on the right. In a question, first answer "how many groups?" and "dependent or independent samples?"; the test then follows on its own.
