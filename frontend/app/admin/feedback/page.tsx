"use client"

import { useEffect, useMemo, useState } from "react"
import type { ElementType } from "react"
import {
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  Send,
  User,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  deleteFeedbackApi,
  getAdminFeedbackApi,
  type AdminFeedbackItem,
  type FeedbackStatus,
  type FeedbackType,
  updateFeedbackApi,
} from "@/lib/api"
import { toast } from "sonner"

const typeLabels: Record<FeedbackType, string> = {
  suggestion: "Санал",
  bug: "Алдаа",
  feedback: "Сэтгэгдэл",
  publisher_request: "Нийтлэгч хүсэлт",
  other: "Бусад",
}

const typeColors: Record<FeedbackType, string> = {
  suggestion: "bg-chart-2/10 text-chart-2",
  bug: "bg-destructive/10 text-destructive",
  feedback: "bg-chart-4/10 text-chart-4",
  publisher_request: "bg-primary/10 text-primary",
  other: "bg-muted text-muted-foreground",
}

const statusLabels: Record<FeedbackStatus, string> = {
  new: "Шинэ",
  pending: "Хүлээгдэж буй",
  in_progress: "Шийдвэрлэж буй",
  resolved: "Шийдсэн",
}

const statusColors: Record<FeedbackStatus, string> = {
  new: "bg-primary/10 text-primary",
  pending: "bg-chart-5/10 text-chart-5",
  in_progress: "bg-chart-2/10 text-chart-2",
  resolved: "bg-chart-4/10 text-chart-4",
}

const statusIcons: Record<FeedbackStatus, ElementType> = {
  new: AlertCircle,
  pending: Clock,
  in_progress: MessageSquare,
  resolved: CheckCircle,
}

export default function AdminFeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | FeedbackType>("all")
  const [statusFilter, setStatusFilter] = useState<"all" | FeedbackStatus>("all")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [items, setItems] = useState<AdminFeedbackItem[]>([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  })
  const [stats, setStats] = useState<Record<FeedbackStatus, number>>({
    new: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
  })

  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedbackItem | null>(null)
  const [statusDraft, setStatusDraft] = useState<FeedbackStatus>("new")
  const [replyDraft, setReplyDraft] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    getAdminFeedbackApi({
      page,
      limit: 10,
      q: searchQuery || undefined,
      type: typeFilter,
      status: statusFilter,
    })
      .then((res) => {
        if (cancelled) return
        setItems(res.items)
        setPagination(res.pagination)
        setStats(res.stats)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Алдаа гарлаа")
        setItems([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, searchQuery, statusFilter, typeFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, typeFilter, statusFilter])

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

  const statCards = useMemo(
    () => [
      { key: "new" as const, label: "Шинэ", color: "text-primary", icon: AlertCircle },
      { key: "pending" as const, label: "Хүлээгдэж буй", color: "text-chart-5", icon: Clock },
      {
        key: "in_progress" as const,
        label: "Шийдвэрлэж буй",
        color: "text-chart-2",
        icon: MessageSquare,
      },
      { key: "resolved" as const, label: "Шийдсэн", color: "text-chart-4", icon: CheckCircle },
    ],
    []
  )

  const openModal = (item: AdminFeedbackItem) => {
    setSelectedFeedback(item)
    setStatusDraft(item.status)
    setReplyDraft(item.replyMessage || "")
  }

  const applyStatusUpdate = async () => {
    if (!selectedFeedback) return
    try {
      setSaving(true)
      const updated = await updateFeedbackApi(selectedFeedback.id, { status: statusDraft })
      setSelectedFeedback(updated)
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast.success("Төлөв шинэчлэгдлээ.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Төлөв шинэчлэхэд алдаа гарлаа.")
    } finally {
      setSaving(false)
    }
  }

  const applyReply = async () => {
    if (!selectedFeedback) return
    if (!replyDraft.trim()) {
      toast.error("Хариу бичнэ үү.")
      return
    }
    try {
      setSaving(true)
      const updated = await updateFeedbackApi(selectedFeedback.id, {
        replyMessage: replyDraft.trim(),
      })
      setSelectedFeedback(updated)
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
      toast.success("Хариу амжилттай хадгалагдлаа.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Хариу хадгалахад алдаа гарлаа.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedFeedback) return
    try {
      setSaving(true)
      await deleteFeedbackApi(selectedFeedback.id)
      setItems((prev) => prev.filter((item) => item.id !== selectedFeedback.id))
      setSelectedFeedback(null)
      toast.success("Санал хүсэлт устгагдлаа.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Устгах үед алдаа гарлаа.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Санал хүсэлт</h1>
            <p className="text-sm text-muted-foreground">Нийт {pagination.total} санал хүсэлт</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.key} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className={cn("text-2xl font-bold", stat.color)}>{stats[stat.key] || 0}</p>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
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
              onChange={(e) => setTypeFilter(e.target.value as "all" | FeedbackType)}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">Бүх төрөл</option>
              <option value="suggestion">Санал</option>
              <option value="bug">Алдаа</option>
              <option value="feedback">Сэтгэгдэл</option>
              <option value="publisher_request">Нийтлэгч хүсэлт</option>
              <option value="other">Бусад</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | FeedbackStatus)}
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

        {error ? (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {items.map((item) => {
              const StatusIcon = statusIcons[item.status]
              return (
                <div
                  key={item.id}
                  onClick={() => openModal(item)}
                  className={cn(
                    "cursor-pointer p-4 transition-colors hover:bg-secondary/30",
                    item.status === "new" && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{item.subject}</h3>
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", typeColors[item.type])}>
                          {typeLabels[item.type]}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.message}</p>
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
              )
            })}
            {!loading && items.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Санал хүсэлт олдсонгүй.</div>
            ) : null}
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {(pagination.page - 1) * pagination.limit + (items.length ? 1 : 0)}-{(pagination.page - 1) * pagination.limit + items.length} / {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">
                {pagination.page}
              </span>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", typeColors[selectedFeedback.type])}>
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

            <div className="p-4">
              <h2 className="text-lg font-bold text-foreground">{selectedFeedback.subject}</h2>
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
                <p className="text-sm leading-relaxed text-foreground">{selectedFeedback.message}</p>
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-foreground">Төлөв өөрчлөх</label>
                <div className="flex gap-2">
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as FeedbackStatus)}
                    className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="new">Шинэ</option>
                    <option value="pending">Хүлээгдэж буй</option>
                    <option value="in_progress">Шийдвэрлэж буй</option>
                    <option value="resolved">Шийдсэн</option>
                  </select>
                  <button
                    onClick={applyStatusUpdate}
                    disabled={saving}
                    className="rounded-lg border border-input px-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60"
                  >
                    Хадгалах
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-foreground">Хариу</label>
                <textarea
                  rows={3}
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  placeholder="Хариу бичих..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border p-4">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
              >
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
                <button
                  onClick={applyReply}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Хариу хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
