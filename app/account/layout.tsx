import type { ReactNode } from "react";
import { ProtectedRoute } from "@/features/auth/protected-route";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({
  children,
}: AccountLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
