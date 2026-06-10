# Step 16.7 — Automatic Concept in Quiz Builder

## What changed

This step simplifies the lecturer Quiz Builder.

The `Concept` dropdown was removed from the Add Question form. The lecturer now chooses only the topic under which the question should be added. The question concept is inferred automatically from the selected topic.

## Why

The lecturer already chooses a quiz topic. Asking for both `Topic` and `Concept` created confusion because the two controls looked similar. The topic is now the visible teaching category, and the app decides the internal concept value automatically.

## Add Question flow

1. Open `Manage Quiz Topics & Questions`.
2. In `Add question under topic`, choose the target topic.
3. Fill in the question and all four options.
4. Choose the correct answer using `Option A`, `Option B`, `Option C`, or `Option D`.
5. Click `Add Question`.

## Correct answer dropdown

The correct answer dropdown now shows only:

- Option A
- Option B
- Option C
- Option D

It does not show the full answer text.

## Automatic concept mapping

The app infers the concept from the selected topic title/id:

- Transformations → `transformation`
- Linear Combinations → `combination`
- Determinant → `determinant`
- Span → `span`
- Basis → `basis`
- Eigenvectors → `eigen`

For a custom topic that does not match one of these names, the fallback is `transformation`.

## How to test

1. Open the lecturer screen.
2. Open `Manage Quiz Topics & Questions`.
3. Confirm there is no `Concept` dropdown in Add Question.
4. Confirm there is still an `Add question under topic` dropdown.
5. Add a question to an existing topic.
6. Confirm the correct answer dropdown displays only `Option A/B/C/D`.
7. Add a new topic and then add a question under it.
8. Open the new question as a Live Quiz.
