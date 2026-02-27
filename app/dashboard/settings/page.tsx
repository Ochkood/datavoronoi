"use client"

import { useState } from "react"
import {
  Bell,
  Mail,
  Smartphone,
  Globe,
  Eye,
  Lock,
  Shield,
  Palette,
  Moon,
  Sun,
  Monitor,
  Save,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/30">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
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
    </label>
  )
}

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [commentNotif, setCommentNotif] = useState(true)
  const [likeNotif, setLikeNotif] = useState(true)
  const [followerNotif, setFollowerNotif] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [showStats, setShowStats] = useState(true)

  // Appearance settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Тохиргоо</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Өөрийн бүртгэл болон мэдэгдлийн тохиргоог удирдах
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
            saveSuccess
              ? "bg-chart-4 text-primary-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
            isSaving && "cursor-not-allowed opacity-70"
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
        {/* Notification Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Мэдэгдлийн тохиргоо
              </h2>
              <p className="text-xs text-muted-foreground">
                Мэдэгдэл авах арга замаа тохируулах
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <SettingToggle
              label="Имэйл мэдэгдэл"
              description="Шинэ үйл явдлын талаар имэйлээр мэдэгдэл авах"
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <SettingToggle
              label="Push мэдэгдэл"
              description="Хөтөчийн push мэдэгдэл авах"
              checked={pushNotifications}
              onChange={setPushNotifications}
            />
            <div className="my-4 h-px bg-border" />
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Мэдэгдлийн төрөл
            </p>
            <SettingToggle
              label="Сэтгэгдэл"
              description="Шинэ сэтгэгдэл ирэхэд"
              checked={commentNotif}
              onChange={setCommentNotif}
            />
            <SettingToggle
              label="Лайк"
              description="Нийтлэлд лайк дарахад"
              checked={likeNotif}
              onChange={setLikeNotif}
            />
            <SettingToggle
              label="Дагагч"
              description="Шинэ хүн дагахад"
              checked={followerNotif}
              onChange={setFollowerNotif}
            />
            <SettingToggle
              label="Долоо хоногийн тойм"
              description="Долоо хоног бүр статистикийн тойм"
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
              <Shield className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Нууцлалын тохиргоо
              </h2>
              <p className="text-xs text-muted-foreground">
                Хувийн мэдээллээ хамгаалах
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <SettingToggle
              label="Нээлттэй профайл"
              description="Бусад хэрэглэгчид таны профайлыг харах боломжтой"
              checked={profilePublic}
              onChange={setProfilePublic}
            />
            <SettingToggle
              label="Имэйл харуулах"
              description="Профайлд имэйл хаягаа харуулах"
              checked={showEmail}
              onChange={setShowEmail}
            />
            <SettingToggle
              label="Статистик харуулах"
              description="Нийтлэл, үзэлтийн тоог харуулах"
              checked={showStats}
              onChange={setShowStats}
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <Palette className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Харагдах байдал
              </h2>
              <p className="text-xs text-muted-foreground">
                Интерфэйсийн өнгө, загвар
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-foreground">Загвар сонгох</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "light", label: "Цайвар", icon: Sun },
                { id: "dark", label: "Бараан", icon: Moon },
                { id: "system", label: "Систем", icon: Monitor },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id as typeof theme)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                    theme === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <option.icon
                    className={cn(
                      "h-6 w-6",
                      theme === option.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      theme === option.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Preferences */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10">
              <Mail className="h-5 w-5 text-chart-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Имэйл тохиргоо
              </h2>
              <p className="text-xs text-muted-foreground">
                Имэйлээр авах мэдээлэл
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Бүртгэлтэй имэйл
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value="bolormaa@example.com"
                  disabled
                  className="flex-1 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground"
                />
                <button className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary">
                  Өөрчлөх
                </button>
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">
                Имэйл хаягаа өөрчлөхийн тулд одоогийн имэйл рүү баталгаажуулах
                холбоос илгээгдэнэ.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Холбогдсон бүртгэлүүд
            </h2>
            <p className="text-xs text-muted-foreground">
              Нэвтрэхэд ашиглах гадны бүртгэлүүд
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Google", connected: true, icon: "G" },
            { name: "Facebook", connected: false, icon: "f" },
            { name: "Twitter / X", connected: false, icon: "X" },
          ].map((account) => (
            <div
              key={account.name}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-bold">
                  {account.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {account.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {account.connected ? "Холбогдсон" : "Холбогдоогүй"}
                  </p>
                </div>
              </div>
              <button
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  account.connected
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {account.connected ? "Салгах" : "Холбох"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
