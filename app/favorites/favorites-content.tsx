"use client";

import Link from "next/link";
import { DesignCard } from "@/components/designs";
import { useFavorites } from "@/features/favorites/favorites-context";
import { catalogService } from "@/services";
import styles from "./favorites.module.css";

export function FavoritesContent() {
  const {
    favoriteIds,
    favoriteCount,
    isLoading,
    clearFavorites,
  } = useFavorites();

  const favoriteIdSet = new Set(favoriteIds);

  const favoriteDesigns = catalogService
    .getDesigns()
    .filter((design) => favoriteIdSet.has(design.id));

  if (isLoading) {
    return (
      <section
        className={styles.loadingState}
        aria-live="polite"
        aria-busy="true"
      >
        <span>Favoritos OHO</span>
        <p>Cargando tus diseños guardados...</p>
      </section>
    );
  }

  if (favoriteDesigns.length === 0) {
    return (
      <section className={styles.emptyState}>
        <span>Favoritos OHO</span>

        <h1>Tu selección está vacía.</h1>

        <p>
          Guarda los diseños que más te gusten para encontrarlos
          fácilmente y utilizarlos después en una pieza.
        </p>

        <Link href="/designs" className={styles.primaryButton}>
          Explorar diseños
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className={styles.heading}>
        <div>
          <span>Favoritos OHO</span>

          <h1>Tu selección visual.</h1>

          <p>
            Conserva tus diseños favoritos y elige cuál convertir en
            una pieza personalizada.
          </p>
        </div>

        <button
          type="button"
          className={styles.clearButton}
          onClick={clearFavorites}
        >
          Vaciar favoritos
        </button>
      </div>

      <div className={styles.results}>
        <p aria-live="polite">
          {favoriteCount}{" "}
          {favoriteCount === 1
            ? "diseño guardado"
            : "diseños guardados"}
        </p>

        <Link href="/designs">Explorar más diseños</Link>
      </div>

      <div className={styles.grid}>
        {favoriteDesigns.map((design, index) => (
          <DesignCard
            key={design.id}
            design={design}
            priority={index < 4}
          />
        ))}
      </div>
    </>
  );
}
