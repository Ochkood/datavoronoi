"use client"

import Link from "next/link"
import { Home, ArrowLeft, SearchX } from "lucide-react"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <SearchX className="h-7 w-7 text-primary" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-primary">404 Error</p>
        <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
          Хуудас олдсонгүй
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Таны хайсан хуудас устсан эсвэл холбоос буруу байж магадгүй.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Нүүр хуудас
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined") window.history.back()
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Буцах
          </button>
        </div>
      </div>
    </main>
  )
}
