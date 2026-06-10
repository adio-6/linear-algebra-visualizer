# Step 14.1 — Vector Input Responsive Fix

This update fixes a responsive layout issue in the **Vectors** panel.

## What changed

- `VectorInput.jsx` now groups each vector row using a stable wrapper:
  - vector label (`v` / `u`)
  - responsive vector value grid
- Vector inputs now use `min-width: 0` and `width: 100%` to avoid overflow.
- The vector values grid now adapts to available width.
- Alpha and beta sliders remain aligned inside the card.
- No math logic, Zustand state, Socket.io logic, Canvas2D, or Canvas3D code was changed.

## Files changed

- `frontend/src/components/VectorInput.jsx`
- `frontend/src/index.css`

## How to test

1. Run the frontend.
2. Open the lecturer page.
3. Resize the browser to medium widths.
4. Check the **Vectors** section.
5. Verify that `v`, `u`, `alpha`, and `beta` stay aligned and do not overflow.
6. Switch between 2D and 3D and verify that vector inputs remain usable.
