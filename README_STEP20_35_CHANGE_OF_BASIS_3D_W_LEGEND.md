# Step 20.35 — Change of Basis 3D W Legend

## What changed
Added **w = αu + βv** to the **3D legend** for the **Change of Basis** concept.

## Why
In Change of Basis, the 3D scene already shows the vector **w**, but the legend only listed **u** and **v**. This update makes the legend consistent with the scene and with the Live Insight/readout.

## Files updated
- `frontend/src/components/Visualization.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open the app.
2. Switch to **Change of Basis**.
3. Switch to **3D** view.
4. Confirm the legend includes:
   - `v`
   - `u`
   - `w = αu + βv`
5. Change `α` and `β` and verify the displayed `w` in the scene still corresponds to the legend entry.
