"use client"

import { useEffect, useState } from "react"
import {
  Search,
  Mail,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  downloadAdminNewsletterSubscribersCsv,
  getAdminNewsletterSubscribersApi,
  type NewsletterSubscriberItem,
} from "@/lib/api"
import { toast } from "sonner"

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "-"
  return date.toLocaleString("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<NewsletterSubscriberItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all")
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    getAdminNewsletterSubscribersApi({
      page,
      limit: 20,
      q: searchQuery || undefined,
      status: statusFilter,
    })
      .then((res) => {
        if (cancelled) return
        setItems(res.items)
        setPagination(res.pagination)
      })
      .catch((e) => {
        if (cancelled) return
        setItems([])
        setError(e instanceof Error ? e.message : "Товхимолын бүртгэл ачаалж чадсангүй")
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, searchQuery, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  const handleExportCsv = async () => {
    try {
      setExporting(true)
      await downloadAdminNewsletterSubscribersCsv({
        q: searchQuery || undefined,
        status: statusFilter,
      })
      toast.success("CSV амжилттай татагдлаа")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "CSV татахад алдаа гарлаа")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Товхимол</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {pagination.total} бүртгэл
            </p>
          </div>
          <button
            onClick={() => void handleExportCsv()}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Татаж байна..." : "CSV татах"}
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Имэйл хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "unsubscribed")
              }
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="all">Бүгд</option>
              <option value="active">Идэвхтэй</option>
              <option value="unsubscribed">Цуцалсан</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Имэйл</th>
                  <th className="px-4 py-3">Төлөв</th>
                  <th className="px-4 py-3">Эх сурвалж</th>
                  <th className="px-4 py-3">Бүртгүүлсэн</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                      Ачаалж байна...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                      Бүртгэл олдсонгүй
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-t border-border/70">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {item.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            item.status === "active"
                              ? "bg-chart-4/15 text-chart-4"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.status === "active" ? "Идэвхтэй" : "Цуцалсан"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.source}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(item.subscribedAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Хуудас {pagination.page} / {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-foreground disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
