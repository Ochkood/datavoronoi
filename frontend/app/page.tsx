"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { SiteFooter } from "@/components/site-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { getPostsPage } from "@/lib/api"

const PAGE_SIZE = 10
const MAX_HOME_POSTS = 50

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const requestKeyRef = useRef("")
  const postsRef = useRef<PostData[]>([])

  useEffect(() => {
    postsRef.current = posts
  }, [posts])

  const baseParams = useMemo(
    () =>
      activeTab === "popular"
        ? { sort: "popular" as const }
        : activeTab === "featured"
          ? { featured: "true" as const, sort: "latest" as const }
          : { sort: "latest" as const },
    [activeTab]
  )

  const loadPage = useCallback(
    async (targetPage: number, replace = false) => {
      const reqKey = `${activeTab}:${targetPage}:${replace ? "replace" : "append"}`
      requestKeyRef.current = reqKey

      if (replace) setLoading(true)
      else setLoadingMore(true)

      try {
        const data = await getPostsPage({
          ...baseParams,
          page: targetPage,
          limit: PAGE_SIZE,
        })
        if (requestKeyRef.current !== reqKey) return

        const currentPosts = postsRef.current
        const merged = replace
          ? data.items
          : [
              ...currentPosts,
              ...data.items.filter((x) => !currentPosts.some((p) => p.id === x.id)),
            ]
        const capped = merged.slice(0, MAX_HOME_POSTS)

        setPosts(capped)
        setPage(targetPage)

        const maxAllowed = Math.min(data.pagination.total, MAX_HOME_POSTS)
        setHasMore(capped.length < maxAllowed && data.items.length === PAGE_SIZE)
      } catch {
        if (requestKeyRef.current !== reqKey) return
        if (replace) setPosts([])
        setHasMore(false)
      } finally {
        if (requestKeyRef.current !== reqKey) return
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [activeTab, baseParams]
  )

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    void loadPage(1, true)
  }, [activeTab, loadPage])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || loading || loadingMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) return
        void loadPage(page + 1, false)
      },
      { rootMargin: "300px 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadPage, loading, loadingMore, page])

  const tabTitle =
    activeTab === "popular"
      ? "Шилдэг мэдээ"
      : activeTab === "featured"
        ? "Онцлох мэдээ"
        : "Шинэ мэдээ"

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8 xl:flex-row">
            <div className="flex-1">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">{tabTitle}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {loading ? "..." : posts.length} нийтлэл
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

              {loading ? (
                viewMode === "grid" ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={`home-grid-skeleton-${idx}`}
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
                        key={`home-list-skeleton-${idx}`}
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
              ) : viewMode === "grid" ? (
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
              )}

              {!loading && (hasMore || loadingMore) ? (
                <div ref={sentinelRef} className="mt-4">
                  {loadingMore ? (
                    viewMode === "grid" ? (
                      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={`home-more-grid-skeleton-${idx}`}
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
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={`home-more-list-skeleton-${idx}`}
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
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="w-full flex-shrink-0 xl:w-[320px]">
              <div className="sticky top-[65px]">
                <TrendingSidebar />
              </div>
            </div>
          </div>

          <SiteFooter />
        </div>
      </main>
    </div>
  )
}
