export type EntityId = string;

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface PriceAdjustment {
  label: string;
  amount: number;
}
