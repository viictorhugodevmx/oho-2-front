"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/features/auth/auth-context";
import styles from "./login.module.css";
import actions from "./login-actions.module.css";

interface LoginFormState {
  email: string;
  password: string;
}

const INITIAL_FORM: LoginFormState = {
  email: "",
  password: "",
};

function getSafeReturnTo(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginFormState>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  function updateField(
    field: keyof LoginFormState,
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
    setIsSubmitting(true);

    try {
      await login({
        email: form.email,
        password: form.password,
      });

      router.replace(returnTo);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="login-email">Correo electrónico</label>
        <input
          id="login-email"
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
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          minLength={8}
          autoComplete="current-password"
          placeholder="Tu contraseña"
          required
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">{error}</p>
      ) : null}

      <button
        type="submit"
        className={actions.primaryButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>

      {returnTo === "/checkout" ? (
        <Link
          href="/checkout?guest=1"
          className={actions.secondaryButton}
        >
          Continuar como invitado
        </Link>
      ) : null}

      <p className={styles.registerPrompt}>
        ¿Todavía no tienes cuenta?{" "}
        <Link href="/register">Crear cuenta</Link>
      </p>

      <Link href="/products" className={styles.guestLink}>
        Continuar viendo productos sin iniciar sesión
      </Link>
    </form>
  );
}
