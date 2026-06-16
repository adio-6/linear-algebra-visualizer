# Step 20.34 — Dynamic w in Change of Basis

## What changed
- In **Change of Basis**, `w` is now calculated as `w = αu + βv`.
- The displayed coordinate vector `[w]B` now updates according to the current coefficients: `[w]B = (α, β)`.
- The `α` and `β` controls are enabled in Change of Basis because they represent the coordinates of `w` in the new basis.
- `α` and `β` remain disabled in Span/Basis because that concept focuses on the whole span, not one selected vector.

## Files updated
- `frontend/src/components/VectorInput.jsx`
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/Canvas2D.jsx`
- `frontend/src/components/Canvas3D.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open **Change of Basis**.
2. Change `α` and `β`.
3. Verify that `w` changes on the graph.
4. Verify that `[w]B` in Live Insight changes from `(1, 1)` to the current `(α, β)`.
5. Open **Span/Basis** and verify that `α` and `β` are still disabled there.
