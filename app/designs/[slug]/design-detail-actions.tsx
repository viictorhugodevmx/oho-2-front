"use client";

import Link from "next/link";
import { useFavorites } from "@/features/favorites/favorites-context";
import type { Design } from "@/types";
import styles from "./design-detail.module.css";

interface DesignDetailActionsProps {
  design: Design;
}

export function DesignDetailActions({
  design,
}: DesignDetailActionsProps) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const favorite = isFavorite(design.id);

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={
          favorite
            ? `${styles.favoriteButton} ${styles.favoriteButtonActive}`
            : styles.favoriteButton
        }
        onClick={() => toggleFavorite(design.id)}
        disabled={isLoading}
        aria-pressed={favorite}
      >
        <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>

        {isLoading
          ? "Cargando..."
          : favorite
            ? "Guardado en favoritos"
            : "Agregar a favoritos"}
      </button>

      <Link
        href={`/products?design=${design.slug}`}
        className={styles.productButton}
      >
        Usar en un producto
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
