# Step 14.3 — Align Student Navigation Buttons With Mode Toggle

This patch fixes a small UI alignment issue in `StudentRoomPage`.

## What changed

The student page now uses the same two-column layout for:

- `Follow Lecturer` / `Practice Mode`
- `Change room` / `Home`

This keeps the two button rows aligned across medium and narrow screen widths.

## Updated files

- `frontend/src/index.css`
- `README_STEP14_3_STUDENT_NAV_ALIGNMENT.md`

## How to test

1. Run the frontend.
2. Open the student room page.
3. Resize the browser window.
4. Confirm that the two rows align:
   - Follow Lecturer | Practice Mode
   - Change room | Home
5. Confirm that Change room and Home remain clickable.

No application logic was changed.
