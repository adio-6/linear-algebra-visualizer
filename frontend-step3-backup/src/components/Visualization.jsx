import Canvas2D from './Canvas2D.jsx';
import { currentDet, fmt } from '../math/linearAlgebra.js';

const titles = {
  transformation: 'Linear Transformation',
  combination: 'Linear Combination',
  determinant: 'Determinant',
  eigen: 'Eigenvectors',
  span: 'Span / Basis',
  basis: 'Change of Basis',
};

export default function Visualization({ state }) {
  const det = currentDet(state.A);
  const detClass = Math.abs(det) < 0.05 ? 'warning' : det < 0 ? 'danger' : 'ok';

  return (
    <section className="viz-card card">
      <div className="viz-toolbar">
        <h2>{titles[state.concept]} · {state.dim}D</h2>
        <div className="meta">
          <span>{state.dim === 2 ? 'Canvas 2D connected' : '3D placeholder'}</span> · <span>Showing: <b>{state.t < 1 ? 'animating' : 'transformed'}</b></span>
        </div>
      </div>

      <div className="canvas-wrap">
        {state.dim === 2 ? (
          <Canvas2D state={state} />
        ) : (
          <div className="viz-placeholder">
            <div>
              <strong>3D placeholder</strong>
              <div>שלב 3 מחבר את Canvas 2D. בשלב הבא נחבר React Three Fiber לתצוגת 3D.</div>
            </div>
          </div>
        )}

        <div className="viz-overlay d2-only">
          <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-i)' }} /> î = A·(1,0)</div>
          <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-j)' }} /> ĵ = A·(0,1)</div>
          <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-v)' }} /> v → A·v</div>
          {(state.concept === 'combination' || state.concept === 'span' || state.concept === 'basis') && (
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-u)' }} /> u / combination</div>
          )}
        </div>

        <div className="viz-overlay-right">
          <div className="det-readout">
            <div className="lbl">Determinant</div>
            <div className={`val ${detClass}`}>{Math.abs(det) < 0.05 ? '≈ 0' : fmt(det)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
