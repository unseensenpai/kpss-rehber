---
title: "Time Series"
subject: zaman-serileri
state: draft
subtopics:
  - Components of a time series
  - Additive and multiplicative models
  - Moving averages and exponential smoothing
  - Stationarity, unit roots and differencing
  - Autocorrelation and partial autocorrelation
  - AR, MA, ARMA and ARIMA models
  - The Box–Jenkins approach and forecast errors
keyConcepts: [trend, seasonality, cyclical component, irregular component, moving average, exponential smoothing, Holt-Winters, stationarity, unit root, Dickey-Fuller test, white noise, autocorrelation function, partial autocorrelation function, ARIMA model, Ljung-Box test, MAPE]
questionStyle: "Recognising the components or model of a series; identifying the AR or MA order from ACF and PACF patterns; making a one-step-ahead forecast with exponential smoothing"
sourceType: osym-guide
sourceYear: 2026
verified: true
document: kpss-lisans-2026
updated: 2026-10-28
---

## Core idea

A time series (*zaman serisi*) is a sequence of observations of the same variable at equal intervals; the observations are not independent, and that dependence is used to forecast the future. The test has **2 questions**. They usually ask you to tell components apart, check stationarity, or choose a model from ACF and PACF patterns.

## Components and decomposition

- **Trend (T):** long-run upward or downward movement.
- **Seasonality (S):** fluctuation that repeats regularly within a year (months, quarters).
- **Cyclical component (C, *konjonktür*):** business-cycle waves longer than a year, with irregular length.
- **Irregular component (I):** the random, unpredictable part.
- **Additive model** Y = T + S + C + I (seasonal amplitude is constant); **multiplicative model** Y = T × S × C × I (seasonal effect grows with the level of the series).

## Smoothing methods

- **Moving average:** smooths short-term fluctuations; if its length equals the season length, it removes seasonality.
- **Simple exponential smoothing:** Fₜ₊₁ = αYₜ + (1 − α)Fₜ, 0 < α < 1. A larger α puts more weight on the latest observation. It suits series without trend or seasonality.
- **Holt's** method models trend; **Holt–Winters** models trend and seasonality together.

## Stationarity and ARIMA

- **Weak stationarity:** constant mean and variance; the covariance between two observations depends only on the lag between them.
- **White noise:** uncorrelated shocks with zero mean and constant variance.
- **Unit root:** the typical cause of non-stationarity; in the **Dickey–Fuller** test the null hypothesis is "there is a unit root". Stationarity is reached by **differencing**; the number of differences is the d in ARIMA.
- **AR(p):** the ACF dies down gradually, the **PACF cuts off after lag p**. AR(1) is stationary if |φ| < 1.
- **MA(q):** the **ACF cuts off after lag q**, the PACF dies down gradually.
- **ARMA(p, q):** both ACF and PACF die down. **ARIMA(p, d, q):** an ARMA applied to a series differenced d times.
- **Box–Jenkins:** identification → estimation → diagnostic checking (are the residuals white noise? **Ljung–Box** test) → forecasting.
- **Error measures:** MAE, MSE and MAPE; because MAPE is a percentage, it suits comparing series on different scales.

## Commonly confused

- *Seasonality* repeats within a year with a fixed period; the *cyclical component* spans years and has irregular length.
- The signature of an *AR* model is a cut-off in the PACF; that of an *MA* model is a cut-off in the ACF.
- In an *additive* model the seasonal effect is constant in units; in a *multiplicative* model it is constant as a ratio.

## Study tip

Write the ACF and PACF patterns in a small table (AR: PACF cuts off, MA: ACF cuts off, ARMA: both die down). In this two-question subject, that table plus the component definitions covers most questions.
