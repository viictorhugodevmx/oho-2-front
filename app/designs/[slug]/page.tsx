import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignCard } from "@/components/designs";
import { catalogService } from "@/services";
import { DesignDetailActions } from "./design-detail-actions";
import styles from "./design-detail.module.css";

interface DesignDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return catalogService.getDesigns().map((design) => ({
    slug: design.slug,
  }));
}

export async function generateMetadata({
  params,
}: DesignDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const design = catalogService.getDesignBySlug(slug);

  if (!design) {
    return {
      title: "Diseño no encontrado",
    };
  }

  return {
    title: design.title,
    description: design.description,
  };
}

export default async function DesignDetailPage({
  params,
}: DesignDetailPageProps) {
  const { slug } = await params;
  const design = catalogService.getDesignBySlug(slug);

  if (!design) {
    notFound();
  }

  const relatedDesigns = catalogService
    .getDesigns()
    .filter(
      (candidate) =>
        candidate.id !== design.id &&
        candidate.category === design.category,
    )
    .slice(0, 3);

  return (
    <>
      <section className={styles.detail}>
        <div className={`page-container ${styles.detailContainer}`}>
          <div className={styles.breadcrumbs}>
            <Link href="/designs">Diseños</Link>
            <span aria-hidden="true">/</span>
            <span>{design.title}</span>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.visual}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.imageUrl}
                alt={design.title}
                className={styles.image}
              />

              {design.featured ? (
                <span className={styles.featured}>Destacado</span>
              ) : null}

              <span className={styles.drop}>{design.drop}</span>
            </div>

            <div className={styles.content}>
              <span className={styles.category}>
                {design.category}
              </span>

              <h1>{design.title}</h1>

              <p className={styles.description}>
                {design.description}
              </p>

              <DesignDetailActions design={design} />

              <dl className={styles.metadata}>
                <div>
                  <dt>Fotografía</dt>
                  <dd>
                    <a
                      href={design.photographerUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {design.photographer}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </dd>
                </div>

                <div>
                  <dt>Categoría</dt>
                  <dd>{design.category}</dd>
                </div>

                <div>
                  <dt>Colección</dt>
                  <dd>{design.drop}</dd>
                </div>
              </dl>

              {design.tags.length > 0 ? (
                <div className={styles.tags}>
                  <span className={styles.tagsLabel}>Etiquetas</span>

                  <div className={styles.tagList}>
                    {design.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {relatedDesigns.length > 0 ? (
        <section className={styles.related}>
          <div className="page-container">
            <div className={styles.relatedHeader}>
              <div>
                <span className={styles.eyebrow}>
                  Sigue explorando
                </span>

                <h2>Diseños relacionados</h2>
              </div>

              <Link href="/designs" className={styles.viewAll}>
                Ver toda la colección
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.relatedGrid}>
              {relatedDesigns.map((relatedDesign) => (
                <DesignCard
                  key={relatedDesign.id}
                  design={relatedDesign}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
