import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { promoSchema } from "@/schemas/promo";
import ReusableSheet from "@/Components/ui/CustomUi/ReuseableSheet";
import { FieldGroup } from "@/Components/ui/field";
import {
  FormDatePicker,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/Components/ui/CustomUi/ReuseForm/Form";
import { SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import {
  useCreatePromoMutation,
  useUpdatePromoMutation,
} from "@/redux/features/promo/promoApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";

interface PromoSheetProps {
  open: boolean;
  onClose: () => void;
  editRecord: IPromo | null;
}

const PromoSheet = ({ open, onClose, editRecord }: PromoSheetProps) => {
  const form = useForm<z.infer<typeof promoSchema>>({
    resolver: zodResolver(promoSchema) as Resolver<z.infer<typeof promoSchema>>,
    defaultValues: {
      title: "",
      description: "",
      discount: 0,
      minimumSpend: 0,
      expirationDate: undefined,
      status: "ACTIVE",
    },
  });

  const [createPromo] = useCreatePromoMutation();
  const [updatePromo] = useUpdatePromoMutation();

  useEffect(() => {
    if (editRecord) {
      form.reset({
        title: editRecord.title,
        description: editRecord.description,
        discount: editRecord.discount,
        minimumSpend: editRecord.minimumSpend,
        expirationDate: new Date(editRecord.expirationDate),
        status: editRecord.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        discount: 0,
        minimumSpend: 0,
        expirationDate: undefined,
        status: "ACTIVE",
      });
    }
  }, [editRecord, form, open]);

  const onSubmit = async (data: z.infer<typeof promoSchema>) => {
    const endOfDay = new Date(data.expirationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const payload = {
      title: data.title,
      description: data.description,
      discount: data.discount,
      minimumSpend: data.minimumSpend,
      expirationDate: endOfDay.toISOString(),
      status: data.status,
    };

    let res;
    if (editRecord) {
      res = await tryCatchWrapper(
        updatePromo,
        { params: { id: editRecord.id }, body: payload },
        "Updating Promo..."
      );
    } else {
      res = await tryCatchWrapper(createPromo, { body: payload }, "Creating Promo...");
    }

    if (res?.success) {
      form.reset();
      onClose();
    }
  };

  return (
    <ReusableSheet
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editRecord ? "Edit Promo" : "Add New Promo"}
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button className="flex-1" type="submit" form="promo-form">
            {editRecord ? "Update Promo" : "Add Promo"}
          </Button>
        </div>
      }
    >
      <form id="promo-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="title"
            label="Promotion Title"
            placeholder="e.g. Summer Special"
          />
          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Add Promo description"
          />
          <FormInput
            control={form.control}
            name="discount"
            label="Discount Value (%)"
            placeholder="Add Value (%)"
            type="number"
          />
          <FormInput
            control={form.control}
            name="minimumSpend"
            label="Minimum Spend (₦)"
            placeholder="Type Minimum Spend (₦)"
            type="number"
          />
          <FormDatePicker
            control={form.control}
            name="expirationDate"
            label="Expiration Date"
            placeholder="MM/DD/YYYY"
            disablePast
          />
          <FormSelect control={form.control} name="status" label="Initial Status">
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </FormSelect>
        </FieldGroup>
      </form>
    </ReusableSheet>
  );
};

export default PromoSheet;
