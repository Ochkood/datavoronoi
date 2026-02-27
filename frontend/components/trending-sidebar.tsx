"use client"

import { TrendingUp, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const trendingTopics = [
  {
    rank: 1,
    title: "Монголын ДНБ 2025 онд 6.2%-р өсөв",
    category: "Эдийн засаг",
    color: "text-chart-1",
    views: "12.4K",
  },
  {
    rank: 2,
    title: "Дэлхийн AI хөрөнгө оруулалт рекорд тогтоов",
    category: "Технологи",
    color: "text-chart-2",
    views: "9.8K",
  },
  {
    rank: 3,
    title: "Уур амьсгалын өөрчлөлт: 2025 оны тоо баримт",
    category: "Байгаль орчин",
    color: "text-chart-4",
    views: "8.1K",
  },
  {
    rank: 4,
    title: "Крипто зах зээлийн 2025 оны хандлага",
    category: "Санхүү",
    color: "text-chart-5",
    views: "7.3K",
  },
  {
    rank: 5,
    title: "Монголын стартап экосистемийн хөгжил",
    category: "Бизнес",
    color: "text-chart-3",
    views: "5.9K",
  },
]

const popularTags = [
  "Эдийн засаг",
  "Инфографик",
  "AI",
  "Монгол",
  "Статистик",
  "Дэлхий",
  "Технологи",
  "Эрүүл мэнд",
]

export function TrendingSidebar() {
  return (
    <aside className="space-y-6">
      {/* Trending */}
      <div className="rounded-xl bg-card p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-card-foreground">
            Трэнд мэдээ
          </h2>
        </div>
        <div className="space-y-1">
          {trendingTopics.map((topic) => (
            <button
              key={topic.rank}
              className="group flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-secondary"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground">
                {topic.rank}
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold leading-tight text-card-foreground group-hover:text-primary">
                  {topic.title}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn("text-[11px] font-medium", topic.color)}>
                    {topic.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {topic.views} views
                  </span>
                </div>
              </div>
              <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="rounded-xl bg-card p-5 ring-1 ring-border">
        <h2 className="mb-3 text-sm font-bold text-card-foreground">
          Түгээмэл шошго
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="rounded-xl bg-primary p-5 text-primary-foreground">
        <h2 className="text-sm font-bold">Мэдээллийн товхимол</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/80">
          Шинэ инфографик, дата шинжилгээ бүрийг имэйлээр хүлээн авах
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="email"
            placeholder="Имэйл хаяг"
            className="flex-1 rounded-lg bg-primary-foreground/15 px-3 py-2 text-xs text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus:ring-1 focus:ring-primary-foreground/30"
          />
          <button className="rounded-lg bg-primary-foreground px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary-foreground/90">
            Бүртгүүлэх
          </button>
        </div>
      </div>
    </aside>
  )
}
