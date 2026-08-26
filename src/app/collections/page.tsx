"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getAllProducts,
  getAllCategories,
  sortProducts,
  SortOption,
  Product,
  Category,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, PackageSearch, RefreshCw } from "lucide-react";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const categories: Category[] = useMemo(() => getAllCategories(), []);
  const allProducts: Product[] = useMemo(() => getAllProducts(), []);

  // Validate initial category param
  const validInitialCategory = useMemo(() => {
    if (!initialCategoryParam) return null;
    const exists = categories.some((c) => c.slug === initialCategoryParam);
    return exists ? initialCategoryParam : null;
  }, [initialCategoryParam, categories]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    validInitialCategory
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = allProducts;
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return sortProducts(result, sortBy);
  }, [allProducts, selectedCategory, sortBy]);

  const totalCount = filteredAndSortedProducts.length;

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Page Header */}
      <section className="bg-brand-beige border-b border-brand-beige-dark/30 py-12 sm:py-16 md:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="mb-4 text-xs sm:text-sm text-brand-charcoal-light flex items-center justify-center gap-2">
            <Link
              href="/"
              className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded"
            >
              Home
            </Link>
            <span className="text-brand-beige-dark">/</span>
            <span className="font-semibold text-brand-charcoal" aria-current="page">
              Collections
            </span>
          </nav>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal tracking-tight">
            Our Collections
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-brand-charcoal-light max-w-2xl mx-auto">
            Discover handmade gifts crafted with love
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Controls Bar: Filter Pills + Sort Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-brand-beige-dark/20">
          {/* Horizontal Scrollable Category Pills */}
          <div className="overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            <div
              className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap min-w-max"
              role="group"
              aria-label="Filter products by category"
            >
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${
                  selectedCategory === null
                    ? "bg-brand-charcoal text-white shadow-sm"
                    : "bg-white border border-brand-beige-dark/40 text-brand-charcoal-light hover:border-brand-gold hover:text-brand-charcoal"
                }`}
                aria-pressed={selectedCategory === null}
              >
                All
              </button>

              {categories.map((category) => {
                const isActive = selectedCategory === category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${
                      isActive
                        ? "bg-brand-charcoal text-white shadow-sm"
                        : "bg-white border border-brand-beige-dark/40 text-brand-charcoal-light hover:border-brand-gold hover:text-brand-charcoal"
                    }`}
                    aria-pressed={isActive}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Dropdown & Count */}
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <label
                htmlFor="sort-select"
                className="text-xs sm:text-sm font-medium text-brand-charcoal-light flex items-center gap-1.5 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
                <span>Sort by:</span>
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-xs sm:text-sm bg-white border border-brand-beige-dark/50 rounded-lg px-3 py-2 text-brand-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold cursor-pointer transition-shadow"
                aria-label="Sort products"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Count Indicator */}
        <div className="pt-6 pb-6 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-brand-charcoal-light">
            Showing <span className="font-semibold text-brand-charcoal">{totalCount}</span>{" "}
            {totalCount === 1 ? "product" : "products"}
            {selectedCategory && (
              <span>
                {" "}
                in{" "}
                <span className="font-semibold text-brand-charcoal">
                  {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </span>
            )}
          </p>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-medium text-brand-gold-dark hover:text-brand-charcoal flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {totalCount > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center bg-brand-cream/50 rounded-2xl border border-brand-beige-dark/30 max-w-lg mx-auto p-8 my-8">
            <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4 text-brand-charcoal-light">
              <PackageSearch className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-charcoal mb-2">
              No products found
            </h3>
            <p className="text-sm text-brand-charcoal-light mb-6">
              We couldn&apos;t find any items matching your selected filter. Try choosing a different
              category or clearing your selection.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="btn-primary text-xs sm:text-sm py-2.5 px-6 rounded-lg inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Show All Products</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-white">
          <section className="bg-brand-beige border-b border-brand-beige-dark/30 py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-pulse">
              <div className="h-4 w-32 bg-brand-beige-dark/30 rounded mx-auto mb-4" />
              <div className="h-10 w-64 bg-brand-beige-dark/40 rounded mx-auto mb-3" />
              <div className="h-4 w-80 bg-brand-beige-dark/30 rounded mx-auto" />
            </div>
          </section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="h-8 w-48 bg-brand-cream rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-brand-cream rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CollectionsContent />
    </Suspense>
  );
}
