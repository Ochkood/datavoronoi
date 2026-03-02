"use client"

import { useEffect, useState } from "react"
import { Bell, Globe, Loader2, Save, Shield, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMyProfileApi, updateMyProfileApi } from "@/lib/api"

type SettingsState = {
  notifications: {
    email: boolean
    inApp: boolean
    comments: boolean
    follows: boolean
  }
  privacy: {
    showPhone: boolean
    showEmail: boolean
    showExperience: boolean
    showSocial: boolean
  }
}

const DEFAULT_SETTINGS: SettingsState = {
  notifications: {
    email: true,
    inApp: true,
    comments: true,
    follows: true,
  },
  privacy: {
    showPhone: false,
    showEmail: false,
    showExperience: true,
    showSocial: true,
  },
}

interface SettingToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [accountEmail, setAccountEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    getMyProfileApi()
      .then((data) => {
        setAccountEmail(data.profile.email || "")
        setSettings(data.profile.settings || DEFAULT_SETTINGS)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Тохиргоо ачаалж чадсангүй")
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    try {
      await updateMyProfileApi({ settings })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Тохиргоо хадгалахад алдаа гарлаа")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {error ? (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Тохиргоо</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Мэдэгдэл болон нууцлалын тохиргоогоо удирдана
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || isSaving}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
            saveSuccess
              ? "bg-chart-4 text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            (loading || isSaving) && "cursor-not-allowed opacity-70"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Хадгалж байна...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Хадгалагдлаа!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Хадгалах
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Мэдэгдлийн тохиргоо</h2>
              <p className="text-xs text-muted-foreground">Авах мэдэгдлээ сонгоно</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Тохиргоо ачаалж байна...</p>
          ) : (
            <div className="space-y-3">
              <SettingToggle
                label="Имэйл мэдэгдэл"
                description="Системийн мэдэгдлийг имэйлээр авах"
                checked={settings.notifications.email}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: checked },
                  }))
                }
              />
              <SettingToggle
                label="Апп доторх мэдэгдэл"
                description="Сайт дээрх notification icon-д мэдэгдэл харах"
                checked={settings.notifications.inApp}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, inApp: checked },
                  }))
                }
              />
              <SettingToggle
                label="Сэтгэгдлийн мэдэгдэл"
                description="Таны нийтлэлд шинэ сэтгэгдэл ирэхэд"
                checked={settings.notifications.comments}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, comments: checked },
                  }))
                }
              />
              <SettingToggle
                label="Follow мэдэгдэл"
                description="Шинэ дагагч нэмэгдэхэд"
                checked={settings.notifications.follows}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, follows: checked },
                  }))
                }
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
              <Shield className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Нууцлалын тохиргоо</h2>
              <p className="text-xs text-muted-foreground">Профайл дээр харагдах мэдээллээ тохируулна</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Тохиргоо ачаалж байна...</p>
          ) : (
            <div className="space-y-3">
              <SettingToggle
                label="Утасны дугаар харуулах"
                checked={settings.privacy.showPhone}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, showPhone: checked },
                  }))
                }
              />
              <SettingToggle
                label="Имэйл хаяг харуулах"
                checked={settings.privacy.showEmail}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, showEmail: checked },
                  }))
                }
              />
              <SettingToggle
                label="Туршлага харуулах"
                checked={settings.privacy.showExperience}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, showExperience: checked },
                  }))
                }
              />
              <SettingToggle
                label="Сошиал холбоос харуулах"
                checked={settings.privacy.showSocial}
                onChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, showSocial: checked },
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Холбогдсон бүртгэлүүд</h2>
            <p className="text-xs text-muted-foreground">Google холболтыг дараагийн алхмаар нэмнэ</p>
          </div>
        </div>

        <div className="max-w-xl rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Google</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {accountEmail ? `${accountEmail} (үндсэн бүртгэл)` : "Google холболт идэвхжээгүй"}
              </p>
            </div>
            <button
              type="button"
              disabled
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              Тун удахгүй
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
