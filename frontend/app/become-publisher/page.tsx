"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  PenTool,
  TrendingUp,
  Users,
  Award,
  Upload,
  FileText,
  CheckCircle,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import {
  createFeedbackApi,
  getCategories,
  getMeApi,
  getTopics,
} from "@/lib/api"
import { getAccessToken } from "@/lib/auth"
import { toast } from "sonner"

const benefits = [
  {
    icon: PenTool,
    title: "Дата визуализаци",
    description: "Өөрийн инфографик, дата визуализацийг хуваалцаарай",
  },
  {
    icon: TrendingUp,
    title: "Хүрэх хүрээ",
    description: "50,000+ идэвхтэй уншигчдад хүрэх боломж",
  },
  {
    icon: Users,
    title: "Нийгэмлэг",
    description: "Мэргэжлийн сэтгүүлчид, шинжээчидтэй холбогдох",
  },
  {
    icon: Award,
    title: "Хүлээн зөвшөөрөгдөх",
    description: "Таны бүтээлийг олон нийтэд таниулах",
  },
]

export default function BecomePublisherPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null)
  const [domainOptions, setDomainOptions] = useState<string[]>([])
  const [loadingDomains, setLoadingDomains] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    experience: "",
    portfolio: "",
    categories: [] as string[],
    sampleWork: "",
    bio: "",
    agreeTerms: false,
  })

  useEffect(() => {
    if (!getAccessToken()) {
      setIsAuthed(false)
      return
    }

    getMeApi()
      .then((me) => {
        if (me.role === "publisher" || me.role === "admin") {
          toast.info("Та аль хэдийн нийтлэгч байна.")
          router.replace("/dashboard")
          return
        }
        setIsAuthed(true)
        setFormData((prev) => ({
          ...prev,
          name: prev.name || me.name || "",
          email: prev.email || me.email || "",
          phone: prev.phone || me.phone || "",
        }))
      })
      .catch(() => setIsAuthed(false))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingDomains(true)

    Promise.all([getCategories(), getTopics()])
      .then(([categories, topics]) => {
        if (cancelled) return
        const options = [
          ...categories.map((c) => c.name).filter(Boolean),
          ...topics.map((t) => `#${t.name}`).filter(Boolean),
        ]
        const unique = Array.from(new Set(options))
        unique.sort((a, b) => a.localeCompare(b, "mn"))
        setDomainOptions([...unique, "Бусад"])
      })
      .catch(() => {
        if (cancelled) return
        setDomainOptions(["Бусад"])
      })
      .finally(() => {
        if (cancelled) return
        setLoadingDomains(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthed) {
      toast.error("Та эхлээд бүртгүүлнэ үү.")
      router.push("/register")
      return
    }
    if (formData.categories.length === 0) {
      toast.error("Та аль салбарын судлаач вэ? хэсгээс дор хаяж нэгийг сонгоно уу.")
      return
    }

    setIsLoading(true)
    try {
      const subject = `Publisher хүсэлт: ${formData.name || "Хэрэглэгч"}`
      const message = [
        `Нэр: ${formData.name}`,
        `Имэйл: ${formData.email}`,
        `Утас: ${formData.phone || "-"}`,
        `Байгууллага: ${formData.organization || "-"}`,
        `Албан тушаал: ${formData.position || "-"}`,
        `Туршлага: ${formData.experience || "-"}`,
        `Портфолио: ${formData.portfolio || "-"}`,
        `Салбар: ${formData.categories.join(", ") || "-"}`,
        `Жишээ бүтээл: ${formData.sampleWork || "-"}`,
        `Танилцуулга: ${formData.bio || "-"}`,
      ].join("\n")

      await createFeedbackApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject,
        message,
        type: "publisher_request",
      })

      setIsSubmitted(true)
      toast.success("Нийтлэгч болох хүсэлт илгээгдлээ.")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Хүсэлт илгээх үед алдаа гарлаа."
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthed === null && !isSubmitted) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex flex-1 items-center justify-center px-4 lg:ml-[260px]">
          <p className="text-sm text-muted-foreground">Хуудас ачаалж байна...</p>
        </main>
      </div>
    )
  }

  if (isAuthed === false && !isSubmitted) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex flex-1 items-center justify-center px-4 lg:ml-[260px]">
          <div className="max-w-md rounded-2xl bg-card p-6 text-center ring-1 ring-border">
            <h1 className="text-xl font-bold text-foreground">Нийтлэгч болох</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Нийтлэгч болох хүсэлт илгээхийн тулд та эхлээд бүртгүүлнэ үү.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Бүртгүүлэх
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Нэвтрэх
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex flex-1 items-center justify-center px-4 lg:ml-[260px]">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-chart-4/20">
              <CheckCircle className="h-10 w-10 text-chart-4" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-foreground">
              Хүсэлт илгээгдлээ!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Таны нийтлэгч болох хүсэлтийг хүлээн авлаа. Бид 3-5 ажлын өдрийн
              дотор танд хариу өгөх болно.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Нүүр хуудас
              </Link>
              <Link
                href="/explore"
                className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Мэдээ үзэх
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-4 pl-14 md:px-6 lg:pl-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Буцах
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-foreground">
              Нийтлэгч болох
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Datanews.mn-д нийтлэгч болж, өөрийн дата визуализаци, инфографикаа
              олон нийтэд хүргээрэй.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl bg-card p-5 ring-1 ring-border"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <benefit.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl bg-card p-6 ring-1 ring-border md:p-8">
            <h2 className="text-xl font-bold text-foreground">Хүсэлтийн маягт</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Доорх мэдээллийг бүрэн бөглөнө үү. Бид таны хүсэлтийг шалгаж,
              эргэж холбогдох болно.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  Хувийн мэдээлэл
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Нэр <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Овог, нэр"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      И-мэйл <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Утасны дугаар
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="99xxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Байгууллага
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Ажиллаж буй байгууллага"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  Мэргэжлийн мэдээлэл
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Албан тушаал
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) =>
                        setFormData({ ...formData, position: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Жишээ: Дата шинжээч, Сэтгүүлч"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Туршлага <span className="text-destructive">*</span>
                    </label>
                    <select
                      required
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Сонгоно уу</option>
                      <option value="0-1">1 жил хүртэл</option>
                      <option value="1-3">1-3 жил</option>
                      <option value="3-5">3-5 жил</option>
                      <option value="5+">5+ жил</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">
                      Портфолио линк
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) =>
                        setFormData({ ...formData, portfolio: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Та аль салбарын судлаач вэ? <span className="text-destructive">*</span>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Нэг болон түүнээс дээш сонголт сонгоно уу
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {loadingDomains ? (
                    <span className="text-sm text-muted-foreground">Сонголтууд ачаалж байна...</span>
                  ) : (
                    domainOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          formData.categories.includes(category)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        )}
                      >
                        {category}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Upload className="h-4 w-4 text-primary" />
                  Жишээ бүтээл
                </h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground">
                    Жишээ нийтлэлийн линк эсвэл тайлбар
                  </label>
                  <textarea
                    value={formData.sampleWork}
                    onChange={(e) =>
                      setFormData({ ...formData, sampleWork: e.target.value })
                    }
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Өөрийн хийсэн дата визуализаци, инфографик, нийтлэлийн линк оруулна уу"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  Товч танилцуулга <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Өөрийн тухай товч бичнэ үү. Яагаад Datanews-д нийтлэгч болохыг хүсч байгаа вэ?"
                />
              </div>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  required
                  className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  Би <Link href="/publisher-contract" className="text-primary hover:underline">Нийтлэгчийн гэрээ</Link>{" "}
                  болон <Link href="/content-guidelines" className="text-primary hover:underline">Контентын удирдамж</Link>
                  -ыг уншиж, зөвшөөрч байна.
                </span>
              </label>

              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.agreeTerms ||
                  formData.categories.length === 0 ||
                  loadingDomains
                }
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                  (isLoading ||
                    !formData.agreeTerms ||
                    formData.categories.length === 0 ||
                    loadingDomains) &&
                    "cursor-not-allowed opacity-50"
                )}
              >
                {isLoading ? (
                  "Илгээж байна..."
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Хүсэлт илгээх
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
