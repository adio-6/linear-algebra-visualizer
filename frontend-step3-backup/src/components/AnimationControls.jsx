export default function AnimationControls({ speed, onSpeedChange, onReset, onAnimate }) {
  return (
    <div className="card-section">
      <div className="section-title">Animation</div>
      <div className="btn-row" style={{ marginBottom: 10 }}>
        <button className="btn primary" onClick={onAnimate}>▶ Animate</button>
        <button className="btn" onClick={onReset}>Reset</button>
      </div>
      <div className="coef-label"><span>Speed</span><code>{Number(speed).toFixed(1)}×</code></div>
      <input type="range" min="0.3" max="2.5" step="0.1" value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} />

      <div className="future-row">
        <span className="future-btn" title="Coming soon">📤 Export snapshot</span>
      </div>
    </div>
  );
}
