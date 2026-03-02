export type ColorToken =
  | "chart-1"
  | "chart-2"
  | "chart-3"
  | "chart-4"
  | "chart-5"
  | "primary"
  | "destructive"
  | "emerald"
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "cyan"
  | "lime"

export type ColorOption = {
  token: ColorToken
  label: string
  bgClass: string
  textClass: string
  badgeClass: string
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    token: "chart-1",
    label: "Chart 1",
    bgClass: "bg-chart-1",
    textClass: "text-chart-1",
    badgeClass: "bg-chart-1/15 text-chart-1",
  },
  {
    token: "chart-2",
    label: "Chart 2",
    bgClass: "bg-chart-2",
    textClass: "text-chart-2",
    badgeClass: "bg-chart-2/15 text-chart-2",
  },
  {
    token: "chart-3",
    label: "Chart 3",
    bgClass: "bg-chart-3",
    textClass: "text-chart-3",
    badgeClass: "bg-chart-3/15 text-chart-3",
  },
  {
    token: "chart-4",
    label: "Chart 4",
    bgClass: "bg-chart-4",
    textClass: "text-chart-4",
    badgeClass: "bg-chart-4/15 text-chart-4",
  },
  {
    token: "chart-5",
    label: "Chart 5",
    bgClass: "bg-chart-5",
    textClass: "text-chart-5",
    badgeClass: "bg-chart-5/15 text-chart-5",
  },
  {
    token: "primary",
    label: "Primary",
    bgClass: "bg-primary",
    textClass: "text-primary",
    badgeClass: "bg-primary/15 text-primary",
  },
  {
    token: "destructive",
    label: "Destructive",
    bgClass: "bg-destructive",
    textClass: "text-destructive",
    badgeClass: "bg-destructive/15 text-destructive",
  },
  {
    token: "emerald",
    label: "Emerald",
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-600",
    badgeClass: "bg-emerald-500/15 text-emerald-600",
  },
  {
    token: "sky",
    label: "Sky",
    bgClass: "bg-sky-500",
    textClass: "text-sky-600",
    badgeClass: "bg-sky-500/15 text-sky-600",
  },
  {
    token: "amber",
    label: "Amber",
    bgClass: "bg-amber-500",
    textClass: "text-amber-600",
    badgeClass: "bg-amber-500/15 text-amber-600",
  },
  {
    token: "violet",
    label: "Violet",
    bgClass: "bg-violet-500",
    textClass: "text-violet-600",
    badgeClass: "bg-violet-500/15 text-violet-600",
  },
  {
    token: "rose",
    label: "Rose",
    bgClass: "bg-rose-500",
    textClass: "text-rose-600",
    badgeClass: "bg-rose-500/15 text-rose-600",
  },
  {
    token: "cyan",
    label: "Cyan",
    bgClass: "bg-cyan-500",
    textClass: "text-cyan-600",
    badgeClass: "bg-cyan-500/15 text-cyan-600",
  },
  {
    token: "lime",
    label: "Lime",
    bgClass: "bg-lime-500",
    textClass: "text-lime-600",
    badgeClass: "bg-lime-500/15 text-lime-600",
  },
]

const LEGACY_SLUG_COLOR: Record<string, ColorToken> = {
  economy: "chart-1",
  technology: "chart-2",
  world: "chart-3",
  environment: "chart-4",
  finance: "chart-5",
  health: "destructive",
}

export function normalizeColorToken(
  raw?: string,
  fallback: ColorToken = "chart-1"
): ColorToken {
  const value = (raw || "").trim()
  if (!value) return fallback

  const normalized =
    value.startsWith("text-")
      ? value.replace("text-", "")
      : value.startsWith("bg-")
        ? value.replace("bg-", "")
        : value

  const matched = COLOR_OPTIONS.find((item) => item.token === normalized)
  return matched?.token || fallback
}

export function colorTokenFromCategory(
  color?: string,
  slug?: string,
  fallback: ColorToken = "chart-1"
): ColorToken {
  if (color) return normalizeColorToken(color, fallback)
  if (slug && LEGACY_SLUG_COLOR[slug]) return LEGACY_SLUG_COLOR[slug]
  return fallback
}

export function colorOptionByToken(token: string): ColorOption {
  const normalized = normalizeColorToken(token)
  return (
    COLOR_OPTIONS.find((item) => item.token === normalized) ||
    COLOR_OPTIONS[0]
  )
}

export function categoryBadgeClass(color?: string, slug?: string): string {
  const token = colorTokenFromCategory(color, slug)
  return colorOptionByToken(token).badgeClass
}

export function categoryTextClass(color?: string, slug?: string): string {
  const token = colorTokenFromCategory(color, slug)
  return colorOptionByToken(token).textClass
}

export function categoryBgClass(color?: string, slug?: string): string {
  const token = colorTokenFromCategory(color, slug)
  return colorOptionByToken(token).bgClass
}
