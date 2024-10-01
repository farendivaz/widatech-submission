import { create } from "zustand";
import { Invoice, RevenueData } from "./types";

interface InvoiceStore {
  invoices: Invoice[];
  revenueData: RevenueData[];
  interval: "daily" | "weekly" | "monthly";
  loading: boolean;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  setInvoices: (invoices: Invoice[]) => void;
  setLoading: (loading: boolean) => void;
  setRevenueData: (data: RevenueData[]) => void;
  setInterval: (interval: "daily" | "weekly" | "monthly") => void;
  fetchInvoices: (page?: number) => Promise<void>;
  fetchMoreInvoices: () => Promise<void>;
  fetchRevenueData: () => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  revenueData: [],
  interval: "daily",
  loading: false,
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  setInvoices: (invoices) => set({ invoices }),
  setRevenueData: (data) => set({ revenueData: data }),
  setInterval: (interval) => set({ interval }),
  setLoading: (loading) => set({ loading }),

  fetchInvoices: async (page = 1) => {
    set({ loading: true });
    try {
      const response = await fetch(
        `http://localhost:3001/api/invoices?page=${page}&limit=10`
      );
      const data = await response.json();
      set((state) => ({
        invoices:
          page === 1 ? data.invoices : [...state.invoices, ...data.invoices],
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        hasMore: data.currentPage < data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchRevenueData: async () => {
    set({ loading: true });
    try {
      const { interval } = get();
      const response = await fetch(
        `http://localhost:3001/api/revenue?interval=${interval}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch revenue data");
      }
      const data = await response.json();
      set({ revenueData: data.data });
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMoreInvoices: async () => {
    const { currentPage, hasMore, loading } = get();
    if (!hasMore || loading) return;
    await get().fetchInvoices(currentPage + 1);
  },
}));
