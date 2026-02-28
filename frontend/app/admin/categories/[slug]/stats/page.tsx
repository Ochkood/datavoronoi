"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  LineChart,
  AreaChart,
  Save,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CategoryStats } from "@/lib/data"
import {
  getCategories,
  getCategoryStatsApi,
  updateCategoryStatsApi,
  type BackendCategory,
} from "@/lib/api"
import { IconPicker, DynamicIcon } from "@/components/admin/icon-picker"

type ChartType = "area" | "line" | "bar" | "pie"
type ChangeType = "positive" | "negative" | "neutral"

interface Highlight {
  label: string
  value: string
  change?: string
  changeType?: ChangeType
  description?: string
  icon?: string
  link?: string
}

interface ChartData {
  title: string
  type: ChartType
  data: { name: string; value: number; value2?: number; value3?: number; value4?: number }[]
  dataKey?: string
  dataKey2?: string
  dataKey3?: string
  dataKey4?: string
  dataLabel?: string
  dataLabel2?: string
  dataLabel3?: string
  dataLabel4?: string
  icon?: string
  link?: string
}

export default function CategoryStatsEditorPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [category, setCategory] = useState<BackendCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [charts, setCharts] = useState<ChartData[]>([])
  const [editingHighlight, setEditingHighlight] = useState<number | null>(null)
  const [editingChart, setEditingChart] = useState<number | null>(null)
  const [showHighlightModal, setShowHighlightModal] = useState(false)
  const [showChartModal, setShowChartModal] = useState(false)
  const [savingAll, setSavingAll] = useState(false)

  // Form states for highlights
  const [highlightForm, setHighlightForm] = useState<Highlight>({
    label: "",
    value: "",
    change: "",
    changeType: "neutral",
    description: "",
    icon: "",
    link: "",
  })

  // Form states for charts
  const [chartForm, setChartForm] = useState<ChartData>({
    title: "",
    type: "area",
    data: [],
    dataKey: "value",
    dataLabel: "",
    dataLabel2: "",
    dataLabel3: "",
    dataLabel4: "",
    icon: "",
    link: "",
  })
  const [chartDataInput, setChartDataInput] = useState("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError("")

    Promise.all([getCategories(), getCategoryStatsApi(slug)])
      .then(([cats, stats]) => {
        if (cancelled) return
        const found = cats.find((c) => c.slug === slug) || null
        setCategory(found)
        setHighlights((stats?.highlights || []) as Highlight[])
        setCharts((stats?.charts || []) as ChartData[])
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Статистик ачаалж чадсангүй")
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!loading && !category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Ангилал олдсонгүй</p>
      </div>
    )
  }

  const handleAddHighlight = () => {
    setEditingHighlight(null)
    setHighlightForm({
      label: "",
      value: "",
      change: "",
      changeType: "neutral",
      description: "",
      icon: "",
      link: "",
    })
    setShowHighlightModal(true)
  }

  const handleEditHighlight = (index: number) => {
    setEditingHighlight(index)
    setHighlightForm(highlights[index])
    setShowHighlightModal(true)
  }

  const handleSaveHighlight = () => {
    if (editingHighlight !== null) {
      const updated = [...highlights]
      updated[editingHighlight] = highlightForm
      setHighlights(updated)
    } else {
      setHighlights([...highlights, highlightForm])
    }
    setShowHighlightModal(false)
  }

  const handleDeleteHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const handleAddChart = () => {
    setEditingChart(null)
    setChartForm({
      title: "",
      type: "area",
      data: [],
      dataKey: "value",
      dataKey2: undefined,
      dataKey3: undefined,
      dataKey4: undefined,
      dataLabel: "",
      dataLabel2: "",
      dataLabel3: "",
      dataLabel4: "",
      icon: "",
      link: "",
    })
    setChartDataInput("")
    setShowChartModal(true)
  }

  const handleEditChart = (index: number) => {
    setEditingChart(index)
    const chart = charts[index]
    setChartForm({
      ...chart,
      icon: chart.icon || "",
    })
    setChartDataInput(
      chart.data
        .map((d) => {
          const parts = [d.name, d.value]
          if (d.value2 !== undefined) parts.push(d.value2)
          if (d.value3 !== undefined) parts.push(d.value3)
          if (d.value4 !== undefined) parts.push(d.value4)
          return parts.join(":")
        })
        .join("\n")
    )
    setShowChartModal(true)
  }

  const handleSaveChart = () => {
    const data = chartDataInput
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [name, value, value2, value3, value4] = line.split(":")
        const second = value2 !== undefined ? parseFloat(value2) : undefined
        const third = value3 !== undefined ? parseFloat(value3) : undefined
        const fourth = value4 !== undefined ? parseFloat(value4) : undefined
        return {
          name: (name || "").trim(),
          value: parseFloat(value) || 0,
          ...(second !== undefined && !Number.isNaN(second) ? { value2: second } : {}),
          ...(third !== undefined && !Number.isNaN(third) ? { value3: third } : {}),
          ...(fourth !== undefined && !Number.isNaN(fourth) ? { value4: fourth } : {}),
        }
      })

    const hasSecondSeries = data.some((d) => d.value2 !== undefined)
    const hasThirdSeries = data.some((d) => d.value3 !== undefined)
    const hasFourthSeries = data.some((d) => d.value4 !== undefined)
    const newChart = {
      ...chartForm,
      data,
      dataKey: chartForm.dataKey || "value",
      dataKey2: hasSecondSeries ? (chartForm.dataKey2 || "value2") : undefined,
      dataKey3: hasThirdSeries ? (chartForm.dataKey3 || "value3") : undefined,
      dataKey4: hasFourthSeries ? (chartForm.dataKey4 || "value4") : undefined,
      dataLabel: chartForm.dataLabel || "",
      dataLabel2: hasSecondSeries ? (chartForm.dataLabel2 || "") : undefined,
      dataLabel3: hasThirdSeries ? (chartForm.dataLabel3 || "") : undefined,
      dataLabel4: hasFourthSeries ? (chartForm.dataLabel4 || "") : undefined,
      link: chartForm.link || "",
    }

    if (editingChart !== null) {
      const updated = [...charts]
      updated[editingChart] = newChart
      setCharts(updated)
    } else {
      setCharts([...charts, newChart])
    }
    setShowChartModal(false)
  }

  const handleDeleteChart = (index: number) => {
    setCharts(charts.filter((_, i) => i !== index))
  }

  const handleSaveAll = () => {
    setSavingAll(true)
    setError("")
    const payload: CategoryStats = {
      highlights,
      charts,
    }
    updateCategoryStatsApi(slug, payload)
      .then(() => {
        alert("Статистик амжилттай хадгалагдлаа!")
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Статистик хадгалахад алдаа гарлаа")
      })
      .finally(() => setSavingAll(false))
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/categories"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {category?.name || slug} - Статистик
              </h1>
              <p className="text-sm text-muted-foreground">
                Гол үзүүлэлт болон график удирдах
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={savingAll}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {savingAll ? "Хадгалж байна..." : "Хадгалах"}
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {loading && (
          <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
            Статистик ачаалж байна...
          </div>
        )}

        {/* Highlights Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Гол үзүүлэлтүүд
              </h2>
              <p className="text-sm text-muted-foreground">
                Дээд хэсэгт харагдах статистик карт
              </p>
            </div>
            <button
              onClick={handleAddHighlight}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
              Нэмэх
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card p-4"
              >
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEditHighlight(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteHighlight(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {highlight.icon && (
                    <DynamicIcon name={highlight.icon} className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">{highlight.label}</p>
                </div>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {highlight.value}
                </p>
                {highlight.change && (
                  <div className="mt-2 flex items-center gap-1">
                    {highlight.changeType === "positive" && (
                      <TrendingUp className="h-4 w-4 text-chart-4" />
                    )}
                    {highlight.changeType === "negative" && (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    {highlight.changeType === "neutral" && (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        highlight.changeType === "positive" && "text-chart-4",
                        highlight.changeType === "negative" && "text-destructive",
                        highlight.changeType === "neutral" && "text-muted-foreground"
                      )}
                    >
                      {highlight.change}
                    </span>
                  </div>
                )}
                {highlight.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {highlight.description}
                  </p>
                )}
              </div>
            ))}

            {highlights.length === 0 && (
              <div className="col-span-full flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  Гол үзүүлэлт нэмэгдээгүй байна
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Графикууд
              </h2>
              <p className="text-sm text-muted-foreground">
                Статистик дата харуулах chart
              </p>
            </div>
            <button
              onClick={handleAddChart}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
              Нэмэх
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {charts.map((chart, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-border bg-card p-4"
              >
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleEditChart(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteChart(index)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {chart.icon ? (
                    <DynamicIcon name={chart.icon} className="h-4 w-4 text-primary" />
                  ) : (
                    <>
                      {chart.type === "area" && <AreaChart className="h-4 w-4 text-primary" />}
                      {chart.type === "line" && <LineChart className="h-4 w-4 text-primary" />}
                      {chart.type === "bar" && <BarChart3 className="h-4 w-4 text-primary" />}
                    </>
                  )}
                  <h3 className="font-medium text-foreground">{chart.title}</h3>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Дата ({chart.data.length} оруулга)
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {chart.data.slice(0, 6).map((d, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-secondary px-2 py-1 text-xs text-foreground"
                      >
                        {d.name}: {d.value}
                      </span>
                    ))}
                    {chart.data.length > 6 && (
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        +{chart.data.length - 6} бусад
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {charts.length === 0 && (
              <div className="col-span-full flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  График нэмэгдээгүй байна
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Highlight Modal */}
      {showHighlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingHighlight !== null ? "Үзүүлэлт засах" : "Шинэ үзүүлэлт"}
              </h2>
              <button
                onClick={() => setShowHighlightModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Гарчиг
                </label>
                <input
                  type="text"
                  value={highlightForm.label}
                  onChange={(e) =>
                    setHighlightForm({ ...highlightForm, label: e.target.value })
                  }
                  placeholder="ДНБ өсөлт"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Утга
                </label>
                <input
                  type="text"
                  value={highlightForm.value}
                  onChange={(e) =>
                    setHighlightForm({ ...highlightForm, value: e.target.value })
                  }
                  placeholder="5.2%"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Өөрчлөлт
                  </label>
                  <input
                    type="text"
                    value={highlightForm.change || ""}
                    onChange={(e) =>
                      setHighlightForm({ ...highlightForm, change: e.target.value })
                    }
                    placeholder="+0.8%"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Төрөл
                  </label>
                  <select
                    value={highlightForm.changeType}
                    onChange={(e) =>
                      setHighlightForm({
                        ...highlightForm,
                        changeType: e.target.value as ChangeType,
                      })
                    }
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="positive">Өсөлт</option>
                    <option value="negative">Бууралт</option>
                    <option value="neutral">Тогтмол</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Icon
                  </label>
                  <IconPicker
                    value={highlightForm.icon || ""}
                    onChange={(icon) =>
                      setHighlightForm({ ...highlightForm, icon })
                    }
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Тайлбар
                  </label>
                  <input
                    type="text"
                    value={highlightForm.description || ""}
                    onChange={(e) =>
                      setHighlightForm({
                        ...highlightForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Өмнөх жилтэй харьцуулахад"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Дэлгэрэнгүй линк
                </label>
                <input
                  type="text"
                  value={highlightForm.link || ""}
                  onChange={(e) =>
                    setHighlightForm({
                      ...highlightForm,
                      link: e.target.value,
                    })
                  }
                  placeholder="/post/123 эсвэл https://example.com/..."
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHighlightModal(false)}
                  className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Болих
                </button>
                <button
                  type="button"
                  onClick={handleSaveHighlight}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Modal */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingChart !== null ? "График засах" : "Шинэ график"}
              </h2>
              <button
                onClick={() => setShowChartModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Гарчиг
                  </label>
                  <input
                    type="text"
                    value={chartForm.title}
                    onChange={(e) =>
                      setChartForm({ ...chartForm, title: e.target.value })
                    }
                    placeholder="ДНБ өсөлт (тэрбум төгрөг)"
                    className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Icon
                  </label>
                  <IconPicker
                    value={chartForm.icon || ""}
                    onChange={(icon) =>
                      setChartForm({ ...chartForm, icon })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Дэлгэрэнгүй линк
                </label>
                <input
                  type="text"
                  value={chartForm.link || ""}
                  onChange={(e) =>
                    setChartForm({ ...chartForm, link: e.target.value })
                  }
                  placeholder="/post/123 эсвэл https://example.com/..."
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Графикийн төрөл
                </label>
                <div className="flex gap-2">
                  {[
                    { value: "area", icon: AreaChart, label: "Area" },
                    { value: "line", icon: LineChart, label: "Line" },
                    { value: "bar", icon: BarChart3, label: "Bar" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setChartForm({
                          ...chartForm,
                          type: option.value as ChartType,
                        })
                      }
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors",
                        chartForm.type === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background text-foreground hover:bg-secondary"
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Цувааны нэршил
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Legend дээр харагдах value/value2/value3/value4 нэр
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={chartForm.dataLabel || ""}
                    onChange={(e) =>
                      setChartForm({ ...chartForm, dataLabel: e.target.value })
                    }
                    placeholder="value: 1-р улирал"
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={chartForm.dataLabel2 || ""}
                    onChange={(e) =>
                      setChartForm({ ...chartForm, dataLabel2: e.target.value })
                    }
                    placeholder="value2: 2-р улирал"
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={chartForm.dataLabel3 || ""}
                    onChange={(e) =>
                      setChartForm({ ...chartForm, dataLabel3: e.target.value })
                    }
                    placeholder="value3: 3-р улирал"
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={chartForm.dataLabel4 || ""}
                    onChange={(e) =>
                      setChartForm({ ...chartForm, dataLabel4: e.target.value })
                    }
                    placeholder="value4: 4-р улирал"
                    className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Дата оруулга
                </label>
                <p className="mb-2 text-xs text-muted-foreground">
                  Мөр бүрт "нэр:утга[:утга2[:утга3[:утга4]]]" форматаар оруулна.
                </p>
                <textarea
                  rows={8}
                  value={chartDataInput}
                  onChange={(e) => setChartDataInput(e.target.value)}
                  placeholder="2020:45.5&#10;2021:48.2&#10;2022:52.1&#10;2023:55.8&#10;2024:58.3"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChartModal(false)}
                  className="flex-1 rounded-lg border border-input bg-background py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Болих
                </button>
                <button
                  type="button"
                  onClick={handleSaveChart}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Хадгалах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
