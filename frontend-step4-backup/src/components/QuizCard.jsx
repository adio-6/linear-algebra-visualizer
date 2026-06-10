import { useState } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

const questions = {
  transformation: 'A 2×2 matrix is applied to every vector in the plane. What stays fixed?',
  combination: 'When does αu + βv reach every point in the plane as α, β vary over ℝ?',
  determinant: 'What does det(A) = 0 mean geometrically?',
  eigen: 'An eigenvector v of A satisfies A·v = λv. What does that mean visually?',
  span: 'The span of two vectors v, u in ℝ² is...',
  basis: 'When do two vectors v, u qualify as a basis for ℝ²?',
};

const demoOptions = [
  'Option A — placeholder',
  'Option B — placeholder',
  'Option C — placeholder',
  'Option D — placeholder',
];

export default function QuizCard() {
  const concept = useVisualizerStore((s) => s.concept);
  const [selected, setSelected] = useState(null);

  return (
    <section className="card quiz-card">
      <div className="quiz-left">
        <div className="section-title">Quick Understanding Check <span className="badge-sim">Simulated</span></div>
        <div className="quiz-q">{questions[concept]}</div>
        <div className="quiz-opts">
          {demoOptions.map((option, index) => (
            <button key={option} className={`quiz-opt ${selected === index ? 'correct' : ''}`} onClick={() => setSelected(index)}>
              <span className="letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
        <div className="quiz-feedback">{selected === null ? 'Choose an answer to see immediate feedback.' : 'Quiz logic will be ported in a later phase.'}</div>
      </div>

      <div className="quiz-right">
        <div className="section-title">Class Response <span className="badge-sim">Live</span></div>
        <div className="class-stats">
          <div className="connected-row">
            <span className="dot-pulse"></span>
            <span><span className="num">18</span> students connected</span>
          </div>
          <div className="bar-row">
            <div className="top"><span>Correct answers</span><b>72%</b></div>
            <div className="bar"><span style={{ width: '72%' }}></span></div>
          </div>
          <div className="bar-row">
            <div className="top"><span>Response rate</span><b>94%</b></div>
            <div className="bar"><span style={{ width: '94%' }}></span></div>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 4 }}>
            Final app: real-time Socket.io stream of student responses.
          </div>
        </div>
      </div>
    </section>
  );
}
