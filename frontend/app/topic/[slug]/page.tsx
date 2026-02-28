"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { LayoutGrid, List, Newspaper, BarChart3, Calendar, Hash } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { PostCard, type PostData } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { CategoryStatsView } from "@/components/category-stats"
import { Skeleton } from "@/components/ui/skeleton"
import { topicStats } from "@/lib/data"
import { getPosts, getTopics, type BackendTopic } from "@/lib/api"

type TabType = "feed" | "stats"

export default function TopicPage() {
  const params = useParams()
  const slug = params.slug as string

  const [topics, setTopics] = useState<BackendTopic[]>([])
  const [topicPosts, setTopicPosts] = useState<PostData[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const stats = topicStats[slug]

  const [activeTab, setActiveTab] = useState<TabType>("feed")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    setLoadingTopics(true)
    getTopics()
      .then((res) => setTopics(res))
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false))
  }, [])

  const topic = useMemo(
    () => topics.find((t) => t.slug === slug),
    [topics, slug]
  )

  useEffect(() => {
    if (!topic?._id) {
      if (!loadingTopics) setLoadingPosts(false)
      return
    }

    setLoadingPosts(true)
    getPosts({ topic: topic._id })
      .then((res) => setTopicPosts(res))
      .catch(() => setTopicPosts([]))
      .finally(() => setLoadingPosts(false))
  }, [topic?._id, loadingTopics])

  if (!loadingTopics && !topic && topics.length > 0) {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        {/* Topic Header with Image */}
        <header className="relative border-b border-border">
          {/* Background Image */}
          <div className="absolute inset-0 h-48 overflow-hidden">
            <Image
              src={topic?.image || "/placeholder.jpg"}
              alt={topic?.name || "topic"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-20 pl-14 md:px-6 lg:pl-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-card/80">
                  <Hash className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Сэдэв</span>
                  {topic?.startDate && (
                    <>
                      <span className="text-card/40">|</span>
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">{topic.startDate}</span>
                    </>
                  )}
                </div>
                <h1 className="mt-2 text-2xl font-bold text-card md:text-3xl text-balance">
                  {topic?.name || "..."}
                </h1>
                <p className="mt-1 text-sm text-card/80">
                  {topic?.description}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-card/20 backdrop-blur-sm p-1">
                  <button
                    onClick={() => setActiveTab("feed")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      activeTab === "feed"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-card/80 hover:text-card"
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
                        : "text-card/80 hover:text-card"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Статистик
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
                        Холбоотой мэдээ
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {topicPosts.length} нийтлэл
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
                  {loadingPosts ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                          <div
                            key={`topic-grid-skeleton-${idx}`}
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
                            key={`topic-list-skeleton-${idx}`}
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
                  ) : topicPosts.length > 0 ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {topicPosts.map((post) => (
                          <PostCard key={post.id} post={post} variant="default" />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {topicPosts.map((post) => (
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
                        Энэ сэдвээр одоогоор мэдээ байхгүй байна.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                /* Statistics Tab */
                stats ? (
                  <CategoryStatsView stats={stats} categoryColor="text-primary" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      Статистик мэдээлэл байхгүй
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Энэ сэдвээр одоогоор статистик дата нэмэгдээгүй байна.
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
