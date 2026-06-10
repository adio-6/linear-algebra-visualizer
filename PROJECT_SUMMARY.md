# Project Summary — Linear Algebra Visualizer

## Overview

The project is an interactive classroom system for visualizing linear algebra concepts. It combines mathematical visualization, lecturer-student synchronization, and live quiz feedback to support active learning during class.

## Step 1–5: Frontend and Visualization

The first stages built the frontend foundation using React and Vite. The interface was split into reusable components such as the header, concept selector, matrix/vector input panels, animation controls, visualization area, insight panel, quiz card, roadmap, and footer.

The math logic was connected to real linear algebra calculations such as matrix-vector multiplication, determinant, inverse, linear combinations, and transformation interpretation. Canvas2D was added for two-dimensional visualization, including grids, transformed basis vectors, determinant area, vector combinations, span, and animation. Later, Canvas3D was added with React Three Fiber and Three.js to support 3D axes, basis vectors, transformations, camera controls, and visual exploration.

## Step 6–8: Backend, Rooms, and Presence

The backend was introduced using Node.js, Express, and Socket.io. It added REST endpoints for health checks and room management:

- `GET /healthz`
- `POST /api/rooms`
- `GET /api/rooms/:joinCode`

Rooms are stored in memory. The lecturer can create a room and students can join with a room code. Socket.io presence was added so the lecturer can see how many students are connected and their nicknames.

## Step 9: Real-time Synchronization

Step 9 added real-time synchronization from lecturer to students. When the lecturer changes the visualization state, the update is sent to the backend and broadcast to students in the same room.

The synchronized state includes:

- dimension: 2D / 3D
- concept
- matrix A
- vectors
- alpha / beta values
- animation parameter
- animation speed
- 3D camera state

Students have two modes:

- `Follow Lecturer` — receives live updates from the lecturer.
- `Practice Mode` — allows local exploration without being overwritten by lecturer updates.

Step 9.1 also added synchronization for animation triggers and 3D camera movement.

## Step 10: Live Quiz

Step 10 introduced a live classroom quiz mechanism. The lecturer can open a quiz, students answer in real time, and the backend aggregates the responses.

The quiz flow includes:

- `Open Live Quiz`
- student answer submission
- answer changing before reveal
- live response distribution
- `Show Answer`
- `Close Quiz`

The correct answer is not shown automatically. The lecturer controls when to reveal it using `Show Answer`. Students can change their answers until the answer is revealed.

## Step 11: Lecturer Dashboard

Step 11 improved the lecturer screen into a clearer live session dashboard. It now shows:

- room code
- socket status
- connected students count
- connected student nicknames
- active quiz status
- student answer status table

The Student Answers Panel shows who answered and who is still waiting. Before `Show Answer`, answers are hidden. After reveal, each student's answer and result are shown as `Correct`, `Incorrect`, or `No answer`.

## Step 12: Error Handling and Recovery

Step 12 focused on polish, stability, and production readiness. It added clearer UI messages and safer backend validation.

Improvements include:

- clearer errors for missing nickname or invalid room code
- connection status badges
- backend Socket.io payload validation
- safer event handling with error responses
- clearer backend logs
- recovery UX after backend restart
- robust student room join flow

Because rooms are stored in memory, restarting the backend deletes existing rooms. The UI now explains this clearly and lets the lecturer create a new room, while students are directed back to the join screen.

## Current limitations

The current system is intentionally still lightweight:

- no database
- no login/authentication
- no persistent quiz history
- no grade storage
- no export tools
- no deployment setup

These limitations are acceptable for the current prototype because the focus is on real-time visualization and classroom interaction.

## Current status

The application now supports a complete live classroom flow:

1. Lecturer creates a room.
2. Students join with a code.
3. Lecturer controls a 2D/3D linear algebra visualization.
4. Students follow the lecturer or practice independently.
5. Lecturer opens live quizzes.
6. Students answer and can change answers before reveal.
7. Lecturer views live results and student status.
8. The app handles common errors and backend restart scenarios more clearly.

## Step 14: UI/UX Final Polish + Responsive Layout

Step 14 focused on final interface polish rather than adding a new feature. The landing page, lecturer workspace, student workspace, quiz area, dashboard, and status messages were refined for clearer hierarchy, more consistent spacing, better button states, and improved responsiveness. Wide screens keep a structured workspace layout, while narrower screens collapse into a readable single-column layout. Existing functionality such as visualization, synchronization, Live Quiz, student answer tracking, and backend restart recovery was preserved.


## Step 15: Manual QA + Final Bug Fixes

Step 15 was a final QA and stability pass. No new major feature was added. The focus was to verify the complete application flow before demonstration or submission: setup, lecturer room creation, student join, real-time synchronization, 2D/3D visualization, animation sync, 3D camera sync, Live Quiz, Student Answers Panel, backend restart recovery, and responsive layout.

