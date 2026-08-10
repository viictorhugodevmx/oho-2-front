import {
  readStorage,
  writeStorage,
} from "@/lib/storage/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { mockOrders } from "@/mocks";
import type { Order } from "@/types";

function getOrders(): Order[] {
  return readStorage<Order[]>(
    STORAGE_KEYS.orders,
    mockOrders,
  );
}

export const orderRepository = {
  getOrders,

  getById(id: string): Order | undefined {
    return getOrders().find((order) => order.id === id);
  },

  getByOrderNumber(
    orderNumber: string,
  ): Order | undefined {
    return getOrders().find(
      (order) => order.orderNumber === orderNumber,
    );
  },

  getByCheckoutId(
    checkoutId: string,
  ): Order | undefined {
    return getOrders().find(
      (order) => order.checkoutId === checkoutId,
    );
  },

  getByUserId(userId: string): Order[] {
    return getOrders()
      .filter((order) => order.userId === userId)
      .sort(
        (firstOrder, secondOrder) =>
          new Date(secondOrder.createdAt).getTime() -
          new Date(firstOrder.createdAt).getTime(),
      );
  },

  save(order: Order): void {
    const orders = getOrders();
    const existingOrderIndex = orders.findIndex(
      (storedOrder) => storedOrder.id === order.id,
    );

    if (existingOrderIndex === -1) {
      writeStorage(
        STORAGE_KEYS.orders,
        [order, ...orders],
      );

      return;
    }

    const updatedOrders = orders.map((storedOrder) =>
      storedOrder.id === order.id ? order : storedOrder,
    );

    writeStorage(STORAGE_KEYS.orders, updatedOrders);
  },
};
