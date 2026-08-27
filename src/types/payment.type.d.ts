interface IPaymentCustomer {
    id: string;
    name: string;
    phoneNumber: string;
    profileImage: string;
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
