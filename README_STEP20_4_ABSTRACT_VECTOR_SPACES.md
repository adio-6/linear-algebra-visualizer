# Step 20.4 — Abstract Vector Spaces Visualization

This update adds a new concept to the visualizer: **Abstract Vector Spaces**.

## What changed

- Added a new concept button: `Abstract Vector Spaces`.
- Added an abstract space selector with three examples:
  - Polynomials
  - Functions
  - Matrices
- Added scalar controls for `α` and `β`.
- Added an abstract visualization panel showing the linear combination:
  - `αp(x) + βq(x)` for polynomials
  - `αf(x) + βg(x)` for functions
  - `αA + βB` for matrices
- Added a dedicated insight panel that explains that a vector can be any object that supports addition and scalar multiplication.
- Added Socket.io state sync support for the selected abstract space, so the lecturer can demonstrate this concept in a live session.

## Educational goal

The goal is to show that vectors are not only arrows in 2D or 3D space. Polynomials, functions and matrices can also behave like vectors when addition and scalar multiplication are defined.

## Testing checklist

- Select `Abstract Vector Spaces` from the concept list.
- Switch between Polynomials, Functions and Matrices.
- Change `α` and `β` and confirm that the result changes.
- Start a live session as lecturer and select Abstract Vector Spaces.
- Join as student and confirm that the selected abstract space is synced.
- Confirm that the regular 2D/3D visualizations still work for the other concepts.
