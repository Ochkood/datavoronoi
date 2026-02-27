"use client"

import { useState } from "react"
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
  Calendar,
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

// Simulated data
const stats = [
  {
    label: "Нийт нийтлэл",
    value: 19,
    change: "+3",
    changeType: "positive",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Нийт үзэлт",
    value: "45.2K",
    change: "+12%",
    changeType: "positive",
    icon: Eye,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    label: "Нийт лайк",
    value: "1,892",
    change: "+8%",
    changeType: "positive",
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
  },
  {
    label: "Сэтгэгдэл",
    value: 234,
    change: "-2%",
    changeType: "negative",
    icon: MessageCircle,
    color: "bg-chart-4/10 text-chart-4",
  },
]

const recentPosts = [
  {
    id: "1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
    status: "published",
    views: "12.4K",
    likes: 234,
    comments: 45,
    date: "2 цагийн өмнө",
    image: "/images/infographic-1.jpg",
  },
  {
    id: "2",
    title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
    status: "published",
    views: "4.8K",
    likes: 89,
    comments: 9,
    date: "2 өдрийн өмнө",
    image: "/images/infographic-8.jpg",
  },
  {
    id: "3",
    title: "2025 оны эдийн засгийн таамаглал",
    status: "pending",
    views: "-",
    likes: 0,
    comments: 0,
    date: "3 өдрийн өмнө",
    image: "/images/infographic-4.jpg",
  },
  {
    id: "4",
    title: "Инфляцийн нөлөө: Өрхийн орлогын шинжилгээ",
    status: "draft",
    views: "-",
    likes: 0,
    comments: 0,
    date: "5 өдрийн өмнө",
    image: "/images/infographic-6.jpg",
  },
]

const viewsData = [
  { name: "7 хоног", views: 1200 },
  { name: "14 хоног", views: 1800 },
  { name: "21 хоног", views: 2400 },
  { name: "28 хоног", views: 2100 },
  { name: "35 хоног", views: 3200 },
  { name: "42 хоног", views: 2800 },
  { name: "Өнөөдөр", views: 3500 },
]

const notifications = [
  {
    id: 1,
    type: "comment",
    message: "Таны нийтлэлд шинэ сэтгэгдэл ирлээ",
    time: "5 минутын өмнө",
    read: false,
  },
  {
    id: 2,
    type: "like",
    message: "15 хүн таны нийтлэлд лайк дарлаа",
    time: "1 цагийн өмнө",
    read: false,
  },
  {
    id: 3,
    type: "approved",
    message: "Таны нийтлэл батлагдлаа",
    time: "2 цагийн өмнө",
    read: true,
  },
]

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
}

export default function DashboardPage() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Сайн байна уу, Болормаа! Таны нийтлэлүүдийн тойм.
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

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Views Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Үзэлтийн статистик
            </h2>
            <select className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Сүүлийн 7 хоног</option>
              <option>Сүүлийн 30 хоног</option>
              <option>Сүүлийн 90 хоног</option>
            </select>
          </div>
          <div className="h-[280px]">
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
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Мэдэгдлүүд
            </h2>
            <Link
              href="/dashboard/notifications"
              className="text-xs font-medium text-primary hover:underline"
            >
              Бүгдийг харах
            </Link>
          </div>
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 transition-colors",
                  notif.read ? "bg-background" : "bg-primary/5"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 h-2 w-2 flex-shrink-0 rounded-full",
                    notif.read ? "bg-muted" : "bg-primary"
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{notif.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notif.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Сүүлийн нийтлэлүүд
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
          {recentPosts.map((post) => {
            const status = statusConfig[post.status as keyof typeof statusConfig]
            return (
              <div
                key={post.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate text-sm font-medium text-foreground">
                    {post.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    {post.status === "published" && (
                      <>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={cn(
                    "hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                    status.color
                  )}
                >
                  <status.icon className="h-3 w-3" />
                  {status.label}
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === post.id ? null : post.id)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {openMenu === post.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-36 rounded-lg border border-border bg-card py-1 shadow-lg">
                      <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Edit className="h-4 w-4" />
                        Засах
                      </Link>
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted">
                        <Trash2 className="h-4 w-4" />
                        Устгах
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
