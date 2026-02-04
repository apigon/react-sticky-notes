import { useNotes } from "../../hooks/useNotes";
import styles from "./TrashZone.module.css";

export function TrashZone() {
  const { draggingNoteId, trashZoneRef, isOverTrash } = useNotes();

  const isActive = draggingNoteId !== null && isOverTrash;

  return (
    <div
      ref={trashZoneRef}
      className={`${styles.trashZone} ${isActive ? styles.active : ""}`}
      data-testid="trash-zone"
    >
      <span className={styles.icon}>🗑️</span>
      <span className={styles.label}>Drop to delete</span>
    </div>
  );
}
