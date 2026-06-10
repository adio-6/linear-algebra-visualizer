export default function Header({ dim, onDimChange }) {
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
        <div className="mode-toggle" title="Switch between 2D and 3D visualization">
          <button className={dim === 2 ? 'active' : ''} onClick={() => onDimChange(2)}>2D</button>
          <button className={dim === 3 ? 'active' : ''} onClick={() => onDimChange(3)}>3D</button>
        </div>
      </div>
    </header>
  );
}
