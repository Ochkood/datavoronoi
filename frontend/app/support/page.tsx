"use client"

import { useState } from "react"
import {
  HelpCircle,
  MessageCircle,
  Mail,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { createFeedbackApi, type FeedbackType } from "@/lib/api"
import { toast } from "sonner"

const faqItems = [
  {
    question: "Datanews.mn гэж юу вэ?",
    answer:
      "Datanews.mn нь Монголын анхны дата сэтгүүл зүйн платформ бөгөөд инфографик, дата визуализаци, тоон мэдээлэлд суурилсан нийтлэлүүдийг нийтэлдэг.",
  },
  {
    question: "Хэрхэн бүртгүүлэх вэ?",
    answer:
      "Сайтын баруун дээд буланд байрлах профайл товчийг дарж, имэйл хаягаараа бүртгүүлнэ үү. Google болон Facebook хаягаар бас нэвтрэх боломжтой.",
  },
  {
    question: "Нийтлэл хадгалахад төлбөртэй юу?",
    answer:
      "Үгүй, нийтлэл хадгалах, хуваалцах, дагах зэрэг үндсэн функцүүд бүгд үнэгүй. Premium гишүүнчлэлтэй бол нэмэлт дата тайлан, шинжилгээнд хандах боломжтой.",
  },
  {
    question: "Өөрийн инфографик нийтлэх боломжтой юу?",
    answer:
      "Тийм. Бүртгэлтэй хэрэглэгчид Зохиолч эрхээр хүсэлт илгээж, батлагдсан тохиолдолд өөрсдийн дата визуализаци, инфографикийг нийтлэх боломжтой.",
  },
  {
    question: "Мэдээллийн эх сурвалжийг хаанаас авдаг вэ?",
    answer:
      "Бидний нийтлэлүүд ҮСХ, Дэлхийн Банк, НҮБ, Монголбанк зэрэг итгэмжлэгдсэн байгууллагуудын албан ёсны мэдээлэлд суурилдаг.",
  },
]

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "feedback" as FeedbackType,
    website: "",
  })

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Бүх талбарыг бөглөнө үү.")
      return
    }

    try {
      setSubmitting(true)
      await createFeedbackApi({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        type: form.type,
        website: form.website,
      })
      toast.success("Таны санал хүсэлт амжилттай илгээгдлээ.")
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "feedback",
        website: "",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Илгээх үед алдаа гарлаа.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Тусламж ба дэмжлэг
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Асуулт, санал хүсэлтээ бидэнд ирүүлнэ үү
            </p>
          </div>

          {/* FAQ */}
          <section className="mb-8">
            <h2 className="mb-4 text-base font-bold text-foreground">
              Түгээмэл асуултууд
            </h2>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-card ring-1 ring-border"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-card-foreground">
                      {item.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="border-t border-border px-5 py-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact options */}
          <section>
            <h2 className="mb-4 text-base font-bold text-foreground">
              Холбоо барих
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-border transition-all hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-card-foreground">
                  Имэйл
                </h3>
                <p className="text-xs text-muted-foreground">
                  info@datanews.mn
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-border transition-all hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-card-foreground">
                  Чат
                </h3>
                <p className="text-xs text-muted-foreground">
                  Шууд чатаар холбогдох
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-6 text-center ring-1 ring-border transition-all hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-card-foreground">
                  Гарын авлага
                </h3>
                <p className="text-xs text-muted-foreground">
                  Дэлгэрэнгүй зааварчилгаа
                </p>
              </div>
            </div>
          </section>

          {/* Contact form */}
          <section className="mt-8">
            <h2 className="mb-4 text-base font-bold text-foreground">
              Санал хүсэлт илгээх
            </h2>
            <div className="rounded-xl bg-card p-6 ring-1 ring-border">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                      Нэр
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Таны нэр"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                      Имэйл
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Имэйл хаяг"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    value={form.website}
                    onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                    Төрөл
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, type: e.target.value as FeedbackType }))
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="feedback">Сэтгэгдэл</option>
                    <option value="suggestion">Санал</option>
                    <option value="bug">Алдаа</option>
                    <option value="publisher_request">Нийтлэгч хүсэлт</option>
                    <option value="other">Бусад</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                    Гарчиг
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Санал хүсэлтийн гарчиг"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-card-foreground">
                    Мессеж
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Таны санал хүсэлт..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="self-start rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Илгээж байна..." : "Илгээх"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
