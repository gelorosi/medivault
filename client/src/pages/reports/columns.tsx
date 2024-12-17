import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface LowStockProduct {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  minStockLevel: number;
}

interface ExpiringProduct {
  id: number;
  name: string;
  sku: string;
  expiryDate: string;
  daysUntilExpiry: number;
}

// Low Stock Report Columns
export const lowStockColumns: ColumnDef<LowStockProduct>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "quantity",
    header: "Current Stock",
  },
  {
    accessorKey: "minStockLevel",
    header: "Min Stock Level",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const minStock = row.original.minStockLevel;
      return (
        <Badge variant={quantity <= minStock ? "destructive" : "default"}>
          Low Stock
        </Badge>
      );
    },
  },
];

// Expiring Products Report Columns
export const expiringColumns: ColumnDef<ExpiringProduct>[] = [
  {
    accessorKey: "name",
    header: "Product Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      return format(new Date(row.original.expiryDate), "PP");
    },
  },
  {
    accessorKey: "daysUntilExpiry",
    header: "Days Until Expiry",
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const days = row.original.daysUntilExpiry;
      return (
        <Badge variant={days <= 30 ? "destructive" : "secondary"}>
          {days <= 30 ? "Expiring Soon" : "Expiring"}
        </Badge>
      );
    },
  },
];
