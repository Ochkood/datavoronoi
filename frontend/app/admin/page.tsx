"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileText,
  Users,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
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

// Stats data
const statsCards = [
  {
    label: "Нийт мэдээ",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: FileText,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Нийт хэрэглэгч",
    value: "8,562",
    change: "+23%",
    changeType: "positive",
    icon: Users,
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    label: "Өнөөдрийн үзэлт",
    value: "45.2K",
    change: "+8%",
    changeType: "positive",
    icon: Eye,
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    label: "Engagement rate",
    value: "4.5%",
    change: "-2%",
    changeType: "negative",
    icon: TrendingUp,
    color: "bg-chart-5/10 text-chart-5",
  },
]

// Chart data
const viewsData = [
  { name: "1-р сар", views: 12400 },
  { name: "2-р сар", views: 15600 },
  { name: "3-р сар", views: 14200 },
  { name: "4-р сар", views: 18900 },
  { name: "5-р сар", views: 21300 },
  { name: "6-р сар", views: 19800 },
  { name: "7-р сар", views: 24500 },
]

const categoryData = [
  { name: "Эдийн засаг", posts: 145 },
  { name: "Технологи", posts: 98 },
  { name: "Байгаль орчин", posts: 76 },
  { name: "Эрүүл мэнд", posts: 54 },
  { name: "Санхүү", posts: 89 },
  { name: "Дэлхий", posts: 67 },
]

// Recent posts
const recentPosts = [
  {
    id: "1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жил",
    author: "Б. Болормаа",
    category: "Эдийн засаг",
    status: "published",
    views: "12.4K",
    date: "2 цагийн өмнө",
  },
  {
    id: "2",
    title: "AI технологийн хувьсгал",
    author: "Э. Тэмүүлэн",
    category: "Технологи",
    status: "published",
    views: "8.2K",
    date: "5 цагийн өмнө",
  },
  {
    id: "3",
    title: "Уур амьсгалын өөрчлөлт",
    author: "Д. Ганзориг",
    category: "Байгаль орчин",
    status: "draft",
    views: "-",
    date: "1 өдрийн өмнө",
  },
  {
    id: "4",
    title: "Крипто зах зээлийн тойм",
    author: "Ц. Сарантуяа",
    category: "Санхүү",
    status: "review",
    views: "-",
    date: "1 өдрийн өмнө",
  },
]

// Recent activities
const recentActivities = [
  {
    id: "1",
    type: "post",
    message: "Б. Болормаа шинэ мэдээ нийтэллээ",
    time: "5 минутын өмнө",
    icon: FileText,
  },
  {
    id: "2",
    type: "user",
    message: "Шинэ хэрэглэгч бүртгүүллээ",
    time: "15 минутын өмнө",
    icon: UserPlus,
  },
  {
    id: "3",
    type: "comment",
    message: "Шинэ сэтгэгдэл ирлээ",
    time: "30 минутын өмнө",
    icon: MessageSquare,
  },
  {
    id: "4",
    type: "notification",
    message: "Нийтлэгч болох хүсэлт ирлээ",
    time: "1 цагийн өмнө",
    icon: Bell,
  },
]

const statusColors: Record<string, string> = {
  published: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
  review: "bg-chart-5/10 text-chart-5",
}

const statusLabels: Record<string, string> = {
  published: "Нийтэлсэн",
  draft: "Ноорог",
  review: "Хянагдаж буй",
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState("week")

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Сайтын ерөнхий статистик
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
              {["week", "month", "year"].map((p) => (
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
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <FileText className="h-4 w-4" />
              Шинэ мэдээ
            </button>
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
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-chart-4"
                      : "text-destructive"
                  }`}
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

        {/* Charts */}
        <div className="mb-6 grid gap-6 lg:grid-cols-2">
          {/* Views Chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Үзэлтийн тоо</h3>
                <p className="text-sm text-muted-foreground">
                  Сүүлийн 7 сарын статистик
                </p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="views"
                    stroke="oklch(0.55 0.18 230)"
                    strokeWidth={2}
                    fill="url(#colorViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  Ангилалын тархалт
                </h3>
                <p className="text-sm text-muted-foreground">
                  Нийтлэлийн тоо ангилалаар
                </p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
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
                  <Bar
                    dataKey="posts"
                    fill="oklch(0.65 0.15 175)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Posts */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h3 className="font-semibold text-foreground">Сүүлийн мэдээ</h3>
                <p className="text-sm text-muted-foreground">
                  Сүүлд нэмэгдсэн болон шинэчлэгдсэн
                </p>
              </div>
              <Link
                href="/admin/posts"
                className="text-sm font-medium text-primary hover:underline"
              >
                Бүгдийг харах
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground line-clamp-1">
                      {post.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{post.category}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[post.status]
                      }`}
                    >
                      {statusLabels[post.status]}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h3 className="font-semibold text-foreground">Сүүлийн үйлдлүүд</h3>
              <p className="text-sm text-muted-foreground">
                Системийн сүүлийн үйл ажиллагаа
              </p>
            </div>
            <div className="divide-y divide-border">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary">
                    <activity.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <button className="w-full rounded-lg bg-secondary py-2 text-sm font-medium text-foreground hover:bg-secondary/80">
                Бүгдийг харах
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
