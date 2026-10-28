---
title: "Analysis"
subject: mat-analiz
state: draft
subtopics:
  - Completeness of the reals, supremum and infimum
  - Sequences, Cauchy sequences and ε-δ limits
  - Continuity and uniform continuity
  - Derivatives, Taylor expansion and the Riemann integral
  - Improper integrals and power series
  - Functions of several variables and multiple integrals
  - Introduction to complex functions
keyConcepts: [supremum, completeness axiom, Cauchy sequence, Bolzano-Weierstrass theorem, ε-δ definition, uniform continuity, Taylor polynomial, Riemann integral, improper integral, radius of convergence, partial derivative, gradient, Jacobian, Cauchy-Riemann equations]
questionStyle: "Carrying out a limit, integral or series calculation; interpreting the conditions of definitions and theorems (completeness, uniform continuity, convergence); solving extremum and multiple-integral questions for functions of several variables"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Analysis (*analiz*) at the high-school teacher level goes beyond computing techniques and asks **why they work**: the completeness of the real numbers, ε-δ definitions and notions of convergence underpin everything. With **18 questions** it carries the largest share of the Mathematics ÖABT. Questions mix direct computation (limits, derivatives, integrals, sums of series) with asking under which conditions a definition or theorem holds; multivariable analysis and complex functions can also appear.

## Real numbers and sequences

- **Completeness axiom:** every non-empty subset of ℝ that is bounded above has a **supremum** (least upper bound). ℚ lacks this property.
- **Cauchy sequence:** for every ε > 0 there is an N with m, n > N ⇒ |aₘ − aₙ| < ε. In ℝ a sequence converges if and only if it is Cauchy.
- **Bolzano-Weierstrass:** every bounded sequence in ℝ has a convergent subsequence.
- **ε-δ limit:** lim x→a f(x) = L ⇔ ∀ε > 0 ∃δ > 0: 0 < |x − a| < δ ⇒ |f(x) − L| < ε.

## Continuity and derivatives

- **Uniform continuity:** δ depends only on ε, not on the point. Every function continuous on a closed bounded interval is uniformly continuous; f(x) = 1/x is continuous on (0, 1) but not uniformly continuous there.
- **Taylor expansion:** f(x) ≈ Σ f⁽ᵏ⁾(a)·(x − a)ᵏ/k!. Key series: eˣ = Σ xⁿ/n!, sin x = x − x³/3! + x⁵/5! − …, 1/(1 − x) = Σ xⁿ (|x| < 1).
- The **mean value theorem** and L'Hôpital's rule are the main tools for indeterminate limits; before applying L'Hôpital, check that the form really is 0/0 or ∞/∞.

## Integrals and series

- **Riemann integral:** the common limit of lower and upper sums. Every function continuous on a closed interval (indeed every bounded function with finitely many discontinuities) is integrable.
- **Improper integrals:** ∫₁^∞ 1/xᵖ dx converges for p > 1; ∫₀¹ 1/xᵖ dx converges for p < 1.
- **Power series:** Σ cₙ(x − a)ⁿ has a radius of convergence R; it converges absolutely for |x − a| < R, diverges for |x − a| > R, and the endpoints must be checked separately. From the ratio test, 1/R = lim |cₙ₊₁/cₙ| (when the limit exists).
- **Absolute convergence** implies convergence; Σ (−1)ⁿ⁺¹/n converges but not absolutely (it is **conditionally** convergent).

## Multivariable and complex analysis

- **Partial derivatives and gradient:** ∇f = (∂f/∂x, ∂f/∂y); the gradient points in the direction of fastest increase. The directional derivative along a unit vector u is ∇f · u.
- **Extrema:** at a critical point let D = f_xx·f_yy − (f_xy)². D > 0 and f_xx > 0 gives a local minimum, D > 0 and f_xx < 0 a local maximum, D < 0 a saddle point.
- **Polar coordinates:** in a double integral dx dy = r dr dθ; the factor r is the **Jacobian** determinant of the change of variables.
- **Complex derivative:** for f = u + iv to be differentiable, the **Cauchy-Riemann** equations must hold: ∂u/∂x = ∂v/∂y and ∂u/∂y = −∂v/∂x.

## Commonly confused

- In *continuity* δ may depend on both ε and the point; in *uniform continuity* one δ must work for all points.
- Rearranging an *absolutely* convergent series does not change its sum; for a *conditionally* convergent series there is no such guarantee.
- A *supremum* need not belong to the set; a *maximum* must.

## Study tip

Practise writing every definition with quantifiers (∀, ∃) and keep a list of counterexamples (1/x, sin(1/x), (−1)ⁿ). Most theoretical questions are settled by one example from that short list.
