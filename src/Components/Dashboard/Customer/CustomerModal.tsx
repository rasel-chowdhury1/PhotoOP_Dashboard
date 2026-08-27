import ReusableModal from '@/Components/ui/CustomUi/ReuseableModal';
import { getImageUrl } from '@/helpers/config/envConfig';
import { formatDate } from '@/utils/dateFormet';
import {
    Calendar,
    Globe,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Star,
} from 'lucide-react';
import { AllImages } from '../../../../public/images/AllImages';

const calcAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const ViewCustomerModal = ({
    isOpen,
    handleCancle,
    currentRecord,
    onBan,
    onWarn,
}: {
    isOpen: boolean;
    handleCancle: () => void;
    currentRecord: IUser | null;
    onBan: (record: IUser) => void;
    onWarn: (record: IUser) => void;
}) => {
    const serverUrl = getImageUrl();
    const isBlocked = currentRecord?.status === 'blocked';
    const guardian = currentRecord?.guardian;

    const infoRows = [
        {
            icon: <Mail className="size-3.5 text-muted-foreground" />,
            label: 'Email',
            value: currentRecord?.email || '—',
        },
        {
            icon: <Phone className="size-3.5 text-muted-foreground" />,
            label: 'Phone',
            value: currentRecord?.phoneNumber
                ? `${currentRecord.countryCode ?? ''} ${currentRecord.phoneNumber}`
                : '—',
        },
        {
            icon: <MapPin className="size-3.5 text-muted-foreground" />,
            label: 'Address',
            value: currentRecord?.address || '—',
        },
        {
            icon: <Calendar className="size-3.5 text-muted-foreground" />,
            label: 'Age',
            value: currentRecord?.dateOfBirth
                ? `${calcAge(currentRecord.dateOfBirth)} yrs`
                : '—',
        },
        {
            icon: <Star className="size-3.5 text-muted-foreground" />,
            label: 'Rating',
            value: `${currentRecord?.averageRating?.toFixed(1) ?? '0.0'} (${currentRecord?.totalReview ?? 0})`,
        },
    ];

    return (
        <ReusableModal
            maxWidth="sm:max-w-xl"
            open={isOpen}
            onOpenChange={handleCancle}
            title="Customer Details"
            footer={null}
        >
            <div className="flex flex-col gap-4">
                {/* Profile Hero */}
                <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="relative">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden ring-4 ring-background shadow-md">
                            <img
                                src={
                                    currentRecord?.profileImage
                                        ? `${serverUrl}${currentRecord.profileImage}`
                                        : AllImages.profile
                                }
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span
                            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-sm capitalize ${isBlocked
                                ? 'bg-red-100 text-red-600'
                                : 'bg-emerald-100 text-emerald-600'
                                }`}
                        >
                            {currentRecord?.status ?? 'active'}
                        </span>
                    </div>
                    <div className="mt-2 text-center">
                        <p className="text-lg sm:text-xl font-semibold text-foreground">
                            {currentRecord?.fullName || '—'}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                            Member since{' '}
                            {currentRecord?.createdAt
                                ? formatDate(currentRecord.createdAt)
                                : '—'}
                        </p>
                    </div>
                </div>

                {/* About */}
                {currentRecord?.about && (
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl px-3 py-2.5">
                        {currentRecord.about}
                    </p>
                )}

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

                {/* Guardian */}
                {guardian && (
                    <div className="rounded-xl border border-border overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Globe className="size-3.5 text-muted-foreground" />
                                <span className="text-xs sm:text-sm font-semibold text-foreground">
                                    Guardian
                                </span>
                            </div>
                            <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${guardian.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : guardian.status === 'REJECTED'
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-amber-100 text-amber-600'
                                    }`}
                            >
                                {guardian.status?.toLowerCase() ?? 'pending'}
                            </span>
                        </div>
                        <div className="px-4 py-3 flex flex-col gap-1 text-xs sm:text-sm">
                            <p className="font-semibold text-foreground">
                                {guardian.name} <span className="text-muted-foreground font-normal">({guardian.relation})</span>
                            </p>
                            <p className="text-muted-foreground">{guardian.email}</p>
                            {guardian.phoneNumber && (
                                <p className="text-muted-foreground">{guardian.phoneNumber}</p>
                            )}
                            {guardian.isVerified && (
                                <p className="flex items-center gap-1 text-emerald-600 mt-1">
                                    <ShieldCheck className="size-3.5" /> Verified
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pb-1">
                    <button
                        onClick={() => currentRecord && onWarn(currentRecord)}
                        className="w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors cursor-pointer bg-[#FE9A00] text-background hover:bg-[#FE9A00]/90"
                    >
                        Send Warning
                    </button>
                    <button
                        onClick={() => currentRecord && onBan(currentRecord)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors cursor-pointer text-white ${isBlocked
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-red-500 hover:bg-red-600'
                            }`}
                    >
                        {isBlocked ? 'Unblock Customer' : 'Block Customer'}
                    </button>
                </div>
            </div>
        </ReusableModal>
    );
};

export default ViewCustomerModal;
