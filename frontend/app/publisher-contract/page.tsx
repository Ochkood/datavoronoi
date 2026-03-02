"use client"

import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"

export default function PublisherContractPage() {
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
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Нийтлэгчийн гэрээ</h1>
            </div>

            <div className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>1. Нийтлэгч нь нийтэлж буй контентын үнэн зөв, эх сурвалжийн найдвартай байдлыг бүрэн хариуцна.</p>
              <p>2. Хуулбарласан, зохиогчийн эрх зөрчсөн, худал мэдээлэл агуулсан контент оруулахыг хориглоно.</p>
              <p>3. Админ баг нь контентыг хянах, засвар шаардах, түр түдгэлзүүлэх, татгалзах эрхтэй.</p>
              <p>4. Нийтлэгч нь хэрэглэгчийн хувийн мэдээллийг зөвшөөрөлгүй цуглуулах, нийтлэхгүй.</p>
              <p>5. Хэрэв бодлого зөрчвөл нийтлэгчийн эрхийг хязгаарлах эсвэл цуцалж болно.</p>
              <p>6. Энэхүү гэрээний нөхцөл шинэчлэгдэх боломжтой бөгөөд өөрчлөлтийг нийтлэгчид мэдэгдэнэ.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
