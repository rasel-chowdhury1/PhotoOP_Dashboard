import { useState } from "react";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import ConfirmModal from "@/Components/ui/CustomUi/Modal/ConfirmModal";
import Tag from "@/Components/ui/CustomUi/ReuseTag";
import ReuseRating from "@/Components/ui/CustomUi/ReuseRating";
import { getImageUrl } from "@/helpers/config/envConfig";
import { formatDate, formetDateAndTime } from "@/utils/dateFormet";
import { AllImages } from "../../../../public/images/AllImages";
import ImagePreviewer from "@/Components/ui/CustomUi/ImagePreviewer";
import {
    AlertOctagon,
    Ban,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    HardDrive,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Sparkles,
    Wallet,
    XCircle,
} from "lucide-react";
import {
    useBanUserMutation,
    useUnbanUserMutation,
    useWarnUserMutation,
} from "@/redux/features/user/userApi";
import {
    useApproveSnapperMutation,
    useRejectSnapperMutation,
} from "@/redux/features/snapper/snapperApi";
import { toast } from "sonner";

const calcAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const getSnapperProfile = (record: ISnapper | null): ISnapperProfile | null =>
    record && typeof record.snapperId === "object" && record.snapperId !== null
        ? record.snapperId
        : null;

const statusTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "active": return "success";
        case "blocked": return "error";
        case "suspended": return "warning";
        default: return "warning";
    }
};

