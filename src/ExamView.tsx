import { useState } from 'react';
import { type ExamPaper } from './exam_n5_2010';

interface ExamViewProps {
  paper: ExamPaper;
  onExit: () => void;
}

export default function ExamView({ paper, onExit }: ExamViewProps) {
  const [answers, setAnswers] = useState<{[key: string]: number}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (!window.confirm("確定要交卷嗎？交卷後將顯示分數與解析。")) return;

    let correctCount = 0;
    paper.questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctCount++;
      }
    });

    setScore(Math.round((correctCount / paper.questions.length) * 100));
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  const handleSelect = (qId: string, optionIdx: number) => {
    if (isSubmitted) return; 
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  // 解析題目 (處理 __標記__)
  const renderQuestionText = (text: string) => {
    if (!text.includes('__')) return text;
    const parts = text.split(/__(.*?)__/);
    return parts.map((part, index) => {
      if (index % 2 === 1) return <span key={index} className="highlight-text">{part}</span>;
      return part;
    });
  };

  return (
    <div className="app-container">
      <div className="list-screen">
        <div className="sticky-header">
          <div className="header-top">
            <button onClick={onExit} className="btn-ghost">✕ 退出</button>
            <h2 className="page-title">{paper.title}</h2>
            <div style={{width: 40}}></div>
          </div>
        </div>

        <div className="word-list exam-content">
          
          {isSubmitted && (
            <div className="exam-result-card">
              <div className="exam-score">{score} 分</div>
              <div className="exam-score-sub">
                答對 {paper.questions.filter(q => answers[q.id] === q.answer).length} / {paper.questions.length} 題
              </div>
            </div>
          )}

          {paper.questions.map((q, index) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.answer;
            const showSectionTitle = index === 0 || q.section !== paper.questions[index - 1].section;

            return (
              <div key={q.id}>
                {showSectionTitle && <div className="exam-section-title">{q.section}</div>}
                
                <div className={`exam-question-box ${isSubmitted ? (isCorrect ? 'correct' : 'wrong') : ''}`}>
                  <div className="exam-q-text">
                    <span className="q-id">{index + 1}.</span> 
                    {renderQuestionText(q.question)}
                  </div>

                  {/* ✨ 交卷後顯示題目翻譯 */}
                  {isSubmitted && q.textTranslation && (
                    <div className="exam-translation">
                      {q.textTranslation}
                    </div>
                  )}
                  
                  <div className="exam-options">
                    {q.options.map((opt, i) => {
                      const optNum = i + 1;
                      let btnClass = "exam-opt-btn";
                      
                      if (isSubmitted) {
                        if (optNum === q.answer) btnClass += " ans-correct"; 
                        else if (optNum === userAns) btnClass += " ans-wrong"; 
                      } else {
                        if (optNum === userAns) btnClass += " active"; 
                      }

                      return (
                        <div key={i} className="opt-container">
                          <button 
                            className={btnClass}
                            onClick={() => handleSelect(q.id, optNum)}
                          >
                            <span className="opt-num">({optNum})</span> {opt}
                          </button>
                          
                          {/* ✨ 交卷後顯示選項翻譯 (如果有) */}
                          {isSubmitted && q.optionTranslations && q.optionTranslations[i] && q.optionTranslations[i] !== "X" && (
                            <div className="exam-opt-trans">
                              {q.optionTranslations[i]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 解析區 */}
                  {isSubmitted && (
                    <div className="exam-analysis">
                      <div className="analysis-label">正解：{q.answer}</div>
                      
                      {q.explanation && (
                        <div className="analysis-text">
                          <span className="tag-expl">解析</span> {q.explanation}
                        </div>
                      )}

                      {q.script && (
                        <div className="analysis-content">
                          <strong>聽力稿：</strong><br/>
                          {q.script}
                        </div>
                      )}
                      {q.note && <div className="analysis-note">💡 {q.note}</div>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!isSubmitted && (
            <button className="btn btn-primary submit-btn" onClick={handleSubmit}>
              交卷查看成績
            </button>
          )}
        </div>
      </div>
    </div>
  );
}