"use client"

import { useEffect, useState } from "react"
import type { MouseEvent } from "react"
import type { ElementType } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Menu,
  Hash,
  Flame,
  PenTool,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { clearAuth, isAuthenticated } from "@/lib/auth"
import {
  getCategories,
  getTopics,
  getPublicAdminSettingsApi,
  type BackendCategory,
  type BackendTopic,
} from "@/lib/api"
import { DynamicIcon } from "@/components/admin/icon-picker"
import { categoryTextClass } from "@/lib/color-palette"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { toast } from "sonner"

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

function categoryColorClass(category: BackendCategory) {
  return categoryTextClass(category.color, category.slug)
}

type SidebarPanelProps = {
  pathname: string
  categoriesOpen: boolean
  setCategoriesOpen: (value: boolean) => void
  topicsOpen: boolean
  setTopicsOpen: (value: boolean) => void
  topCategories: BackendCategory[]
  topTopics: BackendTopic[]
  authed: boolean
  setAuthed: (value: boolean) => void
  siteName: string
  onNavigate: () => void
  onBecomePublisher: (e: MouseEvent<HTMLAnchorElement>) => void
}

function SidebarPanel({
  pathname,
  categoriesOpen,
  setCategoriesOpen,
  topicsOpen,
  setTopicsOpen,
  topCategories,
  topTopics,
  authed,
  setAuthed,
  siteName,
  onNavigate,
  onBecomePublisher,
}: SidebarPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar-bg text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
            {siteName.replace(/\.mn$/i, "")}
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sidebar-muted">
            Data Visual Stories
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <nav className="mt-6 flex flex-col gap-0.5 px-3">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
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

        <div className="mx-5 my-4 h-px bg-sidebar-border" />

        <div className="px-3">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
          >
            TOP-10 АНГИЛАЛ
            {categoriesOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {categoriesOpen ? (
            <div className="flex flex-col gap-0.5">
              {topCategories.map((cat) => {
                const isCatActive = pathname === `/category/${cat.slug}`
                const fallbackIcon = fallbackCategoryIconBySlug[cat.slug] || Globe
                return (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    onClick={onNavigate}
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
                    <span className="flex-1 truncate">{cat.name}</span>
                    <span className="text-[11px] text-sidebar-muted">{cat.postsCount || 0}</span>
                  </Link>
                )
              })}
              <Link
                href="/categories"
                onClick={onNavigate}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-sidebar-muted hover:text-sidebar-foreground"
              >
                Бусад ангилалууд...
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mx-5 my-4 h-px bg-sidebar-border" />

        <div className="px-3">
          <button
            onClick={() => setTopicsOpen(!topicsOpen)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted"
          >
            <span className="flex items-center gap-2">
              <Flame className="h-3 w-3" />
              ТОП-5 СЭДЭВ
            </span>
            {topicsOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
          {topicsOpen ? (
            <div className="flex flex-col gap-0.5">
              {topTopics.map((topic) => {
                const isTopicActive = pathname === `/topic/${topic.slug}`
                return (
                  <Link
                    key={topic.slug}
                    href={`/topic/${topic.slug}`}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isTopicActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Hash className={cn("h-4 w-4", topic.featured ? "text-chart-2" : "text-primary")} />
                    <span className="flex-1 truncate">{topic.name}</span>
                    <span className="text-[11px] text-sidebar-muted">{topic.postsCount || 0}</span>
                  </Link>
                )
              })}
              <Link
                href="/topics"
                onClick={onNavigate}
                className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-sidebar-muted hover:text-sidebar-foreground"
              >
                Бүх сэдвүүд...
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mx-3 mt-4">
          <Link
            href="/become-publisher"
            onClick={onBecomePublisher}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <PenTool className="h-4 w-4" />
            Нийтлэгч болох
          </Link>
        </div>
      </div>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-sidebar-muted">&copy; {new Date().getFullYear()} {siteName}</p>
          <Link
            href={authed ? "#" : "/login"}
            onClick={(e) => {
              if (!authed) {
                onNavigate()
                return
              }
              e.preventDefault()
              clearAuth()
              setAuthed(false)
              onNavigate()
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
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [topicsOpen, setTopicsOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])
  const [siteName, setSiteName] = useState("Datanews.mn")

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [])

  useEffect(() => {
    let cancelled = false
    getPublicAdminSettingsApi()
      .then((settings) => {
        if (cancelled) return
        setSiteName(settings.general.siteName || "Datanews.mn")
      })
      .catch(() => {
        if (cancelled) return
        setSiteName("Datanews.mn")
      })
    return () => {
      cancelled = true
    }
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

  const topCategories = [...categories]
    .sort(
      (a, b) =>
        (b.postsCount || 0) - (a.postsCount || 0) ||
        a.name.localeCompare(b.name, "mn")
    )
    .slice(0, 10)

  const topTopics = [...topics]
    .sort(
      (a, b) =>
        (b.postsCount || 0) - (a.postsCount || 0) ||
        a.name.localeCompare(b.name, "mn")
    )
    .slice(0, 5)

  const handleBecomePublisher = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!authed) {
      e.preventDefault()
      toast.info("Та эхлээд бүртгүүлнэ үү.")
      setMobileOpen(false)
      router.push("/register")
      return
    }
    setMobileOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-lg bg-sidebar-bg p-2 text-sidebar-foreground lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[260px] max-w-[260px] border-r border-sidebar-border bg-sidebar-bg p-0"
        >
          <SidebarPanel
            pathname={pathname}
            categoriesOpen={categoriesOpen}
            setCategoriesOpen={setCategoriesOpen}
            topicsOpen={topicsOpen}
            setTopicsOpen={setTopicsOpen}
            topCategories={topCategories}
            topTopics={topTopics}
            authed={authed}
            setAuthed={setAuthed}
            siteName={siteName}
            onNavigate={() => setMobileOpen(false)}
            onBecomePublisher={handleBecomePublisher}
          />
        </SheetContent>
      </Sheet>

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] lg:flex">
        <SidebarPanel
          pathname={pathname}
          categoriesOpen={categoriesOpen}
          setCategoriesOpen={setCategoriesOpen}
          topicsOpen={topicsOpen}
          setTopicsOpen={setTopicsOpen}
          topCategories={topCategories}
          topTopics={topTopics}
          authed={authed}
          setAuthed={setAuthed}
          siteName={siteName}
          onNavigate={() => {}}
          onBecomePublisher={handleBecomePublisher}
        />
      </aside>
    </>
  )
}
