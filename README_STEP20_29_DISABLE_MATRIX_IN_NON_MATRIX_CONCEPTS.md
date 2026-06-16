# Step 20.29 — Disable Matrix A in Non-Matrix Concepts

## What changed

Matrix A is now disabled in concepts where it is not mathematically relevant:

- Linear Combination
- Span / Basis
- Change of Basis
- Abstract Vector Spaces

Matrix A remains active only in concepts where the matrix is central:

- Linear Transformation
- Determinant
- Eigenvectors

## UI changes

- The Matrix A input panel is greyed out and disabled in non-matrix concepts.
- The preset matrix buttons are also disabled in those concepts.
- A short hint explains that Matrix A is not used in the current concept.

## Visualization changes

- In Span / Basis and Change of Basis, the 2D and 3D visualizations no longer use Matrix A to transform the vectors.
- The graph focuses on the relevant vectors `u` and `v`.
- Transformed basis vectors such as `î`, `ĵ`, and `A·eᵢ` are shown only when Matrix A is relevant.

## Live Insight changes

- Span / Basis and Change of Basis no longer show determinant, invertibility, inverse matrix, or transformation type.
- Instead, Live Insight shows information based on `u` and `v`, including whether the vectors are independent and the area of the parallelogram they form.

## How to test

1. Open Linear Transformation and verify Matrix A is active.
2. Open Determinant and verify Matrix A is active.
3. Open Eigenvectors and verify Matrix A is active.
4. Open Linear Combination and verify Matrix A is greyed out and disabled.
5. Open Span / Basis and verify Matrix A is greyed out and the graph uses only `u` and `v`.
6. Open Change of Basis and verify Matrix A is greyed out and Live Insight focuses on `u` and `v`.
7. Open Abstract Vector Spaces and verify the main Matrix A panel is greyed out, while the internal Abstract → Matrices editor still works.
