import { useEffect, useState } from 'react';

const memoryOptions = [
  'A quiet coffee date',
  'A walk with music',
  'A movie night',
  'A spontaneous trip',
];

const correctMemory = memoryOptions[1];

export default function Tasks({ onBack, onFinish, stepLabel = 'Step 3 / 3' }) {
  const [reactionStarted, setReactionStarted] = useState(false);
  const [reactionPhase, setReactionPhase] = useState('idle');
  const [reactionScore, setReactionScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [shapePosition, setShapePosition] = useState({ top: '50%', left: '50%' });
  const [memoryPhase, setMemoryPhase] = useState('show');
  const [memoryChoice, setMemoryChoice] = useState('');
  const [memoryScore, setMemoryScore] = useState(0);

  useEffect(() => {
    if (!reactionStarted || reactionPhase !== 'active') {
      return undefined;
    }

    setSecondsLeft(4);
    const motion = window.setInterval(() => {
      setShapePosition({
        top: `${15 + Math.random() * 60}%`,
        left: `${10 + Math.random() * 70}%`,
      });
    }, 650);

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          window.clearInterval(motion);
          setReactionPhase('missed');
          setReactionScore(1);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
      window.clearInterval(motion);
    };
  }, [reactionStarted, reactionPhase]);

  useEffect(() => {
    if (memoryPhase !== 'show') {
      return undefined;
    }

    const timeout = window.setTimeout(() => setMemoryPhase('pick'), 2200);
    return () => window.clearTimeout(timeout);
  }, [memoryPhase]);

  const moveShape = () => {
    setShapePosition({
      top: `${15 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 70}%`,
    });
  };

  const startReaction = () => {
    setReactionStarted(true);
    setReactionPhase('active');
    setReactionScore(0);
    setShapePosition({
      top: `${15 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 70}%`,
    });
  };

  const catchShape = () => {
    if (reactionPhase !== 'active') {
      return;
    }

    setReactionPhase('caught');
    setReactionScore(secondsLeft >= 3 ? 4 : secondsLeft === 2 ? 3 : 2);
  };

  const answerMemory = (choice) => {
    if (memoryChoice) {
      return;
    }

    setMemoryChoice(choice);
    setMemoryScore(choice === correctMemory ? 4 : 1);
  };

  const totalScore = reactionScore + memoryScore;
  const readyToFinish = (reactionPhase === 'caught' || reactionPhase === 'missed') && memoryChoice;

  return (
    <section className="panel stage-panel">
      <div className="stage-header">
        <div>
          <div className="eyebrow">{stepLabel}</div>
          <h2>Mini tasks</h2>
        </div>
        <div className="stage-nav">
          <button className="ghost-btn" onClick={onBack}>Back</button>
          <button className="primary-btn" onClick={() => onFinish(totalScore)} disabled={!readyToFinish}>
            Finish
          </button>
        </div>
      </div>

      <div className="progress-text">Task score: {totalScore}</div>
      <div className="mini-grid">
        <article className="mini-card">
          <h3>Reaction test</h3>
          <p>Click the moving shape before time runs out.</p>
          {reactionPhase === 'idle' ? (
            <button className="primary-btn small" onClick={startReaction}>Start reaction test</button>
          ) : null}
          {reactionPhase === 'active' ? <div className="timer">Time left: {secondsLeft}s</div> : null}
          {reactionPhase === 'caught' ? <div className="success-text">Nice timing. You earned strong points.</div> : null}
          {reactionPhase === 'missed' ? <div className="failure-text">You missed it, but you still get a small score.</div> : null}
          {reactionPhase === 'active' ? (
            <button className="moving-shape" onMouseEnter={moveShape} onClick={catchShape} style={shapePosition} aria-label="moving shape">
              ●
            </button>
          ) : null}
        </article>

        <article className="mini-card">
          <h3>Memory test</h3>
          <p>Remember the plan, then pick the one you saw.</p>
          {memoryPhase === 'show' ? (
            <div className="memory-callout">Memorize this: {correctMemory}</div>
          ) : (
            <div className="memory-callout">Which option was shown?</div>
          )}
          <div className="memory-options">
            {memoryOptions.map((option) => (
              <button
                key={option}
                className={`answer-btn ${memoryChoice === option ? 'selected' : ''}`}
                disabled={memoryPhase !== 'pick' || !!memoryChoice}
                onClick={() => answerMemory(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {memoryChoice ? (
            <div className="memory-result">
              {memoryChoice === correctMemory ? 'Correct. Good recall.' : 'Not quite, but still respectable.'}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}
