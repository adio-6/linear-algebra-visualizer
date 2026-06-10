# Linear Algebra Visualizer — React Step 3

This is the third React migration step from the original single-file HTML prototype.

## What works in Step 3

- React + Vite app skeleton
- Original visual layout and CSS
- Matrix/vector inputs connected to React state
- Mathematical calculations in `src/math/linearAlgebra.js`
- Live `InsightPanel`
- Real Canvas 2D rendering in `src/components/Canvas2D.jsx`
- 2D concepts: transformation, determinant, linear combination, eigenvectors, span, basis
- Basic animation from identity matrix to the selected matrix

## Still intentionally not implemented

- React Three Fiber / full 3D rendering
- Socket.io / backend / real-time rooms
- Production deployment

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL, usually:

```txt
http://localhost:5173/
```
