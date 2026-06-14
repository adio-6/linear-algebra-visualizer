# QA Checklist — Linear Algebra Visualizer

Use this checklist before a demo or submission.

## 1. Setup

- [ ] Backend dependencies installed with `npm install`.
- [ ] Frontend dependencies installed with `npm install`.
- [ ] Backend starts with `npm run dev`.
- [ ] Frontend starts with `npm run dev`.
- [ ] Backend health check works: `http://localhost:3000/healthz`.
- [ ] Frontend opens at `http://localhost:5173`.

## 2. Home page

- [ ] Home page loads without errors.
- [ ] `Open Lecturer View` navigates to `/lecturer`.
- [ ] `Join as Student` navigates to `/student`.

## 3. Lecturer flow

- [ ] Lecturer page loads.
- [ ] Clicking `Start Live Session` creates a room.
- [ ] Room code appears once, in the top live session area.
- [ ] Socket status shows connected.
- [ ] Students connected count starts at 0.
- [ ] Creating a new session still works.

## 4. Student flow

- [ ] Student join page loads.
- [ ] Empty nickname shows a clear error.
- [ ] Empty room code shows a clear error.
- [ ] Invalid room code shows a clear error.
- [ ] Valid room code navigates to `/student/:code`.
- [ ] Student room page shows connected status.
- [ ] Lecturer dashboard shows the student nickname.

## 5. Real-time visualization sync

- [ ] Lecturer changes concept and student updates in Follow Lecturer mode.
- [ ] Lecturer changes matrix and student updates.
- [ ] Lecturer changes vector and student updates.
- [ ] Lecturer changes alpha/beta and student updates.
- [ ] Lecturer switches between 2D and 3D and student updates.
- [ ] Lecturer clicks Animate and student animation starts.
- [ ] Student Practice Mode is not overwritten by lecturer state updates.

## 6. 2D visualization

- [ ] Canvas2D renders grid and vectors.
- [ ] Linear transformation view works.
- [ ] Determinant/parallelogram view works.
- [ ] Span/basis/vector combination views still render.
- [ ] Animation works in 2D.

## 7. 3D visualization

- [ ] Canvas3D renders without crashing.
- [ ] Axes/grid/basis vectors appear.
- [ ] Orbit controls work in lecturer view.
- [ ] Lecturer camera movement syncs to student Follow Lecturer mode.
- [ ] Student Practice Mode can move camera independently.

## 8. Live Quiz

- [ ] `Open Live Quiz` works only after a live session starts.
- [ ] Quiz appears on student screens.
- [ ] Student can answer.
- [ ] Student can change answer before `Show Answer`.
- [ ] Lecturer sees response distribution update in real time.
- [ ] `Show Answer` reveals the correct answer.
- [ ] After `Show Answer`, student answers are locked.
- [ ] `Close Quiz` closes the quiz for students.

## 9. Student Answers Panel

- [ ] Connected students appear in the dashboard.
- [ ] Before Show Answer, answered students show `Answered` and answer `Hidden`.
- [ ] Waiting students show `Waiting` and answer `—`.
- [ ] After Show Answer, answers are visible.
- [ ] Results show `Correct`, `Incorrect`, or `No answer`.
- [ ] If a student changes answer before reveal, distribution updates correctly.

## 10. Error handling

- [ ] Backend off: frontend shows a clear connection warning.
- [ ] Backend off: student join shows a clear backend error.
- [ ] Wrong room code shows `Room not found` style message.
- [ ] Missing nickname is blocked.
- [ ] Disabled buttons look disabled and do not trigger actions.

## 11. Backend restart recovery

- [ ] Start a live session.
- [ ] Join a student.
- [ ] Stop backend with `Ctrl + C`.
- [ ] Frontend shows disconnected/warning state.
- [ ] Restart backend with `npm run dev`.
- [ ] Lecturer sees that the old room expired.
- [ ] Lecturer can click `Create New Room`.
- [ ] Student is told to return to join screen and use the new code.
- [ ] Student can join the new room successfully.

## 12. Browser console

- [ ] Normal flow has no red console errors.
- [ ] No repeated noisy logs during normal use.
- [ ] Expected warnings appear only during failure/restart tests.

## 13. Final smoke test

Run this short test immediately before a demo or submission:

- [ ] Start backend and frontend from clean terminals.
- [ ] Open lecturer view and create a room.
- [ ] Join at least one student from another tab.
- [ ] Confirm student appears in the lecturer dashboard.
- [ ] Change a matrix and confirm the student updates in Follow Lecturer mode.
- [ ] Click Animate and confirm the student animation starts.
- [ ] Switch to 3D and confirm camera sync works.
- [ ] Open Live Quiz and submit an answer from the student tab.
- [ ] Change the answer before Show Answer and confirm distribution updates.
- [ ] Click Show Answer and confirm answers lock.
- [ ] Click Close Quiz and confirm the quiz closes for students.
- [ ] Test a narrow browser width and confirm no horizontal overflow.

