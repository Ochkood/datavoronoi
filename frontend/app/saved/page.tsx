"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, List, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { getBookmarks, toggleBookmarkApi } from "@/lib/api"
import { RouteGuard } from "@/components/auth/route-guard"

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedPosts, setSavedPosts] = useState<PostData[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    getBookmarks()
      .then((items) => setSavedPosts(items))
      .catch(() => setSavedPosts([]))
  }, [])

  const handleRemove = async (postId: string) => {
    try {
      await toggleBookmarkApi(postId)
      setSavedPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Хадгалалт цуцлахад алдаа")
    }
  }

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {/* Page heading */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  Хадгалсан
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Таны хадгалсан нийтлэлүүд ({savedPosts.length})
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
          {savedPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-20 ring-1 ring-border">
              <Bookmark className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Хадгалсан нийтлэл байхгүй байна
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Нийтлэлийн хадгалах товч дарж хадгална уу
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedPosts.map((post) => (
                <div key={post.id}>
                  <PostCard
                    post={post}
                    variant="default"
                    onBookmarkChange={(bookmarked) => {
                      if (!bookmarked) {
                        setSavedPosts((prev) => prev.filter((p) => p.id !== post.id))
                      }
                    }}
                  />
                  <button
                    onClick={() => handleRemove(post.id)}
                    className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Хадгалснаас хасах
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {savedPosts.map((post) => (
                <div key={post.id}>
                  <PostCard
                    post={post}
                    variant="list"
                    onBookmarkChange={(bookmarked) => {
                      if (!bookmarked) {
                        setSavedPosts((prev) => prev.filter((p) => p.id !== post.id))
                      }
                    }}
                  />
                  <button
                    onClick={() => handleRemove(post.id)}
                    className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Хадгалснаас хасах
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </RouteGuard>
  )
}
