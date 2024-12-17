"use client";

import { useState } from "react";
import { useUpdateStock } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Product } from "../columns";

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function StockDialog({ open, onOpenChange, product }: StockDialogProps) {
  const [quantity, setQuantity] = useState(product.quantity);
  const updateStock = useUpdateStock();

  const handleSubmit = async () => {
    try {
      if (!product.id) {
        throw new Error("Product ID is missing");
      }

      if (quantity < 0) {
        toast({
          title: "Invalid Quantity",
          description: "Quantity cannot be negative",
          variant: "destructive",
        });
        return;
      }

      await updateStock.mutateAsync({
        productId: product.id,
        quantity: Number(quantity),
      });

      toast({
        title: "Stock Updated",
        description: `Successfully updated stock for ${product.name}`,
      });

      // Wait a small delay before closing to ensure state is updated
      setTimeout(() => {
        onOpenChange(false);
      }, 100);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update stock level",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        // Only allow dialog close if not in pending state
        if (!updateStock.isPending) {
          onOpenChange(value);
          // Reset quantity when dialog closes
          if (!value) {
            setQuantity(product.quantity);
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Stock Level</DialogTitle>
          <DialogDescription>
            Update the stock quantity for {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
              min={0}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Current Stock</Label>
            <div className="col-span-3 text-sm">{product.quantity} units</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Min Level</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              {product.minStockLevel} units
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={updateStock.isPending || quantity === product.quantity}
          >
            {updateStock.isPending ? "Updating..." : "Update Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}