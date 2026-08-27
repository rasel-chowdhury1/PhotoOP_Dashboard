import ViewEarningModal from "@/Components/Dashboard/EarningPage/ViewEarningModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetPaymentsQuery } from "@/redux/features/payment/paymentApi";
import { formetDateAndTime } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import {
    HiOutlineCurrencyDollar,
    HiOutlineReceiptPercent,
    HiOutlineBanknotes,
    HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

// ---- Types matching the new API response ----
interface IEarningUser {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface IEarningPackage {
    _id: string;
    packageName: string;
    price: number;
}

interface IEarningPaymentInfo {
    _id: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    gateway: string;
    checkoutSessionId?: string;
    transactionId: string;
    status: "SUCCEEDED" | "PENDING" | "FAILED" | string;
    paidAt: string;
}

export interface IBookingEarning {
    _id: string;
    bookingId: string;
    userId: IEarningUser;
    snapperId: IEarningUser;
    packageId: IEarningPackage;
    totalPrice: number;
    serviceFee: number;
    snapperEarning: number;
    completedAt: string;
    payment: IEarningPaymentInfo;
}

interface IEarningsResponseData {
    totalRevenue: number;
    adminCommission: number;
    snapperEarning: number;
    totalBookings: number;
    bookings: IBookingEarning[];
}

const EarningPage = () => {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRecord, setCurrentRecord] = useState<IBookingEarning | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const limit = 10;

    const { data, isFetching } = useGetPaymentsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
    }, { refetchOnMountOrArgChange: true });


    const earnings: IEarningsResponseData | undefined = data?.data;
    const bookings: IBookingEarning[] = earnings?.bookings ?? [];
    const total = data?.data?.meta?.total ?? 0;

    const handleOpenView = (record: IBookingEarning) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseView = () => {
        setCurrentRecord(null);
        setIsViewModalOpen(false);
    };

    const columns: Column<IBookingEarning>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IBookingEarning, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Booking ID",
            accessorKey: "bookingId",
            cellClassName: "font-medium font-mono",
        },
        {
            header: "Customer",
            accessorKey: "userId",
            render: (value: IEarningUser) => (
                <span className="font-medium text-gray-800">
                    {value?.fullName || "—"}
                </span>
            ),
        },
        {
            header: "Snapper",
            accessorKey: "snapperId",
            render: (value: IEarningUser) => (
                <span className="font-medium text-gray-800">
                    {value?.fullName || "—"}
                </span>
            ),
        },
        {
            header: "Package",
            accessorKey: "packageId",
            render: (value: IEarningPackage) => (
                <span className="capitalize">{value?.packageName || "—"}</span>
            ),
        },
        {
            header: "Total Fare",
            accessorKey: "totalPrice",
            render: (value: number) => (
                <span className="font-semibold">${value}</span>
            ),
        },
        {
            header: "Admin Commission",
            accessorKey: "serviceFee",
            render: (value: number) => `$${value}`,
        },
        {
            header: "Snapper Earning",
            accessorKey: "snapperEarning",
            render: (value: number) => `$${value}`,
        },
        {
            header: "Status",
            accessorKey: "payment",
            render: (value: IEarningPaymentInfo) => {
                const status = value?.status;
                return (
                    <Tag
                        theme={
                            status === "SUCCEEDED"
                                ? "success"
                                : status === "PENDING"
                                ? "warning"
                                : "error"
                        }
                    >
                        {status
                            ? status.charAt(0) + status.slice(1).toLowerCase()
                            : "—"}
                    </Tag>
                );
            },
        },
        {
            header: "Date",
            accessorKey: "payment",
            render: (value: IEarningPaymentInfo) =>
                value?.paidAt ? formetDateAndTime(value.paidAt) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IBookingEarning) => (
                <ReusableTooltip content="View Details">
                    <IoEyeOutline
                        onClick={() => handleOpenView(record)}
                        className="text-2xl cursor-pointer"
                    />
                </ReusableTooltip>
            ),
        },
    ];

    const statCards = [
        {
            label: "Total Revenue",
            value: `$${earnings?.totalRevenue ?? 0}`,
            icon: <HiOutlineCurrencyDollar className="text-2xl" />,
            accent: "bg-blue-50 text-blue-600",
        },
        {
            label: "Admin Commission",
            value: `$${earnings?.adminCommission ?? 0}`,
            icon: <HiOutlineReceiptPercent className="text-2xl" />,
            accent: "bg-amber-50 text-amber-600",
        },
        {
            label: "Snapper Earning",
            value: `$${earnings?.snapperEarning ?? 0}`,
            icon: <HiOutlineBanknotes className="text-2xl" />,
            accent: "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Total Bookings",
            value: earnings?.totalBookings ?? 0,
            icon: <HiOutlineClipboardDocumentList className="text-2xl" />,
            accent: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <PageWraper title="Earnings">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                        <div className={`flex items-center justify-center w-11 h-11 rounded-lg ${card.accent}`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">{card.label}</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {isFetching ? "—" : card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by booking ID..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
            </div>
            <ReusableTable<IBookingEarning>
                data={bookings}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewEarningModal
                isOpen={isViewModalOpen}
                handleCancle={handleCloseView}
                currentRecord={currentRecord}
            />
        </PageWraper>
    );
};

export default EarningPage;