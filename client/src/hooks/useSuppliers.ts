import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";
import type { Supplier } from "@/pages/suppliers/columns";

interface SuppliersResponse {
  suppliers: Supplier[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AddSupplierDTO {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
}

interface ApiError {
  message: string;
  status: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Type for mutation context
interface DeleteContext {
  previousSuppliers: Supplier[] | undefined;
}

export function useSuppliers(page = 1, limit = 10) {
  const { toast } = useToast();

  return useQuery<SuppliersResponse>({
    queryKey: ["suppliers", page, limit],
    queryFn: async () => {
      try {
        const response = await api.get<SuppliersResponse>(
          `/suppliers?page=${page}&limit=${limit}`
        );
        return response;
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

export function useAddSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AddSupplierDTO) => {
      const response = await api.post<ApiResponse<Supplier>>(
        "/suppliers",
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers.all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Supplier added successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to add supplier. Please try again.",
      });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Supplier) => {
      const response = await api.put<ApiResponse<Supplier>>(
        `/suppliers/${data.id}`,
        {
          name: data.name,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone,
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers.all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Supplier updated successfully",
      });
    },
    onError: (error: ApiError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to update supplier. Please try again.",
      });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (supplierId: number | string) => {
      await api.delete<void>(`/suppliers/${supplierId}`);
      return supplierId;
    },
    onMutate: async (supplierId) => {
      await queryClient.cancelQueries({ queryKey: ["suppliers"] });
      const previousSuppliers = queryClient.getQueryData<SuppliersResponse>([
        "suppliers",
      ]);

      if (previousSuppliers) {
        queryClient.setQueryData<SuppliersResponse>(["suppliers"], {
          ...previousSuppliers,
          suppliers: previousSuppliers.suppliers.filter(
            (supplier) => supplier.id !== supplierId
          ),
        });
      }

      return { previousSuppliers } as DeleteContext;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers.all"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Supplier deleted successfully",
      });
    },
    onError: (
      error: ApiError,
      _variables: string | number,
      context: DeleteContext | undefined
    ) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(["suppliers"], context.previousSuppliers);
      }

      // Check if error is due to associated products
      if (error?.status === 400) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Cannot delete supplier with associated products. Remove all products first.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.message || "Failed to delete supplier. Please try again.",
        });
      }
    },
  });
}
