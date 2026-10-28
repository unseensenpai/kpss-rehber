---
title: "Geometry"
subject: mat-geometri
state: draft
subtopics:
  - Axiomatic geometry and non-Euclidean geometries
  - Vectors, dot and cross products
  - Lines and planes in space
  - Conics (ellipse, hyperbola, parabola)
  - Transformations and their matrices
  - Differential geometry of curves
keyConcepts: [parallel postulate, hyperbolic geometry, spherical geometry, dot product, cross product, scalar triple product, normal vector, eccentricity, focus and directrix, isometry, orthogonal matrix, curvature, torsion, Frenet formulas]
questionStyle: "Computing distances, angles and intersections of lines and planes in space; finding the elements of a conic; computing the curvature or torsion of a curve"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: meb-ags-2026
updated: 2026-10-28
---

## Core idea

Geometry (*geometri*) at the high-school teacher level studies figures in the language of **coordinates and vectors**: as you move from the plane to space and from lines to conics and curves, the calculations rest on vector algebra. The Mathematics ÖABT has **10 questions** on it. Most concern lines and planes in space, the foci and eccentricity of a conic, or the curvature of a space curve; conceptual questions on axiomatic geometry and transformations also appear.

## Axiomatic foundations

- **Parallel postulate:** in Euclidean geometry exactly one parallel passes through a point not on a line, and the angles of a triangle sum to 180°.
- In **hyperbolic geometry** there are infinitely many parallels and the angle sum is less than 180°; in **spherical (elliptic) geometry** there are no parallels and the sum exceeds 180°.

## Vectors, lines and planes

- **Dot product:** u · v = |u|·|v|·cos θ; for non-zero vectors u · v = 0 ⇔ they are perpendicular.
- **Cross product:** u × v is perpendicular to both u and v; |u × v| is the area of the parallelogram they span.
- **Scalar triple product:** u · (v × w) is the signed volume of the parallelepiped spanned by the three vectors; if it is zero they are coplanar.
- **Plane:** the plane ax + by + cz + d = 0 has normal vector (a, b, c). The distance from (x₀, y₀, z₀) is |ax₀ + by₀ + cz₀ + d| / √(a² + b² + c²).
- **Line:** the line through (x₀, y₀, z₀) with direction (a, b, c) is (x − x₀)/a = (y − y₀)/b = (z − z₀)/c. The angle between two planes is the angle between their normals.

## Conics

- **Ellipse:** x²/a² + y²/b² = 1 (a > b), c² = a² − b², eccentricity e = c/a < 1. The sum of distances to the foci is 2a.
- **Hyperbola:** x²/a² − y²/b² = 1, c² = a² + b², e > 1, asymptotes y = ±(b/a)x. The absolute difference of distances to the foci is 2a.
- **Parabola:** y² = 4px; focus (p, 0), directrix x = −p, e = 1. Every point is equidistant from the focus and the directrix.

## Transformations and curves

- **Isometries** preserve distance; linear isometries fixing the origin have **orthogonal** matrices (AᵀA = I, det A = ±1). det A = 1 means a rotation, det A = −1 involves a reflection.
- **Rotation matrix by angle θ:** [cos θ −sin θ; sin θ cos θ].
- **Curvature:** for a plane curve y = f(x), κ = |y''| / (1 + (y')²)^(3/2). For a space curve r(t), κ = |r' × r''| / |r'|³; a circle of radius r has curvature 1/r.
- **Torsion:** τ = (r' × r'') · r''' / |r' × r''|²; plane curves have τ = 0.
- **Frenet formulas** (with respect to arc length): T' = κN, N' = −κT + τB, B' = −τN.

## Commonly confused

- The *dot product* gives a number, the *cross product* a vector; perpendicularity makes the first zero, parallelism makes the second the zero vector.
- For an *ellipse* c² = a² − b²; for a *hyperbola* c² = a² + b².
- *Curvature* measures how a curve bends within its plane; *torsion* measures how it twists out of that plane.

## Study tip

In space questions turn everything into vectors: find the normal of each plane and the direction of each line; angle, perpendicularity and distance questions then reduce to dot and cross products of those vectors.
