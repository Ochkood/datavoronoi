import type { CategoryStats } from "@/lib/data"

export type PostEmbedKind = "highlights" | "charts"

export type PostStatsEmbed = {
  kind: PostEmbedKind
  stats: CategoryStats
}

export type PostContentSegment =
  | { type: "html"; html: string }
  | { type: "embed"; embed: PostStatsEmbed }

const TOKEN_PREFIX = "[[DV_EMBED:"
const TOKEN_REGEX =
  /<p[^>]*>\s*\[\[DV_EMBED:([A-Za-z0-9_-]+)\]\]\s*<\/p>|\[\[DV_EMBED:([A-Za-z0-9_-]+)\]\]/g

function bytesToBinary(bytes: Uint8Array): string {
  let out = ""
  for (let i = 0; i < bytes.length; i += 1) {
    out += String.fromCharCode(bytes[i])
  }
  return out
}

function binaryToBytes(binary: string): Uint8Array {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function encodeBase64(input: string): string {
  const bufferCtor = (globalThis as { Buffer?: { from: (...args: unknown[]) => { toString: (enc: string) => string } } }).Buffer
  if (bufferCtor) {
    return bufferCtor.from(input, "utf8").toString("base64")
  }

  const bytes = new TextEncoder().encode(input)
  return btoa(bytesToBinary(bytes))
}

function decodeBase64(input: string): string {
  const bufferCtor = (globalThis as { Buffer?: { from: (...args: unknown[]) => { toString: (enc: string) => string } } }).Buffer
  if (bufferCtor) {
    return bufferCtor.from(input, "base64").toString("utf8")
  }

  const binary = atob(input)
  const bytes = binaryToBytes(binary)
  return new TextDecoder().decode(bytes)
}

function toBase64Url(value: string): string {
  const base64 = encodeBase64(value)
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`
  return decodeBase64(padded)
}

function normalizeStats(input: unknown): CategoryStats {
  const stats = input as CategoryStats | undefined
  return {
    highlights: Array.isArray(stats?.highlights) ? stats.highlights : [],
    charts: Array.isArray(stats?.charts) ? stats.charts : [],
  }
}

export function createPostEmbedToken(embed: PostStatsEmbed): string {
  const payload = JSON.stringify({
    v: 1,
    kind: embed.kind,
    stats: normalizeStats(embed.stats),
  })

  return `${TOKEN_PREFIX}${toBase64Url(payload)}]]`
}

export function parsePostEmbedToken(token: string): PostStatsEmbed | null {
  const match = token.match(/^\[\[DV_EMBED:([A-Za-z0-9_-]+)\]\]$/)
  if (!match) return null

  try {
    const raw = fromBase64Url(match[1])
    const parsed = JSON.parse(raw) as {
      kind?: PostEmbedKind
      stats?: CategoryStats
    }

    if (parsed.kind !== "highlights" && parsed.kind !== "charts") {
      return null
    }

    return {
      kind: parsed.kind,
      stats: normalizeStats(parsed.stats),
    }
  } catch {
    return null
  }
}

export function splitPostContentByEmbeds(contentHtml: string): PostContentSegment[] {
  const segments: PostContentSegment[] = []
  let lastIndex = 0

  for (const match of contentHtml.matchAll(TOKEN_REGEX)) {
    const full = match[0]
    const encoded = match[1] || match[2]
    const idx = match.index ?? 0

    if (idx > lastIndex) {
      segments.push({
        type: "html",
        html: contentHtml.slice(lastIndex, idx),
      })
    }

    if (!encoded) {
      segments.push({ type: "html", html: full })
      lastIndex = idx + full.length
      continue
    }

    const parsed = parsePostEmbedToken(`[[DV_EMBED:${encoded}]]`)
    if (parsed) {
      segments.push({ type: "embed", embed: parsed })
    } else {
      segments.push({ type: "html", html: full })
    }

    lastIndex = idx + full.length
  }

  if (lastIndex < contentHtml.length) {
    segments.push({
      type: "html",
      html: contentHtml.slice(lastIndex),
    })
  }

  if (segments.length === 0) {
    return [{ type: "html", html: contentHtml }]
  }

  return segments
}
