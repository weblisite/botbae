import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-20 h-20"
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8", 
  xl: "w-10 h-10"
};

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = "md", 
  className, 
  fallbackClassName 
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const displayName = alt || name || "Avatar";
  const initials = name ? name.slice(0, 2).toUpperCase() : "AI";

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  // Show image if src exists and no error
  if (src && !imageError) {
    return (
      <div className={cn(
        "relative rounded-full overflow-hidden bg-muted flex-shrink-0",
        sizeClasses[size],
        className
      )}>
        <img
          src={src}
          alt={displayName}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <User className={cn("text-muted-foreground", iconSizeClasses[size])} />
          </div>
        )}
      </div>
    );
  }

  // Fallback to initials or icon
  return (
    <div className={cn(
      "rounded-full bg-gradient-to-br from-botbae-accent/20 to-botbae-secondary/20 flex items-center justify-center flex-shrink-0 border-2 border-botbae-accent/30",
      sizeClasses[size],
      fallbackClassName,
      className
    )}>
      {name ? (
        <span className={cn(
          "font-semibold text-botbae-accent",
          size === "sm" ? "text-xs" : 
          size === "md" ? "text-sm" :
          size === "lg" ? "text-base" : "text-lg"
        )}>
          {initials}
        </span>
      ) : (
        <User className={cn("text-botbae-accent", iconSizeClasses[size])} />
      )}
    </div>
  );
}

// Preset avatar variations for different moods/expressions
export function BotbaeAvatar({ 
  botbae, 
  mood = "friendly", 
  size = "md", 
  className 
}: {
  botbae: {
    name: string;
    avatar_url?: string | null;
    gender?: string;
    ethnicity?: string;
  };
  mood?: "friendly" | "happy" | "thinking" | "excited" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Avatar
      src={botbae.avatar_url}
      name={botbae.name}
      alt={`${botbae.name} (${mood})`}
      size={size}
      className={cn(
        "ring-2 ring-botbae-accent/50 ring-offset-2 ring-offset-background",
        className
      )}
    />
  );
}

// Avatar with online status indicator
export function AvatarWithStatus({
  isOnline = true,
  ...props
}: AvatarProps & { isOnline?: boolean }) {
  return (
    <div className="relative">
      <Avatar {...props} />
      <div className={cn(
        "absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-background",
        isOnline ? "bg-green-500" : "bg-gray-400"
      )} />
    </div>
  );
}

// Avatar placeholder while loading
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  return (
    <div className={cn(
      "rounded-full bg-muted animate-pulse flex-shrink-0",
      sizeClasses[size]
    )} />
  );
} 