"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui";
import { useAuth } from "@/features/auth/auth-context";
import { useFavorites } from "@/features/favorites/favorites-context";
import {
  getCart,
  subscribeToCart,
  type CartItem,
} from "@/lib/cart";
import { cn } from "@/lib/utils/cn";
import styles from "./site-header.module.css";

const NAVIGATION_ITEMS = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/products",
    label: "Productos",
  },
  {
    href: "/designs",
    label: "Diseños",
  },
] as const;

const EMPTY_CART: CartItem[] = [];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
  } = useAuth();

  const cart = useSyncExternalStore(
    subscribeToCart,
    getCart,
    () => EMPTY_CART,
  );

  const {
    favoriteCount,
    isLoading: areFavoritesLoading,
  } = useFavorites();

  const itemCount = cart.reduce(
    (totalQuantity, item) => totalQuantity + item.quantity,
    0,
  );

  function isActiveRoute(href: string): boolean {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function handleLogout(): void {
    logout();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand} aria-label="OHO 2.0">
          <span>OHO</span>
          <strong>2.0</strong>
        </Link>

        <nav
          className={styles.navigation}
          aria-label="Navegación principal"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                styles.navigationLink,
                isActiveRoute(item.href) && styles.activeLink,
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link
            href="/favorites"
            className={styles.actionLink}
            aria-label={`Favoritos: ${favoriteCount}`}
          >
            <span aria-hidden="true">♡</span>
            <span className={styles.actionLabel}>Favoritos</span>

            {!areFavoritesLoading && favoriteCount > 0 ? (
              <span className={styles.counter}>
                {favoriteCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/cart"
            className={styles.actionLink}
            aria-label={`Carrito: ${itemCount} productos`}
          >
            <span aria-hidden="true">◎</span>
            <span className={styles.actionLabel}>Carrito</span>

            {itemCount > 0 ? (
              <span className={styles.counter}>{itemCount}</span>
            ) : null}
          </Link>

          {!isAuthLoading ? (
            isAuthenticated ? (
              <div className={styles.account}>
                <Link
                  href="/account"
                  className={styles.accountLink}
                >
                  {user?.name.split(" ")[0]}
                </Link>

                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleLogout}
                >
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login" className={styles.loginLink}>
                Iniciar sesión
              </Link>
            )
          ) : (
            <span
              className={styles.sessionPlaceholder}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </header>
  );
}
