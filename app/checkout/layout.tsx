import { Suspense, type ReactNode } from "react";
import { CheckoutAccess } from "./checkout-access";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  return (
    <Suspense fallback={<p role="status">Preparando checkout...</p>}>
      <CheckoutAccess>{children}</CheckoutAccess>
    </Suspense>
  );
}
