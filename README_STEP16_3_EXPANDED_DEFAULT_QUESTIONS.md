# Step 16.3 — Expanded Default Quiz Questions

This step expands the default quiz library so that every built-in quiz topic includes five questions.

## Updated default topics

The built-in topics are:

1. Transformations
2. Linear Combinations
3. Determinant
4. Span and Basis
5. Eigenvectors

Each topic now includes five default questions.

## What changed

Updated files:

- `frontend/src/data/quizzes.js`
- `frontend/src/utils/quizStorage.js`
- `QA_CHECKLIST.md`
- `PROJECT_SUMMARY.md`

## localStorage behavior

The lecturer-created quiz library is still saved in the browser with `localStorage`.

If a lecturer already had custom topics or custom questions saved, the app now merges the new default questions into the existing local library instead of deleting custom content.

This means:

- New default questions appear after the update.
- Custom local topics/questions are preserved.
- `Reset Quiz Library` still resets the library to the defaults and removes custom local changes.

## What is still not included

This step does not add:

- database storage
- user accounts
- sharing quiz libraries across computers
- import/export
- deployment

## How to test

1. Start the backend.
2. Start the frontend.
3. Open the lecturer page.
4. Open the quiz topic selector.
5. Select each default topic and verify it has five questions.
6. Open a Live Quiz from a new question.
7. Join as a student and verify the question appears.
8. Click Show Answer and then Next Question to verify the existing quiz flow still works.
