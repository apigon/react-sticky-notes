import { createContext, type RefObject } from "react";
import type { Note, Position } from "../types";

export interface NotesContextValue {
  notes: Note[];
  addNote: (position: Position) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  bringToFront: (id: string) => void;
  draggingNoteId: string | null;
  setDraggingNoteId: (id: string | null) => void;
  trashZoneRef: RefObject<HTMLDivElement | null>;
  isOverTrash: boolean;
  setIsOverTrash: (value: boolean) => void;
}

export const NotesContext = createContext<NotesContextValue | undefined>(
  undefined
);
