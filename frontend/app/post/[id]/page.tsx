"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MessageCircle,
  Eye,
  Clock,
  ThumbsUp,
  Facebook,
  Twitter,
  Link2,
  Send,
  PenSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { PostCard, type PostData } from "@/components/post-card"
import { FollowButton } from "@/components/follow-button"
import {
  addCommentApi,
  getMeApi,
  getCommentsApi,
  getMyEngagement,
  getPublicAuthorProfileApi,
  getPostById,
  getPosts,
  toggleBookmarkApi,
  toggleFollowUserApi,
  toggleLikeApi,
  type PostComment,
} from "@/lib/api"
import { getAccessToken } from "@/lib/auth"
import { toast } from "sonner"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [post, setPost] = useState<PostData | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<PostData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<PostComment[]>([])
  const [authorVerified, setAuthorVerified] = useState(false)
  const [authorIsFollowing, setAuthorIsFollowing] = useState(false)
  const [authorFollowLoading, setAuthorFollowLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    setIsLoading(true)
    getPostById(id)
      .then((p) => {
        if (p.id && p.id !== id) {
          router.replace(`/post/${p.id}`)
        }
        setPost(p)
        setLikesCount(p.likes || 0)
        if (p.categorySlug) {
          return getPosts()
            .then((all) => {
              setRelatedPosts(
                all
                  .filter((x) => x.categorySlug === p.categorySlug && x.id !== p.id)
                  .slice(0, 3)
              )
            })
            .catch(() => setRelatedPosts([]))
        }
        setRelatedPosts([])
      })
      .catch(() => setPost(null))
      .finally(() => setIsLoading(false))
  }, [id, router])

  useEffect(() => {
    let mounted = true
    if (!post?.authorId) return

    const hasToken = Boolean(getAccessToken())

    Promise.all([
      getPublicAuthorProfileApi(post.authorId).catch(() => null),
      hasToken ? getMeApi().catch(() => null) : Promise.resolve(null),
    ]).then(([authorData, me]) => {
      if (!mounted) return
      setAuthorVerified(Boolean(authorData?.profile.verified || post.authorVerified))
      setAuthorIsFollowing(Boolean(authorData?.profile.isFollowing))
      setCurrentUserId(me?.id || "")
    })

    return () => {
      mounted = false
    }
  }, [post?.authorId, post?.authorVerified])

  useEffect(() => {
    getCommentsApi(id)
      .then(setComments)
      .catch(() => setComments([]))

    if (getAccessToken()) {
      getMyEngagement(id)
        .then((state) => {
          setLiked(state.liked)
          setSaved(state.bookmarked)
        })
        .catch(() => {
          setLiked(false)
          setSaved(false)
        })
    }
  }, [id])

  if (!isLoading && !post) {
    notFound()
  }

  if (isLoading || !post) {
    return null
  }

  const articleContent =
    post.contentHtml && post.contentHtml.trim().length > 0
      ? post.contentHtml
      : `<p>${post.excerpt}</p>`

  const handleToggleLike = async () => {
    if (!getAccessToken()) {
      toast.error("Та эхлээд нэвтэрнэ үү")
      return
    }
    try {
      const res = await toggleLikeApi(id)
      setLiked(res.liked)
      setLikesCount(res.likesCount)
      toast.success(res.liked ? "Таалагдлаа" : "Таалагдлыг цуцаллаа")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Таалагдлын үед алдаа")
    }
  }

  const handleToggleBookmark = async () => {
    if (!getAccessToken()) {
      toast.error("Та эхлээд нэвтэрнэ үү")
      return
    }
    try {
      const res = await toggleBookmarkApi(id)
      setSaved(res.bookmarked)
      toast.success(res.bookmarked ? "Хадгаллаа" : "Хадгалснаас хаслаа")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Хадгалах үед алдаа")
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    if (!getAccessToken()) {
      toast.error("Та эхлээд нэвтэрнэ үү")
      return
    }
    try {
      const created = await addCommentApi(id, comment.trim())
      setComments((prev) => [created, ...prev])
      setComment("")
      toast.success("Сэтгэгдэл амжилттай илгээгдлээ")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Сэтгэгдэл илгээх үед алдаа"
      )
    }
  }

  const handleToggleAuthorFollow = async () => {
    if (!post.authorId) return
    if (!getAccessToken()) {
      toast.error("Та эхлээд нэвтэрнэ үү")
      return
    }
    if (currentUserId && currentUserId === post.authorId) return

    setAuthorFollowLoading(true)
    try {
      const res = await toggleFollowUserApi(post.authorId)
      setAuthorIsFollowing(res.following)
      toast.success(res.following ? "Follow амжилттай" : "Unfollow амжилттай")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Нийтлэгч дагах үед алдаа"
      )
    } finally {
      setAuthorFollowLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        {/* Back button */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-3 pl-14 md:px-6 lg:pl-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Буцах
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          {/* Header */}
          <header className="mb-8">
            <Link
              href={`/category/${post.categorySlug}`}
              className={cn(
                "inline-block rounded-full px-3 py-1 text-xs font-semibold",
                post.categoryColor
              )}
            >
              {post.category}
            </Link>
            
            <h1 className="mt-4 text-xl font-bold leading-tight text-foreground md:text-2xl lg:text-3xl text-balance">
              {post.title}
            </h1>
            
            <p className="mt-4 italic text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
              <div className="flex items-center gap-3">
                <Link
                  href={post.authorId ? `/publisher/${post.authorSlug || post.authorId}` : "#"}
                  className="h-12 w-12 overflow-hidden rounded-full bg-muted"
                >
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div>
                  <Link
                    href={post.authorId ? `/publisher/${post.authorSlug || post.authorId}` : "#"}
                    className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:text-primary"
                  >
                    {post.author}
                    {authorVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                        <PenSquare className="h-3 w-3" />
                        Publisher
                      </span>
                    )}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views} уншсан
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                {post.authorId && currentUserId !== post.authorId && (
                  <FollowButton
                    following={authorIsFollowing}
                    loading={authorFollowLoading}
                    onClick={() => void handleToggleAuthorFollow()}
                  />
                )}
                <button
                  onClick={handleToggleLike}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    liked
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
                  {liked ? "Таалагдсан" : "Таалагдлаа"} ({likesCount})
                </button>
                <button
                  onClick={handleToggleBookmark}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                    saved
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={saved ? "Хадгалсан" : "Хадгалах"}
                >
                  <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Хуваалцах"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div
            className="post-content max-w-none text-foreground/90 leading-relaxed [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:my-4 [&_strong]:font-bold [&_em]:italic [&_a]:text-primary [&_a]:underline [&_img]:my-5 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:h-auto"
            dangerouslySetInnerHTML={{ __html: articleContent }}
          />

          {/* Share Section */}
          <div className="mt-10 rounded-xl bg-secondary/50 p-6">
            <h3 className="text-sm font-semibold text-foreground">Хуваалцах</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                <Facebook className="h-4 w-4" />
                Facebook
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                <Twitter className="h-4 w-4" />
                Twitter
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80">
                <Link2 className="h-4 w-4" />
                Линк хуулах
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <MessageCircle className="h-5 w-5" />
              Сэтгэгдэл ({comments.length})
            </h3>
            
            {/* Comment Form */}
            <div className="mt-4 rounded-xl bg-card p-4 ring-1 ring-border">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Сэтгэгдэл бичих..."
                className="w-full resize-none rounded-lg border-0 bg-secondary p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                  Илгээх
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-6 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl bg-card p-4 ring-1 ring-border">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={c.user.avatar}
                        alt="User"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {c.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(c.createdAt).toLocaleString("mn-MN")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {c.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-bold text-foreground">
                Холбоотой нийтлэлүүд
              </h3>
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} variant="default" />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  )
}
