type TStoragePlan = "FREE" | "PRO_50" | "PRO_200";

interface ISnapperProfile {
  _id: string;
  userId: string;
  identityImage: string;
  about?: string;
  specialties?: string[];
  hourlyRate: number;
  badges?: string[];
  storagePlan: TStoragePlan;
  storageUsedGB: number;
  storageLimitGB: number;
  storageExpiresAt: string | null;
  packageIds?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ISnapper extends IUser {
  snapperId?: string | ISnapperProfile | null;
}
