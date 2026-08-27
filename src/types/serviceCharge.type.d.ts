// types/serviceCharge.ts
export type ServiceChargeType = "PERCENTAGE" | "FLAT";

export interface IServiceCharge {
  _id: string;
  name: string;
  type: ServiceChargeType;
  value: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}