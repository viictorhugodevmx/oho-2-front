import type { Metadata } from "next";
import { FavoritesContent } from "./favorites-content";
import styles from "./favorites.module.css";

export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Consulta los diseños que guardaste como favoritos en OHO 2.0.",
};

export default function FavoritesPage() {
  return (
    <main className={styles.page}>
      <div className="page-container">
        <FavoritesContent />
      </div>
    </main>
  );
}
