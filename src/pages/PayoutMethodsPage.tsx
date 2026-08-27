import ViewPayoutMethodModal from "@/Components/Dashboard/PayoutMethodsPage/ViewPayoutMethodModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetAllPayoutMethodsQuery, useVerifyPayoutMethodMutation } from "@/redux/features/payoutMethod/payoutMethodApi";
import { formatDate } from "@/utils/dateFormet";
import { useState } from "react";
import { Building2, CreditCard } from "lucide-react";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "ACTIVE": return "success";
        case "INACTIVE": return "error";
        default: return "warning";
    }
};

const typeIcon = (type: string) => {
    switch (type) {
        case "BANK_ACCOUNT": return <Building2 className="size-4" />;
        default: return <CreditCard className="size-4" />;
    }
};

const PayoutMethodsPage = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [confirmVerifyOpen, setConfirmVerifyOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IPayoutMethod | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterType, setFilterType] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data, isFetching } = useGetAllPayoutMethodsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        ...(filterStatus !== "All" ? { status: filterStatus } : {}),
        ...(filterType !== "All" ? { type: filterType } : {}),
    }, { refetchOnMountOrArgChange: true });

    const [verifyMethod, { isLoading: verifying }] = useVerifyPayoutMethodMutation();

    const methods: IPayoutMethod[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenView = (record: IPayoutMethod) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const closeAll = () => {
        setIsViewModalOpen(false);
        setConfirmVerifyOpen(false);
        setCurrentRecord(null);
    };

    const handleVerifyConfirm = async () => {
        if (!currentRecord) return;
        try {
            await verifyMethod({ id: currentRecord._id }).unwrap();
            toast.success("Payout method verified successfully");
            closeAll();
        } catch {
            toast.error("Verification failed. Please try again.");
        }
    };

    const columns: Column<IPayoutMethod>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: IPayoutMethod, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Snapper",
            accessorKey: "snapperId",
            render: (value: IPayoutMethodSnapper) => (
                <div className="flex flex-col">
                    <span className="font-medium">{value?.fullName || "—"}</span>
                    <span className="text-xs text-muted-foreground">{value?.email || "—"}</span>
                </div>
            ),
        },
        {
            header: "Type",
            accessorKey: "type",
            render: (value: string) => (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                    {typeIcon(value)}
                    <span className="text-xs font-medium text-foreground capitalize">{value?.replace("_", " ")}</span>
                </div>
            ),
        },
        {
            header: "Provider",
            accessorKey: "provider",
            render: (value: string) => value || "—",
        },
        {
            header: "Account",
            accessorKey: "last4",
            render: (value: string) => (
                <span className="font-mono text-xs">{value ? `•••• ${value}` : "—"}</span>
            ),
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={statusTheme(value)} className="capitalize">
                    {value?.replace("_", " ")}
                </Tag>
            ),
        },
        {
            header: "Verified",
            accessorKey: "isVerified",
            render: (value: boolean) => (
                <Tag theme={value ? "success" : "warning"} className="capitalize">
                    {value ? "Yes" : "No"}
                </Tag>
            ),
        },
        {
            header: "Default",
            accessorKey: "isDefault",
            render: (value: boolean) => (value ? <Tag theme="blue">Default</Tag> : "—"),
        },
        {
            header: "Added",
            accessorKey: "createdAt",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IPayoutMethod) => (
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
        <PageWraper title="Payout Methods">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by snapper name, email..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All Status" },
                        { value: "ACTIVE", label: "Active" },
                        { value: "INACTIVE", label: "Inactive" },
                        { value: "PENDING_VERIFICATION", label: "Pending Verification" },
                    ]}
                    onChange={setFilterStatus}
                />
                <ReuseFilterSelect
                    value={filterType}
                    options={[
                        { value: "All", label: "All Types" },
                        { value: "BANK_ACCOUNT", label: "Bank Account" },
                        { value: "PAYPAL", label: "PayPal" },
                        { value: "STRIPE", label: "Stripe" },
                    ]}
                    onChange={setFilterType}
                />
            </div>

            <ReusableTable<IPayoutMethod>
                data={methods}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            <ViewPayoutMethodModal
                isOpen={isViewModalOpen}
                handleCancle={closeAll}
                currentRecord={currentRecord}
                onVerify={() => setConfirmVerifyOpen(true)}
                isActionLoading={verifying}
            />

            <ConfirmModal<IPayoutMethod>
                open={confirmVerifyOpen}
                onCancel={() => setConfirmVerifyOpen(false)}
                currentRecord={currentRecord}
                onConfirm={handleVerifyConfirm}
                title="Verify Payout Method"
                description={`Verify ${currentRecord?.snapperId?.fullName ?? "this snapper"}'s ${currentRecord?.type?.replace("_", " ")} account ending in ${currentRecord?.last4 ? `•••• ${currentRecord.last4}` : "—"}?`}
                confirmText="Verify"
                variant="success"
                iconPreset="approve"
                withReason={false}
                reasonLabel=""
                reasonRequired={false}
                loading={verifying}
            />
        </PageWraper>
    );
};

export default PayoutMethodsPage;
