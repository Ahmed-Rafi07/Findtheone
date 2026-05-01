import { useEffect, useMemo, useState } from 'react';

const memoryOptions = [
  'She likes it when you remember the tiny details 💅',
  'She secretly loves dramatic confessions 🎭',
  'She appreciates a good snack run 🍓',
  'She wants someone who can survive her playlist 🎧',
];

const correctMemory = memoryOptions[1];

export default function Game({ score, setScore, onComplete, sound }) {
  const [heartMode, setHeartMode] = useState('intro');
  const [timer, setTimer] = useState(3);
  const [heartPosition, setHeartPosition] = useState({ top: '50%', left: '50%' });
  const [memoryPhase, setMemoryPhase] = useState('show');
  const [selectedMemory, setSelectedMemory] = useState('');
  const [memoryResult, setMemoryResult] = useState('');

  useEffect(() => {
    if (heartMode !== 'active') return;
    setTimer(3);
    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 1) {
          clearInterval(interval);
          setHeartMode('failed');
          sound.fail();
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [heartMode, sound]);

  useEffect(() => {
    if (memoryPhase !== 'show') return;
    const timeout = window.setTimeout(() => setMemoryPhase('pick'), 2200);
    return () => window.clearTimeout(timeout);
  }, [memoryPhase]);

  const moveHeart = () => {
    setHeartPosition({
      top: `${15 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 70}%`,
    });
    sound.tick();
  };

  const startHeartChallenge = () => {
    setHeartMode('active');
    setHeartPosition({
      top: `${15 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 70}%`,
    });
    sound.click();
  };

  const catchHeart = () => {
    if (heartMode !== 'active') return;
    setHeartMode('caught');
    setScore((current) => current + 18);
    sound.win();
  };

  const answerMemory = (choice) => {
    if (selectedMemory) return;
    setSelectedMemory(choice);
    if (choice === correctMemory) {
      setMemoryResult('Correct. You remembered the most important lore 💍');
      setScore((current) => current + 22);
      sound.win();
    } else {
      setMemoryResult('Wrong, bestie. That was not the canon event 😭');
      setScore((current) => current + 4);
      sound.fail();
    }
  };

  const done = useMemo(() => (heartMode === 'caught' || heartMode === 'failed') && !!memoryResult, [heartMode, memoryResult]);

  useEffect(() => {
    if (done) {
      const timeout = window.setTimeout(onComplete, 1800);
      return () => window.clearTimeout(timeout);
    }
  }, [done, onComplete]);

  return (
    <section className="panel stage-panel">
      <div className="eyebrow">Stage 3 · Mini Games</div>
      <h2>Prove your devotion or perish in pixels. 💘</h2>
      <div className="progress-text">Current bonus score: {score}</div>

      <div className="mini-games">
        <div className="mini-card game-area">
          <div className="mini-title">A. Catch the heart in 3 seconds 💘</div>
          <div className="mini-sub">Tap the floating heart before it escapes your emotional range.</div>
          {heartMode === 'intro' ? (
            <button className="primary-btn small" onClick={startHeartChallenge}>Start the panic 😭</button>
          ) : null}
          {heartMode === 'active' ? <div className="timer">⏳ {timer}s left</div> : null}
          {heartMode === 'caught' ? <div className="success">Heart caught. That was kinda hot not gonna lie 🔥</div> : null}
          {heartMode === 'failed' ? <div className="failure">The heart escaped. L + ratio + emotional damage 💀</div> : null}
          {heartMode === 'active' ? (
            <button
              className="floating-heart"
              onMouseEnter={moveHeart}
              onClick={catchHeart}
              style={heartPosition}
              aria-label="moving heart"
            >
              💘
            </button>
          ) : null}
        </div>

        <div className="mini-card memory-card">
          <div className="mini-title">B. Memory test 🧠</div>
          <div className="mini-sub">Remember the correct lore, then choose when the reveal hits.</div>
          {memoryPhase === 'show' ? (
            <div className="memory-callout">Memorize this: {correctMemory}</div>
          ) : (
            <div className="memory-callout">Which one was real? 👀</div>
          )}
          <div className="memory-options">
            {memoryOptions.map((option) => (
              <button
                key={option}
                className={`answer-btn memory-option ${selectedMemory === option ? 'selected' : ''}`}
                disabled={memoryPhase !== 'pick' || selectedMemory}
                onClick={() => answerMemory(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {memoryResult ? <div className="memory-result">{memoryResult}</div> : null}
        </div>
      </div>
    </section>
  );
}
