import React from "react";
import Link from "next/link";
import { Category } from "@/lib/products";
import {
  Gift,
  Flower2,
  Palette,
  Home,
  Frame,
  Camera,
  LucideIcon,
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
  productCount: number;
}

const iconMap: Record<string, LucideIcon> = {
  gift: Gift,
  flower2: Flower2,
  palette: Palette,
  home: Home,
  frame: Frame,
  camera: Camera,
  "customised-hampers": Gift,
  bouquets: Flower2,
  "diy-plates": Palette,
  "name-plates": Home,
  frames: Frame,
  "photo-customised": Camera,
};

export function CategoryCard({
  category,
  productCount,
}: CategoryCardProps) {
  const IconComponent: LucideIcon =
    iconMap[category.icon?.toLowerCase()] ||
    iconMap[category.slug] ||
    Gift;

  const countText = `${productCount} ${
    productCount === 1 ? "Product" : "Products"
  }`;

  return (
    <Link
      href={`/collections/${category.slug}/`}
      className="group relative flex flex-col items-center justify-center p-6 sm:p-8 bg-brand-cream hover:bg-brand-beige border border-brand-beige-dark/20 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      aria-label={`Browse ${category.name} collection (${countText})`}
    >
      {/* Icon Circle */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 group-hover:bg-brand-gold group-hover:text-white transition-all duration-300 text-brand-charcoal">
        <IconComponent
          className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]"
          aria-hidden="true"
        />
      </div>

      {/* Category Name */}
      <h3 className="font-heading text-lg sm:text-xl font-semibold text-brand-charcoal mb-1 group-hover:text-brand-gold-dark transition-colors">
        {category.name}
      </h3>

      {/* Product Count */}
      <p className="text-xs sm:text-sm text-brand-charcoal-light font-body">
        {countText}
      </p>
    </Link>
  );
}

export default CategoryCard;
