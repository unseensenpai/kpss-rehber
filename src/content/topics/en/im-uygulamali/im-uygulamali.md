---
title: "Applied Mathematics"
subject: im-uygulamali
state: draft
subtopics:
  - Counting principles, permutations and combinations
  - Binomial expansion and the pigeonhole principle
  - Probability and conditional probability
  - Random variables and expected value
  - Descriptive statistics
  - Logic and graph theory
keyConcepts: [addition and multiplication principles, permutation, combination, pigeonhole principle, inclusion-exclusion principle, Pascal's triangle, conditional probability, independent events, Bayes' rule, expected value, variance, standard deviation, graph, Euler circuit]
questionStyle: "Solving a counting or probability problem; interpreting the measures of centre and spread of a data set; identifying a property of a graph or a proposition"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

In this exam Applied Mathematics (*uygulamalı matematik*) has three parts: **probability**, **statistics** and **discrete mathematics** (counting, logic, graphs). The Elementary Mathematics ÖABT has **8 questions** on it. Most ask you to solve a counting or probability problem, interpret a data set or identify a property of a graph. It is the university-level basis of the data analysis and probability units you will teach in lower-secondary school.

## Counting

- **Multiplication principle:** for successive independent choices multiply the numbers of options; for disjoint cases add them.
- **Permutation (ordered):** P(n, r) = n!/(n − r)!. With repeated items n!/(n₁!·n₂!·…); around a circle (n − 1)!.
- **Combination (unordered):** C(n, r) = n!/(r!·(n − r)!). Selection with repetition gives C(n + r − 1, r).
- **Binomial expansion:** (a + b)ⁿ = Σ C(n, k)·aⁿ⁻ᵏ·bᵏ; the coefficients sum to 2ⁿ. **Pascal's rule:** C(n, r) = C(n − 1, r − 1) + C(n − 1, r).
- **Pigeonhole principle:** if n + 1 objects go into n boxes, some box holds at least two.
- **Inclusion-exclusion:** |A ∪ B| = |A| + |B| − |A ∩ B|.

## Probability

- **Classical definition:** in an equally likely sample space P(A) = favourable outcomes / all outcomes.
- **Union:** P(A ∪ B) = P(A) + P(B) − P(A ∩ B); complement P(A') = 1 − P(A).
- **Conditional probability:** P(A | B) = P(A ∩ B)/P(B). If A and B are **independent**, P(A ∩ B) = P(A)·P(B).
- **Bayes' rule:** P(A | B) = P(B | A)·P(A)/P(B); used in questions that reason "from effect back to cause".
- **Expected value and variance:** E(X) = Σ x·P(X = x), Var(X) = E(X²) − [E(X)]². For the binomial distribution E(X) = np and Var(X) = np(1 − p).

## Statistics

- **Centre:** mean, median (middle of the ordered data) and mode (most frequent value). Outliers move the mean but barely move the median.
- **Spread:** range, variance, standard deviation. Adding a constant to every value shifts the mean but not the standard deviation; multiplying every value by k multiplies the standard deviation by |k|.
- **Normal distribution:** about 68% of values lie within one standard deviation of the mean, 95% within two and 99.7% within three.

## Logic and graphs

- **Propositions:** p ⇒ q ≡ ¬p ∨ q; a conditional is equivalent to its **contrapositive** (¬q ⇒ ¬p). De Morgan: ¬(p ∧ q) ≡ ¬p ∨ ¬q.
- **Handshake theorem:** the sum of vertex degrees is twice the number of edges, so the number of odd-degree vertices is even.
- **Euler circuit:** a connected graph has one if and only if every degree is even. A **tree** on n vertices has n − 1 edges; the complete graph Kₙ has n(n − 1)/2 edges.

## Commonly confused

- In a *permutation* order matters; in a *combination* it does not.
- *Independent* events satisfy P(A ∩ B) = P(A)·P(B); *mutually exclusive* events satisfy P(A ∩ B) = 0. Two mutually exclusive events with positive probability cannot be independent.
- A statement's *contrapositive* is equivalent to it; its *converse* (q ⇒ p) and *inverse* (¬p ⇒ ¬q) are not.

## Study tip

In counting questions first ask "does order matter, and is repetition allowed?"; those two answers pick the formula. In probability, computing the complement is often the shorter route.
