import type { ReactNode } from "react";
import styles from "./empty-state.module.css";

interface EmptyStateProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  eyebrow = "OHO 2.0",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className={styles.container}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  );
}
