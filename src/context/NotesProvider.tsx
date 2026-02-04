import { useState, useCallback, useRef, type ReactNode } from "react";
import type { Note, Position } from "../types";
import { NotesContext } from "./NotesContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [notes, setNotes] = useLocalStorage<Note[]>("sticky-notes", []);
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashZoneRef = useRef<HTMLDivElement | null>(null);

  // z-index is used for stacking notes, on drag/edit/resize note is brought to top
  const nextZIndex = useRef(
    notes.length > 0 ? Math.max(...notes.map((n) => n.zIndex)) + 1 : 10,
  );

  const addNote = useCallback(
    (position: Position) => {
      const newNote: Note = {
        id: crypto.randomUUID(),
        content: "",
        position,
        size: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
        zIndex: nextZIndex.current++,
        color: "yellow",
      };
      setNotes((prev) => [...prev, newNote]);
    },
    [setNotes],
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updates } : note)),
      );
    },
    [setNotes],
  );

  const bringToFront = useCallback(
    (id: string) => {
      const newZ = nextZIndex.current++;
      updateNote(id, { zIndex: newZ });
    },
    [updateNote],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes],
  );

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        bringToFront,
        draggingNoteId,
        setDraggingNoteId,
        trashZoneRef,
        isOverTrash,
        setIsOverTrash,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
