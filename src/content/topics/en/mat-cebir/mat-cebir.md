---
title: "Algebra"
subject: mat-cebir
state: draft
subtopics:
  - Vector spaces, basis and dimension
  - Linear transformations and matrix representation
  - Eigenvalues, eigenvectors and diagonalisation
  - Groups, subgroups and homomorphisms
  - Rings, ideals and fields
  - Number theory and congruences
keyConcepts: [linear independence, basis, dimension, kernel, image, rank-nullity theorem, diagonalisation, Cayley-Hamilton theorem, normal subgroup, homomorphism, isomorphism, ideal, integral domain, Chinese remainder theorem]
questionStyle: "Finding the kernel, rank or eigenvalues of a linear transformation; deciding whether an algebraic structure is a group, ring or field; solving systems of congruences"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Algebra (*cebir*) at the high-school teacher level splits into three branches: **linear algebra**, **abstract algebra** and **number theory**. The shared idea is to study objects not one by one but through **structure and the maps that preserve it**. The Mathematics ÖABT has **12 questions** on it. Most ask for the rank or eigenvalues of a matrix, which structure a set forms under given operations, or the solution of a system of congruences.

## Linear algebra

- **Basis:** a linearly independent set that spans the space; the number of its elements is the **dimension**. In ℝⁿ any set of more than n vectors is linearly dependent.
- **Linear transformation:** T(au + bv) = aT(u) + bT(v). The **kernel** is the set of vectors with T(v) = 0, the **image** the set of values of T. T is injective ⇔ its kernel is only the zero vector.
- **Rank-nullity theorem:** for T: V → W, dim V = dim(kernel) + dim(image).
- **Eigenvalues and diagonalisation:** Av = λv. An n×n matrix with n linearly independent eigenvectors can be written A = PDP⁻¹; n distinct eigenvalues are enough for this. Real symmetric matrices are always diagonalisable.
- **Cayley-Hamilton:** every square matrix satisfies its own characteristic polynomial, which lets you write Aⁿ or A⁻¹ in terms of lower powers.

## Abstract algebra

- **Subgroups and order:** in a finite group the order of a subgroup divides the order of the group (Lagrange). The order of an element a is the least positive k with aᵏ = e.
- **Cyclic groups:** in ℤₙ the element k is a generator if and only if gcd(k, n) = 1, so ℤₙ has φ(n) generators.
- **Normal subgroup:** gNg⁻¹ = N for every g. The quotient group G/N is defined only when N is normal; in an abelian group every subgroup is normal.
- **Homomorphism:** f(ab) = f(a)f(b). Its kernel is always a normal subgroup, and the **first isomorphism theorem** states G/ker(f) ≅ im(f).
- **Rings and fields:** a commutative ring with identity and no zero divisors is an **integral domain** (*tamlık bölgesi*, such as ℤ). ℤₙ is a field if and only if n is prime. Every finite integral domain is a field.
- **Ideal:** an additive subgroup closed under multiplication by elements of the ring; the ideals of ℤ have the form nℤ.

## Number theory

- **Chinese remainder theorem:** a system x ≡ aᵢ (mod mᵢ) with pairwise coprime moduli has a unique solution modulo the product of the moduli.
- **Wilson's theorem:** p is prime ⇔ (p − 1)! ≡ −1 (mod p).
- **Euler's theorem:** if gcd(a, n) = 1, then a^φ(n) ≡ 1 (mod n); for n = pᵏ, φ(n) = pᵏ − pᵏ⁻¹, and for coprime m, n, φ(mn) = φ(m)·φ(n).

## Commonly confused

- A *homomorphism* preserves structure; an *isomorphism* is also bijective.
- An *integral domain* has no zero divisors but elements may lack inverses (ℤ); in a *field* every non-zero element has a multiplicative inverse (ℚ, ℤₚ).
- *Linear independence* says no vector is built from the others; *spanning* says together they build the whole space. A basis does both.

## Study tip

Keep a ready example and counterexample for every definition in abstract algebra (ℤ, ℤ₆, S₃, 2×2 matrices). S₃ is the smallest non-abelian group, so it is the first place to look in questions about non-normal subgroups.
