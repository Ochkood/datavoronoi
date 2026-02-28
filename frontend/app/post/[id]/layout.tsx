import type { Metadata } from "next"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "")
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

type PostMetaResponse = {
  success: boolean
  data?: {
    post?: {
      _id: string
      title?: string
      excerpt?: string
      content?: string
      featuredImage?: string
      createdAt?: string
      publishedAt?: string
      author?: { name?: string }
    }
  }
}

function normalizeImageUrl(image?: string) {
  if (!image) return `${SITE_URL}/placeholder.jpg`
  if (image.startsWith("http://") || image.startsWith("https://")) return image
  if (image.startsWith("/")) return `${SITE_URL}${image}`
  return `${API_ORIGIN}/${image}`
}

function stripHtml(html?: string) {
  if (!html) return ""
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function truncate(text: string, max = 180) {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

async function fetchPostMeta(id: string) {
  try {
    const res = await fetch(`${API_BASE}/posts/${id}/meta`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as PostMetaResponse
    return json?.data?.post || null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = await fetchPostMeta(id)

  if (!post) {
    return {
      title: "Мэдээ олдсонгүй | Datanews.mn",
      description: "Хүссэн мэдээ олдсонгүй.",
    }
  }

  const title = `${post.title || "Мэдээ"} | Datanews.mn`
  const description = truncate(
    post.excerpt?.trim() || stripHtml(post.content) || "Datanews.mn мэдээ"
  )
  const url = `${SITE_URL}/post/${id}`
  const image = normalizeImageUrl(post.featuredImage)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Datanews.mn",
      locale: "mn_MN",
      type: "article",
      images: [
        {
          url: image,
          alt: post.title || "Datanews",
        },
      ],
      publishedTime: post.publishedAt || post.createdAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children
}
