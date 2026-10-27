---
title: "Multivariate Analysis"
subject: cok-degiskenli-analizler
state: draft
subtopics:
  - Mean vector, covariance and correlation matrices
  - Multivariate normal distribution and Mahalanobis distance
  - Hotelling's T² and MANOVA
  - Principal component analysis
  - Factor analysis
  - Discriminant analysis
  - Cluster analysis
keyConcepts: [covariance matrix, eigenvalue, Mahalanobis distance, Hotelling's T², Wilks' lambda, principal component, explained variance, Kaiser criterion, factor loading, communality, varimax rotation, KMO, Bartlett's test of sphericity, discriminant function, k-means, dendrogram]
questionStyle: "Choosing the multivariate method that fits a research aim; computing the share of variance explained from eigenvalues; interpreting factor and cluster output"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Multivariate analysis (*çok değişkenli analizler*) treats several variables together and uses the structure of their relationships. Methods fall into two families: **dependence methods** (a dependent and independent split: MANOVA, discriminant analysis, canonical correlation) and **interdependence methods** (no split: principal components, factor and cluster analysis). The test has **4 questions**; they usually ask you to choose a method for a stated aim or to interpret some output.

## Basic structures and tests

- **Covariance matrix Σ:** symmetric, with variances on the diagonal. The **correlation matrix** has 1s on the diagonal and is preferred when variables are measured in different units.
- **Mahalanobis distance:** D² = (x − μ)ᵀ Σ⁻¹ (x − μ); it accounts for differences in scale and for correlation between variables, and is used to detect multivariate outliers.
- **Hotelling's T²:** the multivariate counterpart of the t test; it compares mean vectors.
- **MANOVA:** tests group differences on several dependent variables at once; the smaller **Wilks' lambda**, the larger the difference between groups.

## Dimension reduction

- **Principal component analysis:** produces uncorrelated linear combinations of the variables. The variances of the components are the **eigenvalues** of the covariance (or correlation) matrix; component k explains λₖ / ∑λᵢ of the total. For a correlation matrix the eigenvalues sum to the number of variables.
- **How many components?** keep eigenvalues above 1 (**Kaiser criterion**), use a scree plot, or aim for a target cumulative share of variance.
- **Factor analysis:** explains the shared variance of observed variables with a few latent factors. A **factor loading** shows the relationship between a variable and a factor; **communality** is the part of a variable's variance explained by the factors.
- **Suitability:** the KMO value should be high and **Bartlett's test of sphericity** significant (the correlation matrix is not an identity matrix).
- **Rotation:** varimax is orthogonal (factors stay uncorrelated); oblimin and promax are oblique (factors may correlate).

## Classification and grouping

- **Discriminant analysis:** builds the linear function that best separates units whose groups are known in advance, and assigns new units to groups.
- **Cluster analysis:** groups are not known in advance; similar units are put together. **Hierarchical** methods (single, complete, average linkage, Ward) show the result as a **dendrogram**; **k-means** is a non-hierarchical method where the number of clusters is set in advance.
- **Canonical correlation:** looks for the strongest linear relationship between two sets of variables.

## Commonly confused

- *Principal components* summarise total variance; *factor analysis* explains shared variance with latent constructs.
- In *discriminant analysis* the groups are known beforehand; in *cluster analysis* they are found from the data.
- *Orthogonal rotation* keeps factors uncorrelated; *oblique rotation* allows correlation between factors.

## Study tip

Write one line for each method: aim, input, key output. In method-choice questions, first ask whether there is a dependent variable, then whether the groups are known in advance.
