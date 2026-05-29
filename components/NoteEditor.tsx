"use client";
import { useState, useCallback } from "react";
import { Note, TagType, TAG_META, Flashcard } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FlashcardModal from "./FlashcardModal";
import {
  Eye,
  Edit3,
  Copy,
  Pin,
  Trash2,
  CopyPlus,
  Layers,
  BookOpen,
  FileText,
  Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, patch: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const S = {
  toggleTray: {
    background: "rgba(0,0,0,0.30)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: 3,
    display: "flex",
    gap: 2,
  } as React.CSSProperties,

  toggleActive: (isEdit: boolean) =>
    ({
      background: isEdit ? "rgba(99,102,241,0.20)" : "rgba(255,255,255,0.07)",
      color: isEdit ? "#818cf8" : "rgba(255,255,255,0.70)",
      border: isEdit
        ? "1px solid rgba(99,102,241,0.25)"
        : "1px solid rgba(255,255,255,0.10)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.4)",
    }) as React.CSSProperties,

  toggleIdle: {
    background: "transparent",
    color: "rgba(255,255,255,0.30)",
    border: "1px solid transparent",
  } as React.CSSProperties,

  toolbarWrap: {
    background: "rgba(255,255,255,0.02)",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: 3,
    overflowX: "auto" as const,
    flexShrink: 0,
    flexWrap: "nowrap" as const,
  } as React.CSSProperties,

  tbtnBase: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "Inter, var(--font-body), sans-serif",
    fontSize: 11,
    fontWeight: 500,
    background: "transparent",
    color: "rgba(255,255,255,0.35)",
    transition: "background 0.12s, color 0.12s",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  } as React.CSSProperties,
} as const;

