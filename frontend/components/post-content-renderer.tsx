"use client"

import { useMemo } from "react"
import { CategoryStatsView } from "@/components/category-stats"
import { splitPostContentByEmbeds } from "@/lib/post-embeds"

interface PostContentRendererProps {
  html: string
  categoryColor: string
}

const ARTICLE_CLASS =
  "post-content max-w-none text-foreground/90 leading-relaxed [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_strong]:font-bold [&_em]:italic [&_a]:text-primary [&_a]:underline [&_img]:my-5 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:h-auto"

export function PostContentRenderer({ html, categoryColor }: PostContentRendererProps) {
  const segments = useMemo(() => splitPostContentByEmbeds(html || ""), [html])

  return (
    <div className="space-y-6">
      {segments.map((segment, idx) => {
        if (segment.type === "embed") {
          const hasHighlights = segment.embed.stats.highlights.length > 0
          const section = segment.embed.kind === "highlights" ? "highlights" : "charts"

          if (!hasHighlights && section === "highlights") {
            return null
          }
          if (segment.embed.kind === "charts" && segment.embed.stats.charts.length === 0) {
            return null
          }

          return (
            <div key={`embed-${idx}`} className="rounded-xl bg-card/40 p-4 ring-1 ring-border">
              <CategoryStatsView
                stats={segment.embed.stats}
                categoryColor={categoryColor}
                section={section}
                showSourceNote={false}
                highlightsTitle={
                  section === "highlights" ? segment.embed.title || "Гол үзүүлэлтүүд" : undefined
                }
                chartsTitle={
                  section === "charts" ? segment.embed.title || "Статистик график" : undefined
                }
              />
            </div>
          )
        }

        const cleaned = segment.html.trim()
        if (!cleaned) return null

        return (
          <div
            key={`html-${idx}`}
            className={ARTICLE_CLASS}
            dangerouslySetInnerHTML={{ __html: segment.html }}
          />
        )
      })}
    </div>
  )
}
