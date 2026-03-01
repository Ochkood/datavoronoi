"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LayoutGrid,
  List,
  Users,
  FileText,
  Phone,
  PenSquare,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { FollowButton } from "@/components/follow-button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getPublicAuthorProfileApi,
  toggleFollowUserApi,
  type PublicAuthorProfile,
} from "@/lib/api"
import { getAccessToken } from "@/lib/auth"
import { toast } from "sonner"

export default function PublisherProfilePage() {
  const params = useParams()
  const identifier = params.id as string

  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [profile, setProfile] = useState<PublicAuthorProfile | null>(null)
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundUser, setNotFoundUser] = useState(false)
  const [error, setError] = useState("")
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")
    setNotFoundUser(false)

    getPublicAuthorProfileApi(identifier)
      .then((data) => {
        if (cancelled) return
        setProfile(data.profile)
        setPosts(data.posts)
      })
      .catch((e) => {
        if (cancelled) return
        const message = e instanceof Error ? e.message : "Нийтлэгч олдсонгүй"
        if (message.toLowerCase().includes("not found")) {
          setNotFoundUser(true)
        } else {
          setError(message)
        }
        setProfile(null)
        setPosts([])
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [identifier])

  const handleToggleFollow = async () => {
    if (!profile) return
    if (!getAccessToken()) {
      toast.error("Та эхлээд нэвтэрнэ үү")
      return
    }

    setFollowLoading(true)
    try {
      const res = await toggleFollowUserApi(profile.id)
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: res.following,
              followers: res.following
                ? prev.followers + 1
                : Math.max(prev.followers - 1, 0),
            }
          : prev
      )
      toast.success(res.following ? "Follow амжилттай" : "Unfollow амжилттай")
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Дагах төлөв шинэчлэхэд алдаа"
      )
    } finally {
      setFollowLoading(false)
    }
  }

  if (!loading && notFoundUser) {
    notFound()
  }

  return (
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

          <section className="mb-8 rounded-2xl bg-card p-6 ring-1 ring-border">
            {loading || !profile ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-10 w-28 rounded-lg" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
                      <Image
                        src={profile.avatar || "/placeholder-user.jpg"}
                        alt={profile.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="truncate text-2xl font-bold text-foreground">
                          {profile.name}
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          <PenSquare className="h-3.5 w-3.5" />
                          Publisher
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {profile.bio || "Тайлбар байхгүй"}
                      </p>
                    </div>
                  </div>

                  <div className="sm:shrink-0">
                    <FollowButton
                      following={profile.isFollowing}
                      loading={followLoading}
                      onClick={() => void handleToggleFollow()}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {profile.posts} нийтлэл
                  </span>
                  <span className="hidden h-4 w-px bg-border sm:inline-block" />
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {profile.followers} дагагч
                  </span>
                  {profile.experience ? (
                    <>
                      <span className="hidden h-4 w-px bg-border sm:inline-block" />
                      <span className="inline-flex items-center gap-1">
                        <PenSquare className="h-4 w-4" />
                        {profile.experience}
                      </span>
                    </>
                  ) : null}
                  {profile.phone ? (
                    <>
                      <span className="hidden h-4 w-px bg-border sm:inline-block" />
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                      </span>
                    </>
                  ) : null}
                  {profile.slug ? (
                    <>
                      <span className="hidden h-4 w-px bg-border sm:inline-block" />
                      <Link
                        href={`/publisher/${profile.slug}`}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Globe className="h-3 w-3" />@{profile.slug}
                      </Link>
                    </>
                  ) : null}
                  {(profile.social?.twitter ||
                    profile.social?.facebook ||
                    profile.social?.instagram ||
                    profile.social?.linkedin) && (
                    <>
                      <span className="hidden h-4 w-px bg-border sm:inline-block" />
                      <div className="flex items-center gap-2">
                        {profile.social?.twitter ? (
                          <Link
                            href={profile.social.twitter}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                          >
                            <Twitter className="h-4 w-4" />
                          </Link>
                        ) : null}
                        {profile.social?.facebook ? (
                          <Link
                            href={profile.social.facebook}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                          >
                            <Facebook className="h-4 w-4" />
                          </Link>
                        ) : null}
                        {profile.social?.instagram ? (
                          <Link
                            href={profile.social.instagram}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                          >
                            <Instagram className="h-4 w-4" />
                          </Link>
                        ) : null}
                        {profile.social?.linkedin ? (
                          <Link
                            href={profile.social.linkedin}
                            target="_blank"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
                          >
                            <Linkedin className="h-4 w-4" />
                          </Link>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Нийтлэлүүд</h2>
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
                    key={`publisher-grid-skeleton-${idx}`}
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
                    key={`publisher-list-skeleton-${idx}`}
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
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-card py-20 ring-1 ring-border">
              <p className="text-sm font-medium text-muted-foreground">
                Нийтлэл байхгүй байна
              </p>
            </div>
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
      </main>
    </div>
  )
}
