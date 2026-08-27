interface IRecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profileImage: string;
  status: string;
  createdAt: string;
}

interface IDashboardStatistics {
  totalUsers: number;
  totalSnappers: number;
  activeBookings: number;
  totalRevenue: number;
  pendingApproval: number;
  recentUsers: IRecentUser[];
}

interface IStatisticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDashboardStatistics;
}

interface IMonthlyCount {
  month: number;
  monthNumber: number;
  count: number;
}

interface IMonthlyUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    year: number;
    role: string;
    months: IMonthlyCount[];
  };
}

interface IMonthlyEarning {
  month: number;
  totalRevenue: number;
  adminCommission: number;
  driverEarning: number;
  totalTips: number;
  totalRides: number;
}

interface IYearlyEarningsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    year: number;
    months: IMonthlyEarning[];
  };
}

interface IMonthlyBookingCount {
  month: number;
  total: number;
  pending: number;
  accepted: number;
  upcoming: number;
  shootCompleted: number;
  deliveryPending: number;
  deliveryRejected: number;
  completed: number;
  cancelled: number;
  rejected: number;
  disputed: number;
  refunded: number;
}

interface IYearlyBookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    year: number;
    months: IMonthlyBookingCount[];
  };
}
