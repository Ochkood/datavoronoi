"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  MessageSquare,
  UserPlus,
  Bell,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  getAdminDashboardSummaryApi,
  type AdminDashboardSummary,
} from "@/lib/api"

type PeriodKey = "week" | "month" | "year"
type DashboardStatus = "draft" | "pending" | "published" | "rejected"

const statusColors: Record<DashboardStatus, string> = {
  published: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
  pending: "bg-chart-5/10 text-chart-5",
  rejected: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<DashboardStatus, string> = {
  published: "Нийтэлсэн",
  draft: "Ноорог",
  pending: "Хүлээгдэж буй",
  rejected: "Татгалзсан",
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

function formatRelativeDate(dateString: string) {
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return "Саяхан"
  const now = Date.now()
  const diffMs = now - d.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffMin < 1) return "Саяхан"
  if (diffMin < 60) return `${diffMin} минутын өмнө`
  if (diffHour < 24) return `${diffHour} цагийн өмнө`
  if (diffDay < 7) return `${diffDay} өдрийн өмнө`
  return d.toLocaleDateString("mn-MN")
}

function toRange(period: PeriodKey): "7d" | "30d" | "1y" {
  if (period === "week") return "7d"
  if (period === "month") return "30d"
  return "1y"
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<PeriodKey>("month")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState<AdminDashboardSummary | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    getAdminDashboardSummaryApi(toRange(period))
      .then((res) => {
        if (cancelled) return
        setData(res)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Мэдээлэл татахад алдаа гарлаа")
        setData(null)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [period])

  const statsCards = useMemo(() => {
    return [
      {
        label: "Нийт мэдээ",
        value: formatCompactNumber(data?.stats.totalPosts.value || 0),
        change: data?.stats.totalPosts.changePct || 0,
        icon: FileText,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Нийт хэрэглэгч",
        value: formatCompactNumber(data?.stats.totalUsers.value || 0),
        change: data?.stats.totalUsers.changePct || 0,
        icon: Users,
        color: "bg-chart-2/10 text-chart-2",
      },
      {
        label: "Өнөөдрийн үзэлт",
        value: formatCompactNumber(data?.stats.todayViews.value || 0),
        change: data?.stats.todayViews.changePct || 0,
        icon: Eye,
        color: "bg-chart-4/10 text-chart-4",
      },
      {
        label: "Engagement rate",
        value: `${(data?.stats.engagementRate.value || 0).toFixed(1)}%`,
        change: data?.stats.engagementRate.changePct || 0,
        icon: TrendingUp,
        color: "bg-chart-5/10 text-chart-5",
      },
    ]
  }, [data])

  const activityIconByType = {
    post: FileText,
    user: UserPlus,
    comment: MessageSquare,
    notification: Bell,
  } as const

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Сайтын ерөнхий статистик</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
              {(["week", "month", "year"] as PeriodKey[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    period === p
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p === "week" ? "7 хоног" : p === "month" ? "Сар" : "Жил"}
                </button>
              ))}
            </div>
            <Link
              href="/dashboard/posts/new"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" />
              Шинэ мэдээ
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6">
        {error ? (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const isPositive = stat.change >= 0
            return (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      isPositive ? "text-chart-4" : "text-destructive"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(stat.change).toFixed(1)}%
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{loading ? "..." : stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Үзэлтийн тоо</h3>
                <p className="text-sm text-muted-foreground">Сүүлийн 7 сарын статистик</p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.viewsTrend || []}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.18 230)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.55 0.18 230)" stopOpacity={0} />
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
                    tickFormatter={(value) => `${Math.round(value / 1000)}K`}
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
                    dataKey="views"
                    stroke="oklch(0.55 0.18 230)"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Ангилалын тархалт</h3>
                <p className="text-sm text-muted-foreground">Нийтлэлийн тоо ангилалаар</p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.categoryData || []} layout="vertical">
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.005 240)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="posts" fill="oklch(0.65 0.15 175)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-semibold text-foreground">Сүүлийн мэдээ</h3>
                <p className="text-sm text-muted-foreground">Сүүлд нэмэгдсэн болон шинэчлэгдсэн</p>
              </div>
              <Link href="/admin/posts" className="text-sm font-medium text-primary hover:underline">
                Бүгдийг харах
              </Link>
            </div>
            <div className="divide-y divide-border">
              {(data?.recentPosts || []).map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 hover:bg-secondary/50">
                  <div className="flex-1">
                    <h4 className="line-clamp-1 font-medium text-foreground">{post.title}</h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{post.category}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatRelativeDate(post.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[(post.status || "draft") as DashboardStatus]
                      }`}
                    >
                      {statusLabels[(post.status || "draft") as DashboardStatus]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {formatCompactNumber(post.views || 0)}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && (data?.recentPosts || []).length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">Мэдээ байхгүй байна.</div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold text-foreground">Сүүлийн үйлдлүүд</h3>
              <p className="text-sm text-muted-foreground">Системийн сүүлийн үйл ажиллагаа</p>
            </div>
            <div className="divide-y divide-border">
              {(data?.recentActivities || []).map((activity) => {
                const Icon = activityIconByType[activity.type] || Bell
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatRelativeDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
              {!loading && (data?.recentActivities || []).length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">Үйлдлийн мэдээлэл алга.</div>
              ) : null}
            </div>
            <div className="border-t border-border p-3">
              <Link
                href="/admin/posts"
                className="block w-full rounded-lg bg-secondary py-2 text-center text-sm font-medium text-foreground hover:bg-secondary/80"
              >
                Бүгдийг харах
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
