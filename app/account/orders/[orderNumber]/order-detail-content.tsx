"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { orderService } from "@/services";
import type { Order, OrderStatus } from "@/types";
import styles from "./order-detail.module.css";

interface OrderDetailContentProps {
  orderNumber: string;
}

interface CurrentStoredCartItem {
  productName?: string;
  designTitle?: string;
  formatLabel?: string;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  "payment-approved": "Pago aprobado",
  "order-created": "Pedido creado",
  "sent-to-print-partner": "Enviado a producción",
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeStyle: "short",
});

function getItemInformation(
  item: Order["items"][number],
): {
  productName: string;
  designTitle: string;
  formatLabel: string;
} {
  const currentItem =
    item as unknown as CurrentStoredCartItem;

  return {
    productName:
      item.product?.name ??
      currentItem.productName ??
      "Producto OHO",
    designTitle:
      item.design?.title ??
      currentItem.designTitle ??
      "Diseño personalizado",
    formatLabel:
      currentItem.formatLabel ??
      "Formato personalizado",
  };
}

export function OrderDetailContent({
  orderNumber,
}: OrderDetailContentProps) {
  const { user } = useAuth();

  const order = useMemo(() => {
    if (!user) {
      return undefined;
    }

    return orderService.getByOrderNumberForUser(
      orderNumber,
      user.id,
    );
  }, [orderNumber, user]);

  if (!user) {
    return null;
  }

  if (!order) {
    return (
      <main className={styles.page}>
        <section className={styles.notFound}>
          <span className={styles.eyebrow}>
            Pedido no disponible
          </span>

          <h1>No encontramos este pedido.</h1>

          <p>
            El folio no existe o no pertenece a la cuenta con la que
            iniciaste sesión.
          </p>

          <div className={styles.actions}>
            <Link
              href="/account"
              className={styles.primaryLink}
            >
              Volver a mis pedidos
            </Link>

            <Link
              href="/products"
              className={styles.secondaryLink}
            >
              Explorar productos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const totalItems = order.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Navegación">
        <Link href="/account">Mi cuenta</Link>
        <span aria-hidden="true">/</span>
        <span>{order.orderNumber}</span>
      </nav>

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>
            Detalle del pedido
          </span>

          <h1>{order.orderNumber}</h1>

          <time dateTime={order.createdAt}>
            Realizado el{" "}
            {DATE_FORMATTER.format(
              new Date(order.createdAt),
            )}
          </time>
        </div>

        <span className={styles.status}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </section>

      <div className={styles.layout}>
        <section className={styles.orderSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>
                Tu selección
              </span>

              <h2>Productos</h2>
            </div>

            <span>
              {totalItems}{" "}
              {totalItems === 1 ? "pieza" : "piezas"}
            </span>
          </div>

          <div className={styles.itemList}>
            {order.items.map((item) => {
              const itemInformation =
                getItemInformation(item);

              return (
                <article
                  key={item.id}
                  className={styles.item}
                >
                  <div>
                    <strong>
                      {itemInformation.productName}
                    </strong>

                    <span>
                      Diseño: {itemInformation.designTitle}
                    </span>

                    <small>
                      {itemInformation.formatLabel}
                    </small>
                  </div>

                  <div className={styles.itemPrice}>
                    <span>
                      {item.quantity} ×{" "}
                      {CURRENCY_FORMATTER.format(
                        item.unitPrice,
                      )}
                    </span>

                    <strong>
                      {CURRENCY_FORMATTER.format(
                        item.unitPrice * item.quantity,
                      )}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>

          <div className={styles.totals}>
            <div>
              <span>Subtotal</span>
              <strong>
                {CURRENCY_FORMATTER.format(order.subtotal)}
              </strong>
            </div>

            <div>
              <span>Envío</span>
              <strong>
                {order.shipping === 0
                  ? "Gratis"
                  : CURRENCY_FORMATTER.format(
                      order.shipping,
                    )}
              </strong>
            </div>

            <div className={styles.total}>
              <span>Total</span>
              <strong>
                {CURRENCY_FORMATTER.format(order.total)}
              </strong>
            </div>
          </div>
        </section>

        <aside className={styles.sidePanel}>
          <section className={styles.informationCard}>
            <span className={styles.sectionLabel}>
              Entrega
            </span>

            <h2>Dirección de envío</h2>

            <address>
              <strong>
                {order.shippingAddress.fullName}
              </strong>

              <span>{order.shippingAddress.street}</span>

              <span>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </span>

              <span>
                C.P. {order.shippingAddress.postalCode}
              </span>

              <span>{order.shippingAddress.country}</span>

              <span>{order.shippingAddress.phone}</span>
            </address>
          </section>

          <section className={styles.informationCard}>
            <span className={styles.sectionLabel}>
              Pago
            </span>

            <h2>Método registrado</h2>

            <p>
              {order.paymentMethod === "card"
                ? "Tarjeta — simulación sin cargo real"
                : "Pago en efectivo — demostración"}
            </p>
          </section>

          <Link
            href="/account"
            className={styles.primaryLink}
          >
            Volver a mis pedidos
          </Link>
        </aside>
      </div>
    </main>
  );
}
