import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import { formetDateAndTime } from '@/utils/dateFormet';
import {
    Banknote,
    Calendar,
    CreditCard,
    Hash,
    Mail,
    Receipt,
    Ticket,
    User,
} from 'lucide-react';

const statusStyle = (status?: string) => {
    switch (status) {
        case 'SUCCEEDED':
            return 'bg-emerald-100 text-emerald-600';
        case 'PENDING':
            return 'bg-amber-100 text-amber-600';
        case 'FAILED':
            return 'bg-red-100 text-red-600';
        case 'REFUNDED':
            return 'bg-orange-100 text-orange-600';
        default:
            return 'bg-amber-100 text-amber-600';
    }
};

const formatLabel = (value?: string | null) =>
    value ? value.charAt(0) + value.slice(1).toLowerCase() : '—';

interface ViewTransactionModalProps {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: ITransaction | null;
}

const ViewTransactionModal = ({
    isOpen,
    handleCancle,
    currentRecord,
}: ViewTransactionModalProps) => {
    const booking = currentRecord?.bookingId ?? null;

    const infoRows = [
        {
            icon: <CreditCard className="size-3.5 text-muted-foreground" />,
            label: 'Amount',
            value: currentRecord
                ? `${currentRecord.amount} ${currentRecord.currency}`
                : '—',
        },
        {
            icon: <Banknote className="size-3.5 text-muted-foreground" />,
            label: 'Gateway',
            value: formatLabel(currentRecord?.gateway),
        },
        {
            icon: <Ticket className="size-3.5 text-muted-foreground" />,
            label: 'Payment Type',
            value: formatLabel(currentRecord?.paymentType),
        },
        {
            icon: <Calendar className="size-3.5 text-muted-foreground" />,
            label: 'Paid At',
            value: currentRecord?.paidAt
                ? formetDateAndTime(currentRecord.paidAt)
                : '—',
        },
    ];

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Transaction Details"
            footer={null}
        >
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="w-16 h-16 rounded-xl bg-muted/60 flex items-center justify-center ring-4 ring-background shadow-md">
                        <Receipt className="size-7 text-muted-foreground" />
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-lg sm:text-xl font-semibold text-foreground font-mono">
                            {currentRecord?.paymentNumber || '—'}
                        </p>
                        <span
                            className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusStyle(
                                currentRecord?.status
                            )}`}
                        >
                            {formatLabel(currentRecord?.status)}
                        </span>
                    </div>
                </div>

                {/* Customer */}
                <div className="bg-muted/50 rounded-xl px-3 py-3 flex items-center gap-3">
                    <div className="flex items-center justify-center size-9 rounded-full bg-background">
                        <User className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-semibold text-foreground">
                            {currentRecord?.userId?.fullName || '—'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {currentRecord?.userId?.email || '—'}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {infoRows.map((row, i) => (
                        <div
                            key={i}
                            className="bg-muted/50 rounded-xl px-3 py-3 flex flex-col gap-1.5"
                        >
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {row.icon}
                                <span className="text-xs sm:text-sm font-medium">
                                    {row.label}
                                </span>
                            </div>
                            <span className="text-sm sm:text-base font-semibold text-foreground truncate">
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Booking */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Ticket className="size-3.5 text-muted-foreground" />
                            <span className="text-xs sm:text-sm font-semibold text-foreground">
                                Booking
                            </span>
                        </div>
                        {booking && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize bg-blue-100 text-blue-600">
                                {formatLabel(booking.status)}
                            </span>
                        )}
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-1 text-xs sm:text-sm">
                        {booking ? (
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold text-foreground font-mono">
                                    {booking.bookingId}
                                </p>
                                <p className="text-muted-foreground">
                                    Booking Date: {formetDateAndTime(booking.bookingDate)}
                                </p>
                                <p className="text-muted-foreground">
                                    Total Price: ${booking.totalPrice}
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                No booking linked to this payment.
                            </p>
                        )}
                    </div>
                </div>

                {/* Transaction meta */}
                <div className="rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
                        <Hash className="size-3.5 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-semibold text-foreground">
                            Reference IDs
                        </span>
                    </div>
                    <div className="px-4 py-3 flex flex-col gap-1.5 text-xs sm:text-sm">
                        <p className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Transaction ID</span>
                            <span className="font-mono text-foreground truncate">
                                {currentRecord?.transactionId || '—'}
                            </span>
                        </p>
                        <p className="flex justify-between gap-2">
                            <span className="text-muted-foreground shrink-0">Checkout Session</span>
                            <span className="font-mono text-foreground truncate">
                                {currentRecord?.checkoutSessionId || '—'}
                            </span>
                        </p>
                        {currentRecord?.refundReason ? (
                            <p className="flex justify-between gap-2">
                                <span className="text-muted-foreground shrink-0">Refund Reason</span>
                                <span className="text-foreground truncate">
                                    {currentRecord.refundReason}
                                </span>
                            </p>
                        ) : null}
                    </div>
                </div>

            </div>
        </ReusableModal>
    );
};

export default ViewTransactionModal;