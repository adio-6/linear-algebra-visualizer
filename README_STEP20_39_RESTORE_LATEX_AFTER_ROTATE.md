# Step 20.39 — Restore LaTeX after Rotate update

## What changed
Restored the LaTeX quiz rendering that was lost when the Rotate preset-cycle ZIP was created from a version that did not include the LaTeX files.

## Included fixes
- Re-added `frontend/src/components/LatexText.jsx`.
- Re-applied LaTeX rendering in:
  - `QuizCard.jsx`
  - `StudentLiveQuiz.jsx`
  - `PracticeQuiz.jsx`
- Re-added `katex` to `frontend/package.json`.
- Replaced `frontend/package-lock.json` with a public npm registry lockfile.
- Re-added LaTeX CSS classes to `frontend/src/index.css`.
- Kept the Rotate preset-cycle behavior from Step 20.38.

## Important deployment note
If Vercel fails on `npm install` with an internal registry URL, regenerate the lockfile locally:

```cmd
cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project\frontend"
rmdir /s /q node_modules
del package-lock.json
npm config set registry https://registry.npmjs.org/
npm install
npm run build

cd "C:\מסמכים\לימודים\שנה ג\פרויקט בתעשיה\project"
git add frontend/package.json frontend/package-lock.json frontend/src/components/LatexText.jsx frontend/src/components/QuizCard.jsx frontend/src/components/StudentLiveQuiz.jsx frontend/src/components/PracticeQuiz.jsx frontend/src/index.css
git commit -m "Restore LaTeX support after rotate update"
git push
```
