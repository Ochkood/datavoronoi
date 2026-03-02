"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bell,
  Check,
  Loader2,
  Mail,
  Save,
  Settings,
  Shield,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  changeMyPasswordApi,
  getAdminSettingsApi,
  updateAdminSettingsApi,
  type AdminSettings,
} from "@/lib/api"

type TabKey = "general" | "email" | "notifications" | "security"

const tabs: Array<{ id: TabKey; label: string; icon: LucideIcon }> = [
  { id: "general", label: "Ерөнхий", icon: Settings },
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
    }),
    [settings]
  )

  const handleSave = async () => {
    setSaving(true)
    setError("")
    try {
      const next = await updateAdminSettingsApi(savePayload)
      setSettings((prev) => ({ ...prev, ...next }))
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
          {activeTab !== "security" ? (
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
