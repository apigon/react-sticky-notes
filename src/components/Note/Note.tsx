import type { DragEvent, ChangeEvent } from "react";
import type { Note as NoteType } from "../../types";
import styles from "./Note.module.css";

interface NoteProps {
  note: NoteType;
  onUpdate: (id: string, updates: Partial<NoteType>) => void;
}

export function Note({ note, onUpdate }: NoteProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.setData("text/plain", note.id);
    e.dataTransfer.setData("offsetX", String(e.clientX - rect.left));
    e.dataTransfer.setData("offsetY", String(e.clientY - rect.top));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(note.id, { content: e.target.value });
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
