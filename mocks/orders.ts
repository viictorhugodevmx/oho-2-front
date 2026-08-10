import type { Order } from "@/types";
import { mockDesigns } from "./designs";
import { mockProducts } from "./products";

const seededProduct = mockProducts[0];
const seededDesign = mockDesigns[0];

export const mockOrders: Order[] =
  seededProduct && seededDesign
    ? [
        {
          id: "order-seed-001",
          orderNumber: "OHO-2001",
          userId: "user-demo-001",
          items: [
            {
              id: "cart-seed-001",
              product: seededProduct,
              design: seededDesign,
              selectedOptions: [
                {
                  optionId: "size",
                  optionName: "Talla",
                  valueId: "size-l",
                  valueLabel: "L",
                  value: "l",
                  priceModifier: 0,
                },
                {
                  optionId: "color",
                  optionName: "Color",
                  valueId: "color-black",
                  valueLabel: "Negro",
                  value: "black",
                  priceModifier: 0,
                  colorHex: "#111111",
                },
              ],
              quantity: 1,
              unitPrice: 449,
              lineTotal: 449,
              addedAt: "2026-08-02T16:30:00.000Z",
            },
          ],
          subtotal: 449,
          shipping: 99,
          total: 548,
          status: "sent-to-print-partner",
          shippingAddress: {
            fullName: "Cliente OHO",
            street: "Avenida Central 200",
            city: "Tuxtla Gutiérrez",
            state: "Chiapas",
            postalCode: "29000",
            country: "México",
            phone: "9610000000",
          },
          paymentMethod: "card",
          createdAt: "2026-08-02T16:35:00.000Z",
        },
      ]
    : [];
