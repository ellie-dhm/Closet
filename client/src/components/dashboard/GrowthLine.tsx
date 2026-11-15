import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LINE_COLOR } from "./chartColors";

type Point = { date: string; value: number };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

export default function GrowthLine({ data }: { data: Point[] }) {
  // Turn daily counts into a running total
  let running = 0;
  const cumulative = data.map((d) => ({
    date: d.date,
    total: (running += d.value),
  }));

  return (
    <div className="card chart-card chart-card--wide">
      <h3>Wardrobe growth</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={cumulative}
            margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tickLine={false}
              minTickGap={32}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip labelFormatter={(label) => formatDate(String(label))} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total pieces"
              stroke={LINE_COLOR}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
