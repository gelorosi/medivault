import { Package, AlertTriangle, CalendarClock, Users } from "lucide-react";
import { StatsCard } from "./stats-card";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export function StatsCards() {
  const { data, isLoading, error } = useDashboardStats();

  // Define stats configuration
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
      value: data?.lowStockCount ?? 0,
      description: "Products below minimum level",
      icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      loading: isLoading,
    },
    {
      title: "Expiring Soon",
      value: data?.expiringCount ?? 0,
      description: "Products expiring in 30 days",
      icon: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
      loading: isLoading,
    },
    {
      title: "Total Suppliers",
      value: data?.suppliersCount ?? 0,
      description: "Active suppliers",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      loading: isLoading,
    },
  ];

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            {...stat}
            value={0}
            loading={false}
            error={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
