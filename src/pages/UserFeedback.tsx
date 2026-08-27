/* eslint-disable @typescript-eslint/no-explicit-any */
import PageWraper from "@/Components/ui/CustomUi/PageWraper";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import { useGetFeedbacksQuery } from "@/redux/features/feedback/feedbackApi";
import { getImageUrl } from "@/helpers/config/envConfig";
import { useState } from "react";
import { AllImages } from "../../public/images/AllImages";

const UserFeedback = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const serverUrl = getImageUrl();

    const { data, isFetching } = useGetFeedbacksQuery({ page: currentPage, limit }, { refetchOnMountOrArgChange: true });

    const feedbacks: IFeedback[] = data?.data?.result ?? [];
    const total = data?.data?.meta?.total ?? 0;

    const columns: Column<IFeedback>[] = [
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
            header: "User",
            accessorKey: "user",
            render: (value: IFeedbackUser) => (
                <div className="flex items-center gap-2">
                    <img
                        src={value.profileImage?.length > 0 ? `${serverUrl}${value.profileImage}` : AllImages.profile}
                        alt={value.name}
                        className="h-8 w-8 rounded-full object-cover border"
                    />
                    <span>{value.name}</span>
                </div>
            ),
        },
        {
            header: "Role",
            accessorKey: "user",
            render: (value: IFeedbackUser) => (
                <span className="capitalize">{value.role}</span>
            ),
        },
        {
            header: "Rating",
            accessorKey: "rating",
            render: (value: number) => <ReuseRating value={value} size={20} />,
        },
        {
            header: "Feedback",
            accessorKey: "text",
            render: (value: string) =>
                value?.length > 60 ? value.slice(0, 60) + "..." : value,
        },
        {
            header: "Status",
            accessorKey: "adminVerified",
            render: (value: string) => {
                const colors: Record<string, string> = {
                    verified: "text-green-600 bg-green-50",
                    pending: "text-yellow-600 bg-yellow-50",
                    rejected: "text-red-600 bg-red-50",
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${colors[value] ?? ""}`}>
                        {value}
                    </span>
                );
            },
        },
    ];

    return (
        <PageWraper title="User Feedback">
            <ReusableTable<IFeedback>

                data={feedbacks}
                columns={columns}
                pagination={true}
                currentPage={currentPage}
                setCurrentPage={(page) => setCurrentPage(page)}
                limit={limit}
                total={total}
                isLoading={isFetching}
            />
        </PageWraper>
    );
};

export default UserFeedback;
