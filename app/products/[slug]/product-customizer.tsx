"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addCartItem } from "@/lib/cart";
import { catalogService } from "@/services";
import styles from "./product-detail.module.css";

interface ProductCustomizerProps {
  productSlug: string;
  initialDesignSlug?: string;
}

const FORMAT_OPTIONS = [
  {
    value: "standard",
    label: "Estándar",
    priceAdjustment: 0,
  },
  {
    value: "large",
    label: "Grande",
    priceAdjustment: 180,
  },
  {
    value: "premium",
    label: "Premium",
    priceAdjustment: 320,
  },
] as const;

type FormatValue = (typeof FORMAT_OPTIONS)[number]["value"];

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function ProductCustomizer({
  productSlug,
  initialDesignSlug,
}: ProductCustomizerProps) {
  const router = useRouter();

  const product = useMemo(
    () =>
      catalogService
        .filterProducts({
          category: "all",
          query: "",
          sort: "featured",
        })
        .find((item) => item.slug === productSlug),
    [productSlug],
  );

  const initialDesign = useMemo(() => {
    if (!initialDesignSlug) {
      return undefined;
    }

    return catalogService.getDesignBySlug(initialDesignSlug);
  }, [initialDesignSlug]);

  const [selectedDesignSlug, setSelectedDesignSlug] = useState(
    initialDesign?.slug ?? "",
  );
  const [format, setFormat] =
    useState<FormatValue>("standard");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const designs = useMemo(
    () => catalogService.getDesigns(),
    [],
  );

  const selectedDesign = useMemo(
    () =>
      designs.find(
        (design) => design.slug === selectedDesignSlug,
      ),
    [designs, selectedDesignSlug],
  );

  const selectedFormat =
    FORMAT_OPTIONS.find((option) => option.value === format) ??
    FORMAT_OPTIONS[0];

  if (!product) {
    return null;
  }

  const unitPrice =
    product.basePrice + selectedFormat.priceAdjustment;
  const total = unitPrice * quantity;

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(10, current + 1));
  }

  function handleAddToCart() {
    if (!product) {
      return;
    }

    if (!selectedDesign) {
      setMessage(
        "Selecciona un diseño antes de agregar el producto.",
      );
      return;
    }

    addCartItem({
      productSlug: product.slug,
      productName: product.name,
      productImageUrl: product.imageUrl,
      designSlug: selectedDesign.slug,
      designTitle: selectedDesign.title,
      designImageUrl: selectedDesign.imageUrl,
      format,
      formatLabel: selectedFormat.label,
      unitPrice,
      quantity,
    });

    router.push("/cart");
  }

  return (
    <div className={styles.detailGrid}>
      <section className={styles.previewSection}>
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
          />

          {selectedDesign ? (
            <div className={styles.designOverlay}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedDesign.imageUrl}
                alt={`Diseño ${selectedDesign.title}`}
              />
            </div>
          ) : (
            <div className={styles.emptyOverlay}>
              Elige un diseño
            </div>
          )}

          {product.badge ? (
            <span className={styles.badge}>
              {product.badge}
            </span>
          ) : null}
        </div>

        <p className={styles.previewNote}>
          Vista previa conceptual. La posición final puede variar según
          el producto seleccionado.
        </p>
      </section>

      <section className={styles.configuration}>
        <span className={styles.eyebrow}>
          Personaliza tu pieza
        </span>

        <h1>{product.name}</h1>

        <p className={styles.description}>
          {product.shortDescription}
        </p>

        <div className={styles.basePrice}>
          Desde{" "}
          <strong>
            {CURRENCY_FORMATTER.format(product.basePrice)}
          </strong>
        </div>

        <div className={styles.optionGroup}>
          <div className={styles.optionHeader}>
            <h2>1. Selecciona un diseño</h2>

            <Link href="/designs">
              Ver catálogo completo
            </Link>
          </div>

          <div className={styles.designGrid}>
            {designs.slice(0, 6).map((design) => {
              const isSelected =
                selectedDesignSlug === design.slug;

              return (
                <button
                  key={design.id}
                  type="button"
                  className={
                    isSelected
                      ? `${styles.designOption} ${styles.selectedDesign}`
                      : styles.designOption
                  }
                  onClick={() => {
                    setSelectedDesignSlug(design.slug);
                    setMessage("");
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Seleccionar ${design.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={design.imageUrl}
                    alt=""
                  />

                  <span>{design.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <fieldset className={styles.optionGroup}>
          <legend>2. Elige el formato</legend>

          <div className={styles.formatGrid}>
            {FORMAT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={
                  format === option.value
                    ? `${styles.formatOption} ${styles.selectedFormat}`
                    : styles.formatOption
                }
              >
                <input
                  type="radio"
                  name="format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={() => setFormat(option.value)}
                />

                <span>{option.label}</span>

                <small>
                  {option.priceAdjustment === 0
                    ? "Precio base"
                    : `+${CURRENCY_FORMATTER.format(
                        option.priceAdjustment,
                      )}`}
                </small>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.optionGroup}>
          <h2>3. Cantidad</h2>

          <div
            className={styles.quantity}
            aria-label="Seleccionar cantidad"
          >
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity === 1}
              aria-label="Disminuir cantidad"
            >
              −
            </button>

            <output aria-live="polite">
              {quantity}
            </output>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity === 10}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>

        <aside className={styles.summary}>
          <div>
            <span>Producto</span>
            <strong>{product.name}</strong>
          </div>

          <div>
            <span>Diseño</span>
            <strong>
              {selectedDesign?.title ?? "Sin seleccionar"}
            </strong>
          </div>

          <div>
            <span>Formato</span>
            <strong>{selectedFormat.label}</strong>
          </div>

          <div>
            <span>Cantidad</span>
            <strong>{quantity}</strong>
          </div>

          <div className={styles.total}>
            <span>Total</span>
            <strong>
              {CURRENCY_FORMATTER.format(total)}
            </strong>
          </div>
        </aside>

        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddToCart}
        >
          Agregar al carrito
          <span aria-hidden="true">→</span>
        </button>

        {message ? (
          <p
            className={styles.errorMessage}
            role="alert"
          >
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}
