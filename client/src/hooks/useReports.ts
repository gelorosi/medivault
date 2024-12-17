import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";

export interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: "OTC" | "PRESCRIPTION";
  minStockLevel: number;
  expiryDate: string;
  description?: string;
  supplierId: string;
  supplier?: {
    name: string;
  };
}

export interface LowStockProduct extends Product {
  quantity: number;
  minStockLevel: number;
}

export interface ExpiringProduct extends Product {
  daysUntilExpiry: number;
}

interface InventoryStatus {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  totalSuppliers: number;
  expiringCount: number;
  products: Product[];
}

export interface Report {
  totalProducts: number;
  lowStock: LowStockProduct[];
  expiringProducts: ExpiringProduct[];
}

export function useReports() {
  const { toast } = useToast();

  return useQuery<Report>({
    queryKey: ["reports"],
    queryFn: async () => {
      try {
        const [lowStock, expiringProducts, inventoryStatus] = await Promise.all(
          [
            api.get<LowStockProduct[]>("/reports/low-stock"),
            api.get<ExpiringProduct[]>("/reports/expiring-soon"),
            api.get<InventoryStatus>("/reports/inventory-status"),
          ]
        );

        return {
          totalProducts: inventoryStatus.totalProducts,
          lowStock: lowStock,
          expiringProducts: expiringProducts,
        };
      } catch (error) {
        console.error("Failed to fetch reports:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch reports. Please try again.",
        });
        throw error;
      }
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    refetchOnMount: true,
  });
}
