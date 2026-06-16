# Step 20.20 — 2D Zoom Controls

## What changed
- Added manual zoom controls to the 2D visualization.
- The 2D canvas still uses adaptive zoom to keep large matrix values visible, but users can now zoom in when labels or vectors appear too small.
- Added Zoom Out, percentage display, Zoom In, and Reset buttons.

## Why
Adaptive scaling keeps large values inside the canvas, but in some cases it makes labels harder to read. Manual 2D zoom gives the user control similar to the 3D view.

## How to test
1. Open any 2D concept.
2. Enter matrix values up to 8 and verify the visualization remains visible.
3. Use the + button to zoom in and check that labels become clearer.
4. Use − and Reset to return the view to a comfortable scale.
