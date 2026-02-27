"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Hash,
  Calendar,
  X,
  ImageIcon,
  BarChart3,
  Star,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  createTopicApi,
  deleteTopicApi,
  getTopics,
  type BackendTopic,
  uploadImageApi,
  updateTopicApi,
} from "@/lib/api"

type TopicForm = {
  name: string
  slug: string
  description: string
  image: string
  featured: boolean
  startDate: string
  endDate: string
}

const initialForm: TopicForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  featured: false,
  startDate: "",
  endDate: "",
}

export default function AdminTopicsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [items, setItems] = useState<BackendTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [editingTopic, setEditingTopic] = useState<BackendTopic | null>(null)
  const [formData, setFormData] = useState<TopicForm>(initialForm)

  async function loadTopics() {
    try {
      setLoading(true)
      setError("")
      const topics = await getTopics()
      setItems(topics)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Сэдэв ачаалж чадсангүй")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTopics()
  }, [])

  const filteredTopics = useMemo(
    () =>
      items.filter((topic) =>
        topic.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [items, searchQuery]
  )

  function openCreateModal() {
    setEditingTopic(null)
    setFormData(initialForm)
    setShowModal(true)
  }

  function openEditModal(topic: BackendTopic) {
    setEditingTopic(topic)
    setFormData({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || "",
      image: topic.image || "",
      featured: Boolean(topic.featured),
      startDate: topic.startDate ? topic.startDate.slice(0, 10) : "",
      endDate: topic.endDate ? topic.endDate.slice(0, 10) : "",
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
        image: formData.image.trim(),
        featured: formData.featured,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      }

      if (editingTopic) {
        await updateTopicApi(editingTopic._id, payload)
      } else {
        await createTopicApi(payload)
      }

      setShowModal(false)
      setFormData(initialForm)
      setEditingTopic(null)
      await loadTopics()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хадгалах үед алдаа гарлаа")
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Энэ сэдвийг устгах уу?")) return
    try {
      setError("")
      await deleteTopicApi(id)
      await loadTopics()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Устгах үед алдаа гарлаа")
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Сэдэв</h1>
            <p className="text-sm text-muted-foreground">Нийт {items.length} сэдэв</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Шинэ сэдэв
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Сэдэв хайх..."
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
            {filteredTopics.map((topic) => (
              <div
                key={topic._id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={topic.image || "/placeholder.jpg"}
                    alt={topic.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

                  {topic.featured && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-chart-5/90 px-2 py-1 text-xs font-medium text-foreground">
                      <Star className="h-3 w-3" />
                      Онцлох
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="line-clamp-1 text-base font-bold text-card">{topic.name}</h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {topic.description || "Тайлбар байхгүй"}
                  </p>

                  {(topic.startDate || topic.endDate) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {topic.startDate ? topic.startDate.slice(0, 10) : ""}
                        {topic.endDate ? ` - ${topic.endDate.slice(0, 10)}` : ""}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Сэдэв</span>
                    </div>

                    <div className="relative">
                      <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 bottom-full z-10 mb-1 hidden w-36 rounded-lg border border-border bg-card py-1 shadow-lg group-hover:group-focus-within:block">
                        <button
                          onClick={() => openEditModal(topic)}
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
                        <button
                          onClick={() => onDelete(topic._id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                        >
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
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
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

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Зураг</label>
                <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-input bg-secondary/30">
                  {formData.image ? (
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                  ) : (
                    <label className="text-center cursor-pointer">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Зураг оруулах</p>
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
                            const uploadedUrl = await uploadImageApi(file, "topics")
                            setFormData((prev) => ({ ...prev, image: uploadedUrl }))
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Cover зураг upload хийхэд алдаа гарлаа"
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
                {formData.image && (
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
                          const uploadedUrl = await uploadImageApi(file, "topics")
                          setFormData((prev) => ({ ...prev, image: uploadedUrl }))
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "Cover зураг upload хийхэд алдаа гарлаа"
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
                  <p className="mt-2 text-xs text-muted-foreground">Cover зураг upload хийж байна...</p>
                )}
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="mt-2 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Нэр</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Сэдвийн нэр"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="topic-slug"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Тайлбар</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Сэдвийн тайлбар"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Эхлэх огноо</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Дуусах огноо</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Онцлох сэдэв болгох</span>
              </label>

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
                  {saving ? "Түр хүлээнэ үү..." : editingTopic ? "Хадгалах" : "Үүсгэх"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
