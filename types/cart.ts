import type { EntityId } from "./common";
import type { Design } from "./design";
import type { Product } from "./product";

export interface SelectedOption {
  optionId: EntityId;
  optionName: string;
  valueId: EntityId;
  valueLabel: string;
  value: string;
  priceModifier: number;
  colorHex?: string;
}

export interface ProductConfiguration {
  product: Product;
  design: Design;
  selectedOptions: SelectedOption[];
  quantity: number;
  unitPrice: number;
}

export interface CartItem extends ProductConfiguration {
  id: EntityId;
  lineTotal: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}
