import { createId } from "@/lib/utils/create-id";
import { delay } from "@/lib/utils/delay";
import { authRepository } from "@/repositories";
import type {
  AuthResult,
  LoginCredentials,
  RegisterData,
  Session,
  StoredUser,
  User,
} from "@/types";

function sanitizeUser(storedUser: StoredUser): User {
  return {
    id: storedUser.id,
    name: storedUser.name,
    email: storedUser.email,
    role: storedUser.role,
    avatarUrl: storedUser.avatarUrl,
    createdAt: storedUser.createdAt,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await delay();

    const user = authRepository.findUserByEmail(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error("El correo o la contraseña son incorrectos.");
    }

    const publicUser = sanitizeUser(user);
    const session: Session = {
      user: publicUser,
      createdAt: new Date().toISOString(),
    };

    authRepository.saveSession(session);

    return {
      user: publicUser,
      session,
    };
  },

  async register(data: RegisterData): Promise<AuthResult> {
    await delay();

    const name = data.name.trim();
    const email = normalizeEmail(data.email);

    if (name.length < 2) {
      throw new Error("Ingresa un nombre válido.");
    }

    if (!email.includes("@")) {
      throw new Error("Ingresa un correo válido.");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    if (authRepository.findUserByEmail(email)) {
      throw new Error("Ya existe una cuenta registrada con ese correo.");
    }

    const storedUser: StoredUser = {
      id: createId("user"),
      name,
      email,
      password: data.password,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    authRepository.saveUser(storedUser);

    const publicUser = sanitizeUser(storedUser);
    const session: Session = {
      user: publicUser,
      createdAt: new Date().toISOString(),
    };

    authRepository.saveSession(session);

    return {
      user: publicUser,
      session,
    };
  },

  getSession(): Session | null {
    return authRepository.getSession();
  },

  logout(): void {
    authRepository.clearSession();
  },
};
