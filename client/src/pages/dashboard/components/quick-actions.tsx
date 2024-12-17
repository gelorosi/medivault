import { Plus, Package, Truck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { QuickProductForm } from "./forms/quick-product-form";
import { QuickStockUpdate } from "./forms/quick-stock-update";

interface ActionItem {
  title: string;
  icon: React.ReactNode;
  color?: string;
  onClick: () => void;
  dialog?: React.ReactNode;
}

export function QuickActions() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const actions: ActionItem[] = [
    {
      title: "Add Product",
      icon: <Plus className="h-4 w-4" />,
      color: "default",
      onClick: () => setOpenDialog("product"),
      dialog: (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add Product</DialogTitle>
          </DialogHeader>
          <QuickProductForm onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      ),
    },
    {
      title: "Update Stock",
      icon: <Package className="h-4 w-4" />,
      color: "default",
      onClick: () => setOpenDialog("stock"),
      dialog: (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Stock Update</DialogTitle>
          </DialogHeader>
          <QuickStockUpdate onSuccess={() => setOpenDialog(null)} />
        </DialogContent>
      ),
    },
    {
      title: "Add Supplier",
      icon: <Truck className="h-4 w-4" />,
      onClick: () => navigate("/suppliers/new"),
    },
    {
      title: "Generate Report",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => navigate("/reports"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Dialog
              key={action.title}
              open={openDialog === action.title.toLowerCase().split(" ")[1]}
              onOpenChange={(isOpen: boolean) => !isOpen && setOpenDialog(null)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span className="ml-2">{action.title}</span>
                </Button>
              </DialogTrigger>
              {action.dialog}
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
