
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { getImageUrl } from "@/helpers/config/envConfig";
import { formetDateAndTime } from "@/utils/dateFormet";
import { AllImages } from "../../../../public/images/AllImages";
import Modal from "@/Components/ui/CustomUi/Model";

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

interface ViewEarningModalProps {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IBookingEarning | null;
}

const UserBlock = ({ label, user }: { label: string; user?: IEarningUser }) => {
    const serverUrl = getImageUrl();
    return (
        <div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <div className="flex items-center gap-2">
                <img
                    src={
                        user?.profileImage
                            ? `${serverUrl}${user.profileImage}`
                            : AllImages.profile
                    }
                    alt={user?.fullName}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div>
                    <p className="font-medium text-gray-800">{user?.fullName || "—"}</p>
                    <p className="text-xs text-gray-500">{user?.email || "—"}</p>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
);

const ViewEarningModal = ({ isOpen, handleCancle, currentRecord }: ViewEarningModalProps) => {
    if (!currentRecord) return null;

    const {
        bookingId,
        userId,
        snapperId,
        packageId,
        totalPrice,
        serviceFee,
        snapperEarning,
        completedAt,
        payment,
    } = currentRecord;

    return (
        <Modal isOpen={isOpen} onClose={handleCancle} title="Earning Details">
            <div className="flex flex-col gap-5 p-1">
                {/* Booking header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Booking ID</p>
                        <p className="font-mono font-semibold text-gray-800">{bookingId}</p>
                    </div>
                    <Tag
                        theme={
                            payment?.status === "SUCCEEDED"
                                ? "success"
                                : payment?.status === "PENDING"
                                ? "warning"
                                : "error"
                        }
                    >
                        {payment?.status
                            ? payment.status.charAt(0) + payment.status.slice(1).toLowerCase()
                            : "—"}
                    </Tag>
                </div>

                {/* Customer & Snapper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UserBlock label="Customer" user={userId} />
                    <UserBlock label="Snapper" user={snapperId} />
                </div>

                {/* Package */}
                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Package</p>
                    <p className="font-medium text-gray-800 capitalize">
                        {packageId?.packageName || "—"}
                    </p>
                </div>

                {/* Financials */}
                <div className="rounded-lg border border-gray-100 p-3">
                    <InfoRow label="Total Fare" value={`$${totalPrice}`} />
                    <InfoRow label="Admin Commission" value={`$${serviceFee}`} />
                    <InfoRow label="Snapper Earning" value={`$${snapperEarning}`} />
                    <InfoRow
                        label="Completed At"
                        value={completedAt ? formetDateAndTime(completedAt) : "—"}
                    />
                </div>

                {/* Payment info */}
                <div className="rounded-lg border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-2">Payment</p>
                    <InfoRow label="Payment Number" value={payment?.paymentNumber || "—"} />
                    <InfoRow label="Gateway" value={payment?.gateway || "—"} />
                    <InfoRow label="Transaction ID" value={payment?.transactionId || "—"} />
                    <InfoRow
                        label="Amount"
                        value={`${payment?.amount ?? "—"} ${payment?.currency ?? ""}`}
                    />
                    <InfoRow
                        label="Paid At"
                        value={payment?.paidAt ? formetDateAndTime(payment.paidAt) : "—"}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ViewEarningModal;