import { create } from "zustand";
import type { Stats, DashboardFilters } from "./types/stats";

const API_URL = "http://localhost:3001"; // use your existing API base if you have one

interface DashboardState {
  stats: Stats | null;
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  fetchStats: () => Promise<void>;
  setFilters: (patch: Partial<DashboardFilters>) => void;
  resetFilters: () => void;
}

let latestRequest = 0; // ignore stale responses when filters change quickly

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  loading: false,
  error: null,
  filters: { season: "", category: "", from: "", to: "" },

  fetchStats: async () => {
    const requestId = ++latestRequest;
    set({ loading: true, error: null });

    const params = new URLSearchParams();
    Object.entries(get().filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    try {
      const res = await fetch(`${API_URL}/api/stats?${params}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data: Stats = await res.json();
      if (requestId !== latestRequest) return; // a newer request superseded this one
      set({ stats: data, loading: false });
    } catch (err) {
      if (requestId !== latestRequest) return;
      set({
        error: err instanceof Error ? err.message : "Something went wrong",
        loading: false,
      });
    }
  },

  setFilters: (patch) => {
    set((state) => ({ filters: { ...state.filters, ...patch } }));
    get().fetchStats();
  },

  resetFilters: () => {
    set({ filters: { season: "", category: "", from: "", to: "" } });
    get().fetchStats();
  },
}));
