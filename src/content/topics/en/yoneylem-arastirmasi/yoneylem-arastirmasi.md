---
title: "Operations Research"
subject: yoneylem-arastirmasi
state: draft
subtopics:
  - Linear programming model and graphical solution
  - The simplex method
  - Duality and sensitivity analysis
  - Transportation and assignment problems
  - Project scheduling (CPM and PERT)
  - Queueing theory and game theory
keyConcepts: [objective function, constraint, feasible region, corner point, simplex method, slack variable, surplus variable, artificial variable, dual problem, shadow price, northwest corner method, Vogel's approximation, Hungarian method, critical path, PERT, Little's law]
questionStyle: "Setting up a small linear programme and solving it at the corner points; interpreting the primal-dual relationship; a critical path or transportation table question"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Operations research (*yöneylem araştırması*) builds mathematical models for making the best decision with limited resources. At its centre is linear programming (LP): a linear objective function is maximised or minimised subject to linear constraints. The test has only **2 questions** here; they usually ask you to solve a small LP model, write the dual, or find the critical path of a project network.

## Linear programming

- **Model:** decision variables, objective function, constraints and non-negativity.
- **Graphical solution:** with two variables, draw the feasible region; the optimum (if it exists) lies at a **corner point**.
- **Special cases:** infeasible, unbounded, alternative optimal solutions, degeneracy.
- **Simplex method:** moves from a corner to an adjacent corner, improving the objective. Add a **slack** variable to a ≤ constraint, and a **surplus** plus an **artificial** variable to a ≥ constraint; artificial variables are driven out with the Big M or two-phase method.

## Duality and sensitivity

- Every primal problem has a **dual**: maximise ↔ minimise, constraints ↔ variables, right-hand sides ↔ objective coefficients.
- **Weak duality:** the objective value of any feasible solution of a maximisation problem never exceeds that of any feasible solution of its (minimisation) dual. **Strong duality:** the optimal values of the two are equal.
- **Shadow price:** the change in the objective when a resource increases by one unit; it is the value of the corresponding dual variable.

## Transportation and assignment

- **Balanced problem:** total supply = total demand; otherwise add a dummy source or destination.
- A basic solution of a problem with m sources and n destinations has **m + n − 1** basic variables.
- **Initial solution:** northwest corner, least cost and **Vogel's** method (usually the closest start to the optimum).
- **Assignment problem:** one-to-one matching, solved with the **Hungarian method**.

## Networks, queues and games

- **CPM:** the longest path through the network is the **critical path**; critical activities have zero slack, and delaying them delays the project.
- **PERT:** expected time (a + 4m + b)/6, variance [(b − a)/6]²; a is optimistic, m most likely, b pessimistic.
- **M/M/1 queue:** requires ρ = λ/μ < 1; the average number in the system is L = ρ/(1 − ρ). **Little's law:** L = λW.
- **Game theory:** in a two-person zero-sum game, if maximin = minimax there is a **saddle point** and a pure strategy is enough.

## Commonly confused

- A *slack variable* is unused resource in a ≤ constraint; a *surplus variable* is the amount above the lower limit in a ≥ constraint.
- *CPM* uses fixed durations; *PERT* uses three time estimates.
- The *transportation problem* distributes quantities from sources to destinations; the *assignment problem* gives each job to exactly one person.

## Study tip

Practise the graphical solution and the dual of a two-variable LP on a few examples; it is the pattern you will meet most often in this two-question subject.
