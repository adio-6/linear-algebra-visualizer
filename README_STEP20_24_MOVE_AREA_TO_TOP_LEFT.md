# Step 20.24 — Move 2D Area Readout Near Top-Left Info Panel

## What changed
- The 2D area readout is now shown as `AREA = value` in the top-left overlay area of the graph.
- The area value appears together with the existing 2D information labels instead of appearing as a separate card below the canvas.
- The readout is shown only for concepts where area is relevant, such as Linear Transformation and Determinant.

## Why
The previous placement separated the area value from the visualization. The new placement keeps it visually connected to the graph while avoiding overlap with vectors, axes, or the parallelogram in the middle of the canvas.

## How to test
1. Open the app and choose a 2D view.
2. Select Linear Transformation or Determinant.
3. Verify that `AREA = value` appears in the top-left overlay area.
4. Verify that the value does not appear in the center of the graph or as a separate card below the canvas.
5. Use the 2D zoom buttons and mouse wheel zoom and verify that they still work.
6. Move the mouse outside the graph and verify that the page scrolls normally.
