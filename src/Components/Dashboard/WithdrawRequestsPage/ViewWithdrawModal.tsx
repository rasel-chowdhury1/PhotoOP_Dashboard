import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { formetDateAndTime } from "@/utils/dateFormet";
import {
    BadgeCheck,
    Banknote,
    CheckCircle2,
    Clock,
    CreditCard,
    Hash,
    User,
    XCircle,
} from "lucide-react";

const statusTheme = (status: string): "success" | "error" | "warning" | "blue" => {
    switch (status?.toUpperCase()) {
        case "COMPLETED": return "success";
        case "FAILED":
        case "REJECTED": return "error";
        case "PROCESSING": return "blue";
        case "CANCELLED": return "warning";
        default: return "warning"; // PENDING
    }
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-2 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {title}
        </p>
    </div>
);

const InfoRow = ({
    icon,
    label,
    value,
    valueClass = "",
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            {icon}
            <span className="text-xs sm:text-sm">{label}</span>
        </div>
        <span className={`text-xs sm:text-sm font-semibold text-foreground text-right ml-4 ${valueClass}`}>
            {value ?? "—"}
        </span>
    </div>
);

interface ViewWithdrawModalProps {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IWithdraw | null;
    onProcess: () => void;
    onReject: () => void;
    isActionLoading: boolean;
}

const ViewWithdrawModal = ({
    isOpen,
    handleCancle,
    currentRecord,
    onProcess,
    onReject,
    isActionLoading,
}: ViewWithdrawModalProps) => {
    if (!currentRecord) return null;

    const normalizedStatus = currentRecord.status?.toUpperCase();
    const canAct = normalizedStatus === "PENDING" || normalizedStatus === "PROCESSING";
    const accountDetails = currentRecord.paymentMethodId?.accountDetails;

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Withdraw Request Details"
            footer={null}
        >
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                        <p className="font-bold text-foreground text-base">
                            {currentRecord.snapperId?.fullName || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {currentRecord.snapperId?.email || "—"}
                        </p>
                    </div>
                    <Tag theme={statusTheme(currentRecord.status)} className="capitalize">
                        {currentRecord.status}
                    </Tag>
                </div>

                {/* Amount Summary */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground">Gross Amount</span>
                        <p className="text-sm font-bold text-foreground">
                            {currentRecord.currency} {currentRecord.amount.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground">Fee</span>
                        <p className="text-sm font-bold text-red-500">
                            − {currentRecord.currency} {currentRecord.fee.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-muted-foreground">Net Payout</span>
                        <p className="text-sm font-bold text-emerald-500">
                            {currentRecord.currency} {currentRecord.netAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Request Details" />
                    <div className="px-4">
                        <InfoRow
                            icon={<Hash className="size-3.5" />}
                            label="Withdraw #"
                            value={currentRecord.withdrawNumber}
                        />
                        <InfoRow
                            icon={<Clock className="size-3.5" />}
                            label="Requested"
                            value={formetDateAndTime(currentRecord.requestedAt)}
                        />
                        {currentRecord.processedAt && (
                            <InfoRow
                                icon={<CheckCircle2 className="size-3.5" />}
                                label="Processed"
                                value={formetDateAndTime(currentRecord.processedAt)}
                            />
                        )}
                        {currentRecord.processedBy && (
                            <InfoRow
                                icon={<User className="size-3.5" />}
                                label="Processed By"
                                value={
                                    typeof currentRecord.processedBy === "object"
                                        ? currentRecord.processedBy.fullName
                                        : currentRecord.processedBy
                                }
                            />
                        )}
                        {currentRecord.transactionId && (
                            <InfoRow
                                icon={<BadgeCheck className="size-3.5" />}
                                label="Transaction ID"
                                value={currentRecord.transactionId}
                            />
                        )}
                    </div>
                </div>

                {/* Payout Method */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Payout Method" />
                    <div className="px-4">
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Type"
                            value={currentRecord.paymentMethodId?.type || "—"}
                        />
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Provider"
                            value={currentRecord.paymentMethodId?.provider || "—"}
                        />
                        {!accountDetails && (
                            <>
                                <InfoRow
                                    icon={<CreditCard className="size-3.5" />}
                                    label="Account"
                                    value={
                                        currentRecord.paymentMethodId?.last4
                                            ? `•••• ${currentRecord.paymentMethodId.last4}`
                                            : "—"
                                    }
                                />
                                <InfoRow
                                    icon={<User className="size-3.5" />}
                                    label="Account Name"
                                    value={currentRecord.paymentMethodId?.accountName || "—"}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Bank Account Details */}
                {accountDetails && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Bank Account Details" />
                        <div className="px-4">
                            <InfoRow
                                icon={<User className="size-3.5" />}
                                label="Account Holder"
                                value={accountDetails.accountHolderName || "—"}
                            />
                            <InfoRow
                                icon={<Banknote className="size-3.5" />}
                                label="Bank Name"
                                value={accountDetails.bankName || "—"}
                            />
                            <InfoRow
                                icon={<Hash className="size-3.5" />}
                                label="Account Number"
                                value={accountDetails.accountNumber || "—"}
                                valueClass="font-mono"
                            />
                            <InfoRow
                                icon={<Hash className="size-3.5" />}
                                label="Routing Number"
                                value={accountDetails.routingNumber || "—"}
                                valueClass="font-mono"
                            />
                        </div>
                    </div>
                )}

                {/* Notes */}
                {(currentRecord.adminNote || currentRecord.notes || currentRecord.failureReason) && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Notes" />
                        <div className="px-4 py-3 flex flex-col gap-2">
                            {currentRecord.notes && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">Snapper: </span>
                                    {currentRecord.notes}
                                </p>
                            )}
                            {currentRecord.adminNote && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">Admin: </span>
                                    {currentRecord.adminNote}
                                </p>
                            )}
                            {currentRecord.failureReason && (
                                <p className="text-xs text-red-500">
                                    <span className="font-semibold">Failure: </span>
                                    {currentRecord.failureReason}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                {canAct && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                            onClick={onReject}
                            disabled={isActionLoading}
                            className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            <XCircle className="size-4" />
                            Reject
                        </button>
                        <button
                            onClick={onProcess}
                            disabled={isActionLoading}
                            className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="size-4" />
                            Process
                        </button>
                    </div>
                )}
            </div>
        </ReusableModal>
    );
};

export default ViewWithdrawModal;
