import type { Metadata } from "next";
import { AccountContent } from "./account-content";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description:
    "Consulta tu perfil y el historial de pedidos de OHO 2.0.",
};

export default function AccountPage() {
  return <AccountContent />;
}
