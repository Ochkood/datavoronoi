"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { PostCard } from "@/components/post-card"
import { posts } from "@/lib/data"

export default function PostDetailPage() {
  const params = useParams()
  const id = params.id as string

  const post = posts.find((p) => p.id === id)
  const relatedPosts = posts.filter(
    (p) => p.categorySlug === post?.categorySlug && p.id !== id
  ).slice(0, 3)

  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState("")

  if (!post) {
    notFound()
  }

  // Sample article content
  const articleContent = `
    <p class="lead">
      ${post.excerpt} Энэхүү судалгаанд олон улсын болон дотоодын эх сурвалжуудыг ашиглан өгөгдлийн дүн шинжилгээ хийсэн болно.
    </p>
    
    <h2>Үндсэн үзүүлэлтүүд</h2>
    <p>
      Судалгааны үр дүнгээс харахад сүүлийн жилүүдэд энэ салбарт томоохон өөрчлөлтүүд гарсан байна. 
      Онцлох үзүүлэлтүүдийг дараах байдлаар нэгтгэв:
    </p>
    
    <ul>
      <li>Өмнөх оны мөн үетэй харьцуулахад 15%-иар өссөн</li>
      <li>Бүс нутгийн дунджаас 2.3 дахин өндөр үзүүлэлт</li>
      <li>Ирэх жилийн таамаглал эерэг байна</li>
    </ul>
    
    <h2>Дүн шинжилгээ</h2>
    <p>
      Дэлхийн хэмжээнд авч үзвэл энэ чиглэлээр Монгол улс тодорхой ахиц дэвшил гаргасан боловч 
      цаашид анхаарах шаардлагатай асуудлууд байсаар байна. Тухайлбал:
    </p>
    
    <ol>
      <li>Бодлогын тогтвортой байдлыг хангах</li>
      <li>Хөрөнгө оруулалтын орчныг сайжруулах</li>
      <li>Дэд бүтцийн хөгжлийг эрчимжүүлэх</li>
    </ol>
    
    <blockquote>
      "Өгөгдөлд суурилсан шийдвэр гаргалт нь ирээдүйн хөгжлийн үндэс суурь болно."
      <cite>— Судалгааны багийн ахлагч</cite>
    </blockquote>
    
    <h2>Дүгнэлт</h2>
    <p>
      Энэхүү судалгааны үр дүн нь цаашдын бодлого боловсруулах, шийдвэр гаргахад чухал ач холбогдолтой 
      мэдээлэл өгч байна. Бид дараагийн судалгаандаа илүү дэлгэрэнгүй дүн шинжилгээ хийх болно.
    </p>
  `

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
            
            <h1 className="mt-4 text-2xl font-bold leading-tight text-foreground md:text-3xl lg:text-4xl text-balance">
              {post.title}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
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
                <button
                  onClick={() => setLiked(!liked)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    liked
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ThumbsUp className={cn("h-4 w-4", liked && "fill-current")} />
                  {liked ? "Таалагдсан" : "Таалагдлаа"}
                </button>
                <button
                  onClick={() => setSaved(!saved)}
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
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
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
              Сэтгэгдэл ({post.comments})
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
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                  Илгээх
                </button>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="mt-6 space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-xl bg-card p-4 ring-1 ring-border">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={`https://api.dicebear.com/9.x/notionists/svg?seed=user${i}`}
                        alt="User"
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          Хэрэглэгч {i}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {i} цагийн өмнө
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Маш сайхан мэдээлэл байна. Баярлалаа!
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
