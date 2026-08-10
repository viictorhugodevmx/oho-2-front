import { catalogRepository } from "@/repositories";
import type {
  Design,
  Product,
  ProductCategory,
  ProductFilters,
} from "@/types";

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("es");
}

export const catalogService = {
  getDesigns(): Design[] {
    return catalogRepository.getDesigns();
  },

  getFeaturedDesigns(): Design[] {
    return catalogRepository
      .getDesigns()
      .filter((design) => design.featured);
  },

  getDesignById(id: string): Design | undefined {
    return catalogRepository.getDesignById(id);
  },

  getDesignBySlug(slug: string): Design | undefined {
    return catalogRepository.getDesignBySlug(slug);
  },

  getProducts(): Product[] {
    return catalogRepository.getProducts();
  },

  getFeaturedProducts(): Product[] {
    return catalogRepository
      .getProducts()
      .filter((product) => product.featured);
  },

  getProductById(id: string): Product | undefined {
    return catalogRepository.getProductById(id);
  },

  getProductBySlug(slug: string): Product | undefined {
    return catalogRepository.getProductBySlug(slug);
  },

  getProductCategories(): ProductCategory[] {
    return ["apparel", "accessories", "wall-art", "objects"];
  },

  filterProducts(filters: ProductFilters): Product[] {
    const query = normalizeText(filters.query);

    const filteredProducts = catalogRepository
      .getProducts()
      .filter((product) => {
        const matchesCategory =
          filters.category === "all" ||
          product.category === filters.category;

        const searchableText = normalizeText(
          [
            product.name,
            product.shortDescription,
            product.description,
            product.category,
          ].join(" "),
        );

        const matchesQuery =
          query.length === 0 || searchableText.includes(query);

        return matchesCategory && matchesQuery;
      });

    return [...filteredProducts].sort((firstProduct, secondProduct) => {
      switch (filters.sort) {
        case "price-asc":
          return firstProduct.basePrice - secondProduct.basePrice;

        case "price-desc":
          return secondProduct.basePrice - firstProduct.basePrice;

        case "name":
          return firstProduct.name.localeCompare(secondProduct.name, "es");

        case "featured":
        default:
          return Number(secondProduct.featured) - Number(firstProduct.featured);
      }
    });
  },
};
