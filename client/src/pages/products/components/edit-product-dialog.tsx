import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { useUpdateProduct } from "@/hooks/useProducts";

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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  suppliers: { id: string; name: string; }[];
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  suppliers,
}: EditProductDialogProps) {
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = async (formData: Omit<Product, "id">) => {
    updateProduct(
      { id: product.id, ...formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Failed to update product:", error);
        },
      }
    );
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        if (!isPending) {
          onOpenChange(open);
        }
      }}
    >
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={product}
          suppliers={suppliers}
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}