interface IPaymentCustomer {
    id: string;
    name: string;
    phoneNumber: string;
    profileImage: string;
}

interface IEarningUser {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface IEarningPackage {
    _id: string;
    packageName: string;
    price: number;
}

interface IEarningPaymentInfo {
    _id: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    gateway: string;
    checkoutSessionId?: string;
    transactionId: string;
    status: "SUCCEEDED" | "PENDING" | "FAILED" | string;
    paidAt: string;
}

interface IBookingEarning {
    _id: string;
    bookingId: string;
    userId: IEarningUser;
    snapperId: IEarningUser;
    packageId: IEarningPackage;
    totalPrice: number;
    serviceFee: number;
    snapperEarning: number;
    completedAt: string;
    payment: IEarningPaymentInfo;
}

interface IStoragePayment {
    _id: string;
    paymentNumber: string;
    snapperId: IEarningUser;
    storagePlan: string;
    durationMonths: number;
    amount: number;
    currency: string;
    gateway: string;
    transactionId: string;
    paidAt: string;
}

interface IEarningsResponseData {
    totalRevenue: number;
    adminCommission: number;
    snapperEarning: number;
    totalBookings: number;
    storageRevenue: number;
    totalStoragePayments: number;
    storagePaymentsMeta: IMeta;
    grandTotalRevenue: number;
    storagePayments: IStoragePayment[];
    bookings: IBookingEarning[];
}

interface IPaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IEarningsResponseData;
  meta: IMeta;
}

interface IPayment {
    id: string;
    rideId: string;
    passenger: IPaymentCustomer;
    driverId: string;
    totalFare: number;
    amount: number;
    tip: number;
    promo: string | null;
    promoDiscount: number;
    paymentMethod: string;
    paymentStatus: string;
    stripePaymentIntentId: string;
    transactionId: string;
    adminCommission: number;
    driverEarning: number;
    estimatedFare: number;
    paidAt: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}
