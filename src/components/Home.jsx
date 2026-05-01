import { useEffect, useRef } from 'react';

export default function Home({ onStart, names, setNames, canStart, onToggleTheme, theme }) {
  const firstInputRef = useRef(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <section className="home-screen">
      <div className="home-visual">
        <div className="eyebrow">Crush Compatibility Lab</div>
        <h1>See how well you match</h1>
        <p className="subtitle">A clean compatibility tester with a playful edge.</p>
        <div className="visual-orbit" aria-hidden="true">
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
        </div>
      </div>

      <div className="home-form-shell">
        <p className="microcopy">Enter two names and the lab will do the rest.</p>

        <div className="form-grid">
          <label htmlFor="yourName">
            <span>Your Name</span>
            <input
              ref={firstInputRef}
              id="yourName"
              name="yourName"
              value={names.yourName}
              onChange={(event) => setNames((current) => ({ ...current, yourName: event.target.value }))}
              placeholder="e.g. Alex"
            />
          </label>
          <label htmlFor="crushName">
            <span>Crush Name</span>
            <input
              id="crushName"
              name="crushName"
              value={names.crushName}
              onChange={(event) => setNames((current) => ({ ...current, crushName: event.target.value }))}
              placeholder="e.g. Jordan"
            />
          </label>
        </div>

        <div className="action-row home-actions">
          <button className="primary-btn" onClick={onStart} disabled={!canStart}>
            Start Test
          </button>
          <button className="ghost-btn" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Toggle theme' : 'Toggle theme'}
          </button>
        </div>

        <div className={`validation-note ${canStart ? 'ready' : ''}`}>
          {canStart ? 'Ready to test compatibility.' : 'Add both names to continue.'}
        </div>
      </div>
    </section>
  );
}
