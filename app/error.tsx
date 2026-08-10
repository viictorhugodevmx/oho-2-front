"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error("OHO application error:", error);
  }, [error]);

  return (
    <main className={styles.page}>
      <section
        className={styles.content}
        role="alert"
        aria-live="assertive"
      >
        <span className={styles.eyebrow}>Error OHO</span>

        <p className={styles.number} aria-hidden="true">
          !
        </p>

        <h1>Algo salió fuera de cuadro.</h1>

        <p className={styles.description}>
          No pudimos mostrar esta sección correctamente. Puedes
          intentarlo otra vez o volver al inicio.
        </p>

        {error.digest ? (
          <small className={styles.reference}>
            Referencia: {error.digest}
          </small>
        ) : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={reset}
          >
            Intentar nuevamente
            <span aria-hidden="true">↻</span>
          </button>

          <Link
            href="/"
            className={styles.secondaryButton}
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
