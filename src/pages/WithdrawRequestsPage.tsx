import ViewWithdrawModal from "@/Components/Dashboard/WithdrawRequestsPage/ViewWithdrawModal";
import ProcessWithdrawModal, { ProcessFormValues } from "@/Components/Dashboard/WithdrawRequestsPage/ProcessWithdrawModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import {
    useGetAllWithdrawRequestsQuery,
    useProcessWithdrawRequestMutation,
    useRejectWithdrawRequestMutation,
} from "@/redux/features/withdraw/withdrawApi";
import { formatDate } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";

const statusTheme = (status: string): "success" | "error" | "warning" | "blue" => {
    switch (status?.toUpperCase()) {
        case "COMPLETED": return "success";
        case "FAILED":
        case "REJECTED": return "error";
        case "PROCESSING": return "blue";
        case "CANCELLED": return "warning";
        default: return "warning"; // PENDING
    }
};

const WithdrawRequestsPage = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [processModalOpen, setProcessModalOpen] = useState(false);
    const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IWithdraw | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data, isFetching } = useGetAllWithdrawRequestsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        ...(filterStatus !== "All" ? { status: filterStatus } : {}),
    }, { refetchOnMountOrArgChange: true });

    const [processWithdraw, { isLoading: processing }] = useProcessWithdrawRequestMutation();
    const [rejectWithdraw, { isLoading: rejecting }] = useRejectWithdrawRequestMutation();
    const isActionLoading = processing || rejecting;

    const withdraws: IWithdraw[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenView = (record: IWithdraw) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const closeAll = () => {
        setIsViewModalOpen(false);
        setProcessModalOpen(false);
        setRejectConfirmOpen(false);
        setCurrentRecord(null);
    };

    const handleProcessSubmit = async (values: ProcessFormValues) => {
        if (!currentRecord) return;
        try {
            await processWithdraw({
                id: currentRecord._id,
                status: values.status,
                ...(values.status === "COMPLETED" ? { transactionId: values.transactionId } : {}),
                ...(values.status === "FAILED" ? { failureReason: values.failureReason } : {}),
            }).unwrap();
            toast.success(`Withdraw request marked as ${values.status}`);
            closeAll();
        } catch {
            toast.error("Action failed. Please try again.");
        }
    };

    const handleReject = async (_: IWithdraw, reason?: string) => {
        if (!currentRecord) return;
        try {
            await rejectWithdraw({
                id: currentRecord._id,
                adminNote: reason || "",
            }).unwrap();
            toast.success("Withdraw request rejected");
            closeAll();
        } catch {
            toast.error("Action failed. Please try again.");
        }
    };

    const columns: Column<IWithdraw>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IWithdraw, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Withdraw #",
            accessorKey: "withdrawNumber",
            cellClassName: "font-medium font-mono",
        },
        {
            header: "Snapper",
            accessorKey: "snapperId",
            render: (value: IWithdrawSnapper) => (
                <div className="flex flex-col">
                    <span className="font-medium">{value?.fullName || "—"}</span>
                    <span className="text-xs text-muted-foreground">{value?.email || "—"}</span>
                </div>
            ),
        },
        {
            header: "Amount",
            accessorKey: "amount",
            render: (value: number, record: IWithdraw) => (
                <span className="font-semibold">{record.currency} {value.toFixed(2)}</span>
            ),
        },
        {
            header: "Net Payout",
            accessorKey: "netAmount",
            render: (value: number, record: IWithdraw) => (
                <span className="font-semibold text-emerald-600">{record.currency} {value.toFixed(2)}</span>
            ),
        },
        {
            header: "Method",
            accessorKey: "paymentMethodId",
            render: (value: IWithdrawPayoutMethod) => (
                <div className="flex flex-col">
                    <span className="text-xs font-medium capitalize">{value?.type?.replace(/_/g, " ") || "—"}</span>
                    {value?.accountDetails?.accountNumber ? (
                        <span className="text-xs text-muted-foreground font-mono">
                            {value.accountDetails.accountNumber}
                        </span>
                    ) : value?.last4 ? (
                        <span className="text-xs text-muted-foreground">•••• {value.last4}</span>
                    ) : null}
                </div>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={statusTheme(value)} className="capitalize">
                    {value}
                </Tag>
            ),
        },
        {
            header: "Requested",
            accessorKey: "requestedAt",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IWithdraw) => (
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
        <PageWraper title="Withdraw Requests">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by snapper name, email, withdraw #..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All Status" },
                        { value: "PENDING", label: "Pending" },
                        { value: "PROCESSING", label: "Processing" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "FAILED", label: "Failed" },
                        { value: "REJECTED", label: "Rejected" },
                        { value: "CANCELLED", label: "Cancelled" },
                    ]}
                    onChange={setFilterStatus}
                />
            </div>

            <ReusableTable<IWithdraw>
                data={withdraws}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewWithdrawModal
                isOpen={isViewModalOpen}
                handleCancle={closeAll}
                currentRecord={currentRecord}
                onProcess={() => setProcessModalOpen(true)}
                onReject={() => setRejectConfirmOpen(true)}
                isActionLoading={isActionLoading}
            />

            <ProcessWithdrawModal
                record={currentRecord}
                isOpen={processModalOpen}
                onClose={() => setProcessModalOpen(false)}
                onSubmit={handleProcessSubmit}
                isLoading={processing}
            />

            <ConfirmModal<IWithdraw>
                open={rejectConfirmOpen}
                onCancel={() => setRejectConfirmOpen(false)}
                currentRecord={currentRecord}
                onConfirm={handleReject}
                title="Reject Withdrawal"
                description={`Reject withdrawal request #${currentRecord?.withdrawNumber}. Please provide a reason.`}
                confirmText="Reject"
                variant="danger"
                iconPreset="decline"
                withReason={true}
                reasonLabel="Rejection Reason"
                reasonRequired={true}
                loading={isActionLoading}
            />
        </PageWraper>
    );
};

export default WithdrawRequestsPage;
