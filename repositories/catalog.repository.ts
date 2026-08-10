import { mockDesigns, mockProducts } from "@/mocks";
import type { Design, Product } from "@/types";

export const catalogRepository = {
  getDesigns(): Design[] {
    return mockDesigns;
  },

  getDesignById(id: string): Design | undefined {
    return mockDesigns.find((design) => design.id === id);
  },

  getDesignBySlug(slug: string): Design | undefined {
    return mockDesigns.find((design) => design.slug === slug);
  },

  getProducts(): Product[] {
    return mockProducts.filter((product) => product.active);
  },

  getProductById(id: string): Product | undefined {
    return mockProducts.find(
      (product) => product.id === id && product.active,
    );
  },

  getProductBySlug(slug: string): Product | undefined {
    return mockProducts.find(
      (product) => product.slug === slug && product.active,
    );
  },
};
