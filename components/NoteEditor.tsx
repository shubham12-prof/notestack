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
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>${note.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700;800&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'DM Sans', sans-serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #1a1830; line-height: 1.7; }
        h1 { font-family: 'Syne', sans-serif; font-size: 2rem; margin-bottom: 0.5rem; color: #1a1830; }
        h2 { font-family: 'Syne', sans-serif; font-size: 1.4rem; color: #5b4cf5; margin: 1.5rem 0 0.5rem; }
        h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.3rem; }
        p { color: #5a5878; margin-bottom: 0.75rem; }
        code { background: #f2f2f8; padding: 2px 6px; border-radius: 4px; font-size: 0.85em; color: #5b4cf5; }
        pre { background: #f2f2f8; padding: 1rem; border-radius: 8px; overflow-x: auto; }
        blockquote { border-left: 3px solid #c4b8ff; padding-left: 1rem; color: #9896b8; font-style: italic; margin: 1rem 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 12px; border: 1px solid #eaeaf4; }
        th { background: #f2f2f8; }
        .meta { font-size: 12px; color: #9896b8; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #eaeaf4; }
        @media print { body { margin: 0; } }
      </style></head><body>
      <h1>${note.title}</h1>
      <div class="meta">Tag: ${meta.label} &nbsp;·&nbsp; ${words} words &nbsp;·&nbsp; Updated ${formatDistanceToNow(note.updatedAt, { addSuffix: true })}</div>
      <div id="content"></div>
      <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
      <script>document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(note.body)})</script>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 800);
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
        const chunks = note.body
          .split("\n")
          .filter((l) => l.trim().length > 30);
        chunks.forEach((chunk, idx) => {
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
    <div
      className="note-editor-root"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        animation: "slideIn 0.3s ease",
      }}
    >
      <div
        className="note-editor-header"
        style={{
          padding: "20px 28px 16px",
          borderBottom: "1px solid var(--border-soft)",
          background: "var(--bg-surface)",
          flexShrink: 0,
        }}
      >
        <input
          className="note-editor-title"
          value={note.title}
          onChange={(e) => onUpdate(note.id, { title: e.target.value })}
          placeholder="Note title..."
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            fontFamily: "var(--font-display)",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text-primary)",
            outline: "none",
            marginBottom: 12,
            letterSpacing: "-0.3px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <select
            value={note.tag}
            onChange={(e) =>
              onUpdate(note.id, { tag: e.target.value as TagType })
            }
            style={{
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              color: meta.color,
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {tags.map((t) => (
              <option key={t} value={t}>
                {TAG_META[t].label}
              </option>
            ))}
          </select>

          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            {words} words · {chars} chars
          </span>
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
            Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
          </span>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              background: "var(--bg-subtle)",
              borderRadius: 8,
              border: "1px solid var(--border-soft)",
              padding: 2,
            }}
          >
            {(["edit", "preview"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  background: mode === m ? "var(--bg-surface)" : "transparent",
                  border:
                    mode === m
                      ? "1px solid var(--border-soft)"
                      : "1px solid transparent",
                  borderRadius: 6,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: mode === m ? 600 : 400,
                  color: mode === m ? "var(--accent)" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.15s",
                }}
              >
                {m === "edit" ? <Edit3 size={11} /> : <Eye size={11} />}
                {m === "edit" ? "Edit" : "Preview"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="note-editor-body" style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {mode === "edit" ? (
          <textarea
            className="note-editor-content"
            value={note.body}
            onChange={(e) => onUpdate(note.id, { body: e.target.value })}
            placeholder="Paste or type your notes here... (Markdown supported)"
            style={{
              width: "100%",
              height: "100%",
              background: "var(--bg-base)",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: 14,
              lineHeight: 1.8,
              padding: "24px 28px",
              resize: "none",
              outline: "none",
              fontFamily: "var(--font-body)",
            }}
          />
        ) : (
          <div
            className="note-editor-preview"
            style={{
              height: "100%",
              overflowY: "auto",
              padding: "24px 28px",
              background: "var(--bg-base)",
            }}
          >
            <div className="prose-note">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.body || "*Nothing to preview yet. Switch to Edit mode.*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div
        className="note-editor-toolbar"
        style={{
          padding: "12px 20px",
          borderTop: "1px solid var(--border-soft)",
          background: "var(--bg-surface)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        <ToolBtn
          icon={copied ? <Check size={12} /> : <Copy size={12} />}
          label={copied ? "Copied!" : "Copy"}
          onClick={handleCopy}
          accent={copied}
        />
        <ToolBtn
          icon={<FileText size={12} />}
          label="Export TXT"
          onClick={handleExportTxt}
        />
        <ToolBtn
          icon={<BookOpen size={12} />}
          label="Export PDF"
          onClick={handleExportPdf}
        />
        <ToolBtn
          icon={<Layers size={12} />}
          label={generatingCards ? "Generating..." : "Flashcards"}
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
          active={note.pinned}
        />
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

function ToolBtn({
  icon,
  label,
  onClick,
  accent,
  active,
  danger,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        borderRadius: 8,
        border: `1px solid ${active ? "var(--accent-mid)" : danger ? "rgba(220,38,38,0.2)" : "var(--border-soft)"}`,
        background: accent
          ? "var(--accent-soft)"
          : active
            ? "var(--accent-soft)"
            : "transparent",
        color: danger
          ? "#dc2626"
          : active || accent
            ? "var(--accent)"
            : "var(--text-secondary)",
        fontSize: 11,
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s",
        letterSpacing: "0.3px",
      }}
      onMouseOver={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = danger
            ? "rgba(251,113,133,0.14)"
            : "var(--bg-subtle)";
          e.currentTarget.style.borderColor = danger
            ? "rgba(251,113,133,0.42)"
            : "var(--border-mid)";
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background =
          accent || active ? "var(--accent-soft)" : "transparent";
        e.currentTarget.style.borderColor = active
          ? "var(--accent-mid)"
          : danger
            ? "rgba(220,38,38,0.2)"
            : "var(--border-soft)";
      }}
    >
      {icon} {label}
    </button>
  );
}
