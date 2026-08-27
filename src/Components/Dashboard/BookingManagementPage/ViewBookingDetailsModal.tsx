import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import Tag from '@/Components/ui/CustomUi/ReuseTag';
import { formatDate, formetDateAndTime } from '@/utils/dateFormet';
import {
    AlertCircle,
    BadgeDollarSign,
    Ban,
    Calendar,
    Clock,
    CreditCard,
    History,
    Mail,
    MapPin,
    Package,
    Percent,
    Phone,
    Receipt,
    Sparkles,
    Truck,
    User,
    XCircle,
} from 'lucide-react';

const statusTheme = (status: string): 'success' | 'error' | 'warning' | 'blue' | 'purple' | 'orange' => {
    switch (status) {
        case 'completed':
        case 'shoot_completed':
            return 'success';
        case 'accepted':
        case 'upcoming':
            return 'blue';
        case 'pending':
        case 'delivery_pending':
            return 'warning';
        case 'rejected':
        case 'delivery_rejected':
        case 'cancelled':
            return 'error';
        case 'refunded':
            return 'purple';
        case 'disputed':
            return 'orange';
        default:
            return 'warning';
    }
};

const paymentTheme = (status: string): 'success' | 'error' | 'warning' | 'purple' => {
    switch (status) {
        case 'paid': return 'success';
        case 'failed': return 'error';
        case 'refunded': return 'purple';
        default: return 'warning';
    }
};

