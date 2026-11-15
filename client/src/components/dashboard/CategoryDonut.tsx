import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { NamedCount } from "../../types/stats";
import { CATEGORY_COLORS } from "./chartColors";

export default function CategoryDonut({ data }: { data: NamedCount[] }) {
  return (
    <div className="card chart-card">
      <h3>Items by category</h3>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              formatter={(value) => (
                <span
                  style={{ color: "var(--muted)", textTransform: "capitalize" }}
                >
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
