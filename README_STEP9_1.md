# Linear Algebra Visualizer — Step 9.1

This update builds on Step 9 and adds two real-time sync fixes:

1. Lecturer Animate button now triggers animation on students in Follow Lecturer mode.
2. Lecturer 3D camera orbit/zoom is synced to students in Follow Lecturer mode.

Practice Mode remains local: students in Practice Mode ignore lecturer animation and camera updates.

## Run

Backend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\backend"
npm install
npm run dev
```

Frontend:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
npm install
npm run dev
```

## Test

1. Open `/lecturer`, start a live session.
2. Open `/student`, join with the room code.
3. Keep the student in Follow Lecturer.
4. Change matrix/concept/dim on lecturer — student should follow.
5. Click Animate on lecturer — student should animate.
6. Switch lecturer to 3D and rotate/zoom — student should follow the camera.
7. Switch student to Practice Mode — lecturer animation/camera should no longer override the student.
