import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import Papa from "papaparse";
import { Product } from "@/hooks/useReports";

interface ExportButtonProps {
  data: Product[];
  filename: string;
  disabled?: boolean;
}

export default function ExportButton({
  data,
  filename,
  disabled = false,
}: ExportButtonProps) {
  const handleExport = () => {
    if (!data.length) return;

    // Convert data to CSV using PapaParse
    const csv = Papa.unparse(data, {
      header: true,
      columns: [
        "name",
        "sku",
        "category",
        "quantity",
        "minStockLevel",
        "price",
        "expiryDate",
        "description",
        "supplier.name",
      ],
    });

    // Create blob and download link
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={disabled || !data.length}
    >
      <FileDown className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
