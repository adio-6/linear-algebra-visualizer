import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export default function AnimationControls() {
  const animSpeed = useVisualizerStore((s) => s.animSpeed);
  const setAnimSpeed = useVisualizerStore((s) => s.setAnimSpeed);
  const setT = useVisualizerStore((s) => s.setT);
  const resetState = useVisualizerStore((s) => s.resetState);
  const speedRef = useRef(animSpeed);
  const animationRef = useRef(null);

  useEffect(() => {
    speedRef.current = animSpeed;
  }, [animSpeed]);

  useEffect(() => () => cancelAnimationFrame(animationRef.current), []);

  function animate() {
    cancelAnimationFrame(animationRef.current);
    const durationMs = 1600;
    const startedAt = performance.now();
    const speedAtStart = speedRef.current;

    const tick = (now) => {
      const elapsed = (now - startedAt) * speedAtStart;
      const p = Math.min(1, elapsed / durationMs);
      const eased = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
      setT(eased);

      if (p < 1) {
        animationRef.current = requestAnimationFrame(tick);
      } else {
        setT(1);
      }
    };

    setT(0);
    animationRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    cancelAnimationFrame(animationRef.current);
    resetState();
  }

  return (
    <div className="card-section">
      <div className="section-title">Animation</div>
      <div className="btn-row" style={{ marginBottom: 10 }}>
        <button className="btn primary" onClick={animate}>▶ Animate</button>
        <button className="btn" onClick={reset}>Reset</button>
      </div>
      <div className="coef-label"><span>Speed</span><code>{Number(animSpeed).toFixed(1)}×</code></div>
      <input type="range" min="0.3" max="2.5" step="0.1" value={animSpeed} onChange={(e) => setAnimSpeed(Number(e.target.value))} />

      <div className="future-row">
        <span className="future-btn" title="Coming soon">📤 Export snapshot</span>
      </div>
    </div>
  );
}
