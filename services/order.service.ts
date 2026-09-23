import { createId } from "@/lib/utils/create-id";
import { getGuestSessionId } from "@/lib/checkout/guest-session";
import { orderRepository } from "@/repositories";
import type { Cart, CheckoutData, Order } from "@/types";

function createOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const randomSection = Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase();

  return `OHO-${timestamp}-${randomSection}`;
}

function getGuestOrder(orderNumber: string): Order | undefined {
  const guestSessionId = getGuestSessionId();

  if (!guestSessionId) {
    return undefined;
  }

  const order = orderRepository.getByOrderNumber(orderNumber);

  if (
    !order ||
    order.userId !== null ||
    order.guestSessionId !== guestSessionId
  ) {
    return undefined;
  }

  return order;
}

export const orderService = {
  getById(orderId: string): Order | undefined {
    return orderRepository.getById(orderId);
  },

  getByOrderNumber(orderNumber: string): Order | undefined {
    return orderRepository.getByOrderNumber(orderNumber);
  },

  getByOrderNumberForUser(
    orderNumber: string,
    userId: string,
  ): Order | undefined {
    const order = orderRepository.getByOrderNumber(orderNumber);

    if (!order || order.userId !== userId) {
      return undefined;
    }

    return order;
  },

  getByCheckoutIdForUser(
    checkoutId: string,
    userId: string,
  ): Order | undefined {
    const order = orderRepository.getByCheckoutId(checkoutId);

    if (!order || order.userId !== userId) {
      return undefined;
    }

    return order;
  },

  getForGuest(orderNumber: string): Order | undefined {
    return getGuestOrder(orderNumber);
  },

  getByCheckoutIdForGuest(checkoutId: string): Order | undefined {
    const order = orderRepository.getByCheckoutId(checkoutId);

    return order ? getGuestOrder(order.orderNumber) : undefined;
  },

  getByUserId(userId: string): Order[] {
    return orderRepository.getByUserId(userId);
  },

  async createOrder(
    userId: string | null,
    cart: Cart,
    checkoutData: CheckoutData,
  ): Promise<Order> {
    const guestSessionId = userId ? undefined : getGuestSessionId();

    if (
      !userId &&
      (!guestSessionId ||
        guestSessionId !== checkoutData.guestSessionId)
    ) {
      throw new Error(
        "La sesión de invitado no está disponible. Vuelve a iniciar el checkout.",
      );
    }

    const contactEmail = checkoutData.contactEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      throw new Error("Ingresa un correo de contacto válido.");
    }

    if (cart.items.length === 0) {
      throw new Error("No puedes crear un pedido con el carrito vacío.");
    }

    if (checkoutData.checkoutId) {
      const existingOrder = orderRepository.getByCheckoutId(
        checkoutData.checkoutId,
      );

      if (existingOrder) {
        if (
          existingOrder.userId !== userId ||
          (!userId && existingOrder.guestSessionId !== guestSessionId)
        ) {
          throw new Error(
            "El identificador del checkout no pertenece a este comprador.",
          );
        }

        return existingOrder;
      }
    }

    const order: Order = {
      id: createId("order"),
      orderNumber: createOrderNumber(),
      userId,
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      total: cart.total,
      status: "sent-to-print-partner",
      shippingAddress: checkoutData.shippingAddress,
      paymentMethod: checkoutData.paymentMethod,
      checkoutId: checkoutData.checkoutId,
      contactEmail,
      deliveryNotes: checkoutData.deliveryNotes?.trim(),
      guestSessionId: guestSessionId ?? undefined,
      createdAt: new Date().toISOString(),
    };

    // La aprobación y el envío al impresor siguen siendo simulados.
    // No introducir una espera entre comprobar duplicados y guardar.
    orderRepository.save(order);

    return order;
  },
};
