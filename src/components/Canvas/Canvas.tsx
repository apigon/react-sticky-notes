import type { MouseEvent } from "react";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "./components/Note";
import { TrashZone } from "../TrashZone/TrashZone";
import styles from "./Canvas.module.css";

export function Canvas() {
  const { notes, addNote, draggingNoteId } = useNotes();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // if clicked on empty part of canvas and currently not dragging/resizing note add ne note
    if (e.target === e.currentTarget && draggingNoteId === null) {
      addNote({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className={styles.canvas} onClick={handleClick} data-testid="canvas">
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      <TrashZone />
    </div>
  );
}
