import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  totalUsers: number;
  activeUsers: number; // Users who submitted logs today
}

export default function ActivityStatusChart({
  totalUsers,
  activeUsers,
}: Props) {
  const data = [
    { name: "Submitted", value: activeUsers },
    { name: "No Logs", value: Math.max(0, totalUsers - activeUsers) },
  ];

  // Green for success (Submitted), Amber for attention (No Logs)
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
              if (active && payload?.length) {
                const color =
                  payload[0].name === "Submitted" ? "#10b981" : "#f59e0b";
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
          {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
        </p>
        <p className="text-[10px] uppercase font-bold text-zinc-400">
          Log Submission Rate
        </p>
      </div>
    </div>
  );
}
