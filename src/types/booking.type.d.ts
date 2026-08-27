type TBookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "refunded"
  | "upcoming"
  | "shoot_completed"
  | "delivery_pending"
  | "delivery_rejected"
  | "completed"
  | "cancelled"
  | "disputed";

type TPaymentStatus = "unpaid" | "paid" | "refund_pending" | "refunded" | "failed";

type TDeliveryMethod =
  | "IN_APP_GALLERY"
  | "EXTERNAL_LINK"
  | "DIGITAL_FILE"
  | "PHYSICAL_PRINTS";

type TAddOnKey =
  | "EXTRA_RETOUCHING"
  | "RUSH_DELIVERY"
  | "EXTRA_EDITED_PHOTOS"
  | "RAW_FILES"
  | "DRONE_SHOTS";

interface IBookingAddOn {
  key: TAddOnKey;
  title: string;
  price: number;
}

interface IBookingStatusHistoryEntry {
  status: TBookingStatus;
  actionBy?: string;
  actionAt: string;
  note?: string;
}

interface IBookingRescheduleRequest {
  requestedBy?: string;
  previousBookingDate?: string;
  previousStartTime?: string;
  previousEndTime?: string;
  requestedBookingDate?: string;
  requestedStartTime?: string;
  requestedEndTime?: string;
  reason?: string;
  status: "pending" | "accepted" | "rejected";
  actionAt?: string;
}

interface IBookingCustomerRef {
  _id: string;
  fullName: string;
  email?: string;
  profileImage?: string;
}

interface IBookingSnapperRef {
  _id: string;
  fullName: string;
  email?: string;
  profileImage?: string;
}

interface IBookingPackageRef {
  _id: string;
  title?: string;
  name?: string;
}

interface IBooking {
  _id: string;
  bookingId: string;
  userId: string | IBookingCustomerRef;
  snapperId: string | IBookingSnapperRef;
  packageId: string | IBookingPackageRef;
  fullName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  location: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  selectedAddOns: IBookingAddOn[];
  packagePrice: number;
  addOnPrice: number;
  serviceFeePercentage: number;
  serviceFee: number;
  totalPrice: number;
  preferredDeliveryMethod: TDeliveryMethod;
  qrCodeFromSnapper: boolean;
  currentDeliveryId?: string | null;
  deliveryAttempts: number;
  maxDeliveryAttempts: number;
  shootCompletedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  autoAcceptAt?: string | null;
  paymentStatus: TPaymentStatus;
  refundAmount?: number;
  refundedAt?: string | null;
  refundTransactionId?: string;
  status: TBookingStatus;
  statusHistory: IBookingStatusHistoryEntry[];
  rescheduleRequest?: IBookingRescheduleRequest | null;
  cancelledBy?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  customerReviewed?: boolean;
  snapperReviewed?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}
