"use client";
import { useState } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "white" | "green";
}

export default function Logo({ className = "", size = 40, variant = "green" }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  
  const logoSrc = variant === "white" 
    ? "/Sadhna-white (1).png"
    : "/Sadhna-green (1).png";

  if (imageError) {
    // Fallback SVG if image doesn't exist
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#f0e491"
          stroke="#31694e"
          strokeWidth="0.5"
        />
        <circle
          cx="50"
          cy="50"
          r="11"
          fill="#f0e491"
          stroke="#31694e"
          strokeWidth="0.8"
        />
        <text
          x="50"
          y="58"
          fontSize="16"
          fontWeight="900"
          fill="#31694e"
          textAnchor="middle"
          fontFamily="serif"
        >
          S
        </text>
      </svg>
    );
  }

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoSrc}
        alt="Sadhana Yogshala Logo"
        width={size}
        height={size}
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  );
}
