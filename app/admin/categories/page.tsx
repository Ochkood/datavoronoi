"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderTree,
  TrendingUp,
  Cpu,
  Leaf,
  Heart,
  Building2,
  Globe,
  X,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

const iconMap: Record<string, React.ElementType> = {
  economy: TrendingUp,
  technology: Cpu,
  environment: Leaf,
  health: Heart,
  finance: Building2,
  world: Globe,
}

// Extend categories with mock data
const adminCategories = categories.map((cat, index) => ({
  ...cat,
  postCount: [145, 98, 76, 54, 89, 67][index] || 50,
  views: ["45.2K", "32.1K", "28.5K", "18.9K", "35.6K", "22.3K"][index] || "10K",
  createdAt: "2024-01-15",
}))

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof adminCategories[0] | null>(null)

  const filteredCategories = adminCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Ангилал</h1>
            <p className="text-sm text-muted-foreground">
              Нийт {adminCategories.length} ангилал
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ ангилал
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ангилал хайх..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => {
            const IconComponent = iconMap[cat.slug] || FolderTree
            return (
              <div
                key={cat.slug}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl",
                      `${cat.bgColor}/10`
                    )}
                  >
                    <IconComponent className={cn("h-6 w-6", cat.color)} />
                  </div>
                  <div className="relative">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full z-10 mt-1 hidden w-36 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:group-focus-within:block">
                      <button
                        onClick={() => {
                          setEditingCategory(cat)
                          setShowModal(true)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary"
                      >
                        <Edit className="h-4 w-4" />
                        Засах
                      </button>
                      <Link
                        href={`/admin/categories/${cat.slug}/stats`}
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

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-border pt-4">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {cat.postCount}
                    </p>
                    <p className="text-xs text-muted-foreground">Нийтлэл</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {cat.views}
                    </p>
                    <p className="text-xs text-muted-foreground">Үзэлт</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingCategory ? "Ангилал засах" : "Шинэ ангилал"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Нэр
                </label>
                <input
                  type="text"
                  defaultValue={editingCategory?.name || ""}
                  placeholder="Ангилалын нэр"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Slug
                </label>
                <input
                  type="text"
                  defaultValue={editingCategory?.slug || ""}
                  placeholder="category-slug"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Тайлбар
                </label>
                <textarea
                  rows={3}
                  defaultValue={editingCategory?.description || ""}
                  placeholder="Ангилалын тайлбар"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Өнгө
                </label>
                <div className="flex gap-2">
                  {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "primary"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          "h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110",
                          `bg-${color}`,
                          editingCategory?.color.includes(color) &&
                            "border-foreground"
                        )}
                      />
                    )
                  )}
                </div>
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
                  {editingCategory ? "Хадгалах" : "Үүсгэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
