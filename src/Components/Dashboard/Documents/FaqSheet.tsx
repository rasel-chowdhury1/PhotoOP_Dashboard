import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { faqSchema } from "@/schemas/faq";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import { FieldGroup } from "@/Components/ui/field";
import {
  FormCheckbox,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/Components/ui/CustomUi/ReuseForm/Form";
import { SelectItem } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
} from "@/redux/features/faq/faqApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";

interface FaqSheetProps {
  open: boolean;
  onClose: () => void;
  editRecord: IFaq | null;
  defaultRole: FaqRole;
}

const FaqSheet = ({ open, onClose, editRecord, defaultRole }: FaqSheetProps) => {
  const form = useForm<z.infer<typeof faqSchema>>({
    resolver: zodResolver(faqSchema) as Resolver<z.infer<typeof faqSchema>>,
    defaultValues: {
      question: "",
      answer: "",
      role: defaultRole,
      isActive: true,
    },
  });

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  useEffect(() => {
    if (editRecord) {
      form.reset({
        question: editRecord.question,
        answer: editRecord.answer,
        role: editRecord.role,
        isActive: editRecord.isActive,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
        role: defaultRole,
        isActive: true,
      });
    }
  }, [editRecord, defaultRole, form, open]);

  const onSubmit = async (data: z.infer<typeof faqSchema>) => {
    let res;
    if (editRecord) {
      res = await tryCatchWrapper(
        updateFaq,
        { params: { id: editRecord._id }, body: data },
        "Updating FAQ..."
      );
    } else {
      res = await tryCatchWrapper(createFaq, { body: data }, "Creating FAQ...");
    }

    if (res?.success) {
      form.reset();
      onClose();
    }
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editRecord ? "Edit FAQ" : "Add New FAQ"}
      maxWidth="sm:max-w-md"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button className="flex-1" type="submit" form="faq-form">
            {editRecord ? "Update FAQ" : "Add FAQ"}
          </Button>
        </div>
      }
    >
      <form id="faq-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FormInput
            control={form.control}
            name="question"
            label="Question"
            placeholder="e.g. How do I book a snapper?"
          />
          <FormTextarea
            control={form.control}
            name="answer"
            label="Answer"
            placeholder="Add the answer"
          />
          <FormSelect control={form.control} name="role" label="Visible To">
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="snapper">Snapper</SelectItem>
          </FormSelect>
          <FormCheckbox control={form.control} name="isActive" label="Active" />
        </FieldGroup>
      </form>
    </ReusableModal>
  );
};

export default FaqSheet;
