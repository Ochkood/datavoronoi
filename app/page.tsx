"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ContentHeader } from "@/components/content-header"
import { PostCard, type PostData } from "@/components/post-card"
import { TrendingSidebar } from "@/components/trending-sidebar"

const posts: PostData[] = [
  {
    id: "1",
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
    featured: true,
  },
  {
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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
    id: "8",
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
    id: "9",
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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("latest")

  const featuredPost = posts[0]
  const gridPosts = posts.slice(1, 7)
  const compactPosts = posts.slice(7)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px]">
        <ContentHeader activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          <div className="flex flex-col gap-8 xl:flex-row">
            {/* Posts area */}
            <div className="flex-1 space-y-8">
              {/* Featured */}
              <section>
                <PostCard post={featuredPost} variant="featured" />
              </section>

              {/* Grid */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground">
                    Бүх нийтлэлүүд
                  </h2>
                  <button className="text-xs font-medium text-primary hover:underline">
                    Бүгдийг харах
                  </button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>

              {/* Compact list */}
              {compactPosts.length > 0 && (
                <section>
                  <h2 className="mb-4 text-base font-bold text-foreground">
                    Бусад нийтлэлүүд
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {compactPosts.map((post) => (
                      <PostCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-full flex-shrink-0 xl:w-[320px]">
              <div className="sticky top-[65px]">
                <TrendingSidebar />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
