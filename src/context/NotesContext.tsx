import { createContext, type RefObject } from "react";
import type { Note, Position } from "../types";

export interface DragState {
  noteId: string;
  isResize: boolean;
}

export interface NotesContextValue {
  notes: Note[];
  addNote: (position: Position) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  bringToFront: (id: string) => void;
  dragState: DragState | null;
  setDragState: (state: DragState | null) => void;
  deleteZoneRef: RefObject<HTMLDivElement | null>;
  isOverTrash: boolean;
  setIsOverTrash: (value: boolean) => void;
  lastCreatedNoteId: string | null;
  clearLastCreatedNoteId: () => void;
}

export const NotesContext = createContext<NotesContextValue | undefined>(
  undefined,
);
