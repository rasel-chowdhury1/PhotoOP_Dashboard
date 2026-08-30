import { useState } from "react";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTabs from "@/Components/ui/CustomUi/ReusableTabs";
import DocumentEditorForm from "./DocumentEditorForm";

interface DocumentPageProps {
  title: string;
  documentKey: SettingDocumentKey;
}

const DocumentPage = ({ title, documentKey }: DocumentPageProps) => {
  const [activeTab, setActiveTab] = useState<SettingDocumentRole>("user");

  return (
    <PageWraper title={title}>
      <ReusableTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        align="left"
        tabs={[
          {
            label: "User",
            value: "user",
            content: <DocumentEditorForm documentKey={documentKey} role="user" />,
          },
          {
            label: "Snapper",
            value: "snapper",
            content: <DocumentEditorForm documentKey={documentKey} role="snapper" />,
          },
        ]}
      />
    </PageWraper>
  );
};

export default DocumentPage;