const approvalTheme = (status: string): "success" | "error" | "warning" => {
    switch (status) {
        case "approved": return "success";
        case "rejected": return "error";
        default: return "warning";
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
        <span
            className={`text-xs sm:text-sm font-semibold text-foreground text-right ml-4 ${valueClass}`}
        >
            {value ?? "—"}
        </span>
    </div>
);

const DocImage = ({
    src,
    alt,
    serverUrl,
}: {
    src?: string;
    alt: string;
    serverUrl: string;
}) => {
    const imageUrl = src?.startsWith("http")
        ? src
        : `${serverUrl}${src}`;

    return (
        <div className="w-full h-44 bg-muted/30 rounded-xl overflow-hidden border border-border">
            {src ? (
                <ImagePreviewer src={imageUrl} alt={alt} />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <FileText className="size-6" />
                    <span className="text-xs">{alt}</span>
                </div>
            )}
        </div>
    );
};

type ConfirmAction = "ban" | "unban" | "warn" | "approve" | "reject" | null;

const ViewSnapperDetailsPage = ({
    isOpen,
    handleCancle,
    currentRecord,
    approvalModal = false,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: ISnapper | null;
    approvalModal?: boolean;
}) => {
    const serverUrl = getImageUrl();
    const profile = getSnapperProfile(currentRecord);

    const isBlocked = currentRecord?.status === "blocked";
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

    const [banUser, { isLoading: banning }] = useBanUserMutation();
    const [unbanUser, { isLoading: unbanning }] = useUnbanUserMutation();
    const [warnUser, { isLoading: warning }] = useWarnUserMutation();
    const [approveSnapper, { isLoading: approving }] = useApproveSnapperMutation();
    const [rejectSnapper, { isLoading: rejecting }] = useRejectSnapperMutation();

    const isActionLoading =
        banning || unbanning || warning || approving || rejecting;

    const handleConfirm = async (_: ISnapper, reason?: string) => {
        if (!currentRecord) return;
        try {
            if (confirmAction === "ban") {
                await banUser({
                    userId: currentRecord._id,
                    reason: reason || "Blocked by admin",
                }).unwrap();
                toast.success("Snapper blocked successfully");
            } else if (confirmAction === "unban") {
                await unbanUser({ userId: currentRecord._id }).unwrap();
                toast.success("Snapper unblocked successfully");
            } else if (confirmAction === "warn") {
                await warnUser({
                    userId: currentRecord._id,
                    reason: reason || "",
                }).unwrap();
                toast.success("Warning sent successfully");
            } else if (confirmAction === "approve") {
                await approveSnapper({ snapperId: currentRecord._id, status: "approved", reason: reason || "" }).unwrap();
                toast.success("Snapper approved successfully");
            } else if (confirmAction === "reject") {
                await rejectSnapper({
                    snapperId: currentRecord._id,
                    status: "rejected",
                    reason: reason || "",
                }).unwrap();
                toast.success("Snapper rejected");
            }
            setConfirmAction(null);
            handleCancle();
        } catch {
            toast.error("Action failed. Please try again.");
        }
    };

    const confirmConfig: Record<
        Exclude<ConfirmAction, null>,
        {
            title: string;
            description: string;
            confirmText: string;
            variant: "danger" | "warning" | "success" | "info";
            iconPreset:
            | "delete"
            | "block"
            | "unblock"
            | "decline"
            | "accept"
            | "approve"
            | "cancel";
            withReason: boolean;
            reasonLabel: string;
        }
    > = {
        warn: {
            title: "Send Warning",
            description: `Send a warning to ${currentRecord?.fullName ?? "this snapper"}. Please provide a reason for the warning.`,
            confirmText: "Send Warning",
            variant: "warning" as const,
            iconPreset: "cancel" as const,
            withReason: true,
            reasonLabel: "Warning Reason",
        },
        ban: {
            title: "Block Snapper",
            description: `Are you sure you want to block ${currentRecord?.fullName ?? "this snapper"}? They will lose access to the platform.`,
            confirmText: "Block Snapper",
            variant: "danger" as const,
            iconPreset: "block" as const,
            withReason: true,
            reasonLabel: "Block Reason",
        },
        unban: {
            title: "Unblock Snapper",
            description: `Are you sure you want to unblock ${currentRecord?.fullName ?? "this snapper"}? They will regain access to the platform.`,
            confirmText: "Unblock Snapper",
            variant: "success" as const,
            iconPreset: "unblock" as const,
            withReason: false,
            reasonLabel: "",
        },
        approve: {
            title: "Approve Snapper",
            description: `Are you sure you want to approve ${currentRecord?.fullName ?? "this snapper"}? Their profile will go live on the platform.`,
            confirmText: "Approve",
            variant: "success" as const,
            iconPreset: "approve" as const,
            withReason: true,
            reasonLabel: "Approval Feedback",
        },
        reject: {
            title: "Reject Snapper",
            description: `Are you sure you want to reject ${currentRecord?.fullName ?? "this snapper"}? Please provide a reason.`,
            confirmText: "Reject",
            variant: "danger" as const,
            iconPreset: "decline" as const,
            withReason: true,
            reasonLabel: "Rejection Reason",
        },
    };

    const activeConfig = confirmAction ? confirmConfig[confirmAction] : null;
    const approvalHistory = [...(currentRecord?.approvalHistory ?? [])].reverse();


    return (
        <>
            <ReusableModal
                maxWidth="sm:max-w-2xl"
                open={isOpen}
                onOpenChange={handleCancle}
                title="Snapper Details"
                footer={null}
            >
                <div className="flex flex-col gap-5">
                    {/* Header — Profile */}
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <img
                            src={
                                currentRecord?.profileImage
                                    ? `${serverUrl}${currentRecord.profileImage}`
                                    : AllImages.profile
                            }
                            alt={currentRecord?.fullName}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-border"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-foreground text-base sm:text-lg truncate">
                                {currentRecord?.fullName || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                {currentRecord?.email || "—"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <Tag theme={statusTheme(currentRecord?.status ?? "active")} className="capitalize">
                                    {currentRecord?.status || "active"}
                                </Tag>
                                <Tag theme={approvalTheme(currentRecord?.adminApproval ?? "pending")} className="capitalize">
                                    {currentRecord?.adminApproval || "pending"}
                                </Tag>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                            <ReuseRating
                                value={currentRecord?.averageRating ?? 0}
                                size={16}
                                showValue
                            />
                            <span className="text-xs text-muted-foreground">
                                {currentRecord?.totalReview ?? 0} reviews
                            </span>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Wallet className="size-3.5" />
                                <span className="text-[10px] font-medium">Hourly Rate</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {profile ? `$${profile.hourlyRate}/hr` : "—"}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <HardDrive className="size-3.5" />
                                <span className="text-[10px] font-medium">Storage</span>
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {profile ? `${profile.storageUsedGB} / ${profile.storageLimitGB} GB` : "—"}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Sparkles className="size-3.5" />
                                <span className="text-[10px] font-medium">Storage Plan</span>
                            </div>
                            <p className="text-sm font-bold text-foreground capitalize">
                                {profile?.storagePlan?.toLowerCase() ?? "—"}
                            </p>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Personal Information" />
                        <div className="px-4">
                            <InfoRow
                                icon={<Mail className="size-3.5" />}
                                label="Email"
                                value={currentRecord?.email}
                            />
                            <InfoRow
                                icon={<Phone className="size-3.5" />}
                                label="Phone"
                                value={
                                    currentRecord?.phoneNumber
                                        ? `${currentRecord.countryCode ?? ""} ${currentRecord.phoneNumber}`
                                        : "—"
                                }
                            />
                            <InfoRow
                                icon={<MapPin className="size-3.5" />}
                                label="Address"
                                value={currentRecord?.address || "—"}
                            />
                            <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Age"
                                value={
                                    currentRecord?.dateOfBirth
                                        ? `${calcAge(currentRecord.dateOfBirth)} yrs`
                                        : "—"
                                }
                            />
                            <InfoRow
                                icon={<Calendar className="size-3.5" />}
                                label="Joined"
                                value={
                                    currentRecord?.createdAt
                                        ? formatDate(currentRecord.createdAt)
                                        : "—"
                                }
                            />
                        </div>
                    </div>

                    {/* About */}
                    {(profile?.about || currentRecord?.about) && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="About" />
                            <p className="px-4 py-3 text-sm text-muted-foreground">
                                {profile?.about || currentRecord?.about}
                            </p>
                        </div>
                    )}

                    {/* Specialties & Badges */}
                    {(profile?.specialties?.length || profile?.badges?.length) ? (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="Specialties & Badges" />
                            <div className="px-4 py-3 flex flex-col gap-2">
                                {!!profile?.specialties?.length && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.specialties.map((s) => (
                                            <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium capitalize">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {!!profile?.badges?.length && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.badges.map((b) => (
                                            <span key={b} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium capitalize">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {/* Identity Verification */}
                    {profile?.identityImage && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="Identity Verification" />
                            <div className="px-4 pb-4 pt-2">
                                <DocImage
                                    src={profile?.identityImage}
                                    alt="Identity Document"
                                    serverUrl={serverUrl}
                                />
                            </div>
                        </div>
                    )}

                    {/* Approval History */}
                    {approvalHistory.length > 0 && (
                        <div className="rounded-xl border border-border overflow-hidden">
                            <SectionHeader title="Approval History" />
                            <div className="px-4 py-3 flex flex-col gap-3">
                                {approvalHistory.map((entry, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Tag theme={approvalTheme(entry.status)} className="capitalize shrink-0">
                                            {entry.status}
                                        </Tag>
                                        <div className="flex-1 min-w-0">
                                            {entry.reason && (
                                                <p className="text-xs sm:text-sm text-foreground">{entry.reason}</p>
                                            )}
                                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {formetDateAndTime(entry.actionAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {!approvalModal ? (
                        <div className="flex flex-col gap-2 pt-1">
                            <button
                                onClick={() => setConfirmAction("warn")}
                                disabled={isActionLoading}
                                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 bg-[#FE9A00] hover:bg-[#FE9A00]/90 text-white"
                            >
                                <AlertOctagon className="size-4" />
                                Send Warning
                            </button>
                            <button
                                onClick={() => setConfirmAction(isBlocked ? "unban" : "ban")}
                                disabled={isActionLoading}
                                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${isBlocked
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                                    }`}
                            >
                                {isBlocked ? (
                                    <ShieldCheck className="size-4" />
                                ) : (
                                    <Ban className="size-4" />
                                )}
                                {isBlocked ? "Unblock Snapper" : "Block Snapper"}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <button
                                onClick={() => setConfirmAction("reject")}
                                disabled={isActionLoading}
                                className="py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <XCircle className="size-4" />
                                Reject
                            </button>
                            <button
                                onClick={() => setConfirmAction("approve")}
                                disabled={isActionLoading}
                                className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="size-4" />
                                Approve
                            </button>
                        </div>
                    )}
                </div>
            </ReusableModal>

            {/* Confirm Modal */}
            {activeConfig && confirmAction && (
                <ConfirmModal<ISnapper>
                    open={!!confirmAction}
                    onCancel={() => setConfirmAction(null)}
                    currentRecord={currentRecord}
                    onConfirm={handleConfirm}
                    title={activeConfig.title}
                    description={activeConfig.description}
                    confirmText={activeConfig.confirmText}
                    variant={activeConfig.variant}
                    iconPreset={activeConfig.iconPreset}
                    withReason={activeConfig.withReason}
                    reasonLabel={activeConfig.reasonLabel}
                    reasonRequired={activeConfig.withReason}
                    loading={isActionLoading}
                />
            )}
        </>
    );
};

export default ViewSnapperDetailsPage;
