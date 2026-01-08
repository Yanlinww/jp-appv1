// src/App.tsx
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { allLevels, n5GrammarList, shortPhrasesList, particleQuestionsData, type Word, type Grammar, type CustomNote } from './data';
import { basicNumberList } from './basicNumbers'; 
import { examQuestions, type ExamQuestion } from './examData';
import QuizView, { type QuizLog } from './QuizView';
import ExamView from './ExamView';
import NoteEditor from './NoteEditor'; // ✨ 引入筆記編輯器
import { exam2010_written, exam2010_listening, type ExamPaper } from './exam_n5_2010';
import './App.css';

import { auth, db, loginWithGoogle, logout } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type ViewMode = 'level_select' | 'home' | 'list' | 'saved' | 'quiz' | 'quiz_setup' | 'result' | 'detail' | 'grammar_list' | 'grammar_detail' | 'basic_numbers' | 'short_phrases' | 'particle_quiz' | 'exam' | 'exam_year_select';
type SortMode = 'default' | 'aiueo';
type LevelKey = 'n5' | 'n4' | 'n3';
type QuizMode = 'all' | 'saved';

function App() {
  const [view, setView] = useState<ViewMode>('level_select');
  const [level, setLevel] = useState<LevelKey>('n5');
  const [examLevel, setExamLevel] = useState<string>('');

  const [user, setUser] = useState<User | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastListView, setLastListView] = useState<ViewMode>('list'); 

  // --- Data State ---
  const [savedWords, setSavedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('jp_saved_words');
    return saved ? JSON.parse(saved) : [];
  });
  
  // ✨ 新增：自訂筆記 State (Key 是單字 w，Value 是筆記物件)
  const [customNotes, setCustomNotes] = useState<Record<string, CustomNote>>(() => {
    const saved = localStorage.getItem('jp_custom_notes');
    return saved ? JSON.parse(saved) : {};
  });

  const [notifyTime, setNotifyTime] = useState<string>(() => localStorage.getItem('jp_notify_time') || '20:00');
  const [streakReminder, setStreakReminder] = useState<boolean>(() => localStorage.getItem('jp_streak_reminder') !== 'false');
  const [weekendDND, setWeekendDND] = useState<boolean>(() => localStorage.getItem('jp_weekend_dnd') === 'true');
  const [username, setUsername] = useState<string>(() => localStorage.getItem('jp_username') || '學習者');
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('jp_user_avatar'));
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('jp_dark_mode') === 'true');
  const [targetLevel, setTargetLevel] = useState<string>(() => localStorage.getItem('jp_target_level') || 'N5');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamPaper | null>(null);
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<QuizLog[]>([]);
  const [quizCount, setQuizCount] = useState(20);
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
  const [initialSwipePage, setInitialSwipePage] = useState(0);

  const activeList = useMemo(() => allLevels[level], [level]);
  const APP_VERSION = "Ver 2025.1.8";
  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // --- Effects ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsCloudSyncing(true);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.savedWords) setSavedWords(data.savedWords);
            // ✨ 同步雲端筆記
            if (data.customNotes) setCustomNotes(data.customNotes);
            
            if (data.settings) {
              if (data.settings.notifyTime) setNotifyTime(data.settings.notifyTime);
              if (data.settings.streakReminder !== undefined) setStreakReminder(data.settings.streakReminder);
              if (data.settings.weekendDND !== undefined) setWeekendDND(data.settings.weekendDND);
              if (data.settings.username) setUsername(data.settings.username);
              if (data.settings.avatar) setAvatar(data.settings.avatar);
              if (data.settings.darkMode !== undefined) setDarkMode(data.settings.darkMode);
              if (data.settings.targetLevel) setTargetLevel(data.settings.targetLevel);
            }
          }
        } catch (err) { console.error(err); } finally { setIsCloudSyncing(false); }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('jp_saved_words', JSON.stringify(savedWords));
    localStorage.setItem('jp_custom_notes', JSON.stringify(customNotes)); // ✨ 儲存筆記到 LocalStorage
    localStorage.setItem('jp_notify_time', notifyTime);
    localStorage.setItem('jp_streak_reminder', String(streakReminder));
    localStorage.setItem('jp_weekend_dnd', String(weekendDND));
    localStorage.setItem('jp_username', username);
    localStorage.setItem('jp_dark_mode', String(darkMode));
    localStorage.setItem('jp_target_level', targetLevel);
    if (avatar) localStorage.setItem('jp_user_avatar', avatar);

    if (user && !isCloudSyncing) {
      const saveData = async () => {
        try {
          await setDoc(doc(db, "users", user.uid), {
            savedWords,
            customNotes, // ✨ 上傳筆記到 Firestore
            settings: { notifyTime, streakReminder, weekendDND, username, avatar, darkMode, targetLevel },
            lastUpdated: new Date()
          }, { merge: true });
        } catch (e) { console.error(e); }
      };
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [savedWords, customNotes, notifyTime, streakReminder, weekendDND, username, avatar, darkMode, targetLevel, user, isCloudSyncing]);

  useEffect(() => {
    if (darkMode) document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
  }, [darkMode]);

  // 通知與鍵盤監聽保持不變...
  useEffect(() => {
    const requestPermission = () => { if (!("Notification" in window)) return; if (Notification.permission !== "granted" && Notification.permission !== "denied") Notification.requestPermission(); };
    if (streakReminder) requestPermission();
    const timer = setInterval(() => { if (!streakReminder) return; const now = new Date(); if (weekendDND && (now.getDay() === 0 || now.getDay() === 6)) return; const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; if (currentTimeStr === notifyTime) { const todayStr = now.toDateString(); const lastNotified = localStorage.getItem('jp_last_notified_date'); if (lastNotified !== todayStr) { if (Notification.permission === "granted") { new Notification("日本語 Go", { body: `⏰ 時間到了！該來背幾個單字囉！`, icon: '/vite.svg' }); localStorage.setItem('jp_last_notified_date', todayStr); } } } }, 60000);
    return () => clearInterval(timer);
  }, [streakReminder, notifyTime, weekendDND]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (view === 'detail') setView(lastListView);
        else if (view === 'grammar_detail') setView('grammar_list');
        else if (view === 'basic_numbers') setView('level_select');
        else if (view === 'short_phrases') setView('level_select');
        else if (view === 'particle_quiz') setView('level_select');
        else if (view === 'quiz_setup') setView('home');
        else if (view === 'exam_year_select') { setInitialSwipePage(2); setView('level_select'); }
        else if (view === 'exam') { if (window.confirm('確定退出考試？')) setView('exam_year_select'); }
        else if (view === 'quiz') { if (window.confirm('確定退出測驗？')) setView('home'); }
        else if (view === 'home') setView('level_select');
        else if (view === 'result') setView('home');
        else if (view !== 'level_select') setView('home');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);

  // Swipe logic...
  useLayoutEffect(() => { if ((view === 'list' || view === 'saved' || view === 'grammar_list' || view === 'basic_numbers' || view === 'short_phrases') && listRef.current) { listRef.current.scrollTop = scrollPos.current; } }, [view]);
  useEffect(() => { if (view === 'level_select' && swipeRef.current) { const width = swipeRef.current.clientWidth; swipeRef.current.scrollTo({ left: width * initialSwipePage, behavior: 'auto' }); setActivePage(initialSwipePage); } }, [view, initialSwipePage]);

  // --- Handlers ---
  const handleAvatarClick = () => { if (!user) { alert("請先登入才能修改頭像喔！"); return; } fileInputRef.current?.click(); };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setAvatar(reader.result as string); reader.readAsDataURL(file); } };
  const scrollToPage = (pageIndex: number) => { if (swipeRef.current) { const width = swipeRef.current.clientWidth; swipeRef.current.scrollTo({ left: width * pageIndex, behavior: 'smooth' }); setActivePage(pageIndex); } };
  const goToSettings = () => { scrollToPage(3); };
  const selectLevel = (lvl: LevelKey) => { setLevel(lvl); setView('home'); setSearchTerm(''); setSortMode('default'); setFilterPos(['all']); };
  const openExamLevel = (lvl: string) => { setExamLevel(lvl); setView('exam_year_select'); };
  const exitExamYearSelect = () => { setInitialSwipePage(2); setView('level_select'); }; 
  const toggleSave = (word: string) => { setSavedWords(prev => prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]); };
  
