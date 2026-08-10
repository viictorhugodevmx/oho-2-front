import styles from "./loading-state.module.css";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({
  label = "Cargando contenido",
}: LoadingStateProps) {
  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
    >
      <span className={styles.loader} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
