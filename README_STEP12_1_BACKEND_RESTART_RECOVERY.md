# Step 12.1 — Backend Restart Recovery UX

This update improves the behavior after the backend server is stopped and started again.

Important: rooms are still kept in memory only. This step does not add a database or persistence.
After a backend restart, old room codes are expected to expire.

## What changed

### Backend

- `room:join` now returns a clearer error when a room no longer exists:
  `Room not found. The server may have restarted.`
- `GET /api/rooms/:joinCode` still returns `{ exists: false }` for missing rooms.
- No database or file persistence was added.

### Frontend — LecturerPage

- When the socket reconnects, the lecturer checks whether the current room still exists.
- If the room expired after backend restart, the lecturer sees a clear warning.
- The state sync stops for the expired room.
- A `Create New Room` button lets the lecturer create a fresh room and share the new code.
- Presence and old live-session status are cleared when a new room is created.

### Frontend — StudentRoomPage

- When the socket reconnects, the student tries to rejoin the current room.
- If the room no longer exists, the student sees a clear message:
  `This room is no longer available. The lecturer may need to create a new room.`
- The student is shown a link back to the join page.

## How to test

1. Start backend and frontend.
2. Open Lecturer page and start a live session.
3. Join as a student in another tab.
4. Stop the backend with `Ctrl + C`.
5. Confirm both lecturer and student show a connection warning.
6. Start the backend again with `npm run dev`.
7. Lecturer should show that the old room expired and offer `Create New Room`.
8. Click `Create New Room`.
9. Share the new room code with students.
10. Student should go back to the join page and join with the new code.
