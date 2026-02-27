"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Send,
  ImageIcon,
  X,
  Tag,
  Hash,
  Globe,
  Lock,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import {
  getCategories,
  getDashboardPostById,
  getTopics,
  uploadImageApi,
  updatePostApi,
  type BackendCategory,
  type BackendTopic,
} from "@/lib/api"

export default function EditPostPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])

  useEffect(() => {
    Promise.all([getDashboardPostById(id), getCategories(), getTopics()])
      .then(([post, cats, tpcs]) => {
        setTitle(post.title)
        setExcerpt(post.excerpt)
        setContent(post.content)
        setFeaturedImage(post.image)
        setSelectedCategory(post.categoryId || "")
        setSelectedTopics(post.topics)
        setVisibility(post.visibility)
        setCategories(cats)
        setTopics(tpcs)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Өгөгдөл ачаалахад алдаа")
      })
  }, [id])

  const save = async (status: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Гарчиг болон агуулга шаардлагатай")
      return
    }

    setIsSaving(true)
    setError("")
    try {
      await updatePostApi(id, {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        category: selectedCategory || undefined,
        topics: selectedTopics,
        visibility,
        status,
      })
      router.push("/dashboard/posts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалах үед алдаа")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/posts"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Нийтлэл засах</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => save("draft")}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Ноорог хадгалах
            </button>
            <button
              onClick={() => save("published")}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              Нийтлэх
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
        )}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Нийтлэлийн гарчиг..."
              className="w-full border-none bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Товч тайлбар</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Агуулга</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Онцлох зураг</h3>
              {featuredImage ? (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img src={featuredImage} alt="Featured" className="h-full w-full object-cover" />
                  <button
                    onClick={() => setFeaturedImage("")}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary hover:bg-muted/50">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Зураг оруулах</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const input = e.currentTarget
                      setIsUploadingImage(true)
                      setError("")
                      try {
                        const uploadedUrl = await uploadImageApi(file, "posts")
                        setFeaturedImage(uploadedUrl)
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Зураг upload хийхэд алдаа гарлаа")
                      } finally {
                        setIsUploadingImage(false)
                        input.value = ""
                      }
                    }}
                  />
                </label>
              )}
              {featuredImage && (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-secondary">
                  Зураг солих
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const input = e.currentTarget
                      setIsUploadingImage(true)
                      setError("")
                      try {
                        const uploadedUrl = await uploadImageApi(file, "posts")
                        setFeaturedImage(uploadedUrl)
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Зураг upload хийхэд алдаа гарлаа")
                      } finally {
                        setIsUploadingImage(false)
                        input.value = ""
                      }
                    }}
                  />
                </label>
              )}
              {isUploadingImage && (
                <p className="mt-2 text-xs text-muted-foreground">Зураг upload хийж байна...</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Ангилал</h3>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {selectedCategory ? categories.find((c) => c._id === selectedCategory)?.name : "Ангилал сонгох"}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showCategoryDropdown && "rotate-180")} />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-border bg-card py-1 shadow-lg">
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory(cat._id)
                          setShowCategoryDropdown(false)
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted",
                          selectedCategory === cat._id ? "bg-primary/10 text-primary" : "text-foreground"
                        )}
                      >
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Сэдэв</h3>
              <div className="relative">
                <button
                  onClick={() => setShowTopicsDropdown(!showTopicsDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {selectedTopics.length > 0 ? `${selectedTopics.length} сэдэв сонгосон` : "Сэдэв сонгох"}
                  </span>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", showTopicsDropdown && "rotate-180")} />
                </button>
                {showTopicsDropdown && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                    {topics.map((topic) => (
                      <button
                        key={topic._id}
                        onClick={() => toggleTopic(topic._id)}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted",
                          selectedTopics.includes(topic._id) ? "bg-primary/10 text-primary" : "text-foreground"
                        )}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Нийтлэх тохиргоо</h3>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === "public"}
                    onChange={() => setVisibility("public")}
                    className="h-4 w-4 text-primary"
                  />
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Нийтэд</p>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === "private"}
                    onChange={() => setVisibility("private")}
                    className="h-4 w-4 text-primary"
                  />
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Хувийн</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
