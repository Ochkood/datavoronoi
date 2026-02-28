"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  CheckCheck,
  MessageCircle,
  Heart,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuth, getCurrentUser, getAccessToken, type AuthUser } from "@/lib/auth"
import {
  getMeApi,
  getNotificationsApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
  type BackendNotification,
} from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const tabs = [
  { id: "latest", label: "Шинэ" },
  { id: "popular", label: "Эрэлттэй" },
  { id: "editor", label: "Сонголт" },
]

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

interface ContentHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function ContentHeader({ activeTab, onTabChange }: ContentHeaderProps) {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [notifications, setNotifications] = useState<BackendNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const localUser = getCurrentUser()
    setUser(localUser)

    if (!getAccessToken()) return

    getMeApi()
      .then((me) => setUser(me))
      .catch(() => {
        setUser(localUser)
      })
  }, [])

  useEffect(() => {
    if (!getAccessToken()) return
    if (!(user?.role === "publisher" || user?.role === "admin")) return

    getNotificationsApi("all")
      .then((data) => {
        setNotifications(data.items.slice(0, 6))
        setUnreadCount(data.unreadCount)
      })
      .catch(() => {
        setNotifications([])
        setUnreadCount(0)
      })
  }, [user?.role])

  const canShowNotification = user?.role === "publisher" || user?.role === "admin"
  const avatarUrl = user?.avatar || "https://api.dicebear.com/9.x/notionists/svg?seed=user"
  const userInitial = useMemo(() => (user?.name || "U").slice(0, 1).toUpperCase(), [user?.name])

  const markAsRead = async (id: string) => {
    await markNotificationReadApi(id)
    const data = await getNotificationsApi("all")
    setNotifications(data.items.slice(0, 6))
    setUnreadCount(data.unreadCount)
  }

  const markAllAsRead = async () => {
    await markAllNotificationsReadApi()
    const data = await getNotificationsApi("all")
    setNotifications(data.items.slice(0, 6))
    setUnreadCount(data.unreadCount)
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 pl-14 md:px-6 lg:pl-6">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Хайх..."
                className="w-40 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground md:w-60"
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          )}

          {canShowNotification && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <p className="text-sm font-semibold">Мэдэгдлүүд</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => void markAllAsRead()}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Бүгдийг унших
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto p-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Мэдэгдэл байхгүй
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const config = typeConfig[notif.type] || typeConfig.system
                      const Icon = config.icon
                      return (
                        <button
                          key={notif._id}
                          onClick={() => {
                            if (!notif.read) {
                              void markAsRead(notif._id)
                            }
                            router.push(notif.link || "/dashboard/notifications")
                          }}
                          className={cn(
                            "w-full rounded-md px-2 py-2 text-left hover:bg-secondary/70",
                            !notif.read && "bg-primary/5"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {notif.actor?.avatar ? (
                              <Image
                                src={notif.actor.avatar}
                                alt=""
                                width={28}
                                height={28}
                                className="mt-0.5 h-7 w-7 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full",
                                  config.color
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{notif.title}</p>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {notif.message}
                              </p>
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                {relativeTime(notif.createdAt)}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
                <div className="border-t border-border p-1">
                  <button
                    onClick={() => router.push("/dashboard/notifications")}
                    className="w-full rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                  >
                    Бүгдийг харах
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                  aria-label="Guest menu"
                >
                  <User className="h-[18px] w-[18px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Тавтай морил</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/login")}>
                  <User className="h-4 w-4" />
                  Нэвтрэх
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/register")}>
                  <User className="h-4 w-4" />
                  Бүртгүүлэх
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/become-publisher")}>
                  <LayoutDashboard className="h-4 w-4" />
                  Нийтлэгч болох
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                  aria-label="Profile menu"
                >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={user.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">{userInitial}</span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(user.role === "publisher" || user.role === "admin") && (
                  <DropdownMenuItem onSelect={() => router.push("/dashboard")}>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                )}
                {(user.role === "publisher" || user.role === "admin") && (
                  <DropdownMenuItem onSelect={() => router.push("/dashboard/notifications")}>
                    <Bell className="h-4 w-4" />
                    Мэдэгдэл
                  </DropdownMenuItem>
                )}
                {(user.role === "publisher" || user.role === "admin") && (
                  <DropdownMenuItem onSelect={() => router.push("/dashboard/profile")}>
                    <User className="h-4 w-4" />
                    Профайл
                  </DropdownMenuItem>
                )}
                {(user.role === "publisher" || user.role === "admin") && (
                  <DropdownMenuItem onSelect={() => router.push("/dashboard/settings")}>
                    <Settings className="h-4 w-4" />
                    Тохиргоо
                  </DropdownMenuItem>
                )}
                {user.role === "admin" && (
                  <DropdownMenuItem onSelect={() => router.push("/admin")}>
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} variant="destructive">
                  <LogOut className="h-4 w-4" />
                  Гарах
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
