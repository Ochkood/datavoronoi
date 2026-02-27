"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { posts } from "@/lib/data"

const statusOptions = [
  { value: "all", label: "Бүгд" },
  { value: "published", label: "Нийтэлсэн" },
  { value: "draft", label: "Ноорог" },
  { value: "review", label: "Хянагдаж буй" },
]

const categoryOptions = [
  { value: "all", label: "Бүх ангилал" },
  { value: "economy", label: "Эдийн засаг" },
  { value: "technology", label: "Технологи" },
  { value: "environment", label: "Байгаль орчин" },
  { value: "health", label: "Эрүүл мэнд" },
  { value: "finance", label: "Санхүү" },
  { value: "world", label: "Дэлхий" },
]

// Mock extended post data for admin
const adminPosts = posts.map((post, index) => ({
  ...post,
  status: index % 3 === 0 ? "published" : index % 3 === 1 ? "draft" : "review",
  createdAt: "2025-02-15",
  updatedAt: "2025-02-20",
}))

const statusColors: Record<string, string> = {
  published: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
  review: "bg-chart-5/10 text-chart-5",
}

const statusLabels: Record<string, string> = {
  published: "Нийтэлсэн",
  draft: "Ноорог",
  review: "Хянагдаж буй",
}

export default function AdminPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const filteredPosts = adminPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" || post.categorySlug === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map((p) => p.id))
    }
  }

  const toggleSelectPost = (id: string) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((p) => p !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Мэдээ</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {adminPosts.length} мэдээ
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ мэдээ
          </Link>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
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

          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedPosts.length} сонгогдсон
              </span>
              <button className="flex h-9 items-center gap-2 rounded-lg bg-destructive/10 px-3 text-sm font-medium text-destructive hover:bg-destructive/20">
                <Trash2 className="h-4 w-4" />
                Устгах
              </button>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Төлөв
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Ангилал
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setStatusFilter("all")
                setCategoryFilter("all")
              }}
              className="mt-auto text-sm text-muted-foreground hover:text-foreground"
            >
              Цэвэрлэх
            </button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Мэдээ
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ангилал
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Зохиогч
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Төлөв
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Үзэлт
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Огноо
                  </th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className={cn(
                      "transition-colors hover:bg-secondary/30",
                      selectedPosts.includes(post.id) && "bg-primary/5"
                    )}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => toggleSelectPost(post.id)}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="block font-medium text-foreground hover:text-primary line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 overflow-hidden rounded-full">
                          <Image
                            src={post.authorAvatar}
                            alt={post.author}
                            width={28}
                            height={28}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-foreground">
                          {post.author}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColors[post.status]
                        )}
                      >
                        {statusLabels[post.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {post.views}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {post.date}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative group">
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 top-full z-10 mt-1 hidden w-40 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:block">
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Edit className="h-4 w-4" />
                            Засах
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Eye className="h-4 w-4" />
                            Харах
                          </button>
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary">
                            <Copy className="h-4 w-4" />
                            Хуулах
                          </button>
                          <div className="my-1 h-px bg-border" />
                          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                            Устгах
                          </button>
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
              1-{filteredPosts.length} / {adminPosts.length} мэдээ
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
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-secondary">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-secondary">
                3
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
