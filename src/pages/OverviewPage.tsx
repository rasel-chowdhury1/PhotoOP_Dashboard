import BookingOverview from "@/Components/Dashboard/Overview/BookingOverview";
import IncomeOverview from "@/Components/Dashboard/Overview/IncomeOverview";
import OverviewCards from "@/Components/Dashboard/Overview/OverviewCards";
import RecentUser from "@/Components/Dashboard/Overview/RecentUser";

const Overview = () => {

    return (
        <div className="space-y-10 min-h-screen py-10">
            <>
                <div className="
                ">
                    <OverviewCards />
                </div>

                <div className="flex flex-col lg:flex-row gap-5 mt-8">
                    <BookingOverview />
                    {/* <UserOverview /> */}
                    <IncomeOverview />
                </div>

                <RecentUser />
            </>
        </div>
    );
};

export default Overview;