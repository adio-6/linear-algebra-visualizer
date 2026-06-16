# Step 20.26 — Linear Combination Color Separation

## What changed
- In `Canvas2D`, the final linear-combination vector `αu+βv` now uses the accent color.
- The intermediate vector `βv` keeps the existing vector color.
- This makes it easier to visually distinguish the intermediate contribution from the final result.

## Why
Previously `βv` and `αu+βv` appeared in very similar colors, which made the Linear Combination view harder to interpret.

## How to test
1. Open the app.
2. Choose the `Linear Combination` concept.
3. Verify that `βv` and `αu+βv` are drawn in clearly different colors.
4. Change `α`, `β`, `u`, and `v` and verify the color separation remains consistent.
