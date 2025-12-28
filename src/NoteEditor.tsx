// src/NoteEditor.tsx
import { useState, useRef, useEffect } from 'react';
import { type CustomNote } from './data';

interface NoteEditorProps {
  initialNote?: CustomNote;
  onSave: (note: CustomNote | null) => void;
}

export default function NoteEditor({ initialNote, onSave }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  
  // 暫存內容 (HTML 字串)
  const [content, setContent] = useState(initialNote?.content || '');

  // 當進入編輯模式時，確保顯示目前的內容
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [isEditing]);

  // 執行富文本指令 (加粗、變色等)
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // 強制讓編輯器取得焦點，確保下次輸入時狀態正確
    if (editorRef.current) editorRef.current.focus();
  };

  // 如果沒有筆記且不在編輯模式
  if (!initialNote && !isEditing) {
    return (
      <button 
        className="btn btn-outline" 
        onClick={() => setIsEditing(true)}
        style={{marginTop: 20, borderStyle: 'dashed'}}
      >
        ＋ 新增筆記
      </button>
    );
  }

  // 顯示模式 (預覽 HTML)
  if (!isEditing && initialNote) {
    return (
      <div className="note-preview-box">
        {/* 使用 dangerouslySetInnerHTML 來顯示帶有顏色的 HTML */}
        <div 
          className="note-html-content"
          dangerouslySetInnerHTML={{ __html: initialNote.content }} 
        />
        <div className="note-actions">
          <button className="note-action-btn" onClick={() => setIsEditing(true)}>✎ 編輯</button>
        </div>
      </div>
    );
  }

  // 儲存處理
  const handleSave = () => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.innerHTML;
    // 如果內容只剩下空標籤或空白，視為刪除
    if (!editorRef.current.innerText.trim()) {
      onSave(null);
    } else {
      onSave({
        content: newContent,
        updatedAt: Date.now()
      });
    }
    setContent(newContent);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('確定要刪除這則筆記嗎？')) {
      onSave(null);
      setIsEditing(false);
      setContent('');
    }
  };

  return (
    <div className="note-editor-box">
      {/* 工具列 */}
      <div className="note-toolbar">
        
        {/* 粗體 */}
        <button className="tool-btn" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }} title="粗體">
          <b>B</b>
        </button>

        {/* 底線 */}
        <button className="tool-btn" onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }} title="底線">
          <u>U</u>
        </button>

        <div className="tool-separator"></div>

        {/* 文字顏色 */}
        <div className="tool-wrapper" title="文字顏色">
          <span style={{fontWeight:'bold', color:'#ff6b6b'}}>A</span>
          <input 
            type="color" 
            onChange={(e) => execCmd('foreColor', e.target.value)} 
            className="hidden-color-picker"
          />
        </div>

        {/* 背景顏色 (螢光筆) */}
        <div className="tool-wrapper" title="螢光筆">
          <span style={{background:'#ffd43b', padding:'0 4px', borderRadius:2}}>🖊</span>
          <input 
            type="color" 
            defaultValue="#ffd43b"
            onChange={(e) => execCmd('hiliteColor', e.target.value)} 
            className="hidden-color-picker"
          />
        </div>

        {/* 清除格式 */}
        <button className="tool-btn" onMouseDown={(e) => { e.preventDefault(); execCmd('removeFormat'); }} title="清除格式" style={{fontSize:'0.8rem'}}>
          ✕
        </button>
      </div>

      {/* 編輯區域 (ContentEditable) */}
      <div 
        ref={editorRef}
        className="rich-editor-area"
        contentEditable={true}
        suppressContentEditableWarning={true}
        // ✨ 修改這裡：改成 data-placeholder
        data-placeholder="在此輸入筆記... (選取文字可套用樣式)"
      >
      </div>

      <div className="note-footer">
        <button className="btn-ghost" onClick={() => setIsEditing(false)} style={{fontSize:'0.9rem'}}>取消</button>
        {initialNote && <button className="btn-ghost" onClick={handleDelete} style={{color:'#ff6b6b', fontSize:'0.9rem'}}>刪除</button>}
        <button className="btn-primary" onClick={handleSave} style={{padding: '8px 16px', borderRadius: 8, width:'auto', fontSize:'0.9rem'}}>儲存</button>
      </div>
    </div>
  );
}