"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { favoritesService } from "@/services";

interface FavoritesContextValue {
  favoriteIds: string[];
  favoriteCount: number;
  isLoading: boolean;
  isFavorite: (designId: string) => boolean;
  toggleFavorite: (designId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFavoriteIds(favoritesService.getIds());
      setIsLoading(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const isFavorite = useCallback(
    (designId: string) => favoriteIds.includes(designId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((designId: string) => {
    setFavoriteIds(favoritesService.toggle(designId));
  }, []);

  const clearFavorites = useCallback(() => {
    favoritesService.clear();
    setFavoriteIds([]);
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      favoriteCount: favoriteIds.length,
      isLoading,
      isFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [
      clearFavorites,
      favoriteIds,
      isFavorite,
      isLoading,
      toggleFavorite,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider.",
    );
  }

  return context;
}
