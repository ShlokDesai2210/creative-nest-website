"use client";

import React from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppFloatingButton() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip for desktop */}
      <span
        id="whatsapp-tooltip"
        role="tooltip"
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-charcoal text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block select-none"
      >
        Chat with us on WhatsApp
        <span
          className="absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-brand-charcoal"
          aria-hidden="true"
        />
      </span>

      {/* WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        aria-describedby="whatsapp-tooltip"
        className="whatsapp-float flex items-center justify-center w-14 h-14 bg-brand-whatsapp text-white rounded-full shadow-lg hover:bg-brand-whatsapp-dark hover:scale-110 transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-whatsapp/50"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.275-.1-.475-.15-.675.15-.2.301-.775.978-.95 1.178-.175.2-.35.225-.65.075-.301-.15-1.272-.469-2.422-1.494-.897-.8-1.503-1.789-1.68-2.09-.175-.301-.019-.464.131-.614.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.628-.925-2.228-.244-.585-.492-.505-.675-.515h-.575c-.2 0-.525.075-.8.375-.275.301-1.05 1.028-1.05 2.508 0 1.48 1.075 2.909 1.225 3.109.15.2 2.115 3.23 5.125 4.529.716.309 1.275.494 1.71.633.72.229 1.375.197 1.892.12.576-.086 1.78-.727 2.03-1.43.25-.702.25-1.303.175-1.43-.075-.127-.275-.202-.575-.352zm-5.47 7.618a9.93 9.93 0 0 1-5.068-1.385l-.363-.216-3.766.988 1.006-3.671-.237-.377a9.92 9.92 0 0 1-1.523-5.269c0-5.503 4.477-9.98 9.982-9.98 2.667 0 5.174 1.039 7.059 2.925a9.925 9.925 0 0 1 2.921 7.055c0 5.504-4.477 9.98-9.979 9.98zm8.53-18.51C18.27 1.237 15.24 0 12.002 0 5.385 0 0 5.385 0 12.002c0 2.112.55 4.17 1.597 5.985L0 24l6.18-1.621a11.96 11.96 0 0 0 5.822 1.503h.005c6.615 0 12-5.385 12-12.002 0-3.238-1.238-6.269-3.477-8.508z" />
        </svg>
      </a>
    </div>
  );
}
