import type { MouseEvent } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useNotes } from "../../hooks/useNotes";
import { Note } from "./components/Note";
import { TrashZone } from "../TrashZone/TrashZone";
import { Tutorial } from "../Tutorial";
import styles from "./Canvas.module.css";

export function Canvas() {
  const { notes, addNote, draggingNoteId } = useNotes();
  const [tutorialSeen, setTutorialSeen] = useLocalStorage(
    "tutorialSeen",
    false,
  );

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
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
      {!tutorialSeen && <Tutorial onDismiss={() => setTutorialSeen(true)} />}
    </div>
  );
}