## 14. Final notes

- [ ] No new demo-only features are visible in the final UI.
- [ ] No database/auth/export functionality is expected in this version.
- [ ] After backend restart, the lecturer creates a new room and students join with the new code.

## 15. Quiz Topic Builder

- [ ] Lecturer can choose an existing quiz topic.
- [ ] Lecturer can choose a question from the selected topic.
- [ ] `Open Live Quiz` is disabled if no topic or no question is selected.
- [ ] Lecturer can add a new topic with a title and description.
- [ ] Empty topic title shows a clear error.
- [ ] Lecturer can add a question to the selected topic.
- [ ] At least two answer options are required.
- [ ] Correct answer must point to an existing option.
- [ ] The newly added question is selected automatically.
- [ ] Refreshing the lecturer page keeps custom topics/questions in the same browser.
- [ ] Opening a Live Quiz from a custom question shows it on the student screen.
- [ ] Student screen displays the topic title when available.
- [ ] `Show Answer`, answer changing, results distribution, and `Close Quiz` still work.
- [ ] `Reset Quiz Library` restores the default topics and removes custom local topics.


## Step 16.1 — Next Question in Same Topic

- [ ] Open a topic with at least two questions.
- [ ] Open the first live quiz question.
- [ ] Answer from a student tab.
- [ ] Click **Show Answer**.
- [ ] Verify **Next Question** appears.
- [ ] Click **Next Question**.
- [ ] Verify the student sees the new question.
- [ ] Verify previous selections and feedback are cleared.
- [ ] Verify results and Student Answers Panel reset for the new question.
- [ ] Verify **No more questions in this topic** appears at the end of a topic.


## Step 16.2 — Live Quiz Update + Responsive Answers Table

- [ ] Open a topic with more than one question.
- [ ] Open a Live Quiz.
- [ ] Let a student answer the question.
- [ ] Select a different question while the quiz is active.
- [ ] Click **Update Live Quiz**.
- [ ] Verify that the student receives the new question.
- [ ] Verify that old answers and feedback are cleared.
- [ ] Verify that Student Answers Panel resets to Waiting.
- [ ] Verify that Show Answer works again for the updated question.
- [ ] Resize the lecturer screen and verify the Student Answers Panel has no horizontal scroll.

## Step 16.3 — Expanded Default Quiz Questions

- [ ] Open the lecturer screen.
- [ ] Open the quiz topic selector.
- [ ] Verify that each default topic has five questions:
  - [ ] Transformations
  - [ ] Linear Combinations
  - [ ] Determinant
  - [ ] Span and Basis
  - [ ] Eigenvectors
- [ ] Open a Live Quiz from one of the new questions.
- [ ] Verify the student receives the question.
- [ ] Verify Show Answer and Next Question still work.
- [ ] If the browser had older local quiz data, verify custom topics/questions were not deleted.
- [ ] Use Reset Quiz Library only if you want to restore the full default library and remove custom local changes.


## Step 16.5 — Quiz Builder Add Topic / Add Question Fix

- [ ] Add a question to an existing topic.
- [ ] Confirm the new question appears under the selected topic.
- [ ] Confirm the new question is selected automatically after saving.
- [ ] Add a new topic.
- [ ] Confirm the new topic is selected automatically.
- [ ] Add a question under the newly created topic.
- [ ] Confirm the Correct answer dropdown shows Option A, Option B, Option C, Option D.
- [ ] Confirm Correct answer does not show the full answer text.
- [ ] Try saving a question with a missing option and confirm validation appears.
- [ ] Open Live Quiz using a newly added question.


## Step 16.6 — Quiz Builder UI Fix

- [ ] Open the lecturer screen and expand `Manage Quiz Topics & Questions`.
- [ ] Verify the summary text is exactly `Manage Quiz Topics & Questions`.
- [ ] Verify the Add Question form has an `Add question under topic` dropdown.
- [ ] Choose an existing topic in the Add Question form and add a question.
- [ ] Add a new topic and verify it is selected automatically.
- [ ] Add a question under the newly created topic.
- [ ] Verify the Correct answer dropdown shows only `Option A`, `Option B`, `Option C`, `Option D`.
- [ ] Verify the Correct answer dropdown does not show the answer text content.
- [ ] Open Live Quiz using the newly added question.

## Step 16.7 — Automatic Concept in Quiz Builder

