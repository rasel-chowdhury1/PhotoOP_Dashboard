import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import { formatDate } from "@/utils/dateFormet";
import {
    BadgeCheck,
    Building2,
    CreditCard,
    ShieldCheck,
    User,
} from "lucide-react";

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "ACTIVE": return "success";
        case "INACTIVE": return "error";
        default: return "warning";
    }
};

const typeIcon = (type: string) => {
    switch (type) {
        case "BANK_ACCOUNT": return <Building2 className="size-4" />;
        default: return <CreditCard className="size-4" />;
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
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            {icon}
            <span className="text-xs sm:text-sm">{label}</span>
        </div>
        <span className="text-xs sm:text-sm font-semibold text-foreground text-right ml-4">
            {value ?? "—"}
        </span>
    </div>
);

interface ViewPayoutMethodModalProps {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IPayoutMethod | null;
    onVerify: () => void;
    isActionLoading: boolean;
}

const ViewPayoutMethodModal = ({
    isOpen,
    handleCancle,
    currentRecord,
    onVerify,
    isActionLoading,
}: ViewPayoutMethodModalProps) => {
    if (!currentRecord) return null;

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Payout Method Details"
            footer={null}
        >
            <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        {typeIcon(currentRecord.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-base truncate">
                            {currentRecord.provider || currentRecord.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {currentRecord.last4 ? `Account ending •••• ${currentRecord.last4}` : "No account details"}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Tag theme={statusTheme(currentRecord.status)} className="capitalize text-xs">
                                {currentRecord.status.replace("_", " ")}
                            </Tag>
                            {currentRecord.isVerified && (
                                <Tag theme="success" className="text-xs">
                                    <span className="flex items-center gap-1">
                                        <BadgeCheck className="size-3" /> Verified
                                    </span>
                                </Tag>
                            )}
                            {currentRecord.isDefault && (
                                <Tag theme="blue" className="text-xs">
                                    Default
                                </Tag>
                            )}
                        </div>
                    </div>
                </div>

                {/* Snapper Info */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Snapper" />
                    <div className="px-4">
                        <InfoRow
                            icon={<User className="size-3.5" />}
                            label="Name"
                            value={currentRecord.snapperId?.fullName}
                        />
                        <InfoRow
                            icon={<User className="size-3.5" />}
                            label="Email"
                            value={currentRecord.snapperId?.email}
                        />
                    </div>
                </div>

                {/* Account Info */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Account Details" />
                    <div className="px-4">
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Type"
                            value={currentRecord.type.replace("_", " ")}
                        />
                        <InfoRow
                            icon={<Building2 className="size-3.5" />}
                            label="Provider"
                            value={currentRecord.provider}
                        />
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Last 4"
                            value={currentRecord.last4 ? `•••• ${currentRecord.last4}` : "—"}
                        />
                        <InfoRow
                            icon={<User className="size-3.5" />}
                            label="Account Name"
                            value={currentRecord.accountName}
                        />
                        <InfoRow
                            icon={<BadgeCheck className="size-3.5" />}
                            label="Verified"
                            value={currentRecord.isVerified ? "Yes" : "No"}
                        />
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Added"
                            value={formatDate(currentRecord.createdAt)}
                        />
                    </div>
                </div>

                {/* Verify Action */}
                {!currentRecord.isVerified && (
                    <button
                        onClick={onVerify}
                        disabled={isActionLoading}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        <ShieldCheck className="size-4" />
                        Verify Payout Method
                    </button>
                )}
            </div>
        </ReusableModal>
    );
};

export default ViewPayoutMethodModal;
