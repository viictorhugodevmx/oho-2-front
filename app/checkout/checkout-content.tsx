"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useAuth } from "@/features/auth/auth-context";
import { clearCart, getCart, subscribeToCart } from "@/lib/cart";
import { getGuestSessionId } from "@/lib/checkout/guest-session";
import { catalogService, orderService } from "@/services";
import type { Cart, CheckoutData } from "@/types";
import styles from "./checkout.module.css";

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const EMPTY_CART: ReturnType<typeof getCart> = [];

interface CheckoutDraft {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes: string;
}

const CHECKOUT_DRAFT_FIELDS: Array<keyof CheckoutDraft> = [
  "fullName",
  "email",
  "phone",
  "address",
  "neighborhood",
  "city",
  "state",
  "postalCode",
  "deliveryNotes",
];

function getServerCart() {
  return EMPTY_CART;
}

function getCheckoutStorageKey(buyerKey: string): string {
  return `oho:checkout:${buyerKey}`;
}

function getCheckoutDraftStorageKey(buyerKey: string): string {
  return `oho:checkout-draft:${buyerKey}`;
}

function getStoredCheckoutId(buyerKey: string): string | null {
  return window.sessionStorage.getItem(
    getCheckoutStorageKey(buyerKey),
  );
}

function getOrCreateCheckoutId(buyerKey: string): string {
  const existingId = getStoredCheckoutId(buyerKey);

  if (existingId) {
    return existingId;
  }

  const checkoutId = `checkout-${crypto.randomUUID()}`;

  window.sessionStorage.setItem(
    getCheckoutStorageKey(buyerKey),
    checkoutId,
  );

  return checkoutId;
}

function clearCheckoutId(buyerKey: string): void {
  window.sessionStorage.removeItem(
    getCheckoutStorageKey(buyerKey),
  );
}

function isCheckoutDraft(value: unknown): value is CheckoutDraft {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return CHECKOUT_DRAFT_FIELDS.every(
    (field) => typeof candidate[field] === "string",
  );
}

function getStoredCheckoutDraft(
  buyerKey: string,
): CheckoutDraft | null {
  const storedDraft = window.localStorage.getItem(
    getCheckoutDraftStorageKey(buyerKey),
  );

  if (!storedDraft) {
    return null;
  }

  try {
    const parsedDraft: unknown = JSON.parse(storedDraft);

    return isCheckoutDraft(parsedDraft) ? parsedDraft : null;
  } catch {
    window.localStorage.removeItem(
      getCheckoutDraftStorageKey(buyerKey),
    );

    return null;
  }
}

function saveCheckoutDraft(
  buyerKey: string,
  draft: CheckoutDraft,
): void {
  window.localStorage.setItem(
    getCheckoutDraftStorageKey(buyerKey),
    JSON.stringify(draft),
  );
}

function clearCheckoutDraft(buyerKey: string): void {
  window.localStorage.removeItem(
    getCheckoutDraftStorageKey(buyerKey),
  );
}

function createDraftFromForm(form: HTMLFormElement): CheckoutDraft {
  const formData = new FormData(form);

  return {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    neighborhood: String(formData.get("neighborhood") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    deliveryNotes: String(formData.get("deliveryNotes") ?? ""),
  };
}

function restoreCheckoutDraft(
  form: HTMLFormElement,
  draft: CheckoutDraft,
): void {
  CHECKOUT_DRAFT_FIELDS.forEach((field) => {
    const control = form.elements.namedItem(field);

    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement
    ) {
      control.value = draft[field];
    }
  });
}

