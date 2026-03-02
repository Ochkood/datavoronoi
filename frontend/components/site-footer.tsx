"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { getPublicAdminSettingsApi } from "@/lib/api"
import { mergeSiteSettings } from "@/lib/site-settings"

export function SiteFooter() {
  const [siteName, setSiteName] = useState("Datanews.mn")
  const [description, setDescription] = useState(
    "Монголын анхны дата сэтгүүл зүйн платформ."
  )
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [social, setSocial] = useState({
    facebook: "",
    instagram: "",
    linkedin: "",
  })

  useEffect(() => {
    let cancelled = false
    getPublicAdminSettingsApi()
      .then((incoming) => {
        if (cancelled) return
        const settings = mergeSiteSettings(incoming)
        setSiteName(settings.general.siteName || "Datanews.mn")
        setDescription(settings.general.siteDescription || "Монголын анхны дата сэтгүүл зүйн платформ.")
        setContactEmail(settings.general.contactEmail || settings.email.fromEmail || "")
        setContactPhone(settings.general.contactPhone || "")
        setContactAddress(settings.general.contactAddress || "")
        setSocial(settings.general.social || { facebook: "", instagram: "", linkedin: "" })
      })
      .catch(() => {
        if (cancelled) return
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="mt-10 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-base font-bold text-foreground">{siteName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {contactEmail ? (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {contactEmail}
            </p>
          ) : null}
          {contactPhone ? (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {contactPhone}
            </p>
          ) : null}
          {contactAddress ? (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {contactAddress}
            </p>
          ) : null}
        </div>

        <div className="flex items-start gap-2 md:justify-end">
          {social.facebook ? (
            <Link
              href={social.facebook}
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <Facebook className="h-4 w-4" />
            </Link>
          ) : null}
          {social.instagram ? (
            <Link
              href={social.instagram}
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </Link>
          ) : null}
          {social.linkedin ? (
            <Link
              href={social.linkedin}
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {siteName}
      </div>
    </footer>
  )
}

