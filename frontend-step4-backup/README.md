# Linear Algebra Visualizer — React Step 4

This version adds:

- React Router pages:
  - `/` Home page
  - `/lecturer` full lecturer demo
  - `/student` student join form
  - `/student/:code` read-only student room shell
- Zustand global store for the visualizer state
- Existing Canvas2D and math logic from Step 3

Still intentionally not included:

- Backend
- Socket.io
- Canvas3D / React Three Fiber
- Real room validation

## Run

```bash
npm install
npm run dev
```

Open:

- http://localhost:5173/
- http://localhost:5173/lecturer
- http://localhost:5173/student
- http://localhost:5173/student/ABC123


## Step 4 update — Student Practice View

`/student/:code` is no longer read-only. Students can now change the concept, matrix, vectors, alpha/beta, speed, and run the animation locally in their own browser. There is still no backend or Socket.io sync in this step. Future work can add a toggle between Follow Lecturer and Practice Mode.
