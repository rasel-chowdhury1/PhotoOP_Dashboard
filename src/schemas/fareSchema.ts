import { z } from "zod";

const fee = z.coerce.number().min(0, "Required");

export const fareSchema = z
  .object({
    country: z.string().min(1, "Country is required"),

    minoGoRatePerKm: fee,
    minoGoBookingFee: fee,
    minoGoBaseFee: fee,
    minoGoMinimumFare: fee,

    minoXLRatePerKm: fee,
    minoXLBookingFee: fee,
    minoXLBaseFee: fee,
    minoXLMinimumFare: fee,

    minoMotoRatePerKm: fee,
    minoMotoBookingFee: fee,
    minoMotoBaseFee: fee,
    minoMotoMinimumFare: fee,

    waitingChargeEnabled: z.boolean(),
    waitingChargeGracePeriod: z.coerce.number().min(0),
    waitingChargeRate: z.coerce.number().min(0),

    surchargeEnabled: z.boolean(),
    surchargeValue: z.coerce.number().min(0),

    platformCommissionPercentage: z.coerce.number().min(0).max(100),
  })
  .superRefine((data, ctx) => {
    if (data.waitingChargeEnabled) {
      if (!data.waitingChargeGracePeriod && data.waitingChargeGracePeriod !== 0)
        ctx.addIssue({ code: "custom", message: "Required", path: ["waitingChargeGracePeriod"] });
      if (data.waitingChargeRate <= 0)
        ctx.addIssue({ code: "custom", message: "Must be greater than 0", path: ["waitingChargeRate"] });
    }
    if (data.surchargeEnabled && data.surchargeValue <= 0)
      ctx.addIssue({ code: "custom", message: "Must be greater than 0", path: ["surchargeValue"] });
  });

export type FareFormValues = {
  country: string;

  minoGoRatePerKm: number;
  minoGoBookingFee: number;
  minoGoBaseFee: number;
  minoGoMinimumFare: number;

  minoXLRatePerKm: number;
  minoXLBookingFee: number;
  minoXLBaseFee: number;
  minoXLMinimumFare: number;

  minoMotoRatePerKm: number;
  minoMotoBookingFee: number;
  minoMotoBaseFee: number;
  minoMotoMinimumFare: number;

  waitingChargeEnabled: boolean;
  waitingChargeGracePeriod: number;
  waitingChargeRate: number;

  surchargeEnabled: boolean;
  surchargeValue: number;

  platformCommissionPercentage: number;
};

export const fareDefaultValues: FareFormValues = {
  country: "",

  minoGoRatePerKm: 0,
  minoGoBookingFee: 0,
  minoGoBaseFee: 0,
  minoGoMinimumFare: 0,

  minoXLRatePerKm: 0,
  minoXLBookingFee: 0,
  minoXLBaseFee: 0,
  minoXLMinimumFare: 0,

  minoMotoRatePerKm: 0,
  minoMotoBookingFee: 0,
  minoMotoBaseFee: 0,
  minoMotoMinimumFare: 0,

  waitingChargeEnabled: false,
  waitingChargeGracePeriod: 0,
  waitingChargeRate: 0,

  surchargeEnabled: false,
  surchargeValue: 0,

  platformCommissionPercentage: 0,
};
