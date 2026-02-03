import { useState, useCallback } from 'react';
import type { MouseEvent } from 'react';
import type { Note as NoteType, Position } from '../../types';
import { Note } from '../Note/Note';
import { TrashZone } from '../TrashZone/TrashZone';
import styles from './Canvas.module.css';

const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

export function Canvas() {
  const [notes, setNotes] = useState<NoteType[]>([]);

  const addNote = useCallback((position: Position) => {
    const newNote: NoteType = {
      id: crypto.randomUUID(),
      content: '',
      position,
      size: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
    };
    setNotes((prev) => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<NoteType>) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

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
        <Note key={note.id} note={note} onUpdate={updateNote} />
      ))}
      <TrashZone onDelete={deleteNote} />
    </div>
  );
}
