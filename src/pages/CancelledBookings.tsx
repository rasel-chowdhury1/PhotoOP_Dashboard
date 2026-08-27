import ViewBookingDetailsModal from "@/Components/Dashboard/BookingManagementPage/ViewBookingDetailsModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetAdminBookingsQuery } from "@/redux/features/booking/bookingApi";
import { formatDate } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";

const getSnapperName = (record: IBooking): string =>
    typeof record.snapperId === "object" && record.snapperId !== null
        ? record.snapperId.fullName
        : "—";

const CancelledBookingsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IBooking | null>(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data, isFetching } = useGetAdminBookingsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: "cancelled",
    }, { refetchOnMountOrArgChange: true });

    const bookings: IBooking[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenModal = (record: IBooking) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRecord(null);
        setIsModalOpen(false);
    };

    const columns: Column<IBooking>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IBooking, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Booking ID",
            accessorKey: "bookingId",
            cellClassName: "font-mono font-medium",
        },
        {
            header: "Customer",
            accessorKey: "fullName",
            render: (value: string, record: IBooking) => (
                <div className="flex flex-col">
                    <span className="font-medium">{value || "—"}</span>
                    <span className="text-xs text-muted-foreground">{record.email}</span>
                </div>
            ),
        },
        {
            header: "Snapper",
            accessorKey: "snapperId",
            render: (_: unknown, record: IBooking) => getSnapperName(record),
        },
        {
            header: "Shoot Date",
            accessorKey: "bookingDate",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Total",
            accessorKey: "totalPrice",
            render: (value: number) => <span className="font-semibold">${value ?? 0}</span>,
        },
        {
            header: "Cancelled Reason",
            accessorKey: "cancellationReason",
            render: (value: string) => (
                <span title={value} className="block max-w-56 truncate text-xs">
                    {value || "—"}
                </span>
            ),
        },
        {
            header: "Payment",
            accessorKey: "paymentStatus",
            render: (value: string) => (
                <Tag theme={value === "paid" ? "success" : value === "failed" ? "error" : value === "refunded" ? "purple" : "warning"} className="capitalize">
                    {value?.replace(/_/g, " ")}
                </Tag>
            ),
        },
        {
            header: "Date",
            accessorKey: "cancelledAt",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IBooking) => (
                <ReusableTooltip content="View Details">
                    <IoEyeOutline
                        onClick={() => handleOpenModal(record)}
                        className="text-2xl cursor-pointer"
                    />
                </ReusableTooltip>
            ),
        },
    ];

    return (
        <PageWraper title="Cancelled Bookings">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by booking ID..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
            </div>
            <ReusableTable<IBooking>
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

            <ViewBookingDetailsModal
                isOpen={isModalOpen}
                handleCancle={handleCloseModal}
                currentRecord={currentRecord}
            />
        </PageWraper>
    );
};

export default CancelledBookingsPage;
