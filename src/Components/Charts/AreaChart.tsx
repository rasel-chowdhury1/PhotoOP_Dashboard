import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export interface AreaChartData {
  month: string;
  snappers: number;
  users: number;
}

const Area_Chart = ({ data }: { data: AreaChartData[] }) => {


  const tickStyle = { fill: "#000", fontSize: 12 };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSnappers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e53935" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#e53935" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#28314e" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#28314e" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#E5E5EF" strokeDasharray="0" />
          <XAxis dataKey="month" tick={{ ...tickStyle }} tickMargin={6} />
          <YAxis
            tickCount={5}
            tick={{ ...tickStyle }}
            tickMargin={16}
            axisLine={{ stroke: "#ffffff", strokeWidth: 2, strokeDasharray: "7 7" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}
            labelStyle={{ color: "#202020", fontWeight: 600 }}
            labelFormatter={(label: string) => `Month: ${label}`}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: "#555", textTransform: "capitalize" }}>{value}</span>
            )}
          />
          <Area
            type="monotone"
            dataKey="snappers"
            name="Snappers"
            stroke="#e53935"
            strokeWidth={2.5}
            fill="url(#colorSnappers)"
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#e53935" }}
          />
          <Area
            type="monotone"
            dataKey="users"
            name="Users"
            stroke="#28314e"
            strokeWidth={2.5}
            fill="url(#colorCustomers)"
            dot={false}
            activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#28314e" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Area_Chart;
