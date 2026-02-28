"use client"

import { useState } from "react"
import { UserPlus, UserCheck, UserMinus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FollowButtonProps {
  following: boolean
  loading?: boolean
  onClick: () => void
  className?: string
}

export function FollowButton({
  following,
  loading = false,
  onClick,
  className,
}: FollowButtonProps) {
  const [hovering, setHovering] = useState(false)
  const showUnfollow = following && hovering

  const Icon = !following ? UserPlus : showUnfollow ? UserMinus : UserCheck
  const label = !following ? "Follow" : showUnfollow ? "Unfollow" : "Following"

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={loading}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        !following && "bg-primary text-primary-foreground hover:bg-primary/90",
        following &&
          !showUnfollow &&
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        showUnfollow && "bg-destructive/15 text-destructive hover:bg-destructive/20",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
