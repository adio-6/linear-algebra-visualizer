# Step 20.30 — Determinant Focus Cleanup

## What changed

This update makes the **Determinant** concept focus only on the matrix `A` and its area/orientation meaning.

### Input panel
- Disabled and greyed out vector `v` in the Determinant concept.
- Disabled and greyed out scalar controls `α` and `β` in the Determinant concept.
- Existing `u` disabling remains unchanged for this concept.

### Canvas visualization
- Removed the `A·v` vector from the Determinant visualization.
- Removed the `A·v` label from the Determinant graph.
- Removed the `v → A·v` overlay chip from the Determinant view.
- Kept the matrix-transformed basis vectors and area/parallelogram display, because those are relevant to determinant.

### Live Insight
The Determinant Live Insight panel now focuses on:
- `det(A)`
- `AREA = |det(A)|`
- whether the matrix is invertible
- whether orientation is reversed

The determinant view no longer shows unrelated vector readouts or inverse-matrix details.

## Files updated
- `frontend/src/components/VectorInput.jsx`
- `frontend/src/components/Canvas2D.jsx`
- `frontend/src/components/Canvas3D.jsx`
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `frontend/src/index.css`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open the app and select **Determinant**.
2. Verify that `v`, `α`, and `β` are greyed out and disabled.
3. Verify that `A·v` is not shown on the 2D/3D graph and does not appear as a label.
4. Verify that the determinant parallelogram/area remains visible.
5. Verify that Live Insight displays `det(A)`, `AREA = |det(A)|`, invertibility, and orientation reversal.
6. Change Matrix A and verify that these determinant values update immediately.
7. Switch to **Linear Transformation** and verify that `A·v` still appears there.
