export interface AuthUser {
  id: string
  name: string
  email: string
  slug?: string
  role: "user" | "publisher" | "admin"
  isActive?: boolean
  experience?: string
  bio?: string
  avatar?: string
  coverImage?: string
  phone?: string
  location?: string
  website?: string
  social?: {
    twitter?: string
    linkedin?: string
    facebook?: string
    instagram?: string
  }
}

const ACCESS_TOKEN_KEY = "dn_access_token"
const REFRESH_TOKEN_KEY = "dn_refresh_token"
const USER_KEY = "dn_user"

export function saveAuth(auth: {
  accessToken: string
  refreshToken: string
  user: AuthUser
}) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
