"use client"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainNavItems = [
  { label: "Нүүр", icon: Home, href: "/", active: true },
  { label: "Судлах", icon: Compass, href: "/explore" },
  { label: "Хадгалсан", icon: Bookmark, href: "/saved" },
  { label: "Дагаж буй", icon: Users, href: "/following" },
  { label: "Тусламж", icon: HelpCircle, href: "/support" },
]

const categories = [
  { label: "Эдийн засаг", icon: TrendingUp, color: "text-chart-1" },
  { label: "Технологи", icon: Cpu, color: "text-chart-2" },
  { label: "Байгаль орчин", icon: Leaf, color: "text-chart-4" },
  { label: "Эрүүл мэнд", icon: Heart, color: "text-destructive" },
  { label: "Нийгэм", icon: Building2, color: "text-chart-5" },
  { label: "Дэлхий", icon: Globe, color: "text-chart-3" },
  { label: "Статистик", icon: BarChart3, color: "text-primary" },
]

export function AppSidebar() {
  const [categoriesOpen, setCategoriesOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

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
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          ))}
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
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-muted transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                >
                  <cat.icon className={cn("h-4 w-4", cat.color)} />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border px-5 py-4">
          <p className="text-[11px] text-sidebar-muted">
            &copy; 2026 Datanews.mn
          </p>
        </div>
      </aside>
    </>
  )
}
