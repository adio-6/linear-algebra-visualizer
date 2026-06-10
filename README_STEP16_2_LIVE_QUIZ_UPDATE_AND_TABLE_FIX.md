# Step 16.2 — Live Quiz Selection Sync + Responsive Answers Table

## What changed

Step 16.2 improves two parts of the Live Quiz flow:

1. **Updating an active Live Quiz**
   - When a Live Quiz is already active, the main quiz button now says **Update Live Quiz**.
   - The lecturer can choose a different topic/question and click **Update Live Quiz**.
   - The selected question is broadcast to students using the existing `lecturer:open-quiz` event.
   - Previous answers are cleared.
   - `answerRevealed` is reset to `false`.
   - The Student Answers Panel resets to the current connected students with `Waiting` status.

2. **Responsive Student Answers table**
   - The Student Answers Panel no longer creates horizontal scroll in medium widths.
   - On normal widths, the table uses `table-layout: fixed` and wraps long text.
   - On narrow screens, the table becomes a stacked card layout so all fields are visible.

## Why dropdown selection alone does not update students

Changing the topic/question dropdown does not immediately affect students. This prevents students from seeing the question change while the lecturer is only browsing.

Students are updated only when the lecturer clicks:

- **Open Live Quiz** when there is no active quiz.
- **Update Live Quiz** when a quiz is already active.
- **Next Question** after showing an answer.

## How to test

1. Start backend and frontend.
2. Open `/lecturer` and create a live session.
3. Join the room from `/student`.
4. Open a Live Quiz from a topic.
5. Answer it as a student.
6. In the lecturer screen, choose a different question from the dropdown.
7. Click **Update Live Quiz**.
8. Verify that:
   - The student sees the new question.
   - The previous answer is cleared.
   - The Student Answers Panel resets.
   - Show Answer is available again.
9. Resize the browser to medium and narrow widths.
10. Verify that the Student Answers Panel has no horizontal scrollbar.
