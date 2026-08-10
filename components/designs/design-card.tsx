"use client";

import Link from "next/link";
import { useFavorites } from "@/features/favorites/favorites-context";
import type { Design } from "@/types";
import styles from "./design-card.module.css";

interface DesignCardProps {
  design: Design;
  priority?: boolean;
}

export function DesignCard({
  design,
  priority = false,
}: DesignCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(design.id);

  function handleFavorite(): void {
    toggleFavorite(design.id);
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageContainer}>
        <Link
          href={`/designs/${design.slug}`}
          className={styles.imageLink}
          aria-label={`Ver diseño ${design.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.imageUrl}
            alt={design.title}
            className={styles.image}
            loading={priority ? "eager" : "lazy"}
          />
        </Link>

        {design.featured ? (
          <span className={styles.featured}>Destacado</span>
        ) : null}

        <button
          type="button"
          className={styles.favoriteButton}
          onClick={handleFavorite}
          aria-label={
            favorite
              ? `Quitar ${design.title} de favoritos`
              : `Agregar ${design.title} a favoritos`
          }
          aria-pressed={favorite}
        >
          <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
        </button>

        <span className={styles.drop}>{design.drop}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.heading}>
          <Link href={`/designs/${design.slug}`}>
            <h2>{design.title}</h2>
          </Link>

          <span className={styles.arrow} aria-hidden="true">
            ↗
          </span>
        </div>

        <p className={styles.description}>{design.description}</p>

        <div className={styles.footer}>
          <span>Por {design.photographer}</span>
          <span>{design.category}</span>
        </div>

        {design.tags.length > 0 ? (
          <div className={styles.tags} aria-label="Etiquetas">
            {design.tags.slice(0, 3).map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
