---
title: "Electricity and Magnetism"
subject: fiz-elektrik-manyetizma
state: draft
subtopics:
  - Electric charge, Coulomb's law and electric field
  - Gauss's law, electric potential and capacitance
  - Current, resistance and DC circuits
  - Magnetic field and magnetic force
  - Electromagnetic induction
  - Alternating current and Maxwell's equations
keyConcepts: [Coulomb's law, electric field, Gauss's law, potential difference, capacitance, Ohm's law, Kirchhoff's rules, Lorentz force, Biot-Savart law, Ampère's law, magnetic flux, Faraday's law, Lenz's rule, self-inductance]
questionStyle: "Calculating field, potential, current or induced emf for a charge distribution or circuit; finding the direction of a force or induced current"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Electricity and magnetism explains how charges act on each other, and that **moving charges produce magnetic fields** while **changing magnetic fields produce electric fields**. **12** questions in the test come from this subject. They usually involve calculating fields and potentials, solving circuits and finding directions in induction.

## Electrostatics

- **Coulomb's law:** F = k·q₁·q₂/r², k = 1/(4π·ε₀) ≈ 9·10⁹ N·m²/C².
- **Electric field:** E = F/q; for a point charge E = k·q/r². Field lines run from positive to negative.
- **Gauss's law:** electric flux through a closed surface Φ = q_enc/ε₀. It gives the field easily for symmetric distributions (sphere, infinite wire, plane).
- **In a conductor** static charge sits on the outer surface and the field inside is zero.
- **Potential:** V = k·q/r; W = q·ΔV. In a uniform field E = ΔV/d.
- **Capacitance:** C = Q/V; parallel plates C = ε₀·A/d. Stored energy U = ½·C·V². A dielectric multiplies capacitance by κ.
- **Combinations:** capacitances add in parallel; 1/C adds in series.

## DC circuits

- **Ohm's law:** V = I·R; resistance R = ρ·L/A.
- **Power:** P = V·I = I²·R = V²/R.
- **Resistors:** add in series; 1/R adds in parallel.
- **Kirchhoff:** current into a junction equals current out (charge conservation); voltages around a closed loop sum to zero (energy conservation).
- **RC circuit:** time constant τ = R·C.

## Magnetism and induction

- **Lorentz force:** F = q·(E + v × B); on a wire F = I·L·B·sinθ. The magnetic force is perpendicular to velocity and does no work.
- **A charge in a uniform field** moves in a circle: r = m·v/(q·B).
- **Sources:** long straight wire B = μ₀·I/(2π·r); inside a long solenoid B = μ₀·n·I. The Biot-Savart and Ampère laws give these.
- **Faraday's law:** emf = −N·dΦ/dt, Φ = B·A·cosθ.
- **Lenz's rule:** the induced current opposes the change in flux that causes it (the meaning of the minus sign).
- **Motional emf:** emf = B·L·v.
- **Inductance:** energy stored in a coil ½·L·I²; in an RL circuit τ = L/R.
- **Transformer:** V₂/V₁ = N₂/N₁ (ideal); works only with alternating current.
- **Maxwell's equations** unite the four laws and predict electromagnetic waves travelling at the speed of light: c = 1/√(μ₀·ε₀).

## Commonly confused

- The *electric field* is a vector and falls with the square of distance; the *potential* is a scalar and falls with distance.
- The *magnetic field* (B) is a field; *magnetic flux* (Φ = B·A·cosθ) is the amount of field through a surface. Induction comes from a *change* in flux, not from the field's presence.
- *Capacitors* add in parallel, *resistors* add in series; the combination rules are reversed.

## Study tip

Practise the right-hand rule a few times a day with a positive charge example for direction questions. In circuits, find the equivalent resistance first, then share out currents with Kirchhoff.
