import { useEffect, useRef } from 'react';
import { determinant, eigenInfo, fmt, lerpMatrix, linComb, matVec } from '../math/linearAlgebra.js';

function getCSS(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}


function finitePoint(point) {
  return Array.isArray(point) && point.length >= 2 && Number.isFinite(point[0]) && Number.isFinite(point[1]);
}

function maxAbsCoord(points) {
  return points.reduce((max, point) => {
    if (!finitePoint(point)) return max;
    return Math.max(max, Math.abs(point[0]), Math.abs(point[1]));
  }, 0);
}

function computeAdaptiveWorldExtent(state, matrix) {
  const points = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    state.v,
    state.u,
  ];

  const basisPoints = [
    [1, 0],
    [0, 1],
    [1, 1],
    [-1, 0],
    [0, -1],
    [-1, -1],
  ];

  basisPoints.forEach((point) => points.push(matVec(matrix, point)));

  if (finitePoint(state.v)) points.push(matVec(matrix, state.v));
  if (finitePoint(state.u)) points.push(matVec(matrix, state.u));

  if (finitePoint(state.v) && finitePoint(state.u)) {
    points.push([state.v[0] + state.u[0], state.v[1] + state.u[1]]);
    points.push(linComb(state.alpha || 0, state.u, state.beta || 0, state.v));
    points.push([state.alpha * state.u[0], state.alpha * state.u[1]]);
    points.push([state.beta * state.v[0], state.beta * state.v[1]]);
  }

  const rawExtent = maxAbsCoord(points);
  const paddedExtent = rawExtent * 1.22 + 1;
  return Math.max(5, Math.min(36, paddedExtent));
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

      const t = typeof state.t === 'number' ? state.t : 1;
      const Mt = lerpMatrix(state.A, t);
      const worldExtent = computeAdaptiveWorldExtent(state, Mt);
      const manualZoom = Number.isFinite(state.canvas2DZoom) ? state.canvas2DZoom : 1;
      const unit = (Math.min(width, height) / (worldExtent * 2)) * manualZoom;

      const tx = (x) => cx + x * unit;
      const ty = (y) => cy - y * unit;

      const labelBoxes = [];

      function boxesOverlap(a, b) {
        return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

      function drawRoundedRect(x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

      function drawCanvasLabel(text, anchorX, anchorY, color, options = {}) {
        const font = options.font || '700 13px Inter, sans-serif';
        const paddingX = options.paddingX ?? 6;
        const paddingY = options.paddingY ?? 4;
        const margin = 8;
        const candidates = [
          [0, 0],
          [0, -18],
          [0, 18],
          [18, 0],
          [-18, 0],
          [16, -16],
          [-16, 16],
          [16, 16],
          [-16, -16],
          [28, -24],
          [-28, 24],
          [28, 24],
          [-28, -24],
        ];

        ctx.save();
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const textHeight = options.textHeight || 16;
        const boxWidth = textWidth + paddingX * 2;
        const boxHeight = textHeight + paddingY * 2;

        let best = null;
        for (const [dx, dy] of candidates) {
          const centerX = clamp(anchorX + dx, margin + boxWidth / 2, width - margin - boxWidth / 2);
          const centerY = clamp(anchorY + dy, margin + boxHeight / 2, height - margin - boxHeight / 2);
          const box = {
            x: centerX - boxWidth / 2,
            y: centerY - boxHeight / 2,
            w: boxWidth,
            h: boxHeight,
          };
          if (!labelBoxes.some((existing) => boxesOverlap(box, existing))) {
            best = { centerX, centerY, box };
            break;
          }
          if (!best) best = { centerX, centerY, box };
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
        drawRoundedRect(best.box.x, best.box.y, best.box.w, best.box.h, 7);
        ctx.fill();

        ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = 1;
        drawRoundedRect(best.box.x, best.box.y, best.box.w, best.box.h, 7);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillText(text, best.centerX, best.centerY);
        labelBoxes.push(best.box);
        ctx.restore();
      }

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

      function drawArrow(from, to, color, lineWidth = 3, label = null, labelOptions = {}) {
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
          const labelDistance = labelOptions.distance ?? (lineWidth >= 4 ? 24 : 20);
          const perpendicularOffset = labelOptions.perp ?? 0;
          const anchorX = x2 + ux * labelDistance + -uy * perpendicularOffset;
          const anchorY = y2 + uy * labelDistance + ux * perpendicularOffset;
          drawCanvasLabel(label, anchorX, anchorY, color, labelOptions);
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
            drawCanvasLabel(`eigen dir  λ=${fmt(pair.lambda)}`, tx(pair.v[0] * 4.2), ty(pair.v[1] * 4.2), color, {
              font: '700 12px JetBrains Mono, monospace',
            });
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

      }

      const iHat = matVec(Mt, [1, 0]);
      const jHat = matVec(Mt, [0, 1]);
      drawArrow([0, 0], iHat, getCSS('--vec-i'), 4, 'î', { perp: -10, distance: 20 });
      drawArrow([0, 0], jHat, getCSS('--vec-j'), 4, 'ĵ', { perp: 10, distance: 20 });

      if (state.concept === 'combination') {
        const au = [state.alpha * state.u[0], state.alpha * state.u[1]];
        const bv = [state.beta * state.v[0], state.beta * state.v[1]];
        const sum = linComb(state.alpha, state.u, state.beta, state.v);

        drawArrow([0, 0], state.u, `${getCSS('--vec-u')}88`, 2, 'u', { perp: -14, distance: 18 });
        drawArrow([0, 0], state.v, `${getCSS('--vec-v')}88`, 2, 'v', { perp: 14, distance: 18 });
        drawArrow([0, 0], au, getCSS('--vec-u'), 3, 'α·u', { perp: -16, distance: 22 });
        drawArrow(au, [au[0] + bv[0], au[1] + bv[1]], getCSS('--vec-v'), 3, 'β·v', { perp: 16, distance: 22 });
        drawArrow([0, 0], sum, getCSS('--primary'), 4, 'αu+βv', { perp: -20, distance: 28 });
      } else {
        const Av = matVec(Mt, state.v);
        if (t < 0.99) drawArrow([0, 0], state.v, `${getCSS('--vec-v')}55`, 2);
        drawArrow([0, 0], Av, getCSS('--vec-v'), 4, 'A·v', { perp: -14, distance: 26 });

        if (state.concept === 'span' || state.concept === 'basis') {
          const Au = matVec(Mt, state.u);
          drawArrow([0, 0], Au, getCSS('--vec-u'), 4, state.concept === 'basis' ? 'u' : 'A·u', { perp: 14, distance: 24 });
          if (state.concept === 'basis') drawArrow([0, 0], state.v, getCSS('--vec-v'), 4, 'v', { perp: -14, distance: 24 });
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
