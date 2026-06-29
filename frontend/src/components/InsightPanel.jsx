import {
  classifyTransform,
  classifyTransform3,
  currentDet,
  fmt,
  formatVector,
  inverse,
  isInvertible,
  linComb,
  multiply,
} from '../math/linearAlgebra.js';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

const labels = {
  transformation: 'Transformation',
  combination: 'Combination',
  determinant: 'Determinant',
  eigen: 'Eigenvectors',
  span: 'Span / Basis',
  basis: 'Change of Basis',
  abstract: 'Abstract Spaces',
};

function MatrixDisplay({ matrix }) {
  const n = matrix.length;
  return (
    <div className="matrix-display" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
      {matrix.flat().map((value, index) => (
        <span key={index}>{fmt(value)}</span>
      ))}
    </div>
  );
}

function vectorNorm(vec, dim) {
  return Math.hypot(...vec.slice(0, dim));
}

function spanMeasure(u, v, dim) {
  if (dim === 3) {
    const cross = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    return Math.hypot(cross[0], cross[1], cross[2]);
  }
  return Math.abs(v[0] * u[1] - v[1] * u[0]);
}

function spanSpaceLabel(u, v, dim) {
  const tolerance = 0.05;
  const uNorm = vectorNorm(u, dim);
  const vNorm = vectorNorm(v, dim);
  const measure = spanMeasure(u, v, dim);

  if (uNorm < tolerance && vNorm < tolerance) return '{0}';
  if (measure < tolerance) return 'line';
  return dim === 3 ? 'plane in R³' : 'R²';
}

function eigenTestInfo(v, Av, dim) {
  const tolerance = 0.05;
  const vv = v.slice(0, dim);
  const av = Av.slice(0, dim);
  const vNorm = vectorNorm(vv, dim);
  const avNorm = vectorNorm(av, dim);

  if (vNorm < tolerance || avNorm < tolerance) {
    return { testable: false, collinear: false, lambda: null };
  }

  const denominator = vv.reduce((sum, value) => sum + value * value, 0);
  const dot = vv.reduce((sum, value, index) => sum + value * av[index], 0);
  const lambda = dot / denominator;
  const residual = av.map((value, index) => value - lambda * vv[index]);
  const residualNorm = vectorNorm(residual, dim);
  const collinear = residualNorm <= tolerance * Math.max(1, avNorm);

  return { testable: true, collinear, lambda };
}

function explanationFor(state, det, transformType) {
  if (state.concept === 'determinant') {
    if (Math.abs(det) < 0.05) {
      return 'הדטרמיננטה קרובה ל־0, ולכן הטרנספורמציה קורסת לממד נמוך יותר והמטריצה אינה הפיכה.';
    }
    if (det < 0) {
      return `הדטרמיננטה שלילית. המשמעות הגיאומטרית היא שינוי שטח/נפח פי ${fmt(Math.abs(det))} וגם היפוך אוריינטציה.`;
    }
    return `הדטרמיננטה חיובית. המשמעות הגיאומטרית היא שינוי שטח/נפח פי ${fmt(det)} בלי היפוך אוריינטציה.`;
  }

  if (state.concept === 'determinant') {
    const areaScale = Math.abs(det);
    const orientationReversed = det < -0.05;

    return (
      <aside className="right-panel">
        <div className="card">
          <div className="card-section">
            <div className="section-title">
              Live Insight <span className="pill">Determinant</span>
            </div>

            <div className="abstract-insight-callout">
              <strong>Determinant focuses on Matrix A.</strong>
              <span> The displayed area is the area scaling factor created by A.</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, marginBottom: 6 }}>Current matrix</div>
            <MatrixDisplay matrix={state.A} />

            <div className="stat-grid" style={{ marginTop: 14 }}>
              <div className="stat">
                <div className="k">det(A)</div>
                <div className="v">{fmt(det)}</div>
              </div>
              <div className="stat">
                <div className="k">AREA = |det(A)|</div>
                <div className="v">{areaScale < 0.05 ? '≈ 0' : fmt(areaScale)}</div>
              </div>
              <div className="stat">
                <div className="k">Invertible</div>
                <div className={`v ${invertible ? 'ok' : 'bad'}`}>{invertible ? 'Yes' : 'No'}</div>
              </div>
              <div className="stat">
                <div className="k">Orientation reversed?</div>
                <div className={`v ${orientationReversed ? 'bad' : 'ok'}`}>{orientationReversed ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">Explanation</div>
            <div className="explanation">{explanationFor(state, det, transformType)}</div>
          </div>
        </div>
      </aside>
    );
  }

  if (state.concept === 'combination') {
    return 'צירוף ליניארי αu + βv מראה איך שני וקטורים יכולים ליצור וקטור חדש על ידי שינוי המקדמים α ו־β.';
  }

  if (state.concept === 'span') {
    return 'Span הוא אוסף כל הצירופים הליניאריים שאפשר לקבל מהווקטורים הנתונים.';
  }

  if (state.concept === 'basis') {
    return 'העיקרון המרכזי בהחלפת קואורדינטות הוא שהווקטור הגיאומטרי w נשאר אותו וקטור, אבל התיאור שלו משתנה: ביחס לבסיס B={u,v} כותבים w = αu + βv ולכן [w]B = (α,β).';
  }

  if (state.concept === 'eigen') {
    return 'וקטורים עצמיים הם כיוונים מיוחדים שלא משנים כיוון תחת הטרנספורמציה, אלא רק נמתחים או מתהפכים.';
  }

  return `המטריצה הנוכחית מתנהגת כמו: ${transformType}. בהמשך נחבר את המידע הזה גם להדמיה הגרפית.`;
}


