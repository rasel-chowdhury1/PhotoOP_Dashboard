import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../Shared/app-sidebar";
import Container from "../ui/CustomUi/Container";

export default function DashboardLayout() {
  const path = useLocation().pathname;

  const pathName = [
    {
      title: "Overview",
      url: "/admin/overview",
    },
    {
      title: "Customers",
      url: "/admin/customers",
    },
    {
      title: "Snappers",
      url: "/admin/snappers/all-snappers",
    },
    {
      title: "Snapper Request",
      url: "/admin/snappers/snapper-request",
    },
    {
      title: "Booking Management",
      url: "/admin/booking-management",
    },
        {
      title: "Cancelled Bookings",
      url: "/admin/cancelled-bookings",
    },
    
    {
      title: "Transactions",
      url: "/admin/transactions",
    },
    {
      title: "Earnings",
      url: "/admin/earnings",
    },

    {
      title: "Reports",
      url: "/admin/reports",
    },

    {
      title: "User Feedback",
      url: "/admin/user-feedback",
    },
    {
      title: "Promo",
      url: "/admin/promo",
    },
    {
      title: "Profile Settings",
      url: "/admin/profile-settings",
    },
  ]
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full overflow-x-hidden relative">
        <div className="p-4 flex items-center gap-4 border-b w-full bg-background z-10 fixed! top-0">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold">{pathName.find((item) => item.url === path)?.title}</h1>
        </div>
        <div className="mt-16">
          <Container>
            <Outlet />
          </Container>
        </div>
      </main>
    </SidebarProvider>
  );
}
