import type { Metadata } from "next";
import { ProductsCatalog } from "./products-catalog";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Elige un producto OHO y personalízalo con fotografía urbana y musical.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    design?: string | string[];
  }>;
}

function resolveDesignSlug(
  designParam: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(designParam)) {
    return designParam[0];
  }

  return designParam;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const initialDesignSlug = resolveDesignSlug(params.design);

  return (
    <>
      <section className={styles.hero}>
        <div className="page-container">
          <span className={styles.eyebrow}>
            Productos OHO
          </span>

          <div className={styles.heroGrid}>
            <h1>Tu imagen. Tu objeto.</h1>

            <p>
              Elige una pieza, selecciona una fotografía y crea un
              producto que conserve el momento fuera de la pantalla.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.catalog}>
        <div className="page-container">
          <ProductsCatalog
            initialDesignSlug={initialDesignSlug}
          />
        </div>
      </section>
    </>
  );
}
