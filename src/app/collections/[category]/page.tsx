import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import {
  ChevronRight,
  ArrowLeft,
  PackageOpen,
  Gift,
  Flower2,
  Palette,
  Home,
  Frame,
  Camera,
  LucideIcon,
} from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
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

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {
      title: "Category Not Found | Creative Nest by Diya",
      description: "Explore our collection of handcrafted gifts.",
    };
  }

  return {
    title: `${category.name} | Creative Nest by Diya`,
    description: category.description,
    openGraph: {
      title: `${category.name} — Creative Nest by Diya`,
      description: category.description,
      type: "website",
    },
  };
}

export default function CategoryCollectionPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const products = getProductsByCategory(category.slug);
  const allCategories = getAllCategories();
  const otherCategories = allCategories.filter((c) => c.slug !== category.slug);

  const IconComponent: LucideIcon =
    iconMap[category.icon?.toLowerCase()] ||
    iconMap[category.slug] ||
    Gift;

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Page Header with Breadcrumb */}
      <section className="bg-brand-beige border-b border-brand-beige-dark/30 py-10 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumbs */}
          <nav
            className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-charcoal-light bg-brand-white/80 px-4 py-1.5 rounded-full border border-brand-beige-dark/30 shadow-xs"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-beige-dark" aria-hidden="true" />
            <Link
              href="/collections"
              className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded"
            >
              Collections
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-beige-dark" aria-hidden="true" />
            <span className="font-semibold text-brand-charcoal" aria-current="page">
              {category.name}
            </span>
          </nav>

          {/* Category Icon Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-brand-white flex items-center justify-center shadow-xs border border-brand-beige-dark/20 text-brand-gold">
            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.5]" aria-hidden="true" />
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal tracking-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-brand-charcoal-light max-w-2xl mx-auto">
            {category.description}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Product Count & Back Link bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-brand-beige-dark/20">
          <p className="text-xs sm:text-sm font-medium text-brand-charcoal-light">
            Showing <span className="font-semibold text-brand-charcoal">{products.length}</span>{" "}
            {products.length === 1 ? "product" : "products"}
          </p>

          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-charcoal hover:text-brand-gold-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>All Collections</span>
          </Link>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Category State */
          <div className="py-16 sm:py-24 text-center bg-brand-cream/50 rounded-2xl border border-brand-beige-dark/30 max-w-lg mx-auto p-8 my-8">
            <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4 text-brand-charcoal-light">
              <PackageOpen className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal mb-2">
              No products in this category yet
            </h3>
            <p className="text-sm text-brand-charcoal-light mb-6">
              Check back soon! We are constantly handcrafting new items with love and care.
            </p>
            <Link
              href="/collections"
              className="btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-lg inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to All Collections</span>
            </Link>
          </div>
        )}

        {/* Explore Other Categories Section */}
        {otherCategories.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-brand-beige-dark/20">
            <div className="text-center mb-8">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal">
                Explore Other Collections
              </h2>
              <p className="text-xs sm:text-sm text-brand-charcoal-light mt-1">
                Discover more handmade creations made with love
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {otherCategories.map((other) => (
                <Link
                  key={other.id}
                  href={`/collections/${other.slug}`}
                  className="px-4 py-2 bg-brand-cream hover:bg-brand-beige border border-brand-beige-dark/30 rounded-full text-xs sm:text-sm font-medium text-brand-charcoal hover:border-brand-gold hover:text-brand-gold-dark transition-all duration-200"
                >
                  {other.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/collections"
            className="btn-outline text-xs sm:text-sm py-3 px-6 rounded-lg inline-flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to All Collections</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
