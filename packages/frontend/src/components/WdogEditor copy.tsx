import { useState, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TextSelection, NodeSelection } from '@tiptap/pm/state';

// 필수 익스텐션
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline' // 추가
import Highlight from '@tiptap/extension-highlight';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align'
import Image from "@tiptap/extension-image";


// 아이콘
import { Undo2, Redo2 } from "lucide-react";
import { Type, Heading1, Heading2, Heading3, Heading4, ChevronDown } from "lucide-react";
import { List, ListOrdered, ListTodo  } from "lucide-react";
import { Bold as BoldIcon, Italic as ItalicIcon, Strikethrough as StrikeIcon, Underline as UnderlineIcon, Highlighter, Ban } from "lucide-react";
import { Code as CodeIcon, Quote, Link as LinkIcon, Unlink } from "lucide-react";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ImagePlus } from 'lucide-react';

// --- 스타일 정의 ---
const placeholderStyles = `
  .tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
  }
  .tiptap { min-height: 500px; }
  .tiptap h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.2; margin-bottom: 0.5em; }
  .tiptap h2 { font-size: 1.875rem; font-weight: 700; line-height: 1.3; margin-bottom: 0.4em; }
  .tiptap h3 { font-size: 1.5rem; font-weight: 700; line-height: 1.4; margin-bottom: 0.3em; }
  .tiptap h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.5; margin-bottom: 0.3em; }
  .tiptap ul { list-style-type: disc; padding-left: 1.5rem; }
  .tiptap ol { list-style-type: decimal; padding-left: 1.5rem; }

  /* Task List 스타일 수정 */
  .tiptap ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
  }
  .tiptap ul[data-type="taskList"] li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }
  .tiptap ul[data-type="taskList"] label {
    flex: 0 0 auto;
    margin-right: 0.3rem;
    user-select: none;
    display: flex;
    align-items: center;
    margin-top: 0.35rem; /* 텍스트 중앙 정렬 보정 */
  }
  /* 체크박스 커스텀 디자인 */
  .tiptap ul[data-type="taskList"] input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 0.9rem;      /* 크기를 좀 더 작게 조절 (기존 1rem -> 0.85rem) */
    height: 0.9rem;
    cursor: pointer;
    background-color: #f1f3f5; /* 연한 회색 배경 채우기 (Gray 100~200 사이) */
    border: 1.5px solid #ced4da; /* 테두리 색상 */
    border-radius: 3px;  /* 살짝 둥근 모서리 */
    position: relative;
    transition: all 0.1s ease;
  }

  /* 체크박스 체크되었을 때 상태 */
  .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked {
    background-color: var(--focus); /* 파란색 배경 */
    border-color: var(--focus);
  }

  /* 체크박스 체크 표시(v) 구현 */
  .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked::after {
    content: '';
    position: absolute;
    top: 1px;
    left: 4px;
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .tiptap ul[data-type="taskList"] div {
    flex: 1 1 auto;
  }

  /* 인용문 스타일 */
  .tiptap blockquote {
    padding-left: 1rem;
    border-left: 4px solid #dee2e6;
    color: #495057;
    font-style: italic;
    margin: 1.5rem 0;
  }

  /* 코드 블록 전체 박스 */
  .tiptap pre.notion-code-block {
    background-color: #f7f6f3 !important;
    border-radius: 6px !important;
    padding: 0.75rem 1rem !important;
    margin: 1rem 0 !important;
    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
    font-size: 0.9rem !important;
    line-height: 1.5 !important;
    white-space: pre !important;
    overflow-x: auto !important;
  }

  .tiptap pre.notion-code-block code {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    color: #37352f !important;
    font: inherit !important;
    line-height: inherit !important;
    white-space: inherit !important;
    word-break: normal !important;
  }

  .tiptap pre.notion-code-block *,
  .tiptap pre.notion-code-block *::before,
  .tiptap pre.notion-code-block *::after {
    line-height: inherit !important;
  }

  /* 에디터 내부 이미지 기본 스타일 */
  .tiptap img {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    outline: 1px solid gray; /* 파란색 테두리 */
  }

  /* 이미지가 선택되었을 때 (클릭 시) */
  .tiptap img.ProseMirror-selectednode {
    outline: 1px solid #3b82f6; /* 파란색 테두리 */
    filter: brightness(0.9);    /* 약간 어둡게 하여 선택됨을 강조 */
  }
`;

