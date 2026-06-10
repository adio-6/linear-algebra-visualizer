import { useEffect, useRef } from 'react';
import { determinant, eigenInfo, fmt, lerpMatrix, linComb, matVec } from '../math/linearAlgebra.js';

function getCSS(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export default function Canvas2D({ state }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || state.dim !== 2) return undefined;

    let resizeObserver;

    const draw = () => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || 900;
      const height = rect.height || 900;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = width / 2;
      const cy = height / 2;
      const unit = Math.min(width, height) / 11;

      const tx = (x) => cx + x * unit;
      const ty = (y) => cy - y * unit;

      function drawGrid(M, highlight = false) {
        const range = 8;
        ctx.lineWidth = 1;
        ctx.strokeStyle = getCSS('--grid-line');
        ctx.beginPath();

        for (let i = -range; i <= range; i += 1) {
          const p1 = matVec(M, [i, -range]);
          const p2 = matVec(M, [i, range]);
          ctx.moveTo(tx(p1[0]), ty(p1[1]));
          ctx.lineTo(tx(p2[0]), ty(p2[1]));

          const q1 = matVec(M, [-range, i]);
          const q2 = matVec(M, [range, i]);
          ctx.moveTo(tx(q1[0]), ty(q1[1]));
          ctx.lineTo(tx(q2[0]), ty(q2[1]));
        }
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = highlight ? getCSS('--primary') : getCSS('--grid-axis');
        ctx.beginPath();
        const xa1 = matVec(M, [-range, 0]);
        const xa2 = matVec(M, [range, 0]);
        const ya1 = matVec(M, [0, -range]);
        const ya2 = matVec(M, [0, range]);
        ctx.moveTo(tx(xa1[0]), ty(xa1[1]));
        ctx.lineTo(tx(xa2[0]), ty(xa2[1]));
        ctx.moveTo(tx(ya1[0]), ty(ya1[1]));
        ctx.lineTo(tx(ya2[0]), ty(ya2[1]));
        ctx.stroke();
      }

      function drawArrow(from, to, color, lineWidth = 3, label = null) {
        const x1 = tx(from[0]);
        const y1 = ty(from[1]);
        const x2 = tx(to[0]);
        const y2 = ty(to[1]);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len < 0.5) return;

        const ux = dx / len;
        const uy = dy / len;
        const head = Math.min(14, len * 0.4);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2 - ux * head * 0.6, y2 - uy * head * 0.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - ux * head - uy * head * 0.5, y2 - uy * head + ux * head * 0.5);
        ctx.lineTo(x2 - ux * head + uy * head * 0.5, y2 - uy * head - ux * head * 0.5);
        ctx.closePath();
        ctx.fill();

        if (label) {
          ctx.font = '600 13px Inter, sans-serif';
          ctx.fillStyle = color;
          ctx.fillText(label, x2 + ux * 12, y2 + uy * 12 + 4);
        }
      }

      function drawParallelogram(M, fill, stroke) {
        const p0 = [0, 0];
        const p1 = matVec(M, [1, 0]);
        const p2 = matVec(M, [1, 1]);
        const p3 = matVec(M, [0, 1]);
        ctx.beginPath();
        ctx.moveTo(tx(p0[0]), ty(p0[1]));
        ctx.lineTo(tx(p1[0]), ty(p1[1]));
        ctx.lineTo(tx(p2[0]), ty(p2[1]));
        ctx.lineTo(tx(p3[0]), ty(p3[1]));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = stroke;
        ctx.stroke();
      }

      function drawSpanLine(vec, color) {
        const r = 20;
        const n = Math.hypot(vec[0], vec[1]);
        if (n < 1e-6) return;
        const unitVec = [vec[0] / n, vec[1] / n];
        const p1 = [unitVec[0] * r, unitVec[1] * r];
        const p2 = [-unitVec[0] * r, -unitVec[1] * r];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(tx(p1[0]), ty(p1[1]));
        ctx.lineTo(tx(p2[0]), ty(p2[1]));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.clearRect(0, 0, width, height);

      const t = typeof state.t === 'number' ? state.t : 1;
      const Mt = lerpMatrix(state.A, t);
      const det = determinant(Mt);

      ctx.save();
      ctx.globalAlpha = 0.35;
      drawGrid([[1, 0], [0, 1]]);
      ctx.restore();

      drawGrid(Mt, true);

      if (state.concept === 'determinant' || state.concept === 'transformation') {
        let fill = 'rgba(79, 70, 229, 0.18)';
        let stroke = getCSS('--primary');
        if (det < 0) {
          fill = 'rgba(220, 38, 38, 0.18)';
          stroke = getCSS('--danger');
        }
        if (Math.abs(det) < 0.05) {
          fill = 'rgba(245, 158, 11, 0.22)';
          stroke = getCSS('--warning');
        }
        drawParallelogram(Mt, fill, stroke);

        const center = matVec(Mt, [0.5, 0.5]);
        ctx.font = '600 13px JetBrains Mono, monospace';
        ctx.fillStyle = stroke;
        ctx.textAlign = 'center';
        ctx.fillText(`area = ${Math.abs(det).toFixed(2)}`, tx(center[0]), ty(center[1]));
        ctx.textAlign = 'start';
      }

      if (state.concept === 'span') {
        drawSpanLine(state.v, getCSS('--vec-v'));
        drawSpanLine(state.u, getCSS('--vec-u'));
      }

      if (state.concept === 'eigen') {
        const info = eigenInfo(state.A);
        if (info.real) {
          const colors = [getCSS('--accent'), getCSS('--warning')];
          info.pairs.forEach((pair, index) => {
            const color = colors[index % colors.length];
            drawSpanLine(pair.v, color);
            ctx.font = '600 12px JetBrains Mono, monospace';
            ctx.fillStyle = color;
            ctx.fillText(`eigen dir  λ=${fmt(pair.lambda)}`, tx(pair.v[0] * 4.2), ty(pair.v[1] * 4.2));
          });
        } else {
          ctx.fillStyle = 'rgba(220,38,38,0.95)';
          ctx.font = '600 14px Inter, sans-serif';
          ctx.fillText('No real eigenvectors — this transformation rotates every real direction.', 18, height - 22);
        }
      }

      if (state.concept === 'basis') {
        const vuDet = state.v[0] * state.u[1] - state.v[1] * state.u[0];
        const valid = Math.abs(vuDet) > 0.05;
        const fill = valid ? 'rgba(14,165,233,0.18)' : 'rgba(245,158,11,0.22)';
        const stroke = valid ? getCSS('--accent') : getCSS('--warning');
        ctx.beginPath();
        ctx.moveTo(tx(0), ty(0));
        ctx.lineTo(tx(state.v[0]), ty(state.v[1]));
        ctx.lineTo(tx(state.v[0] + state.u[0]), ty(state.v[1] + state.u[1]));
        ctx.lineTo(tx(state.u[0]), ty(state.u[1]));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '600 13px JetBrains Mono, monospace';
        ctx.fillStyle = stroke;
        ctx.textAlign = 'center';
        ctx.fillText(valid ? `new basis · area ${Math.abs(vuDet).toFixed(2)}` : 'not a basis', tx((state.v[0] + state.u[0]) / 2), ty((state.v[1] + state.u[1]) / 2));
        ctx.textAlign = 'start';
      }

      const iHat = matVec(Mt, [1, 0]);
      const jHat = matVec(Mt, [0, 1]);
      drawArrow([0, 0], iHat, getCSS('--vec-i'), 4, 'î');
      drawArrow([0, 0], jHat, getCSS('--vec-j'), 4, 'ĵ');

      if (state.concept === 'combination') {
        const au = [state.alpha * state.u[0], state.alpha * state.u[1]];
        const bv = [state.beta * state.v[0], state.beta * state.v[1]];
        const sum = linComb(state.alpha, state.u, state.beta, state.v);

        drawArrow([0, 0], state.u, `${getCSS('--vec-u')}88`, 2, 'u');
        drawArrow([0, 0], state.v, `${getCSS('--vec-v')}88`, 2, 'v');
        drawArrow([0, 0], au, getCSS('--vec-u'), 3, 'α·u');
        drawArrow(au, [au[0] + bv[0], au[1] + bv[1]], getCSS('--vec-v'), 3, 'β·v');
        drawArrow([0, 0], sum, getCSS('--primary'), 4, 'αu+βv');
      } else {
        const Av = matVec(Mt, state.v);
        if (t < 0.99) drawArrow([0, 0], state.v, `${getCSS('--vec-v')}55`, 2);
        drawArrow([0, 0], Av, getCSS('--vec-v'), 4, 'A·v');

        if (state.concept === 'span' || state.concept === 'basis') {
          const Au = matVec(Mt, state.u);
          drawArrow([0, 0], Au, getCSS('--vec-u'), 4, state.concept === 'basis' ? 'u' : 'A·u');
          if (state.concept === 'basis') drawArrow([0, 0], state.v, getCSS('--vec-v'), 4, 'v');
        }
      }
    };

    draw();
    resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', draw);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', draw);
    };
  }, [state]);

  return <canvas ref={canvasRef} className="d2-only" width="900" height="900" aria-label="2D linear algebra visualization" />;
}
