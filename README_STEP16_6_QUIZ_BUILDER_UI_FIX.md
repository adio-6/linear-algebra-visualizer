# Step 16.6 — Quiz Builder UI Fix

This step refines the lecturer Quiz Builder UI.

## What changed

1. The expandable management section title is now:

```text
Manage Quiz Topics & Questions
```

2. The Add Question form now includes its own topic selector:

```text
Add question under topic
```

This allows the lecturer to add a question to any existing topic directly from the form, without relying only on the main quiz selection dropdown.

3. The Correct answer dropdown now shows fixed labels only:

```text
Option A
Option B
Option C
Option D
```

It no longer displays the full answer text inside the Correct answer dropdown.

## How to use

1. Open the lecturer screen.
2. Open `Manage Quiz Topics & Questions`.
3. To add a topic, fill `Topic title` and click `Add Topic`.
4. The new topic is selected automatically.
5. In `Add Question to Topic`, choose the topic under `Add question under topic`.
6. Fill the question, Option A-D, choose Correct answer, and click `Add Question`.

## Validation

The form requires:

- question text
- all four options
- correct answer as Option A-D
- selected topic

## Notes

This is a frontend-only UI fix. No backend or Socket.io events were changed.
