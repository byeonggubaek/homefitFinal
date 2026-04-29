import { Editor } from "@tiptap/react";
import { Undo2, Redo2, Bold, Italic, List } from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) return null;

  // 공통 버튼 스타일 (Tailwind 4.0의 간결한 유틸리티 활용)
  const btnClass = "p-2 rounded-md transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600";
  const activeClass = "bg-slate-200 text-slate-900";

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-white sticky top-0 z-10">
      {/* History Group */}
      <div className="flex items-center gap-0.5 border-r pr-2 mr-1 border-slate-200">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={btnClass}
          aria-label="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={btnClass}
          aria-label="Redo"
        >
          <Redo2 size={18} />
        </button>
      </div>

      {/* Formatting Group */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnClass} ${editor.isActive("bold") ? activeClass : ""}`}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnClass} ${editor.isActive("italic") ? activeClass : ""}`}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnClass} ${editor.isActive("bulletList") ? activeClass : ""}`}
        >
          <List size={18} />
        </button>
      </div>
    </div>
  );
};