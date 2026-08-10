import { readStorage, writeStorage } from "@/lib/storage/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

export const favoritesRepository = {
  getIds(): string[] {
    return readStorage<string[]>(STORAGE_KEYS.favorites, []);
  },

  saveIds(designIds: string[]): void {
    writeStorage(STORAGE_KEYS.favorites, designIds);
  },

  clear(): void {
    writeStorage(STORAGE_KEYS.favorites, []);
  },
};
