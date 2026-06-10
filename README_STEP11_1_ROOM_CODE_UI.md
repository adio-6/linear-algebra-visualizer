# Step 11.1 — Room Code UI Cleanup

Small lecturer dashboard UI cleanup.

## Change

The room code appeared twice on the lecturer screen:

1. In the top room code display.
2. Again inside the Live Session Dashboard.

This update keeps only the top room code display and removes the duplicate Room code item from the dashboard.

## Updated file

- `frontend/src/pages/LecturerPage.jsx`

## How to test

1. Run backend and frontend.
2. Open `/lecturer`.
3. Click **Start Live Session**.
4. Verify that the room code appears only once, in the upper display.
5. Verify the dashboard still shows Socket status, Students connected, and Connected students.
