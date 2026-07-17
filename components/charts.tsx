"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const colors = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#64748b"];

export function DepartmentChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border) / 0.5)", borderRadius: "8px" }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={90} paddingAngle={4} cornerRadius={2}>
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} opacity={0.9} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border) / 0.5)", borderRadius: "8px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data }: { data: { date: string; requests: number; approved: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="requests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.3)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border) / 0.5)", borderRadius: "8px" }} />
        <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="url(#requests)" strokeWidth={2} />
        <Area type="monotone" dataKey="approved" stroke="#10b981" fill="transparent" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
