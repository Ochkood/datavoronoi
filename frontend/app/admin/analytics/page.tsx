"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Clock,
  Eye,
  FileText,
  TrendingUp,
  Users,
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
import { cn } from "@/lib/utils"
import {
  getAdminDashboardSummaryApi,
  type AdminDashboardSummary,
} from "@/lib/api"

type PeriodKey = "week" | "month" | "year"

type PostStatus = "draft" | "pending" | "published" | "rejected"

const statusLabel: Record<PostStatus, string> = {
  draft: "Ноорог",
  pending: "Хүлээгдэж буй",
  published: "Нийтэлсэн",
  rejected: "Татгалзсан",
}

const statusClass: Record<PostStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending: "bg-chart-5/15 text-chart-5",
  published: "bg-chart-4/15 text-chart-4",
  rejected: "bg-destructive/15 text-destructive",
}

function toRange(period: PeriodKey): "7d" | "30d" | "1y" {
  if (period === "week") return "7d"
  if (period === "month") return "30d"
  return "1y"
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return String(value)
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("mn-MN")
}

export default function AdminAnalyticsPage() {
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
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Статистик татахад алдаа гарлаа")
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

  const statsCards = useMemo(
    () => [
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
    ],
    [data]
  )

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Статистик</h1>
            <p className="text-sm text-muted-foreground">Backend датагаар шинэчлэгдэнэ</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            {([
              { value: "week", label: "7 хоног" },
              { value: "month", label: "Сар" },
              { value: "year", label: "Жил" },
            ] as const).map((item) => (
              <button
                key={item.value}
                onClick={() => setPeriod(item.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  period === item.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => {
            const positive = stat.change >= 0
            return (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-medium",
                      positive ? "text-chart-4" : "text-destructive"
                    )}
                  >
                    {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-foreground">{loading ? "..." : stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Үзэлтийн тренд</h3>
              <p className="text-sm text-muted-foreground">Сүүлийн сарууд</p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.viewsTrend || []}>
                  <defs>
                    <linearGradient id="adminViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.18 230)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.55 0.18 230)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.91 0.005 240)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="views" stroke="oklch(0.55 0.18 230)" strokeWidth={2} fill="url(#adminViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-foreground">Ангиллын тархалт</h3>
              <p className="text-sm text-muted-foreground">Нийтлэл ангиллаар</p>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.categoryData || []} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(0.50 0.01 240)" }} width={90} />
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

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h3 className="font-semibold text-foreground">Сүүлийн мэдээнүүд</h3>
              <p className="text-sm text-muted-foreground">Хяналтын хүснэгт</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Realtime
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Гарчиг</th>
                  <th className="px-5 py-3">Төлөв</th>
                  <th className="px-5 py-3">Үзэлт</th>
                  <th className="px-5 py-3">Огноо</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentPosts || []).map((post) => (
                  <tr key={post.id} className="border-t border-border/70">
                    <td className="px-5 py-3 font-medium text-foreground">{post.title}</td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", statusClass[post.status as PostStatus] || "bg-muted text-muted-foreground")}>
                        {statusLabel[post.status as PostStatus] || post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{formatCompactNumber(post.views)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatDate(post.date)}</td>
                  </tr>
                ))}
                {!loading && (data?.recentPosts || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      Мэдээлэл байхгүй
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
          Төхөөрөмж, улс орон, веб хөтөчийн хүнд статистикуудыг энэ хувилбарт хассан.
          Гол KPI болон тренд үзүүлэлтүүд backend-с бодитоор ачаалж байна.
        </div>
      </div>
    </div>
  )
}
