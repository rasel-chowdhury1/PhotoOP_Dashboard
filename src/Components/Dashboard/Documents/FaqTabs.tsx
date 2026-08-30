import { useState } from "react";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTabs from "@/Components/ui/CustomUi/ReusableTabs";
import FaqList from "./FaqList";

const FaqTabs = () => {
  const [activeTab, setActiveTab] = useState<FaqRole>("user");

  return (
    <PageWraper title="FAQ">
      <ReusableTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        align="left"
        tabs={[
          { label: "User", value: "user", content: <FaqList role="user" /> },
          { label: "Snapper", value: "snapper", content: <FaqList role="snapper" /> },
        ]}
      />
    </PageWraper>
  );
};

export default FaqTabs;
