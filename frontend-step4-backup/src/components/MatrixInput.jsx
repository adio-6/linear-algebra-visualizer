import { PRESET_NAMES, useVisualizerStore } from '../store/useVisualizerStore.js';

function updateCell(A, row, col, value) {
  return A.map((r, i) => r.map((cell, j) => (i === row && j === col ? Number(value) : cell)));
}

export default function MatrixInput() {
  const dim = useVisualizerStore((s) => s.dim);
  const A = useVisualizerStore((s) => s.A);
  const setMatrix = useVisualizerStore((s) => s.setMatrix);
  const applyPreset = useVisualizerStore((s) => s.applyPreset);

  return (
    <div className="card-section">
      <div className="section-title">
        Matrix A
        <span id="matrixSizeLbl" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-subtle)', textTransform: 'none', letterSpacing: 0 }}>
          {dim}×{dim}
        </span>
      </div>

      <div className="matrix-grid">
        {A.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              className="matrix-cell"
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setMatrix(updateCell(A, rowIndex, colIndex, e.target.value))}
            />
          ))
        )}
      </div>

      <div className="preset-grid">
        {PRESET_NAMES.map((name) => (
          <button key={name} className="preset-btn" onClick={() => applyPreset(name)}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
