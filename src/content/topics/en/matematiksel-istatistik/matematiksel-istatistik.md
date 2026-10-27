---
title: "Mathematical Statistics"
subject: matematiksel-istatistik
state: draft
subtopics:
  - Sampling distributions (chi-square, t, F)
  - Properties of estimators
  - Method of moments and maximum likelihood
  - Sufficiency and the Cramér–Rao lower bound
  - Interval estimation
  - Hypothesis testing and the Neyman–Pearson lemma
keyConcepts: [estimator, unbiasedness, consistency, efficiency, mean squared error, sufficient statistic, factorisation theorem, method of moments, maximum likelihood, Fisher information, Cramér-Rao lower bound, confidence interval, type I error, type II error, power of a test, likelihood ratio]
questionStyle: "Showing whether an estimator is unbiased; deriving a maximum likelihood estimator; interpreting error types, power and sampling distributions"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Mathematical statistics (*matematiksel istatistik*) is the theory behind drawing conclusions about a population parameter from a sample: which estimator is good, how to find it, and how to test a hypothesis. The subject has **6 questions** in the test. Questions usually ask you to compute the expectation or variance of an estimator, derive a maximum likelihood estimate for a distribution, or reason about error types and the power of a test.

## Sampling distributions

- **Sample mean:** E(x̄) = μ, Var(x̄) = σ²/n.
- **Sample variance:** S² = ∑(xᵢ − x̄)²/(n − 1); dividing by n − 1 makes S² unbiased for σ².
- **Chi-square:** the sum of squares of k independent standard normals is χ²(k); for a normal population (n − 1)S²/σ² ~ χ²(n − 1).
- **t distribution:** Z / √(V/k), with V ~ χ²(k) independent of Z. It approaches the standard normal as the degrees of freedom grow.
- **F distribution:** (U/m) / (V/n), with U and V independent chi-square variables. The square of a t(k) variable is F(1, k).

## Properties of estimators

- **Unbiasedness:** E(θ̂) = θ.
- **Mean squared error:** MSE = Var(θ̂) + (bias)²; a biased estimator can have a smaller MSE.
- **Consistency:** θ̂ converges in probability to θ as n → ∞.
- **Efficiency:** of two unbiased estimators, the one with smaller variance is more efficient.
- **Sufficiency:** the statistic carries all the information in the sample about θ; shown with the Fisher–Neyman factorisation theorem.
- **Cramér–Rao lower bound:** under regularity conditions, the variance of an unbiased estimator cannot be below 1/(n·I(θ)), where I(θ) is the Fisher information of one observation.

## Estimation methods

- **Method of moments:** set sample moments equal to population moments and solve.
- **Maximum likelihood (MLE, *en çok olabilirlik*):** maximise L(θ) = ∏ f(xᵢ; θ); in practice set the derivative of ln L to zero. For Poisson λ̂ = x̄, for exponential λ̂ = 1/x̄, for Bernoulli p̂ = x̄.
- **Invariance:** if θ̂ is the MLE, then g(θ̂) is the MLE of g(θ).

## Hypothesis testing

- **Type I error (α):** rejecting a true H₀. **Type II error (β):** failing to reject a false H₀. **Power** = 1 − β.
- With a fixed sample size, lowering α raises β; the way to reduce both is to increase n.
- **p-value:** the probability, when H₀ is true, of a result as extreme as or more extreme than the one observed; reject H₀ if p < α.
- **Neyman–Pearson lemma:** for a simple versus simple test, the most powerful test at a given α is based on the likelihood ratio.

## Commonly confused

- *Unbiasedness* means being right on average; *consistency* means converging to the true value in large samples.
- *α (significance level)* is chosen in advance; the *p-value* is computed from the data.
- A *95% confidence interval* does not mean "the parameter is in this interval with probability 0.95"; it means about 95% of intervals produced by the *method* cover the parameter.

## Study tip

Derive the MLE for the Poisson, exponential, normal and Bernoulli distributions once by hand; exam questions are mostly small variations on these patterns.
