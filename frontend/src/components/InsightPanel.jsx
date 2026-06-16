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

  if (state.concept === 'combination') {
    return 'צירוף ליניארי αu + βv מראה איך שני וקטורים יכולים ליצור וקטור חדש על ידי שינוי המקדמים α ו־β.';
  }

  if (state.concept === 'span') {
    return 'Span הוא אוסף כל הצירופים הליניאריים שאפשר לקבל מהווקטורים הנתונים.';
  }

  if (state.concept === 'basis') {
    return 'בסיס הוא אוסף וקטורים בלתי תלויים שמאפשרים לייצג כל וקטור במרחב.';
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
  const combination = linComb(state.alpha, state.u, state.beta, state.v);

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
            <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>v</span> = {formatVector(state.v)}</div>
            <div><span style={{ color: 'var(--vec-v)', fontWeight: 600 }}>A·v</span> = {formatVector(Av)}</div>
            {state.concept === 'combination' && (
              <div><span style={{ color: 'var(--vec-u)', fontWeight: 600 }}>αu + βv</span> = {formatVector(combination)}</div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
