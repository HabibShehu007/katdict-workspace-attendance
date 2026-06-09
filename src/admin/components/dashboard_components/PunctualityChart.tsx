// components/dashboard_components/PunctualityChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  total: number;
  present: number;
}

export default function PunctualityChart({ total, present }: Props) {
  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: Math.max(0, total - present) },
  ];

  const COLORS = ["#10b981", "#f59e0b"];

  return (
    <div className="h-40 w-full flex items-center transition-all duration-300 hover:scale-[1.02]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={45}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const color =
                  payload[0].payload.name === "Present" ? "#10b981" : "#f59e0b";
                return (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-lg">
                    <p
                      style={{ color }}
                      className="font-black text-[11px] uppercase"
                    >
                      {payload[0].name}: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="ml-4">
        <p className="text-2xl font-black text-zinc-900 dark:text-white">
          {total > 0 ? Math.round((present / total) * 100) : 0}%
        </p>
        <p className="text-[10px] uppercase font-bold text-zinc-400">
          Punctuality
        </p>
      </div>
    </div>
  );
}
