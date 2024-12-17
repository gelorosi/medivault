import { useState } from "react";
import { useSuppliers, useAddSupplier } from "@/hooks/useSuppliers";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { CreateSupplierDialog } from "./components/create-supplier-dialog";
import { EditSupplierDialog } from "./components/edit-supplier-dialog";
import { DeleteSupplierDialog } from "./components/delete-supplier-dialog";
import { SupplierDetails } from "./components/supplier-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Supplier } from "./columns";
import { useToast } from "@/hooks/use-toast";
import type { SupplierFormValues } from "@/pages/suppliers/components/create-supplier-dialog";

const ITEMS_PER_PAGE = 10;

export default function SuppliersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useSuppliers(page, ITEMS_PER_PAGE);
  const { mutate: addSupplier } = useAddSupplier();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Dialog states
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    supplier: Supplier | null;
  }>({
    open: false,
    supplier: null,
  });

  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    supplier: Supplier | null;
  }>({
    open: false,
    supplier: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    supplier: Supplier | null;
  }>({
    open: false,
    supplier: null,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card className="p-6">
          <div className="text-center text-red-500">
            Error loading suppliers. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  const tableColumns = columns({
    onViewDetails: (supplier: Supplier) =>
      setDetailsDialog({ open: true, supplier }),
    onEdit: (supplier: Supplier) => setEditDialog({ open: true, supplier }),
    onDelete: (supplier: Supplier) => {
      // Check if supplier has associated products
      if (supplier.products.length > 0) {
        toast({
          variant: "destructive",
          title: "Cannot Delete Supplier",
          description: `This supplier has ${supplier.products.length} associated product${supplier.products.length === 1 ? "" : "s"}. Remove all products first.`,
        });
        return;
      }
      setDeleteDialog({ open: true, supplier });
    },
  });

  const handleCreateSupplier = (formData: SupplierFormValues) => {
    addSupplier(formData, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        // Reset to first page when adding new supplier
        setPage(1);
      },
    });
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">Suppliers</CardTitle>
            {data && (
              <p className="text-sm text-muted-foreground">
                Total {data.total} supplier{data.total === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <DataTable
              columns={tableColumns}
              data={data?.suppliers || []}
              pageCount={data?.totalPages || 1}
              pageIndex={page - 1}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>

      <CreateSupplierDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateSupplier}
      />

      {detailsDialog.supplier && (
        <SupplierDetails
          open={detailsDialog.open}
          onOpenChange={(open) =>
            setDetailsDialog((prev) => ({ ...prev, open }))
          }
          supplier={detailsDialog.supplier}
          onEdit={() => {
            setDetailsDialog({ open: false, supplier: null });
            setEditDialog({ open: true, supplier: detailsDialog.supplier });
          }}
          onDelete={() => {
            if (detailsDialog.supplier?.products.length ?? 0 > 0) {
              toast({
                variant: "destructive",
                title: "Cannot Delete Supplier",
                description: "Remove all associated products first.",
              });
              return;
            }
            setDetailsDialog({ open: false, supplier: null });
            setDeleteDialog({ open: true, supplier: detailsDialog.supplier });
          }}
        />
      )}

      {editDialog.supplier && (
        <EditSupplierDialog
          open={editDialog.open}
          onOpenChange={(open) => setEditDialog((prev) => ({ ...prev, open }))}
          supplier={editDialog.supplier}
        />
      )}

      {deleteDialog.supplier && (
        <DeleteSupplierDialog
          open={deleteDialog.open}
          onOpenChange={(open) =>
            setDeleteDialog((prev) => ({ ...prev, open }))
          }
          supplier={deleteDialog.supplier}
        />
      )}
    </div>
  );
}
