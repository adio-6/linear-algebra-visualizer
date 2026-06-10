export default function Roadmap() {
  const items = [
    ['🔄', 'Real-time classroom sync', 'Socket.io broadcasts every lecturer action to connected student screens.'],
    ['🧊', 'Advanced 3D visualizations', 'Future work: 3D eigen-axis visualization, camera fly-throughs, and richer shading.'],
    ['🧮', 'n×n matrices & abstract spaces', 'Beyond 2D/3D: arbitrary-dimensional matrices and symbolic computation.'],
    ['📤', 'Export lesson snapshot', 'Save a frozen state of the canvas + matrix + explanation as PDF or PNG.'],
    ['⚛️', 'React + Node.js stack', 'Componentized React frontend, Node.js/Express backend, classroom rooms.'],
    ['✅', 'Numerical correctness tests', 'Automated tests validating every calculation against Python/NumPy or MATLAB.'],
  ];

  return (
    <section className="card roadmap-card">
      <div className="card-section">
        <div className="section-title">Future Full App · Roadmap <span className="badge-soon">Planned</span></div>
        <p style={{ margin: '0 0 14px 0', fontSize: 13, color: 'var(--text-muted)', maxWidth: 760 }}>
          This standalone HTML file is the demo phase. This React skeleton is the first step toward the full classroom platform.
        </p>
        <div className="roadmap-grid">
          {items.map(([icon, title, body]) => (
            <div className="roadmap-item" key={title}>
              <div className="ri-icon">{icon}</div>
              <div className="ri-title">{title}</div>
              <div className="ri-body">{body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
