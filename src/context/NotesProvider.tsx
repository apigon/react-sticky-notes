import { useState, useCallback, type ReactNode } from "react";
import type { Note, Position } from "../types";
import { NotesContext } from "./NotesContext";

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = useCallback((position: Position) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: "",
      position,
      size: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
    };
    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}
