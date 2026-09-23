import type { Metadata } from "next";
import { GuestConfirmation } from "./guest-confirmation";

export const metadata: Metadata = {
  title: "Confirmación del pedido",
  robots: {
    index: false,
    follow: false,
  },
};

interface ConfirmationPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { orderNumber } = await params;

  return (
    <GuestConfirmation
      key={orderNumber}
      orderNumber={orderNumber}
    />
  );
}
