import type { MouseEvent, RefObject } from "react";
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

  const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
    if (isResizing.current) {
      return;
    }

    e.preventDefault();
    setDraggingNoteId(noteId);
    bringToFront(noteId);

    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = note.position.x;
    const startPosY = note.position.y;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      updateNote(noteId, {
        position: {
          x: startPosX + deltaX,
          y: startPosY + deltaY,
        },
      });

      setIsOverTrash(checkDeleteZoneIntersection(noteRef, deleteZoneRef));
    };

    const handleMouseUp = () => {
      const shouldDelete = checkDeleteZoneIntersection(noteRef, deleteZoneRef);

      setDraggingNoteId(null);
      setIsOverTrash(false);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (shouldDelete) {
        deleteNote(noteId);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
      onMouseDown={handleDragStart}
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
