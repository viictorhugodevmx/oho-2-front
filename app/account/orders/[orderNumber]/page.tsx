import type { Metadata } from "next";
import { OrderDetailContent } from "./order-detail-content";

interface OrderDetailPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export const metadata: Metadata = {
  title: "Detalle del pedido",
  description:
    "Consulta el estado y los detalles de tu pedido OHO.",
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderNumber } = await params;

  return (
    <OrderDetailContent
      orderNumber={decodeURIComponent(orderNumber)}
    />
  );
}
