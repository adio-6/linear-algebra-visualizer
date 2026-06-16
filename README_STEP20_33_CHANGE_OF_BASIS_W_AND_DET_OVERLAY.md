# Step 20.33 — Change of Basis: w vector and determinant overlay

## What changed

### Change of Basis Live Insight
- Shows the new basis explicitly as `B = {u, v}`.
- Shows whether the basis is valid based on the independence of `u` and `v`.
- Shows the space spanned by the two vectors:
  - In 2D: `R²` or `line`.
  - In 3D: `plane in R³`, `line`, or `{0}`.
- Adds a sample vector:
  - `w = u + v`
  - `[w]B = (1, 1)`

### Graph changes
- Adds a labeled vector `w` in the Change of Basis visualization.
- In 2D, `det([u v])` is now displayed in the top-left graph overlay, alongside the graph labels.
- The previous separate determinant/basis-area card under the graph was removed for Change of Basis.

### Input cleanup
- `α` and `β` are disabled and greyed out in Change of Basis because they are not currently used as editable coordinates in this concept.

## Files updated
- `frontend/src/components/VectorInput.jsx`
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/Canvas2D.jsx`
- `frontend/src/components/Canvas3D.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open **Change of Basis** in 2D.
2. Verify that `u`, `v`, and `w` are shown on the graph.
3. Verify that `det([u v])` appears in the top-left overlay.
4. Verify that no separate basis-area card appears under the graph.
5. Check Live Insight for `B = {u, v}`, `Basis valid?`, `span{u,v}`, `w`, and `[w]B = (1, 1)`.
6. Switch to 3D and verify the span readout describes the spanned subspace.
7. Verify that `α` and `β` are disabled in Change of Basis but remain active in Linear Combination.
