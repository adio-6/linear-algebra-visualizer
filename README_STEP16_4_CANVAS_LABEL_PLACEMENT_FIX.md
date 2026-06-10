# Step 16.4 — Canvas Label Placement Fix

## Goal

Improve the readability of vector labels in `Canvas2D`.

Before this fix, labels such as `u`, `v`, `A·v`, `α·u`, `β·v`, and `αu+βv` could overlap each other, sit directly on arrow heads, or become hard to read over the grid.

## What changed

Updated:

- `frontend/src/components/Canvas2D.jsx`

The fix adds:

- A small offset between arrow heads and labels.
- Different offsets for nearby labels in the Linear Combination view.
- A simple collision-avoidance mechanism using label bounding boxes.
- A small semi-transparent background behind each label.
- Boundary clamping so labels stay inside the canvas when possible.

## What did not change

No mathematical logic changed.

This fix does not change:

- Matrix calculations
- Vector calculations
- Linear combination logic
- Determinant logic
- Animation
- Student/Lecturer sync
- Canvas3D

## How to test

1. Run the backend and frontend as usual.
2. Open the lecturer screen.
3. Select `Linear Combination`.
4. Change `u`, `v`, `alpha`, and `beta` so the arrows become close to each other.
5. Verify that the labels are easier to read and do not sit directly on the arrow heads.
6. Test also:
   - Transformation
   - Span
   - Basis
   - Eigenvectors
   - Determinant
7. Resize the browser and verify that labels stay inside the canvas.

## Note

This is a UI/readability fix only.
