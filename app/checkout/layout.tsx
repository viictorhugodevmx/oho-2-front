import type { ReactNode } from "react";
import { ProtectedRoute } from "@/features/auth/protected-route";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
