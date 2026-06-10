# Step 16.1 — Next Question in Same Topic

## What was added

Step 16 introduced quiz topics and a local question builder. Step 16.1 adds a classroom flow for moving through multiple questions inside the same topic.

After the lecturer opens a live quiz and clicks **Show Answer**, the lecturer can click **Next Question** when another question exists in the same topic.

The student does not advance independently. The lecturer controls the pace.

## Behavior

1. Lecturer chooses a topic and question.
2. Lecturer opens the live quiz.
3. Students answer.
4. Lecturer clicks **Show Answer**.
5. If the topic has another question, **Next Question** appears.
6. Lecturer clicks **Next Question**.
7. The next question opens as a new live quiz.
8. Previous responses and feedback reset.
9. Students answer the new question normally.

## Notes

- No new Socket.io event was added.
- The existing `lecturer:open-quiz` event is reused.
- The backend resets `quizResponses` whenever a new live quiz is opened.
- `answerRevealed` starts as `false` for every new question.
- If there are no more questions in the topic, the lecturer sees `No more questions in this topic.`

## How to test

1. Start backend and frontend.
2. Open Lecturer page and create a live session.
3. Join as a student.
4. Choose a quiz topic that has more than one question, such as Transformations.
5. Open the first question.
6. Answer as the student.
7. Click **Show Answer** as the lecturer.
8. Verify that **Next Question** appears.
9. Click **Next Question**.
10. Verify that the student sees the next question.
11. Verify that the previous answer and feedback are cleared.
12. Answer the new question and verify results update from zero.
