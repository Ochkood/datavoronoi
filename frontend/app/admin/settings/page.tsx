"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Check,
  Image as ImageIcon,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  createAdminBannerApi,
  changeMyPasswordApi,
  deleteAdminBannerApi,
  getAdminBannersApi,
  getAdminSettingsApi,
  getCategories,
  getTopics,
  uploadImageApi,
  updateAdminBannerApi,
  updateAdminSettingsApi,
  type AdminSettings,
  type BannerItem,
  type BannerTargetType,
  type BackendCategory,
  type BackendTopic,
} from "@/lib/api"

type TabKey = "general" | "banner" | "email" | "notifications" | "security"

const tabs: Array<{ id: TabKey; label: string; icon: LucideIcon }> = [
  { id: "general", label: "Ерөнхий", icon: Settings },
  { id: "banner", label: "Banner", icon: ImageIcon },
  { id: "email", label: "Имэйл", icon: Mail },
  { id: "notifications", label: "Мэдэгдэл", icon: Bell },
  { id: "security", label: "Аюулгүй байдал", icon: Shield },
]

const defaultSettings: AdminSettings = {
  key: "main",
  general: {
    siteName: "Datanews.mn",
    siteDescription: "",
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
  notifications: {
    newUser: true,
    publisherRequest: true,
    feedback: true,
    systemError: true,
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

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-background transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  )
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("general")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)

  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [categories, setCategories] = useState<BackendCategory[]>([])
  const [topics, setTopics] = useState<BackendTopic[]>([])
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([])
  const [bannerLoading, setBannerLoading] = useState(false)
  const [bannerSubmitting, setBannerSubmitting] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerPage, setBannerPage] = useState(1)
  const [bannerTotalPages, setBannerTotalPages] = useState(1)
  const [bannerFilterType, setBannerFilterType] = useState<"all" | BannerTargetType>("all")
  const [bannerFilterStatus, setBannerFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all")
  const [bannerForm, setBannerForm] = useState<{
    title: string
    imageUrl: string
    linkUrl: string
    alt: string
    targetType: BannerTargetType
    targetId: string
    sortOrder: number
    isActive: boolean
  }>({
    title: "",
    imageUrl: "",
    linkUrl: "",
    alt: "Сурталгааны баннер",
    targetType: "home",
    targetId: "",
    sortOrder: 0,
    isActive: true,
  })
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  })

  useEffect(() => {
    getAdminSettingsApi()
      .then((data) => {
        setSettings({
          ...defaultSettings,
          ...data,
          general: {
            ...defaultSettings.general,
            ...data.general,
            social: {
              ...defaultSettings.general.social,
              ...data.general?.social,
            },
          },
          email: {
            ...defaultSettings.email,
            ...data.email,
          },
          notifications: {
            ...defaultSettings.notifications,
            ...data.notifications,
          },
          typography: {
            ...defaultSettings.typography,
            ...data.typography,
          },
          sidebarBanner: {
            ...defaultSettings.sidebarBanner,
            ...data.sidebarBanner,
          },
        })
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Тохиргоо ачаалж чадсангүй")
      })
      .finally(() => setLoading(false))
  }, [])

  const savePayload = useMemo(
    () => ({
      general: settings.general,
      email: settings.email,
      notifications: settings.notifications,
      typography: settings.typography,
    }),
    [settings]
  )

  useEffect(() => {
    if (activeTab !== "banner") return
    let cancelled = false
    Promise.all([getCategories(), getTopics()])
      .then(([categoryRows, topicRows]) => {
        if (cancelled) return
        setCategories(categoryRows)
        setTopics(topicRows)
      })
      .catch(() => {
        if (cancelled) return
        setCategories([])
        setTopics([])
      })
    return () => {
      cancelled = true
    }
  }, [activeTab])

  const loadBanners = async (page = 1) => {
    setBannerLoading(true)
    try {
      const res = await getAdminBannersApi({
        page,
        limit: 12,
        targetType: bannerFilterType,
        status: bannerFilterStatus,
      })
      setBannerItems(res.items)
      setBannerPage(res.pagination.page)
      setBannerTotalPages(res.pagination.totalPages)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Баннер жагсаалт ачаалж чадсангүй")
      setBannerItems([])
    } finally {
      setBannerLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab !== "banner") return
    void loadBanners(bannerPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, bannerPage, bannerFilterType, bannerFilterStatus])

  const handleBannerImageUpload = async (file?: File) => {
    if (!file) return
    setBannerUploading(true)
    setError("")
    try {
      const uploadedUrl = await uploadImageApi(file, "banners")
      setBannerForm((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Баннер upload хийх үед алдаа гарлаа")
    } finally {
      setBannerUploading(false)
    }
  }

  const resetBannerForm = () => {
    setEditingBannerId(null)
    setBannerForm({
      title: "",
      imageUrl: "",
      linkUrl: "",
      alt: "Сурталгааны баннер",
      targetType: "home",
      targetId: "",
      sortOrder: 0,
      isActive: true,
    })
  }

  const handleEditBanner = (item: BannerItem) => {
    setEditingBannerId(item.id)
    setBannerForm({
      title: item.title,
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl || "",
      alt: item.alt || "Сурталгааны баннер",
      targetType: item.targetType,
      targetId:
        item.targetType === "category"
          ? item.category?.id || ""
          : item.targetType === "topic"
            ? item.topic?.id || ""
            : "",
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive,
    })
  }

  const handleSaveBanner = async () => {
    if (!bannerForm.title.trim()) {
      setError("Баннерын нэр оруулна уу")
      return
    }
    if (!bannerForm.imageUrl.trim()) {
      setError("Баннерын зураг оруулна уу")
      return
    }
    if ((bannerForm.targetType === "category" || bannerForm.targetType === "topic") && !bannerForm.targetId) {
      setError("Ангилал/сэдвээ сонгоно уу")
      return
    }

    setBannerSubmitting(true)
    setError("")
    const payload = {
      title: bannerForm.title.trim(),
      imageUrl: bannerForm.imageUrl.trim(),
      linkUrl: bannerForm.linkUrl.trim(),
      alt: bannerForm.alt.trim(),
      targetType: bannerForm.targetType,
      categoryId: bannerForm.targetType === "category" ? bannerForm.targetId : undefined,
      topicId: bannerForm.targetType === "topic" ? bannerForm.targetId : undefined,
      sortOrder: Number(bannerForm.sortOrder || 0),
      isActive: bannerForm.isActive,
    }

    try {
      if (editingBannerId) {
        await updateAdminBannerApi(editingBannerId, payload)
      } else {
        await createAdminBannerApi(payload)
      }
      await loadBanners(1)
      setBannerPage(1)
      resetBannerForm()
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("dn-site-settings-updated"))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Баннер хадгалах үед алдаа гарлаа")
    } finally {
      setBannerSubmitting(false)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm("Энэ баннерыг устгах уу?")) return
    try {
      await deleteAdminBannerApi(id)
      await loadBanners(bannerPage)
      if (editingBannerId === id) resetBannerForm()
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("dn-site-settings-updated"))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Баннер устгах үед алдаа гарлаа")
    }
  }

  const handleToggleBannerActive = async (item: BannerItem) => {
    try {
      await updateAdminBannerApi(item.id, { isActive: !item.isActive })
      await loadBanners(bannerPage)
      if (editingBannerId === item.id) {
        setBannerForm((prev) => ({ ...prev, isActive: !item.isActive }))
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("dn-site-settings-updated"))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Баннер төлөв өөрчлөх үед алдаа гарлаа")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const next = await updateAdminSettingsApi(savePayload)
      setSettings((prev) => ({ ...prev, ...next }))
      if (typeof window !== "undefined") {
        const typography =
          next.typography || settings.typography || defaultSettings.typography
        localStorage.setItem("dn_site_typography", JSON.stringify(typography))
        window.dispatchEvent(new Event("dn-site-settings-updated"))
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2200)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хадгалах үед алдаа гарлаа")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess("")

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Нууц үгээ бүрэн оруулна уу")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Шинэ нууц үг 6-с багагүй тэмдэгттэй байна")
      return
    }
    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setPasswordError("Шинэ нууц үгийн давталт таарахгүй байна")
      return
    }

    setPasswordLoading(true)
    try {
      await changeMyPasswordApi(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordSuccess("Нууц үг амжилттай шинэчлэгдлээ")
      setPasswordForm({ currentPassword: "", newPassword: "", repeatPassword: "" })
    } catch (e) {
      setPasswordError(e instanceof Error ? e.message : "Нууц үг солих үед алдаа гарлаа")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Тохиргоо</h1>
            <p className="text-sm text-muted-foreground">Админ хэсгийн суурь тохиргоонууд</p>
          </div>
          {activeTab !== "security" && activeTab !== "banner" ? (
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                saved
                  ? "bg-chart-4 text-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                (loading || saving) && "cursor-not-allowed opacity-70"
              )}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Хадгалж байна...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Хадгалсан
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Хадгалах
                </>
              )}
            </button>
          ) : null}
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 border-r border-border bg-card/50 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {error ? (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {activeTab === "general" ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Сайтын мэдээлэл</h2>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Сайтын нэр</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, siteName: e.target.value },
                        }))
                      }
                      className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Сайтын тайлбар</label>
                    <textarea
                      rows={3}
                      value={settings.general.siteDescription}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, siteDescription: e.target.value },
                        }))
                      }
                      className="w-full max-w-2xl rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Сайтын URL</label>
                    <input
                      type="url"
                      value={settings.general.siteUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, siteUrl: e.target.value },
                        }))
                      }
                      className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Холбоо барих</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Имэйл хаяг</label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, contactEmail: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Утасны дугаар</label>
                    <input
                      type="tel"
                      value={settings.general.contactPhone}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, contactPhone: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Хаяг</label>
                    <input
                      type="text"
                      value={settings.general.contactAddress}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, contactAddress: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Нийгмийн сүлжээ</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Facebook</label>
                    <input
                      type="url"
                      value={settings.general.social.facebook}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            social: { ...prev.general.social, facebook: e.target.value },
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Instagram</label>
                    <input
                      type="url"
                      value={settings.general.social.instagram}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            social: { ...prev.general.social, instagram: e.target.value },
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">LinkedIn</label>
                    <input
                      type="url"
                      value={settings.general.social.linkedin}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            social: { ...prev.general.social, linkedin: e.target.value },
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Фонтын тохиргоо</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Гарчиг, section title, card title-ийн фонтыг Inter эсвэл Finlandica-аар сонгоно.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Гол гарчиг (H1)</label>
                    <select
                      value={settings.typography.headingFont}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          typography: {
                            ...prev.typography,
                            headingFont: e.target.value as "inter" | "finlandica",
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="inter">Inter</option>
                      <option value="finlandica">Finlandica</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Section title (H2)</label>
                    <select
                      value={settings.typography.sectionTitleFont}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          typography: {
                            ...prev.typography,
                            sectionTitleFont: e.target.value as "inter" | "finlandica",
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="inter">Inter</option>
                      <option value="finlandica">Finlandica</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Card title (H3)</label>
                    <select
                      value={settings.typography.cardTitleFont}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          typography: {
                            ...prev.typography,
                            cardTitleFont: e.target.value as "inter" | "finlandica",
                          },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    >
                      <option value="inter">Inter</option>
                      <option value="finlandica">Finlandica</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          ) : null}

          {activeTab === "banner" ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Баннер нэмэх / засах
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Баннерыг Home, Category, Topic хуудас тус бүрт чиглүүлж өгнө.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Гарчиг</label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      placeholder="Жишээ: Хаврын урамшуулал"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Зураг</label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={bannerUploading}
                      onChange={(e) => void handleBannerImageUpload(e.target.files?.[0])}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium"
                    />
                    {bannerUploading ? (
                      <p className="mt-2 text-xs text-muted-foreground">Upload хийж байна...</p>
                    ) : null}
                    {bannerForm.imageUrl ? (
                      <img
                        src={bannerForm.imageUrl}
                        alt={bannerForm.alt || "preview"}
                        className="mt-3 max-h-44 w-full rounded-lg border border-border object-contain"
                      />
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Харуулах хуудас</label>
                    <select
                      value={bannerForm.targetType}
                      onChange={(e) =>
                        setBannerForm((prev) => ({
                          ...prev,
                          targetType: e.target.value as BannerTargetType,
                          targetId: "",
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="home">Home</option>
                      <option value="category">Category</option>
                      <option value="topic">Topic</option>
                    </select>
                  </div>

                  {bannerForm.targetType !== "home" ? (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        {bannerForm.targetType === "category" ? "Ангилал" : "Сэдэв"}
                      </label>
                      <select
                        value={bannerForm.targetId}
                        onChange={(e) =>
                          setBannerForm((prev) => ({ ...prev, targetId: e.target.value }))
                        }
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      >
                        <option value="">Сонгох...</option>
                        {(bannerForm.targetType === "category" ? categories : topics).map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Очих холбоос</label>
                    <input
                      type="url"
                      value={bannerForm.linkUrl}
                      onChange={(e) =>
                        setBannerForm((prev) => ({ ...prev, linkUrl: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Alt текст</label>
                    <input
                      type="text"
                      value={bannerForm.alt}
                      onChange={(e) =>
                        setBannerForm((prev) => ({ ...prev, alt: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Эрэмбэ (sort)</label>
                    <input
                      type="number"
                      value={bannerForm.sortOrder}
                      onChange={(e) =>
                        setBannerForm((prev) => ({
                          ...prev,
                          sortOrder: Number(e.target.value || 0),
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>

                  <div className="flex items-end">
                    <ToggleRow
                      label="Идэвхтэй"
                      checked={bannerForm.isActive}
                      onChange={(next) =>
                        setBannerForm((prev) => ({ ...prev, isActive: next }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => void handleSaveBanner()}
                    disabled={bannerSubmitting}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
                      bannerSubmitting && "cursor-not-allowed opacity-70"
                    )}
                  >
                    {bannerSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {editingBannerId ? "Шинэчлэх" : "Баннер нэмэх"}
                  </button>
                  {editingBannerId ? (
                    <button
                      onClick={resetBannerForm}
                      className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
                    >
                      Цуцлах
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-foreground">Оруулсан баннерууд</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={bannerFilterType}
                      onChange={(e) =>
                        {
                          setBannerFilterType(e.target.value as "all" | BannerTargetType)
                          setBannerPage(1)
                        }
                      }
                      className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                    >
                      <option value="all">Бүгд</option>
                      <option value="home">Home</option>
                      <option value="category">Category</option>
                      <option value="topic">Topic</option>
                    </select>
                    <select
                      value={bannerFilterStatus}
                      onChange={(e) =>
                        {
                          setBannerFilterStatus(e.target.value as "all" | "active" | "inactive")
                          setBannerPage(1)
                        }
                      }
                      className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                    >
                      <option value="all">Бүх төлөв</option>
                      <option value="active">Идэвхтэй</option>
                      <option value="inactive">Идэвхгүй</option>
                    </select>
                  </div>
                </div>

                {bannerLoading ? (
                  <p className="mt-4 text-sm text-muted-foreground">Уншиж байна...</p>
                ) : bannerItems.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">Баннер алга байна.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {bannerItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-3 rounded-lg border border-border p-3 md:flex-row md:items-center"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.alt || item.title}
                          className="h-20 w-full rounded-md border border-border object-contain md:w-44"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.targetType === "home"
                              ? "Home"
                              : item.targetType === "category"
                                ? `Category: ${item.category?.name || "-"}`
                                : `Topic: ${item.topic?.name || "-"}`}
                            {" • "}
                            sort: {item.sortOrder}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => void handleToggleBannerActive(item)}
                            className={cn(
                              "rounded-md px-2.5 py-1 text-xs font-medium",
                              item.isActive
                                ? "bg-emerald-500/15 text-emerald-700"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => handleEditBanner(item)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => void handleDeleteBanner(item.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setBannerPage((prev) => Math.max(1, prev - 1))}
                    disabled={bannerPage <= 1}
                    className={cn(
                      "rounded-lg border border-border px-3 py-1.5 text-sm",
                      bannerPage <= 1 ? "opacity-50" : "hover:bg-secondary"
                    )}
                  >
                    Өмнөх
                  </button>
                  <span className="rounded-lg bg-secondary px-3 py-1.5 text-xs">
                    {bannerPage} / {bannerTotalPages}
                  </span>
                  <button
                    onClick={() => setBannerPage((prev) => Math.min(bannerTotalPages, prev + 1))}
                    disabled={bannerPage >= bannerTotalPages}
                    className={cn(
                      "rounded-lg border border-border px-3 py-1.5 text-sm",
                      bannerPage >= bannerTotalPages ? "opacity-50" : "hover:bg-secondary"
                    )}
                  >
                    Дараах
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "email" ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Илгээгчийн мэдээлэл</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  SMTP credential-ийг UI-с биш, серверийн `.env`-ээс удирдана.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Илгээгчийн нэр</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, fromName: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Илгээгчийн имэйл</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, fromEmail: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Reply-to имэйл</label>
                    <input
                      type="email"
                      value={settings.email.replyTo}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          email: { ...prev.email, replyTo: e.target.value },
                        }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Имэйл боломжууд</h2>
                <div className="mt-4">
                  <ToggleRow
                    label="Товхимол (newsletter) илгээх боломж"
                    checked={settings.email.newsletterEnabled}
                    onChange={(next) =>
                      setSettings((prev) => ({
                        ...prev,
                        email: { ...prev.email, newsletterEnabled: next },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "notifications" ? (
            <div className="space-y-6 rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">Админ мэдэгдэл</h2>
              <div className="space-y-3">
                <ToggleRow
                  label="Шинэ хэрэглэгч бүртгүүлэхэд"
                  checked={settings.notifications.newUser}
                  onChange={(next) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, newUser: next },
                    }))
                  }
                />
                <ToggleRow
                  label="Нийтлэгч болох хүсэлт ирэхэд"
                  checked={settings.notifications.publisherRequest}
                  onChange={(next) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, publisherRequest: next },
                    }))
                  }
                />
                <ToggleRow
                  label="Санал хүсэлт ирэхэд"
                  checked={settings.notifications.feedback}
                  onChange={(next) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, feedback: next },
                    }))
                  }
                />
                <ToggleRow
                  label="Системийн алдаа гарахад"
                  checked={settings.notifications.systemError}
                  onChange={(next) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, systemError: next },
                    }))
                  }
                />
              </div>
            </div>
          ) : null}

          {activeTab === "security" ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Нууц үг солих</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Одоогийн нууц үгээ баталгаажуулж шинэ нууц үг үүсгэнэ.
                </p>
                <div className="mt-6 max-w-md space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Одоогийн нууц үг</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Шинэ нууц үг</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Шинэ нууц үг давтах</label>
                    <input
                      type="password"
                      value={passwordForm.repeatPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, repeatPassword: e.target.value }))
                      }
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </div>

                  {passwordError ? (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  ) : null}
                  {passwordSuccess ? (
                    <p className="text-sm text-chart-4">{passwordSuccess}</p>
                  ) : null}

                  <button
                    onClick={() => void handleChangePassword()}
                    disabled={passwordLoading}
                    className={cn(
                      "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
                      passwordLoading && "cursor-not-allowed opacity-70"
                    )}
                  >
                    {passwordLoading ? "Солиж байна..." : "Нууц үг солих"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Хоёр шатлалт баталгаажуулалт</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Энэ боломж дараагийн үе шатанд нэмэгдэнэ.
                </p>
                <div className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                  Тун удахгүй
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
