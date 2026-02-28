"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { getPosts } from "@/lib/api"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8 xl:flex-row">
            {/* Posts area */}
            <div className="flex-1">
              {/* Title + view toggle */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Newsfeed
                  </h2>
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

              {/* Posts */}
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
            </div>

            {/* Right sidebar */}
            <div className="w-full flex-shrink-0 xl:w-[320px]">
              <div className="sticky top-[65px]">
                <TrendingSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
