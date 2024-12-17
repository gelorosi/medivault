import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/api";
import { Activity } from "@/types/activity";

export function useRecentActivity() {
  return useQuery<Activity[]>({
    queryKey: ["recentActivity"],
    queryFn: () => client("/reports/recent-activities"),
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
