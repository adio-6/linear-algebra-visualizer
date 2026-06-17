# Step 20.38 — Rotate Preset Cycle

## What changed
The **Rotate** preset now advances through multiple rotation angles every time it is clicked instead of always applying the same fixed rotation matrix.

## Rotation sequence
Repeated clicks cycle through:

```txt
45° → 90° → 135° → 180° → 225° → 270° → 315° → 0° / Identity → 45° ...
```

## 2D behavior
In 2D, the matrix becomes the standard 2×2 rotation matrix for the current angle.

## 3D behavior
In 3D, the matrix rotates in the x-y plane around the z-axis, while z remains unchanged.

## Files updated
- `frontend/src/store/useVisualizerStore.js`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## QA
1. Open a matrix-based concept such as Linear Transformation.
2. Click **Rotate** repeatedly.
3. Verify that the matrix values and visualization rotate through additional angles.
4. Confirm that after 315° the next click returns to the identity/original matrix.
