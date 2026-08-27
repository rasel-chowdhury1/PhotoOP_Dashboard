interface IPayoutMethodSnapper {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface IPayoutMethod {
    _id: string;
    snapperId: IPayoutMethodSnapper;
    type: "BANK_ACCOUNT" | "PAYPAL" | "STRIPE";
    provider?: string;
    last4?: string;
    accountName?: string;
    isDefault: boolean;
    isVerified: boolean;
    status: "ACTIVE" | "INACTIVE" | "PENDING_VERIFICATION";
    createdAt: string;
}
