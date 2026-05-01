const labelMap = {
  Friends: 'Friends',
  Love: 'Love',
  Affection: 'Affection',
  Marriage: 'Marriage',
  Enemy: 'Enemy',
  Siblings: 'Siblings',
};

export default function Flames({ data, loading, onBack, onNext, canNext, stepLabel = 'Step 1 / 3' }) {
  return (
    <section className="panel stage-panel">
      <div className="stage-header">
        <div>
          <div className="eyebrow">{stepLabel}</div>
          <h2>FLAMES calculation</h2>
        </div>
        <div className="stage-nav">
          <button className="ghost-btn" onClick={onBack}>Back</button>
          <button className="primary-btn" onClick={onNext} disabled={!canNext}>Next</button>
        </div>
      </div>

      <div className="flames-layout">
        <div className={`spinner-card ${loading ? 'spinning' : ''}`} aria-hidden="true">
          <div className="spinner-ring" />
          <div className="spinner-core">FLAMES</div>
        </div>

        <div className="result-card">
          {loading ? (
            <>
              <div className="result-title">Analyzing compatibility…</div>
              <p className="result-quote">Please wait while the lab removes common letters and checks the vibe.</p>
            </>
          ) : data ? (
            <>
              <div className="result-title">Result: {labelMap[data.result]}</div>
              <p className="result-quote">{data.message}</p>
              <div className="meter">
                <div className="meter-fill" style={{ width: `${data.weight}%` }} />
              </div>
              <div className="tiny">Remaining letters: {data.remaining}</div>
            </>
          ) : (
            <p className="result-quote">Your FLAMES result will appear here.</p>
          )}
        </div>
      </div>
    </section>
  );
}
