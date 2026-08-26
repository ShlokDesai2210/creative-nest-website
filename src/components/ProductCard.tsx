"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, getImagePath } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SoldOutBadge from "@/components/SoldOutBadge";
import {
  Gift,
  Flower2,
  Palette,
  Home,
  Frame,
  Camera,
  MessageCircle,
  LucideIcon,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const categoryIconMap: Record<string, LucideIcon> = {
  "customised-hampers": Gift,
  bouquets: Flower2,
  "diy-plates": Palette,
  "name-plates": Home,
  frames: Frame,
  "photo-customised": Camera,
  gift: Gift,
  flower2: Flower2,
  palette: Palette,
  home: Home,
  frame: Frame,
  camera: Camera,
};

export function ProductCard({ product }: ProductCardProps) {
  const IconComponent: LucideIcon =
    categoryIconMap[product.category] || Gift;

  const hasImage =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    Boolean(product.images[0]);

  const whatsappUrl = getWhatsAppUrl(product.name, product.price);

  return (
    <div className="group relative flex flex-col justify-between bg-brand-white rounded-xl border border-brand-beige-dark/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
      {/* Link wrapping image + name + price */}
      <Link
        href={`/product/${product.slug}/`}
        className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-t-xl"
        aria-label={`View details for ${product.name}`}
      >
        {/* Square Aspect Ratio Image / Placeholder Container */}
        <div className="relative aspect-square w-full bg-brand-cream overflow-hidden flex items-center justify-center">
          {!product.inStock && <SoldOutBadge />}

          {hasImage ? (
            <Image
              src={getImagePath(product.images[0])}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                !product.inStock ? "grayscale opacity-60" : ""
              }`}
            />
          ) : (
            <div
              className={`flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
                !product.inStock ? "grayscale opacity-50" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-brand-white flex items-center justify-center shadow-sm mb-3 group-hover:bg-brand-rose/40 group-hover:scale-110 transition-all duration-300">
                <IconComponent
                  className="w-8 h-8 text-brand-gold stroke-[1.5]"
                  aria-hidden="true"
                />
              </div>
              <span className="text-xs font-medium tracking-wider uppercase text-brand-charcoal-light/60">
                Handmade
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className={`font-heading text-sm sm:text-base font-semibold text-brand-charcoal line-clamp-2 mb-2 group-hover:text-brand-gold-dark transition-colors ${
              !product.inStock ? "opacity-75" : ""
            }`}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price display */}
          <div className="mt-auto flex items-baseline gap-2 pt-1">
            <span className="text-base sm:text-lg font-bold text-brand-charcoal">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price ? (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Button Section */}
      <div className="p-4 pt-0">
        {product.inStock ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full text-xs sm:text-sm py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 font-medium"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Order on WhatsApp</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full text-xs sm:text-sm py-2.5 px-3 rounded-lg bg-gray-200 text-gray-500 font-medium cursor-not-allowed text-center select-none"
            aria-disabled="true"
          >
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
