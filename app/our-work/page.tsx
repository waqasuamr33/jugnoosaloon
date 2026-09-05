"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import NewsPress from "../components/NewsPress";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import PageHero from "../components/PageHero";
import { getGalleries, GalleryItem, normalizeImageUrl } from "../lib/api";

export default function OurWorkPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const handleOpenBooking = (serviceName: string = "") => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getGalleries();
        if (data && Array.isArray(data)) {
          setGalleries(data);
        } else {
          setGalleries([]);
        }
      } catch (err) {
        console.error("Failed to load gallery items:", err);
        setGalleries([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Compute unique categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    galleries.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [galleries]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    return galleries.filter((item) => {
      return (
        activeCategory === "All" ||
        item.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    });
  }, [galleries, activeCategory]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Hero Header Banner with Golden Light Ray */}
      <PageHero
        title="OUR WORK & PORTFOLIO"
        subtitle="A visual anthology showing our transformations in their authentic natural resolution."
      />

      {/* Main Showcase Section */}
      <section className="py-14 bg-[#FAFAFA]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-8 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#111111] text-white shadow-md border border-[#111111]"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-[#D4AF37] hover:text-black shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* True Pinterest Masonry Grid (Preserves Natural Aspect Ratios) */}
          {loading ? (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
              {[280, 420, 320, 480, 360, 260, 400, 340].map((h, n) => (
                <div
                  key={n}
                  style={{ height: `${h}px` }}
                  className="break-inside-avoid mb-6 rounded-2xl sm:rounded-3xl bg-slate-200 border border-slate-300 animate-pulse"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto p-8 shadow-sm">
              <p className="text-base font-bold text-[#111111]">
                No images found in this category.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="mt-6 px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Show All Images
              </button>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
              {filteredItems.map((item, idx) => {
                const imageSrc = normalizeImageUrl(item.image_url, item.image_path);

                return (
                  <div
                    key={item.id || idx}
                    onClick={() => setLightboxImage(imageSrc)}
                    className="break-inside-avoid mb-6 group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
                  >
                    {/* True Natural Aspect Ratio Image (No distortion, no forced height) */}
                    <img
                      src={imageSrc}
                      alt={item.title || "Jugnu's Saloon Transformation"}
                      loading="lazy"
                      className="w-full h-auto block object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pure Full-Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fadeIn cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImage(null);
            }}
            className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-lg text-lg font-bold"
            aria-label="Close image"
          >
            ✕
          </button>

          {/* Full-Image Container */}
          <div
            className="relative max-w-6xl max-h-[90vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Full Size View"
              className="max-h-[90vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      {/* Google 5-Star Reviews & Client Testimonials */}
      <NewsPress />

      <Footer onOpenBooking={() => handleOpenBooking()} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={selectedService}
      />
    </main>
  );
}
