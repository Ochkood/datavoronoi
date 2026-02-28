"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { LayoutGrid, List, Newspaper, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { DynamicIcon } from "@/components/admin/icon-picker"
import { AppSidebar } from "@/components/app-sidebar"
import { PostCard, type PostData } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { CategoryStatsView } from "@/components/category-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { categoryStats } from "@/lib/data"
import { getCategories, getPosts, type BackendCategory } from "@/lib/api"

type TabType = "feed" | "stats"
type FeedSort = "latest" | "popular"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [posts, setPosts] = useState<PostData[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const stats = categoryStats[slug]

  const [activeTab, setActiveTab] = useState<TabType>("feed")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [feedSort, setFeedSort] = useState<FeedSort>("latest")

  useEffect(() => {
    setLoadingCategories(true)
    getCategories()
      .then((res) => {
        setCategories(res)
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false))
  }, [])

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug]
  )

  useEffect(() => {
    if (!category?._id) {
      if (!loadingCategories) setLoadingPosts(false)
      return
    }

    setLoadingPosts(true)
    getPosts({ category: category._id, sort: feedSort })
      .then((res) => setPosts(res))
      .catch(() => setPosts([]))
      .finally(() => setLoadingPosts(false))
  }, [category?._id, loadingCategories, feedSort])

  if (!loadingCategories && !category && categories.length > 0) {
    notFound()
  }

  const categoryColorMap: Record<string, string> = {
    economy: "text-chart-1",
    technology: "text-chart-2",
    world: "text-chart-3",
    environment: "text-chart-4",
    finance: "text-chart-5",
    health: "text-destructive",
  }
  const categoryBgMap: Record<string, string> = {
    economy: "bg-chart-1",
    technology: "bg-chart-2",
    world: "bg-chart-3",
    environment: "bg-chart-4",
    finance: "bg-chart-5",
    health: "bg-destructive",
  }
  const categoryColor = category ? categoryColorMap[category.slug] || "text-primary" : "text-primary"
  const categoryBgColor = category ? categoryBgMap[category.slug] || "bg-primary" : "bg-primary"
  const categoryName = category?.name || "..."
  const categoryDescription = category?.description || ""

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        {/* Category Header with Banner */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          {/* Banner Image */}
          {category?.bannerImage && (
            <div className="relative h-32 w-full lg:h-40">
              <Image
                src={category.bannerImage}
                alt={categoryName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
            </div>
          )}
          
          <div className={cn(
            "mx-auto max-w-7xl px-4 py-4 pl-14 md:px-6 lg:pl-6",
            category?.bannerImage && "-mt-12 relative"
          )}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl shadow-lg",
                    categoryBgColor,
                    category?.bannerImage && "border-2 border-card"
                  )}
                >
                  <DynamicIcon 
                    name={category?.icon} 
                    className="h-6 w-6 text-white" 
                    fallback={Newspaper}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {categoryName}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {categoryDescription}
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
                        {categoryName} мэдээ
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {posts.length} нийтлэл
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
                        <button
                          onClick={() => setFeedSort("latest")}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                            feedSort === "latest"
                              ? "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Шинэ
                        </button>
                        <button
                          onClick={() => setFeedSort("popular")}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                            feedSort === "popular"
                              ? "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Их уншсан
                        </button>
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
                  </div>

                  {/* Posts */}
                  {loadingPosts ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={`post-grid-skeleton-${idx}`}
                            className="overflow-hidden rounded-xl border border-border bg-card"
                          >
                            <Skeleton className="h-40 w-full rounded-none" />
                            <div className="space-y-3 p-4">
                              <Skeleton className="h-4 w-2/3" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-4/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={`post-list-skeleton-${idx}`}
                            className="rounded-xl border border-border bg-card p-4"
                          >
                            <div className="flex gap-4">
                              <Skeleton className="h-24 w-32 rounded-lg" />
                              <div className="flex-1 space-y-3">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : posts.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                          <PostCard key={post.id} post={post} variant="default" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {posts.map((post) => (
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
                  <CategoryStatsView stats={stats} categoryColor={categoryColor} />
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
