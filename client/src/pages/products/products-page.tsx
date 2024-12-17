"use client";

import { useProducts } from "@/hooks/useProducts";
import { useAllSuppliers } from "@/hooks/useAllSuppliers";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDialog } from "./components/product-dialog";
import { LowStockAlert } from "./components/low-stock-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetails } from "./components/product-details";
import { EditProductDialog } from "./components/edit-product-dialog";
import { StockDialog } from "./components/stock-dialog";
import { DeleteProductDialog } from "./components/delete-product-dialog";
import { useState } from "react";
import { Product } from "./columns";
import { PackageX } from "lucide-react";

export default function ProductsPage() {
  const {
    data: products,
    isLoading: loadingProducts,
    error: productsError,
  } = useProducts();
  const { data: suppliers, isLoading: loadingSupplers } = useAllSuppliers();

  // Dialog states
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [stockDialog, setStockDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });

  if (productsError) {
    return (
      <div className="container mx-auto py-10">
        <Card className="p-6">
          <div className="text-center text-red-500">
            Error loading products. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  const formattedSuppliers =
    suppliers?.map((s) => ({
      id: s.id,
      name: s.name,
    })) || [];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
      <PackageX className="h-12 w-12 mb-4" />
      <h3 className="text-lg font-medium mb-2">No products found</h3>
      <p>Add your first product to get started.</p>
    </div>
  );

  return (
    <div className="container mx-auto py-10 space-y-4">
      <LowStockAlert />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>Products</CardTitle>
            {products && (
              <p className="text-sm text-muted-foreground">
                Total {products.length} product{products.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <AddProductDialog suppliers={formattedSuppliers} />
        </CardHeader>
        <CardContent>
          {loadingProducts || loadingSupplers ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : products && products.length === 0 ? (
            <EmptyState />
          ) : (
            <DataTable
              columns={columns({
                onViewDetails: (product) =>
                  setDetailsDialog({ open: true, product }),
                onEdit: (product) => setEditDialog({ open: true, product }),
                onUpdateStock: (product) =>
                  setStockDialog({ open: true, product }),
                onDelete: (product) => setDeleteDialog({ open: true, product }),
              })}
              data={products || []}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {detailsDialog.product && (
        <ProductDetails
          open={detailsDialog.open}
          onOpenChange={(open) =>
            setDetailsDialog((prev) => ({ ...prev, open }))
          }
          product={detailsDialog.product}
          supplierName={
            formattedSuppliers.find(
              (s) => s.id === detailsDialog.product.supplierId
            )?.name || "Unknown Supplier"
          }
          onEdit={() => {
            setDetailsDialog({ open: false, product: null });
            setEditDialog({ open: true, product: detailsDialog.product });
          }}
          onDelete={() => {
            setDetailsDialog({ open: false, product: null });
            setDeleteDialog({ open: true, product: detailsDialog.product });
          }}
        />
      )}

      {editDialog.product && (
        <EditProductDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog((prev) => ({ ...prev, open }))}
          product={editDialog.product}
          suppliers={formattedSuppliers}
        />
      )}

      {stockDialog.product && (
        <StockDialog
          open={stockDialog.open}
          onOpenChange={(open) => setStockDialog((prev) => ({ ...prev, open }))}
          product={stockDialog.product}
        />
      )}

      {deleteDialog.product && (
        <DeleteProductDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
          product={deleteDialog.product}
        />
      )}
    </div>
  );
}
