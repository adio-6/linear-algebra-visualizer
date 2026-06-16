# Step 20.19 — Adaptive Canvas Zoom

## What changed
- Added adaptive scaling to the 2D visualization canvas.
- The canvas now estimates the important displayed points, such as transformed basis vectors and displayed vectors, and zooms out when needed.
- This prevents matrix entries such as 3–8 from immediately pushing the visualization outside the visible area.

## Notes
- The change affects the 2D visualization only.
- The α/β sliders and input behavior were not changed.

## How to test
1. Open a 2D concept such as Linear Transformation or Determinant.
2. Enter matrix values such as 3, 5, or 8.
3. Confirm that the transformed vectors/basis remain visible.
4. Return to the identity matrix and confirm the default visualization is still readable.
