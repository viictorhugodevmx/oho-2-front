import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <span className={styles.code}>Error 404</span>

        <p className={styles.number} aria-hidden="true">
          404
        </p>

        <h1>Esta página salió del encuadre.</h1>

        <p className={styles.description}>
          La dirección que buscas no existe, cambió de lugar o
          ya no está disponible.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Volver al inicio
            <span aria-hidden="true">→</span>
          </Link>

          <Link
            href="/products"
            className={styles.secondaryButton}
          >
            Explorar productos
          </Link>
        </div>
      </section>
    </main>
  );
}
