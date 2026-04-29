import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

// 필수 익스텐션
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";

// 아이콘
import { Undo2, Redo2 } from "lucide-react";

// --- 스타일 정의 (Placeholder 핵심 로직) ---
const placeholderStyles = `
  .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
  /* 에디터 내부의 최소 높이와 기본 스타일 보정 */
  .tiptap {
    min-height: 300px;
  }
`;

// --- 1. 공통 툴바 버튼 컴포넌트 ---
const ToolbarButton = ({ 
  onClick, 
  disabled = false, 
  children, 
  title,
  align = "center"
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  children: React.ReactNode;
  title: string;
  align?: "left" | "center" | "right";
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const alignClasses = {
    left: "left-0 items-start",
    center: "left-1/2 -translate-x-1/2 items-center",
    right: "right-0 items-end"
  };

  const arrowClasses = {
    left: "ml-2", // 버튼이 더 작아졌으므로 꼬리 위치 미세 조정
    center: "",
    right: "mr-2"
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        // p-1.5에서 p-1로 줄여 간격을 좁힘
        className="p-1 rounded-md transition-colors text-slate-600 hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed"
      >
        {children}
      </button>

      {showTooltip && !disabled && (
        <div className={`absolute top-full mt-1.5 flex flex-col z-50 ${alignClasses[align]}`}>
          <div className={`w-1.5 h-1.5 bg-slate-800 rotate-45 -mb-0.5 ${arrowClasses[align]}`}></div>
          <div className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-lg font-medium border border-slate-700">
            {title}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. 메인 에디터 컴포넌트 ---
export default function SimpleHistoryEditor() {
  const [, setTick] = useState(0);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      History.configure({
        depth: 100,
        newGroupDelay: 500,
      }),
      Placeholder.configure({
        placeholder: "본문을 입력해 주십시오. ('/' 입력 시 명령어 도구 모음이 나타납니다.)",
      }),      
    ],
    content: "",
    onUpdate: () => setTick(t => t + 1),
    onSelectionUpdate: () => setTick(t => t + 1),
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none p-2 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col my-10">
      {/* 정의한 스타일을 리액트 컴포넌트 내부에 적용 */}
      <style>{placeholderStyles}</style>
      
      {/* 툴바 영역 */}
      <div className="flex items-center gap-0.5 p-1.5 border-b border-slate-200 bg-slate-50/50">
        <ToolbarButton 
          onClick={() => editor.chain().focus().undo().run()} 
          disabled={!editor.can().undo()} 
          title="실행 취소(Ctrl+Z)"
          align="left"
        >
          <Undo2 size={16} />
        </ToolbarButton>

        <ToolbarButton 
          onClick={() => editor.chain().focus().redo().run()} 
          disabled={!editor.can().redo()} 
          title="다시 실행(Ctrl+Y)"
        >
          <Redo2 size={16} />
        </ToolbarButton>

        <div className="ml-auto text-[10px] font-semibold text-slate-400 px-1 tracking-tighter uppercase">
          편집 기록 기록 중
        </div>
      </div>

      {/* 에디터 본문 영역 */}
      <div className="overflow-y-auto bg-white min-h-75">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}