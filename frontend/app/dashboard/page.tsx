"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileText,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  PenSquare,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { getDashboardSummaryApi, type DashboardSummary } from "@/lib/api"
import { getCurrentUser } from "@/lib/auth"

const statusConfig = {
  published: {
    label: "Нийтлэгдсэн",
    color: "bg-chart-4/10 text-chart-4",
    icon: CheckCircle,
  },
  pending: {
    label: "Хүлээгдэж буй",
    color: "bg-chart-5/10 text-chart-5",
    icon: Clock,
  },
  draft: {
    label: "Ноорог",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
  },
  rejected: {
    label: "Татгалзсан",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
} as const

function formatCompact(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

function formatRelative(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "Саяхан"
  const diff = Math.max(0, Date.now() - d.getTime())
  const h = Math.floor(diff / (1000 * 60 * 60))
  if (h < 1) return "Саяхан"
  if (h < 24) return `${h} цагийн өмнө`
  const days = Math.floor(h / 24)
  return `${days} өдрийн өмнө`
}

export default function DashboardPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getDashboardSummaryApi("7d")
      .then(setSummary)
      .catch((e) => setError(e instanceof Error ? e.message : "Dashboard ачаалж чадсангүй"))
      .finally(() => setLoading(false))
  }, [])

  const currentUser = getCurrentUser()

  const stats = useMemo(() => {
    if (!summary) return []
    return [
      {
        label: "Нийт нийтлэл",
        value: summary.stats.posts.value,
        change: summary.stats.posts.change,
        changeType: summary.stats.posts.change >= 0 ? "positive" : "negative",
        icon: FileText,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Нийт үзэлт",
        value: summary.stats.views.display,
        change: `${summary.stats.views.changePct.toFixed(1)}%`,
        changeType: summary.stats.views.changePct >= 0 ? "positive" : "negative",
        icon: Eye,
        color: "bg-chart-2/10 text-chart-2",
      },
      {
        label: "Нийт лайк",
        value: summary.stats.likes.display,
        change: `${summary.stats.likes.changePct.toFixed(1)}%`,
        changeType: summary.stats.likes.changePct >= 0 ? "positive" : "negative",
        icon: Heart,
        color: "bg-destructive/10 text-destructive",
      },
      {
        label: "Сэтгэгдэл",
        value: summary.stats.comments.display,
        change: `${summary.stats.comments.changePct.toFixed(1)}%`,
        changeType: summary.stats.comments.changePct >= 0 ? "positive" : "negative",
        icon: MessageCircle,
        color: "bg-chart-4/10 text-chart-4",
      },
    ]
  }, [summary])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Сайн байна уу, {currentUser?.name || "Хэрэглэгч"}! Таны нийтлэлүүдийн тойм.
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PenSquare className="h-4 w-4" />
          Шинэ нийтлэл
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-5">
                <div className="h-16 animate-pulse rounded bg-muted" />
              </div>
            ))
          : stats.map((stat) => (
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Үзэлтийн статистик</h2>
            <span className="text-xs text-muted-foreground">Сүүлийн 7 хоног</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.viewsTrend || []}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Сүүлийн мэдэгдлүүд</h2>
          <div className="space-y-3">
            {(summary?.notifications.latest || []).map((notif) => (
              <div key={notif._id} className="rounded-lg border border-border bg-background p-3">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{formatRelative(notif.createdAt)}</p>
              </div>
            ))}
            <Link href="/dashboard/notifications" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Бүгдийг харах
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">Сүүлийн нийтлэлүүд</h2>
          <Link href="/dashboard/posts" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Бүгдийг харах
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {(summary?.recentPosts || []).map((post) => {
            const status = statusConfig[post.status]
            const StatusIcon = status.icon

            return (
              <div key={post.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="relative h-20 w-full overflow-hidden rounded-lg sm:h-14 sm:w-24">
                  <Image src={post.image || "/placeholder.jpg"} alt={post.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{post.title}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatCompact(post.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {post.likes}
                    </span>
                    <span>{formatRelative(post.date)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", status.color)}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenu === post.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg">
                        <Link href={`/dashboard/posts/${post.id}/edit`} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                          <Edit className="h-4 w-4" />
                          Засах
                        </Link>
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                          Устгах
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
