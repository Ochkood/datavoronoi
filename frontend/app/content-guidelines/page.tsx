"use client"

import Link from "next/link"
import { ArrowLeft, BookOpenText } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"

export default function ContentGuidelinesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 lg:ml-[260px]">
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <Link href="/become-publisher" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Хүсэлт рүү буцах
          </Link>

          <div className="mt-4 rounded-2xl bg-card p-6 ring-1 ring-border md:p-8">
            <div className="mb-4 flex items-center gap-2">
              <BookOpenText className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Контентын удирдамж</h1>
            </div>

            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>1. Гарчиг ойлгомжтой, товч, төөрөгдүүлэхгүй байх.</p>
              <p>2. Контент нь дата, тоон баримтад тулгуурласан эх сурвалжтай байх.</p>
              <p>3. График, зураг, хүснэгт бүр тайлбар болон эх сурвалжтай байх.</p>
              <p>4. Нийтлэлд дор хаяж нэг дүгнэлт, уншигчид өгөх гол санаа тусгагдсан байх.</p>
              <p>5. Үзэн ядалт, ялгаварлан гадуурхалт, хүчирхийлэл өдөөсөн агуулга оруулахгүй.</p>
              <p>6. Засварын хүсэлт ирсэн тохиолдолд нийтлэгч тодорхой хугацаанд шинэчилж илгээнэ.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
