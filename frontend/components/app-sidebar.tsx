"use client"

import { useEffect, useState } from "react"
import type { ElementType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Compass,
  Bookmark,
  Users,
  HelpCircle,
  TrendingUp,
  Cpu,
  Leaf,
  Heart,
  Building2,
  Globe,
  BarChart3,
  ChevronDown,
  ChevronRight,
  X,
  Menu,
  Hash,
  Flame,
  PenTool,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuth, isAuthenticated } from "@/lib/auth"
import { getCategories, getTopics, type BackendCategory, type BackendTopic } from "@/lib/api"
import { DynamicIcon } from "@/components/admin/icon-picker"

let categoriesCache: BackendCategory[] | null = null
let topicsCache: BackendTopic[] | null = null
let categoriesInFlight: Promise<BackendCategory[]> | null = null
let topicsInFlight: Promise<BackendTopic[]> | null = null

async function getCategoriesCached() {
  if (categoriesCache) return categoriesCache
  if (!categoriesInFlight) {
    categoriesInFlight = getCategories()
      .then((items) => {
        categoriesCache = items
        return items
      })
      .finally(() => {
        categoriesInFlight = null
      })
  }
  return categoriesInFlight
}

async function getTopicsCached() {
  if (topicsCache) return topicsCache
  if (!topicsInFlight) {
    topicsInFlight = getTopics()
      .then((items) => {
        topicsCache = items
        return items
      })
      .finally(() => {
        topicsInFlight = null
      })
  }
  return topicsInFlight
}

const mainNavItems = [
  { label: "Нүүр", icon: Home, href: "/" },
  { label: "Судлах", icon: Compass, href: "/explore" },
  { label: "Хадгалсан", icon: Bookmark, href: "/saved" },
  { label: "Дагаж буй", icon: Users, href: "/following" },
  { label: "Тусламж", icon: HelpCircle, href: "/support" },
]

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

export function AppSidebar() {
  const pathname = usePathname()
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [topicsOpen, setTopicsOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [])

  useEffect(() => {
    let cancelled = false

    getCategoriesCached()
      .then((items) => {
        if (cancelled) return
        setCategories(items)
      })
      .catch(() => {
        if (cancelled) return
        setCategories([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    getTopicsCached()
      .then((items) => {
        if (cancelled) return
        setTopics(items)
      })
      .catch(() => {
        if (cancelled) return
        setTopics([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  const featuredTopics = topics.filter((topic) => topic.featured).slice(0, 5)
  const sidebarTopics = featuredTopics.length > 0 ? featuredTopics : topics.slice(0, 5)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center justify-center rounded-lg bg-sidebar-bg p-2 text-sidebar-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-sidebar-bg text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 rounded-md p-1 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Datanews
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sidebar-muted">
              Data Visual Stories
            </p>
          </div>
        </div>

        {/* Main nav */}
        <nav className="mt-6 flex flex-col gap-0.5 px-3">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-5 my-4 h-px bg-sidebar-border" />

        {/* Categories */}
        <div className="px-3">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
          >
            Ангилал
            {categoriesOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {categoriesOpen && (
            <div className="flex flex-col gap-0.5">
              {categories.map((cat) => {
                const isCatActive = pathname === `/category/${cat.slug}`
                const fallbackIcon = fallbackCategoryIconBySlug[cat.slug] || Globe
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isCatActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <DynamicIcon
                      name={cat.icon}
                      className={cn("h-4 w-4", categoryColorClass(cat))}
                      fallback={fallbackIcon}
                    />
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-5 my-4 h-px bg-sidebar-border" />

        {/* Topics */}
        <div className="px-3">
          <button
            onClick={() => setTopicsOpen(!topicsOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
          >
            <span className="flex items-center gap-2">
              <Flame className="h-3 w-3" />
              Сэдэв
            </span>
            {topicsOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {topicsOpen && (
            <div className="flex flex-col gap-0.5">
              {sidebarTopics.map((topic) => {
                const isTopicActive = pathname === `/topic/${topic.slug}`
                return (
                  <Link
                    key={topic.slug}
                    href={`/topic/${topic.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isTopicActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Hash className={cn("h-4 w-4", topic.featured ? "text-chart-2" : "text-primary")} />
                    {topic.name}
                  </Link>
                )
              })}
              <Link
                href="/topics"
                onClick={() => setMobileOpen(false)}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-sidebar-muted hover:text-sidebar-foreground"
              >
                Бүх сэдвүүд...
              </Link>
            </div>
          )}
        </div>

        {/* Become Publisher CTA */}
        <div className="mx-3 mt-4">
          <Link
            href="/become-publisher"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <PenTool className="h-4 w-4" />
            Нийтлэгч болох
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-sidebar-muted">
              &copy; 2026 Datanews.mn
            </p>
            <Link
              href={authed ? "#" : "/login"}
              onClick={(e) => {
                if (!authed) return
                e.preventDefault()
                clearAuth()
                setAuthed(false)
                if (typeof window !== "undefined") {
                  window.location.href = "/login"
                }
              }}
              className="text-[11px] font-medium text-sidebar-muted hover:text-sidebar-foreground"
            >
              {authed ? "Гарах" : "Нэвтрэх"}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