- [ ] Open `Manage Quiz Topics & Questions`.
- [ ] Verify the Add Question form no longer shows a `Concept` dropdown.
- [ ] Verify `Add question under topic` is still visible.
- [ ] Add a question to an existing topic.
- [ ] Verify `Correct answer` shows only `Option A`, `Option B`, `Option C`, `Option D`.
- [ ] Verify the answer text itself is not shown inside the Correct answer dropdown.
- [ ] Add a new topic, then add a question under the new topic.
- [ ] Open the newly added question as a Live Quiz.

### Step 16.8 — Quiz Result Label Separator Fix
- [ ] Lecturer Live Results show answer labels as `A - answer`, `B - answer`, etc.
- [ ] Student Class Results show answer labels as `A - answer`, `B - answer`, etc.
- [ ] Results no longer show `A · answer` or `A*answer`.

### Step 16.9 — Remove Topic Description from Lecturer View
- [ ] Open the lecturer screen.
- [ ] Verify no topic description appears under the topic selector.
- [ ] Open `Manage Quiz Topics & Questions`.
- [ ] Verify Add New Topic asks only for a topic title.
- [ ] Add a new topic and confirm it is selected automatically.
- [ ] Add a question under the new topic.
- [ ] Open the new question as a Live Quiz.

## Step 17 — Deployment Preparation

- [ ] Create `frontend/.env` from `frontend/.env.example`.
- [ ] Create `backend/.env` from `backend/.env.example`.
- [ ] Verify frontend uses `VITE_SOCKET_URL` for Socket.io.
- [ ] Verify frontend uses `VITE_API_BASE_URL` for REST room calls.
- [ ] Verify backend uses `PORT` from environment variables.
- [ ] Verify backend CORS allows local frontend origin from `CLIENT_URLS`.
- [ ] Verify Socket.io CORS uses the same allowed origins.
- [ ] Run backend locally with `npm run dev`.
- [ ] Run frontend locally with `npm run dev`.
- [ ] Create a lecturer room successfully.
- [ ] Join the room as a student successfully.
- [ ] Verify visualization state sync still works.
- [ ] Verify Live Quiz still works after env changes.
- [ ] Verify `npm run build` succeeds for frontend.
- [ ] Verify backend syntax check succeeds.


## Step 17.1 — Dotenv Install Fix QA

- [ ] Backend starts without requiring the external `dotenv` package.
- [ ] `.env` values are loaded from `backend/.env`.
- [ ] `npm install` no longer tries to download packages from an internal OpenAI registry URL.
- [ ] Live session still works locally.
- [ ] Live Quiz still works locally.

## Step 19 — Persistent Quiz Library with PostgreSQL

- [ ] Backend starts successfully when `DATABASE_URL` is configured.
- [ ] Backend still starts when `DATABASE_URL` is missing, without breaking rooms or Socket.io.
- [ ] `GET /api/quiz-topics` returns default topics from PostgreSQL.
- [ ] Add Topic saves a topic to the server database.
- [ ] Add Question saves a question to the server database.
- [ ] Added topic/question persists after browser refresh.
- [ ] Added topic/question is visible from another browser or computer.
- [ ] Live Quiz opens a question loaded from the database.
- [ ] Next Question works with database-loaded topics.
- [ ] Update Live Quiz works with database-loaded topics.
- [ ] If the database/API is unavailable, the frontend shows local fallback mode.

## Step 20 — Student Practice Mode

- [ ] Student page shows both `Join Live Class` and `Practice Alone` options.
- [ ] Student can open Practice Alone without a room code.
- [ ] Practice Mode opens without requiring a lecturer or live session.
- [ ] Student can change concept, matrix, vectors, 2D/3D mode, and animation locally.
- [ ] Practice changes are not sent to a live class and do not require Socket.io room join.
- [ ] Practice Quiz loads topics from the server database when available.
- [ ] Practice Quiz falls back to local quiz topics if the server library is unavailable.
- [ ] Student can select a topic and question in Practice Quiz.
- [ ] Check Answer shows Correct/Incorrect feedback locally.
- [ ] Next Question works locally inside the selected topic.
- [ ] Practice Quiz does not affect lecturer Live Quiz results or Student Answers Panel.
- [ ] Existing Join Live Class flow still works with room code.
- [ ] Lecturer Start Live Session and Live Quiz still work.

## Step 20.1 — Targeted Delete and Export Cleanup QA

- [ ] Lecturer can open **Manage Quiz Topics & Questions**.
- [ ] Lecturer can select and delete a specific question.
- [ ] Deleted question disappears after refresh when the server database is active.
- [ ] Lecturer can select and delete a specific topic.
- [ ] Deleted topic and its questions disappear after refresh when the server database is active.
- [ ] Targeted deletion also works in local fallback mode if the database is unavailable.
- [ ] Existing Live Quiz flow still works after deleting non-active topics/questions.
- [ ] `Export snapshot` no longer appears in the Animation panel.
- [ ] The app still builds and runs locally.
