import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import type { Supplier } from "../columns";
import { DeleteSupplierDialog } from "./delete-supplier-dialog";
import { EditSupplierDialog } from "./edit-supplier-dialog";

interface SupplierActionsProps {
  supplier: Supplier;
}

export function SupplierActions({ supplier }: SupplierActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowEditDialog(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <DeleteSupplierDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        supplier={supplier}
      />

      <EditSupplierDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        supplier={supplier}
      />
    </>
  );
}
