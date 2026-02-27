"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Hash, Calendar, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { getTopics, type BackendTopic } from "@/lib/api"

export default function TopicsPage() {
  const [topics, setTopics] = useState<BackendTopic[]>([])
  useEffect(() => {
    getTopics()
      .then((res) => setTopics(res))
      .catch(() => setTopics([]))
  }, [])
  const featuredTopics = topics.filter((t) => t.featured)
  const otherTopics = topics.filter((t) => !t.featured)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 pl-14 md:px-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Hash className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Сэдвүүд</h1>
                <p className="text-xs text-muted-foreground">
                  Чухал үйл явдал, тусгай сэдвүүдийн мэдээ, статистик
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {/* Featured Topics */}
          {featuredTopics.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Онцлох сэдвүүд
              </h2>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {featuredTopics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/topic/${topic.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-card ring-1 ring-border transition-all hover:shadow-lg hover:ring-border/80"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={topic.image || "/placeholder.jpg"}
                        alt={topic.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 text-card/70">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-[10px] font-medium uppercase tracking-wider">
                            Онцлох сэдэв
                          </span>
                        </div>
                        <h3 className="mt-1 text-lg font-bold text-card text-balance">
                          {topic.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-card/80">
                          {topic.description}
                        </p>
                        {topic.startDate && (
                          <div className="mt-2 flex items-center gap-1.5 text-card/60">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[11px]">{topic.startDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-border px-4 py-3">
                      <span className="text-sm font-medium text-primary">
                        Дэлгэрэнгүй
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other Topics */}
          {otherTopics.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-foreground">
                Бусад сэдвүүд
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherTopics.map((topic) => (
                  <Link
                    key={topic.slug}
                    href={`/topic/${topic.slug}`}
                    className="group flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-border transition-all hover:shadow-md hover:ring-border/80"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={topic.image || "/placeholder.jpg"}
                        alt={topic.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground text-pretty">
                        {topic.name}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {topic.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
