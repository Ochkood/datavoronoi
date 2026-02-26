"use client"

import { useState } from "react"
import { LayoutGrid, List, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"

const categories = [
  "Бүгд",
  "Эдийн засаг",
  "Технологи",
  "Байгаль орчин",
  "Эрүүл мэнд",
  "Нийгэм",
  "Дэлхий",
  "Санхүү",
]

const explorePosts: PostData[] = [
  {
    id: "e1",
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
    id: "e2",
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
    id: "e3",
    title: "Дэлхийн хүн амын тархалт тив бүрээр: 2025 оны байдлаар",
    excerpt:
      "8 тэрбум давсан дэлхийн хүн амын статистик мэдээллийг тив болон бүс нутгаар ангилан харуулав.",
    category: "Дэлхий",
    categoryColor: "bg-chart-3/15 text-chart-3",
    image: "/images/infographic-3.jpg",
    author: "Ц. Сарантуяа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarantuya",
    date: "8 цагийн өмнө",
    views: "6.9K",
    comments: 18,
  },
  {
    id: "e4",
    title: "Технологийн компаниудын зах зээлийн үнэлгээний харьцуулалт",
    excerpt:
      "Apple, Microsoft, NVIDIA зэрэг дэлхийн том компаниудын зах зээлийн үнэлгээг хооронд нь жишив.",
    category: "Технологи",
    categoryColor: "bg-chart-2/15 text-chart-2",
    image: "/images/infographic-4.jpg",
    author: "Э. Тэмүүлэн",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=temuulen",
    date: "12 цагийн өмнө",
    views: "11.3K",
    comments: 56,
  },
  {
    id: "e5",
    title: "Дэлхийн нүүрсхүчлийн хийн ялгарал салбар тус бүрээр",
    excerpt:
      "Эрчим хүч, тээвэр, үйлдвэрлэл зэрэг салбаруудын нүүрсхүчлийн хийн ялгарлын хэмжээг шинжлэв.",
    category: "Байгаль орчин",
    categoryColor: "bg-chart-4/15 text-chart-4",
    image: "/images/infographic-5.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "1 өдрийн өмнө",
    views: "5.4K",
    comments: 12,
  },
  {
    id: "e6",
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
  {
    id: "e7",
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
    id: "e8",
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
  {
    id: "e9",
    title: "Эрүүл мэндийн зардал: Дэлхийн улсуудын харьцуулалт",
    excerpt:
      "Улс орнуудын эрүүл мэндийн салбарт зарцуулж буй хөрөнгийг ДНБ-д эзлэх хувиар нь жишив.",
    category: "Эрүүл мэнд",
    categoryColor: "bg-destructive/15 text-destructive",
    image: "/images/infographic-9.jpg",
    author: "Б. Болормаа",
    authorAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
    date: "3 өдрийн өмнө",
    views: "3.6K",
    comments: 15,
  },
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("latest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("Бүгд")

  const filteredPosts =
    activeCategory === "Бүгд"
      ? explorePosts
      : explorePosts.filter((p) => p.category === activeCategory)

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
              {categories.map((cat) => (
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
          <p className="mb-4 text-xs text-muted-foreground">
            {filteredPosts.length} нийтлэл олдлоо
          </p>

          {/* Posts */}
          {filteredPosts.length === 0 ? (
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
