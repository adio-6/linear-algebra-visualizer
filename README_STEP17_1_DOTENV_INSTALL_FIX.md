# Step 17.1 — Dotenv Install Fix

This fix removes the runtime dependency on the external `dotenv` package and replaces it with a small local `.env` loader.

## Why this was needed

On some machines, `npm install` tried to download `dotenv` from an internal registry URL that was written into the generated `package-lock.json` file. That caused `ETIMEDOUT` and then the backend could not start because `dotenv` was missing.

## What changed

- Added `backend/src/env.js`, a small local `.env` loader.
- Updated `backend/src/server.js` to call `loadEnvFile()` instead of importing `dotenv/config`.
- Removed `dotenv` from `backend/package.json`.
- Replaced internal package-lock registry URLs with the public npm registry URL.

## How to run after this fix

Backend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
copy .env.example .env
npm install
npm run dev
```

Frontend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
copy .env.example .env
npm install
npm run dev
```

If `npm install` is still trying to use the old internal registry, delete the old lock files before running it again:

```cmd
del package-lock.json
npm install
```

Do this inside `backend` and/or `frontend` only if needed.
