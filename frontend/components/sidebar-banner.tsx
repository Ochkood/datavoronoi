"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { getPublicBannersApi, type BannerItem, type BannerTargetType } from "@/lib/api"

type SidebarBannerProps = {
  pageType?: BannerTargetType
  targetId?: string
}

export function SidebarBanner({ pageType = "home", targetId }: SidebarBannerProps) {
  const [items, setItems] = useState<BannerItem[]>([])
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      getPublicBannersApi({
        placement: "sidebar",
        pageType,
        targetId,
        limit: 5,
      })
        .then((rows) => {
          if (cancelled) return
          setItems(rows)
          setIndex(0)
          setVisible(true)
        })
        .catch(() => {
          if (cancelled) return
          setItems([])
          setIndex(0)
          setVisible(true)
        })
    }

    load()
    window.addEventListener("dn-site-settings-updated", load)

    return () => {
      cancelled = true
      window.removeEventListener("dn-site-settings-updated", load)
    }
  }, [pageType, targetId])

  useEffect(() => {
    if (items.length <= 1) return
    let timeoutId: number | null = null
    const timer = window.setInterval(() => {
      setVisible(false)
      timeoutId = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length)
        setVisible(true)
      }, 180)
    }, 5000)
    return () => {
      window.clearInterval(timer)
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [items])

  const active = useMemo(() => {
    if (items.length === 0) return null
    return items[index % items.length]
  }, [items, index])

  if (!active || !active.imageUrl) return null

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      {active.linkUrl ? (
        <Link
          href={active.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-95"
        >
          <img
            src={active.imageUrl}
            alt={active.alt || active.title || "Сурталгааны баннер"}
            className={`h-auto w-full object-contain transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
          />
        </Link>
      ) : (
        <img
          src={active.imageUrl}
          alt={active.alt || active.title || "Сурталгааны баннер"}
          className={`h-auto w-full object-contain transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
        />
      )}
    </div>
  )
}
