import { useRef, type ChangeEvent, type MouseEvent } from "react";
import type { Note as NoteType } from "../../../../types";
import { useNotes } from "../../../../hooks/useNotes";
import { NoteHeader } from "./components/NoteHeader";
import { NOTE_COLORS } from "./colors";
import styles from "./Note.module.css";
import {
  calculateResize,
  checkDeleteZoneIntersection,
  type ResizeDirection,
  type ResizeState,
} from "./utils";

interface NoteProps {
  note: NoteType;
}

export function Note({ note }: NoteProps) {
  const {
    updateNote,
    deleteNote,
    bringToFront,
    setDraggingNoteId,
    deleteZoneRef,
    setIsOverTrash,
  } = useNotes();
  const noteRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const isDragging = useRef(false);

  const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
    if (isResizing.current) {
      return;
    }

    e.preventDefault();
    isDragging.current = true;
    setDraggingNoteId(note.id);
    bringToFront(note.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = note.position.x;
    const startPosY = note.position.y;

    const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      updateNote(note.id, {
        position: {
          x: startPosX + deltaX,
          y: startPosY + deltaY,
        },
      });

      setIsOverTrash(checkDeleteZoneIntersection(noteRef, deleteZoneRef));
    };

    const handleMouseUp = () => {
      const shouldDelete = checkDeleteZoneIntersection(noteRef, deleteZoneRef);
      isDragging.current = false;

      setDraggingNoteId(null);
      setIsOverTrash(false);

      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (shouldDelete) {
        deleteNote(note.id);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  const handleResizeStart =
    (direction: ResizeDirection) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      setDraggingNoteId(note.id);
      bringToFront(note.id);

      const resizeState: ResizeState = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: note.size.width,
        startHeight: note.size.height,
        startPosX: note.position.x,
        startPosY: note.position.y,
        resizesNorth: direction.includes("n"),
        resizesSouth: direction.includes("s"),
        resizesEast: direction.includes("e"),
        resizesWest: direction.includes("w"),
      };

      const handleMouseMove = (moveEvent: globalThis.MouseEvent) => {
        const result = calculateResize(
          resizeState,
          moveEvent.clientX,
          moveEvent.clientY,
        );
        updateNote(note.id, result);
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        setDraggingNoteId(null);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

  return (
    <div
      ref={noteRef}
      className={styles.note}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        zIndex: note.zIndex,
        backgroundColor: NOTE_COLORS[note.color].background,
        borderColor: NOTE_COLORS[note.color].border,
      }}
      data-testid="note"
    >
      <NoteHeader
        color={note.color}
        onDragStart={handleDragStart}
        onColorChange={(color) => updateNote(note.id, { color })}
        onDelete={() => deleteNote(note.id)}
      />
      <textarea
        className={styles.content}
        value={note.content}
        onChange={handleContentChange}
        onFocus={() => bringToFront(note.id)}
        placeholder="Type your note..."
        data-testid="note-content"
      />
      {/* Edge resize zones */}
      <div className={styles.resizeN} onMouseDown={handleResizeStart("n")} />
      <div className={styles.resizeS} onMouseDown={handleResizeStart("s")} />
      <div className={styles.resizeE} onMouseDown={handleResizeStart("e")} />
      <div className={styles.resizeW} onMouseDown={handleResizeStart("w")} />
      {/* Corner resize zones */}
      <div className={styles.resizeNE} onMouseDown={handleResizeStart("ne")} />
      <div className={styles.resizeNW} onMouseDown={handleResizeStart("nw")} />
      <div
        className={styles.resizeSE}
        onMouseDown={handleResizeStart("se")}
        data-testid="resize-handle"
      />
      <div className={styles.resizeSW} onMouseDown={handleResizeStart("sw")} />
    </div>
  );
}
