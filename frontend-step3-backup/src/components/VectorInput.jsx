function updateIndex(arr, index, value) {
  return arr.map((cell, i) => (i === index ? Number(value) : cell));
}

export default function VectorInput({ dim, v, u, alpha, beta, onVectorChange, onScalarChange }) {
  return (
    <div className="card-section">
      <div className="section-title">Vectors</div>

      <div className="vec-row">
        <span className="vec-label v">v</span>
        {v.map((value, index) => (
          <input
            key={`v-${index}`}
            className={`vec-input ${dim === 2 && index === 2 ? 'd3-only' : ''}`}
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => onVectorChange('v', updateIndex(v, index, e.target.value))}
          />
        ))}
      </div>

      <div className="vec-row">
        <span className="vec-label u">u</span>
        {u.map((value, index) => (
          <input
            key={`u-${index}`}
            className={`vec-input ${dim === 2 && index === 2 ? 'd3-only' : ''}`}
            type="number"
            step="0.1"
            value={value}
            onChange={(e) => onVectorChange('u', updateIndex(u, index, e.target.value))}
          />
        ))}
      </div>

      <div className="coef-row">
        <div className="coef-label"><span>α (alpha)</span><code>{Number(alpha).toFixed(1)}</code></div>
        <input type="range" min="-3" max="3" step="0.1" value={alpha} onChange={(e) => onScalarChange('alpha', Number(e.target.value))} />
      </div>

      <div className="coef-row">
        <div className="coef-label"><span>β (beta)</span><code>{Number(beta).toFixed(1)}</code></div>
        <input type="range" min="-3" max="3" step="0.1" value={beta} onChange={(e) => onScalarChange('beta', Number(e.target.value))} />
      </div>
    </div>
  );
}
