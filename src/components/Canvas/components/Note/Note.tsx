import { useRef, useEffect, type ChangeEvent, type PointerEvent } from "react";
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
  const { updateNote, bringToFront, dragState, setDragState, lastCreatedNoteId } = useNotes();
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isResizing = useRef(false);
  const resizeState = useRef<ResizeState | null>(null);

  useEffect(() => {
    if (note.id === lastCreatedNoteId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [note.id, lastCreatedNoteId]);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
  };

  const handleResizePointerDown =
    (direction: ResizeDirection) => (e: PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);

      isResizing.current = true;
      setDragState({ noteId: note.id, isResize: true });
      bringToFront(note.id);

      resizeState.current = {
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
    };

  const handleResizePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isResizing.current || !resizeState.current) return;

    const result = calculateResize(resizeState.current, e.clientX, e.clientY);
    updateNote(note.id, result);
  };

  const handleResizePointerUp = () => {
    if (!isResizing.current) return;

    isResizing.current = false;
    resizeState.current = null;
    setDragState(null);
  };

  const resizeHandleProps = (direction: ResizeDirection) => ({
    onPointerDown: handleResizePointerDown(direction),
    onPointerMove: handleResizePointerMove,
    onPointerUp: handleResizePointerUp,
  });

  const isDragging = dragState?.noteId === note.id && !dragState.isResize;

  return (
    <div
      ref={noteRef}
      className={`${styles.note} ${isDragging ? styles.dragging : ""}`}
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
        ref={textareaRef}
        className={styles.content}
        value={note.content}
        onChange={handleContentChange}
        onFocus={() => bringToFront(note.id)}
        placeholder="Type your note..."
        data-testid="note-content"
      />
      {/* Edge resize zones */}
      <div className={styles.resizeN} {...resizeHandleProps("n")} />
      <div className={styles.resizeS} {...resizeHandleProps("s")} />
      <div className={styles.resizeE} {...resizeHandleProps("e")} />
      <div className={styles.resizeW} {...resizeHandleProps("w")} />
      {/* Corner resize zones */}
      <div className={styles.resizeNE} {...resizeHandleProps("ne")} />
      <div className={styles.resizeNW} {...resizeHandleProps("nw")} />
      <div
        className={styles.resizeSE}
        {...resizeHandleProps("se")}
        data-testid="resize-handle"
      />
      <div className={styles.resizeSW} {...resizeHandleProps("sw")} />
    </div>
  );
}
