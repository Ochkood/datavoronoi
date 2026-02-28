"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, List, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategories, getPosts, type BackendCategory } from "@/lib/api"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("Бүгд")
  const [posts, setPosts] = useState<PostData[]>([])
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPosts(), getCategories()])
      .then(([p, c]) => {
        setPosts(p)
        setCategories(c)
      })
      .catch(() => {
        setPosts([])
        setCategories([])
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryFilters = ["Бүгд", ...categories.map((c) => c.name)]

  const filteredPosts =
    activeCategory === "Бүгд"
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Судлах</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ангилал бүрээр инфографик, дата визуализаци судлах
            </p>
          </div>

          {/* Category filter + view toggle */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton key={`filter-skeleton-${idx}`} className="h-7 w-16 rounded-full" />
                  ))
                : categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
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

          {/* Results count */}
          {loading ? (
            <Skeleton className="mb-4 h-4 w-36" />
          ) : (
            <p className="mb-4 text-xs text-muted-foreground">
              {filteredPosts.length} нийтлэл олдлоо
            </p>
          )}

          {/* Posts */}
          {loading ? (
            viewMode === "grid" ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={`explore-grid-skeleton-${idx}`}
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
                    key={`explore-list-skeleton-${idx}`}
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
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-20 ring-1 ring-border">
              <p className="text-sm font-medium text-muted-foreground">
                Энэ ангилалд нийтлэл олдсонгүй
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="list" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
