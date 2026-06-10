import { Link } from 'react-router-dom';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export default function Header() {
  const dim = useVisualizerStore((s) => s.dim);
  const setDim = useVisualizerStore((s) => s.setDim);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">Σ</div>
        <div>
          <div className="brand-title">Linear Algebra Visualizer</div>
          <div className="brand-sub">Interactive classroom demo</div>
        </div>
      </div>

      <div className="topbar-right">
        <Link className="toplink" to="/">Home</Link>
        <Link className="toplink" to="/student">Student</Link>
        <div className="mode-toggle" title="Switch between 2D and 3D visualization">
          <button className={dim === 2 ? 'active' : ''} onClick={() => setDim(2)}>2D</button>
          <button className={dim === 3 ? 'active' : ''} onClick={() => setDim(3)}>3D</button>
        </div>
      </div>
    </header>
  );
}
