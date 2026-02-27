"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  BarChart3,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Eye,
  Clock,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuth, getCurrentUser } from "@/lib/auth"
import { getDashboardSummaryApi, getMyProfileApi } from "@/lib/api"

const mainNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Миний нийтлэлүүд", icon: FileText, href: "/dashboard/posts" },
  { label: "Шинэ нийтлэл", icon: PenSquare, href: "/dashboard/posts/new" },
  { label: "Статистик", icon: BarChart3, href: "/dashboard/analytics" },
]

const secondaryNavItems = [
  { label: "Мэдэгдэл", icon: Bell, href: "/dashboard/notifications" },
  { label: "Профайл", icon: User, href: "/dashboard/profile" },
  { label: "Тохиргоо", icon: Settings, href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [statusStats, setStatusStats] = useState({
    published: 0,
    pending: 0,
    draft: 0,
  })
  const [profile, setProfile] = useState({
    name: "Хэрэглэгч",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=user",
    role: "Хэрэглэгч",
  })

  useEffect(() => {
    const local = getCurrentUser()
    if (local) {
      setProfile({
        name: local.name || "Хэрэглэгч",
        avatar:
          local.avatar || "https://api.dicebear.com/9.x/notionists/svg?seed=user",
        role:
          local.role === "admin"
            ? "Админ"
            : local.role === "publisher"
              ? "Нийтлэгч"
              : "Хэрэглэгч",
      })
    }

    Promise.all([getMyProfileApi(), getDashboardSummaryApi("7d")])
      .then(([me, summary]) => {
        setProfile({
          name: me.profile.name || "Хэрэглэгч",
          avatar:
            me.profile.avatar ||
            "https://api.dicebear.com/9.x/notionists/svg?seed=user",
          role:
            me.profile.role === "admin"
              ? "Админ"
              : me.profile.role === "publisher"
                ? "Нийтлэгч"
                : "Хэрэглэгч",
        })
        setStatusStats({
          published: summary.stats.status.published || 0,
          pending: summary.stats.status.pending || 0,
          draft: summary.stats.status.draft || 0,
        })
        setUnreadCount(summary.notifications.unreadCount || 0)
      })
      .catch(() => {
        // Keep local fallback state if API call fails.
      })
  }, [pathname])

  const quickStats = useMemo(
    () => [
      {
        label: "Нийтлэгдсэн",
        value: statusStats.published,
        icon: CheckCircle,
        color: "text-chart-4",
      },
      {
        label: "Хүлээгдэж буй",
        value: statusStats.pending,
        icon: Clock,
        color: "text-chart-5",
      },
      {
        label: "Ноорог",
        value: statusStats.draft,
        icon: FileText,
        color: "text-muted-foreground",
      },
    ],
    [statusStats]
  )

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <PenSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">
              Publisher
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <PenSquare className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="border-b border-border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Товч мэдээлэл
          </p>
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-lg bg-secondary/50 px-2 py-2"
              >
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="mt-1 text-lg font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-border" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && item.label}
                {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                  <span
                    className={cn(
                      "flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground",
                      collapsed
                        ? "absolute -right-1 -top-1"
                        : "ml-auto"
                    )}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Back to Site */}
      {!collapsed && (
        <div className="border-t border-border p-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            <Eye className="h-4 w-4" />
            Сайт руу буцах
          </Link>
        </div>
      )}

      {/* User Profile */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-2",
            collapsed && "justify-center"
          )}
        >
          <img
            src={profile.avatar}
            alt={profile.name}
            className="h-9 w-9 flex-shrink-0 rounded-full bg-muted"
          />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                {profile.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.role}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => {
                clearAuth()
                router.push("/login")
              }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Гарах"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
