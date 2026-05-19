"use client";
import { Note, TAG_META } from "@/lib/types";
import { Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  selected: boolean;
  onClick: () => void;
}

export default function NoteCard({ note, selected, onClick }: NoteCardProps) {
  const meta = TAG_META[note.tag];
  const preview = note.body
    .replace(/[#*`>\-]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 120);
  const timeAgo = formatDistanceToNow(note.updatedAt, { addSuffix: true });

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? "var(--accent-soft)" : "var(--bg-surface)",
        border: `1px solid ${selected ? "var(--accent-mid)" : "var(--border-soft)"}`,
        borderRadius: 14,
        padding: "14px 16px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: selected
          ? "0 0 0 2px var(--accent-glow)"
          : "var(--shadow-sm)",
        animation: "fadeUp 0.3s ease forwards",
      }}
      onMouseOver={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border-mid)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseOut={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--border-soft)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: meta.color,
          opacity: 0.6,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 600,
            color: selected ? "var(--accent)" : "var(--text-primary)",
            flex: 1,
            lineHeight: 1.4,
            wordBreak: "break-word",
          }}
        >
          {note.title || "Untitled"}
        </span>
        {note.pinned && (
          <Pin
            size={11}
            color={meta.color}
            style={{ flexShrink: 0, marginTop: 2 }}
          />
        )}
      </div>

      {preview && (
        <p
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 10,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {preview}
        </p>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            padding: "2px 8px",
            borderRadius: 5,
            background: meta.bg,
            color: meta.color,
            border: `1px solid ${meta.border}`,
          }}
        >
          {meta.label}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
          {timeAgo}
        </span>
      </div>
    </div>
  );
}
