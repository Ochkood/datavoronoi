"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  Leaf,
  Heart,
  Wallet,
  Globe,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Users,
  Building2,
  Factory,
  Zap,
  Droplets,
  Wind,
  Sun,
  ThermometerSun,
  Activity,
  Briefcase,
  ShoppingCart,
  Truck,
  Plane,
  Ship,
  Car,
  Home,
  Landmark,
  Scale,
  GraduationCap,
  Stethoscope,
  Pill,
  Baby,
  TreePine,
  Mountain,
  Waves,
  Flame,
  Cloud,
  Coins,
  CreditCard,
  PiggyBank,
  Receipt,
  Calculator,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Award,
  Trophy,
  Star,
  Sparkles,
  Lightbulb,
  Rocket,
  Atom,
  Database,
  Server,
  Wifi,
  Smartphone,
  Monitor,
  ChevronDown,
  Search,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Icon map for rendering
export const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  TrendingDown,
  Cpu,
  Leaf,
  Heart,
  Wallet,
  Globe,
  BarChart3,
  LineChart,
  PieChart,
  DollarSign,
  Users,
  Building2,
  Factory,
  Zap,
  Droplets,
  Wind,
  Sun,
  ThermometerSun,
  Activity,
  Briefcase,
  ShoppingCart,
  Truck,
  Plane,
  Ship,
  Car,
  Home,
  Landmark,
  Scale,
  GraduationCap,
  Stethoscope,
  Pill,
  Baby,
  TreePine,
  Mountain,
  Waves,
  Flame,
  Cloud,
  Coins,
  CreditCard,
  PiggyBank,
  Receipt,
  Calculator,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Award,
  Trophy,
  Star,
  Sparkles,
  Lightbulb,
  Rocket,
  Atom,
  Database,
  Server,
  Wifi,
  Smartphone,
  Monitor,
}

// Categorized icons for better UX
const iconCategories = {
  "Эдийн засаг": ["TrendingUp", "TrendingDown", "DollarSign", "Coins", "CreditCard", "PiggyBank", "Receipt", "Calculator", "Percent", "Wallet", "Briefcase", "ShoppingCart"],
  "Технологи": ["Cpu", "Database", "Server", "Wifi", "Smartphone", "Monitor", "Atom", "Rocket", "Lightbulb"],
  "Байгаль орчин": ["Leaf", "TreePine", "Mountain", "Waves", "Wind", "Sun", "Cloud", "Droplets", "Flame", "ThermometerSun"],
  "Эрүүл мэнд": ["Heart", "Activity", "Stethoscope", "Pill", "Baby"],
  "Дэд бүтэц": ["Building2", "Factory", "Home", "Landmark", "Truck", "Plane", "Ship", "Car", "Zap"],
  "Нийгэм": ["Users", "GraduationCap", "Scale", "Globe"],
  "График": ["BarChart3", "LineChart", "PieChart", "TrendingUp", "TrendingDown", "ArrowUpRight", "ArrowDownRight", "Minus"],
  "Бусад": ["Target", "Award", "Trophy", "Star", "Sparkles"],
}

interface IconPickerProps {
  value?: string
  onChange: (icon: string) => void
  className?: string
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const SelectedIcon = value ? iconMap[value] : null

  const allIcons = Object.keys(iconMap)
  const filteredIcons = searchQuery
    ? allIcons.filter((icon) =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeCategory
    ? iconCategories[activeCategory as keyof typeof iconCategories] || []
    : allIcons

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 text-sm text-foreground hover:bg-secondary/50"
      >
        <div className="flex items-center gap-2">
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Icon сонгох...</span>
          )}
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-border bg-card p-3 shadow-xl">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Icon хайх..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setActiveCategory(null)
                }}
                className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Categories */}
            {!searchQuery && (
              <div className="mb-3 flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    activeCategory === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  Бүгд
                </button>
                {Object.keys(iconCategories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Icons Grid */}
            <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto">
              {filteredIcons.map((iconName) => {
                const Icon = iconMap[iconName]
                if (!Icon) return null
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                      value === iconName
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    )}
                    title={iconName}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                )
              })}
            </div>

            {filteredIcons.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Icon олдсонгүй
              </p>
            )}

            {/* Clear button */}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setIsOpen(false)
                }}
                className="mt-3 w-full rounded-lg border border-input bg-background py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Арилгах
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Helper component to render icon by name
interface DynamicIconProps {
  name?: string
  className?: string
  fallback?: React.ElementType
}

export function DynamicIcon({ name, className, fallback: Fallback }: DynamicIconProps) {
  if (!name) {
    return Fallback ? <Fallback className={className} /> : null
  }
  
  const Icon = iconMap[name]
  if (!Icon) {
    return Fallback ? <Fallback className={className} /> : null
  }
  
  return <Icon className={className} />
}
