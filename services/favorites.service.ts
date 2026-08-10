import { catalogRepository, favoritesRepository } from "@/repositories";
import type { Design } from "@/types";

export const favoritesService = {
  getIds(): string[] {
    return favoritesRepository.getIds();
  },

  getDesigns(): Design[] {
    const favoriteIds = new Set(favoritesRepository.getIds());

    return catalogRepository
      .getDesigns()
      .filter((design) => favoriteIds.has(design.id));
  },

  isFavorite(designId: string): boolean {
    return favoritesRepository.getIds().includes(designId);
  },

  toggle(designId: string): string[] {
    const favoriteIds = favoritesRepository.getIds();

    const nextIds = favoriteIds.includes(designId)
      ? favoriteIds.filter((id) => id !== designId)
      : [...favoriteIds, designId];

    favoritesRepository.saveIds(nextIds);

    return nextIds;
  },

  clear(): void {
    favoritesRepository.clear();
  },
};
