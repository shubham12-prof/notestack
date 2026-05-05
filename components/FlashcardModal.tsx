"use client";
import { useState } from "react";
import { Flashcard } from "@/lib/types";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

interface FlashcardModalProps {
  cards: Flashcard[];
  noteTitle: string;
  onClose: () => void;
}

export default function FlashcardModal({
  cards,
  noteTitle,
  onClose,
}: FlashcardModalProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards.length) return null;

  const card = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,24,48,0.6)",
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
          width: 500,
          maxWidth: "90vw",
          padding: 32,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-soft)",
          animation: "fadeUp 0.3s ease",
        }}
      >
        {/* Header */}
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              Flashcards
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {noteTitle}
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              {index + 1} / {cards.length}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          style={{
            height: 3,
            background: "var(--bg-muted)",
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 10,
              background: "var(--accent)",
              width: `${progress}%`,
              transition: "width 0.3s",
            }}
          />
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            minHeight: 180,
            background: flipped ? "var(--accent)" : "var(--bg-subtle)",
            borderRadius: 16,
            padding: 28,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            border: `1px solid ${flipped ? "transparent" : "var(--border-soft)"}`,
            transition: "all 0.3s",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: flipped ? "rgba(255,255,255,0.7)" : "var(--text-muted)",
            }}
          >
            {flipped ? "✓ ANSWER" : "? QUESTION"}
          </span>
          <p
            style={{
              fontSize: 15,
              fontWeight: 500,
              textAlign: "center",
              lineHeight: 1.6,
              color: flipped ? "white" : "var(--text-primary)",
            }}
          >
            {flipped ? card.back : card.front}
          </p>
          <span
            style={{
              fontSize: 11,
              color: flipped ? "rgba(255,255,255,0.5)" : "var(--text-faint)",
            }}
          >
            tap to {flipped ? "hide" : "reveal"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <button
            onClick={() => {
              setIndex(Math.max(0, index - 1));
              setFlipped(false);
            }}
            disabled={index === 0}
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-soft)",
              borderRadius: 10,
              padding: "9px 16px",
              cursor: index === 0 ? "not-allowed" : "pointer",
              opacity: index === 0 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--text-secondary)",
              fontSize: 13,
            }}
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            onClick={() => {
              setIndex(0);
              setFlipped(false);
            }}
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-soft)",
              borderRadius: 10,
              padding: "9px 14px",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => {
              setIndex(Math.min(cards.length - 1, index + 1));
              setFlipped(false);
            }}
            disabled={index === cards.length - 1}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 10,
              padding: "9px 16px",
              cursor: index === cards.length - 1 ? "not-allowed" : "pointer",
              opacity: index === cards.length - 1 ? 0.4 : 1,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "white",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
