import { useVisualizerStore } from '../store/useVisualizerStore.js';

function updateIndex(arr, index, value) {
  return arr.map((cell, i) => (i === index ? Number(value) : cell));
}

function VectorRow({ label, labelClass, values, dim, onChange, disabled = false, hint = '' }) {
  return (
    <div className={`vector-row ${disabled ? 'vector-row-disabled' : ''}`}>
      <span className={`vec-label ${labelClass}`}>{label}</span>
      <div className="vector-values-wrap">
        <div className="vector-values" aria-label={`${label} vector values`}>
          {values.slice(0, dim).map((value, index) => (
            <input
              key={`${label}-${index}`}
              className="vec-input"
              type="number"
              step="1"
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(index, e.target.value)}
            />
          ))}
        </div>
        {disabled && hint ? <div className="vector-disabled-hint">{hint}</div> : null}
      </div>
    </div>
  );
}

export default function VectorInput() {
  const dim = useVisualizerStore((s) => s.dim);
  const concept = useVisualizerStore((s) => s.concept);
  const v = useVisualizerStore((s) => s.v);
  const u = useVisualizerStore((s) => s.u);
  const alpha = useVisualizerStore((s) => s.alpha);
  const beta = useVisualizerStore((s) => s.beta);
  const setVector = useVisualizerStore((s) => s.setVector);
  const setAlpha = useVisualizerStore((s) => s.setAlpha);
  const setBeta = useVisualizerStore((s) => s.setBeta);
  const uRelevantConcepts = ['combination', 'span', 'basis'];
  const isURelevant = uRelevantConcepts.includes(concept);

  return (
    <div className="card-section vector-input-card">
      <div className="section-title">Vectors</div>

      <div className="vector-stack">
        <VectorRow
          label="v"
          labelClass="v"
          values={v}
          dim={dim}
          onChange={(index, value) => setVector('v', updateIndex(v, index, value))}
        />

        <VectorRow
          label="u"
          labelClass="u"
          values={u}
          dim={dim}
          disabled={!isURelevant}
          hint="u is used for combinations, span, and basis."
          onChange={(index, value) => setVector('u', updateIndex(u, index, value))}
        />
      </div>

      <div className="coef-row">
        <div className="coef-label">
          <span>α (alpha)</span>
          <code>{Number(alpha).toFixed(1)}</code>
        </div>
        <input
          type="range"
          min="-3"
          max="3"
          step="1"
          value={alpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
        />
      </div>

      <div className="coef-row">
        <div className="coef-label">
          <span>β (beta)</span>
          <code>{Number(beta).toFixed(1)}</code>
        </div>
        <input
          type="range"
          min="-3"
          max="3"
          step="1"
          value={beta}
          onChange={(e) => setBeta(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
