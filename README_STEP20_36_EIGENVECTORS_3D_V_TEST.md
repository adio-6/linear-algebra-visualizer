# Step 20.36 — Eigenvectors 3D v-test visualization

## What changed
- Added the original vector `v` to the **3D Eigenvectors** scene as a semi-transparent reference vector.
- Kept `A·v` as the solid transformed vector.
- Added a guide line through `v` so users can visually compare whether `A·v` lies on the same line.
- Removed the old “3D eigenvectors will be expanded later” message.
- Added Live Insight checks for:
  - whether `v` and `A·v` are collinear;
  - whether `v` is an eigenvector;
  - the value of `λ` when the test is true.

## Files updated
- `frontend/src/components/Canvas3D.jsx`
- `frontend/src/components/Visualization.jsx`
- `frontend/src/components/InsightPanel.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open **Eigenvectors**.
2. Switch to **3D**.
3. Verify that both `v` and `A·v` are visible.
4. Verify that the guide line through `v` is visible.
5. Change Matrix A and vector `v`.
6. Verify the Live Insight eigenvector status and `λ` update accordingly.
