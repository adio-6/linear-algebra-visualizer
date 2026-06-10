import { useVisualizerStore } from '../store/useVisualizerStore.js';
import { DEFAULT_ANIMATION_DURATION_MS, useVisualizerAnimation } from '../hooks/useVisualizerAnimation.js';

export default function AnimationControls({ onAnimate }) {
  const animSpeed = useVisualizerStore((s) => s.animSpeed);
  const setAnimSpeed = useVisualizerStore((s) => s.setAnimSpeed);
  const resetState = useVisualizerStore((s) => s.resetState);
  const { runAnimation, stopAnimation } = useVisualizerAnimation();

  function animate() {
    const payload = {
      durationMs: DEFAULT_ANIMATION_DURATION_MS,
      startedAt: Date.now(),
      speed: animSpeed,
    };

    runAnimation(payload);
    onAnimate?.(payload);
  }

  function reset() {
    stopAnimation();
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
