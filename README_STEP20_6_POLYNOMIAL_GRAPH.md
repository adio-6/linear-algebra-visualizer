# Step 20.6 — Polynomial Graph Visualization

This step expands the `Abstract Vector Spaces` concept by adding a graph view to the `Polynomials` mode.

## What changed

- Added a polynomial graph inside `Abstract Vector Spaces → Polynomials`.
- The graph displays three curves:
  - `p(x)`
  - `q(x)`
  - `r(x) = αp(x) + βq(x)`
- The graph updates immediately when the user changes:
  - coefficients of `p(x)`
  - coefficients of `q(x)`
  - scalar α
  - scalar β
- The graph uses SVG inside the existing React component, so no new frontend library is required.
- The graph is local to the visualization layer and does not require backend changes.

## Educational purpose

The polynomial graph adds a visual representation to the abstract vector space example. It helps students understand that although polynomials are abstract algebraic objects, they can still be manipulated through vector-space operations and visualized as functions.

## Live session behavior

Polynomial coefficients and scalar values were already included in the synchronized visualization state. Therefore, when a lecturer changes the polynomial examples or α/β during a live session, connected students see the updated polynomial expressions and graph.
