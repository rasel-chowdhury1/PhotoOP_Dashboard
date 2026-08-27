import { useState } from "react";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";
import Booking_Area_Chart from "@/Components/Charts/BookingAreaChart";
import { useGetYearlyBookingsQuery } from "@/redux/features/overview/overviewApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const BookingOverview = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data } = useGetYearlyBookingsQuery({ year }, { refetchOnMountOrArgChange: true });

  const chartData = MONTHS.map((month, i) => {
    const monthNum = i + 1;
    const monthData = data?.data?.months?.find((m) => m.month === monthNum);
    return {
      month,
      total: monthData?.total ?? 0,
    };
  });

  return (
    <div className="w-full lg:w-1/2 p-3 bg-[#FFFFFF] rounded-lg border border-[#E1E1E1]">
      <div className="flex justify-between text-base-color mt-4">
        <p className="text-2xl text-gradient-color lg:text-3xl font-bold mb-5">
          Bookings Overview
        </p>
        <div>
          <YearOption currentYear={currentYear} setThisYear={setYear} />
        </div>
      </div>
      <div>
        <Booking_Area_Chart data={chartData} />
      </div>
    </div>
  );
};

export default BookingOverview;
