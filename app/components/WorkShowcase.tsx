"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getGalleries, GalleryItem, normalizeImageUrl } from "../lib/api";
import ProtectedImage, { downloadDecoyLogo } from "./ProtectedImage";

interface WorkShowcaseProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function WorkShowcase({ onOpenBooking }: WorkShowcaseProps = {}) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadGalleryData() {
      try {
        const data = await getGalleries();
        if (data && Array.isArray(data)) {
          setItems(data.slice(0, 6));
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch gallery items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadGalleryData();
  }, []);

  return (
    <section className="py-24 bg-[#FAFAFA] text-[#111111] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111]">
              OUR WORK & TRANSFORMATIONS
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              A curated Pinterest showcase of bridal artistry, precision cuts, and aesthetic treatments in their natural resolution.
            </p>
          </div>

          <div>
            <Link
              href="/our-work"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-md group"
            >
              <span>EXPLORE ALL WORK</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* True Pinterest Masonry Showcase (Preserves Natural Aspect Ratios) */}
        {loading ? (
          <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-6">
            {[260, 360, 220, 320, 280, 240].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}px` }}
                className="break-inside-avoid mb-3 sm:mb-6 rounded-xl sm:rounded-3xl bg-slate-200 border border-slate-300 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 lg:columns-3 gap-3 sm:gap-6 [column-fill:_balance]">
            {items.map((item, idx) => {
              const imageSrc = normalizeImageUrl(item.image_url, item.image_path);

              return (
                <div
                  key={item.id || idx}
                  className="break-inside-avoid mb-3 sm:mb-6 group relative w-full rounded-xl sm:rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
                >
                  {/* Protected Image: Clean display on screen, downloads Jugnu's Saloon logo */}
                  <ProtectedImage
                    src={imageSrc}
                    alt={item.title || "Saloon Transformation"}
                    onClick={() => setLightboxImage(imageSrc)}
                    imgClassName="w-full h-auto block object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="mt-10 text-center">
          <Link
            href="/our-work"
            className="inline-flex items-center space-x-3 px-10 py-4 rounded-full bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg hover:shadow-xl group"
          >
            <span>See More Transformations in Pinterest Gallery</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Full-Image Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top Actions */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
            {/* Decoy Download Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                downloadDecoyLogo("Jugnus_Saloon_Official_Logo.png");
              }}
              className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-lg text-sm font-bold"
              title="Save Image"
              aria-label="Save image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImage(null);
              }}
              className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-lg text-lg font-bold"
              aria-label="Close image"
            >
              ✕
            </button>
          </div>

          {/* Full-Image Container with Decoy Protection */}
          <div
            className="relative max-w-6xl max-h-[90vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <ProtectedImage
              src={lightboxImage}
              alt="Full Size Work"
              className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl"
              imgClassName="max-h-[90vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}
