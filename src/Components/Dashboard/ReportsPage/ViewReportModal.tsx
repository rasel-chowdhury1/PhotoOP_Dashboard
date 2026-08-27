import { formatDate } from "@/utils/dateFormet";
import { Button } from "@/Components/ui/button";
import ReusableModal from "@/Components/ui/CustomUi/ReuseableModal";
import { getImageUrl } from "@/helpers/config/envConfig";
import { AllImages } from "../../../../public/images/AllImages";

interface ViewReportModalProps {
  isOpen: boolean;
  handleCancle: () => void;
  currentRecord: IReport | null;
  onResolve: (record: IReport) => void;
  isResolving?: boolean;
}

const ViewReportModal = ({
  isOpen,
  handleCancle,
  currentRecord,
  onResolve,
  isResolving = false,
}: ViewReportModalProps) => {
  const serverUrl = getImageUrl();

  if (!currentRecord) return null;

  const { reportedBy, reportedUser, ride, reason, details, status, createdAt } = currentRecord;

  return (
    <ReusableModal
      maxWidth="sm:max-w-[700px]"
      open={isOpen}
      onOpenChange={handleCancle}
      title="Report Details"
      footer={null}
    >
      <div className="space-y-4">
        {/* Report Information */}
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] space-y-4 p-4 rounded-lg">
          <h3 className="text-lg lg:text-xl font-semibold">Report Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs sm:text-sm font-semibold text-muted-foreground">Reason</h5>
              <p className="text-sm sm:text-base font-medium">{reason}</p>
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-semibold text-muted-foreground">Date Reported</h5>
              <p className="text-sm sm:text-base font-medium">
                {formatDate(createdAt)}
              </p>
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-semibold text-muted-foreground">Ride ID</h5>
              <p className="text-sm sm:text-base font-medium">{ride?.rideId ?? "—"}</p>
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-semibold text-muted-foreground">Ride Status</h5>
              <p className="text-sm sm:text-base font-medium capitalize">{ride?.status?.toLowerCase() ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="bg-[#F5F5F5] border border-[#E5E5E5] space-y-3 p-4 rounded-lg">
          <h3 className="text-lg lg:text-xl font-semibold">Report Details</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            {details || "No additional details provided."}
          </p>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Reported By */}
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] space-y-3 p-4 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold">Reported By</h3>
            <div className="flex items-center gap-3">
              <img
                src={
                  reportedBy?.profileImage
                    ? `${serverUrl}${reportedBy.profileImage}`
                    : AllImages.profile
                }
                alt={reportedBy?.name}
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-sm">{reportedBy?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{reportedBy?.role}</p>
                {reportedBy?.email && (
                  <p className="text-xs text-muted-foreground">{reportedBy.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reported User */}
          <div className="bg-[#F5F5F5] border border-[#E5E5E5] space-y-3 p-4 rounded-lg">
            <h3 className="text-base lg:text-lg font-semibold">Reported User</h3>
            <div className="flex items-center gap-3">
              <img
                src={
                  reportedUser?.profileImage
                    ? `${serverUrl}${reportedUser.profileImage}`
                    : AllImages.profile
                }
                alt={reportedUser?.name}
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-sm">{reportedUser?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{reportedUser?.role}</p>
                {reportedUser?.email && (
                  <p className="text-xs text-muted-foreground">{reportedUser.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action */}
        {status === "pending" ? (
          <Button
            className="w-full"
            onClick={() => onResolve(currentRecord)}
            disabled={isResolving}
          >
            {isResolving ? "Resolving..." : "Mark as Resolved"}
          </Button>
        ) : (
          <Button className="w-full bg-success! pointer-events-none">Resolved</Button>
        )}
      </div>
    </ReusableModal>
  );
};

export default ViewReportModal;
