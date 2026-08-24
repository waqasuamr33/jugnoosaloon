"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getServices, getServiceCategories, normalizeImageUrl } from "../lib/api";

interface ServiceMatrixProps {
  onOpenBooking: (serviceName?: string) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  description: string;
  popular?: boolean;
}

interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  services: ServiceItem[];
}

export default function ServiceMatrix({ onOpenBooking }: ServiceMatrixProps) {
  const [activeTab, setActiveTab] = useState<string>("");
  const [categoriesList, setCategoriesList] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBackendServices() {
      try {
        const [categoriesData, servicesData] = await Promise.all([
          getServiceCategories(),
          getServices(),
        ]);

        const fallbackImages = [
          "/images/bridal_makeup.png",
          "/images/beauty_facial.png",
          "/images/hair_styling.png",
          "/images/hair_washing.png",
        ];

        if (categoriesData && categoriesData.length > 0) {
          const mappedCategories: ServiceCategory[] = categoriesData.map((cat, idx) => {
            const matchedServices: ServiceItem[] = servicesData
              .filter((s) => s.category?.id === cat.id || s.category?.title?.toLowerCase() === cat.title.toLowerCase())
              .map((s) => {
                const finalPrice = s.discounted_price || s.price;
                const hasDiscount = s.discount && s.discount > 0 && s.discounted_price && s.discounted_price < s.price;
                return {
                  id: String(s.id),
                  name: s.title,
                  price: `Rs. ${finalPrice.toLocaleString()}`,
                  originalPrice: hasDiscount ? `Rs. ${s.price.toLocaleString()}` : undefined,
                  discount: s.discount || 0,
                  description: s.description || `Professional ${s.title} treatment.`,
                };
              });

            const categoryImage = (cat.image || cat.image_url)
              ? normalizeImageUrl(cat.image_url, cat.image)
              : fallbackImages[idx % fallbackImages.length];

            return {
              id: `cat-${cat.id}`,
              title: cat.title,
              subtitle: cat.description || `Luxury ${cat.title} treatments at Jugnu's Saloon.`,
              image: categoryImage,
              services: matchedServices,
            };
          });

          setCategoriesList(mappedCategories);
          if (mappedCategories.length > 0) {
            setActiveTab(mappedCategories[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading service matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBackendServices();
  }, []);

  const activeCategory = categoriesList.find((c) => c.id === activeTab) || categoriesList[0];

  return (
    <section className="py-20 bg-[#FAFAFA] text-[#111111] relative border-t border-slate-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#996515]">
            Complete Treatment Matrix
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold uppercase text-[#111111]">
            OUR BEAUTY & SALON SERVICES
          </h2>
          <div className="w-12 h-1 bg-[#D4AF37] mx-auto rounded-full" />
        </div>

        {/* Skeleton Loading State */}
        {loading ? (
          <div className="space-y-12 animate-pulse">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-36 bg-slate-200 rounded-full" />
              ))}
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <div className="h-8 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-96 bg-slate-100 rounded" />
                <div className="space-y-3 pt-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5 h-96 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No services currently available.
          </div>
        ) : (
          <>
            {/* Category Navigation Pills */}
            <div className="flex items-center justify-center flex-wrap gap-2.5 mb-10">
              {categoriesList.map((cat) => {
                const isActive = cat.id === activeTab;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[#111111] text-[#D4AF37] shadow-md border border-[#111111]"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat.title}
                  </button>
                );
              })}
            </div>

            {/* Active Category Display Box */}
            {activeCategory && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h3 className="font-sans text-2xl font-bold text-[#111111] uppercase mb-1">
                      {activeCategory.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal">
                      {activeCategory.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeCategory.services.map((service) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#D4AF37] transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-[#111111]">
                              {service.name}
                            </span>
                            {service.discount && service.discount > 0 ? (
                              <span className="bg-[#111111] text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {service.discount}% OFF
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-500 font-normal">
                            {service.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="font-mono text-base font-bold text-[#111111] block">
                              {service.price}
                            </span>
                            {service.originalPrice ? (
                              <span className="font-mono text-xs text-slate-400 line-through block">
                                {service.originalPrice}
                              </span>
                            ) : null}
                          </div>
                          <button
                            onClick={() => onOpenBooking(service.name)}
                            className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-[#F8F8F6]">
                  <Image
                    src={activeCategory.image}
                    alt={activeCategory.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                      Jugnu&apos;s Saloon Signature
                    </p>
                    <h4 className="font-sans text-xl font-bold uppercase">
                      {activeCategory.title}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
