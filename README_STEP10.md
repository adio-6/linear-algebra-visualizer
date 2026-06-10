# Step 10 — Live Quiz Sync

This build adds a live classroom quiz flow on top of Step 9.1.

What works:
- Lecturer can open a live quiz after starting a live session.
- Students in the room receive the quiz through Socket.io.
- Students submit one answer.
- Backend aggregates responses in memory.
- Lecturer sees live distribution and correct percentage.
- Quiz can be closed by the lecturer.

Still intentionally out of scope:
- database
- login/auth
- grading
- saving responses
- advanced analytics

Run backend and frontend in separate terminals:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
npm install
npm run dev
```

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
npm install
npm run dev
```
