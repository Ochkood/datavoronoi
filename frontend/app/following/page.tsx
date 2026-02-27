"use client"

import { useState } from "react"
import Image from "next/image"
import { LayoutGrid, List, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { RouteGuard } from "@/components/auth/route-guard"

interface Author {
  id: string
  name: string
  avatar: string
  bio: string
  posts: number
  followers: string
  following: boolean
}

const authors: Author[] = [
  {
    id: "a1",
    name: "Б. Болормаа",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    bio: "Эдийн засаг, санхүүгийн дата шинжээч",
    posts: 42,
    followers: "5.2K",
    following: true,
  },
  {
    id: "a2",
    name: "Д. Ганзориг",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    bio: "Байгаль орчин, эрчим хүчний судлаач",
    posts: 31,
    followers: "3.8K",
    following: true,
  },
  {
    id: "a3",
    name: "Э. Тэмүүлэн",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    bio: "Технологи, AI чиглэлийн дата сэтгүүлч",
    posts: 56,
    followers: "8.1K",
    following: true,
  },
  {
    id: "a4",
    name: "Ц. Сарантуяа",
    avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    bio: "Олон улсын харилцаа, геополитикийн шинжээч",
    posts: 28,
    followers: "4.5K",
    following: true,
  },
]

const followingPosts: PostData[] = [
  {
    id: "f1",
    title: "Монголын ДНБ-ний өсөлт: Сүүлийн 10 жилийн дата шинжилгээ",
    excerpt:
      "Монголын эдийн засгийн өсөлтийн чиг хандлагыг тоон мэдээлэлд суурилсан инфографикаар харуулж байна.",
    category: "Эдийн засаг",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-1.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "2 цагийн өмнө",
    views: "12.4K",
    comments: 45,
  },
  {
    id: "f2",
    title: "Дэлхийн сэргээгдэх эрчим хүчний хэрэглээ улс бүрээр",
    excerpt:
      "Сэргээгдэх эрчим хүчний тэргүүлэгч орнууд болон ирээдүйн хандлагын дата визуализаци.",
    category: "Байгаль орчин",
    categoryColor: "bg-chart-4/15 text-chart-4",
    image: "/images/infographic-2.jpg",
    author: "Д. Ганзориг",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    date: "5 цагийн өмнө",
    views: "8.2K",
    comments: 23,
  },
  {
    id: "f3",
    title: "Хиймэл оюуны салбарын өсөлт ба хөрөнгө оруулалтын чиг хандлага",
    excerpt:
      "AI стартап, том компаниудын хөрөнгө оруулалт, хэрэглээний статистикийн инфографик.",
    category: "Технологи",
    categoryColor: "bg-chart-2/15 text-chart-2",
    image: "/images/infographic-7.jpg",
    author: "Э. Тэмүүлэн",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    date: "2 өдрийн өмнө",
    views: "14.1K",
    comments: 67,
  },
  {
    id: "f4",
    title: "Дэлхийн худалдааны зам: Импорт, экспортын гол урсгал",
    excerpt:
      "Олон улсын худалдааны гол маршрут, бараа бүтээгдэхүүний урсгалыг газрын зураг дээр харуулав.",
    category: "Эдийн засаг",
    categoryColor: "bg-chart-1/15 text-chart-1",
    image: "/images/infographic-8.jpg",
    author: "Ц. Сарантуяа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    date: "2 өдрийн өмнө",
    views: "4.8K",
    comments: 9,
  },
]

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [followState, setFollowState] = useState<Record<string, boolean>>(
    Object.fromEntries(authors.map((a) => [a.id, a.following]))
  )

  const toggleFollow = (id: string) => {
    setFollowState((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <RouteGuard>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-6">
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

          {/* Authors */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {authors.map((author) => (
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
                <button
                  onClick={() => toggleFollow(author.id)}
                  className={cn(
                    "w-full rounded-lg px-4 py-2 text-xs font-semibold transition-colors",
                    followState[author.id]
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {followState[author.id] ? "Дагаж байна" : "Дагах"}
                </button>
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
          {viewMode === "grid" ? (
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