const InfoRow = ({ icon, label, value, valueClass = '' }: {
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
            {value}
        </span>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="px-4 py-2 bg-muted/40 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
    </div>
);

const getSnapperName = (record: IBooking | null): string =>
    record && typeof record.snapperId === "object" && record.snapperId !== null
        ? record.snapperId.fullName
        : "—";

const ViewBookingDetailsModal = ({
    isOpen,
    handleCancle,
    currentRecord,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IBooking | null;
}) => {
    const statusHistory = [...(currentRecord?.statusHistory ?? [])].reverse();

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Booking Details"
            footer={null}
        >
            <div className="flex flex-col gap-5">

                {/* Customer + Status */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                            {currentRecord?.fullName || '—'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                            {currentRecord?.bookingId || '—'}
                        </p>
                    </div>
                    {currentRecord?.status && (
                        <Tag theme={statusTheme(currentRecord.status)} className="shrink-0 capitalize">
                            {currentRecord.status.replace(/_/g, ' ')}
                        </Tag>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="size-3.5" />
                            <span className="text-[10px] font-medium">Shoot Date</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                            {currentRecord?.bookingDate ? formatDate(currentRecord.bookingDate) : '—'}
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="size-3.5" />
                            <span className="text-[10px] font-medium">Time</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">
                            {currentRecord?.startTime} - {currentRecord?.endTime}
                        </p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <BadgeDollarSign className="size-3.5" />
                            <span className="text-[10px] font-medium">Total</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">${currentRecord?.totalPrice ?? 0}</p>
                    </div>
                </div>

                {/* Booking Info */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Booking Info" />
                    <div className="px-4">
                        <InfoRow icon={<Mail className="size-3.5" />} label="Email" value={currentRecord?.email ?? '—'} />
                        <InfoRow icon={<Phone className="size-3.5" />} label="Phone" value={currentRecord?.phoneNumber ?? '—'} />
                        <InfoRow icon={<MapPin className="size-3.5" />} label="Location" value={currentRecord?.location ?? '—'} />
                        <InfoRow icon={<User className="size-3.5" />} label="Snapper" value={getSnapperName(currentRecord)} />
                        {currentRecord?.notes && (
                            <InfoRow icon={<AlertCircle className="size-3.5" />} label="Notes" value={currentRecord.notes} />
                        )}
                        <InfoRow
                            icon={<Clock className="size-3.5" />}
                            label="Created At"
                            value={currentRecord?.createdAt ? formetDateAndTime(currentRecord.createdAt) : '—'}
                        />
                    </div>
                </div>

                {/* Add-ons */}
                {(currentRecord?.selectedAddOns?.length ?? 0) > 0 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Add-ons" />
                        <div className="px-4">
                            {currentRecord?.selectedAddOns.map((addOn, i) => (
                                <InfoRow
                                    key={i}
                                    icon={<Sparkles className="size-3.5" />}
                                    label={addOn.title}
                                    value={`$${addOn.price}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Pricing Breakdown */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Pricing Breakdown" />
                    <div className="px-4">
                        <InfoRow icon={<Package className="size-3.5" />} label="Package Price" value={`$${currentRecord?.packagePrice ?? 0}`} />
                        <InfoRow icon={<Sparkles className="size-3.5" />} label="Add-on Price" value={`$${currentRecord?.addOnPrice ?? 0}`} />
                        <InfoRow icon={<Percent className="size-3.5" />} label="Service Fee" value={`$${currentRecord?.serviceFee ?? 0} (${currentRecord?.serviceFeePercentage ?? 0}%)`} />
                        <InfoRow icon={<Receipt className="size-3.5" />} label="Total Price" value={`$${currentRecord?.totalPrice ?? 0}`} valueClass="text-green-600" />
                    </div>
                </div>

                {/* Delivery */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Delivery" />
                    <div className="px-4">
                        <InfoRow icon={<Truck className="size-3.5" />} label="Method" value={currentRecord?.preferredDeliveryMethod?.replace(/_/g, ' ') ?? '—'} valueClass="capitalize" />
                        <InfoRow icon={<Receipt className="size-3.5" />} label="Attempts" value={`${currentRecord?.deliveryAttempts ?? 0} / ${currentRecord?.maxDeliveryAttempts ?? 0}`} />
                        {currentRecord?.shootCompletedAt && (
                            <InfoRow icon={<Calendar className="size-3.5" />} label="Shoot Completed" value={formetDateAndTime(currentRecord.shootCompletedAt)} />
                        )}
                        {currentRecord?.deliveredAt && (
                            <InfoRow icon={<Calendar className="size-3.5" />} label="Delivered" value={formetDateAndTime(currentRecord.deliveredAt)} />
                        )}
                        {currentRecord?.completedAt && (
                            <InfoRow icon={<Calendar className="size-3.5" />} label="Completed" value={formetDateAndTime(currentRecord.completedAt)} />
                        )}
                    </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <SectionHeader title="Payment" />
                    <div className="px-4">
                        <InfoRow
                            icon={<CreditCard className="size-3.5" />}
                            label="Status"
                            value={
                                currentRecord?.paymentStatus
                                    ? <Tag theme={paymentTheme(currentRecord.paymentStatus)} className="capitalize">
                                        {currentRecord.paymentStatus.replace(/_/g, ' ')}
                                    </Tag>
                                    : '—'
                            }
                        />
                        {(currentRecord?.refundAmount ?? 0) > 0 && (
                            <InfoRow icon={<BadgeDollarSign className="size-3.5" />} label="Refund Amount" value={`$${currentRecord?.refundAmount}`} />
                        )}
                        {currentRecord?.refundedAt && (
                            <InfoRow icon={<Calendar className="size-3.5" />} label="Refunded At" value={formetDateAndTime(currentRecord.refundedAt)} />
                        )}
                    </div>
                </div>

                {/* Cancellation */}
                {currentRecord?.cancelledAt && (
                    <div className="rounded-xl border border-red-200 overflow-hidden">
                        <div className="px-4 py-2 bg-red-500">
                            <div className="flex items-center gap-2">
                                <Ban className="size-3.5 text-white" />
                                <p className="text-xs font-semibold text-white uppercase tracking-wide">Cancellation</p>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-red-50">
                            <p className="text-sm text-red-700 font-medium">
                                {currentRecord.cancellationReason || 'No reason provided'}
                            </p>
                            <p className="text-xs text-red-400 mt-1">{formetDateAndTime(currentRecord.cancelledAt)}</p>
                        </div>
                    </div>
                )}

                {/* Rejection */}
                {currentRecord?.rejectedAt && (
                    <div className="rounded-xl border border-red-200 overflow-hidden">
                        <div className="px-4 py-2 bg-red-500">
                            <div className="flex items-center gap-2">
                                <XCircle className="size-3.5 text-white" />
                                <p className="text-xs font-semibold text-white uppercase tracking-wide">Rejection</p>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-red-50">
                            <p className="text-sm text-red-700 font-medium">
                                {currentRecord.rejectionReason || 'No reason provided'}
                            </p>
                            <p className="text-xs text-red-400 mt-1">{formetDateAndTime(currentRecord.rejectedAt)}</p>
                        </div>
                    </div>
                )}

                {/* Reschedule Request */}
                {currentRecord?.rescheduleRequest && (
                    <div className="rounded-xl border border-amber-200 overflow-hidden">
                        <div className="px-4 py-2 bg-amber-500 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <History className="size-3.5 text-white" />
                                <p className="text-xs font-semibold text-white uppercase tracking-wide">Reschedule Request</p>
                            </div>
                            <span className="bg-white text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                                {currentRecord.rescheduleRequest.status}
                            </span>
                        </div>
                        <div className="px-4 py-3 bg-amber-50 flex flex-col gap-1 text-xs sm:text-sm">
                            <p>
                                <span className="text-muted-foreground">Requested: </span>
                                {currentRecord.rescheduleRequest.requestedBookingDate ? formatDate(currentRecord.rescheduleRequest.requestedBookingDate) : '—'}
                                {' '}
                                ({currentRecord.rescheduleRequest.requestedStartTime} - {currentRecord.rescheduleRequest.requestedEndTime})
                            </p>
                            {currentRecord.rescheduleRequest.reason && (
                                <p className="text-amber-700">{currentRecord.rescheduleRequest.reason}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Status History */}
                {statusHistory.length > 0 && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <SectionHeader title="Status History" />
                        <div className="px-4 py-3 flex flex-col gap-2">
                            {statusHistory.map((h, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-border'}`} />
                                        {i < statusHistory.length - 1 && <div className="w-px h-4 bg-border" />}
                                    </div>
                                    <div className="flex items-center justify-between flex-1 pb-1">
                                        <Tag theme={statusTheme(h.status)} className="capitalize">
                                            {h.status.replace(/_/g, ' ')}
                                        </Tag>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                                            {formetDateAndTime(h.actionAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </ReusableModal>
    );
};

export default ViewBookingDetailsModal;
