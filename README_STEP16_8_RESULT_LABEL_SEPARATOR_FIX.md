# Step 16.8 — Quiz Result Label Separator Fix

## What changed

The quiz results display was adjusted so answer options are shown with a simple hyphen separator:

- `A - answer`
- `B - answer`
- `C - answer`
- `D - answer`

This affects:

- Lecturer **Live Results**
- Student **Class Results**

## Why

The previous separator looked like `A · answer`, which could be visually confused with `A*answer`.
The new format is clearer and easier to read.

## Files updated

- `frontend/src/components/QuizCard.jsx`
- `frontend/src/components/StudentLiveQuiz.jsx`
- `QA_CHECKLIST.md`
- `PROJECT_SUMMARY.md`

## How to test

1. Start the backend and frontend.
2. Open a lecturer room.
3. Join as a student.
4. Open a Live Quiz.
5. Submit an answer as the student.
6. Check the lecturer **Live Results** area.
7. Check the student **Class Results** area.
8. Confirm that results are displayed as `A - answer`, not `A · answer` and not `A*answer`.

## Notes

This is a UI-only change. It does not change the quiz data model, backend logic, Socket.io events, scoring, or persistence.
