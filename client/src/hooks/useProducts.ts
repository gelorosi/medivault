import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: "OTC" | "PRESCRIPTION";
  minStockLevel: number;
  expiryDate: Date;
  description?: string;
  supplierId: string;
}

interface ProductDTO extends Omit<Product, "expiryDate"> {
  expiryDate: string;
}

interface ProductsResponse {
  products: ProductDTO[];
  totalPages: number;
  currentPage: number;
  total: number;
}

interface AddProductDTO {
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: "OTC" | "PRESCRIPTION";
  minStockLevel: number;
  expiryDate: Date;
  description?: string;
  supplierId: string;
}

interface UpdateStockDTO {
  productId: string;
  quantity: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Type for mutation context
interface DeleteContext {
  previousProducts: Product[] | undefined;
}

export function useProducts() {
  const { toast } = useToast();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await api.get<ProductsResponse>("/products");
        // If no products, return empty array instead of throwing error
        if (!response.products) return [];

        // Convert string dates to Date objects
        return response.products.map((product) => ({
          ...product,
          expiryDate: new Date(product.expiryDate),
        }));
      } catch (error) {
        // Only show error toast if it's not a 404 (no products found)
        if (error instanceof Error && !error.message.includes("404")) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch products. Please try again.",
          });
        }
        // Return empty array for 404s
        if (error instanceof Error && error.message.includes("404")) {
          return [];
        }
        throw error;
      }
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AddProductDTO) => {
      const response = await api.post<ApiResponse<Product>>("/products", data);
      return response;
    },
    onSuccess: () => {
      // Invalidate both products and dashboard stats
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product. Please try again.",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Product) => {
      const response = await api.put<ApiResponse<Product>>(
        `/products/${data.id}`,
        {
          ...data,
          // Ensure we send the date in ISO format
          expiryDate: data.expiryDate.toISOString(),
        }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product. Please try again.",
      });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateStockDTO) => {
      const response = await api.patch<ApiResponse<Product>>(
        `/products/${data.productId}/stock`,
        { quantity: data.quantity }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stock. Please try again.",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: string) => {
      await api.delete<void>(`/products/${productId}`);
      return productId;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previousProducts = queryClient.getQueryData<Product[]>([
        "products",
      ]);

      if (previousProducts) {
        queryClient.setQueryData<Product[]>(
          ["products"],
          previousProducts.filter((product) => product.id !== productId)
        );
      }

      return { previousProducts } as DeleteContext;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (
      _error: unknown,
      _variables: string,
      context: DeleteContext | undefined
    ) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(["products"], context.previousProducts);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      });
    },
  });
}
