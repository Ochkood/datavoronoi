"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  FolderTree,
  X,
  BarChart3,
  ImageIcon,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"
import { IconPicker, DynamicIcon } from "@/components/admin/icon-picker"

// Extend categories with mock data
const adminCategories = categories.map((cat, index) => ({
  ...cat,
  postCount: [145, 98, 76, 54, 89, 67][index] || 50,
  views: ["45.2K", "32.1K", "28.5K", "18.9K", "35.6K", "22.3K"][index] || "10K",
  createdAt: "2024-01-15",
}))

type EditCategoryForm = {
  name: string
  slug: string
  description: string
  color: string
  icon: string
  bannerImage: string
}

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<typeof adminCategories[0] | null>(null)
  const [formData, setFormData] = useState<EditCategoryForm>({
    name: "",
    slug: "",
    description: "",
    color: "chart-1",
    icon: "",
    bannerImage: "",
  })

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
          {filteredCategories.map((cat) => (
              <div
                key={cat.slug}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
              >
                {/* Banner Image */}
                {cat.bannerImage ? (
                  <div className="relative h-24 w-full">
                    <Image
                      src={cat.bannerImage}
                      alt={cat.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-24 w-full items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl -mt-10 relative z-10 border-4 border-card",
                        cat.bgColor
                      )}
                    >
                      <DynamicIcon 
                        name={cat.icon} 
                        className="h-6 w-6 text-white" 
                        fallback={FolderTree}
                      />
                    </div>
                    <div className="relative">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className="absolute right-0 top-full z-10 mt-1 hidden w-36 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:group-focus-within:block">
                      <button
                        onClick={() => {
                          setEditingCategory(cat)
                          setFormData({
                            name: cat.name,
                            slug: cat.slug,
                            description: cat.description,
                            color: cat.color.replace("text-", ""),
                            icon: cat.icon || "",
                            bannerImage: cat.bannerImage || "",
                          })
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
              {/* Banner Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Banner зураг
                </label>
                <div className="relative">
                  {formData.bannerImage ? (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg">
                      <Image
                        src={formData.bannerImage}
                        alt="Banner"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, bannerImage: "" })}
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/80 text-background hover:bg-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background hover:bg-secondary/30">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="mt-2 text-sm text-muted-foreground">Зураг оруулах</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="/images/banner.jpg"
                  className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Нэр
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="category-slug"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Тайлбар
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ангилалын тайлбар"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Icon
                  </label>
                  <IconPicker
                    value={formData.icon}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Өнгө
                  </label>
                  <div className="flex h-10 items-center gap-2">
                    {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "primary", "destructive"].map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={cn(
                            "h-7 w-7 rounded-full border-2 transition-all hover:scale-110",
                            `bg-${color}`,
                            formData.color === color
                              ? "border-foreground"
                              : "border-transparent"
                          )}
                        />
                      )
                    )}
                  </div>
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
