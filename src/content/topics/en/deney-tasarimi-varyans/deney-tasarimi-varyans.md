---
title: "Experimental Design and Analysis of Variance"
subject: deney-tasarimi-varyans
state: draft
subtopics:
  - Principles of experimental design
  - Completely randomised design and one-way analysis of variance
  - Assumptions of analysis of variance
  - Randomised block and Latin square designs
  - Factorial designs and interaction
  - Multiple comparison tests
  - Fixed and random effects
keyConcepts: [randomisation, replication, blocking, experimental error, sum of squares, mean square, F ratio, degrees of freedom, homogeneity of variances, Levene's test, randomised block design, Latin square, interaction effect, 2 to the k factorial, Tukey HSD, Scheffé test]
questionStyle: "Completing an ANOVA table with missing cells (degrees of freedom, mean squares, F); choosing the right design for a situation; interpreting interaction"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Experimental design (*deney tasarımı*) means planning how to measure the effect of one or more factors on a response while keeping error as small as possible; analysis of variance (ANOVA, *varyans analizi*) tests those effects by splitting total variability into its sources. The test has **4 questions**. The most common type asks you to complete an ANOVA table with some cells left blank.

## Principles and one-way ANOVA

- **Three principles:** **randomisation** (prevents systematic bias), **replication** (allows experimental error to be estimated), **blocking** or local control (separates out a known source of variability).
- **Completely randomised design:** k treatments, N observations in total. SS_total = SS_treatment + SS_error.
- **Degrees of freedom:** treatment k − 1, error N − k, total N − 1.
- **F = MS_treatment / MS_error**, where MS = SS / df. If F exceeds the critical value, reject "all treatment means are equal".
- **Assumptions:** independence and normality of errors, and **homogeneity of variances** (checked with Levene's or Bartlett's test).
- **η² = SS_treatment / SS_total:** the share of variability in the response explained by the treatments.

## Block designs

- **Randomised block design:** k treatments, b blocks; each treatment appears once in each block. Block df b − 1, error df (k − 1)(b − 1). Blocks consist of similar experimental units.
- **Latin square:** controls two sources of variability (rows and columns) at once; in a p × p layout each treatment appears once in every row and every column. Error df (p − 1)(p − 2).

## Factorial designs

- All combinations of the levels of two or more factors are run; **main effects** and **interaction** are studied together.
- **Two-way ANOVA (a × b, n replicates per cell):** df a − 1 for A, b − 1 for B, (a − 1)(b − 1) for interaction, ab(n − 1) for error.
- If the **interaction** is significant, the effect of one factor depends on the level of the other, and main effects should not be interpreted alone. Non-parallel lines in an interaction plot point to interaction.
- **2ᵏ factorial:** k factors at two levels each; used to screen many factors quickly.

## Multiple comparisons and types of effects

- When ANOVA is significant, **Tukey HSD, Scheffé, Bonferroni, Duncan** or **LSD** show which means differ.
- **Fixed effects:** the researcher chooses the levels, and conclusions apply only to them. **Random effects:** levels are drawn at random from a wider population of levels, and conclusions generalise to that population.

## Commonly confused

- A *randomised block design* controls one source of variability; a *Latin square* controls two at once.
- A *main effect* is a factor's average effect; an *interaction* is that effect changing with the level of the other factor.
- *Tukey* is built for all pairwise comparisons; *Scheffé* allows any contrast and is more conservative.

## Study tip

Build the ANOVA table (source, df, SS, MS, F) once yourself for each design. If you remember that total df and total SS are the sums of their parts, you can fill missing cells in seconds.
