import Canvas2D from './Canvas2D.jsx';
import Canvas3D from './Canvas3D.jsx';
import { currentDet, fmt } from '../math/linearAlgebra.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

const titles = {
  transformation: 'Linear Transformation',
  combination: 'Linear Combination',
  determinant: 'Determinant',
  eigen: 'Eigenvectors',
  span: 'Span / Basis',
  basis: 'Change of Basis',
};

export default function Visualization({ role = 'lecturer', followLecturer = false, onCameraChange } = {}) {
  const dim = useVisualizerStore((s) => s.dim);
  const concept = useVisualizerStore((s) => s.concept);
  const A = useVisualizerStore((s) => s.A);
  const v = useVisualizerStore((s) => s.v);
  const u = useVisualizerStore((s) => s.u);
  const alpha = useVisualizerStore((s) => s.alpha);
  const beta = useVisualizerStore((s) => s.beta);
  const t = useVisualizerStore((s) => s.t);

  const state = { dim, concept, A, v, u, alpha, beta, t };
  const det = currentDet(A);
  const detClass = Math.abs(det) < 0.05 ? 'warning' : det < 0 ? 'danger' : 'ok';

  return (
    <section className="viz-card card">
      <div className="viz-toolbar">
        <h2>{titles[concept]} · {dim}D</h2>
        <div className="meta">
          <span>{dim === 2 ? 'Canvas 2D connected' : 'React Three Fiber 3D'}</span> · <span>Showing: <b>{t < 1 ? 'animating' : 'transformed'}</b></span>
        </div>
      </div>

      <div className="canvas-wrap">
        {dim === 2 ? <Canvas2D state={state} /> : <Canvas3D role={role} followLecturer={followLecturer} onCameraChange={onCameraChange} />}

        {dim === 2 ? (
          <div className="viz-overlay d2-only">
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-i)' }} /> î = A·(1,0)</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-j)' }} /> ĵ = A·(0,1)</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-v)' }} /> v → A·v</div>
            {(concept === 'combination' || concept === 'span' || concept === 'basis') && (
              <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-u)' }} /> u / combination</div>
            )}
          </div>
        ) : (
          <div className="viz-overlay d3-only">
            <div className="overlay-chip"><span className="swatch" style={{ background: '#ef4444' }} /> x · A·e₁</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: '#22c55e' }} /> y · A·e₂</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: '#3b82f6' }} /> z · A·e₃</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-v)' }} /> v → A·v</div>
          </div>
        )}

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
