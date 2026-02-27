"use client"

import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CategoryStats, StatItem, ChartDataPoint } from "@/lib/data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface CategoryStatsProps {
  stats: CategoryStats
  categoryColor: string
}

function StatCard({ item }: { item: StatItem }) {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
        {item.changeType && (
          <span
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              item.changeType === "positive" && "bg-chart-4/15 text-chart-4",
              item.changeType === "negative" && "bg-destructive/15 text-destructive",
              item.changeType === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {item.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
            {item.changeType === "negative" && <TrendingDown className="h-3 w-3" />}
            {item.changeType === "neutral" && <Minus className="h-3 w-3" />}
            {item.change}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-card-foreground">{item.value}</p>
      {item.description && (
        <p className="mt-1 text-[11px] text-muted-foreground">{item.description}</p>
      )}
    </div>
  )
}

interface ChartCardProps {
  title: string
  type: "line" | "bar" | "area" | "pie"
  data: ChartDataPoint[]
  dataKey?: string
  dataKey2?: string
  color: string
}

function ChartCard({ title, type, data, dataKey = "value", dataKey2, color }: ChartCardProps) {
  const chartColor = color === "text-chart-1" ? "var(--chart-1)" :
                    color === "text-chart-2" ? "var(--chart-2)" :
                    color === "text-chart-3" ? "var(--chart-3)" :
                    color === "text-chart-4" ? "var(--chart-4)" :
                    color === "text-chart-5" ? "var(--chart-5)" :
                    color === "text-destructive" ? "var(--destructive)" : "var(--primary)"

  const secondaryColor = "var(--muted-foreground)"

  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-card-foreground">{title}</h4>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          ) : type === "line" ? (
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2}
                dot={{ fill: chartColor, strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {dataKey2 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
              <Bar 
                dataKey={dataKey} 
                fill={chartColor} 
                radius={[4, 4, 0, 0]}
                name={dataKey2 ? "Орлого" : undefined}
              />
              {dataKey2 && (
                <Bar 
                  dataKey={dataKey2} 
                  fill={secondaryColor} 
                  radius={[4, 4, 0, 0]}
                  name="Зарлага"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function CategoryStatsView({ stats, categoryColor }: CategoryStatsProps) {
  return (
    <div className="space-y-6">
      {/* Key Highlights */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <ArrowUpRight className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Гол үзүүлэлтүүд</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.highlights.map((item, idx) => (
            <StatCard key={idx} item={item} />
          ))}
        </div>
      </section>

      {/* Charts */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold text-foreground">Статистик график</h3>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {stats.charts.map((chart, idx) => (
            <ChartCard
              key={idx}
              title={chart.title}
              type={chart.type}
              data={chart.data}
              dataKey={chart.dataKey}
              dataKey2={chart.dataKey2}
              color={categoryColor}
            />
          ))}
        </div>
      </section>

      {/* Data Source Note */}
      <div className="rounded-lg bg-muted/50 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Эх сурвалж: Монгол Улсын Статистикийн Хороо, Монголбанк, Сангийн яам. 
          Сүүлийн шинэчлэл: 2025 оны 2-р сар
        </p>
      </div>
    </div>
  )
}
