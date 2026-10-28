---
title: "Applied Mathematics"
subject: mat-uygulamali
state: draft
subtopics:
  - First-order differential equations
  - Linear equations with constant coefficients and the Laplace transform
  - Random variables and probability distributions
  - Expected value, variance and the central limit theorem
  - Numerical solution of equations
  - Numerical integration and numerical solution of differential equations
keyConcepts: [separable equation, integrating factor, exact differential equation, characteristic equation, Wronskian, Laplace transform, probability density function, Poisson distribution, normal distribution, central limit theorem, bisection method, Newton-Raphson method, Simpson's rule, Euler's method]
questionStyle: "Identifying the type of a differential equation and finding its general solution; computing the expected value and variance of a distribution; carrying out one step of a numerical method"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

This subject is the **modelling and computing** side of mathematics: it handles change with differential equations, uncertainty with probability and statistics, and problems with no exact solution by numerical methods. The Mathematics ÖABT has **10 questions** on it. In differential-equation questions **recognising the type of equation** is decisive; probability questions ask for the parameters of a distribution, and numerical-methods questions ask for a single step of an algorithm.

## Differential equations

- **Separable:** if dy/dx = g(x)·h(y), write dy/h(y) = g(x) dx and integrate both sides.
- **First-order linear:** y' + P(x)y = Q(x). With the **integrating factor** μ = e^(∫P dx) it becomes (μy)' = μQ.
- **Exact equation:** M dx + N dy = 0 is exact if ∂M/∂y = ∂N/∂x; the solution has the form F(x, y) = C.
- **Bernoulli:** y' + Py = Qyⁿ becomes linear with the substitution v = y¹⁻ⁿ.
- **Homogeneous with constant coefficients:** for ay'' + by' + cy = 0 solve the characteristic equation ar² + br + c = 0. Distinct real roots: C₁e^(r₁x) + C₂e^(r₂x); repeated root r: (C₁ + C₂x)e^(rx); complex roots α ± βi: e^(αx)(C₁cos βx + C₂sin βx).
- If the **Wronskian** is non-zero on an interval, the solutions are linearly independent.
- **Laplace transform:** L{1} = 1/s, L{e^(at)} = 1/(s − a), L{y'} = sY(s) − y(0); it turns initial value problems into algebraic equations.

## Probability and statistics

- **Continuous random variable:** its density f is non-negative and integrates to 1 over the whole line; P(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx.
- **Linear change:** E(aX + b) = aE(X) + b, Var(aX + b) = a²·Var(X).
- **Distributions:** Poisson(λ) has mean and variance λ. The uniform distribution on [a, b] has E = (a + b)/2 and Var = (b − a)²/12. The exponential distribution with rate λ has E = 1/λ.
- **Normal distribution:** convert to the standard normal with Z = (X − μ)/σ.
- **Central limit theorem:** for large samples the sample mean is approximately normal whatever the population distribution, with mean μ and standard deviation σ/√n.
- **Hypothesis testing:** rejecting a true H₀ is a **Type I error**; failing to reject a false H₀ is a Type II error.

## Numerical methods

- **Bisection:** an interval with f(a)·f(b) < 0 is halved at each step; slow but sure to converge.
- **Newton-Raphson:** xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ). Started near a simple root it converges quadratically (fast); it breaks down if f'(xₙ) = 0.
- **Trapezoidal rule:** ∫ₐᵇ f dx ≈ (h/2)[f₀ + 2f₁ + … + 2fₙ₋₁ + fₙ].
- **Simpson's rule:** with n even, ≈ (h/3)[f₀ + 4f₁ + 2f₂ + … + 4fₙ₋₁ + fₙ]; it is exact for polynomials up to degree three.
- **Euler's method:** for y' = f(x, y), yₙ₊₁ = yₙ + h·f(xₙ, yₙ).

## Commonly confused

- In a *linear* equation y and its derivatives appear to the first power; the word *homogeneous* means either that the right-hand side is zero or that f(tx, ty) = f(x, y). Read the context.
- In the *Poisson* distribution the mean equals the variance; in the *binomial* distribution the variance np(1 − p) is smaller than the mean.
- The *trapezoidal* rule approximates the curve with line segments, *Simpson's* rule with parabolas.

## Study tip

Before solving a differential equation, name its type (separable, linear, exact, Bernoulli, constant coefficients); once the type is right, the method follows.
