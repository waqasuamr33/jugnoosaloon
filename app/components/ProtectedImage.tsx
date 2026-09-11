"use client";

import React, { useState } from "react";

export function downloadDecoyLogo(filename = "Jugnus_Saloon_Official_Logo.png") {
  if (typeof window === "undefined") return;
  const a = document.createElement("a");
  a.href = "/logo.png";
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  logoSrc?: string;
  onClick?: () => void;
  loading?: "lazy" | "eager";
}

/**
 * ProtectedImage Component
 * 
 * Displays authentic, high-resolution gallery images cleanly with zero watermarks on screen.
 * Places an invisible decoy layer of the official Jugnu's Saloon logo (/logo.png) directly on top.
 * 
 * Any browser save attempt (Right Click -> Save Image As, Mobile Long-Press, Drag & Drop)
 * will target the topmost decoy element and download the official logo instead of the salon photo.
 */
export default function ProtectedImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  logoSrc = "/logo.png",
  onClick,
  loading = "lazy",
}: ProtectedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={`relative select-none overflow-hidden ${className}`}
      onClick={onClick}
      style={{
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
      }}
    >
      {/* 1. Underlying Clean Display Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        className={`pointer-events-none select-none transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-90"
        } ${imgClassName}`}
        style={{
          userSelect: "none",
          WebkitTouchCallout: "none",
          pointerEvents: "none",
        }}
      />

      {/* 2. Top Invisible Decoy Layer (/logo.png) */}
      <img
        src={logoSrc}
        alt="Jugnu's Saloon Official"
        title="Jugnu's Saloon"
        draggable={true}
        className="absolute inset-0 w-full h-full object-contain opacity-0 cursor-pointer pointer-events-auto z-10"
        style={{
          opacity: 0,
          userSelect: "none",
        }}
      />
    </div>
  );
}
