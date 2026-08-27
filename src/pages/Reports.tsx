/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { formatDate } from "@/utils/dateFormet";
import ViewReportModal from "@/Components/Dashboard/ReportsPage/ViewReportModal";
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import { ReusableTooltip } from "@/Components/ui/CustomUi/ReusableTooltip";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseFilterSelect from "@/Components/ui/CustomUi/ReuseForm/ReuseFilterSelect";
import ReuseSearchInput from "@/Components/ui/CustomUi/ReuseForm/ReuseSearchInput";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetReportsQuery, useResolveReportMutation } from "@/redux/features/report/reportApi";
import tryCatchWrapper from "@/utils/tryCatchWrapper";
import { getImageUrl } from "@/helpers/config/envConfig";
import { AllImages } from "../../public/images/AllImages";
import { IoEyeOutline } from "react-icons/io5";

const ReportsPage = () => {
    const serverUrl = getImageUrl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<IReport | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<string>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data, isFetching } = useGetReportsQuery({
        page: currentPage,
        limit,
        searchTerm: search || undefined,
        status: filter === "All" ? undefined : filter,
    }, { refetchOnMountOrArgChange: true });

    const [resolveReport, { isLoading: isResolving }] = useResolveReportMutation();

    const reports: IReport[] = data?.data ?? [];
    const total = data?.meta?.total ?? 0;

    const handleOpenModal = (record: IReport) => {
        setCurrentRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRecord(null);
        setIsModalOpen(false);
    };

    const handleResolve = async (record: IReport) => {
        await tryCatchWrapper(
            resolveReport,
            { params: { id: record.id }, body: { status: "resolved" } },
            "Resolving report..."
        );
        handleCloseModal();
    };

    const columns: Column<IReport>[] = [
        {
            header: "ID",
            accessorKey: "id",
            width: 60,
            render: (_: any, __: any, index: number) => (
                <span className="font-medium text-gray-700">
                    {(currentPage - 1) * limit + index + 1}
                </span>
            ),
        },
        {
            header: "Reported By",
            accessorKey: "reportedBy",
            render: (value: IReportUser) => (
                <div className="flex items-center gap-2">
                    <img
                        src={value?.profileImage ? `${serverUrl}${value.profileImage}` : AllImages.profile}
                        alt={value?.name}
                        className="h-8 w-8 rounded-full object-cover border shrink-0"
                    />
                    <div>
                        <p className="font-medium">{value?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{value?.role}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Reported User",
            accessorKey: "reportedUser",
            render: (value: IReportUser) => (
                <div className="flex items-center gap-2">
                    <img
                        src={value?.profileImage ? `${serverUrl}${value.profileImage}` : AllImages.profile}
                        alt={value?.name}
                        className="h-8 w-8 rounded-full object-cover border shrink-0"
                    />
                    <div>
                        <p className="font-medium">{value?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{value?.role}</p>
                    </div>
                </div>
            ),
        },
        {
            header: "Ride ID",
            accessorKey: "ride",
            render: (value: IReportRide) => value?.rideId ?? "—",
        },
        {
            header: "Reason",
            accessorKey: "reason",
            render: (value: string) =>
                value?.length > 30 ? value.slice(0, 30) + "..." : value,
        },
        {
            header: "Date",
            accessorKey: "createdAt",
            render: (value: string) => formatDate(value),
        },
        {
            header: "Status",
            accessorKey: "status",
            render: (value: string) => (
                <Tag theme={value === "pending" ? "warning" : "success"}>
                    {value === "pending" ? "Pending" : "Resolved"}
                </Tag>
            ),
        },
        {
            header: "Action",
            accessorKey: "id",
            render: (_: any, record: IReport) => (
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
        <PageWraper title="Reports">
            <div className="flex gap-3 flex-wrap mb-4">
                <ReuseSearchInput
                    className="min-w-96"
                    placeholder="Search by reason..."
                    setSearch={setSearch}
                    setPage={setCurrentPage}
                />
                <ReuseFilterSelect
                    value={filter}
                    options={[
                        { value: "All", label: "All" },
                        { value: "resolved", label: "Resolved" },
                        { value: "pending", label: "Pending" },
                    ]}
                    onChange={setFilter}
                />
            </div>

            <ReusableTable<IReport>
                data={reports}
                columns={columns}
                pagination={true}
                scroll={false}
                isLoading={isFetching}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
            />

            <ViewReportModal
                isOpen={isModalOpen}
                handleCancle={handleCloseModal}
                currentRecord={currentRecord}
                onResolve={handleResolve}
                isResolving={isResolving}
            />
        </PageWraper>
    );
};

export default ReportsPage;
