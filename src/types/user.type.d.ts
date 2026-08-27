interface IEmergencyContact {
  name: string;
  phoneNumber: string;
}

interface ISocialLinks {
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  website?: string;
}

interface INotificationPreferences {
  bookingUpdates: boolean;
  messageAlerts: boolean;
  promotionalOffers: boolean;
}

interface INotificationSettings {
  pushEnabled: boolean;
  preferences: INotificationPreferences;
}

interface IGuardian {
  name: string;
  email: string;
  relation: string;
  phoneNumber?: string;
  idImage?: string;
  emergencyContact?: IEmergencyContact;
  status: "PENDING" | "APPROVED" | "REJECTED";
  statusReason?: string | null;
  statusAt?: string | null;
  isVerified: boolean;
}

interface IApprovalHistoryEntry {
  status: "pending" | "approved" | "rejected";
  reason?: string | null;
  actionBy?: string;
  actionAt: string;
}

interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "snapper" | "admin";
  snapperId?: string | ISnapperProfile | null;
  profileImage?: string;
  coverPhoto?: string;
  about?: string;
  dateOfBirth: string;
  guardian?: IGuardian;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  location?: ILocation;
  socialLinks?: ISocialLinks;
  totalReview?: number;
  averageRating?: number;
  favoriteUsers?: string[];
  notificationSettings?: INotificationSettings;
  status: "active" | "blocked" | "suspended";
  adminApproval: "pending" | "approved" | "rejected";
  approvalHistory?: IApprovalHistoryEntry[];
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

type ICustomerListResponse = IApiListResponse<IUser>;
