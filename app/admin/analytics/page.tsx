"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  FileText,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { cn } from "@/lib/utils"

// Traffic data
const trafficData = [
  { name: "1-р", visitors: 2400, pageViews: 4800 },
  { name: "2-р", visitors: 1398, pageViews: 3200 },
  { name: "3-р", visitors: 3800, pageViews: 7200 },
  { name: "4-р", visitors: 3908, pageViews: 7800 },
  { name: "5-р", visitors: 4800, pageViews: 9200 },
  { name: "6-р", visitors: 3800, pageViews: 7400 },
  { name: "7-р", visitors: 4300, pageViews: 8600 },
]

// Top pages data
const topPagesData = [
  { name: "Монголын ДНБ-ний өсөлт", views: 12400, growth: 23 },
  { name: "AI технологийн хувьсгал", views: 9800, growth: 45 },
  { name: "Уур амьсгалын өөрчлөлт", views: 8200, growth: -5 },
  { name: "Крипто зах зээлийн тойм", views: 7600, growth: 12 },
  { name: "Эрүүл мэндийн зардал", views: 5400, growth: 8 },
]

// Device data
const deviceData = [
  { name: "Desktop", value: 45, color: "oklch(0.55 0.18 230)" },
  { name: "Mobile", value: 42, color: "oklch(0.65 0.15 175)" },
  { name: "Tablet", value: 13, color: "oklch(0.75 0.12 55)" },
]

// Country data
const countryData = [
  { name: "Монгол", visitors: 78400, percentage: 82 },
  { name: "АНУ", visitors: 8200, percentage: 8.5 },
  { name: "Солонгос", visitors: 4100, percentage: 4.3 },
  { name: "Хятад", visitors: 2900, percentage: 3 },
  { name: "Бусад", visitors: 2100, percentage: 2.2 },
]

// Browser data
const browserData = [
  { name: "Chrome", value: 62 },
  { name: "Safari", value: 18 },
  { name: "Firefox", value: 12 },
  { name: "Edge", value: 6 },
  { name: "Бусад", value: 2 },
]

const statsCards = [
  {
    label: "Нийт үзэлт",
    value: "245.8K",
    change: "+18%",
    changeType: "positive",
    icon: Eye,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Давтагдашгүй зочин",
    value: "89.2K",
    change: "+12%",
    changeType: "positive",
    icon: Users,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    label: "Дундаж хугацаа",
    value: "4м 32с",
    change: "+5%",
    changeType: "positive",
    icon: Clock,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    label: "Bounce rate",
    value: "42.3%",
    change: "-3%",
    changeType: "positive",
    icon: TrendingDown,
    color: "bg-chart-5/10 text-chart-5",
  },
]

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("week")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Статистик</h1>
            <p className="text-sm text-muted-foreground">
              Сайтын үзэлт болон хандалтын мэдээлэл
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            {[
              { value: "week", label: "7 хоног" },
              { value: "month", label: "Сар" },
              { value: "year", label: "Жил" },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  period === p.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    stat.color
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    stat.changeType === "positive"
                      ? "text-chart-4"
                      : "text-destructive"
                  )}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* Traffic Chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Трафикийн график</h3>
              <p className="text-sm text-muted-foreground">
                Зочин болон хуудас үзэлтийн тоо
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="oklch(0.55 0.18 230)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.55 0.18 230)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="oklch(0.65 0.15 175)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.65 0.15 175)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.005 240)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="Зочин"
                    stroke="oklch(0.55 0.18 230)"
                    strokeWidth={2}
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="Хуудас үзэлт"
                    stroke="oklch(0.65 0.15 175)"
                    strokeWidth={2}
                    fill="url(#colorPageViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Зочин</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Хуудас үзэлт</span>
              </div>
            </div>
          </div>

          {/* Device Distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Төхөөрөмжийн төрөл</h3>
              <p className="text-sm text-muted-foreground">Хандалтын эзлэх хувь</p>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.005 240)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {deviceData.map((item) => {
                const Icon =
                  item.name === "Desktop"
                    ? Monitor
                    : item.name === "Mobile"
                    ? Smartphone
                    : Tablet
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Шилдэг мэдээ</h3>
              <p className="text-sm text-muted-foreground">
                Хамгийн их үзэлттэй мэдээнүүд
              </p>
            </div>
            <div className="space-y-4">
              {topPagesData.map((page, index) => (
                <div key={page.name} className="flex items-center gap-4">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {page.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {page.views.toLocaleString()} үзэлт
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      page.growth >= 0 ? "text-chart-4" : "text-destructive"
                    )}
                  >
                    {page.growth >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(page.growth)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Country Distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Улс орноор</h3>
              <p className="text-sm text-muted-foreground">
                Зочдын байршлын тархалт
              </p>
            </div>
            <div className="space-y-4">
              {countryData.map((country) => (
                <div key={country.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {country.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {country.visitors.toLocaleString()} ({country.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Browser Stats */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-foreground">Хөтчөөр</h3>
            <p className="text-sm text-muted-foreground">
              Хэрэглэгчдийн ашиглаж буй хөтөч
            </p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={browserData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.91 0.005 240)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" fill="oklch(0.55 0.18 230)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
