"use client"

import { useState } from "react"
import { LayoutGrid, List, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"

const savedPosts: PostData[] = [
  {
    id: "s1",
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
    id: "s2",
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
    id: "s3",
    title: "Крипто зах зээлийн тойм: Bitcoin, Ethereum-ын үнийн чиг хандлага",
    excerpt:
      "2025 оны крипто зах зээлийн нөхцөл байдал, гол тоон үзүүлэлтүүдийг нэг дороос харна уу.",
    category: "Санхүү",
    categoryColor: "bg-chart-5/15 text-chart-5",
    image: "/images/infographic-6.jpg",
    author: "Д. Ганзориг",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=ganzorig",
    date: "1 өдрийн өмнө",
    views: "9.7K",
    comments: 34,
  },
]

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
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
                <PostCard key={post.id} post={post} variant="default" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {savedPosts.map((post) => (
                <PostCard key={post.id} post={post} variant="list" />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
