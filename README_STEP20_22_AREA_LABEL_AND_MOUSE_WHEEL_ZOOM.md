# Step 20.22 — Area Label and Mouse Wheel Zoom

## What changed
- The 2D area information card now displays `AREA = value` instead of `|det(A)| = value`.
- Added mouse wheel zoom support to the 2D canvas.
- The existing `+`, `−`, and `Reset` zoom buttons remain available.

## How to test
1. Open a 2D visualization, such as Determinant or Linear Transformation.
2. Verify that the area information below the graph appears as `AREA = ...`.
3. Place the mouse over the 2D canvas and scroll the mouse wheel.
4. Verify that scrolling up zooms in and scrolling down zooms out.
5. Verify that the zoom percentage indicator updates and that the Reset button returns zoom to 100%.
