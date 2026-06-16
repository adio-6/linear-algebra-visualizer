# Step 20.9 — Polynomial Editor Side-by-Side Layout

## What changed
- Updated the editable polynomial panel so `p(x)` and `q(x)` appear next to each other on wider screens.
- Kept a responsive fallback so the two editors stack vertically on narrower screens.

## Why
This makes the polynomial editor more compact and easier to compare visually.

## How to test
1. Open the abstract vector spaces view and choose the polynomial space.
2. In the `Edit Polynomials` panel, verify that `p(x)` and `q(x)` are displayed side by side on a wide screen.
3. Narrow the browser window and verify that they stack vertically without layout issues.
