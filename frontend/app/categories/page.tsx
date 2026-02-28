"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FolderTree, ArrowRight, Globe, TrendingUp, Cpu, Leaf, Heart, Building2 } from "lucide-react"
import type { ElementType } from "react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicIcon } from "@/components/admin/icon-picker"
import { getCategories, type BackendCategory } from "@/lib/api"

const fallbackCategoryIconBySlug: Record<string, ElementType> = {
  economy: TrendingUp,
  technology: Cpu,
  environment: Leaf,
  health: Heart,
  finance: Building2,
  world: Globe,
}

const colorClassByToken: Record<string, string> = {
  economy: "text-chart-1",
  technology: "text-chart-2",
  world: "text-chart-3",
  environment: "text-chart-4",
  finance: "text-chart-5",
  health: "text-destructive",
  "chart-1": "text-chart-1",
  "chart-2": "text-chart-2",
  "chart-3": "text-chart-3",
  "chart-4": "text-chart-4",
  "chart-5": "text-chart-5",
  primary: "text-primary",
  destructive: "text-destructive",
}

function categoryColorClass(category: BackendCategory) {
  const raw = (category.color || "").trim()
  if (!raw) return colorClassByToken[category.slug] || "text-primary"
  if (raw.startsWith("text-")) return raw
  if (raw.startsWith("bg-")) return raw.replace("bg-", "text-")
  return colorClassByToken[raw] || colorClassByToken[category.slug] || "text-primary"
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BackendCategory[]>([])

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res))
      .catch(() => setCategories([]))
  }, [])

  const topCategories = useMemo(
    () =>
      [...categories]
        .sort(
          (a, b) =>
            (b.postsCount || 0) - (a.postsCount || 0) ||
            a.name.localeCompare(b.name, "mn")
        )
        .slice(0, 10),
    [categories]
  )

  const otherCategories = useMemo(() => {
    const topIds = new Set(topCategories.map((item) => item._id))
    return categories.filter((item) => !topIds.has(item._id))
  }, [categories, topCategories])

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 pl-14 md:px-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <FolderTree className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Ангилалууд</h1>
                <p className="text-xs text-muted-foreground">
                  ТОП-10 болон бүх ангиллын жагсаалт
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
          {topCategories.length > 0 && (
            <section className="mb-10">
              <h2 className="mb-4 text-lg font-bold text-foreground">TOP-10 Ангилал</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {topCategories.map((category) => {
                  const fallbackIcon = fallbackCategoryIconBySlug[category.slug] || Globe
                  return (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="group rounded-xl bg-card p-4 ring-1 ring-border transition-all hover:shadow-md hover:ring-border/80"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <DynamicIcon
                            name={category.icon}
                            className={cn("h-5 w-5", categoryColorClass(category))}
                            fallback={fallbackIcon}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-card-foreground">{category.name}</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Нийтлэл: {category.postsCount || 0}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}

          {otherCategories.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-foreground">Бусад ангиллууд</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherCategories.map((category) => {
                  const fallbackIcon = fallbackCategoryIconBySlug[category.slug] || Globe
                  return (
                    <Link
                      key={category._id}
                      href={`/category/${category.slug}`}
                      className="group rounded-xl bg-card p-4 ring-1 ring-border transition-all hover:shadow-md hover:ring-border/80"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <DynamicIcon
                            name={category.icon}
                            className={cn("h-5 w-5", categoryColorClass(category))}
                            fallback={fallbackIcon}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-card-foreground">{category.name}</h3>
                          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {category.description || "Тайлбар байхгүй"}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
