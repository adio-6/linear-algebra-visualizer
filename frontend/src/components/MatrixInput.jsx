import { PRESET_NAMES, useVisualizerStore } from '../store/useVisualizerStore.js';

function updateCell(A, row, col, value) {
  return A.map((r, i) => r.map((cell, j) => (i === row && j === col ? Number(value) : cell)));
}

export default function MatrixInput() {
  const dim = useVisualizerStore((s) => s.dim);
  const A = useVisualizerStore((s) => s.A);
  const concept = useVisualizerStore((s) => s.concept);
  const setMatrix = useVisualizerStore((s) => s.setMatrix);
  const applyPreset = useVisualizerStore((s) => s.applyPreset);

  const matrixRelevantConcepts = ['transformation', 'determinant', 'eigen'];
  const isMatrixRelevant = matrixRelevantConcepts.includes(concept);

  return (
    <div className={`card-section matrix-input-card ${!isMatrixRelevant ? 'matrix-input-disabled' : ''}`}>
      <div className="section-title">
        Matrix A
        <span id="matrixSizeLbl" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-subtle)', textTransform: 'none', letterSpacing: 0 }}>
          {dim}×{dim}
        </span>
      </div>

      <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${dim}, 1fr)` }}>
        {A.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              className="matrix-cell"
              type="number"
              step="1"
              value={value}
              disabled={!isMatrixRelevant}
              onChange={(e) => setMatrix(updateCell(A, rowIndex, colIndex, e.target.value))}
            />
          ))
        )}
      </div>

      <div className="preset-grid">
        {PRESET_NAMES.map((name) => (
          <button key={name} className="preset-btn" disabled={!isMatrixRelevant} onClick={() => applyPreset(name)}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      {!isMatrixRelevant && (
        <div className="matrix-disabled-hint">Matrix A is not used in this concept.</div>
      )}
    </div>
  );
}
