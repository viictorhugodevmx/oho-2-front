import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import styles from "./register.module.css";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea una cuenta mock en OHO 2.0 para guardar tu sesión y realizar pedidos.",
};

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <section className={styles.introduction}>
        <span className={styles.eyebrow}>Cuenta OHO</span>

        <h1>Únete al movimiento.</h1>

        <p>
          Crea tu cuenta para preparar tus piezas, conservar tu sesión
          y continuar con tus pedidos.
        </p>

        <div className={styles.note}>
          <strong>Demo local</strong>

          <span>
            Tus datos se guardan únicamente en el almacenamiento local
            de este navegador.
          </span>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formHeading}>
          <span>Registro</span>
          <h2>Crea tu cuenta.</h2>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
