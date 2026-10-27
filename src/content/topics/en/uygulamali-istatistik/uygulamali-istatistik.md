---
title: "Applied Statistics"
subject: uygulamali-istatistik
state: draft
subtopics:
  - Levels of measurement and types of data
  - Measures of central tendency
  - Measures of dispersion and shape
  - Standard scores and applications of the normal distribution
  - Confidence intervals and basic hypothesis tests
  - Correlation
  - Index numbers
keyConcepts: [nominal scale, ordinal scale, interval scale, ratio scale, arithmetic mean, median, mode, standard deviation, coefficient of variation, interquartile range, skewness, kurtosis, z-score, confidence interval, t test, Laspeyres index]
questionStyle: "Computing the mean, median, standard deviation or coefficient of variation of a small data set; interpreting skewness; choosing the right test for a situation and interpreting the result"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Applied statistics (*uygulamalı istatistik*) applies tools for summarising, visualising and drawing basic inferences from data to real problems. With **6 questions**, it is one of the heaviest subjects in the test. Questions usually ask for a calculation on a small data set (mean, median, standard deviation, coefficient of variation, z-score) or ask you to choose the right scale and test for a research situation.

## Measurement and central tendency

- **Levels of measurement:** **nominal** (sex), **ordinal** (education level), **interval** (temperature in °C; arbitrary zero), **ratio** (income, height; true zero, so ratios make sense).
- The **mean** is affected by extreme values; the **median** and **mode** are more resistant. For nominal data only the mode is meaningful.
- For positive data, **arithmetic ≥ geometric ≥ harmonic** mean. The geometric mean is used for averaging growth rates, the harmonic mean for averaging speeds.

## Dispersion and shape

- **Variance:** s² = ∑(xᵢ − x̄)²/(n − 1); **standard deviation** s = √s².
- **Coefficient of variation:** CV = (s / x̄) × 100; compares the spread of series with different units or means.
- **Interquartile range:** Q₃ − Q₁; the basis of the box plot, little affected by outliers.
- **Linear transformation:** if Y = aX + b, then ȳ = a·x̄ + b and s_Y = |a|·s_X; adding a constant to every value does not change the spread.
- **Skewness:** in a right (positively) skewed distribution, typically mode < median < mean; in a left-skewed one the order reverses. **Kurtosis** compares the peak and tails of a distribution with the normal.

## Standard scores and inference

- **z-score:** z = (x − x̄)/s; compares scores on different scales.
- **Empirical rule for the normal:** about 68% of values lie within μ ± σ, 95% within μ ± 2σ, 99.7% within μ ± 3σ.
- **Confidence interval for a mean:** if σ is known, x̄ ± z(α/2)·σ/√n; if not and the population is normal, use t(n − 1) and s instead.
- **Choosing a test:** one-sample t, independent two-sample t, paired t, z test for a proportion, chi-square for categorical variables.
- **Pearson correlation** r lies between −1 and 1 and measures the direction and strength of a linear relationship; it does not show causation.

## Index numbers

- **Laspeyres** weights with **base-period** quantities, **Paasche** with **current-period** quantities; the **Fisher** index is the geometric mean of the two.

## Commonly confused

- *Standard deviation* measures absolute spread; the *coefficient of variation* measures spread relative to the mean.
- On an *interval scale* ratios are meaningless (20 °C is not twice as hot as 10 °C); on a *ratio scale* they are meaningful.
- The *independent-samples t test* compares different people; the *paired t test* compares two measurements of the same people.

## Study tip

Get used to computing the mean, median, standard deviation and coefficient of variation by hand on small sets of five or six numbers; in this subject speed earns as many points as concepts.
