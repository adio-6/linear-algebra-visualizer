# Step 20.32 — Span/Basis readout and coefficient cleanup

## What changed

This update improves the **Span / Basis** concept.

### Vector Readout
The Live Insight → Vector Readout section now explicitly shows what the vectors span:

- In 2D:
  - `span{u,v} = R²` when the vectors are linearly independent.
  - `span{u,v} = line` when the vectors are linearly dependent.
  - `{0}` when both vectors are zero.

- In 3D:
  - `span{u,v} = plane in R³` when the two vectors are independent.
  - `span{u,v} = line` when they are dependent and at least one is non-zero.
  - `{0}` when both vectors are zero.

### α / β controls
The scalar controls `α` and `β` are now disabled and greyed out in **Span / Basis**, because this view focuses on the entire span of `u` and `v`, not on one specific linear combination.

## Files updated
- `frontend/src/components/InsightPanel.jsx`
- `frontend/src/components/VectorInput.jsx`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## How to test
1. Open **Span / Basis** in 2D.
2. Choose independent vectors, for example `u=(1,0)`, `v=(0,1)`, and verify `span{u,v}=R²`.
3. Choose dependent vectors, for example `u=(1,1)`, `v=(2,2)`, and verify `span{u,v}=line`.
4. Switch to 3D and verify independent vectors show `plane in R³`.
5. Verify `α` and `β` are disabled in Span/Basis.
6. Switch to Linear Combination and verify `α` and `β` are still editable.
