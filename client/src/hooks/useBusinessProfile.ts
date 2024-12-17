import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "./use-toast";
import {
  BusinessProfile,
  CreateBusinessProfileDTO,
  UpdateBusinessProfileDTO,
  BusinessProfileResponse,
  BusinessSetupStatus,
} from "@/types";

// Query hook to check business setup status
export function useBusinessSetupStatus() {
  const { toast } = useToast();

  return useQuery<BusinessSetupStatus>({
    queryKey: ["businessStatus"],
    queryFn: async () => {
      try {
        const response = await api.get<BusinessSetupStatus>("/business/status");
        return response;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check business setup status.",
        });
        throw error;
      }
    },
  });
}

// Query hook to get business profile
export function useBusinessProfile() {
  const { toast } = useToast();

  return useQuery<BusinessProfile>({
    queryKey: ["businessProfile"],
    queryFn: async () => {
      try {
        const response = await api.get<BusinessProfileResponse>("/business");
        return response.data;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch business profile.",
        });
        throw error;
      }
    },
  });
}

// Mutation hook to create business profile
export function useCreateBusinessProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBusinessProfileDTO) => {
      const response = await api.post<BusinessProfileResponse>(
        "/business",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessStatus"] });
      queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
      toast({
        title: "Success",
        description: "Business profile created successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create business profile. Please try again.",
      });
    },
  });
}

// Mutation hook to update business profile
export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UpdateBusinessProfileDTO) => {
      const response = await api.put<BusinessProfileResponse>(
        "/business",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessProfile"] });
      toast({
        title: "Success",
        description: "Business profile updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update business profile. Please try again.",
      });
    },
  });
}
