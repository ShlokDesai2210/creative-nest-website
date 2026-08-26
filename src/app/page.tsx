import Link from "next/link";
import {
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Heart,
  Package,
  Clock,
  Sparkle,
} from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import {
  getAllCategories,
  getProductCountByCategory,
  getFeaturedProducts,
} from "@/lib/products";
import {
  getWhatsAppCustomOrderUrl,
  getWhatsAppUrl,
} from "@/lib/whatsapp";

export default function HomePage() {
  const categories = getAllCategories();
  const featuredProducts = getFeaturedProducts();

  const customOrderWhatsAppUrl = getWhatsAppCustomOrderUrl(
    "Hi! I'd like to place a custom order with Creative Nest by Diya. Could you please share more details?"
  );
  const generalWhatsAppUrl = getWhatsAppUrl();

  return (
    <div className="flex min-h-screen flex-col">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO BANNER                                                    */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-brand-beige min-h-[60vh] md:min-h-[70vh] flex items-center justify-center py-16 sm:py-24">
        {/* Subtle decorative geometric background elements */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-rose/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#1A1A1A 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />

        <div className="container-custom relative z-10 mx-auto text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-beige-dark/50 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-medium text-brand-charcoal">
              ✨ Handcrafted with Love
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="mt-6 sm:mt-8 space-y-2">
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-charcoal">
              Creative Nest
            </h1>
            <p className="font-heading text-2xl sm:text-3xl md:text-4xl italic text-brand-gold">
              by Diya
            </p>
          </div>

          {/* Tagline */}
          <p className="mx-auto mt-4 sm:mt-6 max-w-md text-base sm:text-lg text-brand-charcoal-light text-balance font-normal leading-relaxed">
            The home of heartfelt gifting.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <Link
              href="/collections/"
              className="btn-primary w-full sm:w-auto text-base shadow-sm"
              aria-label="Explore collections"
            >
              <span>Explore Collections</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={customOrderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full sm:w-auto text-base"
              aria-label="Order custom gift on WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Order Custom Gift</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: SHOP BY CATEGORY                                               */}
      {/* ========================================================================= */}
      <section className="section-padding bg-brand-white">
        <div className="container-custom mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-brand-charcoal font-bold">
              Shop by Category
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg text-brand-charcoal-light">
              Find the perfect handmade gift
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-brand-gold/40" />
              <Sparkle className="h-3.5 w-3.5 text-brand-gold" />
              <span className="h-px w-12 bg-brand-gold/40" />
            </div>
          </div>

          {/* Categories Grid (3x2 on desktop, 2x3 on tablet, 1-col on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => {
              const productCount = getProductCountByCategory(category.slug);
              return (
                <CategoryCard
                  key={category.id}
                  category={category}
                  productCount={productCount}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: FEATURED PRODUCTS                                              */}
      {/* ========================================================================= */}
      <section className="section-padding bg-brand-beige/40 border-y border-brand-beige-dark/20">
        <div className="container-custom mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-brand-charcoal font-bold">
              Featured Products
            </h2>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg text-brand-charcoal-light">
              Our most loved creations
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-px w-12 bg-brand-gold/40" />
              <Sparkle className="h-3.5 w-3.5 text-brand-gold" />
              <span className="h-px w-12 bg-brand-gold/40" />
            </div>
          </div>

          {/* Products Grid (2x2 on mobile, 4-col on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Products CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/collections/"
              className="btn-outline group inline-flex items-center gap-2 text-sm sm:text-base font-semibold px-8 py-3"
              aria-label="View all products in collections"
            >
              <span>View All Products</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: ABOUT SECTION                                                  */}
      {/* ========================================================================= */}
      <section id="about" className="section-padding bg-brand-cream">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left Column: Story & CTA */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-rose/40 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-charcoal">
                <Heart className="h-3.5 w-3.5 text-brand-gold-dark fill-brand-gold-dark" />
                <span>Our Story</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-brand-charcoal font-bold leading-tight">
                About Creative Nest
              </h2>

              <p className="text-base sm:text-lg text-brand-charcoal-light leading-relaxed">
                Creative Nest by Diya is a handmade gifting brand dedicated to creating unique,
                personalised gifts that speak from the heart. Every product is crafted with care,
                attention to detail, and a whole lot of love. Whether it&apos;s a birthday, anniversary,
                or just because — we believe every occasion deserves something special.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-brand-beige p-2 text-brand-gold-dark">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-charcoal">100% Handcrafted</h4>
                    <p className="text-xs text-brand-charcoal-light">Made with care & precision</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-brand-beige p-2 text-brand-gold-dark">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-brand-charcoal">Custom Made</h4>
                    <p className="text-xs text-brand-charcoal-light">Tailored to your memories</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href={customOrderWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-base"
                  aria-label="Message us on WhatsApp for custom orders"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Message us for Custom Orders</span>
                </a>
              </div>
            </div>

            {/* Right Column: Decorative Placeholder */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-gradient-to-br from-brand-beige via-brand-rose/20 to-brand-cream border border-brand-beige-dark/40 p-8 sm:p-12 shadow-sm text-center">
                {/* Decorative background circle */}
                <div
                  className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-brand-gold/10 blur-xl"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col items-center space-y-5">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm border border-brand-beige-dark/30 text-brand-gold">
                    <Sparkles className="h-10 w-10" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-2xl font-bold text-brand-charcoal">
                      Handcrafted with Heart
                    </h3>
                    <p className="font-heading italic text-brand-gold text-base">
                      “Every gift tells a unique story”
                    </p>
                  </div>

                  <p className="text-sm text-brand-charcoal-light max-w-xs">
                    From customized hampers to eternal crochet bouquets, personalized frames and home decor — each piece is handcrafted individually by Diya.
                  </p>

                  <div className="flex items-center gap-2 pt-3 text-xs font-semibold text-brand-charcoal-light/80">
                    <Clock className="h-4 w-4 text-brand-gold-dark" />
                    <span>Custom orders ready in 3-5 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: CONTACT / WHATSAPP CTA                                         */}
      {/* ========================================================================= */}
      <section id="contact" className="section-padding bg-brand-charcoal text-white relative overflow-hidden">
        {/* Decorative backdrop gradients */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand-whatsapp/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container-custom relative z-10 mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-brand-beige">
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
            <span>We&apos;d Love to Hear from You</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-6">
            Have a question? Let&apos;s chat!
          </h2>

          <p className="mt-4 text-base sm:text-lg text-brand-beige-dark max-w-md mx-auto">
            We&apos;re just a WhatsApp message away
          </p>

          {/* Large WhatsApp CTA Button */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-4">
            <a
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-base sm:text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-brand-whatsapp/20 whatsapp-float"
              aria-label="Chat with Creative Nest by Diya on WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
              <span>Chat on WhatsApp</span>
            </a>

            {/* Phone Display */}
            <a
              href="tel:+918160130771"
              className="mt-3 inline-flex items-center gap-2 text-sm sm:text-base font-medium text-brand-beige-dark hover:text-white transition-colors duration-200"
              aria-label="Call +91 81601 30771"
            >
              <Phone className="h-4 w-4 text-brand-gold" />
              <span>+91 81601 30771</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
