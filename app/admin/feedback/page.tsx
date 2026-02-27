"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Mail,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Calendar,
  Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock feedback data
const mockFeedback = [
  {
    id: "1",
    name: "Б. Төгсбаатар",
    email: "togsbayar@example.com",
    subject: "Сайтын гүйцэтгэлийн талаар",
    message:
      "Сайн байна уу? Сайтын хурд маш сайн байна. Гэхдээ мобайл хувилбар дээр зарим зураг ачаалалт удаан байна. Энийг сайжруулах боломжтой юу?",
    type: "suggestion",
    status: "new",
    createdAt: "2025-02-26T10:30:00",
  },
  {
    id: "2",
    name: "О. Нямдорж",
    email: "nyamdorj@example.com",
    subject: "Нийтлэгч болох хүсэлт",
    message:
      "Сайн байна уу? Би эдийн засгийн чиглэлээр нийтлэл бичихийг хүсч байна. Надад боломж олгоно уу.",
    type: "publisher_request",
    status: "pending",
    createdAt: "2025-02-25T14:20:00",
  },
  {
    id: "3",
    name: "Д. Энхбаяр",
    email: "enkhbayar@example.com",
    subject: "Техникийн алдаа",
    message:
      "Мэдээний хуудас дээр сэтгэгдэл бичих товч ажиллахгүй байна. Safari browser дээр шалгаад үзээрэй.",
    type: "bug",
    status: "in_progress",
    createdAt: "2025-02-24T09:15:00",
  },
  {
    id: "4",
    name: "Ж. Батжаргал",
    email: "batjargal@example.com",
    subject: "Баярлалаа!",
    message:
      "Датанэвс-ийн мэдээллүүд маш чанартай байна. Баярлалаа! Цаашид ч амжилт хүсье.",
    type: "feedback",
    status: "resolved",
    createdAt: "2025-02-23T16:45:00",
  },
  {
    id: "5",
    name: "С. Оюунтуяа",
    email: "oyuntuya@example.com",
    subject: "Нийтлэлийн санал",
    message:
      "Уур амьсгалын өөрчлөлтийн талаар илүү их инфографик мэдээлэл оруулаач. Энэ сэдвээр олон хүн сонирхож байна.",
    type: "suggestion",
    status: "new",
    createdAt: "2025-02-22T11:00:00",
  },
]

const typeLabels: Record<string, string> = {
  suggestion: "Санал",
  bug: "Алдаа",
  feedback: "Сэтгэгдэл",
  publisher_request: "Нийтлэгч хүсэлт",
  other: "Бусад",
}

const typeColors: Record<string, string> = {
  suggestion: "bg-chart-2/10 text-chart-2",
  bug: "bg-destructive/10 text-destructive",
  feedback: "bg-chart-4/10 text-chart-4",
  publisher_request: "bg-primary/10 text-primary",
  other: "bg-muted text-muted-foreground",
}

const statusLabels: Record<string, string> = {
  new: "Шинэ",
  pending: "Хүлээгдэж буй",
  in_progress: "Шийдвэрлэж буй",
  resolved: "Шийдсэн",
}

const statusColors: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  pending: "bg-chart-5/10 text-chart-5",
  in_progress: "bg-chart-2/10 text-chart-2",
  resolved: "bg-chart-4/10 text-chart-4",
}

const statusIcons: Record<string, React.ElementType> = {
  new: AlertCircle,
  pending: Clock,
  in_progress: MessageSquare,
  resolved: CheckCircle,
}

export default function AdminFeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<typeof mockFeedback[0] | null>(null)

  const filteredFeedback = mockFeedback.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Санал хүсэлт</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {mockFeedback.length} санал хүсэлт
            </p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            {
              label: "Шинэ",
              value: mockFeedback.filter((f) => f.status === "new").length,
              color: "text-primary",
              icon: AlertCircle,
            },
            {
              label: "Хүлээгдэж буй",
              value: mockFeedback.filter((f) => f.status === "pending").length,
              color: "text-chart-5",
              icon: Clock,
            },
            {
              label: "Шийдвэрлэж буй",
              value: mockFeedback.filter((f) => f.status === "in_progress")
                .length,
              color: "text-chart-2",
              icon: MessageSquare,
            },
            {
              label: "Шийдсэн",
              value: mockFeedback.filter((f) => f.status === "resolved").length,
              color: "text-chart-4",
              icon: CheckCircle,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className={cn("text-2xl font-bold", stat.color)}>
                  {stat.value}
                </p>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
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
              placeholder="Хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">Бүх төрөл</option>
              <option value="suggestion">Санал</option>
              <option value="bug">Алдаа</option>
              <option value="feedback">Сэтгэгдэл</option>
              <option value="publisher_request">Нийтлэгч хүсэлт</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">Бүх төлөв</option>
              <option value="new">Шинэ</option>
              <option value="pending">Хүлээгдэж буй</option>
              <option value="in_progress">Шийдвэрлэж буй</option>
              <option value="resolved">Шийдсэн</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {filteredFeedback.map((item) => {
              const StatusIcon = statusIcons[item.status]
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFeedback(item)}
                  className={cn(
                    "cursor-pointer p-4 transition-colors hover:bg-secondary/30",
                    item.status === "new" && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">
                          {item.subject}
                        </h3>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            typeColors[item.type]
                          )}
                        >
                          {typeLabels[item.type]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.message}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {item.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColors[item.status]
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusLabels[item.status]}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              1-{filteredFeedback.length} / {mockFeedback.length}
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

      {/* Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    typeColors[selectedFeedback.type]
                  )}
                >
                  {typeLabels[selectedFeedback.type]}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                    statusColors[selectedFeedback.status]
                  )}
                >
                  {statusLabels[selectedFeedback.status]}
                </span>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="text-lg font-bold text-foreground">
                {selectedFeedback.subject}
              </h2>

              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {selectedFeedback.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {selectedFeedback.email}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                <Calendar className="mr-1.5 inline-block h-4 w-4" />
                {formatDate(selectedFeedback.createdAt)}
              </p>

              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedFeedback.message}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Төлөв өөрчлөх
                </label>
                <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option value="new">Шинэ</option>
                  <option value="pending">Хүлээгдэж буй</option>
                  <option value="in_progress">Шийдвэрлэж буй</option>
                  <option value="resolved">Шийдсэн</option>
                </select>
              </div>

              {/* Reply */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Хариу илгээх
                </label>
                <textarea
                  rows={3}
                  placeholder="Хариу бичих..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border p-4">
              <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
                Устгах
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Хаах
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                  Хариу илгээх
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
