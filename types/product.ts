import type { EntityId } from "./common";

export type ProductCategory =
  | "apparel"
  | "accessories"
  | "wall-art"
  | "objects";

export type ProductSort =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name";

export interface ProductOptionValue {
  id: EntityId;
  label: string;
  value: string;
  priceModifier: number;
  colorHex?: string;
}

export interface ProductOption {
  id: EntityId;
  name: string;
  values: ProductOptionValue[];
}

export interface PrintArea {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface Product {
  id: EntityId;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ProductCategory;
  basePrice: number;
  imageUrl: string;
  gallery: string[];
  featured: boolean;
  active: boolean;
  badge?: string;
  options: ProductOption[];
  printArea: PrintArea;
}

export interface ProductFilters {
  query: string;
  category: ProductCategory | "all";
  sort: ProductSort;
}
