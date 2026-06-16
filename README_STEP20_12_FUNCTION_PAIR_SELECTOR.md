# Step 20.12 — Function Pair Selector

## What changed
- Added a function pair selector under `Abstract Vector Spaces → Functions`.
- The user can now choose between:
  - `sin(x) / cos(x)`
  - `eˣ / e⁻ˣ`
  - `e⁻ˣ² / x·e⁻ˣ²`
- Polynomial function pairs were intentionally not added here because polynomials already have their own dedicated `Polynomials` view.

## Why
This expands the abstract vector spaces visualization and shows that many types of functions can behave like vectors under addition and scalar multiplication.

## How to test
1. Open the app and select `Abstract Vector Spaces`.
2. Choose `Functions`.
3. Change the `Function pair` selector.
4. Change α and β and verify that the formula and graph update.
5. Open a Live Session and verify that the lecturer's selected function pair syncs to the student screen.
