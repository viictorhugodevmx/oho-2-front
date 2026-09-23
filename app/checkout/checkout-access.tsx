"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { ensureGuestSessionId } from "@/lib/checkout/guest-session";

interface CheckoutAccessProps {
  children: ReactNode;
}

export function CheckoutAccess({ children }: CheckoutAccessProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const guestRequested = searchParams.get("guest") === "1";

  const [guestReady, setGuestReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoading || user) {
      return;
    }

    if (!guestRequested) {
      router.replace("/login?returnTo=%2Fcheckout");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      try {
        ensureGuestSessionId();
        setGuestReady(true);
      } catch {
        setError(
          "Habilita el almacenamiento del navegador para continuar como invitado.",
        );
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [guestRequested, isLoading, router, user]);

  if (error && !user) {
    return <p role="alert">{error}</p>;
  }

  if (
    isLoading ||
    (!user && !(guestRequested && guestReady))
  ) {
    return <p role="status">Preparando checkout...</p>;
  }

  return <div key={user?.id ?? "guest"}>{children}</div>;
}
