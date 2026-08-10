import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description:
    "Inicia sesión en OHO 2.0 para continuar con tus pedidos.",
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <span className={styles.eyebrow}>Cuenta OHO</span>

        <h1>Vuelve al movimiento.</h1>

        <p>
          Recupera tu sesión, continúa preparando tus piezas
          y consulta tus pedidos desde un mismo lugar.
        </p>

        <div className={styles.publicAccess}>
          <strong>La galería sigue abierta</strong>

          <span>
            Puedes explorar diseños y productos sin crear
            una cuenta.
          </span>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formHeading}>
          <span>Acceso</span>
          <h2>Inicia sesión.</h2>
        </div>

        <Suspense fallback={<p>Cargando acceso...</p>}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
