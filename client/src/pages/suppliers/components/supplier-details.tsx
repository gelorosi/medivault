import type { Supplier } from "../columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash, 
  Mail, 
  Phone,
  User,
  Package,
  Calendar,
  AlertCircle,
  CircleAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SupplierDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier;
  onEdit: () => void;
  onDelete: () => void;
}

export function SupplierDetails({
  open,
  onOpenChange,
  supplier,
  onEdit,
  onDelete,
}: SupplierDetailsProps) {
  const otcProducts = supplier.products.filter(p => p.category === 'OTC');
  const prescriptionProducts = supplier.products.filter(p => p.category === 'PRESCRIPTION');
  const lowStockProducts = supplier.products.filter(p => p.quantity <= p.minStockLevel);
  const expiringProducts = supplier.products.filter(p => {
    const expiryDate = new Date(p.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow;
  });

  const renderProductsTable = (products = supplier.products) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Expiry</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.sku}</TableCell>
            <TableCell>
              <Badge variant={product.category === 'OTC' ? 'secondary' : 'default'}>
                {product.category}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {product.quantity}
                {product.quantity <= product.minStockLevel && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(product.expiryDate), 'MMM dd, yyyy')}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supplier Details</DialogTitle>
          <DialogDescription>
            View and manage supplier information and associated products
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>{supplier.name}</CardTitle>
              <CardDescription>Contact Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{supplier.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${supplier.email}`} className="text-sm text-primary hover:underline">
                  {supplier.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${supplier.phone}`} className="text-sm text-primary hover:underline">
                  {supplier.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Products Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Products Overview</CardTitle>
              <CardDescription>Quick summary of supplied products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Total Products</span>
                  </div>
                  <Badge variant="secondary" className="ml-6">
                    {supplier.products.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Alerts</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {lowStockProducts.length > 0 && (
                      <Badge variant="destructive" className="mr-2">
                        {lowStockProducts.length} Low Stock
                      </Badge>
                    )}
                    {expiringProducts.length > 0 && (
                      <Badge variant="destructive">
                        {expiringProducts.length} Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {['OTC', 'PRESCRIPTION'].map(category => {
                  const count = supplier.products.filter(p => p.category === category).length;
                  if (count === 0) return null;
                  return (
                    <Badge key={category} variant="outline">
                      {category}: {count}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Tab View */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="otc">OTC ({otcProducts.length})</TabsTrigger>
            <TabsTrigger value="prescription">Prescription ({prescriptionProducts.length})</TabsTrigger>
            {(lowStockProducts.length > 0 || expiringProducts.length > 0) && (
              <TabsTrigger value="alerts">Alerts ({lowStockProducts.length + expiringProducts.length})</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="all">
            {supplier.products.length > 0 ? (
              renderProductsTable()
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No products associated with this supplier.
              </div>
            )}
          </TabsContent>
          <TabsContent value="otc">
            {otcProducts.length > 0 ? (
              renderProductsTable(otcProducts)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No OTC products found.
              </div>
            )}
          </TabsContent>
          <TabsContent value="prescription">
            {prescriptionProducts.length > 0 ? (
              renderProductsTable(prescriptionProducts)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No prescription products found.
              </div>
            )}
          </TabsContent>
          <TabsContent value="alerts">
            <div className="space-y-6">
              {lowStockProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Low Stock Products</h3>
                  {renderProductsTable(lowStockProducts)}
                </div>
              )}
              {expiringProducts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Products Expiring Soon</h3>
                  {renderProductsTable(expiringProducts)}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} 
            disabled={supplier.products.length > 0}
            title={supplier.products.length > 0 ? "Remove all products first" : undefined}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}