export function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();

  const guestSessionId = user ? null : getGuestSessionId();
  const buyerKey =
    user?.id ?? (guestSessionId ? `guest:${guestSessionId}` : null);

  const cart = useSyncExternalStore(
    subscribeToCart,
    getCart,
    getServerCart,
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const submissionLockRef = useRef(false);
  const initializedForBuyerRef = useRef<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  const shipping = subtotal >= 1500 ? 0 : 149;
  const total = subtotal + shipping;

  useEffect(() => {
    if (
      !buyerKey ||
      initializedForBuyerRef.current === buyerKey
    ) {
      return;
    }

    const checkoutId = getStoredCheckoutId(buyerKey);

    if (checkoutId) {
      const recoveredOrder = user
        ? orderService.getByCheckoutIdForUser(checkoutId, user.id)
        : orderService.getByCheckoutIdForGuest(checkoutId);

      if (recoveredOrder) {
        clearCart();
        clearCheckoutId(buyerKey);
        clearCheckoutDraft(buyerKey);

        const basePath = user
          ? "/account/orders"
          : "/order-confirmation";

        router.replace(
          `${basePath}/${encodeURIComponent(recoveredOrder.orderNumber)}`,
        );

        return;
      }
    }

    const form = formRef.current;

    if (!form) {
      return;
    }

    initializedForBuyerRef.current = buyerKey;

    const storedDraft = getStoredCheckoutDraft(buyerKey);

    if (storedDraft) {
      restoreCheckoutDraft(form, storedDraft);
      return;
    }

    const emailControl = form.elements.namedItem("email");

    if (emailControl instanceof HTMLInputElement) {
      emailControl.value = user?.email ?? "";
    }
  }, [buyerKey, cart.length, router, user]);

  function handleDraftChange(
    event: FormEvent<HTMLFormElement>,
  ): void {
    if (!buyerKey || isSubmitting) {
      return;
    }

    try {
      saveCheckoutDraft(
        buyerKey,
        createDraftFromForm(event.currentTarget),
      );
    } catch {
      setSubmitError(
        "No fue posible guardar el borrador en este navegador.",
      );
    }
  }

  function handleClearDraft(): void {
    if (
      !buyerKey ||
      isSubmitting ||
      submissionLockRef.current
    ) {
      return;
    }

    const shouldClear = window.confirm(
      "¿Quieres borrar los datos guardados y reiniciar el formulario?",
    );

    if (!shouldClear) {
      return;
    }

    try {
      clearCheckoutDraft(buyerKey);
      clearCheckoutId(buyerKey);
      setSubmitError("");

      const form = formRef.current;

      if (!form) {
        return;
      }

      form.reset();

      const emailControl = form.elements.namedItem("email");

      if (emailControl instanceof HTMLInputElement) {
        emailControl.value = user?.email ?? "";
      }
    } catch {
      setSubmitError(
        "No fue posible limpiar los datos guardados.",
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      cart.length === 0 ||
      submissionLockRef.current ||
      !buyerKey
    ) {
      return;
    }

    submissionLockRef.current = true;
    setSubmitError("");
    setIsSubmitting(true);

    const draft = createDraftFromForm(event.currentTarget);

    try {
      saveCheckoutDraft(buyerKey, draft);

      const checkoutId = getOrCreateCheckoutId(buyerKey);

      const checkoutData: CheckoutData = {
        shippingAddress: {
          fullName: draft.fullName,
          street: [draft.address, draft.neighborhood]
            .filter(Boolean)
            .join(", "),
          city: draft.city,
          state: draft.state,
          postalCode: draft.postalCode,
          country: "México",
          phone: draft.phone,
        },
        contactEmail: draft.email,
        deliveryNotes: draft.deliveryNotes,
        guestSessionId: guestSessionId ?? undefined,
        paymentMethod: "card",
        checkoutId,
      };

      const checkoutCart: Cart = {
        items: cart.map((item) => {
          const product = catalogService.getProductBySlug(
            item.productSlug,
          );
          const design = catalogService.getDesignBySlug(
            item.designSlug,
          );

          if (!product || !design) {
            throw new Error(
              "Un producto o diseño ya no está disponible. Revisa tu carrito.",
            );
          }

          return {
            ...item,
            product,
            design,
            selectedOptions: [
              {
                optionId: "format",
                optionName: "Formato",
                valueId: item.format,
                valueLabel: item.formatLabel,
                value: item.format,
                priceModifier: item.unitPrice - product.basePrice,
              },
            ],
            lineTotal: item.unitPrice * item.quantity,
            addedAt: new Date().toISOString(),
          };
        }),
        subtotal,
        shipping,
        total,
      };

      const order = await orderService.createOrder(
        user?.id ?? null,
        checkoutCart,
        checkoutData,
      );

      clearCart();
      clearCheckoutId(buyerKey);
      clearCheckoutDraft(buyerKey);

      const basePath = user
        ? "/account/orders"
        : "/order-confirmation";

      router.replace(
        `${basePath}/${encodeURIComponent(order.orderNumber)}`,
      );
    } catch (caughtError) {
      submissionLockRef.current = false;
      setIsSubmitting(false);

      setSubmitError(
        caughtError instanceof Error
          ? caughtError.message
          : "No fue posible confirmar el pedido. Puedes intentarlo nuevamente.",
      );
    }
  }

  if (cart.length === 0) {
    return (
      <section className={styles.emptyState}>
        <span>Checkout OHO</span>
        <h1>No hay productos por confirmar.</h1>
        <p>
          Tu carrito está vacío. Agrega una pieza personalizada
          antes de continuar con el checkout.
        </p>

        <div className={styles.emptyActions}>
          <Link href="/designs" className={styles.primaryButton}>
            Explorar diseños
          </Link>
          <Link href="/cart" className={styles.secondaryButton}>
            Volver al carrito
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className={styles.checkoutLayout}>
      <section className={styles.formSection}>
        <div className={styles.heading}>
          <span>Checkout OHO</span>
          <h1>Completa tu pedido</h1>
          {!user ? (
            <p>Compra como invitado. No necesitas crear una cuenta.</p>
          ) : null}
          <p>
            Ingresa los datos necesarios para preparar y enviar tus piezas.
          </p>
        </div>

        <form
          ref={formRef}
          id="checkout-form"
          className={styles.form}
          onInput={handleDraftChange}
          onChange={handleDraftChange}
          onSubmit={handleSubmit}
        >
          <fieldset disabled={isSubmitting}>
            <legend>1. Información de contacto</legend>
            <div className={styles.fieldGrid}>
              <label>
                Nombre completo
                <input
                  type="text"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Nombre y apellidos"
                  required
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  required
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="961 000 0000"
                  minLength={10}
                  required
                />
              </label>
            </div>
          </fieldset>

          <fieldset disabled={isSubmitting}>
            <legend>2. Dirección de envío</legend>
            <div className={styles.fieldGrid}>
              <label className={styles.fullField}>
                Calle y número
                <input
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Calle, número exterior e interior"
                  required
                />
              </label>

              <label>
                Colonia
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Colonia"
                  required
                />
              </label>

              <label>
                Ciudad
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Ciudad"
                  required
                />
              </label>

              <label>
                Estado
                <select
                  name="state"
                  autoComplete="address-level1"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>Selecciona un estado</option>
                  <option value="Chiapas">Chiapas</option>
                  <option value="Ciudad de México">Ciudad de México</option>
                  <option value="Estado de México">Estado de México</option>
                  <option value="Jalisco">Jalisco</option>
                  <option value="Nuevo León">Nuevo León</option>
                  <option value="Oaxaca">Oaxaca</option>
                  <option value="Puebla">Puebla</option>
                  <option value="Yucatán">Yucatán</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>

              <label>
                Código postal
                <input
                  type="text"
                  name="postalCode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                />
              </label>

              <label className={styles.fullField}>
                Referencias de entrega
                <textarea
                  name="deliveryNotes"
                  placeholder="Entre calles, color de fachada o indicaciones adicionales"
                  rows={4}
                />
              </label>
            </div>
          </fieldset>

          <fieldset disabled={isSubmitting}>
            <legend>3. Método de pago</legend>
            <label className={styles.paymentOption}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                defaultChecked
              />
              <span>
                <strong>Tarjeta de crédito o débito</strong>
                <small>
                  Simulación: no se solicitarán datos bancarios.
                </small>
              </span>
            </label>
          </fieldset>

          {submitError ? <p role="alert">{submitError}</p> : null}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.clearDraftButton}
              onClick={handleClearDraft}
              disabled={isSubmitting}
            >
              Limpiar formulario
            </button>
          </div>
        </form>
      </section>

      <aside className={styles.summary}>
        <span className={styles.summaryEyebrow}>Resumen del pedido</span>

        <div className={styles.itemList}>
          {cart.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className={styles.productImage}
                />
                <div className={styles.designImage}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.designImageUrl} alt="" />
                </div>
              </div>

              <div className={styles.itemInformation}>
                <strong>{item.productName}</strong>
                <span>{item.designTitle}</span>
                <small>
                  {item.formatLabel} · Cantidad {item.quantity}
                </small>
              </div>

              <strong className={styles.itemPrice}>
                {CURRENCY_FORMATTER.format(
                  item.unitPrice * item.quantity,
                )}
              </strong>
            </article>
          ))}
        </div>

        <div className={styles.totals}>
          <div>
            <span>Subtotal</span>
            <strong>{CURRENCY_FORMATTER.format(subtotal)}</strong>
          </div>
          <div>
            <span>Envío</span>
            <strong>
              {shipping === 0
                ? "Gratis"
                : CURRENCY_FORMATTER.format(shipping)}
            </strong>
          </div>
          <div className={styles.total}>
            <span>Total</span>
            <strong>{CURRENCY_FORMATTER.format(total)}</strong>
          </div>
        </div>

        {shipping === 0 ? (
          <p className={styles.shippingMessage}>
            Tu pedido incluye envío gratis.
          </p>
        ) : (
          <p className={styles.shippingMessage}>
            Agrega{" "}
            <strong>
              {CURRENCY_FORMATTER.format(1500 - subtotal)}
            </strong>{" "}
            para obtener envío gratis.
          </p>
        )}

        <button
          type="submit"
          form="checkout-form"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Confirmando..." : "Confirmar pedido"}
          <span aria-hidden="true">→</span>
        </button>

        <p className={styles.disclaimer}>
          Demostración de checkout. No se procesarán pagos
          ni se enviará información a un servidor.
        </p>

        <Link href="/cart" className={styles.backLink}>
          ← Volver al carrito
        </Link>
      </aside>
    </div>
  );
}