The QA documentation was updated to reflect the final application behavior. The final expected recovery behavior after backend restart is that the old in-memory room expires, the lecturer creates a new room, and students rejoin using the new room code.

## Step 16: Lecturer Quiz Topic & Question Builder

Step 16 added a local quiz library for the lecturer. Quiz questions are now organized by topics such as Transformations, Linear Combinations, Determinant, Span and Basis, and Eigenvectors. The lecturer can select a topic, select a question from that topic, and open that question as a Live Quiz.

The lecturer can also add new topics and add new questions to the selected topic directly from the lecturer screen. These custom topics and questions are stored in the browser using `localStorage`, so they remain available after refreshing the page on the same computer and browser. They are not yet shared between different computers because the system still does not use a database.

The Live Quiz backend flow did not change: the frontend sends the selected quiz object through the existing `lecturer:open-quiz` event, and students answer through the existing live quiz events. Student screens now show the topic title when a quiz includes one.


## Step 16.1 — Next Question in Same Topic

Added a controlled classroom flow for moving from one quiz question to the next inside the same topic. After the lecturer reveals the answer, a **Next Question** button appears when another question exists in that topic. Opening the next question reuses the existing live quiz event, resets previous student responses, hides the answer again, and updates students with the new question.


## Step 16.2 — Live Quiz Selection Sync + Responsive Answers Table

Step 16.2 improved the Live Quiz flow by allowing the lecturer to update an active quiz with a different selected question. The same `lecturer:open-quiz` event is reused, so the backend replaces the active quiz, clears previous responses, and broadcasts the new question to students. The Student Answers Panel was also updated to avoid horizontal scrolling by wrapping table content and switching to a compact card layout on narrow screens.

## Step 16.3 — Expanded Default Quiz Questions

Step 16.3 expanded the built-in quiz library so that every existing default topic now starts with five questions. The topics are Transformations, Linear Combinations, Determinant, Span and Basis, and Eigenvectors. Custom topics and custom questions are still preserved in `localStorage`.

The quiz storage helper now merges new default questions into an existing local quiz library. This means that if the browser already has quiz data saved from an earlier version, the new default questions are added without deleting custom lecturer-created topics or questions.


## Step 16.5 — Quiz Builder Add Topic / Add Question Fix

Step 16.5 improves the lecturer quiz builder. The lecturer can add questions to an existing topic, create a new topic, and immediately add questions under the new topic because it is selected automatically after creation. The Correct answer dropdown now uses stable labels, Option A through Option D, instead of displaying the full answer texts. This makes answer selection clearer and avoids long or duplicated answer text inside the dropdown.


## Step 16.6 — Quiz Builder UI Fix

Refined the Quiz Builder UI. The management section is now labeled `Manage Quiz Topics & Questions`, the Add Question form includes its own topic selector so the lecturer can choose where to save the new question, and the Correct answer dropdown now uses fixed labels `Option A` through `Option D` instead of showing answer text.

## Step 16.7 — Automatic Concept in Quiz Builder

The Quiz Builder was simplified by removing the manual `Concept` dropdown from the Add Question form. Lecturers now choose only the target topic for a new question, and the app automatically infers the internal concept from that topic. The Correct Answer dropdown was kept simple and now displays only `Option A`, `Option B`, `Option C`, and `Option D`, without showing long answer text.

## Step 16.8 — Quiz Result Label Separator Fix

Updated the quiz result labels in the lecturer Live Results panel and the student Class Results panel so options are displayed as `A - answer`, `B - answer`, `C - answer`, and `D - answer` instead of using a dot/star-like separator. This is a UI-only change and does not affect quiz logic, scoring, Socket.io events, or localStorage behavior.

## Step 16.9 — Remove Topic Description from Lecturer View

The lecturer quiz interface was simplified by removing the visible topic description from the Quiz Topics area and from the Add New Topic form. The lecturer now creates a topic using only its title, then adds questions under that topic. This keeps the quiz management flow focused and avoids unnecessary text in the lecturer view.

## Step 17 — Deployment Preparation

Step 17 prepared the project for future deployment without deploying it yet. Hard-coded frontend/backend local URLs were moved into environment variables. The frontend now reads `VITE_SOCKET_URL` for Socket.io and `VITE_API_BASE_URL` for REST requests, with local fallback values for development.

The backend now loads environment variables through `dotenv`, reads `PORT` from `process.env`, and uses `CLIENT_URLS` / `CLIENT_URL` to configure CORS for both Express and Socket.io. This allows local development origins and future production frontend domains to be configured without changing source code.

Deployment documentation was added in `README_DEPLOYMENT.md`, including local `.env` setup, production environment examples, and the recommended Step 18 deployment path: frontend to Vercel/Netlify and backend to Render/Railway.


## Step 17.1 — Dotenv Install Fix

Removed the external dotenv runtime dependency and added a local `.env` loader so the backend can run even when npm cannot install dotenv from a generated lockfile URL. The package-lock registry URLs were also normalized to public npm registry URLs.
