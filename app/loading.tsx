import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main
      className={styles.page}
      aria-live="polite"
      aria-busy="true"
    >
      <section className={styles.content}>
        <span className={styles.eyebrow}>
          OHO 2.0
        </span>

        <div className={styles.loader} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <h1>Cargando experiencia...</h1>

        <p>
          Estamos preparando el contenido para ti.
        </p>
      </section>
    </main>
  );
}
