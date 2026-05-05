"use client";
import { useState, useEffect } from "react";
import { TagType, TAG_META } from "@/lib/types";
import { X, Sparkles } from "lucide-react";

interface NewNoteModalProps {
  onSave: (title: string, body: string, tag: TagType) => void;
  onClose: () => void;
}

export default function NewNoteModal({ onSave, onClose }: NewNoteModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<TagType>("general");
  const tags = Object.keys(TAG_META) as TagType[];

  useEffect(() => {
    const el = document.getElementById("modal-title-input");
    if (el) el.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSave = () => {
    if (!body.trim() && !title.trim()) return;
    onSave(title, body, tag);
    onClose();
  };

  const meta = TAG_META[tag];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,24,48,0.55)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 20,
          width: 540,
          maxWidth: "92vw",
          padding: 32,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-soft)",
          animation: "fadeUp 0.3s ease",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={15} color="var(--accent)" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                New Note
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Markdown supported
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 6,
              borderRadius: 8,
              transition: "all 0.15s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--bg-subtle)")
            }
            onMouseOut={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={18} />
          </button>
        </div>

        <input
          id="modal-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          style={{
            width: "100%",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-soft)",
            borderRadius: 12,
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 600,
            padding: "11px 14px",
            outline: "none",
            marginBottom: 12,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent-mid)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
        />

        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          {tags.map((t) => {
            const m = TAG_META[t];
            return (
              <button
                key={t}
                onClick={() => setTag(t)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: tag === t ? m.bg : "transparent",
                  border: `1px solid ${tag === t ? m.border : "var(--border-soft)"}`,
                  color: tag === t ? m.color : "var(--text-muted)",
                  fontSize: 11,
                  fontWeight: tag === t ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Paste your notes here... (Markdown supported)"
          rows={8}
          style={{
            width: "100%",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-soft)",
            borderRadius: 12,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            lineHeight: 1.7,
            padding: "12px 14px",
            resize: "vertical",
            outline: "none",
            marginBottom: 20,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent-mid)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
        />

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--border-mid)",
              color: "var(--text-secondary)",
              padding: "10px 20px",
              borderRadius: 10,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "var(--bg-subtle)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: "var(--accent)",
              border: "none",
              color: "white",
              padding: "10px 24px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.3px",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#4a3ce0")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "var(--accent)")
            }
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
