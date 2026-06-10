const concepts = [
  { key: 'transformation', icon: '↗', label: 'Linear Transformation' },
  { key: 'combination', icon: '+', label: 'Linear Combination' },
  { key: 'determinant', icon: '▱', label: 'Determinant' },
  { key: 'eigen', icon: 'λ', label: 'Eigenvectors' },
  { key: 'span', icon: '⇿', label: 'Span / Basis' },
  { key: 'basis', icon: '⊞', label: 'Change of Basis' },
];

export default function ConceptSelector({ concept, onConceptChange }) {
  return (
    <div className="card-section">
      <div className="section-title">Concept</div>
      <div className="concept-list">
        {concepts.map((item) => (
          <button
            key={item.key}
            className={`concept-item ${concept === item.key ? 'active' : ''}`}
            onClick={() => onConceptChange(item.key)}
          >
            <span className="ico">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
