# Step 20.8 — Greek Coefficient Labels

## Summary
Updated the Abstract Vector Spaces insight panel so the scalar coefficients are displayed as the intended Greek symbols `α` and `β` instead of being visually converted to `A` and `B` by uppercase styling.

## Changes
- Added a dedicated CSS class for Greek coefficient labels.
- Disabled uppercase transformation for the `α` and `β` labels in the insight/stat cards.
- Preserved the existing layout and numeric values.

## Files changed
- `frontend/src/components/InsightPanel.jsx`
- `frontend/src/index.css`
- `README_STEP20_8_GREEK_COEFFICIENT_LABELS.md`
