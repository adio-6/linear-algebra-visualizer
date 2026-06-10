import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="landing-page">
      <div className="landing-card card final-landing-card">
        <div className="brand-mark landing-mark">Σ</div>
        <h1>Linear Algebra Visualizer</h1>
        <p>
          Interactive classroom tool for visualizing linear transformations,
          determinants, span, basis and vector combinations with live lecturer-student synchronization and quizzes.
        </p>

        <div className="landing-feature-grid" aria-label="Main capabilities">
          <div className="landing-feature">
            <strong>Visualize</strong>
            <span>Explore 2D and 3D linear algebra concepts with interactive matrices and vectors.</span>
          </div>
          <div className="landing-feature">
            <strong>Teach live</strong>
            <span>Open a room, share a code, and synchronize the lecturer view to students.</span>
          </div>
          <div className="landing-feature">
            <strong>Check understanding</strong>
            <span>Run live quizzes and review class answers in the lecturer dashboard.</span>
          </div>
        </div>

        <div className="landing-actions">
          <Link className="btn primary" to="/lecturer">Open Lecturer View</Link>
          <Link className="btn" to="/student">Join as Student</Link>
        </div>
      </div>
    </div>
  );
}
