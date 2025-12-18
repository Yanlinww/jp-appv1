import { useState, useEffect } from 'react';
import { examQuestions, type ExamQuestion } from './examData';

export interface QuizLog {
  question: ExamQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

interface QuizViewProps {
  onFinish: (score: number, history: QuizLog[]) => void;
  onExit: () => void;
}

export default function QuizView({ onFinish, onExit }: QuizViewProps) {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [history, setHistory] = useState<QuizLog[]>([]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  // 1. 初始化：洗牌並改為取「30題」
  useEffect(() => {
    const shuffled = [...examQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 30)); // ✨ 修改這裡：50 -> 30
  }, []);

  // 2. 切換題目時洗牌選項
  useEffect(() => {
    if (questions.length > 0) {
      const currentQ = questions[currentIndex];
      const shuffledOptions = [...currentQ.options].sort(() => 0.5 - Math.random());
      setCurrentOptions(shuffledOptions);
    }
  }, [questions, currentIndex]);

  // ✨ 新增：提早交卷功能
  const handleEarlySubmit = () => {
    if (!window.confirm(`還有 ${questions.length - currentIndex} 題沒寫，確定要提早交卷嗎？\n(未作答的題目將直接算錯)`)) {
      return;
    }

    // 1. 產生剩下題目的「未作答」紀錄
    const remainingLogs: QuizLog[] = [];
    for (let i = currentIndex; i < questions.length; i++) {
      remainingLogs.push({
        question: questions[i],
        userAnswer: "未作答", // 顯示在檢討頁面
        isCorrect: false      // 直接算錯
      });
    }

    // 2. 合併目前的作答紀錄 + 剩下的未作答紀錄
    const finalHistory = [...history, ...remainingLogs];

    // 3. 結算 (分數就是目前的分數，不用加，因為剩下的都錯)
    onFinish(score, finalHistory);
  };

  // 3. 正常作答處理
  const handleAnswer = (answerText: string) => {
    if (selectedOption) return;

    setSelectedOption(answerText);
    const currentQ = questions[currentIndex];
    const correct = answerText === currentQ.a;

    const log: QuizLog = {
      question: currentQ,
      userAnswer: answerText,
      isCorrect: correct
    };
    
    // 先更新 history state，以便接續
    const newHistory = [...history, log];
    setHistory(newHistory);

    if (correct) {
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

  return (
    <div className="app-container">
      <div className="quiz-screen">
        <div className="quiz-header">
          {/* 左邊：直接放棄回首頁 (不結算) */}
          <button onClick={() => { if(window.confirm('確定直接退出？(不保存紀錄)')) onExit(); }} className="btn-ghost" style={{fontSize: '0.9rem'}}>
            ✕ 放棄
          </button>

          <span style={{fontWeight: 'bold', color: '#868e96'}}>
            {currentIndex + 1} / {questions.length}
          </span>

          {/* ✨ 右邊：提早交卷按鈕 */}
          <button onClick={handleEarlySubmit} className="btn-ghost" style={{color: '#5c7cfa', fontWeight: 'bold', fontSize: '0.9rem'}}>
            交卷 →
          </button>
        </div>

        <div className="progress-container">
          <div className="progress-fill" style={{width: `${progress}%`}}></div>
        </div>

        <div className="flash-card mc-card">
          <div className="quiz-question-type">請選擇正確答案</div>
          <div className="quiz-word">{currentQ.q}</div>
          
          {isWrong && (
            <div className="wrong-feedback">
              正解：{currentQ.a}
            </div>
          )}
        </div>

        <div className="options-grid">
          {currentOptions.map((opt, idx) => {
            let btnClass = "option-btn";
            if (selectedOption) {
              if (opt === currentQ.a) btnClass += " correct"; 
              else if (opt === selectedOption) btnClass += " wrong";
              else btnClass += " muted";
            }

            return (
              <button 
                key={idx}
                className={btnClass}
                onClick={() => handleAnswer(opt)}
              >
                <div className="opt-reading">{opt}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}