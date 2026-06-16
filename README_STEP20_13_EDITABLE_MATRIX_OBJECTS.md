# Step 20.13 — Editable Matrix Objects

## What changed
- Added editable 2×2 matrices in Abstract Vector Spaces → Matrices.
- The user can change the entries of A and B.
- The result αA + βB updates immediately.
- A Reset button restores the default abstract polynomial and matrix objects.
- Matrix object values are included in the live sync snapshot.

## Pedagogical note
In this view, the matrix itself is treated as a vector-space object. The purpose is not to show the matrix acting as a transformation on a grid, but to show that matrices of the same size can be added and multiplied by scalars entry by entry.

## How to test
1. Open Abstract Vector Spaces.
2. Choose Matrices.
3. Change entries in A and B.
4. Change α and β.
5. Verify that αA + βB updates immediately.
6. In Live Session, verify that lecturer changes sync to the student view.
