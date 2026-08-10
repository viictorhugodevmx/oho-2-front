import { createId } from "@/lib/utils/create-id";
import { cartRepository } from "@/repositories";
import type {
  Cart,
  CartItem,
  ProductConfiguration,
} from "@/types";
import { pricingService } from "./pricing.service";

function buildCart(items: CartItem[]): Cart {
  const totals = pricingService.calculateCartTotals(items);

  return {
    items,
    ...totals,
  };
}

export const cartService = {
  getCart(): Cart {
    return buildCart(cartRepository.getItems());
  },

  addItem(configuration: ProductConfiguration): Cart {
    const items = cartRepository.getItems();

    const unitPrice = pricingService.calculateUnitPrice(
      configuration.product,
      configuration.selectedOptions,
    );

    const cartItem: CartItem = {
      ...configuration,
      id: createId("cart"),
      quantity: Math.max(1, configuration.quantity),
      unitPrice,
      lineTotal: pricingService.calculateLineTotal(
        unitPrice,
        configuration.quantity,
      ),
      addedAt: new Date().toISOString(),
    };

    const nextItems = [...items, cartItem];
    cartRepository.saveItems(nextItems);

    return buildCart(nextItems);
  },

  updateQuantity(itemId: string, quantity: number): Cart {
    const safeQuantity = Math.max(1, quantity);

    const nextItems = cartRepository.getItems().map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantity: safeQuantity,
            lineTotal: pricingService.calculateLineTotal(
              item.unitPrice,
              safeQuantity,
            ),
          }
        : item,
    );

    cartRepository.saveItems(nextItems);

    return buildCart(nextItems);
  },

  removeItem(itemId: string): Cart {
    const nextItems = cartRepository
      .getItems()
      .filter((item) => item.id !== itemId);

    cartRepository.saveItems(nextItems);

    return buildCart(nextItems);
  },

  clear(): Cart {
    cartRepository.clear();

    return buildCart([]);
  },
};
