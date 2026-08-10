import type { Metadata } from "next";
import { CartContent } from "./cart-content";
import styles from "./cart.module.css";

export const metadata: Metadata = {
  title: "Carrito",
  description:
    "Revisa los productos personalizados de tu carrito OHO.",
};

export default function CartPage() {
  return (
    <main className={styles.page}>
      <div className="page-container">
        <CartContent />
      </div>
    </main>
  );
}
