"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  MessageCircle,
  Heart,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  CheckCheck,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  deleteNotificationApi,
  deleteReadNotificationsApi,
  getNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  type BackendNotification,
} from "@/lib/api"

const typeConfig = {
  comment: {
    icon: MessageCircle,
    color: "bg-chart-2/10 text-chart-2",
  },
  like: {
    icon: Heart,
    color: "bg-destructive/10 text-destructive",
  },
  approved: {
    icon: CheckCircle,
    color: "bg-chart-4/10 text-chart-4",
  },
  rejected: {
    icon: XCircle,
    color: "bg-destructive/10 text-destructive",
  },
  system: {
    icon: AlertCircle,
    color: "bg-chart-5/10 text-chart-5",
  },
}

const filters = [
  { id: "all", label: "Бүгд" },
  { id: "unread", label: "Уншаагүй" },
  { id: "comment", label: "Сэтгэгдэл" },
  { id: "like", label: "Лайк" },
  { id: "system", label: "Систем" },
] as const

function relativeTime(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "Саяхан"
  const diff = Math.max(0, Date.now() - d.getTime())
  const h = Math.floor(diff / (1000 * 60 * 60))
  if (h < 1) return "Саяхан"
  if (h < 24) return `${h} цагийн өмнө`
  const day = Math.floor(h / 24)
  return `${day} өдрийн өмнө`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<BackendNotification[]>([])
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]["id"]>("all")
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load(filter: (typeof filters)[number]["id"]) {
    try {
      setLoading(true)
      setError("")
      const data = await getNotificationsApi(filter)
      setNotifications(data.items)
      setUnreadCount(data.unreadCount)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Мэдэгдэл ачаалж чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(activeFilter)
  }, [activeFilter])

  const hasRead = useMemo(() => notifications.some((n) => n.read), [notifications])

  const markAsRead = async (id: string) => {
    await markNotificationReadApi(id)
    await load(activeFilter)
  }

  const markAllAsRead = async () => {
    await markAllNotificationsReadApi()
    await load(activeFilter)
  }

  const deleteNotification = async (id: string) => {
    await deleteNotificationApi(id)
    await load(activeFilter)
  }

  const deleteAllRead = async () => {
    await deleteReadNotificationsApi()
    await load(activeFilter)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Мэдэгдлүүд</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} уншаагүй мэдэгдэл байна` : "Шинэ мэдэгдэл байхгүй"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Бүгдийг унших
          </button>
          <Link href="/dashboard/settings" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              activeFilter === filter.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {filter.label}
          </button>
        ))}
        {hasRead && (
          <button
            onClick={deleteAllRead}
            className="ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Уншсанг устгах
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Ачаалж байна...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">Мэдэгдэл байхгүй</p>
            <p className="mt-1 text-sm text-muted-foreground">Таны мэдэгдлүүд энд харагдана</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.system
              const Icon = config.icon

              return (
                <div key={notif._id} className={cn("flex items-start gap-4 p-4 transition-colors", !notif.read && "bg-primary/5")}>
                  {notif.actor?.avatar ? (
                    <img src={notif.actor.avatar} alt="" className="h-10 w-10 flex-shrink-0 rounded-full bg-muted" />
                  ) : (
                    <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full", config.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{notif.title}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{notif.message}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{relativeTime(notif.createdAt)}</p>
                      </div>
                      {!notif.read && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Link href={notif.link || "/dashboard/notifications"} onClick={() => markAsRead(notif._id)} className="text-xs font-medium text-primary hover:underline">
                        Харах
                      </Link>
                      {!notif.read && (
                        <button onClick={() => markAsRead(notif._id)} className="text-xs text-muted-foreground hover:text-foreground">
                          Уншсан гэж тэмдэглэх
                        </button>
                      )}
                      <button onClick={() => deleteNotification(notif._id)} className="text-xs text-muted-foreground hover:text-destructive">
                        Устгах
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Мэдэгдлийн тохиргоо</h3>
            <p className="mt-1 text-sm text-muted-foreground">Имэйл мэдэгдэл болон бусад тохиргоог settings хуудсаас удирдана.</p>
            <Link href="/dashboard/settings" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Тохиргоо руу очих
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
