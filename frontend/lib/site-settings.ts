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
  typography: {
    headingFont: "inter" | "finlandica"
    sectionTitleFont: "inter" | "finlandica"
    cardTitleFont: "inter" | "finlandica"
  }
  sidebarBanner: {
    enabled: boolean
    imageUrl: string
    linkUrl: string
    alt: string
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
  typography: {
    headingFont: "inter",
    sectionTitleFont: "inter",
    cardTitleFont: "inter",
  },
  sidebarBanner: {
    enabled: false,
    imageUrl: "",
    linkUrl: "",
    alt: "Сурталгааны баннер",
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
    typography: {
      ...defaultSiteSettings.typography,
      ...(incoming.typography || {}),
    },
    sidebarBanner: {
      ...defaultSiteSettings.sidebarBanner,
      ...(incoming.sidebarBanner || {}),
    },
  }
}
