"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  Link as LinkIcon,
  FileText,
  Eye,
  Heart,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock user data
const initialUserData = {
  firstName: "Болормаа",
  lastName: "Батболд",
  email: "bolormaa@example.com",
  phone: "+976 9911 2233",
  location: "Улаанбаатар, Монгол",
  bio: "Дата сэтгүүлч, мэдээллийн визуализацийн чиглэлээр ажилладаг. Эдийн засаг, технологи, хүрээлэн буй орчны салбарт төрөлжсөн.",
  website: "https://bolormaa.mn",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=bolormaa",
  coverImage: "/images/infographic-1.jpg",
  social: {
    twitter: "@bolormaa",
    linkedin: "bolormaa-batbold",
    facebook: "bolormaa.batbold",
    instagram: "@bolormaa_data",
  },
  joinedAt: "2023-05-15",
}

const stats = [
  { label: "Нийтлэл", value: 19, icon: FileText },
  { label: "Нийт үзэлт", value: "45.2K", icon: Eye },
  { label: "Нийт лайк", value: "1,892", icon: Heart },
]

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "account">(
    "profile"
  )

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      social: { ...prev.social, [platform]: value },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUserData((prev) => ({ ...prev, avatar: url }))
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUserData((prev) => ({ ...prev, coverImage: url }))
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header with cover image */}
      <div className="relative mb-20 h-48 overflow-hidden rounded-xl lg:h-56">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background">
          <Camera className="h-4 w-4" />
          Арын зураг солих
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </label>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6 lg:left-8">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.firstName}
              className="h-32 w-32 rounded-full border-4 border-background bg-muted object-cover"
            />
            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute -bottom-16 right-6 hidden gap-6 lg:right-8 lg:flex">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-3"
            >
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="mt-1 text-xl font-bold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User info header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(userData.joinedAt).toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "long",
            })}{" "}
            -с гишүүн болсон
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

      {/* Mobile Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3 lg:hidden">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-3"
          >
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="mt-1 text-lg font-bold text-foreground">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-secondary p-1">
        {[
          { id: "profile", label: "Хувийн мэдээлэл" },
          { id: "social", label: "Сошиал холбоосууд" },
          { id: "account", label: "Бүртгэл" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Хувийн мэдээлэл
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Овог
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Нэр
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                И-мэйл
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Утасны дугаар
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Байршил
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Вэбсайт
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={userData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Товч танилцуулга
              </label>
              <textarea
                value={userData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Өөрийнхөө тухай товч бичнэ үү..."
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {userData.bio.length}/500 тэмдэгт
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Tab */}
      {activeTab === "social" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Сошиал холбоосууд
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                Twitter / X
              </label>
              <input
                type="text"
                value={userData.social.twitter}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                placeholder="@username"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                LinkedIn
              </label>
              <input
                type="text"
                value={userData.social.linkedin}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                placeholder="profile-url"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Facebook className="h-4 w-4 text-[#1877F2]" />
                Facebook
              </label>
              <input
                type="text"
                value={userData.social.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                placeholder="profile-url"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Instagram className="h-4 w-4 text-[#E4405F]" />
                Instagram
              </label>
              <input
                type="text"
                value={userData.social.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                placeholder="@username"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Password Change */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">
              Нууц үг солих
            </h2>
            <div className="grid gap-4 sm:max-w-md">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Одоогийн нууц үг
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Шинэ нууц үг
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Шинэ нууц үг давтах
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button className="mt-2 w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Нууц үг шинэчлэх
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <h2 className="mb-2 text-lg font-semibold text-destructive">
              Аюултай бүс
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Эдгээр үйлдлүүд буцаагдахгүй болохыг анхаарна уу.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-lg border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                Бүх нийтлэл устгах
              </button>
              <button className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                Бүртгэл устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
