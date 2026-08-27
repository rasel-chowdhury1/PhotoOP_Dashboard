"use client";

import ChangePassword from "@/Components/Dashboard/ProfileSettings/ChangePassword";
import EditProfile from "@/Components/Dashboard/ProfileSettings/EditProfile";
import ReusableTabs from "@/Components/ui/CustomUi/ReusableTabs";
import { useState } from "react";

const ProfileSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "changePassword">(
    "profile"
  );
  return (
    <div>
      <div className="mt-28">
        <ReusableTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          align="left"
          tabs={[
            {
              label: "Edit Profile",
              value: "profile",
              content: <EditProfile />,
            },
            {
              label: "Change Password",
              value: "changePassword",
              content: <ChangePassword />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
