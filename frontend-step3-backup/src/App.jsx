import { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ConceptSelector from './components/ConceptSelector.jsx';
import MatrixInput from './components/MatrixInput.jsx';
import VectorInput from './components/VectorInput.jsx';
import AnimationControls from './components/AnimationControls.jsx';
import Visualization from './components/Visualization.jsx';
import InsightPanel from './components/InsightPanel.jsx';
import QuizCard from './components/QuizCard.jsx';
import Roadmap from './components/Roadmap.jsx';
import Footer from './components/Footer.jsx';

const initialState = {
  dim: 2,
  concept: 'transformation',
  A: [[1, 0], [0, 1]],
  v: [2, 1],
  u: [-1, 2],
  alpha: 1,
  beta: 1,
  speed: 1,
  t: 1,
};

export default function App() {
  const [state, setState] = useState(initialState);
  const animationRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dim-3', state.dim === 3);
  }, [state.dim]);

  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);

  function setDim(dim) {
    setState((prev) => {
      if (prev.dim === dim) return prev;
      return {
        ...prev,
        dim,
        t: 1,
        A: dim === 3 ? [[1, 0, 0], [0, 1, 0], [0, 0, 1]] : [[1, 0], [0, 1]],
        v: dim === 3 ? [2, 1, 1] : [2, 1],
        u: dim === 3 ? [-1, 2, 1] : [-1, 2],
      };
    });
  }

  function setConcept(concept) {
    setState((prev) => ({ ...prev, concept, t: 1 }));
  }

  function setMatrix(A) {
    setState((prev) => ({ ...prev, A, t: 1 }));
  }

  function setVector(key, value) {
    setState((prev) => ({ ...prev, [key]: value, t: 1 }));
  }

  function setScalar(key, value) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    cancelAnimationFrame(animationRef.current);
    setState(initialState);
  }

  function animate() {
    cancelAnimationFrame(animationRef.current);
    const durationMs = 1600;
    const startedAt = performance.now();
    const speedAtStart = state.speed;

    const tick = (now) => {
      const elapsed = (now - startedAt) * speedAtStart;
      const p = Math.min(1, elapsed / durationMs);
      const eased = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;

      setState((prev) => ({ ...prev, t: eased }));

      if (p < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        setState((prev) => ({ ...prev, t: 1 }));
      }
    };

    setState((prev) => ({ ...prev, t: 0 }));
    animationRef.current = requestAnimationFrame(tick);
  }

  return (
    <div className="app">
      <Header dim={state.dim} onDimChange={setDim} />

      <main>
        <aside className="left-panel">
          <div className="card">
            <ConceptSelector concept={state.concept} onConceptChange={setConcept} />
            <MatrixInput dim={state.dim} A={state.A} onChange={setMatrix} />
            <VectorInput
              dim={state.dim}
              v={state.v}
              u={state.u}
              alpha={state.alpha}
              beta={state.beta}
              onVectorChange={setVector}
              onScalarChange={setScalar}
            />
            <AnimationControls
              speed={state.speed}
              onSpeedChange={(value) => setScalar('speed', value)}
              onReset={reset}
              onAnimate={animate}
            />
          </div>
        </aside>

        <Visualization state={state} />
        <InsightPanel state={state} />
      </main>

      <QuizCard concept={state.concept} />
      <Roadmap />
      <Footer />
    </div>
  );
}
