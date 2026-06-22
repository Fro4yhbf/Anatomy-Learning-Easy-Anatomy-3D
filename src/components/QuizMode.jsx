import { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { STRUCTURES } from '../data/anatomyData';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function generateQuestions(count = 10) {
  const pool = shuffle(STRUCTURES).slice(0, count);
  return pool.map(s => {
    const wrong = shuffle(STRUCTURES.filter(x => x.id !== s.id)).slice(0, 3);
    const options = shuffle([s, ...wrong]);
    return { structure: s, question: 'Как называется эта структура?', promptLat: s.nameLat, options: options.map(o => ({ id: o.id, label: o.nameRus })), correctId: s.id };
  });
}

function generateMatchQuestions(count = 8) {
  const pool = shuffle(STRUCTURES).slice(0, count);
  return pool.map(s => {
    const wrong = shuffle(STRUCTURES.filter(x => x.id !== s.id)).slice(0, 3);
    const options = shuffle([s, ...wrong]);
    return { structure: s, question: 'Найдите русское название для:', promptLat: s.nameLat, options: options.map(o => ({ id: o.id, label: o.nameRus })), correctId: s.id };
  });
}

export default function QuizMode({ onClose }) {
  const [quizType, setQuizType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const startQuiz = (type) => {
    setQuizType(type);
    setQuestions(type === 'match' ? generateMatchQuestions() : generateQuestions());
    setCurrent(0); setSelected(null); setScore(0); setFinished(false);
  };

  const handleAnswer = (optId) => {
    if (selected !== null) return;
    setSelected(optId);
    const correct = optId === questions[current].correctId;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= questions.length) setFinished(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1000);
  };

  if (!quizType) return (
    <div className="quiz-overlay"><div className="quiz-panel">
      <div className="quiz-header"><h2>Режим тестирования</h2><button className="btn-icon" onClick={onClose}>✕</button></div>
      <p className="quiz-subtitle">Выберите тип теста</p>
      <div className="quiz-type-list">
        <button className="quiz-type-btn" onClick={() => startQuiz('identify')}>
          <div className="quiz-type-icon">🔍</div>
          <div><div className="quiz-type-title">Определи структуру</div><div className="quiz-type-desc">Выберите русское название по латинскому термину</div></div>
        </button>
        <button className="quiz-type-btn" onClick={() => startQuiz('match')}>
          <div className="quiz-type-icon">🔗</div>
          <div><div className="quiz-type-title">Латынь → Русский</div><div className="quiz-type-desc">Сопоставьте латинский и русский термины</div></div>
        </button>
      </div>
    </div></div>
  );

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-overlay"><div className="quiz-panel">
        <div className="quiz-finish">
          <div className="quiz-trophy"><Trophy size={48} color={pct >= 70 ? '#f9ca24' : '#636e72'} /></div>
          <h2 className="quiz-score-title">Результат</h2>
          <div className="quiz-score-big">{score} / {questions.length}</div>
          <div className={`quiz-score-pct ${pct>=70?'good':'bad'}`}>{pct}%</div>
          <p className="quiz-verdict">{pct>=90?'Отлично! Вы отлично знаете анатомию.':pct>=70?'Хороший результат! Ещё немного практики.':'Нужно повторить. Не сдавайтесь!'}</p>
          <div className="quiz-finish-actions">
            <button className="btn-primary" onClick={() => startQuiz(quizType)}><RotateCcw size={16} /> Пройти снова</button>
            <button className="btn-secondary" onClick={() => { setQuizType(null); setFinished(false); }}>Выбрать тест</button>
            <button className="btn-secondary" onClick={onClose}>Закрыть</button>
          </div>
        </div>
      </div></div>
    );
  }

  const q = questions[current];
  if (!q) return null;

  return (
    <div className="quiz-overlay"><div className="quiz-panel">
      <div className="quiz-header">
        <div className="quiz-progress-text">Вопрос {current + 1} / {questions.length}</div>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>
      <div className="quiz-progress-bar"><div className="quiz-progress-fill" style={{ width: `${(current/questions.length)*100}%` }} /></div>
      <div className="quiz-score-inline">Счёт: {score}</div>
      <div className="quiz-question">
        <div className="quiz-q-label">{q.question}</div>
        <div className="quiz-q-term">{q.promptLat}</div>
      </div>
      <div className="quiz-options">
        {q.options.map(opt => {
          let cls = 'quiz-option';
          if (selected !== null) {
            if (opt.id === q.correctId) cls += ' correct';
            else if (opt.id === selected) cls += ' wrong';
          }
          return (
            <button key={opt.id} className={cls} onClick={() => handleAnswer(opt.id)} disabled={selected !== null}>
              <span>{opt.label}</span>
              {selected !== null && opt.id === q.correctId && <CheckCircle size={16} />}
              {selected !== null && opt.id === selected && opt.id !== q.correctId && <XCircle size={16} />}
            </button>
          );
        })}
      </div>
    </div></div>
  );
}
