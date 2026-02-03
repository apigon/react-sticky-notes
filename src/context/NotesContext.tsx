import { createContext } from "react";
import type { Note, Position } from "../types";

export interface NotesContextValue {
  notes: Note[];
  addNote: (position: Position) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextValue | undefined>(
  undefined
);
