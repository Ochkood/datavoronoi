"use client"

import { useState } from "react"
import {
  Settings,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Code,
  Save,
  RefreshCw,
  Upload,
  ImageIcon,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settingsTabs = [
  { id: "general", label: "Ерөнхий", icon: Settings },
  { id: "appearance", label: "Харагдах байдал", icon: Palette },
  { id: "email", label: "Имэйл", icon: Mail },
  { id: "notifications", label: "Мэдэгдэл", icon: Bell },
  { id: "security", label: "Аюулгүй байдал", icon: Shield },
  { id: "advanced", label: "Нарийвчилсан", icon: Code },
]

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Тохиргоо</h1>
            <p className="text-sm text-muted-foreground">
              Системийн тохиргоог удирдах
            </p>
          </div>
          <button
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              saved
                ? "bg-chart-4 text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {saved ? (
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
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-border bg-card/50 p-4">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
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

        {/* Content */}
        <main className="flex-1 p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Сайтын мэдээлэл
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сайтын үндсэн мэдээллийг тохируулна
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Сайтын нэр
                    </label>
                    <input
                      type="text"
                      defaultValue="Datanews.mn"
                      className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Сайтын тайлбар
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Монголын анхны дата сэтгүүл зүйн платформ. Мэдээллийн инфографик, дата визуализаци, шинжилгээ."
                      className="w-full max-w-md rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Сайтын URL
                    </label>
                    <input
                      type="url"
                      defaultValue="https://datanews.mn"
                      className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Холбоо барих
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Холбоо барих мэдээллийг тохируулна
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Имэйл хаяг
                    </label>
                    <input
                      type="email"
                      defaultValue="info@datanews.mn"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Утасны дугаар
                    </label>
                    <input
                      type="tel"
                      defaultValue="+976 9999 9999"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Хаяг
                    </label>
                    <input
                      type="text"
                      defaultValue="Улаанбаатар хот, Сүхбаатар дүүрэг"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Нийгмийн сүлжээ
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Нийгмийн сүлжээний холбоосуудыг тохируулна
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {["Facebook", "Twitter", "Instagram", "LinkedIn"].map(
                    (social) => (
                      <div key={social}>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                          {social}
                        </label>
                        <input
                          type="url"
                          placeholder={`https://${social.toLowerCase()}.com/...`}
                          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Лого</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сайтын лого зургийг тохируулна
                </p>

                <div className="mt-6 flex gap-6">
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Үндсэн лого
                    </p>
                    <div className="flex h-24 w-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-secondary/30 transition-colors hover:border-primary hover:bg-secondary/50">
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Зураг оруулах
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Favicon
                    </p>
                    <div className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input bg-secondary/30 transition-colors hover:border-primary hover:bg-secondary/50">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          32x32
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">Өнгө</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сайтын өнгөний схемийг тохируулна
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Primary өнгө
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue="#1a56db"
                        className="h-10 w-20 cursor-pointer rounded-lg border border-input"
                      />
                      <input
                        type="text"
                        defaultValue="#1a56db"
                        className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Accent өнгө
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue="#059669"
                        className="h-10 w-20 cursor-pointer rounded-lg border border-input"
                      />
                      <input
                        type="text"
                        defaultValue="#059669"
                        className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Background өнгө
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue="#f8fafc"
                        className="h-10 w-20 cursor-pointer rounded-lg border border-input"
                      />
                      <input
                        type="text"
                        defaultValue="#f8fafc"
                        className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Фонт
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сайтад ашиглах фонтуудыг сонгоно
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Үндсэн фонт
                    </label>
                    <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                      <option>Montserrat</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Гарчгийн фонт
                    </label>
                    <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                      <option>Playfair Display</option>
                      <option>Merriweather</option>
                      <option>Lora</option>
                      <option>Georgia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  SMTP тохиргоо
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Имэйл илгээх серверийн тохиргоо
                </p>

                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.example.com"
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        placeholder="587"
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Хэрэглэгчийн нэр
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Нууц үг
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">SSL/TLS ашиглах</span>
                    </label>
                  </div>

                  <button className="flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <RefreshCw className="h-4 w-4" />
                    Холболт шалгах
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Илгээгчийн мэдээлэл
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Имэйл илгээхэд харагдах мэдээлэл
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Илгээгчийн нэр
                    </label>
                    <input
                      type="text"
                      defaultValue="Datanews.mn"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Илгээгчийн имэйл
                    </label>
                    <input
                      type="email"
                      defaultValue="noreply@datanews.mn"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Админ мэдэгдэл
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Админд илгээх мэдэгдлүүдийг тохируулна
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { label: "Шинэ хэрэглэгч бүртгүүлэхэд", defaultChecked: true },
                    { label: "Нийтлэгч болох хүсэлт ирэхэд", defaultChecked: true },
                    { label: "Санал хүсэлт ирэхэд", defaultChecked: true },
                    { label: "Шинэ сэтгэгдэл бичигдэхэд", defaultChecked: false },
                    { label: "Системийн алдаа гарахад", defaultChecked: true },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                    >
                      <span className="text-sm text-foreground">{item.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Хэрэглэгчийн мэдэгдэл
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Хэрэглэгчид илгээх мэдэгдлүүдийг тохируулна
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { label: "Тавтай морилно уу имэйл", defaultChecked: true },
                    { label: "Мэдээ нийтлэгдэхэд мэдэгдэх", defaultChecked: true },
                    { label: "Долоо хоног бүрийн эмхэтгэл", defaultChecked: false },
                    { label: "Сар бүрийн статистик", defaultChecked: false },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                    >
                      <span className="text-sm text-foreground">{item.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Нууц үг
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Админ нууц үгээ солих
                </p>

                <div className="mt-6 space-y-4 max-w-md">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Одоогийн нууц үг
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Шинэ нууц үг
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Нууц үг давтах
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Нууц үг солих
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Хоёр шатлалт баталгаажуулалт
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Нэмэлт хамгаалалтыг идэвхжүүлэх
                </p>

                <div className="mt-6">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        2FA идэвхжүүлэх
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Google Authenticator ашиглан нэвтрэлтээ хамгаалаарай
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Нэвтрэлтийн түүх
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сүүлд нэвтэрсэн төхөөрөмжүүд
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    {
                      device: "Chrome - Windows",
                      location: "Улаанбаатар",
                      time: "Одоо идэвхтэй",
                      current: true,
                    },
                    {
                      device: "Safari - iPhone",
                      location: "Улаанбаатар",
                      time: "2 цагийн өмнө",
                      current: false,
                    },
                    {
                      device: "Firefox - MacOS",
                      location: "Дархан",
                      time: "3 өдрийн өмнө",
                      current: false,
                    },
                  ].map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 rounded-full bg-chart-4/10 px-2 py-0.5 text-xs font-medium text-chart-4">
                              Одоогийн
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {session.location} - {session.time}
                        </p>
                      </div>
                      {!session.current && (
                        <button className="text-sm text-destructive hover:underline">
                          Гаргах
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeTab === "advanced" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Кэш тохиргоо
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Сайтын кэшийг удирдах
                </p>

                <div className="mt-6 flex gap-3">
                  <button className="flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <RefreshCw className="h-4 w-4" />
                    Кэш цэвэрлэх
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                    <Database className="h-4 w-4" />
                    Кэшийн хэмжээ: 45 MB
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  API тохиргоо
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  API түлхүүр болон хязгаарлалт
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      API түлхүүр
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="sk_live_xxxxx...xxxxx"
                        className="h-10 flex-1 rounded-lg border border-input bg-secondary px-3 text-sm text-muted-foreground"
                      />
                      <button className="rounded-lg border border-input px-4 text-sm font-medium text-foreground hover:bg-secondary">
                        Харуулах
                      </button>
                      <button className="rounded-lg border border-input px-4 text-sm font-medium text-foreground hover:bg-secondary">
                        Шинэчлэх
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Rate limit (минутад)
                    </label>
                    <input
                      type="number"
                      defaultValue={100}
                      className="h-10 w-32 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6">
                <h2 className="text-lg font-semibold text-destructive">
                  Аюултай бүс
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Эдгээр үйлдлүүд нь буцаах боломжгүй
                </p>

                <div className="mt-6 space-y-3">
                  <button className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                    Бүх мэдээллийг цэвэрлэх
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Энэ үйлдэл нь бүх мэдээ, сэтгэгдэл, хэрэглэгчдийн мэдээллийг
                    устгана.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
