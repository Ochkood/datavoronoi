"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { TrendingUp, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { getPosts } from "@/lib/api"
import type { PostData } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"

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

function extractTextColorClass(categoryColor: string) {
  const parts = categoryColor.split(" ")
  const textClass = parts.find((part) => part.startsWith("text-"))
  return textClass || "text-primary"
}

export function TrendingSidebar() {
  const [items, setItems] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getPosts({ sort: "popular", limit: 5 })
      .then((posts) => {
        if (cancelled) return
        setItems(posts)
      })
      .catch(() => {
        if (cancelled) return
        setItems([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const trendingItems = useMemo(
    () =>
      items.map((item, index) => ({
        rank: index + 1,
        id: item.id,
        title: item.title,
        category: item.category,
        color: extractTextColorClass(item.categoryColor),
        views: Number(item.views || 0).toLocaleString("en-US"),
      })),
    [items]
  )

  return (
    <aside className="space-y-6">
      <div className="rounded-xl bg-card p-5 ring-1 ring-border">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-card-foreground">
            Трэнд мэдээ
          </h2>
        </div>
        <div className="space-y-1">
          {loading &&
            Array.from({ length: 5 }).map((_, idx) => (
              <div key={`trending-skeleton-${idx}`} className="flex items-start gap-3 px-2 py-2.5">
                <Skeleton className="h-6 w-6 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          {!loading &&
            trendingItems.map((topic) => (
              <Link
                key={topic.id}
                href={`/post/${topic.id}`}
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
              </Link>
            ))}
        </div>
      </div>

      <div className="rounded-xl bg-card p-5 ring-1 ring-border">
        <h2 className="mb-3 text-sm font-bold text-card-foreground">
          Түгээмэл шошго
        </h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

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
