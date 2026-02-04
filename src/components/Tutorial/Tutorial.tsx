import styles from "./Tutorial.module.css";

interface TutorialProps {
  onDismiss: () => void;
}

export function Tutorial({ onDismiss }: TutorialProps) {
  return (
    <div className={styles.backdrop} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Welcome to Sticky Notes!</h2>
        <ul className={styles.list}>
          <li>Click anywhere to create a note</li>
          <li>Drag notes to the trash to delete</li>
          <li>Click text area to edit</li>
          <li>Click color circle in note header to change color</li>
          <li>Drag edges/corners to resize</li>
        </ul>
        <button className={styles.button} onClick={onDismiss}>
          Get Started
        </button>
      </div>
    </div>
  );
}
