"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/auth-context";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (
      isLoading ||
      isAuthenticated ||
      hasRedirected.current
    ) {
      return;
    }

    hasRedirected.current = true;

    const returnTo = encodeURIComponent(pathname);
    router.replace(`/login?returnTo=${returnTo}`);
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <main
        aria-busy="true"
        aria-label="Comprobando sesión"
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <p>Comprobando sesión...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main
        aria-busy="true"
        aria-label="Redirigiendo al inicio de sesión"
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <p>Redirigiendo al inicio de sesión...</p>
      </main>
    );
  }

  return children;
}
