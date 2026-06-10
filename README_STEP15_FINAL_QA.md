# Step 15 — Manual QA + Final Bug Fixes

Step 15 is a final quality-assurance pass for the Linear Algebra Visualizer project.
It does not add a new major feature. The goal is to make sure the application is ready for demonstration or submission.

## What was checked

The following flows should be verified manually before a demo:

1. **Setup**
   - Backend starts with `npm run dev`.
   - Frontend starts with `npm run dev`.
   - `GET /healthz` returns a valid response.

2. **Lecturer flow**
   - Lecturer can open `/lecturer`.
   - `Start Live Session` creates a room.
   - Room code appears clearly and only once.
   - Student count updates when students join.
   - `Create New Room` works after backend restart.

3. **Student flow**
   - Student can open `/student`.
   - Empty nickname is blocked.
   - Invalid room code shows a clear error.
   - Valid room code navigates to `/student/:code`.
   - Student room page shows connected status.
   - `Change room` and `Home` remain clickable and visually aligned.

4. **Real-time visualization sync**
   - Concept, matrix, vector, 2D/3D mode, animation, and 3D camera sync from lecturer to students in Follow Lecturer mode.
   - Practice Mode is not overwritten by lecturer updates.

5. **Live Quiz**
   - Lecturer can open a live quiz.
   - Students receive and answer the quiz.
   - Students can change their answer before `Show Answer`.
   - Lecturer sees live distribution and student statuses.
   - `Show Answer` reveals correct/incorrect/no answer.
   - `Close Quiz` clears the quiz for all users.

6. **Error handling and recovery**
   - Backend off state shows clear connection warnings.
   - Backend restart is handled clearly.
   - Old room after backend restart is treated as expired.
   - Lecturer can create a new room.
   - Students are directed to rejoin with the new room code.

7. **Responsive layout**
   - Lecturer and student screens do not produce horizontal overflow.
   - Vector input stays aligned at medium widths.
   - Student navigation buttons stay aligned with the mode toggle.
   - Student Answers Panel remains readable.

## What was updated

- QA documentation was expanded for the final application state.
- Project summary was updated to include the final QA stage.
- No business logic was changed.
- No new feature was added.

## Smoke test before demo

Use this quick flow immediately before showing the project:

1. Start backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open lecturer view:
   ```text
   http://localhost:5173/lecturer
   ```

4. Click `Start Live Session`.

5. Open student view in another tab:
   ```text
   http://localhost:5173/student
   ```

6. Join with nickname and room code.

7. Verify:
   - student appears in lecturer dashboard
   - visualization sync works
   - Animate sync works
   - 3D camera sync works
   - Live Quiz works
   - Show Answer works
   - Close Quiz works

## Known limitations

The system is still a prototype and intentionally does not include:

- database persistence
- login/authentication
- saved grade history
- export tools
- deployment configuration
- room recovery with the same room code after backend restart

After backend restart, the lecturer should create a new room and students should join again using the new room code.
