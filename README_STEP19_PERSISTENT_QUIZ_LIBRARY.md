# Step 19 — Persistent Quiz Library with PostgreSQL

Step 19 moves the Quiz Topics and Question Builder from browser-only `localStorage` to a shared PostgreSQL database.

## What was added

- PostgreSQL connection in the backend using `pg`.
- Database initialization on backend startup.
- Automatic creation of quiz tables if they do not exist.
- Default quiz topic/question seed when the database is empty.
- REST API for the shared quiz library.
- Frontend API client for quiz topics and questions.
- Quiz Builder now uses the server database as the primary source.
- `localStorage` remains only as fallback if the database/API is unavailable.

## Database tables

### quiz_topics

- `id`
- `title`
- `concept`
- `created_at`
- `updated_at`

### quiz_questions

- `id`
- `topic_id`
- `concept`
- `question`
- `options`
- `correct_index`
- `created_at`
- `updated_at`

## API routes

- `GET /api/quiz-topics`
- `POST /api/quiz-topics`
- `POST /api/quiz-topics/:topicId/questions`
- `PUT /api/quiz-topics/:topicId`
- `DELETE /api/quiz-topics/:topicId`

## Local setup

Backend `.env` should include:

```env
PORT=3000
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
NODE_ENV=development
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

Then run:

```cmd
cd backend
npm install
npm run dev
```

Frontend:

```cmd
cd frontend
npm install
npm run dev
```

## Render setup

1. Create a PostgreSQL database in Render.
2. Copy its `DATABASE_URL` / internal database URL.
3. Open the backend Web Service in Render.
4. Add environment variable:

```env
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
```

5. Redeploy the backend.

On backend startup, the tables are created automatically and default questions are inserted if the database is empty.

## How to test

1. Open the deployed frontend.
2. Open Lecturer View.
3. Open `Manage Quiz Topics & Questions`.
4. Check that the status says `Quiz library: Server database`.
5. Add a new topic.
6. Add a new question under that topic.
7. Refresh the browser.
8. Verify the topic/question still exists.
9. Open the site in another browser and verify the same topic/question appears.
10. Open the new question as Live Quiz and verify Live Quiz still works.

## Fallback behavior

If `DATABASE_URL` is missing or the backend API is unavailable, the frontend shows:

`Using local quiz library because server library is unavailable.`

In that case the app still works, but custom questions are saved only locally in the browser.
