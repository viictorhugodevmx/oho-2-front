import type { Metadata } from "next";
import { CheckoutContent } from "./checkout-content";
import styles from "./checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Completa los datos de entrega para confirmar tu pedido OHO.",
};

export default function CheckoutPage() {
  return (
    <main className={styles.page}>
      <div className="page-container">
        <CheckoutContent />
      </div>
    </main>
  );
}
