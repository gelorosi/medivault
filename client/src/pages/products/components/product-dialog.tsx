"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { useAddProduct } from "@/hooks/useProducts";
import { useState } from "react";
import { Plus } from "lucide-react";

// Product type from useProducts hook
type Product = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minStockLevel: number;
  price: number;
  category: "OTC" | "PRESCRIPTION";
  expiryDate: Date;
  description?: string;
  supplierId: string;
};

// Form data type
type ProductFormData = Omit<Product, "id">;

interface ProductDialogProps {
  suppliers: { id: string; name: string }[];
}

export function AddProductDialog({ suppliers }: ProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: addProduct, isPending } = useAddProduct();

  const handleSubmit = async (data: ProductFormData) => {
    await addProduct(data);
    setOpen(false);
  };

  return (
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="z-0">
          {" "}
          {/* This z-index wrapper was key */}
          <ProductForm
            suppliers={suppliers}
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EditProductDialogProps {
  product: Product;
  suppliers: { id: string; name: string }[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  trigger: React.ReactNode;
  isLoading?: boolean;
}

export function EditProductDialog({
  product,
  suppliers,
  onSubmit,
  trigger,
  isLoading,
}: EditProductDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ProductForm
            initialData={product}
            suppliers={suppliers}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
