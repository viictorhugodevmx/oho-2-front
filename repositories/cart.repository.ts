import { readStorage, writeStorage } from "@/lib/storage/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import type { CartItem } from "@/types";

export const cartRepository = {
  getItems(): CartItem[] {
    return readStorage<CartItem[]>(STORAGE_KEYS.cart, []);
  },

  saveItems(items: CartItem[]): void {
    writeStorage(STORAGE_KEYS.cart, items);
  },

  clear(): void {
    writeStorage(STORAGE_KEYS.cart, []);
  },
};
