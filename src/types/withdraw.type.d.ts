interface IWithdrawAccountDetails {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
}

interface IWithdrawPayoutMethod {
    _id: string;
    type: string;
    provider?: string;
    externalAccountId?: string | null;
    last4?: string;
    accountName?: string;
    accountDetails?: IWithdrawAccountDetails;
    isDefault?: boolean;
    isVerified?: boolean;
    status?: string;
}

interface IWithdrawSnapper {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface IWithdrawAdmin {
    _id: string;
    fullName: string;
    email: string;
}

interface IWithdraw {
    _id: string;
    withdrawNumber: string;
    snapperId: IWithdrawSnapper;
    amount: number;
    fee: number;
    netAmount: number;
    currency: string;
    paymentMethodId: IWithdrawPayoutMethod;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REJECTED" | "CANCELLED";
    transactionId?: string | null;
    requestedAt: string;
    processedAt?: string | null;
    processedBy?: IWithdrawAdmin | string | null;
    adminNote?: string | null;
    notes?: string;
    failureReason?: string | null;
}
