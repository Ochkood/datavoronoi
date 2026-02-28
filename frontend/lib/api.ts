import type { AuthUser } from "@/lib/auth"
import { getAccessToken } from "@/lib/auth"
import type { PostData } from "@/components/post-card"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "")

type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}

type BackendPost = {
  _id: string
  title: string
  excerpt?: string
  content?: string
  featuredImage?: string
  featured?: boolean
  status?: "draft" | "pending" | "published" | "rejected"
  visibility?: "public" | "private"
  createdAt?: string
  publishedAt?: string
  viewsCount?: number
  likesCount?: number
  commentsCount?: number
  author?: {
    _id?: string
    name?: string
    avatar?: string
    role?: "user" | "publisher" | "admin"
  }
  category?: {
    _id?: string
    name?: string
    slug?: string
  }
  topics?: Array<{
    _id: string
    name: string
    slug: string
  }>
}

export type BackendCategory = {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  bannerImage?: string
}

export type BackendTopic = {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  featured?: boolean
  startDate?: string
  endDate?: string
}

function toRelativeDate(dateString?: string): string {
  if (!dateString) return "Саяхан"
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return "Саяхан"
  return d.toLocaleDateString("mn-MN")
}

function categoryColorBySlug(slug?: string): string {
  const map: Record<string, string> = {
    economy: "bg-chart-1/15 text-chart-1",
    technology: "bg-chart-2/15 text-chart-2",
    world: "bg-chart-3/15 text-chart-3",
    environment: "bg-chart-4/15 text-chart-4",
    finance: "bg-chart-5/15 text-chart-5",
    health: "bg-destructive/15 text-destructive",
  }
  return map[slug || ""] || "bg-secondary text-secondary-foreground"
}

function mapPost(post: BackendPost): PostData {
  return {
    id: post._id,
    authorId: post.author?._id || "",
    authorVerified: post.author?.role === "publisher" || post.author?.role === "admin",
    title: post.title,
    excerpt: post.excerpt || "",
    contentHtml: post.content || "",
    category: post.category?.name || "Бусад",
    categorySlug: post.category?.slug || "",
    categoryColor: categoryColorBySlug(post.category?.slug),
    image: post.featuredImage || "/placeholder.jpg",
    author: post.author?.name || "Unknown",
    authorAvatar:
      post.author?.avatar ||
      "https://api.dicebear.com/9.x/notionists/svg?seed=author",
    date: toRelativeDate(post.createdAt),
    views: String(post.viewsCount || 0),
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
  }
}

export type DashboardPost = {
  id: string
  title: string
  excerpt: string
  content: string
  status: "draft" | "pending" | "published" | "rejected"
  visibility: "public" | "private"
  category: string
  categoryId?: string
  image: string
  views: string
  likes: number
  comments: number
  createdAt: string
  publishedAt?: string | null
  topics: string[]
}

export type AdminPost = {
  id: string
  title: string
  excerpt: string
  status: "draft" | "pending" | "published" | "rejected"
  featured: boolean
  image: string
  views: string
  comments: number
  category: string
  categoryId?: string
  categorySlug?: string
  author: string
  authorId?: string
  authorAvatar: string
  topics: Array<{ id: string; name: string }>
  createdAt: string
}

export type AdminPostList = {
  items: AdminPost[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export type AdminUser = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "publisher" | "admin"
  isActive: boolean
  joinedAt: string
  lastActive: string
  posts: number
}

export type PostComment = {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    avatar: string
  }
}

export type UploadFolder =
  | "posts"
  | "categories"
  | "topics"
  | "editor"
  | "profiles"

export type DashboardSummary = {
  stats: {
    posts: { value: number; change: number }
    views: { value: number; display: string; changePct: number }
    likes: { value: number; display: string; changePct: number }
    comments: { value: number; display: string; changePct: number }
    status: {
      published: number
      pending: number
      draft: number
      rejected: number
    }
  }
  viewsTrend: Array<{
    key: string
    name: string
    views: number
    likes: number
  }>
  recentPosts: Array<{
    id: string
    title: string
    status: "draft" | "pending" | "published" | "rejected"
    views: number
    likes: number
    comments: number
    date: string
    image: string
  }>
  notifications: {
    unreadCount: number
    latest: Array<{
      _id: string
      type: "comment" | "like" | "approved" | "rejected" | "system"
      title: string
      message: string
      read: boolean
      link: string
      createdAt: string
    }>
  }
}

