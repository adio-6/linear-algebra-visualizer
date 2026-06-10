# Step 10.3 — Student can change quiz answer before reveal

This patch keeps the existing Live Quiz flow and allows students to change their answer until the lecturer clicks **Show Answer**.

## Updated files

- `frontend/src/components/StudentLiveQuiz.jsx`
- `frontend/src/index.css`
- `backend/src/server.js`

## Behavior

- A student can choose an answer.
- The selected answer is visually highlighted.
- The student can choose another answer before the answer is revealed.
- Every new choice sends `student:quiz-response` again.
- The backend stores the latest answer for the student socket.
- Lecturer results update according to the latest answer only.
- After **Show Answer**, answer options are disabled and the last selected answer is locked.

## Test

1. Start backend and frontend.
2. Open lecturer page and start a live session.
3. Join as a student.
4. Open a live quiz.
5. Student chooses answer A.
6. Lecturer results should show one response for A.
7. Student changes to answer B.
8. Lecturer results should move the response from A to B.
9. Lecturer clicks **Show Answer**.
10. Student cannot change the answer anymore.
