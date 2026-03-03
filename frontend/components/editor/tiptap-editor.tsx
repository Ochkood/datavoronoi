"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import TiptapImage from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Youtube from "@tiptap/extension-youtube"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  Minus,
  Code2,
  Table2,
  Youtube as YoutubeIcon,
  ArrowUpRight,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import { createPortal } from "react-dom"
import { uploadImageApi } from "@/lib/api"
import type { CategoryStats } from "@/lib/data"
import {
  createPostEmbedToken,
  parsePostEmbedToken,
  type PostEmbedKind,
} from "@/lib/post-embeds"

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

type HighlightChangeType = "positive" | "negative" | "neutral"

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Энд нийтлэлийн агуулгаа бичнэ үү...",
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [showHighlightModal, setShowHighlightModal] = useState(false)
  const [showChartModal, setShowChartModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [editingEmbedKind, setEditingEmbedKind] = useState<PostEmbedKind | null>(null)
  const [editingEmbedRange, setEditingEmbedRange] = useState<{
    from: number
    to: number
  } | null>(null)
  const [highlightBlockTitle, setHighlightBlockTitle] = useState("Гол үзүүлэлтүүд")
  const [highlightsPerRow, setHighlightsPerRow] = useState<2 | 3>(3)
  const [highlightEditIndex, setHighlightEditIndex] = useState<number | null>(null)
  const [chartBlockTitle, setChartBlockTitle] = useState("Статистик график")
  const [chartsPerRow, setChartsPerRow] = useState<1 | 2>(2)
  const [chartEditIndex, setChartEditIndex] = useState<number | null>(null)
  const [highlightItems, setHighlightItems] = useState<CategoryStats["highlights"]>([])
  const [highlightForm, setHighlightForm] = useState<{
    label: string
    value: string
    change: string
    changeType: HighlightChangeType
    description: string
    link: string
  }>({
    label: "",
    value: "",
    change: "",
    changeType: "neutral",
    description: "",
    link: "",
  })
  const [chartItems, setChartItems] = useState<CategoryStats["charts"]>([])
  const [chartForm, setChartForm] = useState({
    title: "",
    type: "area" as
      | "area"
      | "line"
      | "bar"
      | "pie"
      | "compare"
      | "groupedHorizontalBar",
    sortDescending: false,
    metricLabel: "Metric",
    dataLabel: "",
    dataLabel2: "",
    dataLabel3: "",
    dataLabel4: "",
    extraDataLabels: "",
    link: "",
  })
  const [chartDataInput, setChartDataInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isApplyingExternalRef = useRef(false)
  const latestContentRef = useRef(content || "")

  const resetHighlightBuilder = useCallback(() => {
    setEditingEmbedKind(null)
    setEditingEmbedRange(null)
    setHighlightEditIndex(null)
    setHighlightBlockTitle("Гол үзүүлэлтүүд")
    setHighlightsPerRow(3)
    setHighlightItems([])
    setHighlightForm({
      label: "",
      value: "",
      change: "",
      changeType: "neutral",
      description: "",
      link: "",
    })
  }, [])

  const resetChartBuilder = useCallback(() => {
    setEditingEmbedKind(null)
    setEditingEmbedRange(null)
    setChartEditIndex(null)
    setChartBlockTitle("Статистик график")
    setChartsPerRow(2)
    setChartItems([])
    setChartForm({
      title: "",
      type: "area",
      sortDescending: false,
      metricLabel: "Metric",
      dataLabel: "",
      dataLabel2: "",
      dataLabel3: "",
      dataLabel4: "",
      extraDataLabels: "",
      link: "",
    })
    setChartDataInput("")
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: true,
        nocookie: true,
        allowFullscreen: true,
        HTMLAttributes: {
          class: "w-full rounded-lg aspect-video",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "tiptap-content prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
      handlePaste: (view, event) => {
        const files = event.clipboardData?.files
        if (!files || files.length === 0) return false

        const imageFile = Array.from(files).find((file) =>
          file.type.startsWith("image/")
        )
        if (!imageFile) return false

        setIsUploadingImage(true)
        uploadImageApi(imageFile, "editor")
          .then((url) => {
            view.dispatch(view.state.tr)
            editor?.chain().focus().setImage({ src: url }).run()
          })
          .finally(() => {
            setIsUploadingImage(false)
          })
        return true
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      latestContentRef.current = html
      if (!isApplyingExternalRef.current) {
        onChange?.(html)
      }
    },
  })

  useEffect(() => {
    if (!editor) return
    const nextContent = content || ""
    if (nextContent !== latestContentRef.current) {
      isApplyingExternalRef.current = true
      editor.commands.setContent(nextContent, false)
      latestContentRef.current = nextContent
      queueMicrotask(() => {
        isApplyingExternalRef.current = false
      })
    }
  }, [content, editor])

  const addImage = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const onSelectImage = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !editor) return
      const input = e.currentTarget
      setIsUploadingImage(true)
      try {
        const url = await uploadImageApi(file, "editor")
        editor.chain().focus().setImage({ src: url }).run()
      } finally {
        setIsUploadingImage(false)
        input.value = ""
      }
    },
    [editor]
  )

  const setLink = useCallback(() => {
    if (!editor) return

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run()

    setLinkUrl("")
    setShowLinkInput(false)
  }, [editor, linkUrl])

  const setYoutubeVideo = useCallback(() => {
    if (!editor) return
    const url = youtubeUrl.trim()
    if (!url) return

    editor
      .chain()
      .focus()
      .setYoutubeVideo({
        src: url,
      })
      .run()
    setYoutubeUrl("")
    setShowYoutubeInput(false)
  }, [editor, youtubeUrl])

  const findEmbedTokenAtSelection = useCallback(
    (kind: PostEmbedKind) => {
      if (!editor) return null
      const { state } = editor
      const { $from } = state.selection
      const parent = $from.parent
      if (!parent.isTextblock) return null

      const text = parent.textContent || ""
      if (!text.includes("[[DV_EMBED:")) return null

      const offset = $from.parentOffset
      const tokenRegex = /\[\[DV_EMBED:[A-Za-z0-9_-]+\]\]/g
      let match: RegExpExecArray | null
      while ((match = tokenRegex.exec(text))) {
        const token = match[0]
        const start = match.index
        const end = start + token.length
        if (offset < start || offset > end) continue
        const parsed = parsePostEmbedToken(token)
        if (!parsed || parsed.kind !== kind) return null
        const parentStart = $from.start()
        return {
          embed: parsed,
          from: parentStart + start,
          to: parentStart + end,
        }
      }
      return null
    },
    [editor]
  )

  const openHighlightBuilder = useCallback(() => {
    const selected = findEmbedTokenAtSelection("highlights")
    if (selected) {
      setEditingEmbedKind("highlights")
      setEditingEmbedRange({ from: selected.from, to: selected.to })
      setHighlightBlockTitle(selected.embed.title || "Гол үзүүлэлтүүд")
      setHighlightsPerRow(selected.embed.highlightsPerRow === 2 ? 2 : 3)
      setHighlightItems(
        Array.isArray(selected.embed.stats.highlights)
          ? selected.embed.stats.highlights
          : []
      )
      setHighlightEditIndex(null)
      setHighlightForm({
        label: "",
        value: "",
        change: "",
        changeType: "neutral",
        description: "",
        link: "",
      })
    } else {
      resetHighlightBuilder()
    }
    setShowHighlightModal(true)
  }, [findEmbedTokenAtSelection, resetHighlightBuilder])

  const openChartBuilder = useCallback(() => {
    const selected = findEmbedTokenAtSelection("charts")
    if (selected) {
      setEditingEmbedKind("charts")
      setEditingEmbedRange({ from: selected.from, to: selected.to })
      setChartBlockTitle(selected.embed.title || "Статистик график")
      setChartsPerRow(selected.embed.chartsPerRow === 1 ? 1 : 2)
      setChartItems(
        Array.isArray(selected.embed.stats.charts)
          ? selected.embed.stats.charts
          : []
      )
      setChartEditIndex(null)
      setChartForm({
        title: "",
        type: "area",
        sortDescending: false,
        metricLabel: "Metric",
        dataLabel: "",
        dataLabel2: "",
        dataLabel3: "",
        dataLabel4: "",
        extraDataLabels: "",
        link: "",
      })
      setChartDataInput("")
    } else {
      resetChartBuilder()
    }
    setShowChartModal(true)
  }, [findEmbedTokenAtSelection, resetChartBuilder])

  const closeHighlightBuilder = useCallback(() => {
    setShowHighlightModal(false)
    resetHighlightBuilder()
  }, [resetHighlightBuilder])

  const closeChartBuilder = useCallback(() => {
    setShowChartModal(false)
    resetChartBuilder()
  }, [resetChartBuilder])

  const addHighlightItem = useCallback(() => {
    if (!highlightForm.label.trim() || !highlightForm.value.trim()) return

    const nextItem = {
      label: highlightForm.label.trim(),
      value: highlightForm.value.trim(),
      change: highlightForm.change.trim() || undefined,
      changeType: highlightForm.change.trim() ? highlightForm.changeType : undefined,
      description: highlightForm.description.trim() || undefined,
      link: highlightForm.link.trim() || undefined,
    }

    setHighlightItems((prev) => {
      if (highlightEditIndex === null) return [...prev, nextItem]
      return prev.map((item, idx) => (idx === highlightEditIndex ? nextItem : item))
    })
    setHighlightEditIndex(null)
    setHighlightForm((prev) => ({
      ...prev,
      label: "",
      value: "",
      change: "",
      description: "",
      link: "",
      changeType: "neutral",
    }))
  }, [highlightEditIndex, highlightForm])

  const insertHighlightsEmbed = useCallback(() => {
    if (!editor || highlightItems.length === 0) return

    const token = createPostEmbedToken({
      kind: "highlights",
      title: highlightBlockTitle,
      highlightsPerRow,
      stats: {
        highlights: highlightItems,
        charts: [],
      },
    })
    if (
      editingEmbedKind === "highlights" &&
      editingEmbedRange &&
      editingEmbedRange.to > editingEmbedRange.from
    ) {
      editor.chain().focus().insertContentAt(editingEmbedRange, token).run()
    } else {
      editor.chain().focus().insertContent(`\n${token}\n`).run()
    }
    setShowHighlightModal(false)
    resetHighlightBuilder()
  }, [
    editingEmbedKind,
    editingEmbedRange,
    editor,
    highlightBlockTitle,
    highlightItems,
    highlightsPerRow,
    resetHighlightBuilder,
  ])

  const addChartItem = useCallback(() => {
    const title = chartForm.title.trim()
    if (!title) return

    const data = chartDataInput
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split(":")
        const name = (parts[0] || "").trim()
        const row: Record<string, string | number> = { name }
        const valueParts = parts.slice(1)
        let numbers: number[] = []

        if (valueParts.length === 1) {
          const extracted = String(valueParts[0] || "").match(/-?\d+(\.\d+)?/g) || []
          numbers = extracted.map((item) => Number(item)).filter((n) => !Number.isNaN(n))
        } else {
          numbers = valueParts
            .map((part) => {
              const found = String(part).match(/-?\d+(\.\d+)?/)
              return found ? Number(found[0]) : Number.NaN
            })
            .filter((n) => !Number.isNaN(n))
        }

        for (let i = 0; i < numbers.length; i += 1) {
          const key = i === 0 ? "value" : `value${i + 1}`
          row[key] = numbers[i]
        }
        return row
      })
      .filter((item) => typeof item.name === "string" && item.name)

    if (data.length === 0) return

    const maxSeries = data.reduce((max, row) => {
      let count = 0
      while (true) {
        const key = count === 0 ? "value" : `value${count + 1}`
        if (row[key] === undefined) break
        count += 1
      }
      return Math.max(max, count)
    }, 0)

    if (maxSeries === 0) return
    if (chartForm.type === "compare" && maxSeries < 2) {
      return
    }

    const dynamicDataKeys = Array.from({ length: maxSeries }, (_, idx) =>
      idx === 0 ? "value" : `value${idx + 1}`
    )
    const baseLabels = [
      chartForm.dataLabel.trim(),
      chartForm.dataLabel2.trim(),
      chartForm.dataLabel3.trim(),
      chartForm.dataLabel4.trim(),
    ]
    const extraLabels = chartForm.extraDataLabels
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    const inputLabels = [...baseLabels, ...extraLabels]
    const dynamicDataLabels = dynamicDataKeys.map((key, idx) => inputLabels[idx] || key)

    const nextItem = {
      title,
      type: chartForm.type,
      sortDescending:
        chartForm.type === "groupedHorizontalBar"
          ? chartForm.sortDescending
          : undefined,
      data: data as CategoryStats["charts"][number]["data"],
      metricLabel: chartForm.type === "compare" ? chartForm.metricLabel.trim() || "Metric" : undefined,
      dataKeys: dynamicDataKeys,
      dataLabels: dynamicDataLabels,
      dataKey: dynamicDataKeys[0],
      dataKey2: dynamicDataKeys[1],
      dataKey3: dynamicDataKeys[2],
      dataKey4: dynamicDataKeys[3],
      dataLabel: dynamicDataLabels[0],
      dataLabel2: dynamicDataLabels[1],
      dataLabel3: dynamicDataLabels[2],
      dataLabel4: dynamicDataLabels[3],
      link: chartForm.link.trim() || undefined,
    }

    setChartItems((prev) => {
      if (chartEditIndex === null) return [...prev, nextItem]
      return prev.map((item, idx) => (idx === chartEditIndex ? nextItem : item))
    })
    setChartEditIndex(null)
    setChartForm({
      title: "",
      type: "area",
      sortDescending: false,
      metricLabel: "Metric",
      dataLabel: "",
      dataLabel2: "",
      dataLabel3: "",
      dataLabel4: "",
      extraDataLabels: "",
      link: "",
    })
    setChartDataInput("")
  }, [chartDataInput, chartEditIndex, chartForm])

  const insertChartsEmbed = useCallback(() => {
    if (!editor || chartItems.length === 0) return

    const token = createPostEmbedToken({
      kind: "charts",
      title: chartBlockTitle,
      chartsPerRow,
      stats: {
        highlights: [],
        charts: chartItems,
      },
    })
    if (
      editingEmbedKind === "charts" &&
      editingEmbedRange &&
      editingEmbedRange.to > editingEmbedRange.from
    ) {
      editor.chain().focus().insertContentAt(editingEmbedRange, token).run()
    } else {
      editor.chain().focus().insertContent(`\n${token}\n`).run()
    }
    setShowChartModal(false)
    resetChartBuilder()
  }, [
    chartBlockTitle,
    chartItems,
    chartsPerRow,
    editingEmbedKind,
    editingEmbedRange,
    editor,
    resetChartBuilder,
  ])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    preventMouseDown = true,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    preventMouseDown?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        if (preventMouseDown) e.preventDefault()
      }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  )

  const ToolbarDivider = () => <div className="mx-1 h-6 w-px bg-border" />

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2">
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Буцаах"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Дахин хийх"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
          title="Гарчиг 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Гарчиг 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Гарчиг 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Basic Formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Тод"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Налуу"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Доогуур зураас"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Дундуур зураас"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Код"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Зүүн"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Төв"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Баруун"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          title="Тэгшлэх"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Жагсаалт"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Дугаарласан жагсаалт"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block Elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Ишлэл"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Код блок"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Хэвтээ шугам"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowLinkInput(!showLinkInput)}
            isActive={editor.isActive("link")}
            title="Холбоос"
          >
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          {showLinkInput && (
            <div className="absolute left-0 top-full z-10 mt-1 flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-lg">
              <input
                type="url"
                placeholder="https://..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-48 rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && setLink()}
              />
              <button
                onClick={setLink}
                className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
              >
                Нэмэх
              </button>
            </div>
          )}
        </div>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Холбоос устгах"
          >
            <Unlink className="h-4 w-4" />
          </ToolbarButton>
        )}

        {/* Image */}
        <ToolbarButton onClick={addImage} title="Зураг">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton
          onClick={() => {
            if (editor.isActive("table")) {
              editor.chain().focus().deleteTable().run()
              return
            }
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }}
          isActive={editor.isActive("table")}
          title={editor.isActive("table") ? "Хүснэгт устгах" : "Хүснэгт нэмэх"}
        >
          <Table2 className="h-4 w-4" />
        </ToolbarButton>
        {editor.isActive("table") && (
          <>
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Багана нэмэх"
            >
              +C
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Мөр нэмэх"
            >
              +R
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Багана устгах"
            >
              -C
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Мөр устгах"
            >
              -R
            </ToolbarButton>
          </>
        )}

        {/* Youtube */}
        <div className="relative">
          <ToolbarButton
            onClick={() => setShowYoutubeInput((prev) => !prev)}
            title="YouTube видео"
          >
            <YoutubeIcon className="h-4 w-4" />
          </ToolbarButton>
          {showYoutubeInput && (
            <div className="absolute left-0 top-full z-10 mt-1 flex items-center gap-2 rounded-lg border border-border bg-card p-2 shadow-lg">
              <input
                type="url"
                placeholder="YouTube URL..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-56 rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyDown={(e) => e.key === "Enter" && setYoutubeVideo()}
              />
              <button
                onClick={setYoutubeVideo}
                className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
              >
                Нэмэх
              </button>
            </div>
          )}
        </div>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => {
            openHighlightBuilder()
          }}
          preventMouseDown={false}
          title="Голлох үзүүлэлт оруулах"
        >
          <ArrowUpRight className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            openChartBuilder()
          }}
          preventMouseDown={false}
          title="Инфо график оруулах"
        >
          <BarChart3 className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onSelectImage}
        />
      </div>

      {showHighlightModal &&
        isMounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEmbedKind === "highlights"
                  ? "Голлох үзүүлэлт засах"
                  : "Голлох үзүүлэлт оруулах"}
              </h3>
              <button
                type="button"
                onClick={closeHighlightBuilder}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Хэсгийн гарчиг
              </label>
              <input
                type="text"
                value={highlightBlockTitle}
                onChange={(e) => setHighlightBlockTitle(e.target.value)}
                placeholder="Гол үзүүлэлтүүд"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Нэг мөрөнд харуулах card тоо
              </label>
              <select
                value={highlightsPerRow}
                onChange={(e) => setHighlightsPerRow(Number(e.target.value) === 2 ? 2 : 3)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value={3}>3 card</option>
                <option value={2}>2 card</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={highlightForm.label}
                onChange={(e) =>
                  setHighlightForm((prev) => ({ ...prev, label: e.target.value }))
                }
                placeholder="Нэр (ж: ДНБ)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={highlightForm.value}
                onChange={(e) =>
                  setHighlightForm((prev) => ({ ...prev, value: e.target.value }))
                }
                placeholder="Утга (ж: 5.2%)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={highlightForm.change}
                onChange={(e) =>
                  setHighlightForm((prev) => ({ ...prev, change: e.target.value }))
                }
                placeholder="Өөрчлөлт (ж: +0.8%)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <select
                value={highlightForm.changeType}
                onChange={(e) =>
                  setHighlightForm((prev) => ({
                    ...prev,
                    changeType: e.target.value as HighlightChangeType,
                  }))
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="positive">Эерэг</option>
                <option value="neutral">Саармаг</option>
                <option value="negative">Сөрөг</option>
              </select>
              <input
                type="text"
                value={highlightForm.description}
                onChange={(e) =>
                  setHighlightForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Тайлбар (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2"
              />
              <input
                type="url"
                value={highlightForm.link}
                onChange={(e) =>
                  setHighlightForm((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Дэлгэрэнгүй холбоос (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2"
              />
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addHighlightItem}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
                {highlightEditIndex === null ? "Карт нэмэх" : "Карт шинэчлэх"}
              </button>
            </div>

            <div className="mt-4 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-border bg-background p-2">
              {highlightItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Карт нэмэгдээгүй байна</p>
              ) : (
                highlightItems.map((item, idx) => (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex items-center justify-between rounded-md bg-card p-2 ring-1 ring-border"
                  >
                    <p className="text-sm text-foreground">
                      {item.label}: <span className="font-semibold">{item.value}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setHighlightEditIndex(idx)
                        setHighlightForm({
                          label: item.label || "",
                          value: item.value || "",
                          change: item.change || "",
                          changeType:
                            item.changeType === "positive" ||
                            item.changeType === "negative" ||
                            item.changeType === "neutral"
                              ? item.changeType
                              : "neutral",
                          description: item.description || "",
                          link: item.link || "",
                        })
                      }}
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHighlightItems((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeHighlightBuilder}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                Болих
              </button>
              <button
                type="button"
                onClick={insertHighlightsEmbed}
                disabled={highlightItems.length === 0}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                Контент руу оруулах
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}

      {showChartModal &&
        isMounted &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                {editingEmbedKind === "charts"
                  ? "Инфо график засах"
                  : "Инфо график оруулах"}
              </h3>
              <button
                type="button"
                onClick={closeChartBuilder}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Хэсгийн гарчиг
              </label>
              <input
                type="text"
                value={chartBlockTitle}
                onChange={(e) => setChartBlockTitle(e.target.value)}
                placeholder="Статистик график"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Нэг мөрөнд харуулах графикийн тоо
              </label>
              <select
                value={chartsPerRow}
                onChange={(e) => setChartsPerRow(Number(e.target.value) === 1 ? 1 : 2)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value={2}>2 график</option>
                <option value={1}>1 график (full width)</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={chartForm.title}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Графикийн нэр"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <select
                value={chartForm.type}
                onChange={(e) =>
                  setChartForm((prev) => ({
                    ...prev,
                    type: e.target.value as
                      | "area"
                      | "line"
                      | "bar"
                      | "pie"
                      | "compare"
                      | "groupedHorizontalBar",
                  }))
                }
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="area">Area</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
                <option value="pie">Pie</option>
                <option value="compare">Comparison Matrix</option>
                <option value="groupedHorizontalBar">Grouped Horizontal Bar</option>
              </select>
              {chartForm.type === "groupedHorizontalBar" ? (
                <label className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm">
                  <input
                    type="checkbox"
                    checked={chartForm.sortDescending}
                    onChange={(e) =>
                      setChartForm((prev) => ({
                        ...prev,
                        sortDescending: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-border"
                  />
                  Утгаар буурахаар эрэмбэлэх
                </label>
              ) : null}
              <input
                type="text"
                value={chartForm.dataLabel}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, dataLabel: e.target.value }))
                }
                placeholder="Series 1 нэр (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={chartForm.dataLabel2}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, dataLabel2: e.target.value }))
                }
                placeholder="Series 2 нэр (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={chartForm.dataLabel3}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, dataLabel3: e.target.value }))
                }
                placeholder="Series 3 нэр (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={chartForm.dataLabel4}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, dataLabel4: e.target.value }))
                }
                placeholder="Series 4 нэр (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
              />
              <input
                type="text"
                value={chartForm.extraDataLabels}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, extraDataLabels: e.target.value }))
                }
                placeholder="Series 5+ нэрс (таслалаар, optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2"
              />
              {chartForm.type === "compare" ? (
                <input
                  type="text"
                  value={chartForm.metricLabel}
                  onChange={(e) =>
                    setChartForm((prev) => ({ ...prev, metricLabel: e.target.value }))
                  }
                  placeholder="Зүүн баганын гарчиг (ж: Metric)"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2"
                />
              ) : null}
              <input
                type="url"
                value={chartForm.link}
                onChange={(e) =>
                  setChartForm((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="Дэлгэрэнгүй холбоос (optional)"
                className="h-10 rounded-lg border border-input bg-background px-3 text-sm sm:col-span-2"
              />
            </div>

            <textarea
              value={chartDataInput}
              onChange={(e) => setChartDataInput(e.target.value)}
              placeholder={
                chartForm.type === "compare"
                  ? "Comparison өгөгдөл\nмөр бүрт: metric:value1:value2(:value3:value4...)\nMilitary Budget:24.4:31.0\nPopulation:9.9:89.7"
                  : chartForm.type === "groupedHorizontalBar"
                    ? "Grouped Horizontal өгөгдөл\nмөр бүрт: нэр:value1:value2:value3... эсвэл нэр: Gold 18, Silver 12, Bronze 11\nNorway:18:12:11\nUSA: Gold 12, Silver 12, Bronze 9"
                    : "Дата оруулга\nмөр бүрт: нэр:утга эсвэл нэр:утга:утга2(:утга3:утга4...)\n2022:3.8:8.0\n2023:2.0:6.7"
              }
              rows={6}
              className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={addChartItem}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
              >
                <Plus className="h-4 w-4" />
                {chartEditIndex === null ? "График нэмэх" : "График шинэчлэх"}
              </button>
            </div>

            <div className="mt-4 max-h-44 space-y-2 overflow-y-auto rounded-lg border border-border bg-background p-2">
              {chartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">График нэмэгдээгүй байна</p>
              ) : (
                chartItems.map((item, idx) => (
                  <div
                    key={`${item.title}-${idx}`}
                    className="flex items-center justify-between rounded-md bg-card p-2 ring-1 ring-border"
                  >
                    <p className="text-sm text-foreground">
                      {item.title} ({item.type}) - {item.data.length} мөр
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setChartEditIndex(idx)
                        setChartForm({
                          title: item.title || "",
                          type:
                            item.type === "line" ||
                            item.type === "bar" ||
                            item.type === "pie" ||
                            item.type === "compare" ||
                            item.type === "groupedHorizontalBar"
                              ? item.type
                              : "area",
                          sortDescending: Boolean(item.sortDescending),
                          metricLabel: item.metricLabel || "Metric",
                          dataLabel: item.dataLabel || "",
                          dataLabel2: item.dataLabel2 || "",
                          dataLabel3: item.dataLabel3 || "",
                          dataLabel4: item.dataLabel4 || "",
                          extraDataLabels: (item.dataLabels || []).slice(4).filter(Boolean).join(", "),
                          link: item.link || "",
                        })
                        const rows = (item.data || [])
                          .map((row) => {
                            const values = [
                              String(row.name ?? ""),
                              String(row.value ?? ""),
                            ]
                            if (row.value2 !== undefined) values.push(String(row.value2))
                            if (row.value3 !== undefined) values.push(String(row.value3))
                            if (row.value4 !== undefined) values.push(String(row.value4))
                            return values.join(":")
                          })
                          .join("\n")
                        setChartDataInput(rows)
                      }}
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setChartItems((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeChartBuilder}
                className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
              >
                Болих
              </button>
              <button
                type="button"
                onClick={insertChartsEmbed}
                disabled={chartItems.length === 0}
                className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                Контент руу оруулах
              </button>
            </div>
          </div>
        </div>,
          document.body
        )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
      {isUploadingImage && (
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
          Зураг upload хийж байна...
        </div>
      )}

      {/* Character Count */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
        <span>
          {editor.storage.characterCount?.characters?.() ?? 0} тэмдэгт
        </span>
        <span>{editor.storage.characterCount?.words?.() ?? 0} үг</span>
      </div>

      <style jsx global>{`
        .tiptap-content ol {
          list-style: decimal;
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .tiptap-content ul {
          list-style: disc;
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .tiptap-content li {
          margin: 0.25rem 0;
        }
        .tiptap-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 0.75rem 0;
        }
        .tiptap-content th,
        .tiptap-content td {
          border: 1px solid oklch(0.9 0.01 240);
          padding: 0.5rem;
          vertical-align: top;
        }
        .tiptap-content th {
          background: oklch(0.97 0.01 240);
          font-weight: 600;
        }
        .tiptap-content iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: 0;
          border-radius: 0.5rem;
          margin: 0.75rem 0;
        }
      `}</style>
    </div>
  )
}
