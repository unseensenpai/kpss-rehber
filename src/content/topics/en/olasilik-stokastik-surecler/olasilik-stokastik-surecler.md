---
title: "Probability and Stochastic Processes"
subject: olasilik-stokastik-surecler
state: draft
subtopics:
  - Probability axioms, conditional probability and Bayes' theorem
  - Random variables, expectation and variance
  - Discrete and continuous distributions
  - Joint distributions, covariance and independence
  - Limit theorems (law of large numbers, central limit theorem)
  - Markov chains
  - Poisson process and random walk
keyConcepts: [conditional probability, Bayes' theorem, independence, expected value, variance, covariance, binomial distribution, Poisson distribution, exponential distribution, normal distribution, Chebyshev's inequality, central limit theorem, Markov chain, transition matrix, stationary distribution, Poisson process]
questionStyle: "Conditional probability and Bayes calculations; finding the mean and variance of a distribution; computing n-step transitions or the stationary distribution of a Markov chain"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Probability is the language for modelling uncertain outcomes with numbers; stochastic processes (*stokastik süreçler*) study how that uncertainty evolves over time. With **6 questions**, this is one of the heaviest subjects in the test. Questions usually ask for a short calculation: a conditional probability, the mean or variance of a distribution, or the probability of being in a state after a given number of steps of a Markov chain.

## Basic rules

- **Axioms:** 0 ≤ P(A) ≤ 1, P(Ω) = 1; for mutually exclusive events P(A ∪ B) = P(A) + P(B).
- **Addition rule:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B).
- **Conditional probability:** P(A | B) = P(A ∩ B) / P(B), with P(B) > 0.
- **Independence:** P(A ∩ B) = P(A)·P(B). Two mutually exclusive events with positive probabilities cannot be independent.
- **Bayes' theorem:** P(Bᵢ | A) = P(A | Bᵢ)P(Bᵢ) / ∑ P(A | Bⱼ)P(Bⱼ); the denominator is the law of total probability.

## Random variables and distributions

- **Expectation and variance:** E(aX + b) = aE(X) + b, Var(aX + b) = a²Var(X), Var(X) = E(X²) − [E(X)]².
- **Covariance:** Cov(X, Y) = E(XY) − E(X)E(Y); Var(X + Y) = Var(X) + Var(Y) + 2Cov(X, Y). Independence makes covariance zero, but zero covariance does not imply independence.
- **Binomial (n, p):** mean np, variance np(1 − p).
- **Poisson (λ):** mean and variance both λ.
- **Geometric:** number of trials until the first success; mean 1/p.
- **Uniform (a, b):** mean (a + b)/2, variance (b − a)²/12.
- **Exponential (λ):** mean 1/λ, variance 1/λ²; it is **memoryless**: P(X > s + t | X > s) = P(X > t).
- **Normal:** standardised with Z = (X − μ)/σ.

## Limit theorems

- **Chebyshev's inequality:** P(|X − μ| ≥ kσ) ≤ 1/k²; it holds even when the distribution is unknown.
- **Law of large numbers:** as n grows, the sample mean converges to μ.
- **Central limit theorem:** the mean of independent, identically distributed variables with finite variance is approximately N(μ, σ²/n) for large n.

## Stochastic processes

- **Markov property:** the future depends only on the present state; the past adds no information.
- **Transition matrix P:** each row sums to 1; n-step transition probabilities come from Pⁿ (Chapman–Kolmogorov).
- **Stationary distribution π:** solve πP = π together with the condition that the components sum to 1.
- **Poisson process (λ):** the number of events in (0, t] is Poisson(λt); inter-arrival times are independent exponential(λ).
- **Random walk:** a process that moves by independent increments at each step.

## Commonly confused

- *Mutually exclusive* events cannot happen together; *independent* events do not change each other's probability.
- *Zero covariance* only means no linear relationship; *independence* is a much stronger condition.
- The *Poisson distribution* models the number of events in an interval, the *exponential distribution* the time between two events.

## Study tip

Put the means and variances of the standard distributions in one table and memorise it; most questions are solved in one or two steps with these values. In Markov questions, first check that each row of the matrix sums to 1, then set up the πP = π equations.
