import { Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Switch } from "@/Components/ui/switch";
import { FormInput } from "@/Components/ui/CustomUi/ReuseForm/Form";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import VehicleSection from "./VehicleSection";
import type { FareFormValues } from "../../../schemas/fareSchema";
import type { UseFormReturn } from "react-hook-form";

interface FareCreatePageProps {
  form: UseFormReturn<FareFormValues>;
  isLoading: boolean;
  isEditMode: boolean;
  onSubmit: (values: FareFormValues) => void;
  onCancel: () => void;
}

const FareCreatePage = ({ form, isLoading, isEditMode, onSubmit, onCancel }: FareCreatePageProps) => {
  const country = form.getValues("country");
  const waitingEnabled = form.watch("waitingChargeEnabled");
  const surchargeEnabled = form.watch("surchargeEnabled");

  return (
    <PageWraper title="">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onCancel} className="shrink-0">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? `Edit Fare — ${country}` : `Fare Management for ${country}`}
        </h1>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Country display */}
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Country</label>
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-lg px-4 py-3 font-semibold">
            {country}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-5">
            <VehicleSection title="Mino Go" prefix="minoGo" control={form.control} />
            <VehicleSection title="Mino Moto" prefix="minoMoto" control={form.control} />

            {/* Surcharge */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Surcharge</h2>
                <p className="text-sm text-muted-foreground">Add an extra charge</p>
              </div>
              <div className="flex items-center justify-between bg-[#F5F5F5] border border-[#E5E5E5] p-3 rounded-xl">
                <div>
                  <p className="font-semibold text-sm">Apply surcharge</p>
                  <p className="text-xs text-muted-foreground">Turn on to add a surcharge.</p>
                </div>
                <Controller
                  name="surchargeEnabled"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              {surchargeEnabled && (
                <FormInput
                  control={form.control}
                  name="surchargeValue"
                  label="Surcharge value (%)"
                  description="Percentage applied to selected fare components."
                  type="number"
                  placeholder="0"
                />
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <VehicleSection title="Mino XL" prefix="minoXL" control={form.control} />

            {/* Waiting Charges */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Waiting charges</h2>
                <p className="text-sm text-muted-foreground">
                  Charge for waiting time after snapper arrival.
                </p>
              </div>
              <div className="flex items-center justify-between bg-[#F5F5F5] border border-[#E5E5E5] p-3 rounded-xl">
                <div>
                  <p className="font-semibold text-sm">Waiting charge</p>
                  <p className="text-xs text-muted-foreground">Enable or disable waiting fees.</p>
                </div>
                <Controller
                  name="waitingChargeEnabled"
                  control={form.control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
              {waitingEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    control={form.control}
                    name="waitingChargeGracePeriod"
                    label="Grace period (min)"
                    description="Waiting charges start after the free waiting period."
                    type="number"
                    placeholder="0"
                  />
                  <FormInput
                    control={form.control}
                    name="waitingChargeRate"
                    label="Waiting rate ($/min)"
                    description="Applied after the grace period."
                    type="number"
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            {/* Platform Commission */}
            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-xl font-bold">Platform commission</h2>
                <p className="text-sm text-muted-foreground">Platform earnings from each ride</p>
              </div>
              <FormInput
                control={form.control}
                name="platformCommissionPercentage"
                label="Commission (%)"
                description="Platform share deducted from the fare."
                type="number"
                placeholder="e.g. 15"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </PageWraper>
  );
};

export default FareCreatePage;
