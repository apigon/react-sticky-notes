import type { MouseEvent } from "react";
import type { NoteColor } from "../../../../types";
import { NOTE_COLORS, COLOR_ORDER } from "../../../../constants/colors";
import styles from "./NoteHeader.module.css";

interface NoteHeaderProps {
  color: NoteColor;
  onDragStart: (e: MouseEvent<HTMLDivElement>) => void;
  onColorChange: (color: NoteColor) => void;
  onDelete: () => void;
}

export function NoteHeader({
  color,
  onDragStart,
  onColorChange,
  onDelete,
}: NoteHeaderProps) {
  const handleColorCycle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const currentIndex = COLOR_ORDER.indexOf(color);
    const nextIndex = (currentIndex + 1) % COLOR_ORDER.length;
    onColorChange(COLOR_ORDER[nextIndex]);
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className={styles.noteHeader}
      onMouseDown={onDragStart}
      data-testid="note-header"
    >
      <button
        className={styles.colorButton}
        onClick={handleColorCycle}
        style={{ backgroundColor: NOTE_COLORS[color].border }}
        data-testid="color-button"
        aria-label="Change color"
      />
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        data-testid="delete-button"
        aria-label="Delete note"
      >
        🗑️
      </button>
    </div>
  );
}
