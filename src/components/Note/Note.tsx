import type { DragEvent, ChangeEvent } from "react";
import type { Note as NoteType } from "../../types";
import { useNotes } from "../../hooks/useNotes";
import styles from "./Note.module.css";

interface NoteProps {
  note: NoteType;
}

export function Note({ note }: NoteProps) {
  const { updateNote } = useNotes();

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.setData("text/plain", note.id);
    e.dataTransfer.setData("offsetX", String(e.clientX - rect.left));
    e.dataTransfer.setData("offsetY", String(e.clientY - rect.top));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNote(note.id, { content: e.target.value });
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
    </div>
  );
}
