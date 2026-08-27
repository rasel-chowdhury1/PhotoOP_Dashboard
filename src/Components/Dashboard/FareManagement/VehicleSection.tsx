import { FormInput } from "@/Components/ui/CustomUi/ReuseForm/Form";

interface VehicleSectionProps {
  title: string;
  prefix: "minoGo" | "minoXL" | "minoMoto";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}

const VehicleSection = ({ title, prefix, control }: VehicleSectionProps) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl p-4 space-y-4">
        <h3 className="text-base font-semibold">Base pricing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name={`${prefix}RatePerKm`}
            label="Rate per km ($)"
            description="Charged for distance travelled during the trip."
            type="number"
            placeholder="0"
          />
          <FormInput
            control={control}
            name={`${prefix}BookingFee`}
            label="Booking Fee ($)"
            description="If calculated total is below this, charge the minimum fare."
            type="number"
            placeholder="0"
          />
          <FormInput
            control={control}
            name={`${prefix}BaseFee`}
            label="Base fare ($)"
            description="Start fee added to every trip."
            type="number"
            placeholder="0"
          />
          <FormInput
            control={control}
            name={`${prefix}MinimumFare`}
            label="Minimum fare ($)"
            description="If calculated total is below this, charge the minimum fare."
            type="number"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleSection;
