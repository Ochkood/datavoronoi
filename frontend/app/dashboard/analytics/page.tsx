"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
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
import { getDashboardAnalyticsApi, type DashboardAnalytics } from "@/lib/api"

function formatCompact(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "1y">("7d")
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setLoading(true)
    setError("")
    getDashboardAnalyticsApi(dateRange)
      .then(setAnalytics)
      .catch((e) => setError(e instanceof Error ? e.message : "Analytics ачаалж чадсангүй"))
      .finally(() => setLoading(false))
  }, [dateRange])

  const overviewStats = useMemo(() => {
    if (!analytics) return []
    return [
      {
        label: "Нийт үзэлт",
        value: formatCompact(analytics.overview.views.value),
        change: `${analytics.overview.views.changePct.toFixed(1)}%`,
        changeType: analytics.overview.views.changePct >= 0 ? "positive" : "negative",
        icon: Eye,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Нийт лайк",
        value: formatCompact(analytics.overview.likes.value),
        change: `${analytics.overview.likes.changePct.toFixed(1)}%`,
        changeType: analytics.overview.likes.changePct >= 0 ? "positive" : "negative",
        icon: Heart,
        color: "bg-destructive/10 text-destructive",
      },
      {
        label: "Сэтгэгдэл",
        value: formatCompact(analytics.overview.comments.value),
        change: `${analytics.overview.comments.changePct.toFixed(1)}%`,
        changeType: analytics.overview.comments.changePct >= 0 ? "positive" : "negative",
        icon: MessageCircle,
        color: "bg-chart-2/10 text-chart-2",
      },
      {
        label: "Нийтлэл",
        value: String(analytics.overview.posts.value),
        change: `${analytics.overview.posts.changePct.toFixed(1)}%`,
        changeType: analytics.overview.posts.changePct >= 0 ? "positive" : "negative",
        icon: Users,
        color: "bg-chart-4/10 text-chart-4",
      },
    ]
  }, [analytics])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Статистик</h1>
          <p className="mt-1 text-sm text-muted-foreground">Таны нийтлэлүүдийн гүйцэтгэлийн дүн шинжилгээ</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="7d">Сүүлийн 7 хоног</option>
          <option value="30d">Сүүлийн 30 хоног</option>
          <option value="90d">Сүүлийн 90 хоног</option>
          <option value="1y">Сүүлийн 1 жил</option>
        </select>
      </div>

      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-5">
                <div className="h-16 animate-pulse rounded bg-muted" />
              </div>
            ))
          : overviewStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      stat.changeType === "positive" ? "text-chart-4" : "text-destructive"
                    )}
                  >
                    {stat.changeType === "positive" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Үзэлт ба лайкын чиг хандлага</h2>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trends || []}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="views" name="Үзэлт" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="likes" name="Лайк" stroke="hsl(var(--destructive))" strokeWidth={2} fillOpacity={1} fill="url(#colorLikes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Долоо хоногийн үзэлт</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.weekly || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="views" name="Үзэлт" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">Шилдэг нийтлэлүүд</h2>
            <Link href="/dashboard/posts" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Бүгдийг харах
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(analytics?.topPosts || []).map((post, index) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-muted/30">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{index + 1}</span>
                <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={post.image || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatCompact(post.views)}</span>
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-foreground">Төхөөрөмжийн тархалт</h2>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.deviceData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {(analytics?.deviceData || []).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "hsl(var(--primary))"
                            : index === 1
                              ? "hsl(var(--chart-2))"
                              : "hsl(var(--chart-4))"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-4">
              {(analytics?.deviceData || []).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        item.name === "Desktop"
                          ? "hsl(var(--primary))"
                          : item.name === "Mobile"
                            ? "hsl(var(--chart-2))"
                            : "hsl(var(--chart-4))",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-semibold text-foreground">Улс орноор</h2>
            <div className="space-y-3">
              {(analytics?.countryData || []).map((item) => (
                <div key={item.country}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-foreground">{item.country}</span>
                    <span className="text-muted-foreground">{item.views.toLocaleString()}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
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
