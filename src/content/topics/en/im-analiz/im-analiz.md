---
title: "Analysis"
subject: im-analiz
state: draft
subtopics:
  - Real numbers, sequences and limits of sequences
  - Limits of functions and continuity
  - Derivatives and their applications
  - Indefinite and definite integrals
  - Applications of integrals (area and volume)
  - Series and convergence tests
keyConcepts: [limit of a sequence, monotone sequence, continuity, intermediate value theorem, Rolle's theorem, mean value theorem, L'Hôpital's rule, chain rule, extremum, inflection point, fundamental theorem of calculus, integration by parts, geometric series, ratio test]
questionStyle: "Computing a limit, derivative or integral; judging whether the conditions of a theorem hold; deciding whether a series converges"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Analysis (*analiz*) is built on the idea of a **limit**: continuity, derivatives, integrals and series are all limit questions in different clothes. With **18 questions** it is the heaviest subject in the Elementary Mathematics ÖABT. Most questions ask you to compute a limit, derivative or integral; others check whether you know the conditions of a theorem (intermediate value, Rolle, mean value). This is the university-level version of the rate of change, slope and area ideas you will teach in lower-secondary school.

## Sequences, limits and continuity

- **Limit of a sequence:** every convergent sequence is bounded, but not conversely ((−1)ⁿ is bounded and divergent). Every **monotone and bounded** sequence converges.
- **Key limits:** lim x→0 sin x / x = 1, lim n→∞ (1 + 1/n)ⁿ = e.
- **Continuity:** f is continuous at a ⇔ lim x→a f(x) exists and equals f(a). If the left and right limits differ, the limit does not exist.
- **Intermediate value theorem:** if f is continuous on [a, b] and f(a)·f(b) < 0, there is a c in (a, b) with f(c) = 0. A continuous function on a closed interval attains its maximum and minimum.

## Derivatives

- **Definition:** f'(a) = lim h→0 [f(a + h) − f(a)] / h; geometrically the slope of the tangent, physically the instantaneous rate of change.
- **Differentiability implies continuity**, not the reverse: |x| is continuous at 0 but has no derivative there.
- **Rules:** (f·g)' = f'g + fg', chain rule (f∘g)'(x) = f'(g(x))·g'(x).
- **Mean value theorem:** for f continuous on [a, b] and differentiable on (a, b), some c satisfies f'(c) = [f(b) − f(a)] / (b − a). **Rolle's theorem** is the special case f(a) = f(b).
- **L'Hôpital's rule:** for 0/0 or ∞/∞ forms, lim f/g = lim f'/g' (when the right-hand limit exists).
- **Applications:** at a critical point where f'(x) = 0, f''(x) > 0 gives a local minimum and f''(x) < 0 a local maximum. Where the second derivative changes sign is an **inflection point**.

## Integrals

- **Fundamental theorem of calculus:** if F' = f, then ∫ₐᵇ f(x) dx = F(b) − F(a); also d/dx ∫ₐˣ f(t) dt = f(x).
- **Basic forms:** ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C (n ≠ −1), ∫ (1/x) dx = ln|x| + C, ∫ eˣ dx = eˣ + C.
- **Methods:** substitution and **integration by parts**: ∫ u dv = u·v − ∫ v du.
- **Area and volume:** area between two curves is ∫ₐᵇ [f(x) − g(x)] dx (f ≥ g); volume of revolution about the x-axis is π ∫ₐᵇ [f(x)]² dx.

## Series

- **Geometric series:** Σ a·rⁿ converges only when |r| < 1, with sum a/(1 − r) (first term a).
- **p-series:** Σ 1/nᵖ converges for p > 1 and diverges for p ≤ 1 (the harmonic series is p = 1).
- **Tests:** if the terms do not tend to zero, the series diverges. **Ratio test:** lim |aₙ₊₁/aₙ| = L < 1 converges, L > 1 diverges, L = 1 is inconclusive.

## Commonly confused

- Being *continuous* does not guarantee being *differentiable*; being differentiable does guarantee continuity.
- The condition *aₙ → 0* is *necessary* but not *sufficient* for convergence: the harmonic series has terms tending to zero yet diverges.
- An *indefinite integral* is a family of functions (+ C); a *definite integral* is a number.

## Study tip

Learn every theorem together with its conditions and find a counterexample that breaks each condition (|x|, 1/x and so on). Many questions ask exactly "which condition fails?".
