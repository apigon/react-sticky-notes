import {
  useRef,
  type DragEvent,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import type { Note as NoteType } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import styles from "./Note.module.css";
import {
  calculateResize,
  type ResizeDirection,
  type ResizeState,
} from "./resize";

interface NoteProps {
  note: NoteType;
}

export function Note({ note }: NoteProps) {
  const { updateNote } = useNotes();
  const isResizing = useRef(false);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (isResizing.current) {
      e.preventDefault();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.setData("text/plain", note.id);
    e.dataTransfer.setData("offsetX", String(e.clientX - rect.left));
    e.dataTransfer.setData("offsetY", String(e.clientY - rect.top));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  const handleResizeStart =
    (direction: ResizeDirection) => (e: MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;

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
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

  return (
    <div
      className={styles.note}
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
      }}
      draggable
      onDragStart={handleDragStart}
      data-testid="note"
    >
      <textarea
        className={styles.content}
        value={note.content}
        onChange={handleContentChange}
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
