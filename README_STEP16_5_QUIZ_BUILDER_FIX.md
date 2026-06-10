# Step 16.5 — Quiz Builder Add Topic / Add Question Fix

## What was added

This step improves the lecturer Quiz Topic Builder.

The lecturer can now use two clear flows:

1. Add a question to an existing topic.
2. Add a new topic, automatically select it, and then add questions under that new topic.

The Correct answer selector was also simplified. It now always shows:

- Option A
- Option B
- Option C
- Option D

It does not show the full text entered in the answer fields.

## Add question to an existing topic

1. Open the Lecturer screen.
2. Open **Manage Quiz Topics**.
3. Choose a topic in **Select quiz topic**.
4. Fill in the question text.
5. Fill in all four options.
6. Choose the correct answer using **Option A/B/C/D**.
7. Click **Add Question**.

The new question is saved in localStorage, added to the selected topic, and selected automatically.

## Add a new topic and then add questions

1. Open **Manage Quiz Topics**.
2. Fill in **Topic title**.
3. Optionally fill in **Topic description**.
4. Click **Add Topic**.
5. The new topic is selected automatically.
6. Fill in the Add Question form.
7. Click **Add Question**.

## Validation

The Add Question form requires:

- Question text.
- All four answer options.
- Correct answer selected as Option A/B/C/D.

If one of the four options is missing, the form shows:

`Please fill all four options.`

## Persistence

Custom topics and questions are still saved in browser localStorage.
They remain available in the same browser until localStorage is cleared.
