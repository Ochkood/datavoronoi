"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Clock,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminUsers, type AdminUser, updateUserApi } from "@/lib/api"

const roleLabels: Record<AdminUser["role"], string> = {
  admin: "Админ",
  publisher: "Нийтлэгч",
  user: "Хэрэглэгч",
}

const roleColors: Record<AdminUser["role"], string> = {
  admin: "bg-destructive/10 text-destructive",
  publisher: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
}

function formatDate(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("mn-MN")
}

function relativeTime(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return "-"
  const now = Date.now()
  const diff = Math.max(0, now - d.getTime())
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return "Саяхан"
  if (hours < 24) return `${hours} цагийн өмнө`
  const days = Math.floor(hours / 24)
  return `${days} өдрийн өмнө`
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [items, setItems] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadUsers() {
    try {
      setLoading(true)
      setError("")
      const users = await getAdminUsers()
      setItems(users)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хэрэглэгч ачаалж чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return items.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const userStatus = user.isActive ? "active" : "suspended"
      const matchesStatus = statusFilter === "all" || userStatus === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [items, searchQuery, roleFilter, statusFilter])

  async function changeRole(userId: string, role: AdminUser["role"]) {
    try {
      setError("")
      await updateUserApi(userId, { role })
      await loadUsers()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Эрх өөрчлөх үед алдаа гарлаа")
    }
  }

  async function toggleSuspend(userId: string, isActive: boolean) {
    try {
      setError("")
      await updateUserApi(userId, { isActive })
      await loadUsers()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Төлөв өөрчлөх үед алдаа гарлаа")
    }
  }

  const stats = {
    total: items.length,
    publishers: items.filter((u) => u.role === "publisher").length,
    active: items.filter((u) => u.isActive).length,
    suspended: items.filter((u) => !u.isActive).length,
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Хэрэглэгчид</h1>
            <p className="text-sm text-muted-foreground">Нийт {items.length} хэрэглэгч</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">Нийт хэрэглэгч</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-primary">{stats.publishers}</p>
            <p className="mt-1 text-sm text-muted-foreground">Нийтлэгч</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-chart-4">{stats.active}</p>
            <p className="mt-1 text-sm text-muted-foreground">Идэвхтэй</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold text-destructive">{stats.suspended}</p>
            <p className="mt-1 text-sm text-muted-foreground">Түдгэлзүүлсэн</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Нэр эсвэл имэйл хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
              showFilters
                ? "border-primary bg-primary/5 text-primary"
                : "border-input bg-background text-foreground hover:bg-secondary"
            )}
          >
            <Filter className="h-4 w-4" />
            Шүүлтүүр
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Эрх</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Бүгд</option>
                <option value="admin">Админ</option>
                <option value="publisher">Нийтлэгч</option>
                <option value="user">Хэрэглэгч</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Төлөв</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Бүгд</option>
                <option value="active">Идэвхтэй</option>
                <option value="suspended">Түдгэлзүүлсэн</option>
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Хэрэглэгч</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Эрх</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Төлөв</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Нийтлэл</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Сүүлд идэвхтэй</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td className="p-4 text-sm text-muted-foreground" colSpan={6}>
                      Ачаалж байна...
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-secondary/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full">
                            <Image
                              src={user.avatar || "https://api.dicebear.com/9.x/notionists/svg?seed=user"}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">Элссэн: {formatDate(user.joinedAt)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", roleColors[user.role])}>
                          {roleLabels[user.role]}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            user.isActive ? "bg-chart-4/10 text-chart-4" : "bg-destructive/10 text-destructive"
                          )}
                        >
                          {user.isActive ? "Идэвхтэй" : "Түдгэлзүүлсэн"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          {user.posts}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {relativeTime(user.lastActive)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="group relative">
                          <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 top-full z-10 mt-1 hidden w-44 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:block">
                            <button
                              onClick={() => changeRole(user.id, "user")}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                            >
                              <Shield className="h-4 w-4" />
                              Хэрэглэгч болгох
                            </button>
                            <button
                              onClick={() => changeRole(user.id, "publisher")}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                            >
                              <Shield className="h-4 w-4" />
                              Нийтлэгч болгох
                            </button>
                            <button
                              onClick={() => changeRole(user.id, "admin")}
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                            >
                              <Shield className="h-4 w-4" />
                              Админ болгох
                            </button>
                            <div className="my-1 h-px bg-border" />
                            {user.isActive ? (
                              <button
                                onClick={() => toggleSuspend(user.id, false)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                              >
                                <UserX className="h-4 w-4" />
                                Түдгэлзүүлэх
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleSuspend(user.id, true)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-chart-4 hover:bg-chart-4/10"
                              >
                                <UserCheck className="h-4 w-4" />
                                Идэвхжүүлэх
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              1-{filteredUsers.length} / {items.length} хэрэглэгч
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
