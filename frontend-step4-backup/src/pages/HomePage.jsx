import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="landing-card card">
        <div className="brand-mark landing-mark">Σ</div>
        <h1>Linear Algebra Visualizer</h1>
        <p>
          Interactive classroom tool for visualizing linear transformations,
          determinants, span, basis and vector combinations.
        </p>
        <div className="landing-actions">
          <Link className="btn primary" to="/lecturer">Open Lecturer View</Link>
          <Link className="btn" to="/student">Join as Student</Link>
        </div>
      </div>
    </div>
  );
}
