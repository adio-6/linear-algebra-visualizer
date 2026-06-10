# Step 11 — Student Answers Panel + Better Live Session Dashboard

This step improves the lecturer dashboard for live classroom use.

## Backend changes

- Each student keeps `socketId`, `nickname`, and `joinedAt`.
- `getStudentQuizStatus(joinCode)` returns every connected student and whether they answered the active quiz.
- `getQuizResults(joinCode)` now also returns:
  - `answerRevealed`
  - `studentStatuses`
- When a student joins, answers, changes answer, disconnects, or the lecturer reveals the answer, the server emits updated `quiz:results`.

## Frontend changes

- Lecturer dashboard now shows room code, socket status, connected count, and connected nicknames in a clearer dashboard.
- Live Quiz results now include a Student Answers Panel.
- Before Show Answer, the table shows Answered / Waiting but hides actual choices.
- After Show Answer, the table shows each student's answer and Correct / Incorrect / No answer.

## Test

1. Start backend and frontend.
2. Open `/lecturer` and click Start Live Session.
3. Join as two students from `/student`.
4. Open Live Quiz.
5. Student 1 answers, then changes answer.
6. Verify the lecturer distribution and Student Answers Panel update.
7. Click Show Answer.
8. Verify individual answers and Correct / Incorrect badges are visible.
9. Disconnect a student and verify the table updates.
