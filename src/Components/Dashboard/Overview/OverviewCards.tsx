import { HiUsers } from "react-icons/hi";
import { FaCamera } from "react-icons/fa";
import { MdAttachMoney, MdPendingActions } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { useGetStatisticsQuery } from "@/redux/features/overview/overviewApi";

const OverviewCards = () => {
  const { data } = useGetStatisticsQuery(undefined, { refetchOnMountOrArgChange: true });

  const stats = data?.data;

  const countData = [
    {
      id: 1,
      background: "#F5F5F5",
      name: "Total Customers",
      icon: <HiUsers className="size-5 text-secondary-color" />,
      count: stats?.totalUsers ?? 0,
    },
    {
      id: 2,
      background: "#F5F5F5",
      name: "Total Snappers",
      icon: <FaCamera className="size-5 text-secondary-color" />,
      count: stats?.totalSnappers ?? 0,
    },
    {
      id: 3,
      background: "#F5F5F5",
      name: "Active Bookings",
      icon: <BsCalendarCheck className="size-5 text-secondary-color" />,
      count: stats?.activeBookings ?? 0,
    },
    {
      id: 4,
      background: "#F5F5F5",
      name: "Total Revenue",
      icon: <MdAttachMoney className="size-6 text-secondary-color" />,
      count: `$${stats?.totalRevenue ?? 0}`,
    },
    {
      id: 5,
      background: "#F5F5F5",
      name: "Pending Approvals",
      icon: <MdPendingActions className="size-6 text-secondary-color" />,
      count: `${stats?.pendingApproval ?? 0}`,
    },
  ];

  return (
    <div className="flex flex-row flex-wrap gap-1 lg:gap-3 mb-5 ">
      {countData.map((item) => (
        <div
          key={item.id}
          className={`flex rounded-2xl w-full my-2 lg:my-0 flex-1 border border-[#E1E1E1] p-6`}
          style={{
            backgroundColor: item.background,
          }}
        >
          <div className="w-full!">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm sm:text-base lg:text-lg  font-semibold mb-1  tracking-tight w-full text-nowrap">
                {item.name}
              </p>
              <p>{item?.icon}</p>
            </div>
            <p className="text-lg sm:text-xl lg:text-2xl  font-bold capitalize tracking-wider">
              {item.count}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;