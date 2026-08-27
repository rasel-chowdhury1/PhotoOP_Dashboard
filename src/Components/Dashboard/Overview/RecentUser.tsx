import { formatDate } from "@/utils/dateFormet";
import ReusableTable, { Column } from "@/Components/ui/CustomUi/ReuseableTable";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { useGetStatisticsQuery } from "@/redux/features/overview/overviewApi";
import { getImageUrl } from "@/helpers/config/envConfig";
import { AllImages } from "../../../../public/images/AllImages";

const RecentUser = () => {
  const serverUrl = getImageUrl();
  const { data, isFetching } = useGetStatisticsQuery(undefined, { refetchOnMountOrArgChange: true });
  const recentUsers: IRecentUser[] = data?.data?.recentUsers ?? [];

  const columns: Column<IRecentUser>[] = [
    {
      header: "ID",
      accessorKey: "id",
      width: 60,
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-medium text-gray-700">{index + 1}</span>
      ),
    },
    {
      header: "Full Name",
      accessorKey: "fullName",
      render: (value: string, record: IRecentUser) => (
        <div className="flex items-center gap-2">
          <img
            src={record.profileImage ? `${serverUrl}${record.profileImage}` : AllImages.profile}
            alt={value}
            className="h-8 w-8 rounded-full object-cover border shrink-0"
          />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (value: string) => (
        <Tag theme={value === "active" ? "success" : "warning"} className="capitalize">
          {value}
        </Tag>
      ),
    },
    {
      header: "Join Date",
      accessorKey: "createdAt",
      render: (value: string) => formatDate(value),
    },
  ];

  return (
    <div>
      <div className="pb-5">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Recent Users
        </h1>
      </div>
      <ReusableTable<IRecentUser>
        data={recentUsers}
        columns={columns}
        pagination={false}
        scroll={true}
        isLoading={isFetching}
        setCurrentPage={() => { }}
        limit={recentUsers.length || 10}
      />
    </div>
  );
};

export default RecentUser;
