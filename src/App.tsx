import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { allLevels, type Word } from './data'; // ✨ 改成引入 allLevels
import './App.css';

// 定義頁面狀態 (新增 level_select 為最外層)
type ViewMode = 'level_select' | 'home' | 'list' | 'saved' | 'quiz' | 'result' | 'detail';
type SortMode = 'default' | 'aiueo';
type FilterPos = 'all' | 'noun' | 'verb' | 'adj';
// ✨ 定義等級
type LevelKey = 'n5' | 'n4' | 'n3';

function App() {
  // 預設進入等級選擇頁
  const [view, setView] = useState<ViewMode>('level_select');
  // ✨ 新增：目前選擇的等級 (預設 N5)
  const [level, setLevel] = useState<LevelKey>('n5');
  
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('jp_saved_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Word[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [filterPos, setFilterPos] = useState<FilterPos>('all');

  const listRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);

  // ✨ 關鍵：根據選擇的等級，切換使用的單字表
  const activeList = useMemo(() => allLevels[level], [level]);

  // ESC 鍵邏輯
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (view === 'detail') setView('list');
        else if (view === 'quiz') {
          if (window.confirm('確定退出測驗？')) setView('home');
        }
        else if (view === 'home') setView('level_select'); // Home 按 ESC 回等級選單
        else if (view !== 'level_select') setView('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  useLayoutEffect(() => {
    if ((view === 'list' || view === 'saved') && listRef.current) {
      listRef.current.scrollTop = scrollPos.current;
    }
  }, [view]);

  // --- 功能函式 ---

  // 選擇等級並進入 Dashboard
  const selectLevel = (lvl: LevelKey) => {
    setLevel(lvl);
    setView('home');
    setSearchTerm(''); // 清空搜尋
    setSortMode('default');
    setFilterPos('all');
  };

  const toggleSave = (word: string) => {
    setSavedWords(prev => {
      const newSaved = prev.includes(word) 
        ? prev.filter(w => w !== word) 
        : [...prev, word];
      localStorage.setItem('jp_saved_words', JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const openDetail = (word: Word) => {
    if (listRef.current) scrollPos.current = listRef.current.scrollTop;
    setSelectedWord(word);
    setView('detail');
  };

  // 篩選邏輯 (使用 activeList)
  const filteredList = useMemo(() => {
    // 1. 基礎篩選 (只顯示當前等級的單字！)
    let list = view === 'saved' 
      ? activeList.filter(v => savedWords.includes(v.w)) 
      : activeList;
    
    // 2. 搜尋
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(v => 
        v.w.includes(lower) || v.r.includes(lower) || v.m.includes(lower)
      );
    }

    // 3. 詞性
    if (filterPos !== 'all') {
      list = list.filter(v => {
        if (filterPos === 'noun') return v.p.includes('名詞');
        if (filterPos === 'verb') return v.p.includes('動詞');
        if (filterPos === 'adj') return v.p.includes('形容詞');
        return true;
      });
    }

    // 4. 排序
    if (sortMode === 'aiueo') {
      list = [...list].sort((a, b) => {
        const getCleanReading = (str: string) => str.replace(/[一-龠々〆ヵヶ()（）]/g, ''); 
        const rA = getCleanReading(a.r);
        const rB = getCleanReading(b.r);
        return rA.localeCompare(rB, 'ja');
      });
    }

    return list;
  }, [view, savedWords, searchTerm, sortMode, filterPos, activeList]); // 加入 activeList

  const startQuiz = () => {
    const shuffled = [...activeList].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 50));
    setCurrentQIndex(0);
    setScore(0);
    setShowAnswer(false);
    setView('quiz');
  };

  const nextQuestion = (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);
    if (currentQIndex + 1 >= 50) {
      setView('result');
    } else {
      setCurrentQIndex(c => c + 1);
      setShowAnswer(false);
    }
  };

  // --- 畫面渲染 ---

  // 0. 最外層：等級選擇頁 (Level Select)
  if (view === 'level_select') {
    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="hero-section">
            <div className="hero-icon">🗻</div>
            <div className="app-title">日本語 Go</div>
            <div className="app-subtitle">請選擇檢定等級</div>
          </div>
          
          <div className="menu-grid">
            <button onClick={() => selectLevel('n5')} className="btn menu-card level-card n5">
              <div className="level-badge">N5</div>
              <div className="level-info">入門基礎 ({allLevels.n5.length}單)</div>
            </button>
            <button onClick={() => selectLevel('n4')} className="btn menu-card level-card n4">
              <div className="level-badge">N4</div>
              <div className="level-info">初級進階 ({allLevels.n4.length}單)  (未完成)</div>
            </button>
            <button onClick={() => selectLevel('n3')} className="btn menu-card level-card n3">
              <div className="level-badge">N3</div>
              <div className="level-info">日常應用 ({allLevels.n3.length}單)  (未完成)</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. 各等級的主頁 (Dashboard)
  if (view === 'home') {
    return (
      <div className="app-container">
        <div className="home-screen">
          {/* 頂部返回等級按鈕 */}
          <div style={{width: '100%', marginBottom: 10}}>
             <button onClick={() => setView('level_select')} className="btn-ghost">← 切換等級</button>
          </div>

          <div className="hero-section">
            {/* 顯示當前等級的大字 */}
            <div className="current-level-tag">{level.toUpperCase()}</div>
            <div className="app-subtitle">學習儀表板</div>
          </div>
          
          <div className="menu-grid">
            <button onClick={() => { setSearchTerm(''); setView('list'); setSortMode('default'); setFilterPos('all'); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#e7f5ff', color: '#5c7cfa'}}>📖</div>
              <div>{level.toUpperCase()} 單字表</div>
            </button>
            
            <button onClick={() => { setSearchTerm(''); setView('saved'); setSortMode('default'); setFilterPos('all'); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#fff4e6', color: '#ff922b'}}>⭐</div>
              <div>{level.toUpperCase()} 不熟單字</div>
            </button>

            <button onClick={startQuiz} className="btn menu-card">
              <div className="icon-box" style={{background: '#ebfbee', color: '#51cf66'}}>🎲</div>
              <div>{level.toUpperCase()} 隨機測驗</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 列表頁 (List & Saved)
  if (view === 'list' || view === 'saved') {
    return (
      <div className="app-container">
        <div className="list-screen">
          <div className="sticky-header">
            <div className="header-top">
              <button onClick={() => setView('home')} className="btn-ghost">✕ 關閉</button>
              <h2 className="page-title" style={{color: view === 'saved' ? '#ff922b' : '#343a40'}}>
                {view === 'saved' ? '不熟單字' : `${level.toUpperCase()} 單字表`}
              </h2>
              <div style={{width: 40}}></div>
            </div>
            
            <input 
              type="text" 
              placeholder="搜尋單字..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="control-row">
              <span className="control-label">排序</span>
              <div className="control-group">
                <button className={`sort-pill ${sortMode === 'default' ? 'active' : ''}`} onClick={() => setSortMode('default')}>預設</button>
                <button className={`sort-pill ${sortMode === 'aiueo' ? 'active' : ''}`} onClick={() => setSortMode('aiueo')}>50音</button>
              </div>
            </div>

            <div className="control-row">
              <span className="control-label">詞性</span>
              <div className="control-group scroll-group">
                <button className={`filter-pill ${filterPos === 'all' ? 'active' : ''}`} onClick={() => setFilterPos('all')}>全部</button>
                <button className={`filter-pill ${filterPos === 'noun' ? 'active' : ''}`} onClick={() => setFilterPos('noun')}>名詞</button>
                <button className={`filter-pill ${filterPos === 'verb' ? 'active' : ''}`} onClick={() => setFilterPos('verb')}>動詞</button>
                <button className={`filter-pill ${filterPos === 'adj' ? 'active' : ''}`} onClick={() => setFilterPos('adj')}>形容詞</button>
              </div>
            </div>
          </div>
          
          <div className="word-list" ref={listRef}>
            {filteredList.length === 0 ? (
              <div style={{textAlign: 'center', padding: 40, color: '#868e96'}}>
                沒有找到資料 🍃
              </div>
            ) : (
              filteredList.map((item) => (
                <div 
                  key={item.w} 
                  className="word-item" 
                  onClick={() => openDetail(item)}
                  style={{cursor: 'pointer'}}
                >
                  <button 
                    className={`star-btn ${savedWords.includes(item.w) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleSave(item.w); }}
                  >
                    {savedWords.includes(item.w) ? '★' : '☆'}
                  </button>
                  <div className="word-info">
                    <div className="word-main">{item.w}</div>
                    {/* 修改列表項目的顯示結構 */}
                  <div className="word-sub">
                    {/* 1. 中文意思 (有背景色) */}
                    <span className="meaning-tag">{item.m}</span>
                    
                    {/* 2. 讀音 */}
                    <span className="reading">{item.r}</span>
                    
                    {/* 3. 分隔線 */}
                    <span className="separator">•</span>
                    
                    {/* 4. 詞性 (灰字) */}
                    <span className="pos-text">{item.p}</span>
                  </div>
                  </div>
                  <div style={{color: '#dee2e6', paddingRight: 10}}>›</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. 詳細頁 (Detail)
  if (view === 'detail' && selectedWord) {
    const isSaved = savedWords.includes(selectedWord.w);
    const currentIndex = filteredList.findIndex(w => w.w === selectedWord.w);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < filteredList.length - 1;

    const goToPrev = () => { if (hasPrev) setSelectedWord(filteredList[currentIndex - 1]); };
    const goToNext = () => { if (hasNext) setSelectedWord(filteredList[currentIndex + 1]); };

    return (
      <div className="app-container">
        <div className="detail-screen">
          <div className="detail-header">
            <button onClick={() => setView('list')} className="btn-ghost">← 返回</button>
            <button 
              className={`btn-ghost ${isSaved ? 'active-star' : ''}`}
              onClick={() => toggleSave(selectedWord.w)}
              style={{fontSize: '1.5rem'}}
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>

          <div style={{flex: 1, overflowY: 'auto'}}>
            <div className="detail-card">
              <span className="detail-pos">{selectedWord.p}</span>
              <div className="detail-word">{selectedWord.w}</div>
              <div className="detail-reading">{selectedWord.r}</div>
            </div>

            <div className="info-block">
              <div className="info-label">中文意思</div>
              <div className="info-content">{selectedWord.m}</div>
            </div>

            <div className="info-block">
              <div className="info-label">例句 / 例文</div>
              {selectedWord.s ? (
                <div className="sentence-box">
                  <div className="sentence-jp">{selectedWord.s}</div>
                  <div className="sentence-cn">{selectedWord.st}</div>
                </div>
              ) : (
                <div className="info-content empty">(暫無例句資料)</div>
              )}
            </div>
          </div>

          <div className="detail-footer">
            <button className="nav-btn" onClick={goToPrev} disabled={!hasPrev}>← 上一個</button>
            <div className="nav-counter">{currentIndex + 1} / {filteredList.length}</div>
            <button className="nav-btn" onClick={goToNext} disabled={!hasNext}>下一個 →</button>
          </div>
        </div>
      </div>
    );
  }

  // 4. 測驗頁 (Quiz)
  if (view === 'quiz') {
    const q = quizQuestions[currentQIndex];
    if (!q) return <div>載入中...</div>;
    const progress = ((currentQIndex) / 50) * 100;
    const isSaved = savedWords.includes(q.w);

    return (
      <div className="app-container">
        <div className="quiz-screen">
          <div className="quiz-header">
             <button onClick={() => { if(window.confirm('確定退出測驗？')) setView('home'); }} className="btn-ghost">✕ 退出</button>
             <span style={{fontWeight: 'bold', color: '#868e96'}}>{currentQIndex + 1} / 50</span>
          </div>
          <div className="progress-container"><div className="progress-fill" style={{width: `${progress}%`}}></div></div>
          <div className="flash-card">
             <button className={`quiz-star-btn ${isSaved ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSave(q.w); }}>{isSaved ? '★' : '☆'}</button>
             <div className="quiz-word">{q.w}</div>
             {showAnswer ? (<div className="answer-box"><div className="answer-pos">{q.p}</div><div className="answer-reading">{q.r}</div><div className="answer-meaning">{q.m}</div></div>) : (<div style={{color: '#adb5bd', fontSize: '0.9rem'}}>思考一下讀音...</div>)}
          </div>
          {!showAnswer ? (<button onClick={() => setShowAnswer(true)} className="btn btn-primary">看答案</button>) : (<div className="quiz-actions"><button onClick={() => nextQuestion(false)} className="btn btn-danger">忘了 😓</button><button onClick={() => nextQuestion(true)} className="btn btn-success">記得！😎</button></div>)}
        </div>
      </div>
    );
  }

  // 5. 結果頁 (Result)
  if (view === 'result') {
    return (
      <div className="app-container">
        <div className="result-screen">
          <div className="score-circle"><div className="score-number">{score}</div><div className="score-label">分 (共50題)</div></div>
          <h2 style={{marginBottom: 30}}>測驗結束！🎉</h2>
          <button onClick={startQuiz} className="btn btn-primary" style={{marginBottom: 16}}>再測一次</button>
          <button onClick={() => setView('home')} className="btn btn-outline">回儀表板</button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;