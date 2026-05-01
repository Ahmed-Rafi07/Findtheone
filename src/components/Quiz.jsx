const questions = [
  {
    prompt: 'When your crush texts you, what happens first?',
    answers: [
      { label: 'Instant reply energy', points: 4 },
      { label: 'I read it three times', points: 3 },
      { label: 'I act calm but panic', points: 2 },
      { label: 'I stare at the screen quietly', points: 1 },
    ],
  },
  {
    prompt: 'If you randomly see them in public?',
    answers: [
      { label: 'Smile and say hi', points: 4 },
      { label: 'Pretend I am normal', points: 3 },
      { label: 'Suddenly forget how legs work', points: 2 },
      { label: 'Become invisible if possible', points: 1 },
    ],
  },
  {
    prompt: 'Why do you actually like them?',
    answers: [
      { label: 'They are kind and genuine', points: 4 },
      { label: 'They feel easy to be around', points: 3 },
      { label: 'They have a very strong vibe', points: 2 },
      { label: 'I simply cannot explain it', points: 1 },
    ],
  },
  {
    prompt: 'Your ideal moment together?',
    answers: [
      { label: 'A slow coffee chat', points: 4 },
      { label: 'A walk with good music', points: 3 },
      { label: 'A fun game night', points: 2 },
      { label: 'Anything that feels easy', points: 1 },
    ],
  },
  {
    prompt: 'How often do you think about them?',
    answers: [
      { label: 'Only when I try not to', points: 4 },
      { label: 'A lot, respectfully', points: 3 },
      { label: 'Sometimes, then I get distracted', points: 2 },
      { label: 'Rarely, but the brain is sneaky', points: 1 },
    ],
  },
  {
    prompt: 'If they do not reply?',
    answers: [
      { label: 'I wait patiently', points: 4 },
      { label: 'I check again later', points: 3 },
      { label: 'I get slightly unwell', points: 2 },
      { label: 'I start a dramatic inner monologue', points: 1 },
    ],
  },
  {
    prompt: 'Your confidence level right now?',
    answers: [
      { label: 'Fairly solid', points: 4 },
      { label: 'Growing, slowly', points: 3 },
      { label: 'Questionable but improving', points: 2 },
      { label: 'Held together by hope', points: 1 },
    ],
  },
];

export { questions };

export default function Quiz({ step, score, onSelectAnswer, onBack, selectedIndex, isAdvancing }) {
  const question = questions[step];
  const selectedAnswer = selectedIndex >= 0 ? question.answers[selectedIndex] : null;
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <section className="panel stage-panel">
      <div className="stage-header">
        <div>
          <div className="eyebrow">Step 2 / 3</div>
          <h2>Compatibility quiz</h2>
        </div>
        <button className="ghost-btn" onClick={onBack}>Back</button>
      </div>

      <div className="quiz-progress-block">
        <div className="progress-text">Question {step + 1} of {questions.length} · Score {score}</div>
        <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <div key={step} className={`quiz-card quiz-animate ${isAdvancing ? 'is-advancing' : ''}`}>
        <div className="question">{question.prompt}</div>
        <div className="answer-grid">
          {question.answers.map((answer, answerIndex) => (
            <button
              key={answer.label}
              className={`answer-btn ${selectedIndex === answerIndex ? 'selected' : ''}`}
              onClick={() => onSelectAnswer(answerIndex)}
              disabled={isAdvancing || selectedAnswer !== null}
            >
              {answer.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
