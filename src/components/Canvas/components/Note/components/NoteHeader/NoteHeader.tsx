import {
  useRef,
  type PointerEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import type { NoteColor } from "../../../../../../types";
import { useNotes } from "../../../../../../hooks/useNotes";
import { NOTE_COLORS, COLOR_ORDER } from "../../colors";
import { checkDeleteZoneIntersection } from "./utils";
import styles from "./NoteHeader.module.css";

interface NoteHeaderProps {
  noteId: string;
  color: NoteColor;
  noteRef: RefObject<HTMLDivElement | null>;
  isResizing: RefObject<boolean>;
}

export function NoteHeader({
  noteId,
  color,
  noteRef,
  isResizing,
}: NoteHeaderProps) {
  const {
    notes,
    updateNote,
    deleteNote,
    bringToFront,
    setDraggingNoteId,
    deleteZoneRef,
    setIsOverTrash,
  } = useNotes();

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isResizing.current) return;

    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;

    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: note.position.x,
      posY: note.position.y,
    };

    setDraggingNoteId(noteId);
    bringToFront(noteId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;

    updateNote(noteId, {
      position: {
        x: dragStart.current.posX + deltaX,
        y: dragStart.current.posY + deltaY,
      },
    });

    setIsOverTrash(checkDeleteZoneIntersection(noteRef, deleteZoneRef));
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    const shouldDelete = checkDeleteZoneIntersection(noteRef, deleteZoneRef);
    setDraggingNoteId(null);
    setIsOverTrash(false);

    if (shouldDelete) {
      deleteNote(noteId);
    }
  };

  const handleColorCycle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const currentIndex = COLOR_ORDER.indexOf(color);
    const nextIndex = (currentIndex + 1) % COLOR_ORDER.length;
    updateNote(noteId, { color: COLOR_ORDER[nextIndex] });
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteNote(noteId);
  };

  return (
    <div
      className={styles.noteHeader}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid="note-header"
    >
      <button
        className={styles.colorButton}
        onClick={handleColorCycle}
        style={{ backgroundColor: NOTE_COLORS[color].border }}
        data-testid="color-button"
        aria-label="Change color"
      />
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        data-testid="delete-button"
        aria-label="Delete note"
      >
        🗑️
      </button>
    </div>
  );
}
