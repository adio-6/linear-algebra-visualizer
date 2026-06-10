# Linear Algebra Visualizer

Interactive classroom tool for teaching and learning linear algebra concepts through visual 2D/3D demonstrations and live lecturer-student synchronization.

The system lets a lecturer create a live session, demonstrate concepts such as linear transformations, determinants, span, basis, vector combinations and eigenvectors, and synchronize the visualization to students in real time. It also includes a live quiz flow where students answer questions and the lecturer sees class results and student status in real time.

## Main technologies

### Frontend
- React
- Vite
- Zustand
- Canvas2D
- React Three Fiber / Three.js
- Socket.io client

### Backend
- Node.js
- Express
- Socket.io
- In-memory rooms and quiz state

## Project structure

```txt
project/
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   ├── package.json
│   └── README.md
├── README.md
├── QA_CHECKLIST.md
├── PROJECT_SUMMARY.md
└── README_DEPLOYMENT.md
```

## Installation

Install dependencies once for each side.

### Backend

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
npm install
```

### Frontend

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
npm install
```

## Running the app

Use two CMD windows.

### CMD 1 — backend

Create a local env file once:

```cmd
copy .env.example .env
```

Then run:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
npm run dev
```

Expected message includes the backend port and allowed frontend origins.

### CMD 2 — frontend

Create a local env file once:

```cmd
copy .env.example .env
```

Then run:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
npm run dev
```

Open the app at:

```txt
http://localhost:5173
```

## Main pages

### Home

```txt
http://localhost:5173/
```

Entry page with links to Lecturer View and Student Join.

### Lecturer view

```txt
http://localhost:5173/lecturer
```

The lecturer can:
- Create a live room.
- Share the room code with students.
- Control the 2D/3D visualization.
- Sync visualization state to students.
- Trigger animations.
- Sync 3D camera movement.
- Open and manage live quizzes.
- View connected students and quiz answer status.

### Student join

```txt
http://localhost:5173/student
```

Students enter a nickname and room code.

### Student room

```txt
http://localhost:5173/student/:code
```

Students can use:
- Follow Lecturer mode — receives lecturer visualization updates.
- Practice Mode — local independent exploration.
- Live Quiz — answer class questions in real time.

## How to test Live Session

1. Run backend and frontend.
2. Open `/lecturer`.
3. Click `Start Live Session`.
4. Copy the generated room code.
5. Open `/student` in another browser tab.
6. Enter nickname and room code.
7. Confirm that the lecturer dashboard shows the student as connected.
8. Change the matrix, vector, concept, or 2D/3D mode on the lecturer page.
9. Confirm that the student updates in Follow Lecturer mode.
10. Switch the student to Practice Mode and confirm that local changes are not overwritten.

## How to test 3D sync

1. Start a live session and join with a student.
2. In the lecturer view, switch to 3D.
3. Rotate, pan, or zoom the 3D scene.
4. Confirm that the student sees the same camera movement in Follow Lecturer mode.
5. Switch the student to Practice Mode and confirm that lecturer camera updates no longer override the student view.

## How to test Live Quiz

1. Start a live session.
2. Join with one or more students.
3. In the lecturer view, click `Open Live Quiz`.
4. Confirm that the quiz appears on student screens.
5. Let students answer.
6. Confirm that the lecturer sees response counts and distribution.
7. Students can change answers until the lecturer clicks `Show Answer`.
8. Click `Show Answer`.
9. Confirm that correct/incorrect results are shown.
10. Click `Close Quiz` and confirm that the quiz closes for students.

## What to do if the backend stops

The app uses in-memory rooms. If the backend is stopped, all active rooms are deleted.

After backend restart:
- The lecturer will see that the old room no longer exists.
- The lecturer should click `Create New Room`.
- Students should return to the join screen and enter the new room code.

This behavior is expected because the current version does not use a database or persistence.

## Known limitations

- Rooms are stored in memory only.
- No database.
- No login/authentication.
- No persistent grades or quiz history.
- Deployment configuration has been prepared with `.env.example` files, but the app has not been deployed yet.
- No export to PDF/CSV.
- If the backend restarts, existing rooms are lost and a new room code is required.

## Deployment preparation

See `README_DEPLOYMENT.md` for local `.env` setup and future production deployment notes.

## Useful health check

Backend health endpoint:

```txt
http://localhost:3000/healthz
```

Expected response:

```json
{ "ok": true }
```


## Step 19 documentation

- [Step 19 — Persistent Quiz Library with PostgreSQL](./README_STEP19_PERSISTENT_QUIZ_LIBRARY.md)