const openDetail = (word: Word) => {
    if (listRef.current) scrollPos.current = listRef.current.scrollTop;
    
    // 記住現在是在 'list' 還是 'saved'，這樣返回時才知道回哪
    if (view === 'list' || view === 'saved') {
      setLastListView(view);
    }
    
    setSelectedWord(word);
    setView('detail');
  };  const openGrammar = (grammar: Grammar) => { if (listRef.current) scrollPos.current = listRef.current.scrollTop; setSelectedGrammar(grammar); setView('grammar_detail'); };
  const openExam = (paper: ExamPaper) => { setSelectedExam(paper); setView('exam'); };
  const toggleFilter = (tag: string) => { setFilterPos(prev => { if (tag === 'all') return ['all']; let newFilters = prev.filter(t => t !== 'all'); if (newFilters.includes(tag)) newFilters = newFilters.filter(t => t !== tag); else newFilters = [...newFilters, tag]; return newFilters.length === 0 ? ['all'] : newFilters; }); };
  const handleClearCache = () => { if (window.confirm('確定清除快取？')) { localStorage.clear(); window.location.reload(); } };
  const handleResetProgress = () => { if (window.confirm('警告：清空所有收藏？')) setSavedWords([]); };
  const handleLogout = () => { if (window.confirm("確定要登出嗎？")) { logout(); setAvatar(null); localStorage.removeItem('jp_user_avatar'); } };

  // ✨ 新增：儲存筆記的函式
  const saveNoteForWord = (word: string, note: CustomNote | null) => {
    setCustomNotes(prev => {
      const newNotes = { ...prev };
      if (note === null) {
        delete newNotes[word]; // 刪除筆記
      } else {
        newNotes[word] = note; // 新增/更新筆記
      }
      return newNotes;
    });
  };

