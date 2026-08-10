import type { EntityId } from "./common";

export type DesignCategory =
  | "concert"
  | "street"
  | "studio"
  | "backstage"
  | "portrait";

export interface Design {
  id: EntityId;
  slug: string;
  title: string;
  description: string;
  category: DesignCategory;
  imageUrl: string;
  photographer: string;
  photographerUrl: string;
  featured: boolean;
  drop: string;
  tags: string[];
}
