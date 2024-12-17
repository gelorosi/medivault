import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { StatsCard } from "@/pages/dashboard/components/stats-card";
import { DataTable } from "./data-table";
import { lowStockColumns, expiringColumns } from "./columns";
import ExportButton from "./components/export-button";
import {
  Package,
  AlertTriangle as AlertIcon,
  CalendarClock,
} from "lucide-react";

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  const stats = [
    {
      title: "Total Products",
      value: data?.totalProducts ?? 0,
      description: "Total items in inventory",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      loading: isLoading,
    },
    {
      title: "Low Stock Items",
      value: data?.lowStock?.length ?? 0,
      description: "Products below minimum level",
      icon: <AlertIcon className="h-4 w-4 text-destructive" />,
      loading: isLoading,
    },
    {
      title: "Expiring Soon",
      value: data?.expiringProducts?.length ?? 0,
      description: "Products expiring in 30 days",
      icon: <CalendarClock className="h-4 w-4 text-warning" />,
      loading: isLoading,
    },
  ];

  const hasLowStock = (data?.lowStock?.length ?? 0) > 0;
  const hasExpiring = (data?.expiringProducts?.length ?? 0) > 0;

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Reports</h2>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Alerts */}
      {(hasLowStock || hasExpiring) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {hasLowStock && (
              <span>
                {data?.lowStock.length} products are below minimum stock level.{" "}
              </span>
            )}
            {hasExpiring && (
              <span>
                {data?.expiringProducts.length} products are expiring soon.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Reports */}
      <Tabs defaultValue="low-stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Products</TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Low Stock Products</CardTitle>
              <ExportButton
                data={data?.lowStock ?? []}
                filename="low_stock_report"
                disabled={isLoading}
              />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={lowStockColumns}
                data={data?.lowStock ?? []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Products Expiring Soon</CardTitle>
              <ExportButton
                data={data?.expiringProducts ?? []}
                filename="expiring_products_report"
                disabled={isLoading}
              />
            </CardHeader>
            <CardContent>
              <DataTable
                columns={expiringColumns}
                data={data?.expiringProducts ?? []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
