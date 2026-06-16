# Step 20.11 — Polynomial Input Overflow Fix

## What changed
- Fixed the editable polynomial coefficient fields so the number inputs stay inside their dashed `p(x)` and `q(x)` cards.
- Kept `p(x)` and `q(x)` side by side on wider screens.
- On narrower screens, the layout remains responsive and readable.

## Why
The previous side-by-side layout made the input fields too wide, so they overflowed outside the card boundaries.

## How to test
1. Open `Abstract Vector Spaces`.
2. Choose `Polynomials`.
3. Check the `Edit Polynomials` panel.
4. Verify all coefficient inputs remain inside the `p(x)` and `q(x)` boxes.
5. Resize the browser and verify the layout stays readable.
