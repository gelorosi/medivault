export interface BusinessProfile {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  userId: number; // Reference to the user who owns/created the profile
  createdAt: string;
  updatedAt: string;
}

export type CreateBusinessProfileDTO = Omit<
  BusinessProfile,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateBusinessProfileDTO = Partial<CreateBusinessProfileDTO>;

export interface BusinessProfileResponse {
  success: boolean;
  data: BusinessProfile;
  message: string;
}

export interface BusinessSetupStatus {
  isSetup: boolean;
  profile?: BusinessProfile;
}
