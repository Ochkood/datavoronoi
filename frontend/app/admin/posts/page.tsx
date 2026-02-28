"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  deletePostApi,
  getAdminPosts,
  getAdminUsers,
  getCategories,
  getTopics,
  updatePostFeaturedApi,
  updatePostStatusApi,
  type AdminPost,
  type BackendCategory,
  type BackendTopic,
  type AdminUser,
} from "@/lib/api"

const statusOptions = [
  { value: "all", label: "Бүгд" },
  { value: "published", label: "Нийтэлсэн" },
  { value: "pending", label: "Хүлээгдэж буй" },
  { value: "draft", label: "Ноорог" },
  { value: "rejected", label: "Татгалзсан" },
]

const statusColors: Record<string, string> = {
  published: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
  pending: "bg-chart-5/10 text-chart-5",
  rejected: "bg-destructive/10 text-destructive",
}

const statusLabels: Record<string, string> = {
  published: "Нийтэлсэн",
  draft: "Ноорог",
  pending: "Хүлээгдэж буй",
  rejected: "Татгалзсан",
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [authorFilter, setAuthorFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [topicFilter, setTopicFilter] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    Promise.all([getAdminUsers(), getCategories(), getTopics()])
      .then(([u, c, t]) => {
        setUsers(u.filter((x) => x.role === "publisher" || x.role === "admin"))
        setCategories(c)
        setTopics(t)
      })
      .catch(() => {
        setUsers([])
        setCategories([])
        setTopics([])
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    getAdminPosts({
      page,
      limit,
      q: searchQuery || undefined,
      status: statusFilter as "all" | "draft" | "pending" | "published" | "rejected",
      author: authorFilter || undefined,
      category: categoryFilter || undefined,
      topic: topicFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      featured: featuredFilter as "all" | "true" | "false",
    })
      .then((res) => {
        if (cancelled) return
        setPosts(res.items)
        setTotalPages(res.pagination.totalPages || 1)
        setTotalCount(res.pagination.total || 0)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Мэдээ ачаалахад алдаа")
        setPosts([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [
    page,
    limit,
    searchQuery,
    statusFilter,
    authorFilter,
    categoryFilter,
    topicFilter,
    featuredFilter,
    dateFrom,
    dateTo,
  ])

  const setStatus = async (
    id: string,
    status: "draft" | "pending" | "published" | "rejected"
  ) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const updated = await updatePostStatusApi(id, status)
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      setOpenMenu(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Төлөв шинэчлэхэд алдаа")
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const toggleFeatured = async (post: AdminPost) => {
    setActionLoading((prev) => ({ ...prev, [post.id]: true }))
    try {
      const updated = await updatePostFeaturedApi(post.id, !post.featured)
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)))
      setOpenMenu(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Онцлох төлөв шинэчлэхэд алдаа")
    } finally {
      setActionLoading((prev) => ({ ...prev, [post.id]: false }))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ мэдээг устгах уу?")) return
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      await deletePostApi(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setOpenMenu(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгах үед алдаа")
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Мэдээ</h1>
            <p className="text-sm text-muted-foreground">Нийт {totalCount} мэдээ</p>
          </div>
          <Link
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ мэдээ
          </Link>
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-3 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Гарчиг, нийтлэгчээр хайх..."
              value={searchQuery}
              onChange={(e) => {
                setPage(1)
                setSearchQuery(e.target.value)
              }}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1)
              setStatusFilter(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={authorFilter}
            onChange={(e) => {
              setPage(1)
              setAuthorFilter(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Нийтлэгч: Бүгд</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setPage(1)
              setCategoryFilter(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Ангилал: Бүгд</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={topicFilter}
            onChange={(e) => {
              setPage(1)
              setTopicFilter(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Сэдэв: Бүгд</option>
            {topics.map((topic) => (
              <option key={topic._id} value={topic._id}>
                {topic.name}
              </option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => {
              setPage(1)
              setFeaturedFilter(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">Онцлох: Бүгд</option>
            <option value="true">Онцлох</option>
            <option value="false">Онцлох биш</option>
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setPage(1)
              setDateFrom(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setPage(1)
              setDateTo(e.target.value)
            }}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Мэдээ</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ангилал / Сэдэв</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Нийтлэгч</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Огноо</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Төлөв</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Үзэлт</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!loading &&
                  posts.map((post) => (
                    <tr key={post.id} className="transition-colors hover:bg-secondary/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image src={post.image} alt={post.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="block line-clamp-1 font-medium text-foreground">
                              {post.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2">
                              {post.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-chart-1/15 px-2 py-0.5 text-[10px] font-semibold text-chart-1">
                                  <Star className="h-3 w-3 fill-current" />
                                  Онцлох
                                </span>
                              )}
                              <p className="line-clamp-1 text-xs text-muted-foreground">{post.excerpt}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">{post.category}</p>
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {post.topics.length > 0
                              ? post.topics.map((t) => t.name).join(", ")
                              : "-"}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                            <Image
                              src={post.authorAvatar}
                              alt={post.author}
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-foreground">{post.author}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">
                        {new Date(post.createdAt).toLocaleDateString("mn-MN")}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                            statusColors[post.status]
                          )}
                        >
                          {statusLabels[post.status]}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground">{post.views}</td>
                      <td className="p-4">
                        <div className="relative">
                          <button
                            disabled={Boolean(actionLoading[post.id])}
                            onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                          {openMenu === post.id && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
                              <button
                                onClick={() => setStatus(post.id, "published")}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Нийтлэх
                              </button>
                              <button
                                onClick={() => setStatus(post.id, "pending")}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                              >
                                <Clock className="h-4 w-4" />
                                Хүлээгдэж буй
                              </button>
                              <button
                                onClick={() => setStatus(post.id, "rejected")}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                              >
                                <XCircle className="h-4 w-4" />
                                Татгалзах
                              </button>
                              <button
                                onClick={() => setStatus(post.id, "draft")}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                              >
                                <FileText className="h-4 w-4" />
                                Ноорог
                              </button>
                              <button
                                onClick={() => void toggleFeatured(post)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                              >
                                <Star className={cn("h-4 w-4", post.featured && "fill-current")} />
                                {post.featured ? "Онцлохоос хасах" : "Онцлох болгох"}
                              </button>
                              <div className="my-1 h-px bg-border" />
                              <button
                                onClick={() => void handleDelete(post.id)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                              >
                                <Trash2 className="h-4 w-4" />
                                Устгах
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                {!loading && posts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                      Илэрц алга
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-sm text-muted-foreground">
                      Мэдээ ачаалж байна...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="px-2 text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
