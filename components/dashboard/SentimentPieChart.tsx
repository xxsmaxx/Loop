"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Positive", value: 64, color: "#22c55e" },
  { name: "Neutral", value: 22, color: "#3b82f6" },
  { name: "Negative", value: 14, color: "#ef4444" },
];

export default function SentimentPieChart() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-bold text-white">Sentiment Distribution</h2>

      <div className="mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={70} outerRadius={110}>
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}