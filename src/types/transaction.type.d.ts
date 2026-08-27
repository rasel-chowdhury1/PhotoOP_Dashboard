interface ITransactionUser {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface ITransactionBooking {
    _id: string;
    bookingId: string;
    userId: string;
    snapperId: string;
    fullName: string;
    bookingDate: string;
    totalPrice: number;
    status: string;
}

interface ITransaction {
    _id: string;
    paymentNumber: string;
    userId: ITransactionUser;
    bookingId: ITransactionBooking | null;
    paymentType: string;
    storagePlan: string | null;
    durationMonths: number | null;
    amount: number;
    currency: string;
    gateway: string;
    paymentIntentId: string | null;
    checkoutSessionId: string | null;
    transactionId: string | null;
    receiptUrl: string | null;
    status: string;
    paidAt: string | null;
    refundReason: string | null;
    createdAt: string;
    updatedAt: string;
}