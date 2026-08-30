
import ViewTransactionModal from "@/Components/Dashboard/TransactionPage/ViewTransactionModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetTransactionsQuery } from "@/redux/features/transaction/transactionApi";
import { formetDateAndTime } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "SUCCEEDED": return "success";
        case "PENDING": return "warning";
        case "FAILED": return "error";
        case "REFUNDED": return "warning";
        default: return "warning";
    }
};

const formatLabel = (value?: string | null) =>
    value ? value.charAt(0) + value.slice(1).toLowerCase() : "—";

const TransactionPage = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<ITransaction | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data, isFetching } = useGetTransactionsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        // status: filterStatus,
    }, { refetchOnMountOrArgChange: true });
    
    if(!isFetching){
        console.log("transaction data =>>> ", data)
    }
    const transactions: ITransaction[] = data?.data?.result ?? [];
    const total = data?.data?.meta?.total ?? 0;

    const handleOpenView = (record: ITransaction) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseView = () => {
        setCurrentRecord(null);
        setIsViewModalOpen(false);
    };

    const columns: Column<ITransaction>[] = [
        {
            header: "ID",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: ITransaction, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Payment No.",
            accessorKey: "paymentNumber",
            cellClassName: "font-medium font-mono",
        },
        {
            header: "Customer",
            accessorKey: "userId",
            render: (value: ITransactionUser) => value?.fullName || "—",
        },
        {
            header: "Booking ID",
            accessorKey: "bookingId",
            render: (value: ITransactionBooking | null) => (
                <span className="font-mono text-xs text-gray-600">
                    {value?.bookingId || "—"}
                </span>
            ),
        },
        {
            header: "Type",
            accessorKey: "paymentType",
            render: (value: string) => (
                <span className="capitalize">{formatLabel(value)}</span>
            ),
        },
        {
            header: "Amount",
            accessorKey: "amount",
            render: (value: number, record: ITransaction) => (
                <span className="font-semibold">
                    {value} {record.currency}
                </span>
            ),
        },
        {
            header: "Gateway",
            accessorKey: "gateway",
            render: (value: string) => (
                <span className="capitalize">{formatLabel(value)}</span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={statusTheme(value)} className="capitalize">
                    {formatLabel(value)}
                </Tag>
            ),
        },
        {
            header: "Paid At",
            accessorKey: "paidAt",
            render: (value: string | null) =>
                value ? formetDateAndTime(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: ITransaction) => (
                <ReusableTooltip content="View Details">
                    <IoEyeOutline
                        onClick={() => handleOpenView(record)}
                        className="text-2xl cursor-pointer"
                    />
                </ReusableTooltip>
            ),
        },
    ];

    return (
        <PageWraper title="Transactions">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by payment number..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All" },
                        { value: "SUCCEEDED", label: "Succeeded" },
                        { value: "PENDING", label: "Pending" },
                        { value: "FAILED", label: "Failed" },
                        { value: "REFUNDED", label: "Refunded" },
                    ]}
                    onChange={setFilterStatus}
                />
            </div>

            <ReusableTable<ITransaction>
                data={transactions}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewTransactionModal
                isOpen={isViewModalOpen}
                handleCancle={handleCloseView}
                currentRecord={currentRecord}
            />
        </PageWraper>
    );
};

export default TransactionPage;