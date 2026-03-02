import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function PostDetailLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 lg:ml-[260px]">
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="mx-auto max-w-4xl px-4 py-3 pl-14 md:px-6 lg:pl-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Буцах
            </Link>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 py-8 md:px-6">
          <div className="space-y-8">
            <header className="space-y-4">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-10 w-11/12" />
              <Skeleton className="h-10 w-9/12" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-10/12" />
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-24 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-9 w-9 rounded-lg" />
                </div>
              </div>
            </header>

            <Skeleton className="h-[220px] w-full rounded-xl sm:h-[320px]" />

            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[95%]" />
              <Skeleton className="h-5 w-[88%]" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-[90%]" />
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
