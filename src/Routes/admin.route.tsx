import CancelledBookingsPage from "@/pages/CancelledBookings";
import AllSnappersPage from "@/pages/Snappers/AllSnappersPage";
import SnappersRequestPage from "@/pages/Snappers/SnappersRequest";
import EarningPage from "@/pages/EarningPage";
import Overview from "@/pages/OverviewPage";
import CustomerPage from "@/pages/CustomerPage";
import ProfileSettingsPage from "@/pages/ProfileSettings";
import BookingManagementPage from "@/pages/BookingManagement";
import {
  LayoutDashboard,
  Users,
  Camera,
  CalendarCheck,
  Percent,
  Receipt,
  CreditCard,
  HandCoins,
  PiggyBank,
  Settings,
  FileText,
  // Users kept for Customers
} from "lucide-react";
import TransactionPage from "@/pages/TransactionPage";
import WithdrawRequestsPage from "@/pages/WithdrawRequestsPage";
import PayoutMethodsPage from "@/pages/PayoutMethodsPage";
import ServiceChargePage from "@/pages/ServiceChargePage";
import PrivacyPolicyPage from "@/pages/Documents/PrivacyPolicyPage";
import TermsConditionsPage from "@/pages/Documents/TermsConditionsPage";
import AboutUsPage from "@/pages/Documents/AboutUsPage";
import FaqPage from "@/pages/Documents/FaqPage";

export const adminRoutes = [
  {
    title: "",
    items: [
      {
        title: "Overview",
        url: "overview",
        icon: LayoutDashboard,
        element: <Overview />, // JSX element for route
      },
      {
        title: "Customers",
        url: "users",
        icon: Users,
        element: <CustomerPage />, // JSX element for route
      },
      {
        title: "Snappers",
        icon: Camera,
        items: [
          {
            title: "All snappers",
            url: "snappers/all-snappers",
            element: <AllSnappersPage />,
          },
          {
            title: "Snapper Request",
            url: "snappers/snapper-request",
            element: <SnappersRequestPage />,
          },
        ],
      },
            {
        title: "Bookings Management",
        icon: CalendarCheck,
        items: [
          {
            title: "All Bookings",
            url: "booking-management",
            element: <BookingManagementPage />,
          },
          {
            title: "Cancelled Bookings",
            url: "cancelled-bookings",
            element: <CancelledBookingsPage />,
          },
        ],
      },

      {
        title: "Service Charge",
        url: "service-charge",
        icon: Percent,
        element: <ServiceChargePage />
      },

      {
        title: "Transactions",
        url: "tranasaction",
        icon: Receipt,
        element: <TransactionPage />, // JSX element for route
      },
      {
        title: "Payout Methods",
        url: "payout-methods",
        icon: CreditCard,
        element: <PayoutMethodsPage />, // JSX element for route
      },
      {
        title: "Withdraw Requests",
        url: "withdraw-requests",
        icon: HandCoins,
        element: <WithdrawRequestsPage />, // JSX element for route
      },
      {
        title: "Earnings",
        url: "earnings",
        icon: PiggyBank,
        element: <EarningPage />, // JSX element for route
      },

      // {
      //   title: "Reports",
      //   url: "reports",
      //   icon: FileBarChart2,
      //   element: <ReportsPage />,
      // },
      // {
      //   title: "User Feedback",
      //   url: "user-feedback",
      //   icon: MessageCircle,
      //   element: <UserFeedback />,
      // },
      // {
      //   title: "Promo",
      //   url: "promo",
      //   icon: Tag,
      //   element: <PromoPage />,
      // },
      {
        title: "Documents",
        icon: FileText,
        items: [
          {
            title: "Privacy Policy",
            url: "documents/privacy-policy",
            element: <PrivacyPolicyPage />,
          },
          {
            title: "Terms & Conditions",
            url: "documents/terms-conditions",
            element: <TermsConditionsPage />,
          },
          {
            title: "About Us",
            url: "documents/about-us",
            element: <AboutUsPage />,
          },
          {
            title: "FAQ",
            url: "documents/faq",
            element: <FaqPage />,
          },
        ],
      },
      {
        title: "Profile Settings",
        url: "profile-settings",
        icon: Settings,
        element: <ProfileSettingsPage />,
      },
    ],
  }
];