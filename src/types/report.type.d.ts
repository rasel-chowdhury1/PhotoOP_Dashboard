interface IReportRide {
  id: string;
  status: string;
  rideId: string;
}

interface IReportUser {
  id: string;
  name: string;
  email?: string;
  role: string;
  profileImage: string;
}

interface IReport {
  id: string;
  ride: IReportRide;
  reportedBy: IReportUser;
  reportedUser: IReportUser;
  reason: string;
  details: string;
  status: "pending" | "resolved";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

type IReportListResponse = IApiListResponse<IReport>;
