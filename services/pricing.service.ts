import type { Product, SelectedOption } from "@/types";

export const SHIPPING_PRICE = 99;
export const FREE_SHIPPING_MINIMUM = 1_200;

export const pricingService = {
  calculateUnitPrice(
    product: Product,
    selectedOptions: SelectedOption[],
  ): number {
    const optionAdjustments = selectedOptions.reduce(
      (total, selectedOption) => total + selectedOption.priceModifier,
      0,
    );

    return product.basePrice + optionAdjustments;
  },

  calculateLineTotal(unitPrice: number, quantity: number): number {
    return unitPrice * Math.max(1, quantity);
  },

  calculateShipping(subtotal: number): number {
    if (subtotal === 0 || subtotal >= FREE_SHIPPING_MINIMUM) {
      return 0;
    }

    return SHIPPING_PRICE;
  },

  calculateCartTotals(
    items: Array<{ lineTotal: number }>,
  ): {
    subtotal: number;
    shipping: number;
    total: number;
  } {
    const subtotal = items.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    const shipping = this.calculateShipping(subtotal);

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  },
};
