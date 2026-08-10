"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  clearCart,
  getCart,
  removeCartItem,
  subscribeToCart,
  updateCartItemQuantity,
} from "@/lib/cart";
import styles from "./cart.module.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const EMPTY_CART: ReturnType<typeof getCart> = [];

function getServerCart() {
  return EMPTY_CART;
}

export function CartContent() {
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCart,
    getServerCart,
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <section className={styles.emptyState}>
        <span>Tu carrito está vacío</span>

        <h1>Encuentra una pieza para personalizar.</h1>

        <p>
          Selecciona un diseño, aplícalo a un producto y vuelve
          cuando tu combinación esté lista.
        </p>

        <div className={styles.emptyActions}>
          <Link href="/designs" className={styles.primaryButton}>
            Explorar diseños
          </Link>

          <Link
            href="/products"
            className={styles.secondaryButton}
          >
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.cartLayout}>
      <section>
        <div className={styles.heading}>
          <div>
            <span>Carrito OHO</span>
            <h1>Tu selección</h1>
          </div>

          <button type="button" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>

        <div className={styles.itemList}>
          {cart.map((item) => (
            <article key={item.id} className={styles.cartItem}>
              <div className={styles.preview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className={styles.productImage}
                />

                <div className={styles.designImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.designImageUrl}
                    alt={`Diseño ${item.designTitle}`}
                  />
                </div>
              </div>

              <div className={styles.itemInformation}>
                <span className={styles.format}>
                  {item.formatLabel}
                </span>

                <h2>{item.productName}</h2>
                <p>Diseño: {item.designTitle}</p>

                <Link
                  href={`/products/${item.productSlug}?design=${item.designSlug}`}
                >
                  Editar configuración
                </Link>
              </div>

              <div className={styles.itemActions}>
                <strong>
                  {CURRENCY_FORMATTER.format(
                    item.unitPrice * item.quantity,
                  )}
                </strong>

                <div className={styles.quantity}>
                  <button
                    type="button"
                    onClick={() =>
                      updateCartItemQuantity(
                        item.id,
                        item.quantity - 1,
                      )
                    }
                    aria-label={`Disminuir cantidad de ${item.productName}`}
                  >
                    −
                  </button>

                  <output>{item.quantity}</output>

                  <button
                    type="button"
                    onClick={() =>
                      updateCartItemQuantity(
                        item.id,
                        item.quantity + 1,
                      )
                    }
                    disabled={item.quantity === 10}
                    aria-label={`Aumentar cantidad de ${item.productName}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeCartItem(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className={styles.summary}>
        <span className={styles.summaryEyebrow}>
          Resumen del pedido
        </span>

        <div>
          <span>Productos</span>

          <strong>
            {cart.reduce(
              (total, item) => total + item.quantity,
              0,
            )}
          </strong>
        </div>

        <div>
          <span>Subtotal</span>
          <strong>{CURRENCY_FORMATTER.format(subtotal)}</strong>
        </div>

        <div>
          <span>Envío</span>
          <strong>Por calcular</strong>
        </div>

        <div className={styles.total}>
          <span>Total provisional</span>
          <strong>{CURRENCY_FORMATTER.format(subtotal)}</strong>
        </div>

        <Link
          href="/checkout"
          className={styles.checkoutButton}
        >
          Continuar al checkout
          <span aria-hidden="true">→</span>
        </Link>

        <p>
          El costo de envío se calculará con tu código postal.
        </p>

        <Link href="/products" className={styles.continueLink}>
          Seguir comprando
        </Link>
      </aside>
    </div>
  );
}
