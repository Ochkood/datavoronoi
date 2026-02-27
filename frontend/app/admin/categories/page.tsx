"use client"

import { useEffect, useMemo, useState } from "react"
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
import {
  createCategoryApi,
  deleteCategoryApi,
  getCategories,
  type BackendCategory,
  uploadImageApi,
  updateCategoryApi,
} from "@/lib/api"
import { IconPicker, DynamicIcon } from "@/components/admin/icon-picker"

type EditCategoryForm = {
  name: string
  slug: string
  description: string
  color: string
  icon: string
  bannerImage: string
}

const initialForm: EditCategoryForm = {
  name: "",
  slug: "",
  description: "",
  color: "chart-1",
  icon: "",
  bannerImage: "",
}

const colorBgMap: Record<string, string> = {
  "chart-1": "bg-chart-1",
  "chart-2": "bg-chart-2",
  "chart-3": "bg-chart-3",
  "chart-4": "bg-chart-4",
  "chart-5": "bg-chart-5",
  primary: "bg-primary",
  destructive: "bg-destructive",
}

function normalizeColor(color?: string) {
  if (!color) return "chart-1"
  if (color.startsWith("text-")) return color.replace("text-", "")
  if (color.startsWith("bg-")) return color.replace("bg-", "")
  return color
}

export default function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [items, setItems] = useState<BackendCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null)
  const [formData, setFormData] = useState<EditCategoryForm>(initialForm)

  async function loadCategories() {
    try {
      setLoading(true)
      setError("")
      const categories = await getCategories()
      setItems(categories)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ангилал ачаалж чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const filteredCategories = useMemo(
    () =>
      items.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [items, searchQuery]
  )

  function openCreateModal() {
    setEditingCategory(null)
    setFormData(initialForm)
    setShowModal(true)
  }

  function openEditModal(cat: BackendCategory) {
    setEditingCategory(cat)
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      color: normalizeColor(cat.color),
      icon: cat.icon || "",
      bannerImage: cat.bannerImage || "",
    })
    setShowModal(true)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError("Нэр болон slug шаардлагатай")
      return
    }

    try {
      setSaving(true)
      setError("")
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        color: formData.color,
        icon: formData.icon,
        bannerImage: formData.bannerImage.trim(),
      }

      if (editingCategory) {
        await updateCategoryApi(editingCategory._id, payload)
      } else {
        await createCategoryApi(payload)
      }

      setShowModal(false)
      setFormData(initialForm)
      setEditingCategory(null)
      await loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хадгалах үед алдаа гарлаа")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Энэ ангиллыг устгах уу?")) return
    try {
      setError("")
      await deleteCategoryApi(id)
      await loadCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгах үед алдаа гарлаа")
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Ангилал</h1>
            <p className="text-sm text-muted-foreground">Нийт {items.length} ангилал</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ ангилал
          </button>
        </div>
      </header>

      <div className="p-6">
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

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Ачаалж байна...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
              >
                {cat.bannerImage ? (
                  <div className="relative h-24 w-full">
                    <Image src={cat.bannerImage} alt={cat.name} fill className="object-cover" />
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
                        "flex h-12 w-12 items-center justify-center rounded-xl -mt-10 relative z-10 border-4 border-card text-white",
                        colorBgMap[normalizeColor(cat.color)] || "bg-chart-1"
                      )}
                    >
                      <DynamicIcon name={cat.icon} className="h-6 w-6" fallback={FolderTree} />
                    </div>
                    <div className="relative">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 top-full z-10 mt-1 hidden w-36 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:group-focus-within:block">
                        <button
                          onClick={() => openEditModal(cat)}
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
                        <button
                          onClick={() => onDelete(cat._id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Устгах
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-foreground">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {cat.description || "Тайлбар байхгүй"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
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

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Banner зураг</label>
                <div className="relative">
                  {formData.bannerImage ? (
                    <div className="relative h-32 w-full overflow-hidden rounded-lg">
                      <Image src={formData.bannerImage} alt="Banner" fill className="object-cover" />
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
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const input = e.currentTarget
                          setUploadingImage(true)
                          setError("")
                          try {
                            const uploadedUrl = await uploadImageApi(file, "categories")
                            setFormData((prev) => ({ ...prev, bannerImage: uploadedUrl }))
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Banner зураг upload хийхэд алдаа гарлаа"
                            )
                          } finally {
                            setUploadingImage(false)
                            input.value = ""
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                {formData.bannerImage && (
                  <label className="mt-2 inline-flex cursor-pointer items-center rounded-md border border-input px-3 py-1.5 text-xs text-foreground hover:bg-secondary">
                    Зураг солих
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const input = e.currentTarget
                        setUploadingImage(true)
                        setError("")
                        try {
                          const uploadedUrl = await uploadImageApi(file, "categories")
                          setFormData((prev) => ({ ...prev, bannerImage: uploadedUrl }))
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "Banner зураг upload хийхэд алдаа гарлаа"
                          )
                        } finally {
                          setUploadingImage(false)
                          input.value = ""
                        }
                      }}
                    />
                  </label>
                )}
                {uploadingImage && (
                  <p className="mt-2 text-xs text-muted-foreground">Banner зураг upload хийж байна...</p>
                )}
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://..."
                  className="mt-2 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Нэр</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ангилалын нэр"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Slug</label>
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
                <label className="mb-1.5 block text-sm font-medium text-foreground">Тайлбар</label>
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
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Icon</label>
                  <IconPicker
                    value={formData.icon}
                    onChange={(icon) => setFormData({ ...formData, icon })}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Өнгө</label>
                  <div className="flex h-10 items-center gap-2">
                    {["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "primary", "destructive"].map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, color })}
                          className={cn(
                            "h-7 w-7 rounded-full border-2 transition-all hover:scale-110",
                            colorBgMap[color],
                            formData.color === color ? "border-foreground" : "border-transparent"
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
                  disabled={saving}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? "Түр хүлээнэ үү..." : editingCategory ? "Хадгалах" : "Үүсгэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
