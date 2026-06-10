import { useEffect } from 'react';
import Header from '../components/Header.jsx';
import ConceptSelector from '../components/ConceptSelector.jsx';
import MatrixInput from '../components/MatrixInput.jsx';
import VectorInput from '../components/VectorInput.jsx';
import AnimationControls from '../components/AnimationControls.jsx';
import Visualization from '../components/Visualization.jsx';
import InsightPanel from '../components/InsightPanel.jsx';
import QuizCard from '../components/QuizCard.jsx';
import Roadmap from '../components/Roadmap.jsx';
import Footer from '../components/Footer.jsx';
import { useVisualizerStore } from '../store/useVisualizerStore.js';

export default function LecturerPage() {
  const dim = useVisualizerStore((s) => s.dim);

  useEffect(() => {
    document.body.classList.toggle('dim-3', dim === 3);
  }, [dim]);

  return (
    <div className="app">
      <Header />

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

      <QuizCard />
      <Roadmap />
      <Footer />
    </div>
  );
}
