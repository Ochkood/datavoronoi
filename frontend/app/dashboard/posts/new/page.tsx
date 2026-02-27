"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  ImageIcon,
  X,
  Calendar,
  Tag,
  Hash,
  Globe,
  Lock,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import {
  createPostApi,
  getCategories,
  getTopics,
  type BackendCategory,
  type BackendTopic,
  uploadImageApi,
} from "@/lib/api"

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [visibility, setVisibility] = useState<"public" | "private">("public")
  const [scheduledDate, setScheduledDate] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showTopicsDropdown, setShowTopicsDropdown] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])

  useEffect(() => {
    Promise.all([getCategories(), getTopics()])
      .then(([cats, tpcs]) => {
        setCategories(cats)
        setTopics(tpcs)
      })
      .catch(() => {
        setCategories([])
        setTopics([])
      })
  }, [])

  const handleSaveDraft = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Гарчиг болон агуулга шаардлагатай")
      return
    }
    setIsSaving(true)
    setError("")
    try {
      await createPostApi({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        category: selectedCategory || undefined,
        topics: selectedTopics,
        visibility,
        status: "draft",
      })
      router.push("/dashboard/posts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ноорог хадгалахад алдаа")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Гарчиг болон агуулга шаардлагатай")
      return
    }
    setIsSaving(true)
    setError("")
    try {
      await createPostApi({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        category: selectedCategory || undefined,
        topics: selectedTopics,
        visibility,
        status: "published",
        publishedAt: scheduledDate || undefined,
      })
      router.push("/dashboard/posts")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нийтлэх үед алдаа")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleTopic = (slug: string) => {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/posts"
              className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Шинэ нийтлэл
              </h1>
              <p className="text-xs text-muted-foreground">
                Ноорог автоматаар хадгалагдаж байна
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Хадгалж байна..." : "Ноорог хадгалах"}
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <Eye className="h-4 w-4" />
              Урьдчилан харах
            </button>
            <button
              onClick={handlePublish}
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
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Нийтлэлийн гарчиг..."
                className="w-full border-none bg-transparent text-3xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Товч тайлбар
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Нийтлэлийн товч тайлбар (feed дээр харагдана)..."
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {excerpt.length}/200 тэмдэгт
              </p>
            </div>

            {/* Content Editor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Агуулга
              </label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Онцлох зураг
              </h3>
              {featuredImage ? (
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="h-full w-full object-cover"
                  />
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
                  <span className="mt-2 text-sm text-muted-foreground">
                    Зураг оруулах
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, WebP (16:9)
                  </span>
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

            {/* Category */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Ангилал
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {selectedCategory
                      ? categories.find((c) => c._id === selectedCategory)
                          ?.name
                      : "Ангилал сонгох"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      showCategoryDropdown && "rotate-180"
                    )}
                  />
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
                          selectedCategory === cat._id
                            ? "bg-primary/10 text-primary"
                            : "text-foreground"
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

            {/* Topics */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Сэдэв
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowTopicsDropdown(!showTopicsDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {selectedTopics.length > 0
                      ? `${selectedTopics.length} сэдэв сонгосон`
                      : "Сэдэв сонгох (заавал биш)"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      showTopicsDropdown && "rotate-180"
                    )}
                  />
                </button>
                {showTopicsDropdown && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card py-1 shadow-lg">
                    {topics.map((topic) => (
                      <button
                        key={topic._id}
                        onClick={() => toggleTopic(topic._id)}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted",
                          selectedTopics.includes(topic._id)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border",
                            selectedTopics.includes(topic._id)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border"
                          )}
                        >
                          {selectedTopics.includes(topic._id) && (
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </span>
                        {topic.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedTopics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTopics.map((slug) => {
                    const topic = topics.find((t) => t._id === slug)
                    return topic ? (
                      <span
                        key={slug}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                      >
                        {topic.name}
                        <button onClick={() => toggleTopic(slug)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ) : null
                  })}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Нийтлэх тохиргоо
              </h3>
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
                  <div>
                    <p className="text-sm font-medium text-foreground">Нийтэд</p>
                    <p className="text-xs text-muted-foreground">
                      Бүх хэрэглэгч харах боломжтой
                    </p>
                  </div>
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
                  <div>
                    <p className="text-sm font-medium text-foreground">Хувийн</p>
                    <p className="text-xs text-muted-foreground">
                      Зөвхөн та харах боломжтой
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                Товлосон огноо
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Хоосон үлдээвэл шууд нийтлэгдэнэ
              </p>
            </div>

            {/* AI Assist */}
            <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  AI Туслах
                </h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                AI ашиглан товч тайлбар, SEO гарчиг автоматаар үүсгэх
              </p>
              <button className="mt-3 w-full rounded-lg border border-primary/30 bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                AI-р үүсгэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
