import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";
import type { Supplier } from "@/pages/suppliers/columns";

export function useAllSuppliers() {
  const { toast } = useToast();

  return useQuery<Supplier[]>({
    queryKey: ["suppliers.all"],
    queryFn: async () => {
      try {
        const response = await api.get<{ suppliers: Supplier[] }>(
          "/suppliers?limit=100" // Get all suppliers for dropdown
        );
        return response.suppliers;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch suppliers. Please try again.",
        });
        throw error;
      }
    },
  });
}
