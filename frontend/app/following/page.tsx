"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutGrid, List, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { RouteGuard } from "@/components/auth/route-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { FollowButton } from "@/components/follow-button"
import {
  getMyFollowingFeedApi,
  toggleFollowUserApi,
  type FollowingAuthor,
} from "@/lib/api"

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [authors, setAuthors] = useState<FollowingAuthor[]>([])
  const [followingPosts, setFollowingPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const randomAuthors = useMemo(() => {
    const items = [...authors]
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = items[i]
      items[i] = items[j]
      items[j] = tmp
    }
    return items.slice(0, 4)
  }, [authors])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    getMyFollowingFeedApi(40)
      .then((data) => {
        if (cancelled) return
        setAuthors(data.authors)
        setFollowingPosts(data.posts)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Дагаж буй мэдээлэл ачаалж чадсангүй")
        setAuthors([])
        setFollowingPosts([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const toggleFollow = async (id: string) => {
    if (actionLoading[id]) return
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await toggleFollowUserApi(id)
      if (!res.following) {
        setAuthors((prev) => prev.filter((a) => a.id !== id))
        setFollowingPosts((prev) => prev.filter((p) => p.authorId !== id))
      } else {
        setAuthors((prev) =>
          prev.map((a) => (a.id === id ? { ...a, following: true } : a))
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Follow төлөв өөрчлөхөд алдаа гарлаа")
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
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
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  Дагаж буй
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Таны дагаж буй зохиолчид болон тэдний сүүлийн нийтлэлүүд
              </p>
            </div>
            <Link
              href="/following/people"
              className="inline-flex items-center rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Дагасан бүх хүмүүсийг харах
            </Link>
          </div>

          {/* Authors */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`following-author-skeleton-${idx}`}
                  className="rounded-xl bg-card p-5 ring-1 ring-border"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            {!loading && randomAuthors.map((author) => (
              <div
                key={author.id}
                className="flex flex-col items-center gap-3 rounded-xl bg-card p-5 text-center ring-1 ring-border transition-all hover:shadow-md"
              >
                <div className="h-16 w-16 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-card-foreground">
                    {author.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {author.bio}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-semibold text-card-foreground">
                      {author.posts}
                    </span>{" "}
                    нийтлэл
                  </span>
                  <span>
                    <span className="font-semibold text-card-foreground">
                      {author.followers}
                    </span>{" "}
                    дагагч
                  </span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <FollowButton
                    following={author.following}
                    loading={Boolean(actionLoading[author.id])}
                    onClick={() => void toggleFollow(author.id)}
                    className="flex-1 justify-center text-xs"
                  />
                  <Link
                    href={`/publisher/${author.slug || author.id}`}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    Профайл үзэх
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Feed title + view toggle */}
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Сүүлийн нийтлэлүүд
            </h2>
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
                    key={`following-grid-skeleton-${idx}`}
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
                    key={`following-list-skeleton-${idx}`}
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
          ) : followingPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-20 ring-1 ring-border">
              <p className="text-sm font-medium text-muted-foreground">
                Та одоогоор хэнийг ч дагаагүй байна
              </p>
              <p className="mt-1 text-xs text-muted-foreground/80">
                Админ хэсгээс эсвэл зохиолчийн профайлаас дагаж эхлээрэй
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {followingPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {followingPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="list" />
              ))}
            </div>
          )}
        </div>
      </main>
      </div>
    </RouteGuard>
  )
}
