"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  const categoryOptions = [
    "Эдийн засаг",
    "Технологи",
    "Байгаль орчин",
    "Эрүүл мэнд",
    "Санхүү",
    "Дэлхий",
  ]

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
    setIsLoading(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex flex-1 items-center justify-center lg:ml-[260px] px-4">
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
        {/* Header */}
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
          {/* Hero */}
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

          {/* Benefits */}
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

          {/* Application Form */}
          <div className="mt-12 rounded-2xl bg-card p-6 ring-1 ring-border md:p-8">
            <h2 className="text-xl font-bold text-foreground">
              Хүсэлтийн маягт
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Доорх мэдээллийг бүрэн бөглөнө үү. Бид таны хүсэлтийг шалгаж,
              эргэж холбогдох болно.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Personal Info */}
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

              {/* Professional Info */}
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

              {/* Categories */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Сонирхож буй ангилал{" "}
                  <span className="text-destructive">*</span>
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Нэг болон түүнээс дээш ангилал сонгоно уу
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
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
                  ))}
                </div>
              </div>

              {/* Sample Work */}
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

              {/* Bio */}
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

              {/* Terms */}
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
                  Би{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Нийтлэгчийн гэрээ
                  </Link>{" "}
                  болон{" "}
                  <Link href="/guidelines" className="text-primary hover:underline">
                    Контентын удирдамж
                  </Link>
                  -ыг уншиж, зөвшөөрч байна.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.agreeTerms ||
                  formData.categories.length === 0
                }
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                  (isLoading ||
                    !formData.agreeTerms ||
                    formData.categories.length === 0) &&
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
