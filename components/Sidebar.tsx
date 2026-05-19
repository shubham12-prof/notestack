"use client";
import { Note, TagType, TAG_META } from "@/lib/types";
import { signOut } from "next-auth/react";
import { Pin, Hash, BarChart2, Lightbulb, Zap, LogOut } from "lucide-react";

interface SidebarProps {
  notes: Note[];
  activeTag: TagType | "all" | "pinned";
  onTagChange: (tag: TagType | "all" | "pinned") => void;
  onNewNote: () => void;
}

export default function Sidebar({
  notes,
  activeTag,
  onTagChange,
  onNewNote,
}: SidebarProps) {
  const totalWords = notes.reduce(
    (a, n) => a + (n.body || "").split(/\s+/).filter(Boolean).length,
    0,
  );
  const pinned = notes.filter((n) => n.pinned).length;
  const tags = Object.keys(TAG_META) as TagType[];

  return (
    <aside
      className="app-sidebar"
      style={{
        width: 220,
        minWidth: 220,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-soft)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        overflowY: "auto",
        gap: 0,
      }}
    >
      <div
        style={{
          padding: "0 20px 24px",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--accent)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              background: "var(--accent)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={14} color="white" />
          </span>
          NeuroNote
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            marginTop: 4,
            letterSpacing: "0.5px",
          }}
        >
          Knowledge OS
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "1.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Overview
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            {
              icon: <Hash size={12} />,
              label: "Total Notes",
              value: notes.length,
            },
            {
              icon: <BarChart2 size={12} />,
              label: "Total Words",
              value: totalWords.toLocaleString(),
            },
            { icon: <Pin size={12} />, label: "Pinned", value: pinned },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text-muted)",
                  fontSize: 12,
                }}
              >
                {s.icon} {s.label}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px", flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "1.5px",
            color: "var(--text-muted)",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Filter
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FilterChip
            label="All Notes"
            count={notes.length}
            active={activeTag === "all"}
            color="var(--accent)"
            bg="var(--accent-soft)"
            onClick={() => onTagChange("all")}
            dot="var(--accent)"
          />

          <FilterChip
            label="Pinned"
            count={pinned}
            active={activeTag === "pinned"}
            color="#fbbf24"
            bg="rgba(251,191,36,0.12)"
            onClick={() => onTagChange("pinned")}
            dot="#fbbf24"
          />

          <div
            style={{
              height: 1,
              background: "var(--border-soft)",
              margin: "8px 0",
            }}
          />
          {tags.map((tag) => {
            const meta = TAG_META[tag];
            const count = notes.filter((n) => n.tag === tag).length;
            return (
              <FilterChip
                key={tag}
                label={meta.label}
                count={count}
                active={activeTag === tag}
                color={meta.color}
                bg={meta.bg}
                onClick={() => onTagChange(tag)}
                dot={meta.color}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-soft)",
        }}
      >
        <button
          onClick={onNewNote}
          style={{
            width: "100%",
            background: "var(--accent)",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "10px 0",
            fontFamily: "var(--font-display)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#4a3ce0")}
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "var(--accent)")
          }
        >
          <Lightbulb size={14} /> New Note
        </button>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-faint)",
            textAlign: "center",
            marginTop: 6,
          }}
        >
          Ctrl+N
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            width: "100%",
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-soft)",
            borderRadius: 10,
            padding: "9px 0",
            marginTop: 12,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "var(--bg-subtle)";
            e.currentTarget.style.borderColor = "var(--border-mid)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border-soft)";
          }}
        >
          <LogOut size={13} /> Logout
        </button>
      </div>
    </aside>
  );
}

function FilterChip({
  label,
  count,
  active,
  color,
  bg,
  onClick,
  dot,
}: {
  label: string;
  count: number;
  active: boolean;
  color: string;
  bg: string;
  onClick: () => void;
  dot: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderRadius: 8,
        border: "none",
        background: active ? bg : "transparent",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "all 0.15s",
      }}
      onMouseOver={(e) => {
        if (!active) e.currentTarget.style.background = "var(--bg-subtle)";
      }}
      onMouseOut={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 13,
          flex: 1,
          color: active ? color : "var(--text-secondary)",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: active ? color : "var(--text-faint)",
          fontWeight: 500,
        }}
      >
        {count}
      </span>
    </button>
  );
}
