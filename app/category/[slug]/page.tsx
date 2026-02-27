"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import { LayoutGrid, List, Newspaper, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { PostCard } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { CategoryStatsView } from "@/components/category-stats"
import {
  getPostsByCategory,
  getCategoryBySlug,
  categoryStats,
} from "@/lib/data"

type TabType = "feed" | "stats"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const category = getCategoryBySlug(slug)
  const categoryPosts = getPostsByCategory(slug)
  const stats = categoryStats[slug]

  const [activeTab, setActiveTab] = useState<TabType>("feed")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (!category) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        {/* Category Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 pl-14 md:px-6 lg:pl-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    category.bgColor
                  )}
                >
                  <Newspaper className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {category.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-secondary p-1">
                  <button
                    onClick={() => setActiveTab("feed")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      activeTab === "feed"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Newspaper className="h-4 w-4" />
                    Мэдээ
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      activeTab === "stats"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Статистик дата
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8 xl:flex-row">
            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "feed" ? (
                <>
                  {/* Feed Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {category.name} мэдээ
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {categoryPosts.length} нийтлэл
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                          viewMode === "grid"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        aria-label="Grid view"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                          viewMode === "list"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                        aria-label="List view"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Posts */}
                  {categoryPosts.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryPosts.map((post) => (
                          <PostCard key={post.id} post={post} variant="default" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {categoryPosts.map((post) => (
                          <PostCard key={post.id} post={post} variant="list" />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Newspaper className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">
                        Мэдээ олдсонгүй
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Энэ ангилалд одоогоор мэдээ байхгүй байна.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Statistics Tab */
                stats ? (
                  <CategoryStatsView stats={stats} categoryColor={category.color} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      Статистик мэдээлэл байхгүй
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Энэ ангилалд одоогоор статистик дата нэмэгдээгүй байна.
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-full flex-shrink-0 xl:w-[320px]">
              <div className="sticky top-[120px]">
                <TrendingSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
