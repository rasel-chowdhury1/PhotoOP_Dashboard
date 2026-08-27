import ViewCustomerModal from "@/Components/Dashboard/Customer/CustomerModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import {
    useBanUserMutation,
    useGetCustomersQuery,
    useUnbanUserMutation,
    useWarnUserMutation,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "active": return "success";
        case "blocked": return "error";
        case "suspended": return "warning";
        default: return "warning";
    }
};

const CustomerPage = () => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isWarnModalOpen, setIsWarnModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IUser | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;

    const { data, isFetching } = useGetCustomersQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: filterStatus,
    }, { refetchOnMountOrArgChange: true });

    const [banUser, { isLoading: isBanning }] = useBanUserMutation();
    const [unbanUser, { isLoading: isUnbanning }] = useUnbanUserMutation();
    const [warnUser, { isLoading: isWarning }] = useWarnUserMutation();

    const customers: IUser[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenView = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(true);
    };

    const handleCloseView = () => {
        setCurrentRecord(null);
        setIsViewModalOpen(false);
    };

    const handleBanClick = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(false);
        setIsBanModalOpen(true);
    };

    const handleWarnClick = (record: IUser) => {
        setCurrentRecord(record);
        setIsViewModalOpen(false);
        setIsWarnModalOpen(true);
    };

    const handleBanConfirm = async (record: IUser, reason?: string) => {
        try {
            if (record.status === "blocked") {
                await unbanUser({ userId: record._id }).unwrap();
                toast.success("Customer unblocked successfully");
            } else {
                await banUser({ userId: record._id, reason: reason ?? "" }).unwrap();
                toast.success("Customer blocked successfully");
            }
            setIsBanModalOpen(false);
            setCurrentRecord(null);
        } catch {
            toast.error("Failed to update account status");
        }
    };

    const handleWarnConfirm = async (record: IUser, reason?: string) => {
        try {
            await warnUser({ userId: record._id, reason: reason ?? "" }).unwrap();
            toast.success("Warning sent successfully");
            setIsWarnModalOpen(false);
            setCurrentRecord(null);
        } catch {
            toast.error("Failed to send warning");
        }
    };

    const isBlocked = currentRecord?.status === "blocked";

    const columns: Column<IUser>[] = [
        {
            header: "ID",
            accessorKey: "_id",
            headerClassName: "",
            cellClassName: "font-medium",
            fixed: true,
            width: 100,
            render: (_: unknown, __: IUser, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Full Name",
            accessorKey: "fullName",
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone Number",
            accessorKey: "phoneNumber",
            render: (value: string, record: IUser) =>
                value ? `${record.countryCode ?? ""} ${value}` : "—",
        },
        {
            header: "Age",
            accessorKey: "dateOfBirth",
            render: (value: string) => {
                if (!value) return "—";
                const birth = new Date(value);
                const today = new Date();
                let age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                return age;
            },
        },
        {
            header: "Rating",
            accessorKey: "averageRating",
            render: (value: number) => <ReuseRating value={value ?? 0} size={20} showValue />,
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
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: IUser) => (
                <div>
                    <ReusableTooltip content="View Details">
                        <IoEyeOutline
                            onClick={() => handleOpenView(record)}
                            className="text-2xl cursor-pointer"
                        />
                    </ReusableTooltip>
                </div>
            ),
        },
    ];

    return (
        <PageWraper title="Customers">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filterStatus}
                    options={[
                        { value: "All", label: "All" },
                        { value: "active", label: "Active" },
                        { value: "blocked", label: "Blocked" },
                        { value: "suspended", label: "Suspended" },
                    ]}
                    onChange={setFilterStatus}
                />
            </div>

            <ReusableTable<IUser>
                data={customers}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />

            {/* View Details Modal */}
            <ViewCustomerModal
                isOpen={isViewModalOpen}
                handleCancle={handleCloseView}
                currentRecord={currentRecord}
                onBan={handleBanClick}
                onWarn={handleWarnClick}
            />

            {/* Block / Unblock Confirm Modal */}
            <ConfirmModal<IUser>
                open={isBanModalOpen}
                onCancel={() => {
                    setIsBanModalOpen(false);
                    setCurrentRecord(null);
                }}
                currentRecord={currentRecord}
                onConfirm={handleBanConfirm}
                title={isBlocked ? "Unblock this customer?" : "Block this customer?"}
                description={
                    isBlocked
                        ? "The customer will regain full access to the platform."
                        : "The customer will be blocked from accessing the platform."
                }
                confirmText={isBlocked ? "Unblock" : "Block"}
                variant={isBlocked ? "success" : "danger"}
                iconPreset={isBlocked ? "unblock" : "block"}
                withReason={!isBlocked}
                reasonLabel="Block Reason"
                loading={isBanning || isUnbanning}
            />

            {/* Send Warning Confirm Modal */}
            <ConfirmModal<IUser>
                open={isWarnModalOpen}
                onCancel={() => {
                    setIsWarnModalOpen(false);
                    setCurrentRecord(null);
                }}
                currentRecord={currentRecord}
                onConfirm={handleWarnConfirm}
                title="Send Warning"
                description="A warning notification will be sent to this customer."
                confirmText="Send Warning"
                variant="warning"
                iconPreset="decline"
                withReason={true}
                reasonLabel="Warning Reason"
                loading={isWarning}
            />
        </PageWraper>
    );
};

export default CustomerPage;
