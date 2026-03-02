"use client"

import { useEffect } from "react"
import { getPublicAdminSettingsApi } from "@/lib/api"
import { mergeSiteSettings } from "@/lib/site-settings"

const fontVarByChoice = {
  inter: "var(--font-inter)",
  finlandica: "var(--font-finlandica)",
} as const

function applyFontVars(choices: {
  headingFont: "inter" | "finlandica"
  sectionTitleFont: "inter" | "finlandica"
  cardTitleFont: "inter" | "finlandica"
}) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.style.setProperty(
    "--font-heading-family",
    fontVarByChoice[choices.headingFont]
  )
  root.style.setProperty(
    "--font-section-title-family",
    fontVarByChoice[choices.sectionTitleFont]
  )
  root.style.setProperty(
    "--font-card-title-family",
    fontVarByChoice[choices.cardTitleFont]
  )
}

export function SiteFontSync() {
  useEffect(() => {
    const applyFromLocalStorage = () => {
      if (typeof window === "undefined") return
      const raw = localStorage.getItem("dn_site_typography")
      if (!raw) return
      try {
        const parsed = JSON.parse(raw) as {
          headingFont?: "inter" | "finlandica"
          sectionTitleFont?: "inter" | "finlandica"
          cardTitleFont?: "inter" | "finlandica"
        }
        if (
          parsed.headingFont &&
          parsed.sectionTitleFont &&
          parsed.cardTitleFont
        ) {
          applyFontVars({
            headingFont: parsed.headingFont,
            sectionTitleFont: parsed.sectionTitleFont,
            cardTitleFont: parsed.cardTitleFont,
          })
        }
      } catch {
        // no-op
      }
    }

    applyFromLocalStorage()

    let cancelled = false
    getPublicAdminSettingsApi()
      .then((incoming) => {
        if (cancelled) return
        const settings = mergeSiteSettings(incoming)
        applyFontVars(settings.typography)
      })
      .catch(() => {
        if (cancelled) return
      })

    const handleUpdated = () => applyFromLocalStorage()
    window.addEventListener("dn-site-settings-updated", handleUpdated)
    window.addEventListener("storage", handleUpdated)

    return () => {
      cancelled = true
      window.removeEventListener("dn-site-settings-updated", handleUpdated)
      window.removeEventListener("storage", handleUpdated)
    }
  }, [])

  return null
}
