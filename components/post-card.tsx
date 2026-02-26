"use client"

import { useState } from "react"
import Image from "next/image"
import { Bookmark, Share2, Eye, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PostData {
  id: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  image: string
  author: string
  authorAvatar: string
  date: string
  views: string
  comments: number
  featured?: boolean
}

interface PostCardProps {
  post: PostData
  variant?: "default" | "featured" | "compact" | "list"
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  const [saved, setSaved] = useState(false)

  if (variant === "list") {
    return (
      <article className="group flex gap-4 rounded-xl bg-card p-4 ring-1 ring-border transition-all hover:shadow-md hover:ring-border/80">
        <div className="relative h-28 w-44 flex-shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-52">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={cn(
              "absolute left-2 top-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold",
              post.categoryColor
            )}
          >
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div>
            <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-card-foreground text-pretty">
              {post.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={post.authorAvatar}
                    alt={post.author}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-card-foreground">
                  {post.author}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Eye className="h-3 w-3" />
                {post.views}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                {post.comments}
              </span>
              <button
                onClick={() => setSaved(!saved)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={saved ? "Хадгалсан" : "Хадгалах"}
              >
                <Bookmark
                  className={cn(
                    "h-3.5 w-3.5",
                    saved && "fill-primary text-primary"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </article>
    )
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 rounded-lg bg-card p-3 ring-1 ring-border transition-all hover:shadow-sm hover:ring-border/80">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-0.5">
          <div>
            <span
              className={cn(
                "inline-block rounded-full px-2 py-px text-[10px] font-semibold",
                post.categoryColor
              )}
            >
              {post.category}
            </span>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-tight text-card-foreground">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{post.author}</span>
            <span className="text-border">|</span>
            <span>{post.date}</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border transition-all hover:shadow-md hover:ring-border/80">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
            post.categoryColor
          )}
        >
          {post.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-card-foreground text-pretty">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-card-foreground">
                {post.author}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {post.date}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 flex items-center gap-1 text-[11px] text-muted-foreground">
              <Eye className="h-3 w-3" />
              {post.views}
            </span>
            <button
              onClick={() => setSaved(!saved)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={saved ? "Хадгалсан" : "Хадгалах"}
            >
              <Bookmark
                className={cn(
                  "h-3.5 w-3.5",
                  saved && "fill-primary text-primary"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
