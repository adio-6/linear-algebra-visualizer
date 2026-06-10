# Step 12.2 — Fix Student Join Flow

This small fix makes the student join flow more reliable after the Backend Restart Recovery update.

## What changed

Updated:

- `frontend/src/api/socketClient.js`

The `joinRoom` helper now waits until the Socket.io client is actually connected before emitting `room:join`.
This prevents a timeout where the student page shows:

> Could not connect to room

although the backend is running and the room exists.

## How to test

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

3. Open lecturer page and create a room.
4. Open student join page.
5. Enter nickname and the new room code.
6. The student should enter the room and show Connected.
7. Stop backend, start it again, create a new room from lecturer, and join with the new code.
