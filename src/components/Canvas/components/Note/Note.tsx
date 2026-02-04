import { useRef, type ChangeEvent, type MouseEvent } from "react";
import type { Note as NoteType } from "../../../../types";
import { useNotes } from "../../../../hooks/useNotes";
import { NoteHeader } from "./components/NoteHeader";
import { NOTE_COLORS } from "./colors";
import styles from "./Note.module.css";
import {
  calculateResize,
  type ResizeDirection,
  type ResizeState,
} from "./utils";

interface NoteProps {
  note: NoteType;
}

export function Note({ note }: NoteProps) {
  const { updateNote, bringToFront, setDraggingNoteId } = useNotes();
  const noteRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);

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
        noteId={note.id}
        color={note.color}
        noteRef={noteRef}
        isResizing={isResizing}
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
