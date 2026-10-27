---
title: "Regression Analysis"
subject: regresyon-analizi
state: draft
subtopics:
  - Simple linear regression and least squares
  - Coefficient of determination and decomposition of variance
  - Inference for coefficients
  - Multiple regression and adjusted R²
  - Classical assumptions and the Gauss–Markov theorem
  - Multicollinearity, heteroscedasticity and autocorrelation
  - Dummy variables and logistic regression
keyConcepts: [least squares, regression coefficient, residual, coefficient of determination, adjusted R², standard error, F test, BLUE, multicollinearity, VIF, heteroscedasticity, autocorrelation, Durbin-Watson, dummy variable, logistic regression, odds ratio]
questionStyle: "Computing the regression line and R² from summary statistics; interpreting coefficients and tests in output; recognising a violated assumption and the matching test"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

Regression analysis (*regresyon analizi*) models the relationship between a dependent variable (Y) and one or more explanatory variables (X) with an equation; the aim is both to measure the relationship and to predict. The test has **4 questions**. They usually ask you to compute coefficients and R² from summary values, interpret output, or say which assumption is violated.

## Simple linear regression

- **Model:** Y = β₀ + β₁X + ε.
- **Ordinary least squares (OLS):** minimise the sum of squared residuals ∑eᵢ². b₁ = Sxy / Sxx = ∑(x − x̄)(y − ȳ) / ∑(x − x̄)², b₀ = ȳ − b₁x̄.
- The OLS line passes through (x̄, ȳ); in a model with an intercept the residuals sum to zero.
- b₁ = r · (s_y / s_x); the slope has the same sign as the correlation.
- **Interpretation:** b₁ is the expected average change in Y for a one-unit increase in X.

## Fit and inference

- **Decomposition of variance:** SS_total = SS_regression + SS_error.
- **R² = SS_regression / SS_total:** the share of variability in Y explained by the model; in simple regression R² = r².
- **Coefficient test:** t = b₁ / se(b₁); error df is n − 2 in simple regression and n − k − 1 in multiple regression with k explanatory variables.
- **F test:** F = MS_regression / MS_error; tests the model as a whole. In simple regression F = t².
- **Adjusted R²** = 1 − (1 − R²)(n − 1)/(n − k − 1); it can fall when a useless variable is added, whereas R² never falls when a variable is added.

## Assumptions and problems

- **Gauss–Markov theorem:** under linearity, zero-mean errors, constant variance, no autocorrelation and no perfect collinearity, OLS estimators are **BLUE** (minimum variance among linear unbiased estimators). The t and F tests additionally assume normal errors.
- **Multicollinearity:** strong relationships among explanatory variables; standard errors inflate. **VIF = 1/(1 − Rⱼ²)**; values above 10 are usually treated as a serious problem.
- **Heteroscedasticity:** the error variance is not constant; tested with Breusch–Pagan or White, handled with weighted least squares or robust standard errors.
- **Autocorrelation:** successive errors are related (mostly in time-series data). The **Durbin–Watson** statistic lies between 0 and 4; a value near 2 indicates no first-order autocorrelation.

## Special models

- **Dummy variable:** for a qualitative variable with m categories, a model with an intercept uses m − 1 dummies; using m dummies causes the **dummy variable trap** (perfect collinearity).
- **Logistic regression:** used when Y is binary; it models the logit ln[p/(1 − p)], and exp(β) gives the odds ratio.
- **Log-log model:** the slope coefficient is read as an elasticity.

## Commonly confused

- *Correlation* measures the strength of a relationship symmetrically; *regression* separates dependent and independent variables and gives a prediction equation.
- *R²* never decreases as variables are added; *adjusted R²* can.
- *Heteroscedasticity* is a changing error variance; *autocorrelation* is errors being related to each other.

## Study tip

Practise computing b₁, b₀, r and R² from Sxx, Sxy and Syy in one go a few times; then memorise "symptom, test, remedy" for each assumption violation.
