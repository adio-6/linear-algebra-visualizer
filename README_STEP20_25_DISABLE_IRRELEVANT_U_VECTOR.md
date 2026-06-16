# Step 20.25 — Disable Irrelevant u Vector Inputs

## What changed
- The `u` vector input is now greyed out and disabled in concepts where it is not part of the visualization logic.
- `u` remains editable in concepts where two vectors are needed: Linear Combination, Span/Basis, and Change of Basis.

## Why
In Linear Transformation, Determinant, and Eigenvectors, the main inputs are the matrix `A` and vector `v`. Showing `u` as editable in those modes made it look like it affected the visualization, even when it did not.

## How to test
1. Open Linear Transformation and verify the `u` row is greyed out and cannot be edited.
2. Open Determinant and Eigenvectors and verify the same behavior.
3. Open Linear Combination, Span/Basis, or Change of Basis and verify `u` is editable again.
