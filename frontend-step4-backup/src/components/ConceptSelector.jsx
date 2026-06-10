import { useVisualizerStore } from '../store/useVisualizerStore.js';

const concepts = [
  { key: 'transformation', icon: '↗', label: 'Linear Transformation' },
  { key: 'combination', icon: '+', label: 'Linear Combination' },
  { key: 'determinant', icon: '▱', label: 'Determinant' },
  { key: 'eigen', icon: 'λ', label: 'Eigenvectors' },
  { key: 'span', icon: '⇿', label: 'Span / Basis' },
  { key: 'basis', icon: '⊞', label: 'Change of Basis' },
];

export default function ConceptSelector() {
  const concept = useVisualizerStore((s) => s.concept);
  const setConcept = useVisualizerStore((s) => s.setConcept);

  return (
    <div className="card-section">
      <div className="section-title">Concept</div>
      <div className="concept-list">
        {concepts.map((item) => (
          <button
            key={item.key}
            className={`concept-item ${concept === item.key ? 'active' : ''}`}
            onClick={() => setConcept(item.key)}
          >
            <span className="ico">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
