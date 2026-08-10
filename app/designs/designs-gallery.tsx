"use client";

import { useMemo, useState } from "react";
import { DesignCard } from "@/components/designs";
import { EmptyState } from "@/components/ui";
import { catalogService } from "@/services";
import type { DesignCategory } from "@/types";
import styles from "./designs.module.css";

type CategoryFilter = DesignCategory | "all";

interface CategoryOption {
  value: CategoryFilter;
  label: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: "all", label: "Todos" },
  { value: "concert", label: "Conciertos" },
  { value: "street", label: "Calle" },
  { value: "studio", label: "Estudio" },
  { value: "backstage", label: "Backstage" },
  { value: "portrait", label: "Retratos" },
];

interface DesignsGalleryProps {
  initialCategory: CategoryFilter;
}

export function DesignsGallery({
  initialCategory,
}: DesignsGalleryProps) {
  const [category, setCategory] =
    useState<CategoryFilter>(initialCategory);

  const designs = useMemo(() => {
    const allDesigns = catalogService.getDesigns();

    if (category === "all") {
      return allDesigns;
    }

    return allDesigns.filter(
      (design) => design.category === category,
    );
  }, [category]);

  return (
    <>
      <div className={styles.toolbar}>
        <div
          className={styles.filters}
          role="group"
          aria-label="Filtrar diseños por categoría"
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

        <p className={styles.resultCount} aria-live="polite">
          {designs.length}{" "}
          {designs.length === 1 ? "diseño" : "diseños"}
        </p>
      </div>

      {designs.length > 0 ? (
        <div className={styles.masonry}>
          {designs.map((design, index) => (
            <DesignCard
              key={design.id}
              design={design}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyResults}>
          <EmptyState
            title="No encontramos diseños"
            description="Todavía no hay diseños disponibles en esta categoría."
          />

          <button
            type="button"
            className={`${styles.filterButton} ${styles.activeFilter}`}
            onClick={() => setCategory("all")}
          >
            Ver todos los diseños
          </button>
        </div>
      )}
    </>
  );
}
