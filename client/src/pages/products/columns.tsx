"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatters";

// Interface from our useProducts hook
export type Product = {
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

interface ColumnsProps {
  onViewDetails: (product: Product) => void;
  onEdit: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const columns = ({
  onViewDetails,
  onEdit,
  onUpdateStock,
  onDelete,
}: ColumnsProps): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as "OTC" | "PRESCRIPTION";
      return (
        <Badge variant={category === "OTC" ? "secondary" : "default"}>
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "quantity",
    header: "Stock",
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const minStock = row.original.minStockLevel;

      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{quantity}</span>
          {quantity <= minStock && (
            <Badge variant="destructive">Low Stock</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = formatCurrency(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiryDate"));
      const formatted = format(date, "MMM dd, yyyy");
      const isNearExpiry =
        date.getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 30; // 30 days

      return (
        <div className="flex items-center gap-2">
          <span>{formatted}</span>
          {isNearExpiry && <Badge variant="destructive">Expiring Soon</Badge>}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(product)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              Edit product
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStock(product)}>
              Update stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(product)}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            >
              Delete product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
