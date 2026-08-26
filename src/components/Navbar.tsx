"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections/" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const whatsappUrl = getWhatsAppUrl();

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-brand-white/95 backdrop-blur-md transition-shadow duration-300 ${
        isScrolled
          ? "shadow-sm border-b border-brand-beige-dark/30"
          : "border-b border-brand-beige"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Brand Logo / Name */}
          <Link
            href="/"
            className="group flex flex-col justify-center"
            aria-label="Creative Nest by Diya — Home"
          >
            <span className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-brand-charcoal group-hover:text-brand-gold transition-colors duration-200">
              Creative Nest
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-brand-gold font-medium -mt-1">
              by Diya
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-8"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium tracking-wide text-brand-charcoal hover:text-brand-gold transition-colors duration-200 relative py-1"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop WhatsApp Action Button */}
          <div className="hidden md:flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-whatsapp text-white text-sm font-medium rounded-full hover:bg-brand-whatsapp-dark shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
              aria-label="Order or chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-md text-brand-charcoal hover:text-brand-gold hover:bg-brand-beige transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Dropdown Navigation */}
      <div
        className={`fixed inset-x-0 top-16 bg-brand-white border-b border-brand-beige shadow-lg transition-all duration-300 ease-in-out md:hidden overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100 py-6"
            : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="px-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-brand-charcoal hover:text-brand-gold py-2 border-b border-brand-beige transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-brand-whatsapp text-white text-sm font-medium rounded-full hover:bg-brand-whatsapp-dark shadow-sm transition-all duration-200"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
