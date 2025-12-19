import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { allLevels, n5GrammarList, type Word, type Grammar } from './data';
import { basicNumberList } from './basicNumbers'; 
import QuizView, { type QuizLog } from './QuizView';
import './App.css';

// ✨ 新增 quiz_setup
type ViewMode = 'level_select' | 'home' | 'list' | 'saved' | 'quiz' | 'quiz_setup' | 'result' | 'detail' | 'grammar_list' | 'grammar_detail' | 'basic_numbers';
type SortMode = 'default' | 'aiueo';
type FilterPos = 'all' | 'noun' | 'verb' | 'adj';
type LevelKey = 'n5' | 'n4' | 'n3';

function App() {
  const [view, setView] = useState<ViewMode>('level_select');
  const [level, setLevel] = useState<LevelKey>('n5');
  
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('jp_saved_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);

  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizLog[]>([]);
  
  // ✨ 新增：測驗題數狀態 (預設 30)
  const [quizCount, setQuizCount] = useState(30);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [filterPos, setFilterPos] = useState<FilterPos>('all');
  const [showFilter, setShowFilter] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);

  const activeList = useMemo(() => allLevels[level], [level]);
  
  const APP_VERSION = "Ver 2025.12.19 更新";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (view === 'detail') setView('list');
        else if (view === 'grammar_detail') setView('grammar_list');
        else if (view === 'basic_numbers') setView('level_select');
        else if (view === 'quiz_setup') setView('home'); // ✨ 設定頁回首頁
        else if (view === 'quiz') {
          if (window.confirm('確定退出測驗？')) setView('home');
        }
        else if (view === 'home') setView('level_select');
        else if (view === 'result') setView('home');
        else if (view !== 'level_select') setView('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  useLayoutEffect(() => {
    if ((view === 'list' || view === 'saved' || view === 'grammar_list' || view === 'basic_numbers') && listRef.current) {
      listRef.current.scrollTop = scrollPos.current;
    }
  }, [view]);

  const selectLevel = (lvl: LevelKey) => {
    setLevel(lvl);
    setView('home');
    setSearchTerm(''); 
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

  const openGrammar = (grammar: Grammar) => {
    if (listRef.current) scrollPos.current = listRef.current.scrollTop;
    setSelectedGrammar(grammar);
    setView('grammar_detail');
  };

  const filteredList = useMemo(() => {
    let list = view === 'saved' 
      ? activeList.filter(v => savedWords.includes(v.w)) 
      : activeList;
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(v => 
        v.w.includes(lower) || v.r.includes(lower) || v.m.includes(lower)
      );
    }

    if (filterPos !== 'all') {
      list = list.filter(v => {
        if (filterPos === 'noun') return v.p.includes('名詞');
        if (filterPos === 'verb') return v.p.includes('動詞');
        if (filterPos === 'adj') return v.p.includes('形容詞');
        return true;
      });
    }

    if (sortMode === 'aiueo') {
      list = [...list].sort((a, b) => {
        const getCleanReading = (str: string) => str.replace(/[一-龠々〆ヵヶ()（）]/g, ''); 
        const rA = getCleanReading(a.r);
        const rB = getCleanReading(b.r);
        return rA.localeCompare(rB, 'ja');
      });
    }

    return list;
  }, [view, savedWords, searchTerm, sortMode, filterPos, activeList]);

  const handleQuizFinish = (finalScore: number, history: QuizLog[]) => {
    setScore(finalScore);
    setQuizHistory(history);
    setView('result');
  };

  // --- 畫面渲染 ---

  if (view === 'level_select') {
    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="hero-section">
            <div className="hero-icon">🗻</div>
            <div className="app-title">日本語 Go</div>
            <div className="version-badge">{APP_VERSION}</div>
            <div className="app-subtitle">請選擇檢定等級</div>
          </div>
          
          <div className="menu-grid">
            <button onClick={() => setView('basic_numbers')} className="btn menu-card level-card num-card">
              <div className="level-badge num-badge">#</div>
              <div className="level-info">基本數詞 / 量詞</div>
            </button>

            <button onClick={() => selectLevel('n5')} className="btn menu-card level-card n5">
              <div className="level-badge">N5</div>
              <div className="level-info">入門基礎 ({allLevels.n5.length}單)</div>
            </button>
            <button onClick={() => selectLevel('n4')} className="btn menu-card level-card n4">
              <div className="level-badge">N4</div>
              <div className="level-info">初級進階 ({allLevels.n4.length}單)</div>
            </button>
            <button onClick={() => selectLevel('n3')} className="btn menu-card level-card n3">
              <div className="level-badge">N3</div>
              <div className="level-info">日常應用 ({allLevels.n3.length}單)</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'basic_numbers') {
    return (
      <div className="app-container">
        <div className="list-screen">
          <div className="sticky-header">
            <div className="header-top">
              <button onClick={() => setView('level_select')} className="btn-ghost">← 返回</button>
              <h2 className="page-title">基本數詞</h2>
              <div style={{width: 40}}></div>
            </div>
          </div>
          
          <div className="word-list" ref={listRef} style={{padding: '0 16px 40px 16px'}}>
            {basicNumberList.map((category, idx) => (
              <div key={idx} className="number-section">
                <div className="section-title">{category.title}</div>
                <div className="number-grid">
                  {category.items.map((item, i) => (
                    <div key={i} className="number-card">
                      <div className="num-label">{item.label}</div>
                      <div className="num-reading">{item.reading}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    const currentSavedCount = activeList.filter(w => savedWords.includes(w.w)).length;
    return (
      <div className="app-container">
        <div className="home-screen">
          <div style={{width: '100%', marginBottom: 10}}>
             <button onClick={() => setView('level_select')} className="btn-ghost">← 切換等級</button>
          </div>
          <div className="hero-section">
            <div className="current-level-tag">{level.toUpperCase()}</div>
            <div className="app-subtitle">學習儀表板</div>
          </div>
          <div className="menu-grid">
            <button onClick={() => { setSearchTerm(''); setView('list'); setSortMode('default'); setFilterPos('all'); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#e7f5ff', color: '#5c7cfa'}}>📖</div>
              <div>{level.toUpperCase()} 單字表 ({activeList.length})</div>
            </button>
            
            {level === 'n5' && (
              <button onClick={() => setView('grammar_list')} className="btn menu-card">
                <div className="icon-box" style={{background: '#fff9db', color: '#fab005'}}>📝</div>
                <div>N5 文法 ({n5GrammarList.length})</div>
              </button>
            )}

            <button onClick={() => { setSearchTerm(''); setView('saved'); setSortMode('default'); setFilterPos('all'); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#fff4e6', color: '#ff922b'}}>⭐</div>
              <div>{level.toUpperCase()} 不熟單字 ({currentSavedCount})</div>
            </button>
            
            {/* ✨ 修改：按下測驗時，先跳到設定頁 */}
            <button onClick={() => setView('quiz_setup')} className="btn menu-card">
              <div className="icon-box" style={{background: '#ebfbee', color: '#51cf66'}}>🎲</div>
              <div>{level.toUpperCase()} 隨機測驗</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✨ 新增：測驗設定頁
  if (view === 'quiz_setup') {
    // 限制題數不能超過單字總數
    const maxQuestions = Math.min(100, activeList.length);
    const minQuestions = Math.min(10, activeList.length);

    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="hero-section">
            <div className="app-title" style={{fontSize: '1.8rem'}}>測驗設定</div>
            <div className="app-subtitle">準備好挑戰了嗎？</div>
          </div>

          <div className="setup-card">
            <div className="setup-label">題目數量</div>
            <div className="setup-value">{quizCount} 題</div>
            
            <input 
              type="range" 
              min={minQuestions} 
              max={maxQuestions} 
              step="5"
              value={quizCount} 
              onChange={(e) => setQuizCount(Number(e.target.value))}
              className="range-slider"
            />
            
            <div className="range-labels">
              <span>{minQuestions}</span>
              <span>{maxQuestions}</span>
            </div>
          </div>

          <div className="menu-grid" style={{marginTop: 40}}>
            <button onClick={() => setView('quiz')} className="btn btn-primary">
              🚀 開始測驗
            </button>
            <button onClick={() => setView('home')} className="btn btn-outline">
              取消
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 文法相關頁面 (保持不變)
  if (view === 'grammar_list') {
    return (
      <div className="app-container">
        <div className="list-screen">
          <div className="sticky-header">
            <div className="header-top">
              <button onClick={() => setView('home')} className="btn-ghost">✕ 關閉</button>
              <h2 className="page-title">N5 文法</h2>
              <div style={{width: 40}}></div>
            </div>
          </div>
          <div className="word-list" ref={listRef}>
            {n5GrammarList.map((g, index) => (
              <div key={g.id} className="word-item grammar-item" onClick={() => openGrammar(g)} style={{cursor: 'pointer'}}>
                <div className="word-info">
                  <div className="word-main" style={{fontSize: '1rem'}}>{index + 1}. {g.title}</div>
                  <div className="word-sub" style={{color: '#868e96'}}>{g.rule}</div>
                </div>
                <div style={{color: '#dee2e6', paddingRight: 10}}>›</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'grammar_detail' && selectedGrammar) {
    const currentIndex = n5GrammarList.findIndex(g => g.id === selectedGrammar.id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < n5GrammarList.length - 1;
    const goToPrev = () => { if (hasPrev) setSelectedGrammar(n5GrammarList[currentIndex - 1]); };
    const goToNext = () => { if (hasNext) setSelectedGrammar(n5GrammarList[currentIndex + 1]); };

    return (
      <div className="app-container">
        <div className="detail-screen">
          <div className="detail-header">
            <button onClick={() => setView('grammar_list')} className="btn-ghost">← 文法列表</button>
            <div></div> 
          </div>
          <div style={{flex: 1, overflowY: 'auto'}}>
            <div className="detail-card">
              <div className="detail-word" style={{fontSize: '1.8rem'}}>{currentIndex + 1}. {selectedGrammar.title}</div>
              <div className="grammar-rule-box">{selectedGrammar.rule}</div>
            </div>
            <div className="info-block">
              <div className="info-label">解說 / 特徵</div>
              <div className="info-content" style={{lineHeight: 1.6}}>{selectedGrammar.desc}</div>
            </div>
            <div className="info-block">
              <div className="info-label">例句</div>
              <div className="sentence-group">
                {selectedGrammar.examples.map((ex, i) => (
                  <div key={i} className="sentence-box" style={{marginBottom: 12}}>
                    <div className="sentence-jp">{ex.jp}</div>
                    <div className="sentence-cn">{ex.cn}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="detail-footer">
            <button className="nav-btn" onClick={goToPrev} disabled={!hasPrev}>← 上一個</button>
            <div className="nav-counter">{currentIndex + 1} / {n5GrammarList.length}</div>
            <button className="nav-btn" onClick={goToNext} disabled={!hasNext}>下一個 →</button>
          </div>
        </div>
      </div>
    );
  }

  // 列表頁
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
            <div className="search-row">
              <input type="text" placeholder="搜尋單字..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className={`filter-toggle-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>{showFilter ? '▲ 收起' : '▼ 篩選'}</button>
            </div>
            {showFilter && (
              <div className="filter-panel">
                <div className="control-row"><span className="control-label">排序</span><div className="control-group"><button className={`sort-pill ${sortMode === 'default' ? 'active' : ''}`} onClick={() => setSortMode('default')}>預設</button><button className={`sort-pill ${sortMode === 'aiueo' ? 'active' : ''}`} onClick={() => setSortMode('aiueo')}>50音</button></div></div>
                <div className="control-row"><span className="control-label">詞性</span><div className="control-group scroll-group"><button className={`filter-pill ${filterPos === 'all' ? 'active' : ''}`} onClick={() => setFilterPos('all')}>全部</button><button className={`filter-pill ${filterPos === 'noun' ? 'active' : ''}`} onClick={() => setFilterPos('noun')}>名詞</button><button className={`filter-pill ${filterPos === 'verb' ? 'active' : ''}`} onClick={() => setFilterPos('verb')}>動詞</button><button className={`filter-pill ${filterPos === 'adj' ? 'active' : ''}`} onClick={() => setFilterPos('adj')}>形容詞</button></div></div>
              </div>
            )}
          </div>
          <div className="word-list" ref={listRef}>
            {filteredList.length === 0 ? (<div style={{textAlign: 'center', padding: 40, color: '#868e96'}}>沒有找到資料 🍃</div>) : (
              filteredList.map((item, idx) => (
                <div key={`${item.w}-${idx}`} className="word-item" onClick={() => openDetail(item)} style={{cursor: 'pointer'}}>
                  <button className={`star-btn ${savedWords.includes(item.w) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSave(item.w); }}>{savedWords.includes(item.w) ? '★' : '☆'}</button>
                  <div className="word-info">
                    <div className="word-main">{item.w}</div>
                    <div className="word-sub"><span className="meaning-tag">{item.m}</span><span className="reading">{item.r}</span><span className="separator">•</span><span className="pos-text">{item.p}</span></div>
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

  if (view === 'detail' && selectedWord) {
    const isSaved = savedWords.includes(selectedWord.w);
    const currentIndex = filteredList.findIndex(w => w.w === selectedWord.w);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex !== -1 && currentIndex < filteredList.length - 1;
    const goToPrev = () => { if (hasPrev) setSelectedWord(filteredList[currentIndex - 1]); };
    const goToNext = () => { if (hasNext) setSelectedWord(filteredList[currentIndex + 1]); };

    return (
      <div className="app-container">
        <div className="detail-screen">
          <div className="detail-header">
            <button onClick={() => setView('list')} className="btn-ghost">← 返回列表</button>
            <button className={`btn-ghost ${isSaved ? 'active-star' : ''}`} onClick={() => toggleSave(selectedWord.w)} style={{fontSize: '1.5rem'}}>{isSaved ? '★' : '☆'}</button>
          </div>
          <div style={{flex: 1, overflowY: 'auto'}}>
            <div className="detail-card"><span className="detail-pos">{selectedWord.p}</span><div className="detail-word">{selectedWord.w}</div><div className="detail-reading">{selectedWord.r}</div></div>
            <div className="info-block"><div className="info-label">中文意思</div><div className="info-content">{selectedWord.m}</div></div>
            <div className="info-block"><div className="info-label">例句 / 例文</div>{selectedWord.s ? (<div className="sentence-box"><div className="sentence-jp">{selectedWord.s}</div><div className="sentence-cn">{selectedWord.st}</div></div>) : (<div className="info-content empty">(暫無例句資料)</div>)}</div>
          </div>
          <div className="detail-footer"><button className="nav-btn" onClick={goToPrev} disabled={!hasPrev}>← 上一個</button><div className="nav-counter">{currentIndex !== -1 ? currentIndex + 1 : 0} / {filteredList.length}</div><button className="nav-btn" onClick={goToNext} disabled={!hasNext}>下一個 →</button></div>
        </div>
      </div>
    );
  }

  // 測驗頁
  if (view === 'quiz') {
    return (
      <QuizView 
        list={activeList} // ✨ 傳入目前等級的單字表
        count={quizCount} // ✨ 傳入使用者選擇的題數
        onFinish={handleQuizFinish} 
        onExit={() => setView('home')} 
      />
    );
  }

  // 結果頁
  if (view === 'result') {
    return (
      <div className="app-container">
        <div className="result-screen">
          <div className="score-section">
            <div className="score-circle"><div className="score-number">{score}</div><div className="score-label">分 (共{quizHistory.length}題)</div></div>
            <h2 style={{marginBottom: 20}}>測驗結束！🎉</h2>
          </div>
          <div className="review-list">
            <h3 style={{marginLeft: 10, color: '#868e96'}}>答案解析</h3>
            {quizHistory.map((log, i) => (
              <div key={i} className={`review-item ${log.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="review-q"><span className="q-num">{i + 1}.</span> {log.question.w} {log.question.w !== log.question.r && <span style={{fontSize:'0.8rem', color:'#adb5bd', marginLeft:8}}>({log.question.r})</span>}</div>
                <div className="review-detail">
                  {log.isCorrect ? (<span className="ans-tag correct">答對</span>) : (<span className="ans-tag wrong">答錯</span>)}
                  <div className="ans-text">
                    {!log.isCorrect && (<div className="user-ans">你選: {log.userAnswer}</div>)}
                    <div className="correct-ans">正解: {log.correctAnswer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="result-footer">
            <button onClick={() => setView('quiz_setup')} className="btn btn-primary" style={{marginBottom: 12}}>再測一次</button>
            <button onClick={() => setView('home')} className="btn btn-outline">回儀表板</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;