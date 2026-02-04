import { useNotes } from "../../hooks/useNotes";
import styles from "./DeleteZone.module.css";

export function DeleteZone() {
  const {
    draggingNoteId,
    deleteZoneRef: deleteZoneRef,
    isOverTrash,
  } = useNotes();

  const isActive = draggingNoteId !== null && isOverTrash;

  return (
    <div
      ref={deleteZoneRef}
      className={`${styles.trashZone} ${isActive ? styles.active : ""}`}
      data-testid="trash-zone"
    >
      <span className={styles.icon}>🗑️</span>
      <span className={styles.label}>Drop to delete</span>
    </div>
  );
}