export default function NoteEditor({
  note,
  onUpdate,
  onDelete,
  onDuplicate,
  onTogglePin,
}: NoteEditorProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [generatingCards, setGeneratingCards] = useState(false);

  const meta = TAG_META[note.tag];
  const words = note.body.split(/\s+/).filter(Boolean).length;
  const chars = note.body.length;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(note.body).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [note.body]);

  const handleExportTxt = useCallback(() => {
    const content = `${note.title}\n${"=".repeat(note.title.length)}\n\n${note.body}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [note]);

  const handleExportPdf = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head>
      <title>${note.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
      <style>
        body{font-family:'DM Sans',sans-serif;max-width:720px;margin:40px auto;padding:0 24px;color:#1a1830;line-height:1.7}
        h1{font-family:'Syne',sans-serif;font-size:2rem;margin-bottom:.5rem}
        h2{font-family:'Syne',sans-serif;font-size:1.4rem;color:#6366f1;margin:1.5rem 0 .5rem}
        p{color:#5a5878;margin-bottom:.75rem}
        code{background:#f2f2f8;padding:2px 6px;border-radius:4px;font-size:.85em;color:#6366f1}
        pre{background:#f2f2f8;padding:1rem;border-radius:8px;overflow-x:auto}
        blockquote{border-left:3px solid #c4b8ff;padding-left:1rem;color:#9896b8;font-style:italic}
        table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;border:1px solid #eaeaf4}
        th{background:#f2f2f8}.meta{font-size:12px;color:#9896b8;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #eaeaf4}
        @media print{body{margin:0}}
      </style></head><body>
      <h1>${note.title}</h1>
      <div class="meta">Tag: ${meta.label} &nbsp;·&nbsp; ${words} words &nbsp;·&nbsp; Updated ${formatDistanceToNow(note.updatedAt, { addSuffix: true })}</div>
      <div id="content"></div>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script>document.getElementById('content').innerHTML=marked.parse(${JSON.stringify(note.body)})</script>
      </body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 800);
  }, [note, meta, words]);

  const generateFlashcards = useCallback(async () => {
    if (!note.body.trim()) return;
    setGeneratingCards(true);
    try {
      const lines = note.body.split("\n").filter((l) => l.trim());
      const cards: Flashcard[] = [];
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (
          line.startsWith("##") ||
          line.startsWith("**") ||
          line.match(/^[A-Z][^.!?]{10,60}[:.]/)
        ) {
          const q = line.replace(/^#+\s*/, "").replace(/\*\*/g, "");
          const ans = lines
            .slice(i + 1, i + 4)
            .map((l) => l.replace(/^[-*]\s*/, "").replace(/\*\*/g, ""))
            .join("; ");
          if (q && ans) cards.push({ front: q, back: ans });
        }
      }
      if (cards.length < 2) {
        note.body
          .split("\n")
          .filter((l) => l.trim().length > 30)
          .forEach((chunk, idx) => {
            if (idx < 6)
              cards.push({
                front: `Explain: "${chunk.slice(0, 60)}..."`,
                back: chunk,
              });
          });
      }
      setFlashcards(cards.slice(0, 10));
    } finally {
      setGeneratingCards(false);
    }
  }, [note.body]);

  const tags = Object.keys(TAG_META) as TagType[];

  return (
    <div className="note-editor-root flex flex-col h-full overflow-hidden animate-slide-in">
      <div
        className="note-editor-header flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "var(--bg-surface)",
        }}
      >
        <input
          className="note-editor-title w-full bg-transparent border-none outline-none font-display text-lg sm:text-[21px] font-bold tracking-tight mb-3"
          style={{
            color: "#fff",
            fontFamily: "Syne, var(--font-display), sans-serif",
          }}
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Note title..."
        />

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={note.tag}
            onChange={(e) =>
              onUpdate(note.id, { tag: e.target.value as TagType })
            }
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-[0.8px] uppercase outline-none cursor-pointer"
            style={{
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              color: meta.color,
            }}
          >
            {tags.map((t) => (
              <option key={t} value={t}>
                {TAG_META[t].label}
              </option>
            ))}
          </select>

          <span
            className="hidden sm:inline text-[11px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {words} words · {chars} chars
          </span>
          <span
            className="hidden md:inline text-[11px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </span>

          <div className="ml-auto" style={S.toggleTray}>
            {(["edit", "preview"] as const).map((m) => {
              const isActive = mode === m;
              const isEdit = m === "edit";
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex items-center gap-[5px] px-3 py-[5px] rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer"
                  style={isActive ? S.toggleActive(isEdit) : S.toggleIdle}
                >
                  {isEdit ? <Edit3 size={11} /> : <Eye size={11} />}
                  <span>{isEdit ? "Edit" : "Preview"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="note-editor-body flex-1 overflow-hidden relative">
        {mode === "edit" ? (
          <textarea
            className="note-editor-content w-full h-full border-none resize-none outline-none text-sm leading-[1.8] px-4 sm:px-6 py-5"
            style={{
              background: "var(--bg-base)",
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-body)",
              height: "36vh",
            }}
            value={note.body}
            onChange={(e) => onUpdate(note.id, { body: e.target.value })}
            placeholder="Paste or type your notes here… (Markdown supported)"
          />
        ) : (
          <div
            className="note-editor-preview h-full overflow-y-auto px-4 sm:px-6 py-5"
            style={{ background: "var(--bg-base)" }}
          >
            <div className="prose-note">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.body || "*Nothing to preview yet.*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div style={S.toolbarWrap}>
        <ToolBtn
          icon={copied ? <Check size={12} /> : <Copy size={12} />}
          label={copied ? "Copied" : "Copy"}
          onClick={handleCopy}
          isOn={copied}
        />
        <ToolBtn
          icon={<FileText size={12} />}
          label="TXT"
          onClick={handleExportTxt}
        />
        <ToolBtn
          icon={<BookOpen size={12} />}
          label="PDF"
          onClick={handleExportPdf}
        />

        <Divider />

        <ToolBtn
          icon={<Layers size={12} />}
          label={generatingCards ? "…" : "Cards"}
          onClick={generateFlashcards}
          disabled={generatingCards}
        />
        <ToolBtn
          icon={<CopyPlus size={12} />}
          label="Duplicate"
          onClick={() => onDuplicate(note.id)}
        />
        <ToolBtn
          icon={<Pin size={12} />}
          label={note.pinned ? "Unpin" : "Pin"}
          onClick={() => onTogglePin(note.id)}
          isOn={note.pinned}
        />

        <div className="flex-1" />

        <ToolBtn
          icon={<Trash2 size={12} />}
          label="Delete"
          onClick={() => {
            if (confirm("Delete this note?")) onDelete(note.id);
          }}
          danger
        />
      </div>

      {flashcards && (
        <FlashcardModal
          cards={flashcards}
          noteTitle={note.title}
          onClose={() => setFlashcards(null)}
        />
      )}
    </div>
  );
}

function Divider() {
  return (
    <div
      className="flex-shrink-0 mx-1.5"
      style={{ width: 1, height: 16, background: "rgba(255,255,255,0.07)" }}
    />
  );
}

function ToolBtn({
  icon,
  label,
  onClick,
  isOn,
  danger,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isOn?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const bg = danger
    ? hovered
      ? "rgba(248,113,113,0.10)"
      : "transparent"
    : isOn
      ? hovered
        ? "rgba(99,102,241,0.25)"
        : "rgba(99,102,241,0.18)"
      : hovered
        ? "rgba(255,255,255,0.07)"
        : "transparent";

  const color = danger
    ? hovered
      ? "#fca5a5"
      : "rgba(248,113,113,0.55)"
    : isOn
      ? "#818cf8"
      : hovered
        ? "rgba(255,255,255,0.75)"
        : "rgba(255,255,255,0.35)";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...S.tbtnBase,
        background: bg,
        color,
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <span style={{ opacity: 0.85, flexShrink: 0 }}>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
