import type { StoredUser } from "@/types";

export const DEMO_CREDENTIALS = {
  email: "demo@oho20.mx",
  password: "OhoDemo20",
} as const;

export const mockUsers: StoredUser[] = [
  {
    id: "user-demo-001",
    name: "Cliente OHO",
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    role: "customer",
    avatarUrl:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
    createdAt: "2026-08-01T18:00:00.000Z",
  },
];
