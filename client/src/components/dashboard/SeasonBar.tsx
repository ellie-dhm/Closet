import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { NamedCount } from "../../types/stats";
import { SEASON_COLORS } from "./chartColors";

const ORDER = ["spring", "summer", "autumn", "winter", "all"];
const LABELS: Record<string, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  all: "All seasons",
};

export default function SeasonBar({ data }: { data: NamedCount[] }) {
  // Fixed seasonal order, and show 0 for seasons with no items
  const ordered = ORDER.map((s) => ({
    name: LABELS[s],
    value: data.find((d) => d.name === s)?.value ?? 0,
  }));

  return (
    <div className="card chart-card">
      <h3>Items by season</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ordered}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fillOpacity: 0.08 }} />
            <Bar dataKey="value" name="Items" radius={[6, 6, 0, 0]}>
              {ordered.map((d) => (
                <Cell key={d.name} fill={SEASON_COLORS[d.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
