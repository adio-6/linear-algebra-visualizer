# Step 10.2 — Live Quiz Button UI Fix

This is a small UI-only fix on top of Step 10.1.

## What changed

When a live quiz is active, the lecturer buttons:

- Show Answer
- Close Quiz

now use the same purple active action style as Open Live Quiz.

No Socket.io events or quiz logic were changed.

## Updated files

- frontend/src/components/QuizCard.jsx
- frontend/src/index.css

## How to test

1. Run backend and frontend.
2. Open Lecturer page.
3. Start Live Session.
4. Open Live Quiz.
5. Verify Show Answer and Close Quiz are purple and look clickable.
6. Click Show Answer and verify it still reveals the answer.
7. Click Close Quiz and verify it still closes the quiz.
