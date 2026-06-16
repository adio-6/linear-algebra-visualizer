# Step 20.27 — Linear Combination Legend and Live Insight Alignment

## What changed

This update improves the clarity of the **Linear Combination** concept in the 2D visualization and the **Live Insight** panel.

### Canvas / legend changes
- The top-left 2D legend is now concept-aware for **Linear Combination**.
- Instead of a generic orange label, the legend now shows:
  - `v → βv`
  - `u → αu`
  - `αu + βv`
- The final combination entry uses the same accent color as the final combination vector in the graph.

### Live Insight changes
- The **Vector Readout** section now includes extra entries for the Linear Combination concept:
  - `u`
  - `αu`
  - `βv`
  - `αu + βv`
- Their text colors were aligned with the colors used in the graph to make the mapping easier to follow visually.

## Files updated
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open the app and switch to **Linear Combination** in 2D.
2. Verify that the top-left legend includes separate entries for `v → βv`, `u → αu`, and `αu + βv`.
3. Verify that `αu + βv` appears in a different color from `βv`.
4. Open the **Live Insight** panel and verify that the Vector Readout now includes `u`, `αu`, `βv`, and `αu + βv`.
5. Verify that the text colors in the readout match the colors shown in the graph.
6. Change `u`, `v`, `α`, and `β` and confirm the readout updates correctly.
