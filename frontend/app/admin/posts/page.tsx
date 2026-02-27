"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  deletePostApi,
  getAdminPosts,
  updatePostStatusApi,
  type AdminPost,
} from "@/lib/api"

const statusOptions = [
  { value: "all", label: "Бүгд" },
  { value: "published", label: "Нийтэлсэн" },
  { value: "pending", label: "Хянагдаж буй" },
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
  pending: "Хянагдаж буй",
  rejected: "Татгалзсан",
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getAdminPosts()
      .then(setPosts)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Мэдээ ачаалахад алдаа")
      })
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || post.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [posts, searchQuery, statusFilter])

  const setStatus = async (
    id: string,
    status: "draft" | "pending" | "published" | "rejected"
  ) => {
    try {
      const updated = await updatePostStatusApi(id, status)
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      setOpenMenu(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Төлөв шинэчлэхэд алдаа")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ мэдээг устгах уу?")) return
    try {
      await deletePostApi(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setOpenMenu(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Устгах үед алдаа")
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Мэдээ</h1>
            <p className="text-sm text-muted-foreground">Нийт {posts.length} мэдээ</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Мэдээ хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Мэдээ</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ангилал</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Зохиогч</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Төлөв</th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Үзэлт</th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image src={post.image} alt={post.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="block font-medium text-foreground line-clamp-1">{post.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{post.category}</span>
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
                          onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                              Хүлээлгэх
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
                            <div className="my-1 h-px bg-border" />
                            <button
                              onClick={() => handleDelete(post.id)}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
