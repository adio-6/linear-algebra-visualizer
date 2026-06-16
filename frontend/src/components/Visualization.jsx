import { useEffect, useRef } from 'react';
import Canvas2D from './Canvas2D.jsx';
import Canvas3D from './Canvas3D.jsx';
import AbstractSpaceVisualizer from './AbstractSpaceVisualizer.jsx';
import { currentDet, fmt } from '../math/linearAlgebra.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

const titles = {
  transformation: 'Linear Transformation',
  combination: 'Linear Combination',
  determinant: 'Determinant',
  eigen: 'Eigenvectors',
  span: 'Span / Basis',
  basis: 'Change of Basis',
  abstract: 'Abstract Vector Spaces',
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
  const canvas2DZoom = useVisualizerStore((s) => s.canvas2DZoom);
  const canvasWrapRef = useRef(null);
  const setCanvas2DZoom = useVisualizerStore((s) => s.setCanvas2DZoom);
  const zoomIn2D = useVisualizerStore((s) => s.zoomIn2D);
  const zoomOut2D = useVisualizerStore((s) => s.zoomOut2D);
  const resetZoom2D = useVisualizerStore((s) => s.resetZoom2D);

  const state = { dim, concept, A, v, u, alpha, beta, t, canvas2DZoom };

  const det = currentDet(A);
  const areaScale = Math.abs(det);
  const basisArea = Math.abs((v?.[0] ?? 0) * (u?.[1] ?? 0) - (v?.[1] ?? 0) * (u?.[0] ?? 0));

  useEffect(() => {
    const canvasWrap = canvasWrapRef.current;
    if (!canvasWrap || dim !== 2) return undefined;

    const handleWheel = (event) => {
      // When the pointer is over the 2D visualization, the mouse wheel controls only canvas zoom.
      // Outside this area, normal page scrolling is left unchanged.
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      const direction = event.deltaY < 0 ? 1 : -1;
      const nextZoom = Number((canvas2DZoom + direction * 0.12).toFixed(2));
      setCanvas2DZoom(nextZoom);
    };

    canvasWrap.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvasWrap.removeEventListener('wheel', handleWheel);
  }, [canvas2DZoom, dim, setCanvas2DZoom]);

  if (concept === 'abstract') {
    return <AbstractSpaceVisualizer />;
  }

  return (
    <section className="viz-card card">
      <div className="viz-toolbar">
        <h2>{titles[concept]} · {dim}D</h2>
        <div className="meta">
          <span>{dim === 2 ? 'Canvas 2D connected' : 'React Three Fiber 3D'}</span> · <span>Showing: <b>{t < 1 ? 'animating' : 'transformed'}</b></span>
        </div>
      </div>

      <div className="canvas-wrap" ref={canvasWrapRef}>
        {dim === 2 ? <Canvas2D state={state} /> : <Canvas3D role={role} followLecturer={followLecturer} onCameraChange={onCameraChange} />}

        {dim === 2 ? (
          <div className="viz-overlay d2-only">
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-i)' }} /> î = A·(1,0)</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-j)' }} /> ĵ = A·(0,1)</div>
            <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-v)' }} /> v → A·v</div>
            {(concept === 'combination' || concept === 'span' || concept === 'basis') && (
              <div className="overlay-chip"><span className="swatch" style={{ background: 'var(--vec-u)' }} /> u / combination</div>
            )}
            {(concept === 'determinant' || concept === 'transformation') && (
              <div className="overlay-chip area-overlay-chip">AREA = {areaScale < 0.05 ? '≈ 0' : fmt(areaScale)}</div>
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


        {dim === 2 && (
          <div className="zoom-2d-controls" aria-label="2D zoom controls">
            <button type="button" onClick={zoomOut2D} title="Zoom out">−</button>
            <span>{Math.round(canvas2DZoom * 100)}%</span>
            <button type="button" onClick={zoomIn2D} title="Zoom in">+</button>
            <button type="button" onClick={resetZoom2D} title="Reset 2D zoom">Reset</button>
          </div>
        )}
      </div>

      {concept === 'basis' && (
        <div className="viz-stats-row">
          <div className="viz-stat-card">
            <div className="viz-stat-label">Basis area</div>
            <div className="viz-stat-value">|det([v u])| = {basisArea < 0.05 ? '≈ 0' : fmt(basisArea)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
