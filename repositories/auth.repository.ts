import {
  readStorage,
  removeStorage,
  writeStorage,
} from "@/lib/storage/browser-storage";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";
import { mockUsers } from "@/mocks";
import type { Session, StoredUser } from "@/types";

function getUsers(): StoredUser[] {
  return readStorage<StoredUser[]>(STORAGE_KEYS.users, mockUsers);
}

export const authRepository = {
  getUsers,

  findUserByEmail(email: string): StoredUser | undefined {
    const normalizedEmail = email.trim().toLowerCase();

    return getUsers().find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );
  },

  saveUser(user: StoredUser): void {
    const users = getUsers();
    writeStorage(STORAGE_KEYS.users, [...users, user]);
  },

  getSession(): Session | null {
    return readStorage<Session | null>(STORAGE_KEYS.session, null);
  },

  saveSession(session: Session): void {
    writeStorage(STORAGE_KEYS.session, session);
  },

  clearSession(): void {
    removeStorage(STORAGE_KEYS.session);
  },
};
