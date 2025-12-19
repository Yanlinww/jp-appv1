import { useState, useEffect } from 'react';
import { type Word } from './data';

export interface QuizLog {
  question: Word;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  options: string[];
}

interface QuizViewProps {
  list: Word[];
  count: number; // ✨ 新增：接收要考幾題
  onFinish: (score: number, history: QuizLog[]) => void;
  onExit: () => void;
}

export default function QuizView({ list, count, onFinish, onExit }: QuizViewProps) {
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [history, setHistory] = useState<QuizLog[]>([]);
  const [isMeaningQuiz, setIsMeaningQuiz] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  // 1. 初始化：根據傳入的 count 取題
  useEffect(() => {
    if (list.length > 0) {
      const shuffled = [...list].sort(() => 0.5 - Math.random());
      // ✨ 關鍵修改：使用傳進來的 count，但不能超過列表總長度
      const actualCount = Math.min(count, list.length);
      setQuestions(shuffled.slice(0, actualCount));
    }
  }, [list, count]);

  // 2. 切換題目邏輯 (保持不變)
  useEffect(() => {
    if (questions.length > 0) {
      const currentQ = questions[currentIndex];
      
      const hasKanji = currentQ.w !== currentQ.r; 
      const isMeaning = !hasKanji || Math.random() > 0.5;
      setIsMeaningQuiz(isMeaning);

      const correctAns = isMeaning ? currentQ.m : currentQ.r;

      const distractors = list
        .filter(w => w.w !== currentQ.w)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => isMeaning ? w.m : w.r);

      const options = [correctAns, ...distractors].sort(() => 0.5 - Math.random());
      
      setCurrentOptions(options);
    }
  }, [questions, currentIndex, list]);

  const handleEarlySubmit = () => {
    if (!window.confirm(`還有 ${questions.length - currentIndex} 題沒寫，確定要提早交卷嗎？`)) return;

    const remainingLogs: QuizLog[] = [];
    for (let i = currentIndex; i < questions.length; i++) {
      const q = questions[i];
      const ans = q.m; 
      remainingLogs.push({
        question: q,
        userAnswer: "未作答",
        correctAnswer: ans,
        isCorrect: false,
        options: []
      });
    }
    onFinish(score, [...history, ...remainingLogs]);
  };

  const handleAnswer = (answerText: string) => {
    if (selectedOption) return;

    setSelectedOption(answerText);
    const currentQ = questions[currentIndex];
    
    const correctAns = isMeaningQuiz ? currentQ.m : currentQ.r;
    const isCorrect = answerText === correctAns;

    const log: QuizLog = {
      question: currentQ,
      userAnswer: answerText,
      correctAnswer: correctAns,
      isCorrect: isCorrect,
      options: currentOptions
    };
    
    const newHistory = [...history, log];
    setHistory(newHistory);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => nextOrFinish(newScore, newHistory), 600);
    } else {
      setIsWrong(true);
      setTimeout(() => nextOrFinish(score, newHistory), 1500);
    }
  };

  const nextOrFinish = (finalScore: number, finalHistory: QuizLog[]) => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(finalScore, finalHistory);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsWrong(false);
    }
  };

  if (questions.length === 0) return <div className="loading">準備題目中...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const questionText = currentQ.w; 
  const questionType = isMeaningQuiz ? "請選擇正確的意思" : "請選擇正確的讀音";

  return (
    <div className="app-container">
      <div className="quiz-screen">
        <div className="quiz-header">
          <button onClick={() => { if(window.confirm('確定放棄？')) onExit(); }} className="btn-ghost" style={{fontSize: '0.9rem'}}>✕ 放棄</button>
          <span style={{fontWeight: 'bold', color: '#868e96'}}>{currentIndex + 1} / {questions.length}</span>
          <button onClick={handleEarlySubmit} className="btn-ghost" style={{color: '#5c7cfa', fontWeight: 'bold', fontSize: '0.9rem'}}>交卷 →</button>
        </div>

        <div className="progress-container">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>

        <div className="flash-card mc-card">
          <div className="quiz-question-type">{questionType}</div>
          <div className="quiz-word">{questionText}</div>
          
          {isWrong && (
            <div className="wrong-feedback">
              正解：{isMeaningQuiz ? currentQ.m : currentQ.r}
            </div>
          )}
        </div>

        <div className="options-grid">
          {currentOptions.map((opt, idx) => {
            const correctAns = isMeaningQuiz ? currentQ.m : currentQ.r;
            let btnClass = "option-btn";
            
            if (selectedOption) {
              if (opt === correctAns) btnClass += " correct"; 
              else if (opt === selectedOption) btnClass += " wrong";
              else btnClass += " muted";
            }

            return (
              <button key={idx} className={btnClass} onClick={() => handleAnswer(opt)}>
                <div className="opt-reading" style={{fontSize: isMeaningQuiz ? '1rem' : '1.2rem'}}>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}