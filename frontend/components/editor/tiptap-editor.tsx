"use client"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import { uploadImageApi } from "@/lib/api"

interface TiptapEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
}

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isApplyingExternalRef = useRef(false)
  const latestContentRef = useRef(content || "")

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

  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
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
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onSelectImage}
        />
      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarButton>
        </BubbleMenu>
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
