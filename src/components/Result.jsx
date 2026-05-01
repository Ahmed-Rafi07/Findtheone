import { useEffect } from 'react';
import { trackResultToSheet } from '../utils/googleSheets';

const verdicts = [
  { min: 90, title: 'Strong connection', text: 'Take your chance.' },
  { min: 70, title: 'Good potential', text: 'You never know unless you try.' },
  { min: 40, title: 'Mixed signals', text: 'Confidence matters.' },
  { min: 0, title: 'Better as friends', text: 'The lab wants a bigger sample size.' },
];

function pickVerdict(percent) {
  return verdicts.find((item) => percent >= item.min) ?? verdicts[verdicts.length - 1];
}

function getMotivationalMessage(percent) {
  if (percent >= 90) return 'Strong connection. Take your chance.';
  if (percent >= 70) return 'Good potential. You never know unless you try.';
  if (percent >= 40) return 'Mixed signals, but confidence matters.';
  return 'Better as friends, but never say never.';
}

export default function Result({ result, score, quizScore, taskScore, onReset, quizMax, taskMax, userNames = {} }) {
  const quizPercent = quizMax > 0 ? (quizScore / quizMax) * 100 : 0;
  const taskPercent = taskMax > 0 ? (taskScore / taskMax) * 100 : 0;
  
  // Handle special match case with 100% score
  const isSpecialMatch = result.isSpecialMatch === true;
  const percent = isSpecialMatch ? 100 : Math.max(0, Math.min(100, Math.round((result.weight * 0.3) + (quizPercent * 0.4) + (taskPercent * 0.3))));
  
  const verdict = pickVerdict(percent);
  const isHigh = percent >= 85;
  const isLow = percent < 40;

  const shareText = `${userNames.yourName || 'Me'} & ${userNames.crushName || 'They'}: ${percent}% Match - ${verdict.title}`;

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Crush Compatibility Lab',
          text: shareText,
        });
        return;
      }

      await navigator.clipboard.writeText(shareText);
    } catch {
      // No-op fallback.
    }
  };

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('crushData', JSON.stringify({
        userName: userNames.yourName,
        crushName: userNames.crushName,
        score: percent,
        message: result.message,
        isSpecialMatch: isSpecialMatch,
        timestamp: new Date().toISOString(),
      }));
    } catch {
      // Silent failure
    }
  }, [percent, result.message, userNames, isSpecialMatch]);

  // Track result to Google Sheets (silent, non-blocking)
  useEffect(() => {
    trackResultToSheet({
      userName: userNames.yourName,
      crushName: userNames.crushName,
      score: percent,
      message: result.message,
    });
  }, [percent, userNames]);

  return (
    <section className={`panel stage-panel result-stage ${isHigh ? 'result-high' : ''} ${isLow ? 'result-low' : ''}`}>
      <div className="eyebrow">Final result</div>
      <h2>{isSpecialMatch ? '?? Perfect Match ??' : 'The lab has spoken.'}</h2>

      {userNames.yourName && userNames.crushName && (
        <div className="result-names" style={{ textAlign: 'center', marginBottom: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>
            {userNames.yourName} × {userNames.crushName}
          </span>
        </div>
      )}

      <div className={`final-card ${isLow ? 'low' : 'high'} ${isSpecialMatch ? 'special-match' : ''}`}>
        <div className="final-percent">{percent}%</div>
        <div className="final-title">{percent}% Match — {verdict.title}</div>
        <div className="final-text" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
          {isSpecialMatch ? result.message : verdict.text}
        </div>
        
        {!isSpecialMatch && (
          <div className="motivational-message" style={{ fontSize: '0.95rem', color: 'var(--muted)', fontStyle: 'italic', marginTop: '8px' }}>
            {getMotivationalMessage(percent)}
          </div>
        )}

        <div className="final-meta">
          <span>FLAMES: {result.result}</span>
          <span>Quiz: {quizScore}/{quizMax}</span>
          <span>Tasks: {taskScore}/{taskMax}</span>
          <span>Letters: {result.remaining}</span>
        </div>
      </div>

      {isHigh ? (
        <div className="confetti-burst" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}
      {isLow ? <div className="broken-heart" aria-hidden="true">??</div> : null}

      <div className="action-row result-actions">
        <button className="primary-btn" onClick={onReset}>Try Again</button>
        <button className="ghost-btn" onClick={shareResult}>Share Result</button>
      </div>
    </section>
  );
}
