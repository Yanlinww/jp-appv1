import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { allLevels, n5GrammarList, shortPhrasesList, type Word, type Grammar } from './data';
import { basicNumberList } from './basicNumbers'; 
import QuizView, { type QuizLog } from './QuizView';
import './App.css';

type ViewMode = 'level_select' | 'home' | 'list' | 'saved' | 'quiz' | 'quiz_setup' | 'result' | 'detail' | 'grammar_list' | 'grammar_detail' | 'basic_numbers' | 'short_phrases';
type SortMode = 'default' | 'aiueo';
// type FilterPos = 'all' | 'noun' | 'verb' | 'adj';
type LevelKey = 'n5' | 'n4' | 'n3';
// ✨ 新增：測驗模式 (考全部 vs 考不熟)
type QuizMode = 'all' | 'saved';

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
  const [quizCount, setQuizCount] = useState(30);
  // ✨ 新增：記錄現在要考什麼
  const [quizMode, setQuizMode] = useState<QuizMode>('all');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [filterPos, setFilterPos] = useState<string[]>(['all']);
  const [showFilter, setShowFilter] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const scrollPos = useRef(0);

  const swipeRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activePage, setActivePage] = useState(0);

  const activeList = useMemo(() => allLevels[level], [level]);
  
  const APP_VERSION = "Ver 2025.12.21 更新";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (view === 'detail') setView('list');
        else if (view === 'grammar_detail') setView('grammar_list');
        else if (view === 'basic_numbers') setView('level_select');
        else if (view === 'short_phrases') setView('level_select');
        else if (view === 'quiz_setup') setView('home');
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
    if ((view === 'list' || view === 'saved' || view === 'grammar_list' || view === 'basic_numbers' || view === 'short_phrases') && listRef.current) {
      listRef.current.scrollTop = scrollPos.current;
    }
  }, [view]);

  const selectLevel = (lvl: LevelKey) => {
    setLevel(lvl);
    setView('home');
    setSearchTerm(''); 
    setSortMode('default');
    setFilterPos(['all']);
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

  const toggleFilter = (tag: string) => {
    setFilterPos(prev => {
      if (tag === 'all') return ['all'];
      let newFilters = prev.filter(t => t !== 'all');
      if (newFilters.includes(tag)) newFilters = newFilters.filter(t => t !== tag);
      else newFilters = [...newFilters, tag];
      return newFilters.length === 0 ? ['all'] : newFilters;
    });
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

    if (!filterPos.includes('all')) {
      list = list.filter(v => {
        if (filterPos.includes('noun') && v.p.includes('名詞')) return true;
        if (filterPos.includes('verb') && v.p.includes('動詞')) return true;
        if (filterPos.includes('adj') && (v.p.includes('形容詞') || v.p.includes('形容詞'))) return true;
        if (filterPos.includes('phrase') && (v.p.includes('寒暄') || v.p.includes('短句') || v.p.includes('問候') || v.p.includes('感嘆詞'))) return true;
        return false;
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

  // ✨ 開始測驗前的準備 (判斷是考全部還是考不熟)
  const initQuiz = (mode: QuizMode) => {
    setQuizMode(mode);
    
    // 如果是考「不熟單字」，先檢查數量夠不夠
    if (mode === 'saved') {
      const savedCount = activeList.filter(w => savedWords.includes(w.w)).length;
      if (savedCount < 4) {
        alert('不熟單字太少了！至少要收藏 4 個單字才能測驗喔。\n(因為需要產生選擇題的干擾選項)');
        return;
      }
    }
    
    setView('quiz_setup');
  };

  // 取得實際要考的單字列表
  const getQuizSourceList = () => {
    if (quizMode === 'saved') {
      return activeList.filter(w => savedWords.includes(w.w));
    }
    return activeList;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const sLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newPage = Math.round(sLeft / width);
    if (newPage !== activePage) setActivePage(newPage);
  };

  // 滑動邏輯省略 (與之前相同)
  const onMouseDown = (e: React.MouseEvent) => { if (!swipeRef.current) return; isDown.current = true; swipeRef.current.style.cursor = 'grabbing'; startX.current = e.pageX - swipeRef.current.offsetLeft; scrollLeft.current = swipeRef.current.scrollLeft; };
  const onMouseLeave = () => { if (!swipeRef.current) return; isDown.current = false; swipeRef.current.style.cursor = 'grab'; };
  const onMouseUp = () => { if (!swipeRef.current) return; isDown.current = false; swipeRef.current.style.cursor = 'grab'; };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDown.current || !swipeRef.current) return; e.preventDefault(); const x = e.pageX - swipeRef.current.offsetLeft; const walk = (x - startX.current) * 1.5; swipeRef.current.scrollLeft = scrollLeft.current - walk; };


  // --- 畫面渲染 ---

  if (view === 'level_select') {
    return (
      <div className="app-container">
        <div className="swipe-wrapper" ref={swipeRef} onScroll={handleScroll} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
          <div className="swipe-page">
            <div className="home-screen">
              <div className="hero-section">
                <div className="hero-icon">🗻</div>
                <div className="app-title">日本語 Go</div>
                <div className="version-badge">{APP_VERSION}</div>
                <div className="app-subtitle">請選擇檢定等級</div>
              </div>
              <div className="menu-grid">
                <div style={{display:'flex', gap: 12}}>
                  <button onClick={() => setView('basic_numbers')} className="btn menu-card level-card num-card" style={{flex:1}}><div className="level-badge num-badge">#</div><div className="level-info" style={{fontSize:'1rem'}}>數詞</div></button>
                  <button onClick={() => setView('short_phrases')} className="btn menu-card level-card phrase-card" style={{flex:1}}><div className="level-badge phrase-badge">🗣️</div><div className="level-info" style={{fontSize:'1rem'}}>短句</div></button>
                </div>
                <button onClick={() => selectLevel('n5')} className="btn menu-card level-card n5"><div className="level-badge">N5</div><div className="level-info">入門基礎 ({allLevels.n5.length}單)</div></button>
                <button onClick={() => selectLevel('n4')} className="btn menu-card level-card n4"><div className="level-badge">N4</div><div className="level-info">初級進階 ({allLevels.n4.length}單)</div></button>
                <button onClick={() => selectLevel('n3')} className="btn menu-card level-card n3"><div className="level-badge">N3</div><div className="level-info">日常應用 ({allLevels.n3.length}單)</div></button>
              </div>
            </div>
          </div>
          <div className="swipe-page">
            <div className="home-screen">
              <div className="hero-section"><div className="hero-icon">📜</div><div className="app-title">考古題特訓</div><div className="app-subtitle">JLPT 歷屆試題</div></div>
              <div className="menu-grid">
                <div style={{textAlign:'center', color:'#adb5bd', marginBottom:10}}>(← 滑動返回等級選擇)</div>
                {['N1', 'N2', 'N3', 'N4', 'N5'].map((lvl) => (<button key={lvl} className="btn menu-card exam-card" onClick={() => alert(`${lvl} 考古題功能開發中...`)}><div className={`level-badge exam-badge ${lvl.toLowerCase()}`}>{lvl}</div><div className="level-info">歷屆試題庫</div></button>))}
              </div>
            </div>
          </div>
        </div>
        <div className="pagination-dots"><div className={`dot ${activePage === 0 ? 'active' : ''}`}></div><div className={`dot ${activePage === 1 ? 'active' : ''}`}></div></div>
      </div>
    );
  }

  // 短句頁面
  if (view === 'short_phrases') {
    return (
      <div className="app-container">
        <div className="list-screen">
          <div className="sticky-header">
            <div className="header-top"><button onClick={() => setView('level_select')} className="btn-ghost">← 返回</button><h2 className="page-title" style={{color: '#e64980'}}>實用短句</h2><div style={{width: 40}}></div></div>
          </div>
          <div className="word-list" ref={listRef}>
            {shortPhrasesList.map((item, idx) => (
              <div key={idx} className="word-item">
                <div className="word-info">
                  <div className="word-main">{item.w}</div>
                  <div className="word-sub"><span className="meaning-tag" style={{background:'#fff0f6', color:'#e64980'}}>{item.m}</span><span className="reading">{item.r}</span><span className="separator">•</span><span className="pos-text">{item.p}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 基本數詞頁面 (省略，與之前相同)
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

  // Dashboard
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
            <button onClick={() => { setSearchTerm(''); setView('list'); setSortMode('default'); setFilterPos(['all']); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#e7f5ff', color: '#5c7cfa'}}>📖</div>
              <div>{level.toUpperCase()} 單字表 ({activeList.length})</div>
            </button>
            {level === 'n5' && (
              <button onClick={() => setView('grammar_list')} className="btn menu-card">
                <div className="icon-box" style={{background: '#fff9db', color: '#fab005'}}>📝</div>
                <div>N5 文法 ({n5GrammarList.length})</div>
              </button>
            )}
            <button onClick={() => { setSearchTerm(''); setView('saved'); setSortMode('default'); setFilterPos(['all']); }} className="btn menu-card">
              <div className="icon-box" style={{background: '#fff4e6', color: '#ff922b'}}>⭐</div>
              <div>{level.toUpperCase()} 不熟單字 ({currentSavedCount})</div>
            </button>
            
            {/* ✨ 修改：傳入 'all' 模式 */}
            <button onClick={() => initQuiz('all')} className="btn menu-card">
              <div className="icon-box" style={{background: '#ebfbee', color: '#51cf66'}}>🎲</div>
              <div>{level.toUpperCase()} 隨機測驗</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 測驗設定頁
  if (view === 'quiz_setup') {
    const sourceList = getQuizSourceList(); // 取得這次要考的列表
    const maxQuestions = Math.min(100, sourceList.length);
    const minQuestions = Math.min(5, sourceList.length); // 允許少一點
    
    // 如果題數設定超過範圍，自動修正
    if (quizCount > maxQuestions) setQuizCount(maxQuestions);

    return (
      <div className="app-container">
        <div className="home-screen">
          <div className="hero-section">
            <div className="app-title" style={{fontSize: '1.8rem'}}>
              {quizMode === 'saved' ? '⭐ 不熟單字特訓' : '🎲 隨機測驗'}
            </div>
            <div className="app-subtitle">
              範圍內共有 {sourceList.length} 個單字
            </div>
          </div>

          <div className="setup-card">
            <div className="setup-label">題目數量</div>
            <div className="setup-value">{quizCount} 題</div>
            
            <input 
              type="range" 
              min={minQuestions} 
              max={maxQuestions} 
              step="1"
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

  // 文法列表頁 (省略，與之前相同)
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

  // 文法詳細頁 (省略，與之前相同)
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

  // 列表頁 (包含不熟單字)
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
              {/* ✨ 如果是不熟單字頁，顯示「特訓按鈕」 */}
              {view === 'saved' ? (
                <button className="btn-ghost" style={{color: '#5c7cfa', fontWeight:'bold'}} onClick={() => initQuiz('saved')}>
                  特訓
                </button>
              ) : (
                <div style={{width: 40}}></div>
              )}
            </div>
            
            <div className="search-row">
              <input type="text" placeholder="搜尋單字..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <button className={`filter-toggle-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>{showFilter ? '▲ 收起' : '▼ 篩選'}</button>
            </div>
            {showFilter && (
              <div className="filter-panel">
                <div className="control-row"><span className="control-label">排序</span><div className="control-group"><button className={`sort-pill ${sortMode === 'default' ? 'active' : ''}`} onClick={() => setSortMode('default')}>預設</button><button className={`sort-pill ${sortMode === 'aiueo' ? 'active' : ''}`} onClick={() => setSortMode('aiueo')}>50音</button></div></div>
                <div className="control-row"><span className="control-label">詞性</span><div className="control-group scroll-group"><button className={`filter-pill ${filterPos.includes('all') ? 'active' : ''}`} onClick={() => toggleFilter('all')}>全部</button><button className={`filter-pill ${filterPos.includes('noun') ? 'active' : ''}`} onClick={() => toggleFilter('noun')}>名詞</button><button className={`filter-pill ${filterPos.includes('verb') ? 'active' : ''}`} onClick={() => toggleFilter('verb')}>動詞</button><button className={`filter-pill ${filterPos.includes('adj') ? 'active' : ''}`} onClick={() => toggleFilter('adj')}>形容詞</button><button className={`filter-pill ${filterPos.includes('phrase') ? 'active' : ''}`} onClick={() => toggleFilter('phrase')}>短句/寒暄</button></div></div>
              </div>
            )}
          </div>
          <div className="word-list" ref={listRef}>
            {filteredList.length === 0 ? (<div style={{textAlign: 'center', padding: 40, color: '#868e96'}}>{view === 'saved' ? '目前沒有不熟單字 ✨' : '沒有找到資料 🍃'}</div>) : (
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

  // 詳細頁 (省略，與之前相同)
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

  // 測驗頁 (傳入正確的列表)
  if (view === 'quiz') {
    return (
      <QuizView 
        list={getQuizSourceList()} // ✨ 關鍵：動態取得要考的列表
        count={quizCount} 
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
          <div className="score-section"><div className="score-circle"><div className="score-number">{score}</div><div className="score-label">分 (共{quizHistory.length}題)</div></div><h2 style={{marginBottom: 20}}>測驗結束！🎉</h2></div>
          <div className="review-list">
            <h3 style={{marginLeft: 10, color: '#868e96'}}>答案解析</h3>
            {quizHistory.map((log, i) => (
              <div key={i} className={`review-item ${log.isCorrect ? 'correct' : 'wrong'}`}>
                <div className="review-q"><span className="q-num">{i + 1}.</span> {log.question.w} {log.question.w !== log.question.r && <span style={{fontSize:'0.8rem', color:'#adb5bd', marginLeft:8}}>({log.question.r})</span>}</div>
                <div className="review-detail">
                  {log.isCorrect ? (<span className="ans-tag correct">答對</span>) : (<span className="ans-tag wrong">答錯</span>)}
                  <div className="ans-text">{!log.isCorrect && (<div className="user-ans">你選: {log.userAnswer}</div>)}<div className="correct-ans">正解: {log.correctAnswer}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div className="result-footer"><button onClick={() => setView('quiz_setup')} className="btn btn-primary" style={{marginBottom: 12}}>再測一次</button><button onClick={() => setView('home')} className="btn btn-outline">回儀表板</button></div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;