"use client"

import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CategoryStats, StatItem, ChartDataPoint } from "@/lib/data"
import { DynamicIcon } from "@/components/admin/icon-picker"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  section?: "all" | "highlights" | "charts"
  showSourceNote?: boolean
  highlightsTitle?: string
  highlightsPerRow?: 2 | 3
  chartsTitle?: string
  chartsPerRow?: 1 | 2
  fullWidthBarChart?: boolean
}

function StatCard({ item }: { item: StatItem }) {
  const isExternal = Boolean(item.link && /^https?:\/\//i.test(item.link))

  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {item.icon && (
            <DynamicIcon name={item.icon} className="h-4 w-4 text-muted-foreground" />
          )}
          <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
        </div>
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
      {item.link && (
        <div className="mt-3 flex justify-end">
          <a
            href={item.link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Дэлгэрэнгүй
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  )
}

interface ChartCardProps {
  title: string
  type: "line" | "bar" | "area" | "pie" | "compare"
  data: ChartDataPoint[]
  metricLabel?: string
  dataKeys?: string[]
  dataLabels?: Array<string | undefined>
  dataKey?: string
  dataKey2?: string
  dataKey3?: string
  dataKey4?: string
  dataLabel?: string
  dataLabel2?: string
  dataLabel3?: string
  dataLabel4?: string
  color: string
  icon?: string
  link?: string
  fullWidth?: boolean
}

function ChartCard({
  title,
  type,
  data,
  metricLabel,
  dataKeys,
  dataLabels,
  dataKey = "value",
  dataKey2,
  dataKey3,
  dataKey4,
  dataLabel,
  dataLabel2,
  dataLabel3,
  dataLabel4,
  color,
  icon,
  link,
  fullWidth = false,
}: ChartCardProps) {
  const isExternal = Boolean(link && /^https?:\/\//i.test(link))
  const chartColor = color === "text-chart-1" ? "var(--chart-1)" :
                    color === "text-chart-2" ? "var(--chart-2)" :
                    color === "text-chart-3" ? "var(--chart-3)" :
                    color === "text-chart-4" ? "var(--chart-4)" :
                    color === "text-chart-5" ? "var(--chart-5)" :
                    color === "text-destructive" ? "var(--destructive)" : "var(--primary)"

  const normalizedDataKeys =
    Array.isArray(dataKeys) && dataKeys.length > 0
      ? dataKeys.filter(Boolean)
      : [dataKey, dataKey2, dataKey3, dataKey4].filter(
          (key): key is string => Boolean(key)
        )

  const series = normalizedDataKeys.map((key, idx) => {
    const explicitLabel = Array.isArray(dataLabels) ? dataLabels[idx] : undefined
    const legacyLabel =
      idx === 0
        ? dataLabel
        : idx === 1
          ? dataLabel2
          : idx === 2
            ? dataLabel3
            : idx === 3
              ? dataLabel4
              : undefined

    return {
      key,
      label: explicitLabel || legacyLabel || key,
    }
  })

  const seriesKeys = series.map((s) => s.key)
  const seriesColors = [
    chartColor,
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-5)",
    "var(--chart-4)",
    "var(--destructive)",
  ]
  const compareGridTemplate = `minmax(0,1.4fr) repeat(${Math.max(series.length, 1)}, minmax(0,1fr))`
  const compareTextClasses = [
    "text-cyan-300",
    "text-rose-300",
    "text-amber-300",
    "text-lime-300",
    "text-violet-300",
    "text-teal-300",
    "text-fuchsia-300",
  ]

  return (
    <div className={cn("rounded-xl bg-card p-4 ring-1 ring-border", fullWidth && "lg:col-span-2")}>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-card-foreground">{title}</h4>
        {icon ? (
          <DynamicIcon name={icon} className="h-4 w-4 text-muted-foreground" />
        ) : (
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      {type === "compare" ? (
        <div className="overflow-hidden rounded-lg border border-border bg-slate-900/95 text-slate-100">
          <div
            className="grid gap-0 border-b border-slate-700/80 bg-slate-800/90 text-[11px] font-semibold"
            style={{ gridTemplateColumns: compareGridTemplate }}
          >
            <div className="px-3 py-2 text-slate-300">{metricLabel?.trim() || "Metric"}</div>
            {series.map((item, idx) => (
              <div
                key={`compare-header-${item.key}`}
                className={cn("px-3 py-2 text-right", compareTextClasses[idx % compareTextClasses.length])}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div>
            {data.map((row, rowIdx) => {
              return (
                <div
                  key={`compare-row-${row.name}-${rowIdx}`}
                  className="grid border-b border-slate-700/60 last:border-b-0"
                  style={{ gridTemplateColumns: compareGridTemplate }}
                >
                  <div className="px-3 py-2 text-xs text-slate-200">{row.name}</div>
                  {series.map((item, idx) => (
                    <div
                      key={`compare-val-${item.key}-${rowIdx}`}
                      className={cn(
                        "px-3 py-2 text-right text-sm font-semibold",
                        compareTextClasses[idx % compareTextClasses.length]
                      )}
                    >
                      {row[item.key] !== undefined ? String(row[item.key]) : "-"}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "area" ? (
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                {seriesKeys.map((key, idx) => (
                  <linearGradient key={key} id={`gradient-${title}-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={seriesColors[idx % seriesColors.length]} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={seriesColors[idx % seriesColors.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
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
              {seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
              {series.map((item, idx) => (
                <Area
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={seriesColors[idx % seriesColors.length]}
                  strokeWidth={2}
                  fill={`url(#gradient-${title}-${idx})`}
                />
              ))}
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
              {seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
              {series.map((item, idx) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.label}
                  stroke={seriesColors[idx % seriesColors.length]}
                  strokeWidth={2}
                  dot={{ fill: seriesColors[idx % seriesColors.length], strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          ) : type === "bar" ? (
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
              {seriesKeys.length > 1 && <Legend wrapperStyle={{ fontSize: "11px" }} />}
              {series.map((item, idx) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  fill={seriesColors[idx % seriesColors.length]}
                  radius={[4, 4, 0, 0]}
                  name={item.label}
                />
              ))}
            </BarChart>
            ) : (
              <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, idx) => (
                  <Cell
                    key={`pie-cell-${entry.name}-${idx}`}
                    fill={seriesColors[idx % seriesColors.length]}
                  />
                ))}
              </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
      {link && (
        <div className="mt-3 flex justify-end">
          <a
            href={link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            Дэлгэрэнгүй
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  )
}

export function CategoryStatsView({
  stats,
  categoryColor,
  section = "all",
  showSourceNote = true,
  highlightsTitle = "Гол үзүүлэлтүүд",
  highlightsPerRow = 3,
  chartsTitle = "Статистик график",
  chartsPerRow = 2,
  fullWidthBarChart = false,
}: CategoryStatsProps) {
  const showHighlights = (section === "all" || section === "highlights") && stats.highlights.length > 0
  const showCharts = (section === "all" || section === "charts") && stats.charts.length > 0

  return (
    <div className="space-y-6">
      {/* Key Highlights */}
      {showHighlights && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">{highlightsTitle}</h3>
          </div>
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2",
              highlightsPerRow === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            )}
          >
            {stats.highlights.map((item, idx) => (
              <StatCard key={idx} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Charts */}
      {showCharts && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">{chartsTitle}</h3>
          </div>
          <div className={cn("grid gap-4", chartsPerRow === 1 ? "grid-cols-1" : "lg:grid-cols-2")}>
            {stats.charts.map((chart, idx) => (
              <ChartCard
                key={idx}
                title={chart.title}
                type={chart.type}
                data={chart.data}
                dataKey={chart.dataKey}
                dataKey2={chart.dataKey2}
                dataKey3={chart.dataKey3}
                dataKey4={chart.dataKey4}
                dataKeys={chart.dataKeys}
                dataLabel={chart.dataLabel}
                dataLabel2={chart.dataLabel2}
                dataLabel3={chart.dataLabel3}
                dataLabel4={chart.dataLabel4}
                dataLabels={chart.dataLabels}
                metricLabel={chart.metricLabel}
                color={categoryColor}
                icon={chart.icon}
                link={chart.link}
                fullWidth={fullWidthBarChart && chart.type === "bar" && chartsPerRow === 2}
              />
            ))}
          </div>
        </section>
      )}

      {/* Data Source Note */}
      {showSourceNote && (showHighlights || showCharts) && (
        <div className="rounded-lg bg-muted/50 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Эх сурвалж: Монгол Улсын Статистикийн Хороо, Монголбанк, Сангийн яам. 
            Сүүлийн шинэчлэл: 2025 оны 2-р сар
          </p>
        </div>
      )}
    </div>
  )
}
