# Step 20.31 — Eigenvector reference vector and coefficient cleanup

## What changed
- Added the input vector `v` back into the 2D Eigenvectors view as a semi-transparent purple vector.
- Kept `A·v` on the graph so the student can compare `v` with `A·v`.
- Disabled and greyed out `α` and `β` in the Eigenvectors concept because they are not used there.

## Why
The Eigenvectors view is easier to understand when the user can compare the original vector `v` with the transformed vector `A·v`. At the same time, `α` and `β` are not part of the eigenvector concept in this screen, so disabling them reduces noise.

## How to test
1. Open the Eigenvectors concept in 2D.
2. Verify that `v` appears as a semi-transparent purple vector.
3. Verify that `A·v` still appears as the solid transformed vector.
4. Change `v` and confirm both vectors update.
5. Verify that the `α` and `β` controls are disabled in Eigenvectors.
6. Switch to Linear Combination and verify `α` and `β` are active there.
