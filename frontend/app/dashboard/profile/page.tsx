"use client"

import { useEffect, useMemo, useState } from "react"
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
  FileText,
  Eye,
  Heart,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  changeMyPasswordApi,
  getMyProfileApi,
  updateMyProfileApi,
  uploadImageApi,
} from "@/lib/api"

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  bio: string
  website: string
  avatar: string
  coverImage: string
  social: {
    twitter: string
    linkedin: string
    facebook: string
    instagram: string
  }
  joinedAt: string
}

const initialForm: ProfileForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  website: "",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=user",
  coverImage: "/images/infographic-1.jpg",
  social: {
    twitter: "",
    linkedin: "",
    facebook: "",
    instagram: "",
  },
  joinedAt: new Date().toISOString(),
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { firstName: parts[0] || "", lastName: "" }
  return {
    lastName: parts[0],
    firstName: parts.slice(1).join(" "),
  }
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<ProfileForm>(initialForm)
  const [stats, setStats] = useState({ posts: 0, views: 0, likes: 0 })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "account">("profile")
  const [uploading, setUploading] = useState<"avatar" | "cover" | null>(null)
  const [error, setError] = useState("")
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  })
  const [passwordMessage, setPasswordMessage] = useState("")

  useEffect(() => {
    getMyProfileApi()
      .then((data) => {
        const parts = splitName(data.profile.name)
        setUserData({
          firstName: parts.firstName,
          lastName: parts.lastName,
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          location: data.profile.location || "",
          bio: data.profile.bio || "",
          website: data.profile.website || "",
          avatar: data.profile.avatar || "https://api.dicebear.com/9.x/notionists/svg?seed=user",
          coverImage: data.profile.coverImage || "/images/infographic-1.jpg",
          social: {
            twitter: data.profile.social?.twitter || "",
            linkedin: data.profile.social?.linkedin || "",
            facebook: data.profile.social?.facebook || "",
            instagram: data.profile.social?.instagram || "",
          },
          joinedAt: data.profile.joinedAt,
        })
        setStats(data.stats)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Профайл ачаалж чадсангүй"))
      .finally(() => setLoading(false))
  }, [])

  const statCards = useMemo(
    () => [
      { label: "Нийтлэл", value: stats.posts, icon: FileText },
      { label: "Нийт үзэлт", value: stats.views.toLocaleString(), icon: Eye },
      { label: "Нийт лайк", value: stats.likes.toLocaleString(), icon: Heart },
    ],
    [stats]
  )

  const avatarSrc =
    userData.avatar?.trim() ||
    "https://api.dicebear.com/9.x/notionists/svg?seed=user"
  const coverImageSrc =
    userData.coverImage?.trim() || "/images/infographic-1.jpg"

  const handleInputChange = (field: keyof Omit<ProfileForm, "social">, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (platform: keyof ProfileForm["social"], value: string) => {
    setUserData((prev) => ({
      ...prev,
      social: { ...prev.social, [platform]: value },
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    try {
      const fullName = `${userData.lastName} ${userData.firstName}`.trim()
      const profile = await updateMyProfileApi({
        name: fullName,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio,
        website: userData.website,
        avatar: userData.avatar,
        coverImage: userData.coverImage,
        social: userData.social,
      })

      const storedRaw = localStorage.getItem("dn_user")
      const stored = storedRaw ? JSON.parse(storedRaw) : {}
      localStorage.setItem(
        "dn_user",
        JSON.stringify({
          ...stored,
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          avatar: profile.avatar,
          coverImage: profile.coverImage,
          phone: profile.phone,
          location: profile.location,
          website: profile.website,
          social: profile.social,
        })
      )

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Хадгалах үед алдаа гарлаа")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const input = e.currentTarget
    setUploading("avatar")
    setError("")
    try {
      const url = await uploadImageApi(file, "profiles")
      setUserData((prev) => ({ ...prev, avatar: url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Профайл зураг upload хийхэд алдаа гарлаа")
    } finally {
      setUploading(null)
      input.value = ""
    }
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const input = e.currentTarget
    setUploading("cover")
    setError("")
    try {
      const url = await uploadImageApi(file, "profiles")
      setUserData((prev) => ({ ...prev, coverImage: url }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cover зураг upload хийхэд алдаа гарлаа")
    } finally {
      setUploading(null)
      input.value = ""
    }
  }

  const handleChangePassword = async () => {
    setPasswordMessage("")
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordMessage("Нууц үгээ бүрэн оруулна уу")
      return
    }
    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setPasswordMessage("Шинэ нууц үг давталт таарахгүй байна")
      return
    }

    try {
      await changeMyPasswordApi(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: "", newPassword: "", repeatPassword: "" })
      setPasswordMessage("Нууц үг амжилттай шинэчлэгдлээ")
    } catch (e) {
      setPasswordMessage(e instanceof Error ? e.message : "Нууц үг шинэчлэх үед алдаа")
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <div className="relative mb-20 h-48 lg:h-56">
        <div className="relative h-full overflow-hidden rounded-xl">
          <img src={coverImageSrc} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <label className="absolute bottom-4 right-4 flex cursor-pointer items-center gap-2 rounded-lg bg-background/80 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background">
            <Camera className="h-4 w-4" />
            {uploading === "cover" ? "Upload хийж байна..." : "Арын зураг солих"}
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>

        <div className="absolute -bottom-16 left-6 lg:left-8">
          <div className="relative">
            <img src={avatarSrc} alt={userData.firstName} className="h-32 w-32 rounded-full border-4 border-background bg-muted object-cover" />
            <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        <div className="absolute -bottom-16 right-6 hidden gap-6 lg:right-8 lg:flex">
          {statCards.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center rounded-xl border border-border bg-card px-6 py-3">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="mt-1 text-xl font-bold text-foreground">{loading ? "..." : stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{userData.firstName} {userData.lastName}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(userData.joinedAt).toLocaleDateString("mn-MN", { year: "numeric", month: "long" })} -с гишүүн болсон
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
            saveSuccess ? "bg-chart-4 text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90",
            isSaving && "cursor-not-allowed opacity-70"
          )}
        >
          {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" />Хадгалж байна...</> : saveSuccess ? <><CheckCircle className="h-4 w-4" />Хадгалагдлаа!</> : <><Save className="h-4 w-4" />Хадгалах</>}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 lg:hidden">
        {statCards.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center rounded-xl border border-border bg-card px-4 py-3">
            <stat.icon className="h-4 w-4 text-muted-foreground" />
            <span className="mt-1 text-lg font-bold text-foreground">{loading ? "..." : stat.value}</span>
            <span className="text-[10px] text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="mb-6 flex gap-1 rounded-lg bg-secondary p-1">
        {[{ id: "profile", label: "Хувийн мэдээлэл" }, { id: "social", label: "Сошиал холбоосууд" }, { id: "account", label: "Бүртгэл" }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Хувийн мэдээлэл</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Овог</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={userData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Нэр</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={userData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">И-мэйл</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={userData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Утасны дугаар</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" value={userData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Байршил</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={userData.location} onChange={(e) => handleInputChange("location", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Вэбсайт</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="url" value={userData.website} onChange={(e) => handleInputChange("website", e.target.value)} className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">Товч танилцуулга</label>
              <textarea value={userData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} rows={4} className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-foreground">Сошиал холбоосууд</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Twitter className="h-4 w-4 text-[#1DA1F2]" />Twitter / X</label>
              <input type="text" value={userData.social.twitter} onChange={(e) => handleSocialChange("twitter", e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Linkedin className="h-4 w-4 text-[#0A66C2]" />LinkedIn</label>
              <input type="text" value={userData.social.linkedin} onChange={(e) => handleSocialChange("linkedin", e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Facebook className="h-4 w-4 text-[#1877F2]" />Facebook</label>
              <input type="text" value={userData.social.facebook} onChange={(e) => handleSocialChange("facebook", e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"><Instagram className="h-4 w-4 text-[#E4405F]" />Instagram</label>
              <input type="text" value={userData.social.instagram} onChange={(e) => handleSocialChange("instagram", e.target.value)} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Нууц үг солих</h2>
            <div className="grid gap-4 sm:max-w-md">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Одоогийн нууц үг</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Шинэ нууц үг</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Шинэ нууц үг давтах</label>
                <input type="password" value={passwordForm.repeatPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, repeatPassword: e.target.value }))} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {passwordMessage && <p className="text-xs text-muted-foreground">{passwordMessage}</p>}
              <button onClick={handleChangePassword} className="mt-2 w-fit rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Нууц үг шинэчлэх</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
