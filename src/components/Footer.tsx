import React from "react";
import Link from "next/link";
import { Heart, MessageCircle, Instagram } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface CategoryItem {
  name: string;
  href: string;
}

const categories: CategoryItem[] = [
  { name: "Customised Hampers", href: "/collections/customised-hampers/" },
  { name: "Bouquets", href: "/collections/bouquets/" },
  { name: "DIY Plates", href: "/collections/diy-plates/" },
  { name: "Name Plates", href: "/collections/name-plates/" },
  { name: "Frames", href: "/collections/frames/" },
  { name: "Photo Customised", href: "/collections/photo-customised/" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections/" },
  { name: "About Us", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

const instagramUrl = "https://www.instagram.com/creative_nest_by_diya?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw==";

export default function Footer() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <footer className="bg-brand-beige text-brand-charcoal pt-16 pb-8 border-t border-brand-beige-dark/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Desktop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-brand-beige-dark/30">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-2xl font-semibold tracking-tight text-brand-charcoal">
                Creative Nest
              </h3>
              <span className="block text-xs uppercase tracking-[0.25em] text-brand-gold font-medium mt-0.5">
                by Diya
              </span>
            </div>
            <p className="text-sm font-medium text-brand-gold italic">
              &ldquo;The home of heartfelt gifting.&rdquo;
            </p>
            <p className="text-sm text-brand-charcoal-light leading-relaxed">
              Every handcrafted piece is crafted with love and care, designed
              to make your cherished memories and special celebrations truly
              unforgettable.
            </p>
            <div className="pt-2 flex gap-4">
              <a 
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-charcoal-light hover:text-[#E1306C] transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-brand-charcoal">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-brand-charcoal-light hover:text-brand-gold transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-brand-charcoal">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-brand-charcoal-light hover:text-brand-gold transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h4 className="font-heading text-lg font-semibold text-brand-charcoal">
              Contact
            </h4>
            <p className="text-sm text-brand-charcoal-light leading-relaxed">
              Have a custom request or need assistance? Reach out to us directly
              on WhatsApp or Instagram.
            </p>
            <div className="space-y-3 pt-1">
              <p className="text-sm text-brand-charcoal flex items-center gap-2">
                <span className="text-brand-charcoal-light">WhatsApp:</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-charcoal hover:text-brand-gold transition-colors duration-200"
                >
                  +91 81601 30771
                </a>
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-whatsapp text-white text-sm font-medium rounded-md hover:bg-brand-whatsapp-dark shadow-sm transition-all duration-200"
                  aria-label="Message us on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E1306C] text-white text-sm font-medium rounded-md hover:bg-[#C13584] shadow-sm transition-all duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 text-center text-sm text-brand-charcoal-light">
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            <span>&copy; 2026 Creative Nest by Diya. Handmade with</span>
            <Heart
              className="w-4 h-4 text-red-500 fill-red-500 inline-block"
              aria-label="love"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
