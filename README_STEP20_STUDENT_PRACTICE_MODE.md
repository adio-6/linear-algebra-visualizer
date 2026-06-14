# Step 20 — Student Practice Mode

## What was added

Step 20 adds a standalone **Practice Alone** mode for students. A student can now enter the app without a lecturer, without a room code, and without joining a Socket.io room.

The student entry page now supports two flows:

1. **Join Live Class** — the existing classroom flow with nickname and room code.
2. **Practice Alone** — a new independent learning flow.

## Practice Mode behavior

In Practice Mode, the student sees the regular visualization workspace:

- Concept selector
- Matrix controls
- Vector controls
- Animation controls
- Canvas2D visualization
- Canvas3D visualization
- Live insight / explanation panel

All changes are local to the student's browser. They are not sent to a lecturer and do not affect any live session.

## Practice Quiz

Practice Mode also includes a **Practice Quiz** panel. It loads quiz topics from the existing backend database API:

```txt
GET /api/quiz-topics
```

If the server database is not available, it falls back to the local quiz library.

The student can:

- Select a topic
- Select a question
- Choose an answer
- Click **Check Answer**
- See Correct / Incorrect feedback
- Move to the next question locally

Practice answers are not sent as live quiz responses and do not affect lecturer dashboards or class results.

## Files added or updated

```txt
frontend/src/App.jsx
frontend/src/pages/StudentJoinPage.jsx
frontend/src/pages/StudentPracticePage.jsx
frontend/src/components/PracticeQuiz.jsx
frontend/src/index.css
README.md
PROJECT_SUMMARY.md
QA_CHECKLIST.md
README_STEP20_STUDENT_PRACTICE_MODE.md
```

## How to test

1. Open the home page.
2. Click `Join as Student`.
3. Verify the page shows `Join Live Class` and `Practice Alone`.
4. Click `Practice Alone`.
5. Verify no room code is required.
6. Change matrix/vector values and verify the visualization updates locally.
7. Switch between 2D and 3D.
8. Open Practice Quiz, choose a topic and question, and answer.
9. Click `Check Answer` and verify feedback appears.
10. Click `Next Question` and verify it changes locally.
11. Return to the student page and verify joining a live class still works.
12. Verify lecturer live sessions and live quizzes still work.
