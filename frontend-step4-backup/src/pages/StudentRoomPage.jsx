import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ConceptSelector from '../components/ConceptSelector.jsx';
import MatrixInput from '../components/MatrixInput.jsx';
import VectorInput from '../components/VectorInput.jsx';
import AnimationControls from '../components/AnimationControls.jsx';
import Visualization from '../components/Visualization.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import Footer from '../components/Footer.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export default function StudentRoomPage() {
  const { code } = useParams();
  const dim = useVisualizerStore((s) => s.dim);
  const nickname = sessionStorage.getItem('student:nickname') || 'Student';

  useEffect(() => {
    document.body.classList.toggle('dim-3', dim === 3);
  }, [dim]);

  return (
    <div className="app student-practice-app">
      <Header />

      <section className="card student-practice-banner">
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Student Practice View</div>
          <h1>Practice workspace</h1>
          <p>
            Room code: <strong>{code}</strong> · {nickname}. Changes you make here are local to your browser for now.
            Later, this screen can support both Follow Lecturer and Practice Mode.
          </p>
        </div>
        <div className="topbar-right">
          <Link className="toplink" to="/student">Change room</Link>
          <Link className="toplink" to="/">Home</Link>
        </div>
      </section>

      <main>
        <aside className="left-panel">
          <div className="card">
            <ConceptSelector />
            <MatrixInput />
            <VectorInput />
            <AnimationControls />
          </div>
        </aside>

        <Visualization />
        <InsightPanel />
      </main>

      <Footer />
    </div>
  );
}
