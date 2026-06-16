import { fmt } from '../math/linearAlgebra.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

function combineArrays(alpha, a, beta, b) {
  return a.map((value, index) => alpha * value + beta * b[index]);
}

function combineMatrices(alpha, A, beta, B) {
  return A.map((row, rowIndex) => row.map((value, colIndex) => alpha * value + beta * B[rowIndex][colIndex]));
}

function polynomialToText(coeffs, name = '') {
  const [a, b, c] = coeffs;
  const pieces = [
    `${fmt(a)}`,
    `${fmt(b)}x`,
    `${fmt(c)}x²`,
  ];
  return `${name ? `${name}(x) = ` : ''}${pieces.join(' + ').replace(/\+ -/g, '- ')}`;
}


function polynomialValue(coeffs, x) {
  const [a, b, c] = coeffs;
  return a + b * x + c * x * x;
}

function makePolynomialPath(coeffs, range) {
  const width = 440;
  const height = 190;
  const points = [];
  const minX = -5;
  const maxX = 5;
  const minY = range.minY;
  const maxY = range.maxY;

  for (let i = 0; i <= 120; i += 1) {
    const ratio = i / 120;
    const x = minX + ratio * (maxX - minX);
    const y = polynomialValue(coeffs, x);
    const px = ratio * width;
    const py = height - ((y - minY) / (maxY - minY)) * height;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

function getPolynomialRange(polynomialP, polynomialQ, result) {
  const values = [];
  for (let i = 0; i <= 120; i += 1) {
    const x = -5 + (i / 120) * 10;
    values.push(
      polynomialValue(polynomialP, x),
      polynomialValue(polynomialQ, x),
      polynomialValue(result, x),
    );
  }

  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = Math.max(rawMax - rawMin, 1);
  const padding = span * 0.12;

  return {
    minY: rawMin - padding,
    maxY: rawMax + padding,
  };
}

function PolynomialGraph({ polynomialP, polynomialQ, result }) {
  const range = getPolynomialRange(polynomialP, polynomialQ, result);
  const width = 440;
  const height = 190;
  const minX = -5;
  const maxX = 5;
  const ySpan = range.maxY - range.minY;
  const zeroX = ((0 - minX) / (maxX - minX)) * width;
  const zeroY = height - ((0 - range.minY) / ySpan) * height;
  const clampedZeroY = Math.max(0, Math.min(height, zeroY));

  return (
    <div className="function-plot-card polynomial-plot-card" aria-label="Polynomial linear combination plot">
      <div className="plot-title-row">
        <div>
          <div className="abstract-object-title">Graph view</div>
          <div className="plot-caption">The same abstract objects are shown as curves over x ∈ [-5, 5].</div>
        </div>
      </div>
      <svg viewBox="0 0 440 190" role="img">
        <line x1="0" y1={clampedZeroY} x2="440" y2={clampedZeroY} className="plot-axis" />
        <line x1={zeroX} y1="0" x2={zeroX} y2="190" className="plot-axis" />
        <path d={makePolynomialPath(polynomialP, range)} className="plot-line plot-f" />
        <path d={makePolynomialPath(polynomialQ, range)} className="plot-line plot-g" />
        <path d={makePolynomialPath(result, range)} className="plot-line plot-h" />
      </svg>
      <div className="plot-legend">
        <span><i className="legend-dot f" />p(x)</span>
        <span><i className="legend-dot g" />q(x)</span>
        <span><i className="legend-dot h" />r(x) = αp(x) + βq(x)</span>
      </div>
    </div>
  );
}


const functionPairs = {
  trig: {
    title: 'Trigonometric functions',
    fLabel: 'f(x) = sin(x)',
    gLabel: 'g(x) = cos(x)',
    shortF: 'sin(x)',
    shortG: 'cos(x)',
    domain: [-Math.PI, Math.PI],
    f: (x) => Math.sin(x),
    g: (x) => Math.cos(x),
  },
  exponential: {
    title: 'Exponential growth and decay',
    fLabel: 'f(x) = eˣ',
    gLabel: 'g(x) = e⁻ˣ',
    shortF: 'eˣ',
    shortG: 'e⁻ˣ',
    domain: [-2.5, 2.5],
    f: (x) => Math.exp(x),
    g: (x) => Math.exp(-x),
  },
  gaussian: {
    title: 'Gaussian-like functions',
    fLabel: 'f(x) = e⁻ˣ²',
    gLabel: 'g(x) = x·e⁻ˣ²',
    shortF: 'e⁻ˣ²',
    shortG: 'x·e⁻ˣ²',
    domain: [-3, 3],
    f: (x) => Math.exp(-x * x),
    g: (x) => x * Math.exp(-x * x),
  },
};

function getFunctionRange(pair, alpha, beta) {
  const values = [];
  const [minX, maxX] = pair.domain;

  for (let i = 0; i <= 120; i += 1) {
    const x = minX + (i / 120) * (maxX - minX);
    const f = pair.f(x);
    const g = pair.g(x);
    values.push(f, g, alpha * f + beta * g);
  }

  const rawMin = Math.min(...values, 0);
  const rawMax = Math.max(...values, 0);
  const span = Math.max(rawMax - rawMin, 1);
  const padding = span * 0.12;

  return {
    minY: rawMin - padding,
    maxY: rawMax + padding,
  };
}

function makeFunctionPath(fn, domain, range) {
  const width = 440;
  const height = 170;
  const points = [];
  const [minX, maxX] = domain;
  const minY = range.minY;
  const maxY = range.maxY;

  for (let i = 0; i <= 120; i += 1) {
    const ratio = i / 120;
    const x = minX + ratio * (maxX - minX);
    const y = fn(x);
    const px = ratio * width;
    const py = height - ((y - minY) / (maxY - minY)) * height;
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

function FormulaCard({ title, children }) {
  return (
    <div className="abstract-object-card">
      <div className="abstract-object-title">{title}</div>
      <div className="abstract-object-body">{children}</div>
    </div>
  );
}

function MatrixBox({ matrix, label }) {
  return (
    <div className="abstract-matrix-box">
      {label && <div className="abstract-matrix-label">{label}</div>}
      <div className="abstract-mini-matrix">
        {matrix.flat().map((value, index) => <span key={`${label}-${index}`}>{fmt(value)}</span>)}
      </div>
    </div>
  );
}

function PolynomialsView({ alpha, beta, polynomialP, polynomialQ }) {
  const result = combineArrays(alpha, polynomialP, beta, polynomialQ);

  return (
    <>
      <div className="abstract-object-grid">
        <FormulaCard title="Object 1">{polynomialToText(polynomialP, 'p')}</FormulaCard>
        <FormulaCard title="Object 2">{polynomialToText(polynomialQ, 'q')}</FormulaCard>
        <FormulaCard title="Linear combination">αp(x) + βq(x)</FormulaCard>
        <FormulaCard title="Result">{polynomialToText(result, 'r')}</FormulaCard>
      </div>
      <PolynomialGraph polynomialP={polynomialP} polynomialQ={polynomialQ} result={result} />
      <div className="abstract-message">
        A polynomial can be treated as a vector of coefficients. Here p(x) and q(x) are represented by their coefficient vectors, so the linear combination is computed coefficient by coefficient. The graph adds a visual layer: changing coefficients or α and β changes the curves immediately.
      </div>
    </>
  );
}

function FunctionsView({ alpha, beta, functionPair }) {
  const pair = functionPairs[functionPair] ?? functionPairs.trig;
  const range = getFunctionRange(pair, alpha, beta);
  const [minX, maxX] = pair.domain;
  const zeroX = ((0 - minX) / (maxX - minX)) * 440;
  const zeroY = 170 - ((0 - range.minY) / (range.maxY - range.minY)) * 170;
  const clampedZeroY = Math.max(0, Math.min(170, zeroY));
  const clampedZeroX = Math.max(0, Math.min(440, zeroX));
  const hLabel = `h(x) = ${fmt(alpha)}·${pair.shortF} + ${fmt(beta)}·${pair.shortG}`;

  return (
    <>
      <div className="abstract-object-grid functions-grid">
        <FormulaCard title="Function pair">{pair.title}</FormulaCard>
        <FormulaCard title="Function 1">{pair.fLabel}</FormulaCard>
        <FormulaCard title="Function 2">{pair.gLabel}</FormulaCard>
        <FormulaCard title="Linear combination">h(x) = αf(x) + βg(x)</FormulaCard>
        <FormulaCard title="Result">{hLabel}</FormulaCard>
      </div>

      <div className="function-plot-card" aria-label="Function linear combination plot">
        <svg viewBox="0 0 440 170" role="img">
          <line x1="0" y1={clampedZeroY} x2="440" y2={clampedZeroY} className="plot-axis" />
          <line x1={clampedZeroX} y1="0" x2={clampedZeroX} y2="170" className="plot-axis" />
          <path d={makeFunctionPath((x) => pair.f(x), pair.domain, range)} className="plot-line plot-f" />
          <path d={makeFunctionPath((x) => pair.g(x), pair.domain, range)} className="plot-line plot-g" />
          <path d={makeFunctionPath((x) => alpha * pair.f(x) + beta * pair.g(x), pair.domain, range)} className="plot-line plot-h" />
        </svg>
        <div className="plot-legend">
          <span><i className="legend-dot f" />f(x)</span>
          <span><i className="legend-dot g" />g(x)</span>
          <span><i className="legend-dot h" />h(x)</span>
        </div>
      </div>
      <div className="abstract-message">
        These are examples of functions as vectors. The selected pair is not a polynomial pair, because polynomial examples are handled in the separate Polynomials view.
      </div>
    </>
  );
}

function MatricesView({ alpha, beta, abstractMatrixA, abstractMatrixB }) {
  const result = combineMatrices(alpha, abstractMatrixA, beta, abstractMatrixB);

  return (
    <>
      <div className="abstract-matrix-row">
        <MatrixBox matrix={abstractMatrixA} label="A" />
        <div className="abstract-operator">and</div>
        <MatrixBox matrix={abstractMatrixB} label="B" />
        <div className="abstract-operator">→</div>
        <MatrixBox matrix={result} label="αA + βB" />
      </div>
      <div className="abstract-message">
        Matrices can also form a vector space. In this view, the matrix itself is the vector-space object. Addition and scalar multiplication are performed entry by entry, so changing A, B, α, or β produces another matrix in the same space.
      </div>
    </>
  );
}

export default function AbstractSpaceVisualizer() {
  const abstractSpace = useVisualizerStore((s) => s.abstractSpace);
  const alpha = useVisualizerStore((s) => s.alpha);
  const beta = useVisualizerStore((s) => s.beta);
  const functionPair = useVisualizerStore((s) => s.functionPair);
  const polynomialP = useVisualizerStore((s) => s.polynomialP);
  const polynomialQ = useVisualizerStore((s) => s.polynomialQ);
  const abstractMatrixA = useVisualizerStore((s) => s.abstractMatrixA);
  const abstractMatrixB = useVisualizerStore((s) => s.abstractMatrixB);

  const title = abstractSpace === 'functions'
    ? 'Functions as vectors'
    : abstractSpace === 'matrices'
      ? 'Matrices as vectors'
      : 'Polynomials as vectors';

  return (
    <section className="viz-card card abstract-viz-card">
      <div className="viz-toolbar">
        <h2>Abstract Vector Spaces</h2>
        <div className="meta">
          Showing: <b>{title}</b> · α = {fmt(alpha)}, β = {fmt(beta)}
        </div>
      </div>

      <div className="abstract-viz-wrap">
        <div className="abstract-core-statement">
          <span className="abstract-badge">Key idea</span>
          A vector does not have to be an arrow. It can be any object that supports addition and scalar multiplication.
        </div>

        {abstractSpace === 'functions' && <FunctionsView alpha={alpha} beta={beta} functionPair={functionPair} />}
        {abstractSpace === 'matrices' && (
          <MatricesView
            alpha={alpha}
            beta={beta}
            abstractMatrixA={abstractMatrixA}
            abstractMatrixB={abstractMatrixB}
          />
        )}
        {abstractSpace === 'polynomials' && (
          <PolynomialsView
            alpha={alpha}
            beta={beta}
            polynomialP={polynomialP}
            polynomialQ={polynomialQ}
          />
        )}
      </div>
    </section>
  );
}
