# Step 20.5 — Editable Polynomial Objects

This step improves the Abstract Vector Spaces concept.

## What changed

- Added coefficient inputs for the polynomial example.
- The lecturer or student can edit both polynomials:
  - `p(x) = a + bx + cx²`
  - `q(x) = d + ex + fx²`
- The visual result updates immediately for:
  - `αp(x) + βq(x)`
- Added a Reset button that restores the default polynomial examples.
- Polynomial coefficients are included in the synchronized visualizer state, so the lecturer's polynomial edits are shared with students in a live session.

## Files updated

- `frontend/src/components/AbstractSpaceControls.jsx`
- `frontend/src/components/AbstractSpaceVisualizer.jsx`
- `frontend/src/store/useVisualizerStore.js`
- `frontend/src/index.css`

## QA

- Select **Abstract Vector Spaces**.
- Select **Polynomials**.
- Change coefficients of `p(x)` and `q(x)`.
- Verify the displayed polynomials and result update immediately.
- Change α and β and verify the linear combination updates.
- In a live session, verify lecturer polynomial coefficient changes appear on the student screen.
