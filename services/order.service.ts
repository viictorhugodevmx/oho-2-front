import { createId } from "@/lib/utils/create-id";
import { delay } from "@/lib/utils/delay";
import { orderRepository } from "@/repositories";
import type {
  Cart,
  CheckoutData,
  Order,
  OrderStatus,
} from "@/types";

function createOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const randomSection = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase();

  return `OHO-${timestamp}-${randomSection}`;
}

export const orderService = {
  getById(orderId: string): Order | undefined {
    return orderRepository.getById(orderId);
  },

  getByOrderNumber(
    orderNumber: string,
  ): Order | undefined {
    return orderRepository.getByOrderNumber(orderNumber);
  },

  getByOrderNumberForUser(
    orderNumber: string,
    userId: string,
  ): Order | undefined {
    const order =
      orderRepository.getByOrderNumber(orderNumber);

    if (!order || order.userId !== userId) {
      return undefined;
    }

    return order;
  },

  getByCheckoutIdForUser(
    checkoutId: string,
    userId: string,
  ): Order | undefined {
    const order =
      orderRepository.getByCheckoutId(checkoutId);

    if (!order || order.userId !== userId) {
      return undefined;
    }

    return order;
  },

  getByUserId(userId: string): Order[] {
    return orderRepository.getByUserId(userId);
  },

  async createOrder(
    userId: string,
    cart: Cart,
    checkoutData: CheckoutData,
  ): Promise<Order> {
    if (cart.items.length === 0) {
      throw new Error(
        "No puedes crear un pedido con el carrito vacío.",
      );
    }

    if (checkoutData.checkoutId) {
      const existingOrder =
        orderRepository.getByCheckoutId(
          checkoutData.checkoutId,
        );

      if (existingOrder) {
        if (existingOrder.userId !== userId) {
          throw new Error(
            "El identificador del checkout no pertenece a este usuario.",
          );
        }

        return existingOrder;
      }
    }

    await delay(600);

    const initialStatus: OrderStatus =
      "payment-approved";

    const order: Order = {
      id: createId("order"),
      orderNumber: createOrderNumber(),
      userId,
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      status: initialStatus,
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod,
      checkoutId: checkoutData.checkoutId,
      createdAt: new Date().toISOString(),
    };

    await delay(400);
    order.status = "order-created";

    await delay(400);
    order.status = "sent-to-print-partner";

    orderRepository.save(order);

    return order;
  },
};
