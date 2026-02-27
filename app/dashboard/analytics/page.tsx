"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  ArrowRight,
  Globe,
  Smartphone,
  Monitor,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock data
const overviewStats = [
  {
    label: "Нийт үзэлт",
    value: "45,234",
    change: "+12.5%",
    changeType: "positive",
    icon: Eye,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Нийт лайк",
    value: "1,892",
    change: "+8.2%",
    changeType: "positive",
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
  },
  {
    label: "Сэтгэгдэл",
    value: "234",
    change: "-2.1%",
    changeType: "negative",
    icon: MessageCircle,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    label: "Дагагчид",
    value: "567",
    change: "+15.3%",
    changeType: "positive",
    icon: Users,
    color: "bg-chart-4/10 text-chart-4",
  },
]

const viewsData = [
  { name: "1-р сар", views: 1200, likes: 89 },
  { name: "2-р сар", views: 1800, likes: 134 },
  { name: "3-р сар", views: 2400, likes: 178 },
  { name: "4-р сар", views: 2100, likes: 156 },
  { name: "5-р сар", views: 3200, likes: 245 },
  { name: "6-р сар", views: 2800, likes: 198 },
  { name: "7-р сар", views: 3500, likes: 267 },
]

const topPosts = [
  {
    id: "1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
    views: "12.4K",
    likes: 234,
    image: "/images/infographic-1.jpg",
  },
  {
    id: "2",
    title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
    views: "4.8K",
    likes: 89,
    image: "/images/infographic-8.jpg",
  },
  {
    id: "3",
    title: "Технологийн компаниудын зах зээлийн үнэлгээ",
    views: "3.2K",
    likes: 67,
    image: "/images/infographic-4.jpg",
  },
  {
    id: "4",
    title: "Крипто зах зээлийн тойм",
    views: "2.9K",
    likes: 54,
    image: "/images/infographic-6.jpg",
  },
]

const deviceData = [
  { name: "Desktop", value: 55, color: "hsl(var(--primary))" },
  { name: "Mobile", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 10, color: "hsl(var(--chart-4))" },
]

const countryData = [
  { country: "Монгол", views: 32450, percentage: 72 },
  { country: "АНУ", views: 5420, percentage: 12 },
  { country: "Солонгос", views: 2710, percentage: 6 },
  { country: "Япон", views: 1805, percentage: 4 },
  { country: "Бусад", views: 2849, percentage: 6 },
]

const weeklyData = [
  { day: "Да", views: 450 },
  { day: "Мя", views: 520 },
  { day: "Лх", views: 480 },
  { day: "Пү", views: 610 },
  { day: "Ба", views: 720 },
  { day: "Бя", views: 890 },
  { day: "Ня", views: 650 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d")

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Статистик</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Таны нийтлэлүүдийн гүйцэтгэлийн дүн шинжилгээ
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="7d">Сүүлийн 7 хоног</option>
          <option value="30d">Сүүлийн 30 хоног</option>
          <option value="90d">Сүүлийн 90 хоног</option>
          <option value="1y">Сүүлийн 1 жил</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
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
                  "flex items-center gap-1 text-xs font-medium",
                  stat.changeType === "positive"
                    ? "text-chart-4"
                    : "text-destructive"
                )}
              >
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Views & Likes Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Үзэлт ба лайкын чиг хандлага
            </h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--destructive))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--destructive))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Үзэлт"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  name="Лайк"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLikes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Views */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Долоо хоногийн үзэлт
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="views"
                  name="Үзэлт"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Posts */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">
              Шилдэг нийтлэлүүд
            </h2>
            <Link
              href="/dashboard/posts"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Бүгдийг харах
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/30"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {post.title}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Country Stats */}
        <div className="space-y-6">
          {/* Device Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Төхөөрөмжийн тархалт
            </h2>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Country Stats */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-foreground">
              Улс орноор
            </h2>
            <div className="space-y-3">
              {countryData.map((item) => (
                <div key={item.country}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.country}</span>
                    <span className="text-muted-foreground">
                      {item.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
