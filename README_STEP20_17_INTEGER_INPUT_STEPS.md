# Step 20.17 — Integer Step for Abstract Object Inputs

## What changed
- Polynomial coefficient inputs now increment/decrement by 1 when using the number input arrows.
- Matrix entry inputs now increment/decrement by 1 when using the number input arrows.

## Why
This makes editing values simpler and avoids half-step jumps in the abstract vector spaces controls.

## How to test
1. Open Abstract Vector Spaces → Polynomials.
2. Use the arrow controls in p(x) and q(x) coefficient inputs and verify values change by 1.
3. Open Abstract Vector Spaces → Matrices.
4. Use the arrow controls in Matrix A and Matrix B entries and verify values change by 1.
