export interface CartItem {
  id: string;
  productSlug: string;
  productName: string;
  productImageUrl: string;
  designSlug: string;
  designTitle: string;
  designImageUrl: string;
  format: string;
  formatLabel: string;
  unitPrice: number;
  quantity: number;
}

const STORAGE_KEY = "oho-cart";
const CART_EVENT = "oho-cart-change";

let cachedRaw: string | null = null;
let cachedCart: CartItem[] = [];

function isBrowser() {
  return typeof window !== "undefined";
}

function createItemId(
  productSlug: string,
  designSlug: string,
  format: string,
) {
  return `${productSlug}::${designSlug}::${format}`;
}

export function getCart(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === cachedRaw) {
    return cachedCart;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedCart = [];
    return cachedCart;
  }

  try {
    const parsed = JSON.parse(raw);

    cachedCart = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedCart = [];
  }

  return cachedCart;
}

function saveCart(cart: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  const raw = JSON.stringify(cart);

  cachedRaw = raw;
  cachedCart = cart;

  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(CART_EVENT));
}

export function subscribeToCart(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      cachedRaw = null;
      callback();
    }
  }

  window.addEventListener(CART_EVENT, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CART_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function addCartItem(
  item: Omit<CartItem, "id">,
) {
  const id = createItemId(
    item.productSlug,
    item.designSlug,
    item.format,
  );

  const cart = getCart();
  const existingItem = cart.find(
    (cartItem) => cartItem.id === id,
  );

  if (existingItem) {
    saveCart(
      cart.map((cartItem) =>
        cartItem.id === id
          ? {
              ...cartItem,
              quantity: Math.min(
                10,
                cartItem.quantity + item.quantity,
              ),
            }
          : cartItem,
      ),
    );

    return;
  }

  saveCart([
    ...cart,
    {
      ...item,
      id,
    },
  ]);
}

export function updateCartItemQuantity(
  id: string,
  quantity: number,
) {
  if (quantity < 1) {
    removeCartItem(id);
    return;
  }

  saveCart(
    getCart().map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.min(10, quantity),
          }
        : item,
    ),
  );
}

export function removeCartItem(id: string) {
  saveCart(getCart().filter((item) => item.id !== id));
}

export function clearCart() {
  saveCart([]);
}
