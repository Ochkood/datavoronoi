"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, ChevronLeft, ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { RouteGuard } from "@/components/auth/route-guard"
import { Skeleton } from "@/components/ui/skeleton"
import { FollowButton } from "@/components/follow-button"
import {
  getMyFollowPeopleApi,
  toggleFollowUserApi,
  type FollowPeoplePage,
} from "@/lib/api"

type TabType = "following" | "followers"

export default function FollowPeoplePage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [listTab, setListTab] = useState<TabType>("following")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<FollowPeoplePage>({
    items: [],
    pagination: { total: 0, page: 1, limit: 12, totalPages: 1 },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")
    getMyFollowPeopleApi({ type: listTab, page, limit: 8 })
      .then((res) => {
        if (cancelled) return
        setData(res)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Жагсаалт ачаалж чадсангүй")
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [listTab, page])

  const toggleFollow = async (id: string) => {
    if (actionLoading[id]) return
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const res = await toggleFollowUserApi(id)
      setData((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === id ? { ...it, following: res.following } : it
        ),
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Follow төлөв шинэчлэхэд алдаа гарлаа")
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const totalPages = data.pagination.totalPages || 1

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

            <div className="mb-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">Хүмүүс</h1>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Дагуулсан болон дагасан хүмүүсийн жагсаалт
                </p>
              </div>
              <Link
                href="/following"
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Буцах
              </Link>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setListTab("following")
                  setPage(1)
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  listTab === "following"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Following
              </button>
              <button
                onClick={() => {
                  setListTab("followers")
                  setPage(1)
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                  listTab === "followers"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                Followers
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading &&
                Array.from({ length: 8 }).map((_, idx) => (
                  <div key={`follow-people-skeleton-${idx}`} className="rounded-xl bg-card p-5 ring-1 ring-border">
                    <div className="flex flex-col items-center gap-3">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-8 w-full rounded-lg" />
                    </div>
                  </div>
                ))}

              {!loading &&
                data.items.map((person) => (
                  <div
                    key={person.id}
                    className="flex flex-col items-center gap-3 rounded-xl bg-card p-5 text-center ring-1 ring-border"
                  >
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                      <Image
                        src={person.avatar || "/placeholder-user.jpg"}
                        alt={person.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-card-foreground">{person.name}</h3>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {person.bio || "Тайлбар байхгүй"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{person.posts} нийтлэл</span>
                      <span>{person.followers} дагагч</span>
                    </div>
                    <div className="flex w-full items-center gap-2">
                      <FollowButton
                        following={person.following}
                        loading={Boolean(actionLoading[person.id])}
                        onClick={() => void toggleFollow(person.id)}
                        className="flex-1 justify-center text-xs"
                      />
                      <Link
                        href={`/publisher/${person.id}`}
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        Профайл үзэх
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="px-3 text-sm text-muted-foreground">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  )
}
