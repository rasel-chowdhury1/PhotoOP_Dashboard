// Components/Dashboard/ServiceChargePage/ServiceChargeSheet.tsx
import { useEffect, useState } from "react";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

import tryCatchWrapper from "@/utils/tryCatchWrapper";
import {
  useCreateServiceChargeMutation,
  useUpdateServiceChargeMutation,
} from "@/redux/features/serviceCharge/serviceChargeApi";
import { IServiceCharge, ServiceChargeType } from "@/types/serviceCharge.type";

interface ServiceChargeSheetProps {
  open: boolean;
  onClose: () => void;
  editRecord: IServiceCharge | null;
}

const ServiceChargeSheet = ({ open, onClose, editRecord }: ServiceChargeSheetProps) => {
  const isEdit = Boolean(editRecord);

  const [name, setName] = useState("");
  const [type, setType] = useState<ServiceChargeType>("PERCENTAGE");
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; value?: string }>({});

  const [createServiceCharge, { isLoading: isCreating }] = useCreateServiceChargeMutation();
  const [updateServiceCharge, { isLoading: isUpdating }] = useUpdateServiceChargeMutation();

  useEffect(() => {
    if (editRecord) {
      setName(editRecord.name);
      setType(editRecord.type);
      setValue(String(editRecord.value));
      setIsActive(editRecord.isActive);
    } else {
      setName("");
      setType("PERCENTAGE");
      setValue("");
      setIsActive(true);
    }
    setErrors({});
  }, [editRecord, open]);

  const validate = () => {
    const nextErrors: { name?: string; value?: string } = {};
    if (!name.trim()) nextErrors.name = "Enter a name";

    const numeric = Number(value);
    if (value === "" || Number.isNaN(numeric)) {
      nextErrors.value = "Enter a number";
    } else if (numeric < 0) {
      nextErrors.value = "Must be 0 or more";
    } else if (type === "PERCENTAGE" && numeric > 100) {
      nextErrors.value = "Percentage can't exceed 100";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const body = { name: name.trim(), type, value: Number(value), isActive };

    if (isEdit && editRecord) {
      await tryCatchWrapper(
        updateServiceCharge,
        { params: { id: editRecord._id }, body },
        "Updating service charge..."
      );
    } else {
      await tryCatchWrapper(createServiceCharge, { body }, "Creating service charge...");
    }

    onClose();
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={isEdit ? "Edit service charge" : "Add service charge"}
      maxWidth="sm:max-w-md"
      footer={
        <div className="flex gap-3 w-full pb-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit} disabled={isCreating || isUpdating}>
            {isEdit ? "Save changes" : "Add charge"}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Platform fee"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as ServiceChargeType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FLAT">Flat amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Value {type === "PERCENTAGE" ? "(%)" : "($)"}</Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "PERCENTAGE" ? "12" : "3.50"}
            inputMode="decimal"
          />
          {errors.value && <p className="text-sm text-destructive">{errors.value}</p>}
        </div>

        <div className="flex items-center justify-between rounded-md border px-3 py-2.5">
          <div>
            <p className="text-sm font-medium">Active</p>
            <p className="text-sm text-muted-foreground">Applied to new bookings while on</p>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>
    </ReusableModal>
  );
};

export default ServiceChargeSheet;
