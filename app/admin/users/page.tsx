"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Б. Болормаа",
    email: "bolormaa@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    role: "publisher",
    status: "active",
    posts: 45,
    joinedAt: "2024-01-15",
    lastActive: "2 цагийн өмнө",
  },
  {
    id: "2",
    name: "Д. Ганзориг",
    email: "ganzorig@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    role: "publisher",
    status: "active",
    posts: 32,
    joinedAt: "2024-02-20",
    lastActive: "5 цагийн өмнө",
  },
  {
    id: "3",
    name: "Э. Тэмүүлэн",
    email: "temuulen@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    role: "publisher",
    status: "active",
    posts: 28,
    joinedAt: "2024-03-10",
    lastActive: "1 өдрийн өмнө",
  },
  {
    id: "4",
    name: "Ц. Сарантуяа",
    email: "sarantuya@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    role: "editor",
    status: "active",
    posts: 15,
    joinedAt: "2024-04-05",
    lastActive: "3 цагийн өмнө",
  },
  {
    id: "5",
    name: "О. Батбаяр",
    email: "batbayar@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=batbayar",
    role: "user",
    status: "active",
    posts: 0,
    joinedAt: "2024-05-12",
    lastActive: "1 долоо хоногийн өмнө",
  },
  {
    id: "6",
    name: "М. Оюунчимэг",
    email: "oyunchimeg@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=oyunchimeg",
    role: "user",
    status: "pending",
    posts: 0,
    joinedAt: "2025-02-25",
    lastActive: "Шинэ",
  },
  {
    id: "7",
    name: "Н. Эрдэнэбат",
    email: "erdenebat@example.com",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=erdenebat",
    role: "user",
    status: "suspended",
    posts: 0,
    joinedAt: "2024-06-18",
    lastActive: "30 өдрийн өмнө",
  },
]

const roleLabels: Record<string, string> = {
  admin: "Админ",
  editor: "Редактор",
  publisher: "Нийтлэгч",
  user: "Хэрэглэгч",
}

const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  editor: "bg-chart-5/10 text-chart-5",
  publisher: "bg-primary/10 text-primary",
  user: "bg-muted text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  active: "Идэвхтэй",
  pending: "Хүлээгдэж буй",
  suspended: "Түдгэлзүүлсэн",
}

const statusColors: Record<string, string> = {
  active: "bg-chart-4/10 text-chart-4",
  pending: "bg-chart-5/10 text-chart-5",
  suspended: "bg-destructive/10 text-destructive",
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Хэрэглэгчид</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {mockUsers.length} хэрэглэгч
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Хэрэглэгч нэмэх
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Нийт хэрэглэгч", value: "8,562", color: "text-foreground" },
            { label: "Нийтлэгч", value: "156", color: "text-primary" },
            { label: "Хүлээгдэж буй", value: "23", color: "text-chart-5" },
            { label: "Түдгэлзүүлсэн", value: "12", color: "text-destructive" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className={cn("text-2xl font-bold", stat.color)}>
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
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

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Эрх
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Бүгд</option>
                <option value="admin">Админ</option>
                <option value="editor">Редактор</option>
                <option value="publisher">Нийтлэгч</option>
                <option value="user">Хэрэглэгч</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Төлөв
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">Бүгд</option>
                <option value="active">Идэвхтэй</option>
                <option value="pending">Хүлээгдэж буй</option>
                <option value="suspended">Түдгэлзүүлсэн</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Хэрэглэгч
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Эрх
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Төлөв
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Нийтлэл
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Сүүлд идэвхтэй
                  </th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          roleColors[user.role]
                        )}
                      >
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColors[user.status]
                        )}
                      >
                        {statusLabels[user.status]}
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
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative group">
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-full z-10 mt-1 hidden w-44 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:block">
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Edit className="h-4 w-4" />
                            Засах
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Mail className="h-4 w-4" />
                            Имэйл илгээх
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Shield className="h-4 w-4" />
                            Эрх өөрчлөх
                          </button>
                          <div className="my-1 h-px bg-border" />
                          {user.status === "active" ? (
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                              <UserX className="h-4 w-4" />
                              Түдгэлзүүлэх
                            </button>
                          ) : (
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-chart-4 hover:bg-chart-4/10">
                              <UserCheck className="h-4 w-4" />
                              Идэвхжүүлэх
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              1-{filteredUsers.length} / {mockUsers.length} хэрэглэгч
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