function abstractExplanation(space) {
  if (space === 'functions') {
    return 'במרחב פונקציות, כל פונקציה יכולה להיחשב וקטור. ניתן לחבר פונקציות ולהכפיל אותן בסקלר, והתוצאה היא פונקציה חדשה באותו מרחב.';
  }
  if (space === 'matrices') {
    return 'במרחב מטריצות, כל מטריצה יכולה להיחשב וקטור. החיבור והכפל בסקלר מתבצעים איבר־איבר, והתוצאה היא מטריצה חדשה באותו מרחב.';
  }
  return 'במרחב פולינומים, כל פולינום יכול להיחשב וקטור של מקדמים. צירוף ליניארי של פולינומים מחושב על ידי שילוב המקדמים שלהם.';
}

function AbstractInsight({ space, alpha, beta }) {
  const spaceLabel = space === 'functions' ? 'Functions' : space === 'matrices' ? 'Matrices' : 'Polynomials';

  return (
    <aside className="right-panel">
      <div className="card">
        <div className="card-section">
          <div className="section-title">
            Live Insight <span className="pill">Abstract Spaces</span>
          </div>
          <div className="abstract-insight-callout">
            <strong>{spaceLabel} can be vectors.</strong>
            <span> A vector is defined by the operations it supports, not only by how it looks geometrically.</span>
          </div>
          <div className="stat-grid" style={{ marginTop: 14 }}>
            <div className="stat">
              <div className="k">Selected space</div>
              <div className="v" style={{ fontSize: 13 }}>{spaceLabel}</div>
            </div>
            <div className="stat">
              <div className="k">Operation</div>
              <div className="v" style={{ fontSize: 13 }}>α object₁ + β object₂</div>
            </div>
            <div className="stat">
              <div className="k greek-label">α</div>
              <div className="v">{fmt(alpha)}</div>
            </div>
            <div className="stat">
              <div className="k greek-label">β</div>
              <div className="v">{fmt(beta)}</div>
            </div>
          </div>
        </div>

        <div className="card-section">
          <div className="section-title">Explanation</div>
          <div className="explanation rtl-explanation">{abstractExplanation(space)}</div>
        </div>

        <div className="card-section">
          <div className="section-title">Connection to Linear Algebra</div>
          <div className="explanation rtl-explanation">
            הרכיב מדגים שהמושגים צירוף ליניארי, Span ובסיס אינם שייכים רק לחצים ב־R² או R³, אלא לכל אוסף אובייקטים שמקיים חיבור וכפל בסקלר.
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function InsightPanel() {
  const dim = useVisualizerStore((s) => s.dim);
  const concept = useVisualizerStore((s) => s.concept);
  const A = useVisualizerStore((s) => s.A);
  const v = useVisualizerStore((s) => s.v);
  const u = useVisualizerStore((s) => s.u);
  const alpha = useVisualizerStore((s) => s.alpha);
  const beta = useVisualizerStore((s) => s.beta);
  const abstractSpace = useVisualizerStore((s) => s.abstractSpace);

  if (concept === 'abstract') {
    return <AbstractInsight space={abstractSpace} alpha={alpha} beta={beta} />;
  }

  const state = { dim, concept, A, v, u, alpha, beta };
  const det = currentDet(state.A);
  const invertible = isInvertible(state.A);
  const invMatrix = inverse(state.A);
  const transformType = state.dim === 3 ? classifyTransform3(state.A) : classifyTransform(state.A);
  const Av = multiply(state.A, state.v);
  const Au = multiply(state.A, state.u);
  const alphaU = [state.alpha * state.u[0], state.alpha * state.u[1]];
  const betaV = [state.beta * state.v[0], state.beta * state.v[1]];
  const combination = linComb(state.alpha, state.u, state.beta, state.v);
  const eigenTest = eigenTestInfo(state.v, Av, state.dim);

  if (state.concept === 'determinant') {
    const areaScale = Math.abs(det);
    const orientationReversed = det < -0.05;

    return (
      <aside className="right-panel">
        <div className="card">
          <div className="card-section">
            <div className="section-title">
              Live Insight <span className="pill">Determinant</span>
            </div>

            <div className="abstract-insight-callout">
              <strong>Determinant focuses on Matrix A.</strong>
              <span> The displayed area is the area scaling factor created by A.</span>
            </div>

            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14, marginBottom: 6 }}>Current matrix</div>
            <MatrixDisplay matrix={state.A} />

            <div className="stat-grid" style={{ marginTop: 14 }}>
              <div className="stat">
                <div className="k">det(A)</div>
                <div className="v">{fmt(det)}</div>
              </div>
              <div className="stat">
                <div className="k">AREA = |det(A)|</div>
                <div className="v">{areaScale < 0.05 ? '≈ 0' : fmt(areaScale)}</div>
              </div>
              <div className="stat">
                <div className="k">Invertible</div>
                <div className={`v ${invertible ? 'ok' : 'bad'}`}>{invertible ? 'Yes' : 'No'}</div>
              </div>
              <div className="stat">
                <div className="k">Orientation reversed?</div>
                <div className={`v ${orientationReversed ? 'bad' : 'ok'}`}>{orientationReversed ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">Explanation</div>
            <div className="explanation">{explanationFor(state, det, transformType)}</div>
          </div>
        </div>
      </aside>
    );
  }

  if (state.concept === 'combination') {
    return (
      <aside className="right-panel">
        <div className="card">
          <div className="card-section">
            <div className="section-title">
              Live Insight <span className="pill">Combination</span>
            </div>

            <div className="abstract-insight-callout">
              <strong>Linear combination does not use Matrix A.</strong>
              <span> The result is built directly from the vectors u and v using the scalars α and β.</span>
            </div>

            <div className="stat-grid" style={{ marginTop: 14 }}>
              <div className="stat">
                <div className="k greek-label">α</div>
                <div className="v">{fmt(alpha)}</div>
              </div>
              <div className="stat">
                <div className="k greek-label">β</div>
                <div className="v">{fmt(beta)}</div>
              </div>
              <div className="stat" style={{ gridColumn: '1 / -1' }}>
                <div className="k">Operation</div>
                <div className="v" style={{ fontSize: 13 }}>αu + βv</div>
              </div>
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">Explanation</div>
            <div className="explanation">{explanationFor(state, det, transformType)}</div>
          </div>

          <div className="card-section">
            <div className="section-title">Vector Readout</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.85 }}>
              <div><span style={{ color: 'rgba(249, 115, 22, 0.78)', fontWeight: 600 }}>u</span> = {formatVector(state.u)}</div>
              <div><span style={{ color: 'rgba(99, 102, 241, 0.78)', fontWeight: 600 }}>v</span> = {formatVector(state.v)}</div>
              <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>αu</span> = {formatVector(alphaU)}</div>
              <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>βv</span> = {formatVector(betaV)}</div>
              <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>αu + βv</span> = {formatVector(combination)}</div>
            </div>
          </div>
        </div>
      </aside>
    );
  }


  if (state.concept === 'span' || state.concept === 'basis') {
    const basisArea = spanMeasure(state.u, state.v, state.dim);
    const independent = basisArea > 0.05;
    const spanLabel = spanSpaceLabel(state.u, state.v, state.dim);
    const title = state.concept === 'span' ? 'Span / Basis' : 'Change of Basis';
    const basisDet = state.u[0] * state.v[1] - state.u[1] * state.v[0];
    const w = state.concept === 'basis'
      ? state.u.map((value, index) => state.alpha * value + state.beta * state.v[index])
      : state.u.map((value, index) => value + state.v[index]);
    const alphaUDisplay = state.u.map((value) => state.alpha * value);
    const betaVDisplay = state.v.map((value) => state.beta * value);
    const mainMessage = state.concept === 'span'
      ? 'Span is determined by the vectors u and v, not by Matrix A.'
      : 'Change of Basis treats u and v as new coordinate axes. The key idea is that w is assembled as αu + βv, so [w]B = (α, β).';

    return (
      <aside className="right-panel">
        <div className="card">
          <div className="card-section">
            <div className="section-title">
              Live Insight <span className="pill">{title}</span>
            </div>

            <div className="abstract-insight-callout">
              <strong>{mainMessage}</strong>
              <span>{state.concept === 'basis' ? 'The display now keeps the standard axes visible, highlights the basis axes u and v, and shows how αu and βv add to the same vector w.' : 'The important values are the vectors themselves and the area they span together.'}</span>
            </div>

            <div className="stat-grid" style={{ marginTop: 14 }}>
              {state.concept === 'basis' && (
                <div className="stat" style={{ gridColumn: '1 / -1' }}>
                  <div className="k">New basis</div>
                  <div className="v" style={{ fontSize: 13 }}>B = {'{'}u, v{'}'}</div>
                </div>
              )}

              <div className="stat">
                <div className="k">{state.dim === 3 ? 'Area of spanned parallelogram' : 'Area of u,v parallelogram'}</div>
                <div className="v">{basisArea < 0.05 ? '≈ 0' : fmt(basisArea)}</div>
              </div>


              <div className="stat">
                <div className="k">{state.concept === 'basis' ? 'Basis valid?' : 'Independent?'}</div>
                <div className={`v ${independent ? 'ok' : 'bad'}`}>
                  {state.concept === 'basis' && state.dim === 3
                    ? (independent ? 'Yes, for a plane' : 'No')
                    : (independent ? 'Yes' : 'No')}
                </div>
              </div>

              <div className="stat" style={{ gridColumn: '1 / -1' }}>
                <div className="k">span{'{'}u, v{'}'}</div>
                <div className="v" style={{ fontSize: 13 }}>{spanLabel}</div>
              </div>

              {state.concept === 'basis' && (
                <>
                  <div className="stat">
                    <div className="k">[w]B</div>
                    <div className="v">({fmt(state.alpha)}, {fmt(state.beta)})</div>
                  </div>
                  <div className="stat">
                    <div className="k">w in standard coords</div>
                    <div className="v" style={{ fontSize: 13 }}>{formatVector(w)}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card-section">
            <div className="section-title">Explanation</div>
            <div className="explanation">{explanationFor(state, det, transformType)}</div>
          </div>

          <div className="card-section">
            <div className="section-title">Vector Readout</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.85 }}>
              <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>u</span> = {formatVector(state.u)}</div>
              <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>v</span> = {formatVector(state.v)}</div>
              <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>span{'{'}u, v{'}'}</span> = {spanLabel}</div>
              {state.concept === 'basis' && (
                <>
                  <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>αu</span> = {formatVector(alphaUDisplay)}</div>
                  <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>βv</span> = {formatVector(betaVDisplay)}</div>
                  <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>w</span> = {formatVector(w)}</div>
                  <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>w</span> = αu + βv</div>
                  <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>[w]B</span> = ({fmt(state.alpha)}, {fmt(state.beta)})</div>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="right-panel">
      <div className="card">
        <div className="card-section">
          <div className="section-title">
            Live Insight <span className="pill">{labels[state.concept]}</span>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Current matrix</div>
          <MatrixDisplay matrix={state.A} />

          <div className="stat-grid" style={{ marginTop: 14 }}>
            <div className="stat">
              <div className="k">det(A)</div>
              <div className="v">{fmt(det)}</div>
            </div>
            <div className="stat">
              <div className="k">Invertible</div>
              <div className={`v ${invertible ? 'ok' : 'bad'}`}>{invertible ? 'Yes' : 'No'}</div>
            </div>
            <div className="stat" style={{ gridColumn: '1 / -1' }}>
              <div className="k">Transformation type</div>
              <div className="v" style={{ fontSize: 13 }}>{transformType}</div>
            </div>
            {state.concept === 'eigen' && (
              <>
                <div className="stat">
                  <div className="k">v and A·v collinear?</div>
                  <div className={`v ${eigenTest.collinear ? 'ok' : 'bad'}`}>{eigenTest.collinear ? 'Yes' : 'No'}</div>
                </div>
                <div className="stat">
                  <div className="k">v is eigenvector?</div>
                  <div className={`v ${eigenTest.collinear ? 'ok' : 'bad'}`}>{eigenTest.collinear ? 'Yes' : 'No'}</div>
                </div>
                <div className="stat" style={{ gridColumn: '1 / -1' }}>
                  <div className="k">λ</div>
                  <div className="v" style={{ fontSize: 13 }}>{eigenTest.collinear ? fmt(eigenTest.lambda) : 'not defined for this v'}</div>
                </div>
              </>
            )}
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
            Inverse <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>A⁻¹</code>
          </div>
          {invMatrix ? (
            <MatrixDisplay matrix={invMatrix} />
          ) : (
            <div className="explanation" style={{ marginTop: 6, fontSize: 12.5 }}>
              <strong>A⁻¹ does not exist</strong> because det(A) = {fmt(det)}.
            </div>
          )}
        </div>

        <div className="card-section">
          <div className="section-title">Explanation</div>
          <div className="explanation">{explanationFor(state, det, transformType)}</div>
        </div>

        <div className="card-section">
          <div className="section-title">Vector Readout</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, lineHeight: 1.85 }}>
            <div><span style={{ color: 'rgba(99, 102, 241, 0.78)', fontWeight: 600 }}>v</span> = {formatVector(state.v)}</div>

            {state.concept === 'combination' ? (
              <>
                <div><span style={{ color: 'rgba(249, 115, 22, 0.78)', fontWeight: 600 }}>u</span> = {formatVector(state.u)}</div>
                <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>αu</span> = {formatVector(alphaU)}</div>
                <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>βv</span> = {formatVector(betaV)}</div>
                <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>αu + βv</span> = {formatVector(combination)}</div>
              </>
            ) : (
              <>
                <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>A·v</span> = {formatVector(Av)}</div>
                {state.concept === 'eigen' && (
                  <>
                    <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>v is eigenvector?</span> = {eigenTest.collinear ? 'Yes' : 'No'}</div>
                    <div><span style={{ color: 'var(--accent)', fontWeight: 600 }}>λ</span> = {eigenTest.collinear ? fmt(eigenTest.lambda) : 'not defined'}</div>
                  </>
                )}
                {(state.concept === 'span' || state.concept === 'basis') && (
                  <>
                    <div><span style={{ color: 'rgba(249, 115, 22, 0.78)', fontWeight: 600 }}>u</span> = {formatVector(state.u)}</div>
                    <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>{state.concept === 'basis' ? 'u' : 'A·u'}</span> = {formatVector(state.concept === 'basis' ? state.u : Au)}</div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
