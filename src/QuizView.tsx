import { useState, useEffect } from 'react';
import { examQuestions, type ExamQuestion } from './examData'; // ✨ 引入新題庫

interface QuizViewProps {
  onFinish: (score: number) => void;
  onExit: () => void;
}

export default function QuizView({ onFinish, onExit }: QuizViewProps) {
  // 測驗狀態
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // 使用者選了哪個
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  // 1. 初始化：從 examData.ts 中隨機抽取 50 題
  useEffect(() => {
    const shuffled = [...examQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 30));
  }, []);

  // 2. 處理點擊答案
  const handleAnswer = (answerText: string) => {
    if (selectedOption) return; // 防止重複點擊

    setSelectedOption(answerText);
    const currentQ = questions[currentIndex];

    if (answerText === currentQ.a) {
      // 答對了
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => nextOrFinish(newScore), 600);
    } else {
      // 答錯了
      setIsWrong(true);
      setTimeout(() => nextOrFinish(score), 1500);
    }
  };

  const nextOrFinish = (finalScore: number) => {
    if (currentIndex + 1 >= questions.length) {
      onFinish(finalScore);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsWrong(false);
    }
  };

  if (questions.length === 0) return <div className="loading">準備題目中...</div>;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="app-container">
      <div className="quiz-screen">
        <div className="quiz-header">
          <button onClick={() => { if(window.confirm('確定退出測驗？')) onExit(); }} className="btn-ghost">
            ✕ 退出
          </button>
          <span style={{fontWeight: 'bold', color: '#868e96'}}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="progress-container">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>

        {/* 題目卡片 */}
        <div className="flash-card mc-card">
          <div className="quiz-question-type">請選擇正確答案</div>
          <div className="quiz-word">{currentQ.q}</div>
          
          {/* 答錯提示 */}
          {isWrong && (
            <div className="wrong-feedback">
              正解：{currentQ.a}
            </div>
          )}
        </div>

        {/* 選項區 */}
        <div className="options-grid">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "option-btn";
            if (selectedOption) {
              if (opt === currentQ.a) btnClass += " correct"; // 正解亮綠燈
              else if (opt === selectedOption) btnClass += " wrong"; // 選錯亮紅燈
              else btnClass += " muted";
            }

            return (
              <button 
                key={idx}
                className={btnClass}
                onClick={() => handleAnswer(opt)}
              >
                {/* 直接顯示選項文字 (不再分讀音/中文) */}
                <div className="opt-reading">{opt}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}