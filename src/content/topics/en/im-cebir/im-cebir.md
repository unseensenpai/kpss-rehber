---
title: "Algebra"
subject: im-cebir
state: draft
subtopics:
  - Sets, relations and functions
  - Divisibility, GCD-LCM and prime numbers
  - Modular arithmetic and congruences
  - Matrices, determinants and systems of linear equations
  - Vector spaces and eigenvalues
  - Operations and group structure
keyConcepts: [equivalence relation, order relation, injective and surjective function, Euclidean algorithm, fundamental theorem of arithmetic, congruence, Fermat's little theorem, Euler phi function, determinant, inverse matrix, rank, eigenvalue, group, Lagrange's theorem]
questionStyle: "Carrying out a number-theory or matrix calculation; identifying the properties of a relation or operation; deciding whether a structure is a group"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Algebra (*cebir*) studies the **structure of numbers and objects under operations**: from divisibility to matrices to groups, the question is always "which rule always holds?". The Elementary Mathematics ÖABT has **12 questions** on it. Most questions ask you to compute a GCD (*EBOB*), a remainder, a determinant or an inverse matrix; others ask whether a relation is an equivalence relation or whether an operation forms a group. It is the theory behind the factors, multiples and equations of the lower-secondary curriculum.

## Sets, relations and functions

- **Equivalence relation:** reflexive, symmetric and transitive; it splits the set into disjoint equivalence classes.
- **Partial order:** reflexive, antisymmetric and transitive (for example "divides" on the positive integers).
- **Counting functions:** from an m-element set to an n-element set there are nᵐ functions; if m ≤ n, n!/(n − m)! of them are **injective**.

## Number theory

- **Fundamental theorem of arithmetic:** every integer greater than 1 factors into primes uniquely up to order. If n = pᵃ·qᵇ, it has (a + 1)(b + 1) positive divisors.
- **Euclidean algorithm:** gcd(a, b) = gcd(b, a mod b). Also gcd(a, b)·lcm(a, b) = a·b, and there are integers x, y with gcd(a, b) = ax + by (**Bézout**).
- **Congruence:** a ≡ b (mod n) ⇔ n | (a − b). The equation ax ≡ b (mod n) has a solution only if gcd(a, n) | b.
- **Fermat's little theorem:** if p is prime and p ∤ a, then aᵖ⁻¹ ≡ 1 (mod p). Its generalisation by **Euler**: if gcd(a, n) = 1, then a^φ(n) ≡ 1 (mod n); φ(p) = p − 1.

## Linear algebra

- **Determinant:** det(AB) = det(A)·det(B), det(Aᵀ) = det(A), and for an n×n matrix det(kA) = kⁿ·det(A). A is invertible only if det(A) ≠ 0.
- **2×2 inverse:** for A = [a b; c d], A⁻¹ = (1/(ad − bc))·[d −b; −c a].
- **Linear systems:** Ax = b has a unique solution when det(A) ≠ 0 (Cramer's rule applies). The homogeneous system Ax = 0 has a non-zero solution only if det(A) = 0.
- **Rank and dimension:** for A with n columns, rank(A) + nullity(A) = n.
- **Eigenvalues:** the roots of det(A − λI) = 0; their product is det(A) and their sum is the trace of A.

## Algebraic structures

- **Group:** the operation is closed and associative, has an identity, and every element has an inverse. If it is also commutative, it is an **abelian group**.
- **Examples:** (ℤ, +) is a group; (ℤ, ·) is not (2 has no inverse); (ℤₙ, +) is a cyclic group.
- **Lagrange's theorem:** in a finite group the order of a subgroup divides the order of the group, so every group of prime order is cyclic.

## Commonly confused

- A *symmetric* relation has aRb ⇒ bRa; an *antisymmetric* one has aRb and bRa ⇒ a = b. A relation can satisfy both.
- *GCD* is the greatest common divisor, *LCM* the least common multiple; their product equals a·b only for two numbers.
- *det(kA)* equals kⁿ·det(A), not *k·det(A)*.

## Study tip

For group questions check the four axioms in order and find the first one that fails; in number theory reduce large powers with Fermat or Euler. Both give you a fast, reliable routine.
