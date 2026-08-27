import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { adminRoutes } from "@/Routes/admin.route";
import useUserData from "@/hooks/useUserData";

export function AppSidebar() {
  const userData = useUserData();
  return (
    <Sidebar collapsible={"icon"} variant={"sidebar"}>
      <SidebarHeader>
        {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Photo Op</h1> */}
        <img
          src="/images/logo-large.png"
          alt="Photo Op"
          className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
        />
      </SidebarHeader>
      <SidebarContent>
        {adminRoutes?.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
