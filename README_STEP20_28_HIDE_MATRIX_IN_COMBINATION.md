# Step 20.28 — Hide Matrix and Basis Vectors in Linear Combination

## What changed

This update makes the **Linear Combination** concept clearer by removing matrix-related information from that view.

### Matrix input
- In **Linear Combination**, `Matrix A` is greyed out and disabled.
- Preset matrix buttons are also disabled.
- A short hint explains that Matrix A is not used in Linear Combination.

### 2D visualization
- The basis vectors `î = A·(1,0)` and `ĵ = A·(0,1)` are no longer shown in the graph for Linear Combination.
- Their top-left legend entries are also hidden.
- The graph focuses only on the relevant objects:
  - `u`
  - `v`
  - `αu`
  - `βv`
  - `αu + βv`

### Live Insight
- For **Linear Combination**, the Live Insight panel no longer displays determinant, invertibility, inverse matrix, or transformation type.
- Instead, it displays α, β, the operation `αu + βv`, and the relevant vector readout.

## Files updated
- `frontend/src/components/MatrixInput.jsx`
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/Canvas2D.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `frontend/src/index.css`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open the app and select **Linear Combination**.
2. Verify that Matrix A inputs and presets are greyed out and disabled.
3. Verify that `î` and `ĵ` do not appear in the graph.
4. Verify that the top-left legend shows only the relevant combination entries.
5. Verify that Live Insight does not show determinant, invertibility, or inverse matrix for Linear Combination.
6. Verify that changing `u`, `v`, `α`, and `β` still updates the graph and readout.
7. Switch to Linear Transformation and verify that Matrix A, `î`, `ĵ`, determinant and inverse matrix information still appear normally.
