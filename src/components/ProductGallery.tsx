"use client";

import React, { useState, MouseEvent } from "react";
import Image from "next/image";
import { getImagePath } from "@/lib/products";
import { X, ZoomIn } from "lucide-react";
import SoldOutBadge from "@/components/SoldOutBadge";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  inStock: boolean;
}

export default function ProductGallery({ images, productName, inStock }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const hasImages = images && images.length > 0 && images[0] !== "";
  
  if (!hasImages) {
    return (
      <div className="relative aspect-square w-full bg-brand-cream rounded-2xl border border-brand-beige-dark/30 overflow-hidden shadow-xs flex items-center justify-center">
        {!inStock && <SoldOutBadge />}
        <span className="text-brand-charcoal-light uppercase tracking-widest text-xs font-semibold">Handmade</span>
      </div>
    );
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const selectedImage = getImagePath(images[selectedIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div 
        className="relative aspect-square w-full bg-brand-cream rounded-2xl border border-brand-beige-dark/30 overflow-hidden shadow-xs cursor-crosshair group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {!inStock && <SoldOutBadge />}
        
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className={`object-cover transition-opacity duration-300 ${!inStock ? "grayscale opacity-60" : ""} ${isHovering ? "opacity-0 sm:opacity-0" : "opacity-100"}`}
        />

        {/* Zoom Overlay (Desktop Only) */}
        {isHovering && (
          <div 
            className="absolute inset-0 hidden sm:block pointer-events-none"
            style={{
              backgroundImage: `url('${selectedImage}')`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '200%',
              backgroundRepeat: 'no-repeat',
              ...( !inStock ? { filter: 'grayscale(100%)', opacity: 0.6 } : {} )
            }}
          />
        )}
        
        {/* Mobile Zoom Hint */}
        <div className="absolute bottom-4 right-4 sm:hidden bg-white/80 backdrop-blur rounded-full p-2 text-brand-charcoal shadow-sm pointer-events-none">
          <ZoomIn className="w-5 h-5" />
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 overflow-hidden snap-start transition-all ${
                selectedIndex === idx ? "border-brand-gold ring-2 ring-brand-gold/20" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={getImagePath(img)}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-5xl aspect-square sm:aspect-auto sm:h-[85vh] max-h-screen">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>
          
          {/* Lightbox Thumbnails (if multiple) */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 overflow-x-auto z-50">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(idx); }}
                  className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedIndex === idx ? "border-white" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={getImagePath(img)} alt={`Thumb ${idx+1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