export type DashboardAnalytics = {
  overview: {
    views: { value: number; changePct: number }
    likes: { value: number; changePct: number }
    comments: { value: number; changePct: number }
    posts: { value: number; changePct: number }
  }
  trends: Array<{
    key: string
    name: string
    views: number
    likes: number
  }>
  weekly: Array<{
    day: string
    views: number
  }>
  topPosts: Array<{
    id: string
    title: string
    views: number
    likes: number
    image: string
  }>
  deviceData: Array<{ name: string; value: number }>
  countryData: Array<{ country: string; views: number; percentage: number }>
}

export type BackendNotification = {
  _id: string
  type: "comment" | "like" | "approved" | "rejected" | "system"
  title: string
  message: string
  link: string
  read: boolean
  createdAt: string
  actor?: {
    name?: string
    avatar?: string
  }
}

export type UserProfile = {
  id: string
  name: string
  email: string
  role: "user" | "publisher" | "admin"
  isActive: boolean
  bio: string
  avatar: string
  coverImage: string
  phone: string
  location: string
  website: string
  social: {
    twitter: string
    linkedin: string
    facebook: string
    instagram: string
  }
  joinedAt: string
  lastActive: string
}

export type FollowingAuthor = {
  id: string
  name: string
  avatar: string
  bio: string
  posts: number
  followers: number
  following: boolean
}

export type TopAuthor = {
  id: string
  name: string
  avatar: string
  role?: "user" | "publisher" | "admin"
  posts: number
  views: number
}

export type PublicAuthorProfile = {
  id: string
  name: string
  avatar: string
  bio: string
  role: "user" | "publisher" | "admin"
  verified: boolean
  joinedAt: string
  posts: number
  followers: number
  followingCount: number
  isFollowing: boolean
}

export type FollowPeopleItem = FollowingAuthor

export type FollowPeoplePage = {
  items: FollowPeopleItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

type BackendComment = {
  _id: string
  content: string
  createdAt: string
  user?: {
    name?: string
    avatar?: string
  }
}

function mapDashboardPost(post: BackendPost): DashboardPost {
  return {
    id: post._id,
    title: post.title,
    excerpt: post.excerpt || "",
    content: post.content || "",
    status: post.status || "draft",
    visibility: post.visibility || "public",
    category: post.category?.name || "Бусад",
    categoryId: post.category?._id,
    image: post.featuredImage || "/placeholder.jpg",
    views: String(post.viewsCount || 0),
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    createdAt: post.createdAt || new Date().toISOString(),
    publishedAt: post.publishedAt || null,
    topics: (post.topics || []).map((t) => t._id),
  }
}

function mapAdminPost(post: BackendPost): AdminPost {
  return {
    id: post._id,
    title: post.title,
    excerpt: post.excerpt || "",
    status: post.status || "draft",
    featured: Boolean(post.featured),
    image: post.featuredImage || "/placeholder.jpg",
    views: String(post.viewsCount || 0),
    comments: post.commentsCount || 0,
    category: post.category?.name || "Бусад",
    categoryId: post.category?._id,
    categorySlug: post.category?.slug || "",
    author: post.author?.name || "Unknown",
    authorId: post.author?._id,
    authorAvatar:
      post.author?.avatar ||
      "https://api.dicebear.com/9.x/notionists/svg?seed=author",
    topics: (post.topics || []).map((t) => ({
      id: t._id,
      name: t.name,
    })),
    createdAt: post.createdAt || new Date().toISOString(),
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(json?.message || "Request failed")
  }
  return json
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const raw = reader.result
      if (typeof raw !== "string") {
        reject(new Error("Image read failed"))
        return
      }
      const base64 = raw.includes(",") ? raw.split(",")[1] : raw
      resolve(base64)
    }
    reader.onerror = () => reject(new Error("Image read failed"))
    reader.readAsDataURL(file)
  })
}

