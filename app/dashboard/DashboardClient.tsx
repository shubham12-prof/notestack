"use client";
import { useState, useEffect, useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";
import { TagType } from "@/lib/types";
import Sidebar from "@/components/Sidebar";
import NoteCard from "@/components/NoteCard";
import NoteEditor from "@/components/NoteEditor";
import NewNoteModal from "@/components/NewNoteModal";
import { Search, Plus, AlignLeft } from "lucide-react";

export default function Home() {
  const {
    notes,
    loaded,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    duplicateNote,
  } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<TagType | "all" | "pinned">("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "alpha">(
    "newest",
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        setShowModal(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    let arr = [...notes];
    if (activeTag === "pinned") arr = arr.filter((n) => n.pinned);
    else if (activeTag !== "all") arr = arr.filter((n) => n.tag === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (n) =>
          n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
      );
    }
    if (sortOrder === "newest") arr.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sortOrder === "oldest")
      arr.sort((a, b) => a.updatedAt - b.updatedAt);
    else arr.sort((a, b) => a.title.localeCompare(b.title));
    arr.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    return arr;
  }, [notes, activeTag, search, sortOrder]);

  const currentSelectedId = selectedId ?? notes[0]?.id ?? null;
  const selectedNote = notes.find((n) => n.id === currentSelectedId);

  const handleCreate = (title: string, body: string, tag: TagType) => {
    const note = createNote(title, body, tag);
    setSelectedId(note.id);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (currentSelectedId === id) {
      const next = notes.find((n) => n.id !== id);
      setSelectedId(next?.id ?? null);
    }
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateNote(id);
    if (copy) setSelectedId(copy.id);
  };

  if (!loaded) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 800,
              color: "var(--accent)",
              marginBottom: 8,
            }}
          >
            NeuroNote
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Loading your knowledge base...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      <Sidebar
        notes={notes}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        onNewNote={() => setShowModal(true)}
      />

      {/* Notes List Panel */}
      <div
        style={{
          width: 300,
          minWidth: 260,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--border-soft)",
          background: "var(--bg-base)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid var(--border-soft)",
            background: "var(--bg-surface)",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", marginBottom: 10 }}>
            <Search
              size={13}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-faint)",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              style={{
                width: "100%",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-soft)",
                borderRadius: 10,
                color: "var(--text-primary)",
                fontSize: 12,
                padding: "8px 12px 8px 32px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--accent-mid)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-soft)")
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {filtered.length} {filtered.length === 1 ? "note" : "notes"}
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {(["newest", "oldest", "alpha"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortOrder(s)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 6,
                    border: `1px solid ${sortOrder === s ? "var(--accent-mid)" : "var(--border-soft)"}`,
                    background:
                      sortOrder === s ? "var(--accent-soft)" : "transparent",
                    color:
                      sortOrder === s ? "var(--accent)" : "var(--text-muted)",
                    fontSize: 10,
                    fontWeight: sortOrder === s ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {s === "newest" ? "New" : s === "oldest" ? "Old" : "A–Z"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 80px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-faint)",
              }}
            >
              <AlignLeft size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
              <p style={{ fontSize: 12 }}>
                {search ? "No notes match your search." : "No notes yet."}
              </p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  marginTop: 12,
                  background: "var(--accent-soft)",
                  border: "1px solid var(--accent-mid)",
                  color: "var(--accent)",
                  padding: "7px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                + Create one
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  selected={currentSelectedId === note.id}
                  onClick={() => setSelectedId(note.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div
          style={{ position: "absolute", bottom: 20, right: 16, zIndex: 50 }}
        >
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--accent)",
              border: "none",
              boxShadow: "0 4px 16px rgba(91,76,245,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 6px 24px rgba(91,76,245,0.45)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(91,76,245,0.35)";
            }}
          >
            <Plus size={18} color="white" />
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {selectedNote ? (
          <NoteEditor
            key={selectedNote.id}
            note={selectedNote}
            onUpdate={updateNote}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onTogglePin={togglePin}
          />
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-faint)",
              gap: 16,
              background: "var(--bg-base)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Search size={24} color="var(--accent)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 6,
                }}
              >
                Select a note
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Choose from the list or create a new one
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
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
              }}
            >
              + New Note
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <NewNoteModal
          onSave={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
