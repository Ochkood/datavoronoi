export type SiteSettings = {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    contactEmail: string
    contactPhone: string
    contactAddress: string
    social: {
      facebook: string
      instagram: string
      linkedin: string
    }
  }
  email: {
    fromName: string
    fromEmail: string
    replyTo: string
    newsletterEnabled: boolean
  }
}

export const defaultSiteSettings: SiteSettings = {
  general: {
    siteName: "Datanews.mn",
    siteDescription:
      "Монголын анхны дата сэтгүүл зүйн платформ. Мэдээллийн инфографик, дата визуализаци, шинжилгээ.",
    siteUrl: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    social: {
      facebook: "",
      instagram: "",
      linkedin: "",
    },
  },
  email: {
    fromName: "Datanews.mn",
    fromEmail: "",
    replyTo: "",
    newsletterEnabled: true,
  },
}

export function mergeSiteSettings(
  incoming?: Partial<SiteSettings> | null
): SiteSettings {
  if (!incoming) return defaultSiteSettings
  return {
    general: {
      ...defaultSiteSettings.general,
      ...(incoming.general || {}),
      social: {
        ...defaultSiteSettings.general.social,
        ...(incoming.general?.social || {}),
      },
    },
    email: {
      ...defaultSiteSettings.email,
      ...(incoming.email || {}),
    },
  }
}

