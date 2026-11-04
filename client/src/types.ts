export const CATEGORIES = [
  "top",
  "bottom",
  "dress",
  "outerwear",
  "shoes",
  "accessory",
  "hijab",
  "abaya",
] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter", "all"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Season = (typeof SEASONS)[number];
export type Filters = {
  category: Category | "all";
  season: Season | "all";
  color: string;
  favoritesOnly: boolean;
};

export const DEFAULT_FILTERS: Filters = {
  category: "all",
  season: "all",
  color: "all",
  favoritesOnly: false,
};

export interface Item {
  id: number;
  name: string;
  category: Category;
  color: string;
  season: Season;
  favorite: boolean;
  image_url: string;
  created_at: string;
}

export type ItemInput = Omit<Item, "id" | "created_at">;