const filteredList = useMemo(() => {
    // ✨ 關鍵邏輯：如果是 'detail' 模式，就使用 'lastListView' (來源) 來決定列表
    // 這樣在單字卡裡按下一頁時，才會是在「不熟單字」裡面找下一個
    const currentMode = view === 'detail' ? lastListView : view;

    let list = currentMode === 'saved' 
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
        if (filterPos.includes('phrase') && (v.p.includes('寒暄') || v.p.includes('短句') || v.p.includes('問候') || v.p.includes('感嘆詞') || v.p.includes('用餐') || v.p.includes('外出') || v.p.includes('返家') || v.p.includes('介紹') || v.p.includes('工作') || v.p.includes('回答') || v.p.includes('祝賀') || v.p.includes('請求') || v.p.includes('疑問') || v.p.includes('購物') || v.p.includes('旅遊'))) return true;
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
  }, [view, lastListView, savedWords, searchTerm, sortMode, filterPos, activeList]); // ✨ 記得加入 lastListView 到依賴陣列

  const handleQuizFinish = (finalScore: number, history: QuizLog[]) => { setScore(finalScore); setQuizHistory(history); setView('result'); };
  const initQuiz = (mode: QuizMode) => { setQuizMode(mode); if (mode === 'saved' && activeList.filter(w => savedWords.includes(w.w)).length < 4) { alert('收藏單字不足 4 個！'); return; } setView('quiz_setup'); };
  const convertWordsToQuestions = (words: Word[]): ExamQuestion[] => words.map((w, index) => ({ id: index + 9999, q: w.w, options: [w.r, ...activeList.filter(i => i.w !== w.w).sort(() => 0.5 - Math.random()).slice(0, 3).map(i => i.r)].sort(() => 0.5 - Math.random()), a: w.r }));
  const getQuizSourceList = (): ExamQuestion[] => quizMode === 'all' ? examQuestions : convertWordsToQuestions(activeList.filter(w => savedWords.includes(w.w)));

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => { const newPage = Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth); if (newPage !== activePage) setActivePage(newPage); };
  const onMouseDown = (e: React.MouseEvent) => { if (!swipeRef.current) return; isDown.current = true; swipeRef.current.style.cursor = 'grabbing'; startX.current = e.pageX - swipeRef.current.offsetLeft; scrollLeft.current = swipeRef.current.scrollLeft; };
  const onMouseLeave = () => { if (!swipeRef.current) return; isDown.current = false; swipeRef.current.style.cursor = 'grab'; };
  const onMouseUp = () => { if (!swipeRef.current) return; isDown.current = false; swipeRef.current.style.cursor = 'grab'; };
  const onMouseMove = (e: React.MouseEvent) => { if (!isDown.current || !swipeRef.current) return; e.preventDefault(); const x = e.pageX - swipeRef.current.offsetLeft; const walk = (x - startX.current) * 1.5; swipeRef.current.scrollLeft = scrollLeft.current - walk; };

  // --- Render ---
  // (Home, Exam, Settings pages remain the same...)
  if (view === 'level_select') {
    return (
      <div className="app-container">
        {activePage === 0 && (
          <div className="home-header-row"><div className="mini-avatar" onClick={goToSettings}><img src={avatar || DEFAULT_AVATAR} alt="User" /></div></div>
        )}
        <div className="swipe-wrapper" ref={swipeRef} onScroll={handleScroll} onMouseDown={onMouseDown} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
          {/* Page 1: Home */}
          <div className="swipe-page">
            <div className="home-screen">
              <div className="hero-section"><div className="hero-icon">🗻</div><div className="app-title">日本語 Go</div><div className="version-badge">{APP_VERSION}</div><div className="app-subtitle">請選擇檢定等級</div></div>
              <div className="menu-grid" style={{paddingBottom: 0}}>
                <button onClick={() => { setInitialSwipePage(0); selectLevel('n5'); }} className="btn menu-card level-card n5"><div className="level-badge">N5</div><div className="level-info">入門基礎 ({allLevels.n5.length}單)</div></button>
                <button onClick={() => { setInitialSwipePage(0); selectLevel('n4'); }} className="btn menu-card level-card n4"><div className="level-badge">N4</div><div className="level-info">初級進階 ({allLevels.n4.length}單)</div></button>
                <button onClick={() => { setInitialSwipePage(0); selectLevel('n3'); }} className="btn menu-card level-card n3"><div className="level-badge">N3</div><div className="level-info">日常應用 ({allLevels.n3.length}單)</div></button>
                <button onClick={() => alert('N2 資料庫建置中，敬請期待！')} className="btn menu-card level-card n2" style={{opacity: 0.8}}><div className="level-badge">N2</div><div className="level-info">商業應用 (準備中)</div></button>
                <button onClick={() => alert('N1 資料庫建置中，敬請期待！')} className="btn menu-card level-card n1" style={{opacity: 0.8}}><div className="level-badge">N1</div><div className="level-info">專業高階 (準備中)</div></button>
              </div>
            </div>
          </div>
          {/* Page 2: Tools */}
          <div className="swipe-page">
            <div className="home-screen">
              <div className="hero-section" style={{marginBottom: 20}}><div className="hero-icon">🧰</div><div className="app-title">學習工具</div><div className="app-subtitle">加強基礎與應用</div></div>
              <div className="tools-container">
                <div className="tool-card" onClick={() => setView('basic_numbers')}><div className="tool-icon-wrapper" style={{background:'#e3fafc', color:'#15aabf'}}>#</div><div className="tool-info"><div className="tool-title">基本數詞</div><div className="tool-desc">時間、日期、量詞</div></div><div className="tool-arrow">›</div></div>
                <div className="tool-card" onClick={() => setView('short_phrases')}><div className="tool-icon-wrapper" style={{background:'#fff0f6', color:'#e64980'}}>🗣️</div><div className="tool-info"><div className="tool-title">實用短句</div><div className="tool-desc">日常會話、問候</div></div><div className="tool-arrow">›</div></div>
                <div className="tool-card" onClick={() => setView('particle_quiz')}><div className="tool-icon-wrapper" style={{background:'#f3f0ff', color:'#7950f2'}}>🧩</div><div className="tool-info"><div className="tool-title">助詞特訓</div><div className="tool-desc">は、が、に、を、で</div></div><div className="tool-arrow">›</div></div>
              </div>
            </div>
          </div>
          {/* Page 3: Exams */}
          <div className="swipe-page">
            <div className="exam-screen">
              <div className="exam-hero"><div className="hero-icon">✍️</div><div className="exam-title">歷屆試題</div><div className="exam-subtitle">JLPT 實戰演練</div></div>
              <div className="exam-list-container">
                <div style={{textAlign:'center', color:'#868e96', marginBottom:15, fontSize:'0.9rem'}}>(← 滑動返回)</div>
                {['N1', 'N2', 'N3', 'N4', 'N5'].map((lvl) => (<button key={lvl} className={`btn exam-entry-card ${lvl === 'N5' ? 'active' : 'locked'}`} onClick={() => lvl === 'N5' ? openExamLevel(lvl) : alert('即將推出！')}><div className="exam-tag">{lvl}</div><div className="exam-info-row"><span className="exam-name">日本語能力試驗</span><span className="exam-status">{lvl === 'N5' ? '開放中' : '準備中'}</span></div><div className="exam-arrow">➜</div></button>))}
              </div>
            </div>
          </div>
          {/* Page 4: Settings */}
          <div className="swipe-page">
            <div className="settings-screen">
              <div className="profile-header">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden-input" />
                <div className="avatar-circle" onClick={handleAvatarClick}><img src={avatar || DEFAULT_AVATAR} alt="Avatar" className="avatar-image" />{!user && <div style={{position:'absolute', bottom:0, right:0, fontSize:'0.8rem'}}>🔒</div>}</div>
                <div className="profile-info">
                  <div className="profile-name" onClick={() => { if (!user) { alert("請先登入才能修改暱稱喔！"); return; } const name = prompt('請輸入新暱稱', username); if (name) setUsername(name); }}>{username} {user ? '✎' : '(未登入)'}</div>
                  <div className="profile-level" style={{position: 'relative', display: 'inline-block'}}>{targetLevel} 學習中 ▼{user ? (<select value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'}}><option value="N5">N5</option><option value="N4">N4</option><option value="N3">N3</option><option value="N2">N2</option><option value="N1">N1</option></select>) : (<div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'not-allowed'}} onClick={() => alert("請先登入才能修改學習等級喔！")} />)}</div>
                </div>
              </div>
              <div className="settings-content">
                <div className="group-title">帳號綁定</div>
                <div className="settings-group">
                  {user ? ( <div className="settings-item" onClick={handleLogout}><div className="item-left"><div className="item-icon" style={{background:'#ff3b30'}}>🚪</div>登出 ({user.displayName || user.email})</div><div className="item-right">›</div></div> ) : ( <div className="settings-item" onClick={loginWithGoogle}><div className="item-left"><div className="item-icon" style={{background:'#34c759'}}>G</div>使用 Google 登入</div><div className="item-right">同步資料 ›</div></div> )}
                </div>
                <div className="group-title">介面與顯示</div>
                <div className="settings-group">
                  <div className="settings-item" onClick={() => setDarkMode(!darkMode)}><div className="item-left"><div className="item-icon" style={{background:'#5856d6'}}>🌙</div>深色模式</div><div className="item-right"><input type="checkbox" className="toggle-switch" checked={darkMode} readOnly /></div></div>
                </div>
                <div className="group-title">通知與提醒</div>
                <div className="settings-group">
                  <div className="settings-item"><div className="item-left"><div className="item-icon" style={{background:'#ff9500'}}>⏰</div>每日提醒時間</div><div className="item-right"><input type="time" value={notifyTime} onChange={(e) => setNotifyTime(e.target.value)} style={{border:'none', fontSize:'1rem', background:'transparent', color:'var(--text-sub)'}}/></div></div>
                  <div className="settings-item"><div className="item-left"><div className="item-icon" style={{background:'#ff3b30'}}>🔥</div>連續打卡提醒</div><div className="item-right"><input type="checkbox" className="toggle-switch" checked={streakReminder} onChange={(e) => setStreakReminder(e.target.checked)} /></div></div>
                </div>
                <div className="group-title">資料管理</div>
                <div className="settings-group">
                  <div className="settings-item" onClick={handleClearCache}><div className="item-left"><div className="item-icon" style={{background:'#ffcc00'}}>🧹</div>清除本機緩存</div><div className="item-right">›</div></div>
                  <div className="settings-item danger" onClick={handleResetProgress}><div className="item-left"><div className="item-icon" style={{background:'#ff3b30'}}>🔄</div>重置學習進度</div><div className="item-right">›</div></div>
                </div>
                <div style={{textAlign:'center', color:'#8e8e93', fontSize:'0.8rem', paddingBottom: 40}}>{APP_VERSION} <br/> Made with ❤️</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bottom-nav-bar">
          <button className={`nav-item ${activePage === 0 ? 'active' : ''}`} onClick={() => scrollToPage(0)}><div className="nav-icon">🗻</div><span className="nav-label">首頁</span></button>
          <button className={`nav-item ${activePage === 1 ? 'active' : ''}`} onClick={() => scrollToPage(1)}><div className="nav-icon">🧰</div><span className="nav-label">工具</span></button>
          <button className={`nav-item ${activePage === 2 ? 'active' : ''}`} onClick={() => scrollToPage(2)}><div className="nav-icon">✍️</div><span className="nav-label">試題</span></button>
          <button className={`nav-item ${activePage === 3 ? 'active' : ''}`} onClick={() => scrollToPage(3)}><div className="nav-icon">⚙️</div><span className="nav-label">設定</span></button>
        </div>
      </div>
    );
  }

  // --- Sub-View Renders ---
  // 省略中間重複的部分，下面是 Detail View 的修改

  // ... (保留 short_phrases, basic_numbers, home, quiz_setup, grammar_list, grammar_detail 的 render) ...

  if (view === 'exam_year_select') { return (<div className="app-container"><div className="home-screen"><div className="hero-section"><div className="current-level-tag">{examLevel}</div><div className="app-subtitle">請選擇年份</div></div><div className="menu-grid"><button onClick={exitExamYearSelect} className="btn-ghost" style={{marginBottom: 20}}>← 返回上一頁</button>{examLevel === 'N5' ? (<><div className="exam-year-title">2010-2011</div><button className="btn menu-card exam-card" onClick={() => openExam(exam2010_written)}><div className="level-badge exam-badge n5">文</div><div className="level-info">文字・語彙・文法・読解</div></button><button className="btn menu-card exam-card" onClick={() => openExam(exam2010_listening)}><div className="level-badge exam-badge n5" style={{background:'#20c997'}}>聴</div><div className="level-info">聴解 (聽力)</div></button></>) : (<div style={{textAlign: 'center', padding: 40, color: '#868e96'}}>🚧 {examLevel} 試題整理中...<br/>敬請期待！</div>)}</div></div></div>); }
  if (view === 'exam' && selectedExam) { return (<ExamView paper={selectedExam} onExit={() => setView('exam_year_select')} />); }
  if (view === 'short_phrases') { return (<div className="app-container"><div className="list-screen"><div className="sticky-header"><div className="header-top"><button onClick={() => { setInitialSwipePage(1); setView('level_select'); }} className="btn-ghost">← 返回</button><h2 className="page-title" style={{color: '#e64980'}}>實用短句</h2><div style={{width: 40}}></div></div></div><div className="word-list" ref={listRef}>{shortPhrasesList.map((item, idx) => (<div key={idx} className="word-item"><div className="word-info"><div className="word-main">{item.w}</div><div className="word-sub"><span className="meaning-tag" style={{background:'#fff0f6', color:'#e64980'}}>{item.m}</span><span className="reading">{item.r}</span><span className="separator">•</span><span className="pos-text">{item.p}</span></div></div></div>))}</div></div></div>); }
  if (view === 'basic_numbers') { return (<div className="app-container"><div className="list-screen"><div className="sticky-header"><div className="header-top"><button onClick={() => { setInitialSwipePage(1); setView('level_select'); }} className="btn-ghost">← 返回</button><h2 className="page-title">基本數詞</h2><div style={{width: 40}}></div></div></div><div className="word-list" ref={listRef} style={{padding: '0 16px 40px 16px'}}>{basicNumberList.map((category, idx) => (<div key={idx} className="number-section"><div className="section-title">{category.title}</div><div className="number-grid">{category.items.map((item, i) => (<div key={i} className="number-card"><div className="num-label">{item.label}</div><div className="num-reading">{item.reading}</div></div>))}</div></div>))}</div></div></div>); }
  if (view === 'home') { const currentSavedCount = activeList.filter(w => savedWords.includes(w.w)).length; return (<div className="app-container"><div className="home-screen"><div style={{width: '100%', marginBottom: 10}}><button onClick={() => { setInitialSwipePage(0); setView('level_select'); }} className="btn-ghost">← 切換等級</button></div><div className="hero-section"><div className="current-level-tag">{level.toUpperCase()}</div><div className="app-subtitle">學習儀表板</div></div><div className="menu-grid"><button onClick={() => { setSearchTerm(''); setView('list'); setSortMode('default'); setFilterPos(['all']); }} className="btn menu-card"><div className="icon-box" style={{background: '#e7f5ff', color: '#5c7cfa'}}>📖</div><div>{level.toUpperCase()} 單字表 ({activeList.length})</div></button>{level === 'n5' && (<button onClick={() => setView('grammar_list')} className="btn menu-card"><div className="icon-box" style={{background: '#fff9db', color: '#fab005'}}>📝</div><div>N5 文法 ({n5GrammarList.length})</div></button>)}<button onClick={() => { setSearchTerm(''); setView('saved'); setSortMode('default'); setFilterPos(['all']); }} className="btn menu-card"><div className="icon-box" style={{background: '#fff4e6', color: '#ff922b'}}>⭐</div><div>{level.toUpperCase()} 不熟單字 ({currentSavedCount})</div></button><button onClick={() => initQuiz('all')} className="btn menu-card"><div className="icon-box" style={{background: '#ebfbee', color: '#51cf66'}}>🎲</div><div>{level.toUpperCase()} 隨機測驗</div></button></div></div></div>); }
  if (view === 'quiz_setup') { const sourceList = getQuizSourceList(); const maxQuestions = Math.min(100, sourceList.length); const minQuestions = Math.min(5, sourceList.length); if (quizCount > maxQuestions) setQuizCount(maxQuestions); return (<div className="app-container"><div className="home-screen"><div className="hero-section"><div className="app-title" style={{fontSize: '1.8rem'}}>{quizMode === 'saved' ? '⭐ 不熟單字特訓' : '🎲 隨機測驗'}</div><div className="app-subtitle">範圍內共有 {sourceList.length} 題</div></div><div className="setup-card"><div className="setup-label">題目數量</div><div className="setup-value">{quizCount} 題</div><input type="range" min={minQuestions} max={maxQuestions} step="1" value={quizCount} onChange={(e) => setQuizCount(Number(e.target.value))} className="range-slider" /><div className="range-labels"><span>{minQuestions}</span><span>{maxQuestions}</span></div></div><div className="menu-grid" style={{marginTop: 40}}><button onClick={() => setView('quiz')} className="btn btn-primary">🚀 開始測驗</button><button onClick={() => setView('home')} className="btn btn-outline">取消</button></div></div></div>); }
  if (view === 'grammar_list') { return (<div className="app-container"><div className="list-screen"><div className="sticky-header"><div className="header-top"><button onClick={() => setView('home')} className="btn-ghost">✕ 關閉</button><h2 className="page-title">N5 文法</h2><div style={{width: 40}}></div></div></div><div className="word-list" ref={listRef}>{n5GrammarList.map((g, index) => (<div key={g.id} className="word-item grammar-item" onClick={() => openGrammar(g)} style={{cursor: 'pointer'}}><div className="word-info"><div className="word-main" style={{fontSize: '1rem'}}>{index + 1}. {g.title}</div><div className="word-sub" style={{color: '#868e96'}}>{g.rule}</div></div><div style={{color: '#dee2e6', paddingRight: 10}}>›</div></div>))}</div></div></div>); }
  if (view === 'grammar_detail' && selectedGrammar) { const currentIndex = n5GrammarList.findIndex(g => g.id === selectedGrammar.id); const hasPrev = currentIndex > 0; const hasNext = currentIndex < n5GrammarList.length - 1; const goToPrev = () => { if (hasPrev) setSelectedGrammar(n5GrammarList[currentIndex - 1]); }; const goToNext = () => { if (hasNext) setSelectedGrammar(n5GrammarList[currentIndex + 1]); }; return (<div className="app-container"><div className="detail-screen"><div className="detail-header"><button onClick={() => setView('grammar_list')} className="btn-ghost">← 文法列表</button><div></div></div><div style={{flex: 1, overflowY: 'auto'}}><div className="detail-card"><div className="detail-word" style={{fontSize: '1.8rem'}}>{currentIndex + 1}. {selectedGrammar.title}</div><div className="grammar-rule-box">{selectedGrammar.rule}</div></div><div className="info-block"><div className="info-label">解說 / 特徵</div><div className="info-content" style={{lineHeight: 1.6}}>{selectedGrammar.desc}</div></div><div className="info-block"><div className="info-label">例句</div><div className="sentence-group">{selectedGrammar.examples.map((ex, i) => (<div key={i} className="sentence-box" style={{marginBottom: 12}}><div className="sentence-jp">{ex.jp}</div><div className="sentence-cn">{ex.cn}</div></div>))}</div></div></div><div className="detail-footer"><button className="nav-btn" onClick={goToPrev} disabled={!hasPrev}>← 上一個</button><div className="nav-counter">{currentIndex + 1} / {n5GrammarList.length}</div><button className="nav-btn" onClick={goToNext} disabled={!hasNext}>下一個 →</button></div></div></div>); }
  if (view === 'list' || view === 'saved') { return (<div className="app-container"><div className="list-screen"><div className="sticky-header"><div className="header-top"><button onClick={() => setView('home')} className="btn-ghost">✕ 關閉</button><h2 className="page-title" style={{color: view === 'saved' ? '#ff922b' : 'var(--text-main)'}}>{view === 'saved' ? '不熟單字' : `${level.toUpperCase()} 單字表`}</h2>{view === 'saved' ? (<button className="btn-ghost" style={{color: '#5c7cfa', fontWeight:'bold'}} onClick={() => initQuiz('saved')}>特訓</button>) : (<div style={{width: 40}}></div>)}</div><div className="search-row"><input type="text" placeholder="搜尋單字..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /><button className={`filter-toggle-btn ${showFilter ? 'active' : ''}`} onClick={() => setShowFilter(!showFilter)}>{showFilter ? '▲ 收起' : '▼ 篩選'}</button></div>{showFilter && (<div className="filter-panel"><div className="control-row"><span className="control-label">排序</span><div className="control-group"><button className={`sort-pill ${sortMode === 'default' ? 'active' : ''}`} onClick={() => setSortMode('default')}>預設</button><button className={`sort-pill ${sortMode === 'aiueo' ? 'active' : ''}`} onClick={() => setSortMode('aiueo')}>50音</button></div></div><div className="control-row"><span className="control-label">詞性</span><div className="control-group scroll-group"><button className={`filter-pill ${filterPos.includes('all') ? 'active' : ''}`} onClick={() => toggleFilter('all')}>全部</button><button className={`filter-pill ${filterPos.includes('noun') ? 'active' : ''}`} onClick={() => toggleFilter('noun')}>名詞</button><button className={`filter-pill ${filterPos.includes('verb') ? 'active' : ''}`} onClick={() => toggleFilter('verb')}>動詞</button><button className={`filter-pill ${filterPos.includes('adj') ? 'active' : ''}`} onClick={() => toggleFilter('adj')}>形容詞</button><button className={`filter-pill ${filterPos.includes('phrase') ? 'active' : ''}`} onClick={() => toggleFilter('phrase')}>短句/寒暄</button></div></div></div>)}</div><div className="word-list" ref={listRef}>{filteredList.length === 0 ? (<div style={{textAlign: 'center', padding: 40, color: '#868e96'}}>{view === 'saved' ? '目前沒有不熟單字 ✨' : '沒有找到資料 🍃'}</div>) : (filteredList.map((item, idx) => (<div key={`${item.w}-${idx}`} className="word-item" onClick={() => openDetail(item)} style={{cursor: 'pointer'}}><button className={`star-btn ${savedWords.includes(item.w) ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); toggleSave(item.w); }}>{savedWords.includes(item.w) ? '★' : '☆'}</button><div className="word-info"><div className="word-main">{item.w}</div><div className="word-sub"><span className="meaning-tag">{item.m}</span><span className="reading">{item.r}</span><span className="separator">•</span><span className="pos-text">{item.p}</span></div></div><div style={{color: '#dee2e6', paddingRight: 10}}>›</div></div>)))}</div></div></div>); }
  if (view === 'particle_quiz') { return (<QuizView list={particleQuestionsData.map(q => ({ id: q.id, q: q.q, options: q.options, a: q.a, explanation: q.explanation }))} count={10} onFinish={(finalScore, history) => { setScore(finalScore); setQuizHistory(history); setView('result'); }} onExit={() => { setView('level_select'); setInitialSwipePage(1); }} />); }
  if (view === 'quiz') { return <QuizView list={getQuizSourceList()} count={quizCount} onFinish={handleQuizFinish} onExit={() => setView('home')} />; }
  if (view === 'result') { return (<div className="app-container"><div className="result-screen"><div className="score-section"><div className="score-circle"><div className="score-number">{score}</div><div className="score-label">分 (共{quizHistory.length}題)</div></div><h2 style={{marginBottom: 20, color: 'var(--text-main)'}}>測驗結果</h2></div><div className="review-list"><h3 style={{marginLeft: 10, color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: 10}}>詳細檢討</h3>{quizHistory.map((log, i) => { const details = allLevels.n5.find(w => w.w === log.question.q); const explanation = (log.question as any).explanation; return (<div key={i} className={`review-item ${log.isCorrect ? 'correct' : 'wrong'}`}><div className="review-header"><div className="review-q"><span style={{color:'var(--text-sub)', marginRight:8, fontSize:'0.9rem'}}>{i + 1}.</span> {log.question.q}</div><span className={`status-text ${log.isCorrect ? 'correct' : 'wrong'}`}>{log.isCorrect ? 'Correct' : 'Mistake'}</span></div><div className="review-body">{!log.isCorrect && (<div className="ans-row"><span className="label-text">你選</span><span className="val-text wrong">{log.userAnswer}</span></div>)}<div className="ans-row"><span className="label-text">正解</span><span className="val-text correct">{log.question.a}</span></div></div>{(explanation || details) && (<div className="review-expl">{explanation && (<div className="expl-row"><span className="expl-tag">解析</span><span className="expl-text">{explanation}</span></div>)}{!explanation && details && (<><div className="expl-row"><span className="expl-tag">意思</span><span className="expl-text">{details.m}</span></div>{details.p && (<div className="expl-row"><span className="expl-tag" style={{background:'rgba(255, 146, 43, 0.1)', color:'#ff922b'}}>詞性</span><span className="expl-text" style={{fontSize:'0.9rem', color:'var(--text-sub)'}}>{details.p}</span></div>)}</>)}</div>)}</div>); })}</div><div className="result-footer"><button onClick={() => setView('quiz_setup')} className="btn btn-primary" style={{marginBottom: 12}}>再測一次</button><button onClick={() => setView('home')} className="btn btn-outline">回儀表板</button></div></div></div>); }
  
  // ✨ 單字詳細頁 + 筆記編輯器
 if (view === 'detail' && selectedWord) { 
    // ... (這幾行不用動)
    const isSaved = savedWords.includes(selectedWord.w); 
    const currentIndex = filteredList.findIndex(w => w.w === selectedWord.w); 
    const hasPrev = currentIndex > 0; 
    const hasNext = currentIndex !== -1 && currentIndex < filteredList.length - 1; 
    
    const currentNote = customNotes[selectedWord.w] || null;

    return (
      <div className="app-container">
        <div className="detail-screen">
          <div className="detail-header">
            {/* ✨ 修改這裡：onClick 改成 setView(lastListView) */}
            <button onClick={() => setView(lastListView)} className="btn-ghost">← 返回列表</button>
            
            <button className={`btn-ghost ${isSaved ? 'active-star' : ''}`} onClick={() => toggleSave(selectedWord.w)} style={{fontSize: '1.5rem'}}>{isSaved ? '★' : '☆'}</button>
          </div>
          <div style={{flex: 1, overflowY: 'auto', paddingBottom: 100}}>
            <div className="detail-card">
              <span className="detail-pos">{selectedWord.p}</span>
              <div className="detail-word">{selectedWord.w}</div>
              <div className="detail-reading">{selectedWord.r}</div>
            </div>
            
            {/* 筆記編輯器 (放在這裡) */}
            <NoteEditor 
              initialNote={currentNote} 
              onSave={(note) => saveNoteForWord(selectedWord.w, note)} 
            />
            
            <div className="info-block" style={{marginTop: 20}}>
              <div className="info-label">中文意思</div>
              <div className="info-content">{selectedWord.m}</div>
            </div>
            <div className="info-block">
              <div className="info-label">例句 / 例文</div>
              {selectedWord.s ? (<div className="sentence-box"><div className="sentence-jp">{selectedWord.s}</div><div className="sentence-cn">{selectedWord.st}</div></div>) : (<div className="info-content empty">(暫無例句資料)</div>)}
            </div>
          </div>
          <div className="detail-footer">
            <button className="nav-btn" onClick={() => { if (hasPrev) setSelectedWord(filteredList[currentIndex - 1]); }} disabled={!hasPrev}>← 上一個</button>
            <div className="nav-counter">{currentIndex !== -1 ? currentIndex + 1 : 0} / {filteredList.length}</div>
            <button className="nav-btn" onClick={() => { if (hasNext) setSelectedWord(filteredList[currentIndex + 1]); }} disabled={!hasNext}>下一個 →</button>
          </div>
        </div>
      </div>
    ); 
  }

  return null;
}

export default App;