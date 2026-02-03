import { useState } from 'react';
import styles from './TrashZone.module.css';

interface TrashZoneProps {
  onDelete: (id: string) => void;
}

export function TrashZone({ onDelete }: TrashZoneProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const noteId = e.dataTransfer.getData('text/plain');
    if (noteId) {
      onDelete(noteId);
    }
  };

  return (
    <div
      className={`${styles.trashZone} ${isOver ? styles.active : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="trash-zone"
    >
      <span className={styles.icon}>🗑️</span>
      <span className={styles.label}>Drop to delete</span>
    </div>
  );
}
