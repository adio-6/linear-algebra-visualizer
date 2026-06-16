# Step 20.37 — LaTeX support for quiz questions

## What changed
This step adds LaTeX rendering support to quiz questions and answer options.

The lecturer can now write math inside quiz text using:

- Inline math: `$A\vec{v}=\lambda\vec{v}$`
- Inline math alternative: `\(A\vec{v}=\lambda\vec{v}\)`
- Display math: `$$A\vec{v}=\lambda\vec{v}$$`

## Where it works
- Lecturer question preview while adding a new question
- Lecturer live quiz display
- Lecturer live results display
- Student live quiz display
- Student live results display
- Independent Practice Mode

## Files updated
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/components/LatexText.jsx`
- `frontend/src/components/QuizCard.jsx`
- `frontend/src/components/StudentLiveQuiz.jsx`
- `frontend/src/components/PracticeQuiz.jsx`
- `frontend/src/index.css`
- `PROJECT_SUMMARY.md`
- `QA_CHECKLIST.md`

## Dependency added
- `katex`

## How to test
1. Run `npm install` in the frontend folder.
2. Run `npm run build` or `npm run dev`.
3. Open Lecturer workspace.
4. Open **Manage Quiz Topics & Questions**.
5. Add a question such as:

   `Is $v=(1,0)$ an eigenvector if $A\vec{v}=2\vec{v}$?`

6. Add options such as:

   - `$\lambda=2$`
   - `$\lambda=0$`
   - `$A^{-1}$ does not exist`
   - `$\det(A)=0$`

7. Verify the preview renders the math.
8. Open the question as a live quiz and verify the math renders for both lecturer and student.
