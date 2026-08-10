import Link from "next/link";
import { Badge } from "@/components/ui";
import styles from "./page.module.css";

const CATEGORIES = [
  {
    number: "01",
    title: "Fotografía urbana",
    description:
      "Escenas, texturas y detalles de la ciudad convertidos en piezas para usar todos los días.",
    href: "/designs?category=urban",
  },
  {
    number: "02",
    title: "Música en imágenes",
    description:
      "Momentos, luces y energía de conciertos capturados en diseños con identidad propia.",
    href: "/designs?category=music",
  },
  {
    number: "03",
    title: "Productos personalizados",
    description:
      "Elige un producto, combina tu diseño favorito y crea una pieza hecha a tu manera.",
    href: "/products",
  },
] as const;

const PROCESS_STEPS = [
  {
    number: "1",
    title: "Elige un producto",
    description: "Explora los productos disponibles y selecciona tu favorito.",
  },
  {
    number: "2",
    title: "Selecciona un diseño",
    description: "Combínalo con fotografía urbana o musical de OHO.",
  },
  {
    number: "3",
    title: "Hazlo tuyo",
    description: "Configura los detalles, agrégalo al carrito y completa tu pedido.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`page-container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <Badge variant="accent">Fotografía que se transforma</Badge>

            <h1 className={styles.heroTitle}>
              La ciudad y la música,
              <span> ahora en tus manos.</span>
            </h1>

            <p className={styles.heroDescription}>
              OHO 2.0 convierte fotografía urbana y musical en productos
              personalizados para usar, coleccionar y compartir.
            </p>

            <div className={styles.heroActions}>
              <Link href="/products" className={styles.primaryAction}>
                Explorar productos
              </Link>

              <Link href="/designs" className={styles.secondaryAction}>
                Ver diseños
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.visualCard}>
              <span className={styles.visualLabel}>OHO / URBAN SERIES</span>

              <div className={styles.visualArtwork}>
                <span className={styles.visualWord}>MIRA</span>
                <span className={styles.visualWordAccent}>DISTINTO</span>
              </div>

              <span className={styles.visualEdition}>EDICIÓN 02 · 2026</span>
            </div>

            <div className={styles.floatingNote}>
              <span>Diseño destacado</span>
              <strong>Ciudad en rojo</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.categories}>
        <div className="page-container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrow}>Explora OHO</span>
              <h2 className={styles.sectionTitle}>
                Imágenes con una nueva forma.
              </h2>
            </div>

            <p className={styles.sectionDescription}>
              Cada diseño parte de una fotografía y termina convertido en un
              objeto que puede acompañarte.
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <Link
                key={category.number}
                href={category.href}
                className={styles.categoryCard}
              >
                <span className={styles.categoryNumber}>{category.number}</span>

                <div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <span className={styles.categoryArrow} aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className="page-container">
          <div className={styles.processHeading}>
            <span className={styles.eyebrow}>Así funciona</span>
            <h2 className={styles.sectionTitle}>De la imagen al producto.</h2>
          </div>

          <div className={styles.processGrid}>
            {PROCESS_STEPS.map((step) => (
              <article key={step.number} className={styles.processCard}>
                <span className={styles.processNumber}>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.callToAction}>
        <div className={`page-container ${styles.callToActionContainer}`}>
          <div>
            <span className={styles.callToActionEyebrow}>
              Tu próxima pieza empieza aquí
            </span>

            <h2>Encuentra una imagen que también cuente algo de ti.</h2>
          </div>

          <Link href="/designs" className={styles.lightAction}>
            Explorar la colección
          </Link>
        </div>
      </section>
    </>
  );
}
