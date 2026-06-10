# Step 10.1 — Show Answer

This update changes Live Quiz behavior so the correct answer is not revealed automatically.

## What changed

- Lecturer sees live response distribution immediately.
- Correct answer and correct percentage stay hidden until the lecturer clicks **Show Answer**.
- Students do not see whether they were correct immediately after answering.
- Students see: `Answer submitted. Waiting for lecturer to reveal the correct answer.`
- When the lecturer clicks **Show Answer**, students receive `quiz:answer-revealed` and then see whether they were correct.

## Backend event added

`lecturer:reveal-answer`

Payload:

```js
{
  joinCode
}
```

Server broadcasts:

`quiz:answer-revealed`

```js
{
  questionId,
  correctIndex,
  answerRevealed: true
}
```

## How to test

1. Start backend and frontend.
2. Lecturer starts a live session.
3. Student joins the room.
4. Lecturer opens a live quiz.
5. Student submits an answer.
6. Lecturer should see response distribution, but no correct answer highlight yet.
7. Student should see the waiting message, not correct/wrong feedback.
8. Lecturer clicks **Show Answer**.
9. Correct answer is highlighted for lecturer and student.
10. Correct percentage appears only after reveal.
