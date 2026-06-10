# Step 14.2 — Student Navigation Buttons UI Fix

This small UI-only fix makes the Student Room navigation actions look like real buttons.

Updated:
- `frontend/src/pages/StudentRoomPage.jsx`
- `frontend/src/index.css`

What changed:
- `Change room`, `Home`, and `Back to join page` now use button styling instead of plain text-link styling.
- Added a small secondary button style that is consistent with the app design.
- Added responsive wrapping for the student navigation actions.

No business logic, Socket.io events, Zustand state, Canvas2D, Canvas3D, or quiz behavior was changed.

## Test

1. Start backend and frontend.
2. Create a live room as lecturer.
3. Join as student.
4. Verify that `Change room` and `Home` look like clickable buttons.
5. Stop backend or trigger a room join error and verify that `Back to join page` also looks like a button.
