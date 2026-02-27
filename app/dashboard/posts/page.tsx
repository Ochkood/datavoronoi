"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
  PenSquare,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Heart,
  MessageCircle,
  ExternalLink,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for user's posts
const myPosts = [
  {
    id: "1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
    excerpt: "Монголын эдийн засгийн өсөлтийн чиг хандлагыг тоон мэдээлэлд суурилсан...",
    status: "published",
    category: "Эдийн засаг",
    image: "/images/infographic-1.jpg",
    views: "12.4K",
    likes: 234,
    comments: 45,
    createdAt: "2025-02-25T10:30:00",
    publishedAt: "2025-02-25T12:00:00",
  },
  {
    id: "2",
    title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
    excerpt: "Олон улсын худалдааны гол маршрут, бараа бүтээгдэхүүний урсгал...",
    status: "published",
    category: "Эдийн засаг",
    image: "/images/infographic-8.jpg",
    views: "4.8K",
    likes: 89,
    comments: 9,
    createdAt: "2025-02-23T09:15:00",
    publishedAt: "2025-02-23T11:00:00",
  },
  {
    id: "3",
    title: "2025 оны эдийн засгийн таамаглал",
    excerpt: "Ирэх жилийн эдийн засгийн төлөв байдал, мэргэжилтнүүдийн үнэлгээ...",
    status: "pending",
    category: "Эдийн засаг",
    image: "/images/infographic-4.jpg",
    views: "-",
    likes: 0,
    comments: 0,
    createdAt: "2025-02-22T14:20:00",
    publishedAt: null,
  },
  {
    id: "4",
    title: "Инфляцийн нөлөө: Өрхийн орлогын шинжилгээ",
    excerpt: "Инфляци өрхийн худалдан авах чадварт хэрхэн нөлөөлж байна...",
    status: "draft",
    category: "Санхүү",
    image: "/images/infographic-6.jpg",
    views: "-",
    likes: 0,
    comments: 0,
    createdAt: "2025-02-20T16:45:00",
    publishedAt: null,
  },
  {
    id: "5",
    title: "Монголын уул уурхайн экспорт 2024",
    excerpt: "Уул уурхайн салбарын экспортын статистик, гол зах зээлүүд...",
    status: "rejected",
    category: "Эдийн засаг",
    image: "/images/infographic-3.jpg",
    views: "-",
    likes: 0,
    comments: 0,
    createdAt: "2025-02-18T11:30:00",
    publishedAt: null,
    rejectionReason: "Эх сурвалжийн баталгаажуулалт шаардлагатай",
  },
]

const statusConfig = {
  published: {
    label: "Нийтлэгдсэн",
    color: "bg-chart-4/10 text-chart-4",
    icon: CheckCircle,
  },
  pending: {
    label: "Хүлээгдэж буй",
    color: "bg-chart-5/10 text-chart-5",
    icon: Clock,
  },
  draft: {
    label: "Ноорог",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
  },
  rejected: {
    label: "Татгалзсан",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
}

const filters = ["Бүгд", "Нийтлэгдсэн", "Хүлээгдэж буй", "Ноорог", "Татгалзсан"]
const filterToStatus: Record<string, string | null> = {
  "Бүгд": null,
  "Нийтлэгдсэн": "published",
  "Хүлээгдэж буй": "pending",
  "Ноорог": "draft",
  "Татгалзсан": "rejected",
}

export default function MyPostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("Бүгд")
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const filteredPosts = myPosts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterToStatus[activeFilter] === null ||
      post.status === filterToStatus[activeFilter]
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Миний нийтлэлүүд
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Нийт {myPosts.length} нийтлэл
          </p>
        </div>
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PenSquare className="h-4 w-4" />
          Шинэ нийтлэл
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Хайх..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-64"
          />
        </div>
      </div>

      {/* Posts List */}
      <div className="rounded-xl border border-border bg-card">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Нийтлэл олдсонгүй
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Шүүлтүүрээ өөрчилж эсвэл шинэ нийтлэл үүсгэнэ үү
            </p>
            <Link
              href="/dashboard/posts/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <PenSquare className="h-4 w-4" />
              Шинэ нийтлэл
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredPosts.map((post) => {
              const status =
                statusConfig[post.status as keyof typeof statusConfig]
              return (
                <div
                  key={post.id}
                  className="flex items-start gap-4 p-5 transition-colors hover:bg-muted/30"
                >
                  {/* Image */}
                  <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="block"
                        >
                          <h3 className="truncate text-base font-semibold text-foreground hover:text-primary">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                          status.color
                        )}
                      >
                        <status.icon className="h-3 w-3" />
                        {status.label}
                      </div>
                    </div>

                    {/* Rejection reason */}
                    {post.status === "rejected" && post.rejectionReason && (
                      <div className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        Шалтгаан: {post.rejectionReason}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="rounded-full bg-secondary px-2 py-0.5">
                        {post.category}
                      </span>
                      {post.status === "published" && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {post.comments}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === post.id ? null : post.id)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenu === post.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
                        <Link
                          href={`/dashboard/posts/${post.id}/edit`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          <Edit className="h-4 w-4" />
                          Засах
                        </Link>
                        {post.status === "published" && (
                          <>
                            <Link
                              href={`/post/${post.id}`}
                              target="_blank"
                              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Харах
                            </Link>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted">
                              <Copy className="h-4 w-4" />
                              Линк хуулах
                            </button>
                          </>
                        )}
                        <div className="my-1 h-px bg-border" />
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted">
                          <Trash2 className="h-4 w-4" />
                          Устгах
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
