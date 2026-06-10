import { useVisualizerStore } from '../store/useVisualizerStore.js';

function updateIndex(arr, index, value) {
  return arr.map((cell, i) => (i === index ? Number(value) : cell));
}

export default function VectorInput() {
  const dim = useVisualizerStore((s) => s.dim);
  const v = useVisualizerStore((s) => s.v);
  const u = useVisualizerStore((s) => s.u);
  const alpha = useVisualizerStore((s) => s.alpha);
  const beta = useVisualizerStore((s) => s.beta);
  const setVector = useVisualizerStore((s) => s.setVector);
  const setAlpha = useVisualizerStore((s) => s.setAlpha);
  const setBeta = useVisualizerStore((s) => s.setBeta);

  return (
    <div className="card-section">
      <div className="section-title">Vectors</div>

      <div className="vec-row">
        <span className="vec-label v">v</span>
        {v.slice(0, dim).map((value, index) => (
          <input
            key={`v-${index}`}
            className="vec-input"
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setVector('v', updateIndex(v, index, e.target.value))}
          />
        ))}
      </div>

      <div className="vec-row">
        <span className="vec-label u">u</span>
        {u.slice(0, dim).map((value, index) => (
          <input
            key={`u-${index}`}
            className="vec-input"
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => setVector('u', updateIndex(u, index, e.target.value))}
          />
        ))}
      </div>

      <div className="coef-row">
        <div className="coef-label"><span>α (alpha)</span><code>{Number(alpha).toFixed(1)}</code></div>
        <input type="range" min="-3" max="3" step="0.1" value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
      </div>

      <div className="coef-row">
        <div className="coef-label"><span>β (beta)</span><code>{Number(beta).toFixed(1)}</code></div>
        <input type="range" min="-3" max="3" step="0.1" value={beta} onChange={(e) => setBeta(Number(e.target.value))} />
      </div>
    </div>
  );
}
