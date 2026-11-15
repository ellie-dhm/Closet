export type NamedCount = { name: string; value: number };

export type Stats = {
  summary: {
    total: number;
    favorites: number;
    topCategory: string | null;
    topColor: string | null;
  };
  byCategory: NamedCount[];
  bySeason: NamedCount[];
  byColor: NamedCount[];
  timeline: { date: string; value: number }[];
};

export type DashboardFilters = {
  season: string;
  category: string;
  from: string;
  to: string;
};
