import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import ConceptSelector from '../components/ConceptSelector.jsx';
import MatrixInput from '../components/MatrixInput.jsx';
import VectorInput from '../components/VectorInput.jsx';
import AnimationControls from '../components/AnimationControls.jsx';
import AbstractSpaceControls from '../components/AbstractSpaceControls.jsx';
import Visualization from '../components/Visualization.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import Footer from '../components/Footer.jsx';
import PracticeQuiz from '../components/PracticeQuiz.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export default function StudentPracticePage() {
  const dim = useVisualizerStore((s) => s.dim);
  const concept = useVisualizerStore((s) => s.concept);

  useEffect(() => {
    document.body.classList.toggle('dim-3', dim === 3);
  }, [dim]);

  return (
    <div className="app student-practice-app">
      <Header />

      <section className="card student-practice-banner standalone-practice-banner">
        <div>
          <div className="section-title" style={{ marginBottom: 6 }}>Student Practice</div>
          <h1>Practice Mode</h1>
          <p>
            You are practicing independently. Your matrix, vector, animation and quiz actions are local to your browser and are not shared with a live class.
          </p>
        </div>
        <div className="student-nav-actions">
          <Link className="btn secondary student-nav-button" to="/student">Join Live Class</Link>
          <Link className="btn secondary student-nav-button" to="/">Back to Home</Link>
        </div>
      </section>

      <main className="workspace-grid student-workspace practice-workspace">
        <aside className="left-panel control-panel">
          <div className="card">
            <ConceptSelector />
            {concept === 'abstract' ? (
              <AbstractSpaceControls />
            ) : (
              <>
                <MatrixInput />
                <VectorInput />
                <AnimationControls />
              </>
            )}
          </div>
        </aside>

        <Visualization role="student" followLecturer={false} />
        <InsightPanel />
      </main>

      <div className="page-section-wrap">
        <PracticeQuiz />
      </div>

      <Footer />
    </div>
  );
}
