import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  expiringCount: number;
  suppliersCount: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: "OTC" | "PRESCRIPTION";
  minStockLevel: number;
  expiryDate: string;
  description?: string;
  supplierId: string;
}

interface InventoryStatusResponse {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  totalSuppliers: number;
  expiringCount: number;
  products: Product[];
}

export function useDashboardStats() {
  const { toast } = useToast();

  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const data = await api.get<InventoryStatusResponse>(
          "/reports/inventory-status"
        );

        return {
          totalProducts: data.totalProducts || 0,
          lowStockCount: data.lowStockCount || 0,
          expiringCount: data.expiringCount || 0,
          suppliersCount: data.totalSuppliers || 0,
        };
      } catch (error) {
        console.error("Dashboard stats error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch stats. Please try again.",
        });
        throw error;
      }
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    refetchOnMount: true,
  });
}
