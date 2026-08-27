import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface BookingAreaChartData {
  month: string;
  total: number;
}

const Booking_Area_Chart = ({ data }: { data: BookingAreaChartData[] }) => {
  const tickStyle = { fill: "#9CA3AF", fontSize: 12 };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#EEEEF2" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ ...tickStyle }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickCount={5}
            tick={{ ...tickStyle }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #eee", borderRadius: "8px" }}
            labelStyle={{ color: "#202020", fontWeight: 600 }}
            labelFormatter={(label: string) => `Month: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Bookings"
            stroke="#e53935"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#e53935", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6, stroke: "#e53935", strokeWidth: 2, fill: "#fff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Booking_Area_Chart;
