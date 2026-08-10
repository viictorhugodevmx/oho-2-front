"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { orderService } from "@/services";
import type { Order, OrderStatus } from "@/types";
import styles from "./account.module.css";

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

interface CurrentStoredCartItem {
  productName?: string;
  designTitle?: string;
}

function getItemInformation(
  item: Order["items"][number],
): {
  productName: string;
  designTitle: string;
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
  };
}

export function AccountContent() {
  const { user } = useAuth();

  const orders = useMemo(() => {
    if (!user) {
      return [];
    }

    return orderService.getByUserId(user.id);
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Cuenta OHO</span>

        <h1>Hola, {user.name.split(" ")[0]}.</h1>

        <p>
          Desde aquí puedes consultar tus datos y seguir las piezas
          que has enviado a producción.
        </p>
      </section>

      <div className={styles.content}>
        <aside className={styles.profile}>
          <span className={styles.sectionLabel}>Perfil</span>

          <div className={styles.avatar} aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>

          <Link href="/products" className={styles.secondaryLink}>
            Explorar productos
          </Link>
        </aside>

        <section className={styles.orders}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>
                Historial
              </span>

              <h2>Mis pedidos</h2>
            </div>

            <span className={styles.orderCount}>
              {orders.length}{" "}
              {orders.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">◎</span>

              <h3>Aún no tienes pedidos.</h3>

              <p>
                Personaliza una pieza y completa el checkout para
                verla aquí.
              </p>

              <Link href="/products" className={styles.primaryLink}>
                Ver productos
              </Link>
            </div>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => {
                const totalItems = order.items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                );

                return (
                  <article
                    key={order.id}
                    className={styles.orderCard}
                  >
                    <div className={styles.orderHeader}>
                      <div>
                        <span className={styles.orderNumber}>
                          {order.orderNumber}
                        </span>

                        <time dateTime={order.createdAt}>
                          {DATE_FORMATTER.format(
                            new Date(order.createdAt),
                          )}
                        </time>
                      </div>

                      <span className={styles.status}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    <div className={styles.itemList}>
                      {order.items.map((item) => {
                        const itemInformation =
                          getItemInformation(item);

                        return (
                          <div
                            key={item.id}
                            className={styles.orderItem}
                          >
                            <div>
                              <strong>
                                {itemInformation.productName}
                              </strong>

                              <span>
                                Diseño:{" "}
                                {itemInformation.designTitle}
                              </span>
                            </div>

                            <span>
                              {item.quantity} ×{" "}
                              {CURRENCY_FORMATTER.format(
                                item.unitPrice,
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className={styles.orderSummary}>
                      <span>
                        {totalItems}{" "}
                        {totalItems === 1
                          ? "producto"
                          : "productos"}
                      </span>

                      <strong>
                        {CURRENCY_FORMATTER.format(order.total)}
                      </strong>
                    </div>

                    <Link
                      href={`/account/orders/${encodeURIComponent(
                        order.orderNumber,
                      )}`}
                      className={styles.orderDetailLink}
                      aria-label={`Ver detalle del pedido ${order.orderNumber}`}
                    >
                      Ver detalle del pedido
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
