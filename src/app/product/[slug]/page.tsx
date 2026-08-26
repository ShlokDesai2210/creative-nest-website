import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getCategoryBySlug,
  Product,
  getImagePath,
} from "@/lib/products";
import { getWhatsAppUrl, getWhatsAppOrderUrl } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import SoldOutBadge from "@/components/SoldOutBadge";
import {
  ArrowLeft,
  Check,
  X,
  Tag,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Heart,
  Truck,
  Gift,
  Flower2,
  Palette,
  Home,
  Frame,
  Camera,
  LucideIcon,
} from "lucide-react";

interface ProductPageProps {
  params: {
    slug: string;
  };
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

export function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return {
      title: "Product Not Found | Creative Nest by Diya",
      description: "Discover handmade gifts crafted with love.",
    };
  }

  const category = getCategoryBySlug(product.category);

  return {
    title: `${product.name} | Creative Nest by Diya`,
    description: product.description,
    openGraph: {
      title: `${product.name} — Creative Nest by Diya`,
      description: product.description,
      type: "website",
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  // If product not found, render friendly not-found view with collections link
  if (!product) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full text-center bg-brand-cream/60 border border-brand-beige-dark/30 rounded-2xl p-8 sm:p-10">
          <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-4 text-brand-charcoal-light">
            <X className="w-8 h-8 stroke-[1.5]" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal mb-2">
            Product Not Found
          </h1>
          <p className="text-sm text-brand-charcoal-light mb-6">
            The item you are looking for does not exist or may have been updated. Explore our full
            collection to find handcrafted treasures.
          </p>
          <Link
            href="/collections"
            className="btn-primary text-sm py-3 px-6 rounded-lg inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Collections</span>
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryBySlug(product.category);
  const IconComponent: LucideIcon =
    categoryIconMap[product.category] || Gift;

  const hasImage =
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    Boolean(product.images[0]);

  // Calculate discount percentage if original price is higher
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // WhatsApp action URLs
  const orderUrl = getWhatsAppOrderUrl(product.name, product.price);
  const inquiryUrl = getWhatsAppUrl(product.name, product.price);

  // Related products from same category (up to 4, excluding current product)
  let relatedProducts = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id
  );

  // If fewer than 4 in same category, top up with other featured products
  if (relatedProducts.length < 4) {
    const otherProducts = getAllProducts().filter(
      (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...otherProducts].slice(0, 4);
  } else {
    relatedProducts = relatedProducts.slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-brand-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-brand-beige/50 border-b border-brand-beige-dark/20 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-brand-charcoal-light"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-beige-dark shrink-0" aria-hidden="true" />
            <Link
              href="/collections"
              className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded"
            >
              Collections
            </Link>
            {category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-brand-beige-dark shrink-0" aria-hidden="true" />
                <Link
                  href={`/collections/${category.slug}`}
                  className="hover:text-brand-charcoal transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold rounded truncate max-w-[150px] sm:max-w-none"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-brand-beige-dark shrink-0" aria-hidden="true" />
            <span
              className="font-semibold text-brand-charcoal truncate max-w-[160px] sm:max-w-[240px]"
              aria-current="page"
            >
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (60%): Large Image / Placeholder */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square w-full bg-brand-cream rounded-2xl border border-brand-beige-dark/30 overflow-hidden shadow-xs flex items-center justify-center">
              {/* Sold Out Ribbon Badge */}
              {!product.inStock && <SoldOutBadge />}

              {hasImage ? (
                <Image
                  src={getImagePath(product.images[0])}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className={`object-cover transition-transform duration-500 hover:scale-105 ${
                    !product.inStock ? "grayscale opacity-60" : ""
                  }`}
                />
              ) : (
                <div
                  className={`flex flex-col items-center justify-center p-8 text-center ${
                    !product.inStock ? "grayscale opacity-50" : ""
                  }`}
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-white flex items-center justify-center shadow-sm mb-4 border border-brand-beige-dark/20">
                    <IconComponent
                      className="w-12 h-12 sm:w-14 sm:h-14 text-brand-gold stroke-[1.5]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-white/80 rounded-full text-xs font-semibold tracking-wider uppercase text-brand-charcoal-light/70 border border-brand-beige-dark/30">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
                    <span>Handmade with Love</span>
                  </div>
                  <p className="text-xs text-brand-charcoal-light/60 mt-2 font-medium">
                    Creative Nest by Diya
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (40%): Product Details */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Category Link */}
            {category && (
              <Link
                href={`/collections/${category.slug}`}
                className="inline-flex items-center gap-1 text-xs uppercase font-semibold tracking-widest text-brand-gold hover:text-brand-gold-dark transition-colors mb-2"
              >
                <span>{category.name}</span>
              </Link>
            )}

            {/* Product Name */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-charcoal tracking-tight leading-tight mb-3">
              {product.name}
            </h1>

            {/* Price Display & Discount */}
            <div className="flex items-center flex-wrap gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-brand-charcoal">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base sm:text-lg text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                  {discountPercent && (
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-brand-rose text-brand-charcoal rounded-full border border-brand-rose">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock Status Badge */}
            <div className="mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>In Stock — Ready to Order</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-brand-sold-out border border-red-200">
                  <X className="w-3.5 h-3.5 text-brand-sold-out" aria-hidden="true" />
                  <span>Sold Out — Made to Order Available</span>
                </span>
              )}
            </div>

            {/* Product Description */}
            <div className="pb-6 border-b border-brand-beige-dark/30">
              <h2 className="text-xs font-semibold tracking-wider uppercase text-brand-charcoal-light/70 mb-2">
                About this item
              </h2>
              <p className="text-sm sm:text-base text-brand-charcoal-light leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="py-4 border-b border-brand-beige-dark/30">
                <div className="flex flex-wrap items-center gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-brand-beige text-brand-charcoal-light border border-brand-beige-dark/30"
                    >
                      <Tag className="w-3 h-3 text-brand-gold" aria-hidden="true" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Order / Inquiry Buttons */}
            <div className="pt-6">
              {product.inStock ? (
                <div className="space-y-2.5">
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full py-3.5 sm:py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                    aria-label={`Order ${product.name} on WhatsApp`}
                  >
                    <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>Order on WhatsApp</span>
                  </a>
                  <p className="text-center text-xs text-brand-charcoal-light/70">
                    Direct chat with Diya to customize and confirm your order.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <a
                    href={inquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm font-medium border-2 hover:bg-brand-charcoal hover:text-white transition-all"
                    aria-label={`Inquire about ${product.name} on WhatsApp`}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                  <p className="text-center text-xs text-brand-charcoal-light/70">
                    Currently out of stock. Contact Diya for a made-to-order piece.
                  </p>
                </div>
              )}
            </div>

            {/* Trust & Handmade Highlights */}
            <div className="mt-8 pt-6 border-t border-brand-beige-dark/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-charcoal-light">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-brand-cream/60 border border-brand-beige-dark/20">
                <Heart className="w-4 h-4 text-brand-gold shrink-0" aria-hidden="true" />
                <span>100% Handmade with love</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-brand-cream/60 border border-brand-beige-dark/20">
                <Truck className="w-4 h-4 text-brand-gold shrink-0" aria-hidden="true" />
                <span>Safe packing & delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products: You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-brand-beige-dark/30">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold">
                  More From Creative Nest
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-charcoal mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-charcoal hover:text-brand-gold-dark transition-colors self-start sm:self-auto"
              >
                <span>View all products</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
