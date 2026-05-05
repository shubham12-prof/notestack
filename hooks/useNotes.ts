"use client";
import { useState, useEffect, useCallback } from "react";
import { Note, TagType, SAMPLE_NOTES } from "@/lib/types";

const STORAGE_KEY = "neuronote_v2";

function loadInitialNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Note[];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_NOTES));
    return SAMPLE_NOTES;
  } catch {
    return SAMPLE_NOTES;
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setNotes(loadInitialNotes());
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  const persist = useCallback((next: Note[]) => {
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const createNote = useCallback(
    (title: string, body: string, tag: TagType): Note => {
      const note: Note = {
        id: Date.now().toString(),
        title: title || "Untitled",
        body,
        tag,
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      persist([note, ...notes]);
      return note;
    },
    [notes, persist],
  );

  const updateNote = useCallback(
    (id: string, patch: Partial<Note>) => {
      persist(
        notes.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
        ),
      );
    },
    [notes, persist],
  );

  const deleteNote = useCallback(
    (id: string) => {
      persist(notes.filter((n) => n.id !== id));
    },
    [notes, persist],
  );

  const togglePin = useCallback(
    (id: string) => {
      persist(
        notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
      );
    },
    [notes, persist],
  );

  const duplicateNote = useCallback(
    (id: string): Note | null => {
      const original = notes.find((n) => n.id === id);
      if (!original) return null;
      const copy: Note = {
        ...original,
        id: Date.now().toString(),
        title: original.title + " (copy)",
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      persist([copy, ...notes]);
      return copy;
    },
    [notes, persist],
  );

  return {
    notes,
    loaded,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    duplicateNote,
  };
}