// --- 드롭다운 컴포넌트 ---
const HeadingSelector = ({ editor }: { editor: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 현재 상태에 맞는 아이콘을 반환하는 함수
  const CurrentIcon = () => {
    if (editor.isActive("heading", { level: 1 })) return <Heading1 size={16} className="text-focus" />;
    if (editor.isActive("heading", { level: 2 })) return <Heading2 size={16} className="text-focus" />;
    if (editor.isActive("heading", { level: 3 })) return <Heading3 size={16} className="text-focus" />;
    if (editor.isActive("heading", { level: 4 })) return <Heading4 size={16} className="text-focus" />;
    return <Type size={16} />;
  };

  const options = [
    { label: "본문", icon: <Type size={16} />, id: "p", onClick: () => editor.chain().focus().setParagraph().run() },
    { label: "제목 1", icon: <Heading1 size={16} />, id: 1, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "제목 2", icon: <Heading2 size={16} />, id: 2, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "제목 3", icon: <Heading3 size={16} />, id: 3, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "제목 4", icon: <Heading4 size={16} />, id: 4, onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* 트리거 버튼: 현재 선택된 아이콘 표시 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-1 bg-white border-slate-200 rounded hover:bg-slate-50 transition-colors"
      >
        <CurrentIcon />
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 드롭다운 리스트: 아이콘 + 텍스트 조합 */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-md shadow-xl z-60 py-1">
          {options.map((option) => {
            const isActive = option.id === "p" 
              ? editor.isActive("paragraph") 
              : editor.isActive("heading", { level: option.id });

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                  isActive ? "text-blue-600 bg-blue-50/50" : "text-slate-600"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                  {option.icon}
                </span>
                <span className={isActive ? "font-bold" : ""}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ListSelector = ({ editor }: { editor: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 현재 활성화된 리스트 상태에 따른 아이콘 반환
  const CurrentIcon = () => {
    if (editor.isActive("bulletList")) return <List size={16} className="text-blue-600" />;
    if (editor.isActive("orderedList")) return <ListOrdered size={16} className="text-blue-600" />;
    if (editor.isActive("taskList")) return <ListTodo  size={16} className="text-blue-600" />;
    return <List size={16} className="text-slate-400" />;
  };

  const options = [
    { 
      label: "불렛 리스트", 
      icon: <List size={16} />, 
      activeId: "bulletList", 
      onClick: () => editor.chain().focus().toggleBulletList().run() 
    },
    { 
      label: "번호 리스트", 
      icon: <ListOrdered size={16} />, 
      activeId: "orderedList", 
      onClick: () => editor.chain().focus().toggleOrderedList().run() 
    },
    { 
      label: "체크 리스트", 
      icon: <ListTodo  size={16} />, 
      activeId: "taskList", 
      onClick: () => editor.chain().focus().toggleTaskList().run() 
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-1 bg-white rounded hover:bg-slate-50 transition-colors"
      >
        <CurrentIcon />
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-xl z-[60] py-1">
          {options.map((option) => {
            const isActive = editor.isActive(option.activeId);

            return (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${
                  isActive ? "text-blue-600 bg-blue-50/50" : "text-slate-600"
                }`}
              >
                <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                  {option.icon}
                </span>
                <span className={isActive ? "font-bold" : ""}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const HighlightSelector = ({ editor }: { editor: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

const colors = [
    { name: 'yellow', color: 'rgba(255, 255, 0, 0.15)', title: '형광 노랑' },
    { name: 'green', color: 'rgba(0, 255, 0, 0.15)', title: '형광 초록' },
    { name: 'blue', color: 'rgba(0, 255, 255, 0.15)', title: '형광 파랑' },
    { name: 'red', color: 'rgba(255, 0, 255, 0.15)', title: '형광 핑크' },
    { name: 'purple', color: 'rgba(204, 51, 255, 0.15)', title: '형광 보라' },
  ];
                           
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-md transition-colors flex items-center gap-0.5 hover:bg-slate-100 ${
          editor.isActive('highlight') ? 'bg-slate-200 text-blue-600' : 'text-slate-600'
        }`}
      >
        <Highlighter size={16} />
        <ChevronDown size={10} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 p-2 bg-white border border-slate-200 rounded-lg shadow-xl z-70 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {colors.map((c) => {
              // 중요: isActive 체크 시 색상 옵션을 빼고 체크하거나, 
              // 브라우저에 따라 rgba 공백이 달라질 수 있으므로 유의해야 합니다.
              const isActive = editor.isActive('highlight', { color: c.color });
              
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    editor.chain().focus().toggleHighlight({ color: c.color }).run();
                    setIsOpen(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    isActive ? 'border-slate-800' : 'border-slate-100'
                  }`}
                  style={{ backgroundColor: c.color }} // 여기서 투명도 확인 가능
                />
              );
            })}
          </div>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <button
            onClick={() => {
              editor.chain().focus().unsetHighlight().run();
              setIsOpen(false);
            }}
            className="p-1 hover:text-red-500 transition-colors"
          >
            <Ban size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const AlignmentToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const alignments = [
    { name: 'left', icon: <AlignLeft size={16} />, label: '왼쪽 정렬' },
    { name: 'center', icon: <AlignCenter size={16} />, label: '가운데 정렬' },
    { name: 'right', icon: <AlignRight size={16} />, label: '오른쪽 정렬' },
    { name: 'justify', icon: <AlignJustify size={16} />, label: '양쪽 정렬' },
  ];

  return (
    <div className="flex gap-1">
      {alignments.map((align) => (
        <button
          key={align.name}
          onClick={() => editor.chain().focus().setTextAlign(align.name).run()}
          title={align.label} // 브라우저 기본 툴팁 적용
          className={`p-2 rounded flex items-center justify-center transition-colors ${
            editor.isActive({ textAlign: align.name }) 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {align.icon}
        </button>
      ))}
    </div>
  );
};

const ToolbarButton = ({ onClick, disabled, children, title, align = "center" }: any) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const alignClasses = { left: "left-0 items-start", center: "left-1/2 -translate-x-1/2 items-center", right: "right-0 items-end" };

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="p-1 rounded-md transition-colors text-slate-600 hover:bg-slate-100 disabled:opacity-20 disabled:cursor-not-allowed"
      >
        {children}
      </button>
      {showTooltip && !disabled && (
        <div className={`absolute top-full mt-1.5 flex flex-col z-50 ${alignClasses[align as keyof typeof alignClasses]}`}>
          <div className="w-1.5 h-1.5 bg-slate-800 rotate-45 -mb-0.5"></div>
          <div className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-lg border border-slate-700">{title}</div>
        </div>
      )}
    </div>
  );
};

export default function WdogEditor() {
  const fileInputRef = useRef<HTMLInputElement>(null);  
  const [, setTick] = useState(0);

  const editor = useEditor({
    extensions: [
      Document, Text, Paragraph, 
      History.configure({ depth: 100, newGroupDelay: 500 }),
      Heading.configure({ levels: [1, 2, 3, 4] }),
      BulletList, OrderedList, ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),      
      Bold, Italic, Strike, Underline,
      Highlight.configure({ multicolor: true }), // 색상 지정을 위해 multicolor 활성화
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'notion-code-block',
        },
        enableTabIndentation: true,
        tabSize: 2,
      }),
      Blockquote,
      Link.configure({
        openOnClick: true, // 에디터 내에서 클릭 시 바로 이동 방지
        HTMLAttributes: {
          class: 'text-blue-600 underline underline-offset-4 cursor-pointer',
        },
      }), 
      TextAlign.configure({
        types: ['paragraph', 'heading'], // 정렬을 허용할 노드들
        alignments: ['left', 'center', 'right', 'justify'], // 사용할 정렬 종류
      }),          
      // 1. 기본 Image 익스텐션 추가 (중요!)
      Image.extend({
        selectable: true, // 클릭 시 선택 상태 활성화
      }).configure({
        allowBase64: true,
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
        class: "tiptap max-w-none p-4 focus:outline-none",
        spellcheck: "true",
      },
      // 1. 드래그 앤 드롭 핸들러
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          handleImageUpload(file);
          return true; // Tiptap의 기본 드롭 동작을 막고 직접 처리
        }
        return false;
      },      
      // 2. 클립보드 붙여넣기 핸들러 (새로 추가)
      handlePaste: (view, event) => {
      const items = event.clipboardData?.items;

      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handleImageUpload(file);
              // 기본 붙여넣기 동작 방지 (이미지 파일인 경우에만)
              return true; 
            }
          }
        }
      }
      return false; // 텍스트 등 일반 데이터는 기본 동작 수행
      },      
    },
    immediatelyRender: false,
  });

  // 2. 파일 처리 로직 (Base64 변환 예시)
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (editor && result) {
        editor.chain().focus().insertContent({
          type: 'image',
          attrs: { src: result, width: '500px' },
        }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <div className="w-full h-full mx-auto bg-white rounded-xl overflow-hidden flex flex-col">
      {/* 숨겨진 파일 인풋 */}
      <input
        type="file" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
        className="hidden"
      />
      <style>{placeholderStyles}</style>
      
      <div className="flex items-center gap-1 p-1.5 border-b border-slate-200 bg-slate-50/50">

        {/* 실행, 실행취소 */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="실행 취소" align="left">
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="다시 실행">
          <Redo2 size={16} />
        </ToolbarButton>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* 문단 스타일조정 */}
        <HeadingSelector editor={editor} />
        <ListSelector editor={editor} />

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* 글자 스타일조정 */}
        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="굵게"
          >
          <BoldIcon size={16} className={editor.isActive('bold') ? 'text-blue-600' : ''} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="기울임"
        >
          <ItalicIcon size={16} className={editor.isActive('italic') ? 'text-blue-600' : ''} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="밑줄"
        >
          <UnderlineIcon size={16} className={editor.isActive('underline') ? 'text-blue-600' : ''} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="취소선"
        >
          <StrikeIcon size={16} className={editor.isActive('strike') ? 'text-blue-600' : ''} />
        </ToolbarButton>
        <HighlightSelector editor={editor} /> 

        <div className="h-4 w-px bg-slate-300 mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="인용문"
        >
          <Quote size={16} className={editor.isActive('blockquote') ? 'text-blue-600' : ''} />
        </ToolbarButton>

        {/* 코드 블록 */}
        <ToolbarButton 
          onClick={() => {
            const { selection, doc } = editor.state;
            const isCodeBlock = editor.isActive('codeBlock');

            if (isCodeBlock) {
              // 1. 해제 로직
              const $pos = selection.$from;
              let depth = $pos.depth;
              let node = null;
              let pos = 0;

              while (depth > 0) {
                if ($pos.node(depth).type.name === 'codeBlock') {
                  node = $pos.node(depth);
                  pos = $pos.before(depth);
                  break;
                }
                depth--;
              }

              if (node) {
                const text = node.textContent;
                const paragraphs = text.split('\n').map(line => ({
                  type: 'paragraph',
                  content: line ? [{ type: 'text', text: line }] : []
                }));

                editor.chain()
                  .focus()
                  .setNodeSelection(pos)
                  .insertContent(paragraphs)
                  // [추가] 해제 후 생성된 문단 전체를 드래그 상태로 선택
                  .command(({ tr, dispatch }) => {
                    if (dispatch) {
                      const startPos = pos; // 기존 코드블록 시작 위치
                      const endPos = tr.selection.$from.pos; // insertContent 후 커서 위치
                      tr.setSelection(TextSelection.create(tr.doc, startPos, endPos));
                    }
                    return true;
                  })
                  .run();
              }
            } else {
              editor.chain()
              .focus()
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { selection } = tr;
                  const text = editor.state.doc.textBetween(selection.from, selection.to, '\n');
                  
                  // 1. 새 노드 생성
                  const codeBlockNode = editor.schema.nodes.codeBlock.create(
                    null, 
                    text ? editor.schema.text(text) : null
                  );

                  // 2. 현재 선택 영역을 코드 블록으로 교체
                  tr.replaceSelectionWith(codeBlockNode);

                  // 3. 방금 삽입된 위치 계산
                  // replaceSelectionWith 이후 커서는 삽입된 노드 바로 뒤에 위치합니다.
                  // -1을 통해 노드 바로 앞 위치를 찾습니다.
                  const resolvedPos = tr.doc.resolve(tr.selection.from - 1);
                  const nodePos = resolvedPos.before(resolvedPos.depth + 1);

                  // 4. 노드 선택 영역 강제 적용
                  const nodeSel = NodeSelection.create(tr.doc, nodePos);
                  tr.setSelection(nodeSel);
                }
                return true;
          })
          .run();
            }
          }}
          title="코드 블록"
        >
          <CodeIcon size={16} className={editor.isActive('codeBlock') ? 'text-blue-600' : ''} />
        </ToolbarButton>

        {/* 링크 추가/해제 */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton 
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL을 입력하세요:', previousUrl);
              
              if (url === null) return; // 취소 시
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            title="링크 삽입"
          >
            <LinkIcon size={16} className={editor.isActive('link') ? 'text-blue-600' : ''} />
          </ToolbarButton>

          {editor.isActive('link') && (
            <ToolbarButton 
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="링크 해제"
            >
              <Unlink size={16} className="text-red-400" />
            </ToolbarButton>
          )}
        </div>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        <AlignmentToolbar editor={editor} />            

        <div className="h-4 w-px bg-slate-300 mx-1" />
        {/* 툴바 (기존 UI 유지) */}
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="이미지 삽입" className="bg-blue-600 text-white hover:bg-blue-700 ml-1">
          <ImagePlus size={16}/>
        </ToolbarButton>

        <div className="ml-auto text-[10px] font-semibold text-slate-400 px-1 uppercase">
          수정중...
        </div>
      </div>

      <div className="overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}