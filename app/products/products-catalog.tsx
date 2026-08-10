"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { catalogService } from "@/services";
import type { ProductCategory } from "@/types";
import styles from "./products.module.css";

type CategoryFilter = ProductCategory | "all";

type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name";

interface CategoryOption {
  value: CategoryFilter;
  label: string;
}

interface SortOptionItem {
  value: SortOption;
  label: string;
}

interface ProductsCatalogProps {
  initialDesignSlug?: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "all", label: "Todos" },
  { value: "apparel", label: "Ropa" },
  { value: "accessories", label: "Accesorios" },
  { value: "wall-art", label: "Arte para muro" },
  { value: "objects", label: "Objetos" },
];

const SORT_OPTIONS: SortOptionItem[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre" },
];

const CURRENCY_FORMATTER = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function ProductsCatalog({
  initialDesignSlug,
}: ProductsCatalogProps) {
  const [category, setCategory] =
    useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] =
    useState<SortOption>("featured");

  const selectedDesign = useMemo(() => {
    if (!initialDesignSlug) {
      return undefined;
    }

    return catalogService.getDesignBySlug(initialDesignSlug);
  }, [initialDesignSlug]);

  const products = useMemo(
    () =>
      catalogService.filterProducts({
        category,
        query,
        sort,
      }),
    [category, query, sort],
  );

  function resetFilters() {
    setCategory("all");
    setQuery("");
    setSort("featured");
  }

  return (
    <>
      {selectedDesign ? (
        <aside className={styles.selectedDesign}>
          <div className={styles.selectedDesignImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedDesign.imageUrl}
              alt=""
            />
          </div>

          <div className={styles.selectedDesignContent}>
            <span>Diseño seleccionado</span>
            <strong>{selectedDesign.title}</strong>
            <p>
              Elige el producto donde quieres aplicar esta imagen.
            </p>
          </div>

          <Link
            href="/designs"
            className={styles.changeDesign}
          >
            Cambiar diseño
          </Link>
        </aside>
      ) : initialDesignSlug ? (
        <aside className={styles.invalidDesign}>
          <p>
            El diseño indicado no está disponible. Puedes elegir un
            producto y seleccionar otra imagen después.
          </p>

          <Link href="/designs">Explorar diseños</Link>
        </aside>
      ) : null}

      <div className={styles.controls}>
        <div className={styles.searchField}>
          <label htmlFor="product-search">
            Buscar productos
          </label>

          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Playera, póster, taza..."
          />
        </div>

        <div className={styles.sortField}>
          <label htmlFor="product-sort">Ordenar por</label>

          <select
            id="product-sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as SortOption)
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filtrar productos por categoría"
        >
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                category === option.value
                  ? `${styles.filterButton} ${styles.activeFilter}`
                  : styles.filterButton
              }
              onClick={() => setCategory(option.value)}
              aria-pressed={category === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p
          className={styles.resultCount}
          aria-live="polite"
        >
          {products.length}{" "}
          {products.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {products.length > 0 ? (
        <div className={styles.productGrid}>
          {products.map((product, index) => {
            const productHref = selectedDesign
              ? `/products/${product.slug}?design=${selectedDesign.slug}`
              : `/products/${product.slug}`;

            return (
              <article
                key={product.id}
                className={styles.productCard}
              >
                <Link
                  href={productHref}
                  className={styles.productImageLink}
                  aria-label={`Ver ${product.name}`}
                >
                  <div className={styles.productImage}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading={index < 4 ? "eager" : "lazy"}
                    />

                    {product.badge ? (
                      <span className={styles.badge}>
                        {product.badge}
                      </span>
                    ) : null}

                    {product.featured ? (
                      <span className={styles.featured}>
                        Destacado
                      </span>
                    ) : null}
                  </div>
                </Link>

                <div className={styles.productInfo}>
                  <div className={styles.productHeading}>
                    <div>
                      <span className={styles.productCategory}>
                        {CATEGORY_OPTIONS.find(
                          (option) =>
                            option.value === product.category,
                        )?.label ?? product.category}
                      </span>

                      <h2>
                        <Link href={productHref}>
                          {product.name}
                        </Link>
                      </h2>
                    </div>

                    <strong className={styles.price}>
                      {CURRENCY_FORMATTER.format(
                        product.basePrice,
                      )}
                    </strong>
                  </div>

                  <p>{product.shortDescription}</p>

                  <Link
                    href={productHref}
                    className={styles.customizeButton}
                  >
                    {selectedDesign
                      ? "Usar este producto"
                      : "Personalizar"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyResults}>
          <EmptyState
            title="No encontramos productos"
            description="Prueba otra búsqueda o cambia la categoría seleccionada."
          />

          <button
            type="button"
            className={`${styles.filterButton} ${styles.activeFilter}`}
            onClick={resetFilters}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  );
}
