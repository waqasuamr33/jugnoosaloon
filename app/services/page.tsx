"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import PageHero from "../components/PageHero";
import {
  getServices,
  getServiceCategories,
  normalizeImageUrl,
  ServiceItem,
  ServiceCategoryItem,
} from "../lib/api";

const SALON_FALLBACK_IMAGES = [
  "/images/hair_styling.png",
  "/images/hero_salon.png",
  "/images/hair_washing.png",
  "/images/hair_products.png",
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Multi-service selection for booking
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  // Track expanded descriptions per service card
  const [expandedDescIds, setExpandedDescIds] = useState<Record<number, boolean>>({});

  const toggleExpandDesc = (serviceId: number) => {
    setExpandedDescIds((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // Booking modal controls
  const [bookingOpen, setBookingOpen] = useState<boolean>(false);
  const [selectedSingleService, setSelectedSingleService] = useState<string>("");
  const [selectedServiceIdsForModal, setSelectedServiceIdsForModal] = useState<number[]>([]);

  useEffect(() => {
    async function loadCatalogData() {
      try {
        setLoading(true);
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getServiceCategories(),
        ]);

        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      } catch (err) {
        console.error("Failed to load services catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogData();
  }, []);

  // Category Tabs assembly with live counts
  const totalCount = services.length;
  const categoryTabs = useMemo(() => {
    const tabs: { id: string; title: string; count: number }[] = [
      { id: "all", title: "All Treatments", count: totalCount },
    ];

    categories.forEach((cat) => {
      const count = services.filter(
        (s) =>
          s.category?.id === cat.id ||
          s.category?.title?.toLowerCase() === cat.title.toLowerCase()
      ).length;

      tabs.push({
        id: String(cat.id),
        title: cat.title,
        count,
      });
    });

    return tabs;
  }, [categories, services, totalCount]);

  // Filter services by active category and search
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      let matchesCategory = true;
      if (selectedCategory !== "all") {
        matchesCategory =
          String(service.category?.id) === selectedCategory ||
          service.category?.title?.toLowerCase() ===
            categories
              .find((c) => String(c.id) === selectedCategory)
              ?.title.toLowerCase();
      }

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        service.title.toLowerCase().includes(q) ||
        Boolean(service.description && service.description.toLowerCase().includes(q)) ||
        Boolean(service.category?.title && service.category.title.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery, categories]);

  // Toggle single service selection
  const toggleServiceSelection = (serviceId: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Clear all selected services
  const clearSelection = () => {
    setSelectedServiceIds([]);
  };

  // Computed summary for multi-booking
  const selectedServicesList = useMemo(() => {
    return services.filter((s) => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  const totalSelectedPrice = useMemo(() => {
    return selectedServicesList.reduce((sum, item) => {
      const price = item.discounted_price || item.price;
      return sum + (price || 0);
    }, 0);
  }, [selectedServicesList]);

  // Open booking modal with multiple selected services
  const handleBookMultiple = () => {
    if (selectedServiceIds.length === 0) return;
    setSelectedServiceIdsForModal(selectedServiceIds);
    setSelectedSingleService("");
    setBookingOpen(true);
  };

  // Open booking modal for a single treatment directly
  const handleBookSingle = (service: ServiceItem) => {
    setSelectedServiceIdsForModal([service.id]);
    setSelectedSingleService(service.title);
    setBookingOpen(true);
  };

  // Workflow steps
  const workflowSteps = [
    {
      num: "01",
      title: "Select Treatments",
      desc: "Choose single or multiple treatments from our luxury menu below.",
    },
    {
      num: "02",
      title: "Pick Preferred Slot",
      desc: "Select your desired date, time slot, and preferred artist.",
    },
    {
      num: "03",
      title: "Instant Confirmation",
      desc: "Receive immediate booking confirmation and appointment details.",
    },
    {
      num: "04",
      title: "Experience Luxury",
      desc: "Step into our VIP lounge and enjoy a tailored transformation.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      {/* Navigation Header */}
      <Navbar onOpenBooking={() => handleBookMultiple()} />

      {/* Hero Header Banner */}
      <PageHero
        title="BEAUTY & BRIDAL SERVICES MENU"
        subtitle="Explore our comprehensive menu of bridal makeovers, advanced hydrafacials, couture hair styling, and restorative spa rituals. Select multiple treatments to book your complete luxury package at once."
      />

      {/* Main Content & Services Catalog */}
      <section className="py-8 sm:py-20 bg-[#FFFFFF]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Counter Toolbar (matching Products Page) */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#F8F8F6] border border-slate-200 shadow-sm">
            <div className="w-full sm:w-96">
              <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                Search Treatments
              </label>
              <input
                type="text"
                placeholder="Search by name e.g. HydraFacial, Balayage, Bridal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium transition-colors"
              />
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold flex-wrap">
              {selectedServiceIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="bg-[#111111] text-[#D4AF37] text-[11px] font-bold px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
                    {selectedServiceIds.length} Selected
                  </span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-[11px] text-slate-500 hover:text-[#111111] underline cursor-pointer font-bold"
                  >
                    Deselect All
                  </button>
                </div>
              )}
              <div>
                Showing <strong className="text-[#111111]">{filteredServices.length}</strong> of {totalCount} treatments
              </div>
            </div>
          </div>

          {/* Luxury Category Filter Tabs */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#111111] flex items-center gap-2">
                <span className="text-[#996515]">✦</span> Filter by Treatment Category
              </span>
              {(selectedCategory !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="text-xs font-bold text-[#996515] hover:text-[#111111] transition-colors cursor-pointer underline underline-offset-4"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
              {categoryTabs.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className="flex-shrink-0 cursor-pointer transition-all duration-300 flex items-center space-x-2.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm group"
                    style={{
                      border: active ? "2px solid #D4AF37" : "1.5px solid rgba(0,0,0,0.12)",
                      backgroundColor: active ? "#111111" : "#FFFFFF",
                      color: active ? "#D4AF37" : "#111111",
                      boxShadow: active
                        ? "0 6px 18px rgba(212,175,55,0.25)"
                        : "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span>{cat.title}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors"
                      style={{
                        backgroundColor: active ? "rgba(212,175,55,0.2)" : "#F1F1EF",
                        color: active ? "#D4AF37" : "#666666",
                      }}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skeleton Loading State or Services Cards Grid */}
          {loading ? (
            <>
              {/* Mobile Skeleton: List layout (4 items) */}
              <div className="sm:hidden flex flex-col gap-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`mob-skel-${i}`}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                      <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                      <div className="h-4 w-20 bg-slate-200 rounded pt-1" />
                    </div>
                    <div className="w-22 h-22 rounded-2xl bg-slate-100 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Desktop Skeleton: Grid layout */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={`desk-skel-${i}`}
                    className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm"
                  >
                    <div className="w-full h-64 rounded-2xl bg-slate-100" />
                    <div className="h-5 w-3/4 bg-slate-200 rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                    <div className="h-12 w-full bg-slate-200 rounded-xl pt-4" />
                  </div>
                ))}
              </div>
            </>
          ) : filteredServices.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F8F8F6] border border-slate-200 flex items-center justify-center text-2xl text-[#996515]">
                ◇
              </div>
              <p className="text-slate-600 font-medium">
                No treatments found{" "}
                {selectedCategory !== "all" ? "in this category" : ""}{" "}
                {searchQuery ? `matching "${searchQuery}"` : ""}.
              </p>
              {(selectedCategory !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── MOBILE VIEW: Sleek Luxury List Layout (~4 cards visible at once, matching reference) ── */}
              <div className="sm:hidden flex flex-col gap-3">
                {filteredServices.map((service, idx) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  const hasDiscount = Boolean(
                    service.discount &&
                      service.discount > 0 &&
                      service.discounted_price &&
                      service.discounted_price < service.price
                  );
                  const displayPrice = hasDiscount
                    ? service.discounted_price
                    : service.price;

                  const fallbackImg =
                    SALON_FALLBACK_IMAGES[idx % SALON_FALLBACK_IMAGES.length];
                  const rawImg = service.image_url ? normalizeImageUrl(service.image_url) : null;
                  const imageSrc =
                    rawImg && !failedImages[service.id] ? rawImg : fallbackImg;

                  const descText =
                    service.description && service.description.trim().length > 0
                      ? service.description
                      : "Luxury salon treatment tailored by Jugnu's senior beauticians.";

                  return (
                    <div
                      key={`mobile-${service.id}`}
                      className={`bg-white rounded-2xl border p-3.5 flex items-center justify-between gap-3 shadow-xs transition-all duration-200 relative group cursor-pointer ${
                        isSelected
                          ? "border-[#D4AF37] ring-1.5 ring-[#D4AF37]/70 shadow-[0_4px_16px_rgba(212,175,55,0.18)] bg-[#FAF8F2]/40"
                          : "border-slate-200/90 hover:border-[#D4AF37]/50 active:scale-[0.99]"
                      }`}
                      onClick={() => toggleServiceSelection(service.id)}
                    >
                      {/* Left Column: Details & Pricing */}
                      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between self-stretch py-0.5">
                        <div>
                          {/* Category Pill */}
                          {service.category?.title && (
                            <div className="mb-1">
                              <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#996515] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20 inline-block">
                                {service.category.title}
                              </span>
                            </div>
                          )}

                          {/* Service Title */}
                          <h3 className="font-sans font-bold text-sm text-[#111111] leading-snug line-clamp-2 mb-1 group-hover:text-[#996515] transition-colors">
                            {service.title}
                          </h3>

                          {/* Brief description snippet */}
                          <p className="text-[11px] text-slate-500 font-normal leading-tight line-clamp-1 mb-2">
                            {descText}
                          </p>
                        </div>

                        {/* Price & Book Solo Action */}
                        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            {hasDiscount && (
                              <span className="font-sans text-[11px] text-slate-400 line-through">
                                Rs. {service.price.toLocaleString()}
                              </span>
                            )}
                            <span className="font-sans text-sm sm:text-base font-extrabold text-[#111111]">
                              Rs. {displayPrice?.toLocaleString()}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookSingle(service);
                            }}
                            className="text-[10px] font-extrabold uppercase tracking-wider text-[#111111] bg-slate-100 hover:bg-[#111111] hover:text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer border border-slate-200 shrink-0"
                          >
                            Book Solo
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Square Image + Discount Badge + Floating Plus/Check Button */}
                      <div className="relative shrink-0 w-22 h-22 sm:w-24 sm:h-24">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#F8F8F6] border border-slate-200/80 shadow-xs">
                          <Image
                            src={imageSrc}
                            alt={service.title}
                            fill
                            sizes="96px"
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [service.id]: true }));
                            }}
                            className="object-cover"
                          />

                          {/* Discount Badge */}
                          {hasDiscount && (
                            <div className="absolute top-1.5 left-1.5 bg-[#111111] text-[#D4AF37] text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-[#D4AF37]/50 shadow-xs z-10">
                              {service.discount}% OFF
                            </div>
                          )}
                        </div>

                        {/* Floating Action Button (+ or checkmark) at bottom-right corner */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleServiceSelection(service.id);
                          }}
                          className={`absolute -bottom-1.5 -right-1.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md border-2 border-white ${
                            isSelected
                              ? "bg-[#D4AF37] text-black scale-105 shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
                              : "bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:scale-105"
                          }`}
                          aria-label={isSelected ? "Remove treatment from booking" : "Add treatment to booking"}
                          title={isSelected ? "Remove from selected package" : "Add to booking package"}
                        >
                          {isSelected ? (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── DESKTOP VIEW: High-End Luxury Cards Grid ── */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredServices.map((service, idx) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  const hasDiscount = Boolean(
                    service.discount &&
                      service.discount > 0 &&
                      service.discounted_price &&
                      service.discounted_price < service.price
                  );
                  const displayPrice = hasDiscount
                    ? service.discounted_price
                    : service.price;

                  // Image fallback resolution
                  const fallbackImg =
                    SALON_FALLBACK_IMAGES[idx % SALON_FALLBACK_IMAGES.length];
                  const rawImg = service.image_url ? normalizeImageUrl(service.image_url) : null;
                  const imageSrc =
                    rawImg && !failedImages[service.id] ? rawImg : fallbackImg;
                  const isDescExpanded = Boolean(expandedDescIds[service.id]);
                  const descText =
                    service.description && service.description.trim().length > 0
                      ? service.description
                      : "Luxury salon treatment tailored by Jugnu's senior beauticians.";
                  const isLongDesc = descText.length > 70 || descText.includes("\n");

                  return (
                    <div
                      key={`desktop-${service.id}`}
                      className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-sm transition-all duration-300 relative group cursor-pointer ${
                        isSelected
                          ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/60 shadow-[0_12px_32px_rgba(212,175,55,0.22)] bg-[#FAF8F2]/30"
                          : "border-slate-200 hover:shadow-xl hover:border-[#D4AF37]"
                      }`}
                      onClick={() => toggleServiceSelection(service.id)}
                    >
                      <div>
                        {/* Image Frame */}
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#F8F8F6] mb-6 flex items-center justify-center">
                          <Image
                            src={imageSrc}
                            alt={service.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [service.id]: true }));
                            }}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Gradient Shadow for Badge Contrast */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30 pointer-events-none" />

                          {/* Discount Badge */}
                          {hasDiscount && (
                            <div className="absolute top-3 left-3 bg-[#111111] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm z-10">
                              {service.discount}% OFF
                            </div>
                          )}

                          {/* Multi-Select Toggle Checkbox (Top-Right of Image) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleServiceSelection(service.id);
                            }}
                            className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md ${
                              isSelected
                                ? "bg-[#D4AF37] text-black border-2 border-white scale-105"
                                : "bg-white/85 text-slate-700 hover:bg-white border border-slate-300 hover:border-[#D4AF37]"
                            }`}
                            aria-label={isSelected ? "Deselect treatment" : "Select treatment"}
                            title={isSelected ? "Remove from selected package" : "Add to booking package"}
                          >
                            {isSelected ? (
                              <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </button>

                          {/* Selected overlay pill at bottom of image if chosen */}
                          {isSelected && (
                            <div className="absolute bottom-3 left-3 right-3 bg-[#111111]/90 backdrop-blur-xs text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-xl text-center border border-[#D4AF37]/50 shadow-sm z-10 flex items-center justify-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                              <span>Included in Booking</span>
                            </div>
                          )}
                        </div>

                        {/* Category Tag */}
                        <div className="mb-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#996515] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/25 inline-block">
                            {service.category?.title || "Signature Treatment"}
                          </span>
                        </div>

                        {/* Service Title */}
                        <h3 className="font-sans font-bold text-lg text-[#111111] line-clamp-2 mb-2 group-hover:text-[#996515] transition-colors">
                          {service.title}
                        </h3>

                        {/* Description with Read More / Read Less */}
                        <div className="mb-4">
                          <p
                            className={`text-xs font-normal leading-relaxed whitespace-pre-line transition-all duration-200 ${
                              isDescExpanded ? "text-slate-700" : "text-slate-500 line-clamp-2"
                            }`}
                          >
                            {descText}
                          </p>
                          {isLongDesc && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandDesc(service.id);
                              }}
                              className="mt-1.5 text-[11px] font-bold text-[#996515] hover:text-[#111111] transition-colors cursor-pointer inline-flex items-center gap-1 focus:outline-none"
                            >
                              <span>{isDescExpanded ? "Read Less" : "Read More"}</span>
                              <span className="text-[8px] leading-none transition-transform duration-200">
                                {isDescExpanded ? "▲" : "▼"}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-2 space-y-3.5">
                        {/* Pricing */}
                        <div className="flex items-baseline space-x-3">
                          <span className="font-sans text-2xl font-extrabold text-[#111111]">
                            Rs. {displayPrice?.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="font-sans text-sm text-slate-400 line-through">
                              Rs. {service.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Primary Action: Toggle Selection / Book */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleServiceSelection(service.id);
                            }}
                            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 ${
                              isSelected
                                ? "bg-[#D4AF37] text-black hover:bg-[#c29d2b] shadow-[0_4px_14px_rgba(212,175,55,0.4)]"
                                : "bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-black"
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Selected for Booking</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add to Booking</span>
                              </>
                            )}
                          </button>

                          {/* Secondary Action: Book Solo Treatment (WhatsApp removed) */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookSingle(service);
                              }}
                              className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[#111111] font-bold text-[11px] uppercase tracking-wider hover:bg-[#111111] hover:text-[#D4AF37] hover:border-[#111111] transition-all cursor-pointer text-center"
                            >
                              Book Single Treatment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Workflow Steps Sub-section ────────────────────────── */}
      <section className="py-24 bg-[#FAFAFA] border-t border-slate-200">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#996515]">
                HOW IT WORKS
              </p>
              <h3
                className="font-sans font-extrabold text-[#111111] leading-tight uppercase"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                YOUR LUXURY JOURNEY IN 4 SIMPLE STEPS
              </h3>
              <div className="w-16 h-[3px] rounded-full bg-[#D4AF37]" />
            </div>

            <button
              onClick={() => handleBookMultiple()}
              className="self-start md:self-auto cursor-pointer text-xs font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                padding: "14px 28px",
                borderRadius: "6px",
                border: "2px solid #111111",
                color: "#FFFFFF",
                background: "#111111",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D4AF37";
                e.currentTarget.style.color = "#111111";
                e.currentTarget.style.borderColor = "#D4AF37";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(212,175,55,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#111111";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.borderColor = "#111111";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.1)";
              }}
            >
              Book Appointments
            </button>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={step.num}
                className="relative group transition-all duration-300 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-[#D4AF37] hover:shadow-xl"
              >
                {idx < workflowSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-[52px] right-0 w-4 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(212,175,55,0.5), transparent)",
                      transform: "translateX(100%)",
                      zIndex: 1,
                    }}
                  />
                )}

                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono font-extrabold text-3xl text-[#996515]">
                    {step.num}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>

                <h4 className="font-sans font-bold text-[#111111] text-base mb-2 uppercase">
                  {step.title}
                </h4>

                <p className="text-xs font-normal leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating Sticky Multi-Service Booking Dock ────────────────────────── */}
      {selectedServiceIds.length > 0 && (
        <aside
          aria-label="Selected treatments dock"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl bg-[#111111]/95 backdrop-blur-md border-2 border-[#D4AF37] text-white shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_35px_rgba(212,175,55,0.35)] rounded-3xl p-4 sm:p-5 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Summary and tags */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 w-full md:w-auto text-center sm:text-left">
              <div className="flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse" />
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#D4AF37] block">
                    {selectedServiceIds.length} {selectedServiceIds.length === 1 ? "Treatment" : "Treatments"} Selected
                  </span>
                  <span className="font-sans text-lg font-black text-white">
                    Est. Total: Rs. {totalSelectedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Selected chips previews (scrollable on mobile) */}
              <div className="hidden lg:flex items-center gap-1.5 max-w-sm overflow-x-auto py-1 scrollbar-none">
                {selectedServicesList.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 bg-white/10 text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10"
                  >
                    <span className="truncate max-w-[100px]">{item.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleServiceSelection(item.id);
                      }}
                      className="hover:text-[#D4AF37] cursor-pointer ml-0.5"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {selectedServicesList.length > 3 && (
                  <span className="text-[10px] text-[#D4AF37] font-bold px-1 whitespace-nowrap">
                    +{selectedServicesList.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer uppercase tracking-wider px-3 py-2"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleBookMultiple}
                className="flex-1 md:flex-initial cursor-pointer py-3.5 px-6 sm:px-8 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#e2bd44] transition-all shadow-[0_4px_18px_rgba(212,175,55,0.4)] flex items-center justify-center space-x-2"
              >
                <span>Book Selected ({selectedServiceIds.length})</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Footer */}
      <Footer onOpenBooking={() => handleBookMultiple()} />

      {/* Interactive Booking Drawer / Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={selectedSingleService}
        initialServices={selectedServiceIdsForModal}
      />
    </main>
  );
}
