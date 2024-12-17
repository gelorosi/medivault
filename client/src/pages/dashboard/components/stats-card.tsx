import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  loading?: boolean;
  error?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  loading = false,
  error = false,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <>
            <Skeleton className="h-7 w-20 mb-1" />
            <Skeleton className="h-4 w-32" />
          </>
        ) : error ? (
          <>
            <div className="text-2xl font-bold text-destructive">Error</div>
            <CardDescription className="text-destructive">
              Failed to load data
            </CardDescription>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            <CardDescription>{description}</CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
}
