import type { EntityId } from "./common";
import type { CartItem } from "./cart";

export type PaymentMethod = "card" | "cash-demo";

export type OrderStatus =
  | "payment-approved"
  | "order-created"
  | "sent-to-print-partner";

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  checkoutId?: string;
  contactEmail: string;
  deliveryNotes?: string;
  guestSessionId?: string;
}

export interface Order {
  id: EntityId;
  orderNumber: string;
  userId: EntityId | null;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  checkoutId?: string;
  contactEmail?: string;
  deliveryNotes?: string;
  guestSessionId?: string;
  createdAt: string;
}
