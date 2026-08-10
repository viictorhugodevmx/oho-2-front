import type { Metadata } from "next";
import type { DesignCategory } from "@/types";
import { DesignsGallery } from "./designs-gallery";
import styles from "./designs.module.css";

export const metadata: Metadata = {
  title: "Diseños",
  description:
    "Explora la colección de fotografía urbana y musical de OHO 2.0.",
};

type CategoryFilter = DesignCategory | "all";

const VALID_CATEGORIES = new Set<CategoryFilter>([
  "all",
  "concert",
  "street",
  "studio",
  "backstage",
  "portrait",
]);

interface DesignsPageProps {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

function resolveCategory(
  categoryParam: string | string[] | undefined,
): CategoryFilter {
  const category = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

  if (category === "urban") {
    return "street";
  }

  if (category === "music") {
    return "concert";
  }

  if (
    category &&
    VALID_CATEGORIES.has(category as CategoryFilter)
  ) {
    return category as CategoryFilter;
  }

  return "all";
}

export default async function DesignsPage({
  searchParams,
}: DesignsPageProps) {
  const params = await searchParams;
  const initialCategory = resolveCategory(params.category);

  return (
    <>
      <section className={styles.hero}>
        <div className="page-container">
          <span className={styles.eyebrow}>Colección OHO</span>

          <div className={styles.heroGrid}>
            <h1>Imágenes para mirar y llevar.</h1>

            <p>
              Explora fotografía urbana, conciertos, retratos y momentos
              detrás del escenario. Guarda tus favoritos y después
              combínalos con un producto.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.catalog}>
        <div className="page-container">
          <DesignsGallery initialCategory={initialCategory} />
        </div>
      </section>
    </>
  );
}
