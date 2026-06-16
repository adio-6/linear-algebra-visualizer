# Step 20.15 — Matrix Input Containment Fix

## What changed
- Fixed the editable matrix layout in **Abstract Vector Spaces → Matrices**.
- Matrix A and Matrix B now stay inside the card instead of overflowing horizontally.
- The layout remains responsive: matrices can appear side-by-side when there is enough width and stack when space is limited.

## Files changed
- `frontend/src/index.css`
- `README.md`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open **Abstract Vector Spaces**.
2. Choose **Matrices**.
3. Verify that Matrix A and Matrix B input boxes remain inside the panel.
4. Resize the browser and confirm that the layout stays clean.
