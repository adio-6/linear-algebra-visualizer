export const DEFAULT_QUIZ_TOPICS = [
  {
    id: 'transformations',
    title: 'Transformations',
    description: 'Questions about matrix transformations and their geometric meaning.',
    questions: [
      {
        questionId: 'transformations-origin',
        topicId: 'transformations',
        topicTitle: 'Transformations',
        concept: 'transformation',
        question: 'A 2×2 matrix is applied to every vector in the plane. What stays fixed?',
        options: [
          'Every length and angle',
          'The origin',
          'All horizontal lines',
          'The determinant value',
        ],
        correctIndex: 1,
        explanations: [
          'Only rotations and reflections preserve lengths and angles. General linear maps do not.',
          'Correct. Every linear transformation fixes the origin because A·0 = 0.',
          'Most lines can rotate, shear, or collapse. Only special directions may stay aligned.',
          'The determinant is a property of the matrix, not a point that stays fixed in the plane.',
        ],
      },
      {
        questionId: 'transformations-scaling',
        topicId: 'transformations',
        topicTitle: 'Transformations',
        concept: 'transformation',
        question: 'What does a diagonal matrix usually do visually?',
        options: [
          'Scales the coordinate directions',
          'Always rotates the plane',
          'Deletes the origin',
          'Makes every vector random',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'transformations-shear',
        topicId: 'transformations',
        topicTitle: 'Transformations',
        concept: 'transformation',
        question: 'What is a shear transformation likely to do to the grid?',
        options: [
          'Slide one direction while keeping parallel grid lines parallel',
          'Turn every square into a circle',
          'Move the origin away from (0,0)',
          'Always make the determinant zero',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'transformations-rotation-lengths',
        topicId: 'transformations',
        topicTitle: 'Transformations',
        concept: 'transformation',
        question: 'Which transformation preserves lengths and angles in the plane?',
        options: [
          'A pure rotation',
          'A non-uniform scaling',
          'A projection onto the x-axis',
          'A collapse to the zero vector',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'transformations-reflection-orientation',
        topicId: 'transformations',
        topicTitle: 'Transformations',
        concept: 'transformation',
        question: 'What usually happens to orientation under a reflection matrix?',
        options: [
          'It is reversed',
          'It is always preserved',
          'The grid disappears',
          'Every vector becomes an eigenvector',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'linear-combinations',
    title: 'Linear Combinations',
    description: 'Questions about combining vectors using scalar coefficients.',
    questions: [
      {
        questionId: 'linear-combinations-independent',
        topicId: 'linear-combinations',
        topicTitle: 'Linear Combinations',
        concept: 'combination',
        question: 'When does αu + βv reach every point in the plane as α, β vary over ℝ?',
        options: [
          'Always',
          'When u and v are perpendicular',
          'When u and v are linearly independent',
          'When both vectors have length 1',
        ],
        correctIndex: 2,
        explanations: [
          'Not always. If u and v point in the same direction, they only span a line.',
          'Perpendicularity is sufficient, but it is not required.',
          'Correct. Two independent vectors span all of ℝ².',
          'Unit length does not guarantee that the vectors span the plane.',
        ],
      },
      {
        questionId: 'linear-combinations-definition',
        topicId: 'linear-combinations',
        topicTitle: 'Linear Combinations',
        concept: 'combination',
        question: 'Which expression is a linear combination of u and v?',
        options: [
          'αu + βv',
          'u ÷ v',
          'u² + v²',
          'A random point unrelated to u and v',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'linear-combinations-dependent',
        topicId: 'linear-combinations',
        topicTitle: 'Linear Combinations',
        concept: 'combination',
        question: 'If u and v point in the same direction, what can their linear combinations form in ℝ²?',
        options: [
          'A line through the origin',
          'The whole plane',
          'Only one point not at the origin',
          'A circle',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'linear-combinations-alpha-beta',
        topicId: 'linear-combinations',
        topicTitle: 'Linear Combinations',
        concept: 'combination',
        question: 'In αu + βv, what do α and β represent?',
        options: [
          'Scalar weights applied to the vectors',
          'New coordinate axes only',
          'The determinant of the matrix',
          'The angle between u and v',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'linear-combinations-zero-vector',
        topicId: 'linear-combinations',
        topicTitle: 'Linear Combinations',
        concept: 'combination',
        question: 'If u and v are independent, what is the only way to get αu + βv = 0?',
        options: [
          'α = 0 and β = 0',
          'α = 1 and β = 1',
          'α must equal β',
          'It is impossible to get the zero vector',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'determinant',
    title: 'Determinant',
    description: 'Questions about area scaling, orientation, and invertibility.',
    questions: [
      {
        questionId: 'determinant-zero',
        topicId: 'determinant',
        topicTitle: 'Determinant',
        concept: 'determinant',
        question: 'What does det(A) = 0 mean geometrically?',
        options: [
          'Area is preserved',
          'A collapses the plane onto a line or point',
          'The matrix rotates all vectors by 90°',
          'Every vector becomes longer',
        ],
        correctIndex: 1,
        explanations: [
          'Area preservation would mean |det(A)| = 1, not det(A) = 0.',
          'Correct. A zero determinant means the transformation squashes area flat and is not invertible.',
          'A 90° rotation has determinant 1, not 0.',
          'A singular matrix can make some nonzero vectors become zero.',
        ],
      },
      {
        questionId: 'determinant-area-scale',
        topicId: 'determinant',
        topicTitle: 'Determinant',
        concept: 'determinant',
        question: 'What does |det(A)| describe in 2D?',
        options: [
          'How areas are scaled',
          'The exact direction of every vector',
          'The number of rows in the matrix',
          'The length of vector v only',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'determinant-negative',
        topicId: 'determinant',
        topicTitle: 'Determinant',
        concept: 'determinant',
        question: 'What does a negative determinant indicate?',
        options: [
          'The transformation reverses orientation',
          'The transformation is always impossible',
          'All vectors become zero',
          'Area is always unchanged',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'determinant-invertible',
        topicId: 'determinant',
        topicTitle: 'Determinant',
        concept: 'determinant',
        question: 'When is a 2×2 matrix invertible?',
        options: [
          'When det(A) ≠ 0',
          'When det(A) = 0',
          'Only when all entries are positive',
          'Only when the matrix is diagonal',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'determinant-unit-area',
        topicId: 'determinant',
        topicTitle: 'Determinant',
        concept: 'determinant',
        question: 'If det(A) = 2, what happens to the area of the unit square?',
        options: [
          'It becomes twice as large',
          'It becomes half as large',
          'It collapses to zero area',
          'It must rotate by 2 degrees',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'span-and-basis',
    title: 'Span and Basis',
    description: 'Questions about span, independence, and basis vectors.',
    questions: [
      {
        questionId: 'span-line-or-plane',
        topicId: 'span-and-basis',
        topicTitle: 'Span and Basis',
        concept: 'span',
        question: 'The span of two vectors v, u in ℝ² is...',
        options: [
          'Always a line',
          'Always the whole plane',
          'A line or the whole plane, depending on independence',
          'Always a single point',
        ],
        correctIndex: 2,
        explanations: [
          'It is a line only if the vectors are linearly dependent.',
          'It is the whole plane only if the vectors are linearly independent.',
          'Correct. Dependent vectors span a line; independent vectors span the plane.',
          'Only the span of just the zero vector is a single point.',
        ],
      },
      {
        questionId: 'basis-independent',
        topicId: 'span-and-basis',
        topicTitle: 'Span and Basis',
        concept: 'basis',
        question: 'When do two vectors v, u qualify as a basis for ℝ²?',
        options: [
          'When det [v u] ≠ 0',
          'When both have length 1',
          'When they are perpendicular',
          'When det(A) = 1',
        ],
        correctIndex: 0,
        explanations: [
          'Correct. Nonzero determinant means the vectors are independent and span ℝ².',
          'Unit length is not required for a basis.',
          'Perpendicularity is helpful, but not required.',
          'det(A) describes the transformation matrix, not whether v and u form a basis.',
        ],
      },
      {
        questionId: 'span-single-vector',
        topicId: 'span-and-basis',
        topicTitle: 'Span and Basis',
        concept: 'span',
        question: 'What is the span of one nonzero vector in ℝ²?',
        options: [
          'A line through the origin',
          'The whole plane',
          'A circle around the origin',
          'Only the vector itself',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'basis-number-vectors-r2',
        topicId: 'span-and-basis',
        topicTitle: 'Span and Basis',
        concept: 'basis',
        question: 'How many vectors are needed for a basis of ℝ²?',
        options: [
          'Two independent vectors',
          'One nonzero vector',
          'Three dependent vectors',
          'Any two vectors, even if parallel',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'span-dependent-vectors',
        topicId: 'span-and-basis',
        topicTitle: 'Span and Basis',
        concept: 'span',
        question: 'If two vectors are dependent, what does that mean visually?',
        options: [
          'They lie on the same line through the origin',
          'They must be perpendicular',
          'They always form a basis',
          'They cannot be drawn in the same plane',
        ],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'eigenvectors',
    title: 'Eigenvectors',
    description: 'Questions about eigenvectors, eigenvalues, and invariant directions.',
    questions: [
      {
        questionId: 'eigenvectors-same-line',
        topicId: 'eigenvectors',
        topicTitle: 'Eigenvectors',
        concept: 'eigen',
        question: 'An eigenvector v of A satisfies A·v = λv. What does that mean visually?',
        options: [
          'v rotates by 90°',
          'v stays on the same line through the origin',
          'v must become the zero vector',
          'v always doubles in length',
        ],
        correctIndex: 1,
        explanations: [
          'Eigenvectors do not rotate away from their original line.',
          'Correct. The vector may stretch, shrink, or flip, but it stays on the same line.',
          'Only eigenvalue λ = 0 sends the vector to zero. That is not always the case.',
          'It doubles only when λ = 2 specifically.',
        ],
      },
      {
        questionId: 'eigenvectors-eigenvalue-meaning',
        topicId: 'eigenvectors',
        topicTitle: 'Eigenvectors',
        concept: 'eigen',
        question: 'What does the eigenvalue λ describe for an eigenvector?',
        options: [
          'The scale factor along the eigenvector direction',
          'The angle between the coordinate axes',
          'The number of columns in A',
          'The color of the vector in the visualization',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'eigenvectors-zero-eigenvalue',
        topicId: 'eigenvectors',
        topicTitle: 'Eigenvectors',
        concept: 'eigen',
        question: 'If an eigenvector has eigenvalue 0, what happens to it under A?',
        options: [
          'It is mapped to the zero vector',
          'It always doubles',
          'It rotates exactly 180°',
          'It becomes perpendicular to itself',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'eigenvectors-not-eigenvector',
        topicId: 'eigenvectors',
        topicTitle: 'Eigenvectors',
        concept: 'eigen',
        question: 'How can you tell visually that a vector is not an eigenvector?',
        options: [
          'After transformation, it points in a different line direction',
          'It changes length',
          'It starts at the origin',
          'It has two components',
        ],
        correctIndex: 0,
      },
      {
        questionId: 'eigenvectors-negative-eigenvalue',
        topicId: 'eigenvectors',
        topicTitle: 'Eigenvectors',
        concept: 'eigen',
        question: 'What can a negative eigenvalue do to an eigenvector?',
        options: [
          'Flip it to the opposite direction on the same line',
          'Move it away from its eigenline',
          'Make it stop being a vector',
          'Always preserve its exact length',
        ],
        correctIndex: 0,
      },
    ],
  },
];

export const QUIZ_TOPICS = DEFAULT_QUIZ_TOPICS;

export const QUIZZES = DEFAULT_QUIZ_TOPICS.reduce((acc, topic) => {
  topic.questions.forEach((question) => {
    if (!acc[question.concept]) acc[question.concept] = question;
  });
  return acc;
}, {});

export function getAllQuizTopics() {
  return DEFAULT_QUIZ_TOPICS;
}

export function getQuestionsByTopic(topicId) {
  return DEFAULT_QUIZ_TOPICS.find((topic) => topic.id === topicId)?.questions || [];
}

export function getFirstQuestionByTopic(topicId) {
  return getQuestionsByTopic(topicId)[0] || null;
}

export function getTopicById(topicId) {
  return DEFAULT_QUIZ_TOPICS.find((topic) => topic.id === topicId) || null;
}

export function getQuestionById(topicId, questionId) {
  return getQuestionsByTopic(topicId).find((question) => question.questionId === questionId) || null;
}

export function getQuizForConcept(concept) {
  return QUIZZES[concept] || QUIZZES.transformation;
}

export function quizWithoutExplanations(quiz) {
  if (!quiz) return null;
  const { explanations, ...safeQuiz } = quiz;
  return safeQuiz;
}
