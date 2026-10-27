---
title: "Sampling"
subject: ornekleme
state: draft
subtopics:
  - Basic concepts and sampling errors
  - Probability and non-probability sampling
  - Simple random sampling
  - Determining sample size
  - Stratified sampling
  - Systematic, cluster and multistage sampling
  - Ratio and regression estimators
keyConcepts: [population, sampling frame, sampling error, non-sampling error, finite population correction, simple random sampling, stratified sampling, proportional allocation, Neyman allocation, systematic sampling, cluster sampling, multistage sampling, quota sampling, snowball sampling, ratio estimator, design effect]
questionStyle: "Identifying the sampling method that fits a situation; computing sample size or allocation to strata; interpreting the variance of an estimator"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Sampling (*örnekleme*) means making reliable estimates about a population from a part of it, without examining every unit. A good design gives the smallest variance for a given cost, or a given precision at the lowest cost. The test has **4 questions**; they focus on recognising methods, computing sample size and allocating a sample to strata.

## Basic concepts

- **Population, sampling unit** and **sampling frame** (the list of units used for selection).
- **Sampling error:** arises from using a sample instead of a full census; it shrinks as n grows.
- **Non-sampling error:** frame gaps, non-response, measurement and recording errors; it occurs in a census too.
- **Probability sampling:** every unit has a known, non-zero chance of selection, so sampling error can be computed. **Non-probability sampling:** convenience, quota, purposive (judgement) and snowball.

## Simple random sampling and sample size

- The sample mean ȳ is an unbiased estimator of the population mean; without replacement Var(ȳ) = (1 − f)·S²/n, where f = n/N is the sampling fraction.
- **Finite population correction** (1 − f): ignored when n is very small relative to N (usually below 5%).
- **Sample size for a mean:** n₀ = z²σ²/e², where e is the acceptable margin of error. **For a proportion:** n₀ = z²p(1 − p)/e²; if p is unknown, use p = 0.5, which gives the largest size.
- Correction for a finite population: n = n₀ / (1 + n₀/N).
- To halve the margin of error, the sample size must roughly **quadruple**.

## Stratified sampling

- The population is split into strata that are **homogeneous inside and different from each other**; an independent sample is drawn from each.
- **Estimator:** ȳₛₜ = ∑ Wₕ ȳₕ, with Wₕ = Nₕ/N.
- **Proportional allocation:** nₕ ∝ Nₕ. **Neyman (optimum) allocation:** nₕ ∝ Nₕ Sₕ. If unit costs differ between strata, nₕ ∝ Nₕ Sₕ / √cₕ.

## Other probability methods

- **Systematic sampling:** every k-th unit from a random start, with k = N/n. A **periodicity** in the list that matches k causes serious bias.
- **Cluster sampling:** natural groups (neighbourhoods, schools) are selected and the units within them studied. It saves cost and frame work, but precision falls when clusters are internally similar, so the ideal cluster is **heterogeneous inside**.
- **Multistage sampling:** first clusters are selected, then units within the selected clusters.
- **Ratio and regression estimators:** improve precision using an auxiliary variable that is strongly related to the study variable and whose population total is known.
- **Design effect:** the ratio of an estimator's variance under a design to its variance under simple random sampling of the same size.

## Commonly confused

- In *stratified sampling* units come from every stratum and strata should be homogeneous inside; in *cluster sampling* only some clusters are chosen and clusters should be heterogeneous inside.
- *Quota sampling* resembles stratified sampling, but units are not chosen at random; it is a non-probability method.
- *Sampling error* falls as n increases; *non-sampling error* does not, and may even grow.

## Study tip

Be able to state the difference between a stratum and a cluster in one sentence, then work through a few sample-size calculations with n₀ = z²p(1 − p)/e². Most questions in this subject come from these two points.
