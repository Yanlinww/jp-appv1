// src/QuizView.tsx
import { useState, useEffect, useMemo } from 'react';
import { type ExamQuestion } from './examData';
import { n5List, type Word } from './data'; // ✨ 引入單字庫來查解析

export interface QuizLog {
  question: ExamQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizViewProps {
  list: ExamQuestion[];
  count: number;
  onFinish: (score: number, history: QuizLog[]) => void;
  onExit: () => void;
}

export default function QuizView({ list, count, onFinish, onExit }: QuizViewProps) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<QuizLog[]>([]);
  
  // 狀態控制
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // 初始化題目
  useEffect(() => {
    if (list.length > 0) {
      const shuffled = [...list].sort(() => 0.5 - Math.random());
      const actualCount = Math.min(count, list.length);
      setQuestions(shuffled.slice(0, actualCount));
    }
  }, [list, count]);

  // ✨ 智慧解析邏輯：根據當前題目(q)，去 n5List 找詳細資料
  const currentDetails = useMemo(() => {
    if (questions.length === 0) return null;
    const currentQ = questions[currentIndex];
    
    // 嘗試用題目 (q) 去對應單字 (w)
    return n5List.find(word => word.w === currentQ.q) || null;
  }, [questions, currentIndex]);

  // 處理作答
  const handleAnswer = (answerText: string) => {
    if (hasAnswered) return;

    setSelectedOption(answerText);
    setHasAnswered(true);
    
    const currentQ = questions[currentIndex];
    const isCorrect = answerText === currentQ.a;

    const log: QuizLog = {
      question: currentQ,
      userAnswer: answerText,
      isCorrect: isCorrect,
    };
    setHistory([...history, log]);

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(score, history);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  };

  const handleEarlySubmit = () => {
    if (!window.confirm(`還有 ${questions.length - currentIndex} 題沒寫，確定要提早交卷嗎？`)) return;
    const remainingLogs: QuizLog[] = [];
    for (let i = currentIndex; i < questions.length; i++) {
      remainingLogs.push({
        question: questions[i],
        userAnswer: "未作答",
        isCorrect: false,
      });
    }
    onFinish(score, [...history, ...remainingLogs]);
  };

  if (questions.length === 0) return <div className="loading" style={{padding:40, textAlign:'center'}}>準備題目中...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;
  const isCurrentCorrect = selectedOption === currentQ.a;

  return (
    <div className="app-container">
      <div className="quiz-screen">
        <div className="quiz-header">
          <button onClick={() => { if(window.confirm('確定放棄？')) onExit(); }} className="btn-ghost" style={{fontSize: '0.9rem'}}>✕ 放棄</button>
          <span style={{fontWeight: 'bold', color: 'var(--text-sub)'}}>{currentIndex + 1} / {questions.length}</span>
          <button onClick={handleEarlySubmit} className="btn-ghost" style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem'}}>交卷</button>
        </div>

        <div className="progress-container">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>

        {/* 題目卡片 */}
        <div className="flash-card mc-card">
          <div className="quiz-question-type">請選擇正確的意思/讀音</div>
          <div className="quiz-word" style={{fontSize: currentQ.q.length > 5 ? '2.5rem' : '3.5rem'}}>
            {currentQ.q}
          </div>
          
          {/* ✨ 解析區塊：已作答時才顯示 (樣式優化版) */}
          {hasAnswered && (
            <div className={`feedback-box ${isCurrentCorrect ? 'fb-correct' : 'fb-wrong'}`}>
              <div className="fb-header">
                {isCurrentCorrect ? '⭕ 答對了！' : '❌ 答錯了'}
              </div>
              
              <div className="fb-content">
                <div className="fb-row">
                  <span className="fb-label">正解</span>
                  <span className="fb-value-lg">{currentQ.a}</span>
                </div>

                {/* 如果有找到詳細資料，就顯示中文意思 */}
                {currentDetails && (
                  <>
                    <div className="fb-divider"></div>
                    <div className="fb-row">
                      <span className="fb-label">意思</span>
                      <span className="fb-value">{currentDetails.m}</span>
                    </div>
                    {currentDetails.p && (
                      <div className="fb-row">
                        <span className="fb-label">詞性</span>
                        <span className="fb-value">{currentDetails.p}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 選項區 */}
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "option-btn";
            
            if (hasAnswered) {
              if (opt === currentQ.a) btnClass += " correct"; 
              else if (opt === selectedOption) btnClass += " wrong";
              else btnClass += " muted";
            }

            return (
              <button key={idx} className={btnClass} onClick={() => handleAnswer(opt)}>
                <div className="opt-reading" style={{fontSize: '1.1rem'}}>{opt}</div>
              </button>
            );
          })}
        </div>

        {/* 下一題按鈕 */}
        {hasAnswered && (
          <div className="quiz-footer-action">
            <button className="btn btn-primary next-btn" onClick={handleNext}>
              {currentIndex + 1 >= questions.length ? '查看成績' : '下一題 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}