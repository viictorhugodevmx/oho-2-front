import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogService } from "@/services";
import { ProductCustomizer } from "./product-customizer";
import styles from "./product-detail.module.css";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    design?: string | string[];
  }>;
}

function getProduct(slug: string) {
  return catalogService
    .filterProducts({
      category: "all",
      query: "",
      sort: "featured",
    })
    .find((product) => product.slug === slug);
}

function resolveDesignSlug(
  designParam: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(designParam)) {
    return designParam[0];
  }

  return designParam;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const initialDesignSlug = resolveDesignSlug(query.design);

  return (
    <main className={styles.page}>
      <div className="page-container">
        <ProductCustomizer
          productSlug={product.slug}
          initialDesignSlug={initialDesignSlug}
        />
      </div>
    </main>
  );
}
