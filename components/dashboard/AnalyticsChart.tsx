"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Mon", feedback: 40 },
  { name: "Tue", feedback: 55 },
  { name: "Wed", feedback: 48 },
  { name: "Thu", feedback: 80 },
  { name: "Fri", feedback: 72 },
  { name: "Sat", feedback: 95 },
  { name: "Sun", feedback: 88 },
];

export default function AnalyticsChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Feedback Trend
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#374151" strokeDasharray="4 4" />
            <XAxis dataKey="name" stroke="#94A3B8" />
            <YAxis stroke="#94A3B8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="feedback"
              stroke="#3B82F6"
              strokeWidth={4}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}