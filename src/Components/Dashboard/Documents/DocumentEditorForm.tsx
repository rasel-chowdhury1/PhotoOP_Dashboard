import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FieldGroup } from "@/Components/ui/field";
import { Button } from "@/Components/ui/button";
import { FormRichText } from "@/Components/ui/CustomUi/ReuseForm/Form";
import SpinLoader from "@/Components/ui/CustomUi/SpinLoader";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { documentContentSchema } from "@/schemas/setting";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/features/setting/settingApi";

const DOCUMENT_ENDPOINTS: Record<SettingDocumentKey, string> = {
  privacy_policy: "privacy",
  term_condition: "termAndConditions",
  about_us: "aboutUs",
};

interface DocumentEditorFormProps {
  documentKey: SettingDocumentKey;
  role: SettingDocumentRole;
}

const DocumentEditorForm = ({ documentKey, role }: DocumentEditorFormProps) => {
  const path = `${DOCUMENT_ENDPOINTS[documentKey]}/${role}`;
  const { data, isFetching } = useGetSettingQuery(path, {
    refetchOnMountOrArgChange: true,
  });
  const [updateSetting, { isLoading: isSaving }] = useUpdateSettingMutation();

  const form = useForm({
    resolver: zodResolver(documentContentSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    form.reset({ content: data?.data?.content ?? "" });
  }, [data?.data?.content, form]);

  const onFinish = async (values: z.infer<typeof documentContentSchema>) => {
    await tryCatchWrapper(
      updateSetting,
      { body: { key: documentKey, role, content: values.content } },
      "Saving document..."
    );
  };

  if (isFetching) {
    return (
      <div className="py-20 text-center">
        <SpinLoader />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onFinish)}>
      <FieldGroup>
        <FormRichText control={form.control} name="content" label="Content" />
        <Button className="py-5 text-base w-fit" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </FieldGroup>
    </form>
  );
};

export default DocumentEditorForm;
