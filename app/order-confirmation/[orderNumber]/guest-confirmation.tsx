"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { orderService } from "@/services";
import type { Order } from "@/types";
import styles from "./confirmation.module.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

interface GuestConfirmationProps {
  orderNumber: string;
}

export function GuestConfirmation({
  orderNumber,
}: GuestConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setOrder(orderService.getForGuest(orderNumber) ?? null);
      } catch {
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [orderNumber]);

  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <p role="status">Consultando confirmación...</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Pedido OHO</span>
            <h1>Confirmación no disponible</h1>
            <p>
              Abre la confirmación en la misma sesión del navegador
              donde hiciste la compra.
            </p>
          </div>

          <Link href="/products" className={styles.primaryButton}>
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.eyebrow}>Pedido confirmado</span>
          <h1>Gracias por tu compra.</h1>
          <p>
            Folio: <strong>{order.orderNumber}</strong>
          </p>
          <p>Correo de contacto: {order.contactEmail}</p>
        </header>

        <div className={styles.layout}>
          <section className={styles.card}>
            <h2>Resumen de tu pedido</h2>

            <div className={styles.items}>
              {order.items.map((item) => (
                <article key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <strong>{item.product.name}</strong>
                    <span>Diseño: {item.design.title}</span>
                    <small>
                      {item.selectedOptions
                        .map((option) => option.valueLabel)
                        .join(" / ")}
                    </small>
                    <span>
                      {item.quantity} ×{" "}
                      {CURRENCY_FORMATTER.format(item.unitPrice)}
                    </span>
                  </div>

                  <strong className={styles.itemPrice}>
                    {CURRENCY_FORMATTER.format(
                      item.unitPrice * item.quantity,
                    )}
                  </strong>
                </article>
              ))}
            </div>

            <dl className={styles.totals}>
              <div>
                <dt>Subtotal</dt>
                <dd>{CURRENCY_FORMATTER.format(order.subtotal)}</dd>
              </div>
              <div>
                <dt>Envío</dt>
                <dd>
                  {order.shipping === 0
                    ? "Gratis"
                    : CURRENCY_FORMATTER.format(order.shipping)}
                </dd>
              </div>
              <div className={styles.total}>
                <dt>Total</dt>
                <dd>{CURRENCY_FORMATTER.format(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <h2>Datos de entrega</h2>

            <address className={styles.address}>
              <strong>{order.shippingAddress.fullName}</strong>
              <span>{order.shippingAddress.street}</span>
              <span>
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state}
              </span>
              <span>C.P. {order.shippingAddress.postalCode}</span>
              <span>{order.shippingAddress.country}</span>
              <span>{order.shippingAddress.phone}</span>
            </address>

            {order.deliveryNotes ? (
              <p className={styles.notes}>
                <strong>Referencias: </strong>
                {order.deliveryNotes}
              </p>
            ) : null}
          </section>
        </div>

        <p className={styles.notice}>
          Compra de demostración: no se realizó ningún cargo
          ni se enviaron correos o productos.
        </p>

        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryButton}>
            Seguir comprando
          </Link>
          <Link href="/register" className={styles.secondaryButton}>
            Crear una cuenta
          </Link>
        </div>

        <p className={styles.help}>
          Guarda tu folio. En esta demo puedes consultar la confirmación
          en esta sesión del navegador. Crear una cuenta no vincula
          automáticamente esta compra.
        </p>
      </div>
    </section>
  );
}
