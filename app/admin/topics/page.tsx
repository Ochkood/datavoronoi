"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Hash,
  Calendar,
  Eye,
  Star,
  X,
  ImageIcon,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { topics } from "@/lib/data"

// Extend topics with mock admin data
const adminTopics = topics.map((topic, index) => ({
  ...topic,
  postCount: [28, 45, 67, 23, 34][index] || 20,
  views: ["125K", "89K", "234K", "45K", "78K"][index] || "30K",
  status: index < 3 ? "active" : "archived",
}))

export default function AdminTopicsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingTopic, setEditingTopic] = useState<typeof adminTopics[0] | null>(null)

  const filteredTopics = adminTopics.filter((topic) => {
    const matchesSearch = topic.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || topic.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Сэдэв</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {adminTopics.length} сэдэв
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTopic(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ сэдэв
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Сэдэв хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            {[
              { value: "all", label: "Бүгд" },
              { value: "active", label: "Идэвхтэй" },
              { value: "archived", label: "Архивлагдсан" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === option.value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((topic) => (
            <div
              key={topic.slug}
              className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-36 w-full">
                <Image
                  src={topic.image}
                  alt={topic.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                
                {/* Featured badge */}
                {topic.featured && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-chart-5/90 px-2 py-1 text-xs font-medium text-foreground">
                    <Star className="h-3 w-3" />
                    Онцлох
                  </div>
                )}
                
                {/* Status badge */}
                <div
                  className={cn(
                    "absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-medium",
                    topic.status === "active"
                      ? "bg-chart-4/90 text-foreground"
                      : "bg-muted/90 text-muted-foreground"
                  )}
                >
                  {topic.status === "active" ? "Идэвхтэй" : "Архив"}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-base font-bold text-card line-clamp-1">
                    {topic.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>

                {/* Dates */}
                {(topic.startDate || topic.endDate) && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {topic.startDate}
                      {topic.endDate && ` - ${topic.endDate}`}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {topic.postCount}
                      </span>
                      <span className="text-muted-foreground">мэдээ</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {topic.views}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 bottom-full z-10 mb-1 hidden w-36 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:group-focus-within:block">
                      <button
                        onClick={() => {
                          setEditingTopic(topic)
                          setShowModal(true)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        <Edit className="h-4 w-4" />
                        Засах
                      </button>
                      <Link
                        href={`/admin/topics/${topic.slug}/stats`}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Статистик
                      </Link>
                      <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                        Устгах
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingTopic ? "Сэдэв засах" : "Шинэ сэдэв"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Зураг
                </label>
                <div className="flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-secondary/30 transition-colors hover:border-primary hover:bg-secondary/50">
                  {editingTopic?.image ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={editingTopic.image}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Зураг оруулах
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Нэр
                </label>
                <input
                  type="text"
                  defaultValue={editingTopic?.name || ""}
                  placeholder="Сэдвийн нэр"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Slug
                </label>
                <input
                  type="text"
                  defaultValue={editingTopic?.slug || ""}
                  placeholder="topic-slug"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Тайлбар
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingTopic?.description || ""}
                  placeholder="Сэдвийн тайлбар"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Эхлэх огноо
                  </label>
                  <input
                    type="date"
                    defaultValue={editingTopic?.startDate || ""}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Дуусах огноо
                  </label>
                  <input
                    type="date"
                    defaultValue={editingTopic?.endDate || ""}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked={editingTopic?.featured}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">
                    Онцлох сэдэв болгох
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  {editingTopic ? "Хадгалах" : "Үүсгэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
