"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/auth-context";
import styles from "./register.module.css";

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM: RegisterFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterFormState>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof RegisterFormState,
    value: string,
  ): void {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      router.push("/");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible crear la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="register-name">Nombre completo</label>

        <input
          id="register-name"
          name="name"
          type="text"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          minLength={2}
          autoComplete="name"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="register-email">Correo electrónico</label>

        <input
          id="register-email"
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          autoComplete="email"
          placeholder="nombre@correo.com"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="register-password">Contraseña</label>

        <input
          id="register-password"
          name="password"
          type="password"
          value={form.password}
          onChange={(event) =>
            updateField("password", event.target.value)
          }
          minLength={8}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          required
        />

        <small>Utiliza al menos 8 caracteres.</small>
      </div>

      <div className={styles.field}>
        <label htmlFor="register-confirm-password">
          Confirmar contraseña
        </label>

        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          minLength={8}
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          required
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        <span>
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </span>

        <span aria-hidden="true">→</span>
      </button>

      <p className={styles.loginPrompt}>
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}
