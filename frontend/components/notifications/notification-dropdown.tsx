"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  Bell,
  MessageCircle,
  Heart,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock notifications - in a real app, this would come from an API/context
const mockNotifications = [
  {
    id: 1,
    type: "comment",
    title: "Шинэ сэтгэгдэл",
    message: 'Батболд "Монголын ДНБ-ний өсөлт" нийтлэлд сэтгэгдэл бичлээ',
    time: "5 мин",
    read: false,
    link: "/post/1",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=batbold",
  },
  {
    id: 2,
    type: "like",
    title: "Лайкууд",
    message: "15 хүн таны нийтлэлд лайк дарлаа",
    time: "1 цаг",
    read: false,
    link: "/dashboard/analytics",
    avatar: null,
  },
  {
    id: 3,
    type: "approved",
    title: "Нийтлэл батлагдлаа",
    message: '"Дэлхийн худалдаа" нийтлэл нийтлэгдлээ',
    time: "2 цаг",
    read: false,
    link: "/post/2",
    avatar: null,
  },
  {
    id: 4,
    type: "follower",
    title: "Шинэ дагагч",
    message: "Ганзориг таныг дагаж эхэллээ",
    time: "3 цаг",
    read: true,
    link: "/user/ganzorig",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
  },
]

const typeConfig = {
  comment: { icon: MessageCircle, color: "bg-chart-2/10 text-chart-2" },
  like: { icon: Heart, color: "bg-destructive/10 text-destructive" },
  follower: { icon: UserPlus, color: "bg-chart-4/10 text-chart-4" },
  approved: { icon: CheckCircle, color: "bg-chart-4/10 text-chart-4" },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive" },
  system: { icon: AlertCircle, color: "bg-chart-5/10 text-chart-5" },
}

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">Мэдэгдлүүд</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Бүгдийг унших
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Мэдэгдэл байхгүй
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.slice(0, 5).map((notif) => {
                  const config =
                    typeConfig[notif.type as keyof typeof typeConfig]
                  const Icon = config.icon

                  return (
                    <Link
                      key={notif.id}
                      href={notif.link}
                      onClick={() => {
                        markAsRead(notif.id)
                        setIsOpen(false)
                      }}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                        !notif.read && "bg-primary/5"
                      )}
                    >
                      {/* Icon or Avatar */}
                      {notif.avatar ? (
                        <img
                          src={notif.avatar}
                          alt=""
                          className="h-9 w-9 flex-shrink-0 rounded-full bg-muted"
                        />
                      ) : (
                        <div
                          className={cn(
                            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                            config.color
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {notif.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {notif.message}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {notif.time}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notif.read && (
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-2">
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Бүх мэдэгдлийг харах
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
