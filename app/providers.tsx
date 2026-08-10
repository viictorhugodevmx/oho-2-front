"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/auth-context";
import { FavoritesProvider } from "@/features/favorites/favorites-context";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <FavoritesProvider>{children}</FavoritesProvider>
    </AuthProvider>
  );
}
