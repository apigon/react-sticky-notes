import type { MouseEvent } from "react";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "./components/Note";
import { DeleteZone } from "../DeleteZone/DeleteZone";
import styles from "./Canvas.module.css";

export function Canvas() {
  const { notes, addNote, dragState, lastCreatedNoteId, clearLastCreatedNoteId } = useNotes();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // if clicked on empty part of canvas and currently not dragging/resizing note
    if (e.target === e.currentTarget && dragState === null) {
      // If a note was just created, clicking outside should blur it without creating a new note
      if (lastCreatedNoteId) {
        clearLastCreatedNoteId();
        return;
      }
      addNote({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className={styles.canvas} onClick={handleClick} data-testid="canvas">
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      <DeleteZone />
    </div>
  );
}
