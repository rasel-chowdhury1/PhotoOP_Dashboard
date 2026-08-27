import { useState } from "react";
import Bar_Chart from "@/Components/Charts/BarChart";
import YearOption from "@/Components/ui/CustomUi/ReuseYearSelect";
import { useGetYearlyEarningsQuery } from "@/redux/features/overview/overviewApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const IncomeOverview = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const { data } = useGetYearlyEarningsQuery({ year }, { refetchOnMountOrArgChange: true });

  const chartData = MONTHS.map((month, i) => {
    const monthNum = i + 1;
    const earning = data?.data?.months?.find((m) => m.month === monthNum)?.totalRevenue ?? 0;
    return { month, totalEarnings: earning };
  });


  return (
    <div className="w-full lg:w-1/2 p-3 bg-[#FFFFFF] rounded-lg flex flex-col border border-[#E1E1E1]">
      <div className="flex justify-between text-base-color mt-4">
        <p className="text-2xl lg:text-3xl text-secondary-color font-bold mb-5">
          Revenue
        </p>
        <div>
          <YearOption currentYear={currentYear} setThisYear={setYear} />
        </div>
      </div>
      <hr />
      <div>
        <Bar_Chart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;
