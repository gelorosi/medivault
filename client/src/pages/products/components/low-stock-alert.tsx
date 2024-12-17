"use client";

import { useProducts } from "@/hooks/useProducts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { StockDialog } from "./stock-dialog";
import type { Product } from "../columns";

export function LowStockAlert() {
  const { data: products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const lowStockProducts =
    products?.filter((product) => product.quantity <= product.minStockLevel) ??
    [];

  if (lowStockProducts.length === 0) return null;

  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Low Stock Alert</AlertTitle>
        <AlertDescription>
          <div className="mt-2 space-y-2">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.name}</span>
                  <Badge variant="outline" className="border-destructive/50">
                    {product.quantity} in stock
                  </Badge>
                  <Badge variant="outline" className="border-destructive/50">
                    Min: {product.minStockLevel}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive hover:bg-destructive/20"
                  onClick={() => {
                    setSelectedProduct(product);
                    setDialogOpen(true);
                  }}
                >
                  Update Stock
                </Button>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>

      {selectedProduct && (
        <StockDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={selectedProduct}
        />
      )}
    </>
  );
}
