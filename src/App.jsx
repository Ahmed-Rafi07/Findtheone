import { useEffect, useRef, useState } from 'react';
import Home from './components/Home';
import Flames from './components/Flames';
import Quiz, { questions } from './components/Quiz';
import Tasks from './components/Tasks';
import Result from './components/Result';
import { calculateFlames } from './utils/flames';

const defaultNames = { yourName: '', crushName: '' };
const defaultTheme = 'dark';
const defaultQuizAnswers = Array(questions.length).fill(null);
const quizMax = questions.reduce((total, question) => total + Math.max(...question.answers.map((answer) => answer.points)), 0);
const taskMax = 8;

function getStored(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [names, setNames] = useState(() => getStored('ccl-names', defaultNames));
  const [theme, setTheme] = useState(() => getStored('ccl-theme', defaultTheme));
  const [stage, setStage] = useState('home');
  const [flamesData, setFlamesData] = useState(null);
  const [flamesLoading, setFlamesLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(defaultQuizAnswers);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAdvancing, setQuizAdvancing] = useState(false);
  const [taskScore, setTaskScore] = useState(0);
  const [finalResult, setFinalResult] = useState(null);
  const quizAdvanceTimer = useRef(null);

  const quizScore = quizAnswers.reduce((total, answer) => total + (answer?.points ?? 0), 0);

  useEffect(() => {
    localStorage.setItem('ccl-names', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('ccl-theme', JSON.stringify(theme));
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (stage !== 'flames') {
      return undefined;
    }

    setFlamesLoading(true);
    setFlamesData(null);
    const timer = window.setTimeout(() => {
      setFlamesData(calculateFlames(names.yourName, names.crushName));
      setFlamesLoading(false);
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [stage, names]);

  const canStart = names.yourName.trim().length > 0 && names.crushName.trim().length > 0;

  const start = () => {
    if (!canStart) {
      return;
    }

    if (quizAdvanceTimer.current) {
      window.clearTimeout(quizAdvanceTimer.current);
      quizAdvanceTimer.current = null;
    }

    setQuizAnswers(defaultQuizAnswers);
    setQuizIndex(0);
    setQuizAdvancing(false);
    setTaskScore(0);
    setFinalResult(null);
    setStage('flames');
  };

  const goHome = () => {
    if (quizAdvanceTimer.current) {
      window.clearTimeout(quizAdvanceTimer.current);
      quizAdvanceTimer.current = null;
    }

    setStage('home');
    setFlamesData(null);
    setFlamesLoading(false);
    setQuizAnswers(defaultQuizAnswers);
    setQuizIndex(0);
    setQuizAdvancing(false);
    setTaskScore(0);
    setFinalResult(null);
  };

  const handleQuizSelect = (answerIndex) => {
    const currentQuestion = questions[quizIndex];
    const nextAnswers = [...quizAnswers];
    nextAnswers[quizIndex] = currentQuestion.answers[answerIndex];
    setQuizAnswers(nextAnswers);
    setQuizAdvancing(true);

    if (quizAdvanceTimer.current) {
      window.clearTimeout(quizAdvanceTimer.current);
    }

    quizAdvanceTimer.current = window.setTimeout(() => {
      quizAdvanceTimer.current = null;
      setQuizAdvancing(false);
      if (quizIndex < questions.length - 1) {
        setQuizIndex((current) => current + 1);
      } else {
        setStage('tasks');
      }
    }, 260);
  };

  const handleQuizBack = () => {
    if (quizAdvanceTimer.current) {
      window.clearTimeout(quizAdvanceTimer.current);
      quizAdvanceTimer.current = null;
    }

    setQuizAdvancing(false);

    if (quizIndex === 0) {
      setStage('flames');
      return;
    }

    setQuizIndex((current) => current - 1);
  };

  const handleTaskBack = () => {
    setStage('quiz');
  };

  const handleTaskFinish = (points) => {
    setTaskScore(points);
    setFinalResult(flamesData ?? calculateFlames(names.yourName, names.crushName));
    setStage('result');
  };

  const reset = () => {
    if (quizAdvanceTimer.current) {
      window.clearTimeout(quizAdvanceTimer.current);
      quizAdvanceTimer.current = null;
    }

    setStage('home');
    setFlamesData(null);
    setFlamesLoading(false);
    setQuizAnswers(defaultQuizAnswers);
    setQuizIndex(0);
    setQuizAdvancing(false);
    setTaskScore(0);
    setFinalResult(null);
  };

  return (
    <main className={`app-shell theme-${theme}`}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <header className="topbar">
        <div>
          <div className="brand">Crush Compatibility Lab</div>
          <div className="message">A simple compatibility test with a little drama.</div>
        </div>
        <button className="ghost-btn tiny-btn" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
      </header>

      <div className={`stage-wrap stage-${stage}`}>
        {stage === 'home' ? (
          <Home
            onStart={start}
            names={names}
            setNames={setNames}
            canStart={canStart}
            onToggleTheme={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            theme={theme}
          />
        ) : null}

        {stage === 'flames' ? (
          <Flames
            data={flamesData}
            loading={flamesLoading}
            onBack={goHome}
            onNext={() => setStage('quiz')}
            canNext={!!flamesData && !flamesLoading}
            stepLabel="Step 1 / 3"
          />
        ) : null}

        {stage === 'quiz' ? (
          <Quiz
            step={quizIndex}
            score={quizScore}
            onSelectAnswer={handleQuizSelect}
            onBack={handleQuizBack}
            selectedIndex={quizAnswers[quizIndex] ? questions[quizIndex].answers.indexOf(quizAnswers[quizIndex]) : -1}
            isAdvancing={quizAdvancing}
          />
        ) : null}

        {stage === 'tasks' ? <Tasks onBack={handleTaskBack} onFinish={handleTaskFinish} stepLabel="Step 3 / 3" /> : null}

        {stage === 'result' && finalResult ? (
          <Result
            result={finalResult}
            quizScore={quizScore}
            taskScore={taskScore}
            quizMax={quizMax}
            taskMax={taskMax}
            onReset={reset}
            userNames={{
              yourName: names.yourName,
              crushName: names.crushName,
            }}
          />
        ) : null}
      </div>
    </main>
  );
}
