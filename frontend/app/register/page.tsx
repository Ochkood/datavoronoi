"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BarChart3, Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { registerApi } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { registerSchema } from "@/lib/validators/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/")
    }
  }, [router])

  const passwordRequirements = [
    { label: "8-аас дээш тэмдэгт", met: formData.password.length >= 8 },
    { label: "Том үсэг агуулсан", met: /[A-Z]/.test(formData.password) },
    { label: "Тоо агуулсан", met: /\d/.test(formData.password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const parsed = registerSchema.safeParse(formData)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Маягтын алдаа")
      return
    }

    setIsLoading(true)

    try {
      await registerApi(formData.name, formData.email, formData.password)
      router.push("/login")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Бүртгүүлэх үед алдаа гарлаа"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image/Decoration */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:bg-sidebar-bg lg:p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20">
            <BarChart3 className="h-10 w-10 text-primary" />
          </div>
          <h3 className="mt-6 text-2xl font-bold text-sidebar-foreground">
            Манай нийгэмлэгт нэгдээрэй
          </h3>
          <p className="mt-3 text-sidebar-muted">
            Бүртгүүлснээр та мэдээ хадгалах, сэтгэгдэл бичих, нийтлэгч болох боломжтой.
          </p>
          <div className="mt-8 space-y-3 text-left">
            {[
              "Дата визуализаци, инфографик мэдээ унших",
              "Сонирхсон мэдээгээ хадгалах",
              "Сэтгэгдэл бичих, ярилцах",
              "Нийтлэгч болох хүсэлт илгээх",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm text-sidebar-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Datanews
              </h1>
              <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Data Visual Stories
              </p>
            </div>
          </Link>

          <h2 className="mt-10 text-2xl font-bold text-foreground">
            Бүртгүүлэх
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Бүртгэлтэй юу?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Нэвтрэх
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Нэр
              </label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Таны нэр"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                И-мэйл хаяг
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Нууц үг
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Нууц үг"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {/* Password requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full",
                          req.met ? "bg-chart-4/20 text-chart-4" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {req.met && <Check className="h-2.5 w-2.5" />}
                      </div>
                      <span className={req.met ? "text-chart-4" : "text-muted-foreground"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Нууц үг давтах
              </label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Нууц үг давтах"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) =>
                  setFormData({ ...formData, agreeTerms: e.target.checked })
                }
                className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">
                Би{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Үйлчилгээний нөхцөл
                </Link>{" "}
                болон{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Нууцлалын бодлого
                </Link>
                -ыг зөвшөөрч байна
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? (
                "Бүртгэж байна..."
              ) : (
                <>
                  Бүртгүүлэх
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Эсвэл</span>
            </div>
          </div>

          {/* Social Register */}
          <div className="mt-6">
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google-ээр бүртгүүлэх
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
