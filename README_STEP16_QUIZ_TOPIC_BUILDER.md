# Step 16 — Lecturer Quiz Topic & Question Builder

## What was added

Step 16 improves the Live Quiz feature by adding a local quiz library for the lecturer.

The lecturer can now:

- choose a quiz topic,
- choose a question from that topic,
- open that question as a Live Quiz,
- add a new topic,
- add a new question to the selected topic,
- reset the quiz library to default examples.

The student receives the selected Live Quiz exactly as before. If the quiz includes a topic title, the student screen shows it above the question.

## Default topics

The default quiz library includes example topics:

- Transformations
- Linear Combinations
- Determinant
- Span and Basis
- Eigenvectors

The default questions are stored in:

```txt
frontend/src/data/quizzes.js
```

## Where custom topics are saved

Custom topics and custom questions are saved in the lecturer browser using `localStorage`.

This means:

- custom questions remain after refreshing the page,
- custom questions are available only in the same browser and computer,
- custom questions are not shared with another lecturer computer,
- backend restart does not delete custom questions,
- clearing browser storage may delete custom questions.

This is intentional for the current version because there is no database yet.

## How to add a new topic

1. Open the lecturer screen.
2. Go to the Live Quiz area.
3. Open `Manage Quiz Topics`.
4. Fill in:
   - Topic title
   - Topic description
5. Click `Add Topic`.

The new topic is selected automatically.

## How to add a question

1. Select the topic where the question should be saved.
2. Open `Manage Quiz Topics`.
3. Fill in:
   - Question text
   - Option A
   - Option B
   - Option C
   - Option D
   - Correct answer
   - Concept
4. Click `Add Question`.

The new question is selected automatically and can be opened as a Live Quiz.

## How to reset the quiz library

Click `Reset Quiz Library` inside `Manage Quiz Topics`.

This restores the default topics and questions and removes custom topics/questions from localStorage.

## How to test Step 16

1. Start backend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
npm run dev
```

2. Start frontend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
npm run dev
```

3. Open `/lecturer`.
4. Start a live session.
5. Select an existing quiz topic.
6. Select a question.
7. Open Live Quiz.
8. Join as a student and verify the question appears.
9. Add a new topic.
10. Add a question to the new topic.
11. Open Live Quiz from the new question.
12. Refresh the lecturer page and verify the custom topic still exists.
13. Reset the quiz library and verify defaults return.

## Known limitation

The quiz library is not stored in a database. It is stored only in the browser using localStorage. A future database version could let lecturers share quiz libraries between computers, accounts, or courses.


## Step 16.5 update

The Quiz Topic Builder supports two lecturer workflows:

1. **Add question to an existing topic** — choose a topic, fill in the question form, and click Add Question.
2. **Add new topic and then add questions** — create a topic, and the new topic is selected automatically so questions can be added immediately.

The Correct answer dropdown now always displays fixed labels:

- Option A
- Option B
- Option C
- Option D

The dropdown values map to `correctIndex` values 0, 1, 2, and 3. All four options are required so the correct answer index stays simple and reliable.


## Step 16.6 Quiz Builder UI note

The management section is now named `Manage Quiz Topics & Questions`.

When adding a question, use the `Add question under topic` dropdown inside the Add Question form to choose the topic that should receive the new question.

The `Correct answer` dropdown always displays fixed labels: `Option A`, `Option B`, `Option C`, and `Option D`. It does not display the full answer text.

## Step 16.7 update

The Add Question form no longer asks the lecturer to select a separate Concept. The lecturer selects the topic under `Add question under topic`, and the app automatically assigns the internal concept according to the selected topic.

The Correct answer dropdown displays only `Option A`, `Option B`, `Option C`, and `Option D`. It does not display the full text of the answer options.
