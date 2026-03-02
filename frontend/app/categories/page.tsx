"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  FolderTree,
  ArrowRight,
  Globe,
  TrendingUp,
  Cpu,
  Leaf,
  Heart,
  Building2,
  FileText,
} from "lucide-react"
import type { ElementType } from "react"
import { cn } from "@/lib/utils"
import { AppSidebar } from "@/components/app-sidebar"
import { DynamicIcon } from "@/components/admin/icon-picker"
import { getCategories, type BackendCategory } from "@/lib/api"
import { categoryTextClass } from "@/lib/color-palette"

const fallbackCategoryIconBySlug: Record<string, ElementType> = {
  economy: TrendingUp,
  technology: Cpu,
  environment: Leaf,
  health: Heart,
  finance: Building2,
  world: Globe,
}

function categoryColorClass(category: BackendCategory) {
  return categoryTextClass(category.color, category.slug)
}

function CategoryCard({
  category,
  highlight = false,
}: {
  category: BackendCategory
  highlight?: boolean
}) {
  const fallbackIcon = fallbackCategoryIconBySlug[category.slug] || Globe
  const image = category.bannerImage || "/placeholder.jpg"

  return (
    <Link
      href={`/category/${category.slug}`}
      className={cn(
        "group overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-border/80",
        highlight && "ring-primary/20"
      )}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10" />

        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur-sm">
          <DynamicIcon
            name={category.icon}
            className={cn("h-4 w-4", categoryColorClass(category))}
            fallback={fallbackIcon}
          />
          <span className="text-[11px] font-medium text-white/95">{category.name}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="line-clamp-1 text-base font-semibold text-white">
            {category.name}
          </h3>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {category.description || "Энэ ангиллын өгөгдөлд суурилсан мэдээ, шинжилгээ."}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-[11px] text-secondary-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>{category.postsCount || 0} мэдээ</span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
      </div>
    </Link>
  )
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
                {topCategories.map((category) => (
                  <CategoryCard key={category._id} category={category} highlight />
                ))}
              </div>
            </section>
          )}

          {otherCategories.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-bold text-foreground">Бусад ангиллууд</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {otherCategories.map((category) => (
                  <CategoryCard key={category._id} category={category} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
