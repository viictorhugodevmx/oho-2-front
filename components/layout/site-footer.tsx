import Link from "next/link";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <Link href="/" className={styles.brand}>
            OHO 2.0
          </Link>

          <p className={styles.description}>
            Fotografía urbana y musical convertida en objetos para usar,
            coleccionar y compartir.
          </p>
        </div>

        <nav className={styles.links} aria-label="Navegación del pie de página">
          <Link href="/products">Productos</Link>
          <Link href="/designs">Diseños</Link>
          <Link href="/favorites">Favoritos</Link>
          <Link href="/account">Mis pedidos</Link>
        </nav>

        <p className={styles.legal}>
          © {new Date().getFullYear()} OHO 2.0. Demo de comercio electrónico.
        </p>
      </div>
    </footer>
  );
}
