import type { MouseEvent } from 'react';
import { useNotes } from '../../hooks/useNotes';
import { Note } from '../Note/Note';
import { TrashZone } from '../TrashZone/TrashZone';
import styles from './Canvas.module.css';

export function Canvas() {
  const { notes, addNote, updateNote } = useNotes();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      addNote({ x: e.clientX, y: e.clientY });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('text/plain');
    const offsetX = parseFloat(e.dataTransfer.getData('offsetX')) || 0;
    const offsetY = parseFloat(e.dataTransfer.getData('offsetY')) || 0;

    if (noteId) {
      updateNote(noteId, {
        position: {
          x: e.clientX - offsetX,
          y: e.clientY - offsetY,
        },
      });
    }
  };

  return (
    <div
      className={styles.canvas}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-testid="canvas"
    >
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      <TrashZone />
    </div>
  );
}
