import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

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

interface ProductDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  supplierName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProductDetails({
  open,
  onOpenChange,
  product,
  supplierName,
  onEdit,
  onDelete,
}: ProductDetailsProps) {
  const isLowStock = product.quantity <= product.minStockLevel;
  const isNearExpiry =
    new Date(product.expiryDate).getTime() - new Date().getTime() <
    1000 * 60 * 60 * 24 * 30; // 30 days

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle>{product.name}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={onDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    SKU
                  </p>
                  <p>{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Category
                  </p>
                  <Badge
                    variant={
                      product.category === "OTC" ? "secondary" : "default"
                    }
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>
              {product.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Stock Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Stock
                  </p>
                  <div className="flex items-center gap-2">
                    <p>{product.quantity}</p>
                    {isLowStock && (
                      <Badge variant="destructive">Low Stock</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Minimum Stock Level
                  </p>
                  <p>{product.minStockLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Price
                  </p>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Expiry Date
                  </p>
                  <div className="flex items-center gap-2">
                    <p>
                      {format(new Date(product.expiryDate), "MMM dd, yyyy")}
                    </p>
                    {isNearExpiry && (
                      <Badge variant="destructive">Expiring Soon</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Supplier
                  </p>
                  <p>{supplierName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}