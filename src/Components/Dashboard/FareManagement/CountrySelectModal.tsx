import { Button } from "@/Components/ui/button";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import CountrySearchSelect from "./CountrySearchSelect";

interface CountrySelectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
}

const CountrySelectModal = ({
  isOpen,
  onOpenChange,
  value,
  onChange,
  onContinue,
}: CountrySelectModalProps) => {
  return (
    <ReusableModal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Select Country"
      maxWidth="sm:max-w-[400px]"
      footer={
        <Button onClick={onContinue} disabled={!value} className="w-full">
          Continue
        </Button>
      }
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Country</label>
        <CountrySearchSelect value={value} onChange={onChange} />
      </div>
    </ReusableModal>
  );
};

export default CountrySelectModal;
