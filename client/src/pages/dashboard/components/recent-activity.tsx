import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Users,
  Trash,
  PenLine,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { cn } from "@/lib/utils";
import { Activity } from "@/types/activity";
import { format } from "date-fns";

interface RecentActivityProps {
  className?: string;
}

const getActionIcon = (action: Activity["action"]) => {
  if (action === "added")
    return <PlusCircle className="h-4 w-4 text-green-500" />;
  if (action === "deleted")
    return <Trash className="h-4 w-4 text-destructive" />;
  return <PenLine className="h-4 w-4 text-blue-500" />;
};

const getEntityIcon = (entityType: Activity["entityType"]) => {
  if (entityType === "product") return <Package className="h-4 w-4" />;
  return <Users className="h-4 w-4" />;
};

function ActivitySkeleton() {
  return (
    <div className="flex items-center">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function RecentActivity({ className }: RecentActivityProps) {
  const { data: activities, isLoading, error } = useRecentActivity();

  return (
    <Card className={cn("col-span-3", className)}>
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="h-6 w-32" /> : "Recent Activity"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {isLoading ? (
            <>
              <ActivitySkeleton />
              <ActivitySkeleton />
              <ActivitySkeleton />
            </>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <p className="mt-2 text-sm text-destructive">
                Failed to load recent activity
              </p>
              <p className="text-xs text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : activities?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No recent activity
              </p>
            </div>
          ) : (
            activities?.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getActionIcon(activity.action)}
                  {getEntityIcon(activity.entityType)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
