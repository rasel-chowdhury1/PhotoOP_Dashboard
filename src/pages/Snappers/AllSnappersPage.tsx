import ViewSnapperDetailsPage from "@/Components/Dashboard/AllSnappersPage/ViewSnapperDetailsPage";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useGetApprovedSnappersQuery } from "@/redux/features/snapper/snapperApi";
import { useDeleteUserMutation } from "@/redux/features/user/userApi";
import { formatDate } from "@/utils/dateFormet";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AllImages } from "../../../public/images/AllImages";

const getSnapperProfile = (record: ISnapper): ISnapperProfile | null =>
    typeof record.snapperId === "object" && record.snapperId !== null
        ? record.snapperId
        : null;

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "active": return "success";
        case "blocked": return "error";
        case "suspended": return "warning";
        default: return "warning";
    }
};

const AllSnappersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<ISnapper | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState<ISnapper | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetApprovedSnappersQuery(
        { page: currentPage, limit, searchTerm: search || undefined, status: filterStatus },
        { refetchOnMountOrArgChange: true }
    );

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();


    if(!isFetching) console.log("snapper data =>>> ", data)
    const snappers: ISnapper[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenModal = (record: ISnapper) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentRecord(null);
    };

    const handleDeleteClick = (record: ISnapper) => {
        setDeleteRecord(record);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async (record: ISnapper) => {
        try {
            await deleteUser({ userId: record._id }).unwrap();
            toast.success("Snapper deleted successfully");
            setIsDeleteModalOpen(false);
            setDeleteRecord(null);
        } catch {
            toast.error("Failed to delete snapper");
        }
    };

    const columns: Column<ISnapper>[] = [
        {
            header: "#",
            accessorKey: "_id",
            fixed: true,
            width: 60,
            render: (_: unknown, __: ISnapper, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Snapper",
            accessorKey: "fullName",
            render: (value: string, record: ISnapper) => (
                <div className="flex items-center gap-2">
                    <img
                        src={record.profileImage ? `${serverUrl}${record.profileImage}` : AllImages.profile}
                        alt={value}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <span className="font-medium">{value || "—"}</span>
                </div>
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
        },
        {
            header: "Phone",
            accessorKey: "phoneNumber",
            render: (value: string, record: ISnapper) =>
                value ? `${record.countryCode ?? ""} ${value}` : "—",
        },
        {
            header: "Hourly Rate",
            accessorKey: "snapperId",
            render: (_: unknown, record: ISnapper) => {
                const profile = getSnapperProfile(record);
                return profile ? `$${profile.hourlyRate}/hr` : "—";
            },
        },
        {
            header: "Specialties",
            accessorKey: "snapperId",
            render: (_: unknown, record: ISnapper) => {
                const profile = getSnapperProfile(record);
                if (!profile?.specialties?.length) return "—";
                return (
                    <div className="flex flex-wrap gap-1 max-w-48">
                        {profile.specialties.slice(0, 2).map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium capitalize">
                                {s}
                            </span>
                        ))}
                        {profile.specialties.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{profile.specialties.length - 2}</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Rating",
            accessorKey: "averageRating",
            render: (value: number) => <ReuseRating value={value ?? 0} size={16} showValue />,
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
            header: "Joined",
            accessorKey: "createdAt",
            render: (value: string) => value ? formatDate(value) : "—",
        },
        {
            header: "Action",
            accessorKey: "_id",
            render: (_: unknown, record: ISnapper) => (
                <div className="flex items-center gap-3">
                    <ReusableTooltip content="View Details">
                        <IoEyeOutline
                            onClick={() => handleOpenModal(record)}
                            className="text-2xl cursor-pointer"
                        />
                    </ReusableTooltip>
                    <ReusableTooltip content="Delete">
                        <Trash2
                            onClick={() => handleDeleteClick(record)}
                            className="size-4.5 text-destructive cursor-pointer"
                        />
                    </ReusableTooltip>
                </div>
            ),
        },
    ];

    return (
        <PageWraper title="All Snappers">
            <div className="flex gap-3 flex-wrap">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by name or email..."
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
            <ReusableTable<ISnapper>
                data={snappers}
                columns={columns}
                pagination={true}
                scroll={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />
            <ViewSnapperDetailsPage
                isOpen={isModalOpen}
                handleCancle={handleCloseModal}
                currentRecord={currentRecord}
                approvalModal={false}
            />

            <ConfirmModal<ISnapper>
                open={isDeleteModalOpen}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteRecord(null);
                }}
                currentRecord={deleteRecord}
                onConfirm={handleDeleteConfirm}
                title="Delete Snapper"
                description="Are you sure you want to delete this snapper? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                iconPreset="delete"
                loading={isDeleting}
            />
        </PageWraper>
    );
};

export default AllSnappersPage;
