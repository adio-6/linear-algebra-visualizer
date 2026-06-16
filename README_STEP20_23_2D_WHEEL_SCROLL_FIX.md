# Step 20.23 — 2D Wheel Zoom Scroll Fix

## What changed
- Mouse wheel zoom in 2D now prevents page scrolling only when the pointer is over the 2D visualization area.
- Normal page scrolling still works when the pointer is outside the visualization.

## Why
This makes the 2D zoom feel like the 3D view: the wheel controls the graph only when interacting directly with the graph.

## Test
1. Open any 2D visualization.
2. Move the pointer over the graph and use the wheel: the graph should zoom and the page should not scroll.
3. Move the pointer outside the graph and use the wheel: the page should scroll normally.