export async function loginApi(email: string, password: string) {
  const res = await request<
    ApiResponse<{
      user: AuthUser
      accessToken: string
      refreshToken: string
    }>
  >("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
  return res.data
}

export async function registerApi(name: string, email: string, password: string) {
  const res = await request<
    ApiResponse<{
      user: AuthUser
      accessToken: string
      refreshToken: string
    }>
  >("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
  return res.data
}

export async function getMeApi() {
  const res = await request<ApiResponse<{ user: AuthUser }>>("/auth/me")
  return res.data.user
}

export async function getPosts(params?: {
  category?: string
  topic?: string
  q?: string
  status?: "all" | "draft" | "pending" | "published" | "rejected"
  featured?: "all" | "true" | "false"
  author?: string
  sort?: "latest" | "popular"
  page?: number
  limit?: number
}) {
  const search = new URLSearchParams()
  if (params?.category) search.set("category", params.category)
  if (params?.topic) search.set("topic", params.topic)
  if (params?.q) search.set("q", params.q)
  if (params?.status) search.set("status", params.status)
  if (params?.featured) search.set("featured", params.featured)
  if (params?.author) search.set("author", params.author)
  if (params?.sort) search.set("sort", params.sort)
  if (params?.page) search.set("page", String(params.page))
  if (params?.limit) search.set("limit", String(params.limit))
  const suffix = search.toString() ? `?${search.toString()}` : ""

  const res = await request<ApiResponse<{ items: BackendPost[] }>>(`/posts${suffix}`)
  return res.data.items.map(mapPost)
}

export async function getTopAuthorsApi(params?: {
  category?: string
  topic?: string
  limit?: number
}) {
  const search = new URLSearchParams()
  if (params?.category) search.set("category", params.category)
  if (params?.topic) search.set("topic", params.topic)
  if (params?.limit) search.set("limit", String(params.limit))
  const suffix = search.toString() ? `?${search.toString()}` : ""

  const res = await request<ApiResponse<{ items: TopAuthor[] }>>(
    `/posts/top-authors${suffix}`
  )
  return res.data.items.map((item) => ({
    ...item,
    avatar:
      item.avatar ||
      "https://api.dicebear.com/9.x/notionists/svg?seed=author",
  }))
}

export async function getPostById(id: string) {
  const res = await request<ApiResponse<{ post: BackendPost }>>(`/posts/${id}`)
  return mapPost(res.data.post)
}

export async function getDashboardPostById(id: string) {
  const res = await request<ApiResponse<{ post: BackendPost }>>(`/posts/${id}`)
  return mapDashboardPost(res.data.post)
}

export async function getCategories() {
  const res = await request<ApiResponse<{ categories: BackendCategory[] }>>(
    "/categories"
  )
  return res.data.categories
}

export async function createCategoryApi(payload: {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  bannerImage?: string
}) {
  const res = await request<ApiResponse<{ category: BackendCategory }>>(
    "/categories",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
  return res.data.category
}

export async function updateCategoryApi(
  id: string,
  payload: Partial<{
    name: string
    slug: string
    description?: string
    icon?: string
    color?: string
    bannerImage?: string
  }>
) {
  const res = await request<ApiResponse<{ category: BackendCategory }>>(
    `/categories/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  return res.data.category
}

export async function deleteCategoryApi(id: string) {
  await request<ApiResponse<{ message: string }>>(`/categories/${id}`, {
    method: "DELETE",
  })
}

export async function getTopics() {
  const res = await request<ApiResponse<{ topics: BackendTopic[] }>>("/topics")
  return res.data.topics
}

export async function createTopicApi(payload: {
  name: string
  slug: string
  description?: string
  image?: string
  featured?: boolean
  startDate?: string
  endDate?: string
}) {
  const res = await request<ApiResponse<{ topic: BackendTopic }>>("/topics", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return res.data.topic
}

export async function updateTopicApi(
  id: string,
  payload: Partial<{
    name: string
    slug: string
    description?: string
    image?: string
    featured?: boolean
    startDate?: string
    endDate?: string
  }>
) {
  const res = await request<ApiResponse<{ topic: BackendTopic }>>(`/topics/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
  return res.data.topic
}

export async function deleteTopicApi(id: string) {
  await request<ApiResponse<{ message: string }>>(`/topics/${id}`, {
    method: "DELETE",
  })
}

export async function getBookmarks() {
  const res = await request<ApiResponse<{ items: BackendPost[] }>>(
    "/posts/bookmarks/me"
  )
  return res.data.items.map(mapPost)
}

export async function toggleBookmarkApi(postId: string) {
  const res = await request<ApiResponse<{ bookmarked: boolean }>>(
    `/posts/${postId}/bookmark`,
    {
      method: "POST",
    }
  )
  return res.data
}

export async function toggleLikeApi(postId: string) {
  const res = await request<ApiResponse<{ liked: boolean; likesCount: number }>>(
    `/posts/${postId}/like`,
    {
      method: "POST",
    }
  )
  return res.data
}

export async function getMyEngagement(postId: string) {
  const res = await request<ApiResponse<{ liked: boolean; bookmarked: boolean }>>(
    `/posts/${postId}/engagement`
  )
  return res.data
}

export async function getCommentsApi(postId: string) {
  const res = await request<ApiResponse<{ comments: BackendComment[] }>>(
    `/posts/${postId}/comments`
  )
  return res.data.comments.map((c) => ({
    id: c._id,
    content: c.content,
    createdAt: c.createdAt,
    user: {
      name: c.user?.name || "Хэрэглэгч",
      avatar:
        c.user?.avatar ||
        "https://api.dicebear.com/9.x/notionists/svg?seed=user",
    },
  }))
}

export async function addCommentApi(postId: string, content: string) {
  const res = await request<ApiResponse<{ comment: BackendComment }>>(
    `/posts/${postId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  )
  const c = res.data.comment
  const mapped: PostComment = {
    id: c._id,
    content: c.content,
    createdAt: c.createdAt,
    user: {
      name: c.user?.name || "Хэрэглэгч",
      avatar:
        c.user?.avatar ||
        "https://api.dicebear.com/9.x/notionists/svg?seed=user",
    },
  }
  return mapped
}

export async function getMyPosts(authorId: string) {
  const search = new URLSearchParams()
  search.set("author", authorId)
  search.set("status", "all")
  const res = await request<ApiResponse<{ items: BackendPost[] }>>(
    `/posts?${search.toString()}`
  )
  return res.data.items.map(mapDashboardPost)
}

export async function getAdminPosts(params?: {
  page?: number
  limit?: number
  q?: string
  status?: "all" | "draft" | "pending" | "published" | "rejected"
  category?: string
  topic?: string
  author?: string
  dateFrom?: string
  dateTo?: string
  featured?: "all" | "true" | "false"
}) {
  const search = new URLSearchParams()
  if (params?.page) search.set("page", String(params.page))
  if (params?.limit) search.set("limit", String(params.limit))
  if (params?.q) search.set("q", params.q)
  if (params?.status) search.set("status", params.status)
  if (params?.category) search.set("category", params.category)
  if (params?.topic) search.set("topic", params.topic)
  if (params?.author) search.set("author", params.author)
  if (params?.dateFrom) search.set("dateFrom", params.dateFrom)
  if (params?.dateTo) search.set("dateTo", params.dateTo)
  if (params?.featured) search.set("featured", params.featured)
  const suffix = search.toString() ? `?${search.toString()}` : ""

  const res = await request<
    ApiResponse<{
      items: BackendPost[]
      pagination: AdminPostList["pagination"]
    }>
  >(`/posts/admin/list${suffix}`)

  return {
    items: res.data.items.map(mapAdminPost),
    pagination: res.data.pagination,
  }
}

export async function uploadImageApi(file: File, folder: UploadFolder) {
  const dataBase64 = await fileToBase64(file)
  const res = await request<ApiResponse<{ url: string }>>("/uploads/image", {
    method: "POST",
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      dataBase64,
      folder,
    }),
  })

  const url = res.data.url || ""
  if (!url) throw new Error("Upload failed")
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`
}

export async function getDashboardSummaryApi(
  range: "7d" | "30d" | "90d" | "1y" = "7d"
) {
  const res = await request<ApiResponse<DashboardSummary>>(
    `/dashboard/summary?range=${range}`
  )
  return res.data
}

export async function getDashboardAnalyticsApi(
  range: "7d" | "30d" | "90d" | "1y" = "7d"
) {
  const res = await request<ApiResponse<DashboardAnalytics>>(
    `/dashboard/analytics?range=${range}`
  )
  return res.data
}

export async function getNotificationsApi(
  filter: "all" | "unread" | "comment" | "like" | "approved" | "rejected" | "system" = "all"
) {
  const res = await request<
    ApiResponse<{ items: BackendNotification[]; unreadCount: number }>
  >(`/notifications?filter=${filter}`)
  return res.data
}

export async function markNotificationReadApi(id: string) {
  await request<ApiResponse<{ notification: BackendNotification }>>(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  )
}

export async function markAllNotificationsReadApi() {
  await request<ApiResponse<{ message: string }>>("/notifications/read-all", {
    method: "PATCH",
  })
}

export async function deleteNotificationApi(id: string) {
  await request<ApiResponse<{ message: string }>>(`/notifications/${id}`, {
    method: "DELETE",
  })
}

export async function deleteReadNotificationsApi() {
  await request<ApiResponse<{ message: string }>>("/notifications/read", {
    method: "DELETE",
  })
}

export async function getMyProfileApi() {
  const res = await request<
    ApiResponse<{
      profile: UserProfile
      stats: { posts: number; views: number; likes: number }
    }>
  >("/users/profile/me")
  return res.data
}

export async function updateMyProfileApi(
  payload: Partial<{
    name: string
    email: string
    bio: string
    avatar: string
    coverImage: string
    phone: string
    location: string
    website: string
    social: {
      twitter: string
      linkedin: string
      facebook: string
      instagram: string
    }
  }>
) {
  const res = await request<ApiResponse<{ profile: UserProfile }>>(
    "/users/profile/me",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  return res.data.profile
}

export async function changeMyPasswordApi(
  currentPassword: string,
  newPassword: string
) {
  await request<ApiResponse<{ message: string }>>("/users/profile/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export async function getAdminUsers() {
  const res = await request<ApiResponse<{ items: AdminUser[] }>>("/users")
  return res.data.items
}

export async function updateUserApi(
  id: string,
  payload: Partial<{
    role: "user" | "publisher" | "admin"
    isActive: boolean
  }>
) {
  const res = await request<ApiResponse<{ user: AdminUser }>>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
  return res.data.user
}

export async function getMyFollowingFeedApi(limit = 30) {
  const res = await request<
    ApiResponse<{ authors: FollowingAuthor[]; posts: BackendPost[] }>
  >(`/users/following/me?limit=${limit}`)

  return {
    authors: res.data.authors,
    posts: res.data.posts.map(mapPost),
  }
}

export async function getMyFollowPeopleApi(params?: {
  type?: "followers" | "following"
  page?: number
  limit?: number
}) {
  const search = new URLSearchParams()
  if (params?.type) search.set("type", params.type)
  if (params?.page) search.set("page", String(params.page))
  if (params?.limit) search.set("limit", String(params.limit))
  const suffix = search.toString() ? `?${search.toString()}` : ""

  const res = await request<ApiResponse<FollowPeoplePage>>(`/users/follows/me${suffix}`)
  return res.data
}

export async function toggleFollowUserApi(userId: string) {
  const res = await request<ApiResponse<{ following: boolean }>>(
    `/users/${userId}/follow`,
    {
      method: "POST",
    }
  )
  return res.data
}

export async function getPublicAuthorProfileApi(userId: string) {
  const res = await request<
    ApiResponse<{ profile: PublicAuthorProfile; posts: BackendPost[] }>
  >(`/users/${userId}/public`)

  return {
    profile: res.data.profile,
    posts: res.data.posts.map(mapPost),
  }
}

export async function createPostApi(payload: {
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  featured?: boolean
  category?: string
  topics?: string[]
  visibility?: "public" | "private"
  status?: "draft" | "pending" | "published"
  publishedAt?: string
}) {
  const res = await request<ApiResponse<{ post: BackendPost }>>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  return mapDashboardPost(res.data.post)
}

export async function updatePostApi(
  id: string,
  payload: Partial<{
    title: string
    excerpt: string
    content: string
    featuredImage?: string
    featured?: boolean
    category?: string
    topics?: string[]
    visibility?: "public" | "private"
    status?: "draft" | "pending" | "published" | "rejected"
    publishedAt?: string
  }>
) {
  const res = await request<ApiResponse<{ post: BackendPost }>>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
  return mapDashboardPost(res.data.post)
}

export async function updatePostStatusApi(
  id: string,
  status: "draft" | "pending" | "published" | "rejected"
) {
  const res = await request<ApiResponse<{ post: BackendPost }>>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
  return mapAdminPost(res.data.post)
}

export async function updatePostFeaturedApi(id: string, featured: boolean) {
  const res = await request<ApiResponse<{ post: BackendPost }>>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ featured }),
  })
  return mapAdminPost(res.data.post)
}

export async function deletePostApi(id: string) {
  await request<ApiResponse<{ message: string }>>(`/posts/${id}`, {
    method: "DELETE",
  })
}
