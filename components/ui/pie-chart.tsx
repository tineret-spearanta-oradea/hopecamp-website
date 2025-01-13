"use client";

import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  width?: number;
  height?: number;
}

export function PieChart({ data, width = 200, height = 100 }: PieChartProps) {
  return (
    <div style={{ width, height }}>
      <ResponsiveContainer>
        <RechartsChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={40}
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
}
