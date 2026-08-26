import React from "react";

interface SoldOutBadgeProps {
  className?: string;
}

export default function SoldOutBadge({ className = "" }: SoldOutBadgeProps) {
  return (
    <div
      className={`sold-out-ribbon select-none ${className}`.trim()}
      role="status"
      aria-label="Sold out"
    >
      SOLD OUT
    </div>
  );
}
