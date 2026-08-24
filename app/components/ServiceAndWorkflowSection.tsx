"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getServiceCategories, getServices, getProducts, normalizeImageUrl } from "../lib/api";

interface ServiceAndWorkflowSectionProps {
  onOpenBooking: (serviceName?: string) => void;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: number;
}

interface CategoryData {
  id: string;
  label: string;
  icon: string;
  headline: string;
  subline: string;
  services: ServiceItem[];
  image: string;
  fallbackImage: string;
  servicesCount?: number;
}

// Workflow Process Steps
const workflowSteps = [
  {
    num: "01",
    title: "Consultation",
    desc: "Tell us your vision — bridal, everyday glam, or a full spa day.",
  },
  {
    num: "02",
    title: "Choose Service",
    desc: "Pick from our curated menu of premium beauty treatments.",
  },
  {
    num: "03",
    title: "Book Appointment",
    desc: "Reserve your preferred slot in seconds — online or by call.",
  },
  {
    num: "04",
    title: "Experience Luxury",
    desc: "Arrive, relax, and leave looking and feeling extraordinary.",
  },
];

export default function ServiceAndWorkflowSection({
  onOpenBooking,
}: ServiceAndWorkflowSectionProps) {
  const [categoriesList, setCategoriesList] = useState<CategoryData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadApiData() {
      try {
        const [apiCategories, apiServices, apiProducts] = await Promise.all([
          getServiceCategories(),
          getServices(),
          getProducts(),
        ]);

        const hasCategories = apiCategories && apiCategories.length > 0;
        const hasServices = apiServices && apiServices.length > 0;

        const icons = ["✦", "◈", "◇", "◉", "❖", "⚜"];
        const fallbackImages = [
          "/images/bridal_makeup.png",
          "/images/beauty_facial.png",
          "/images/hair_styling.png",
          "/images/hair_washing.png",
        ];

        let updatedCategories: CategoryData[] = [];

        if (hasCategories) {
          updatedCategories = apiCategories.map((cat, idx) => {
            const matchedServices = hasServices
              ? apiServices
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
                    };
                  })
              : [];

            const fallback = fallbackImages[idx % fallbackImages.length];
            const categoryImage = (cat.image || cat.image_url)
              ? normalizeImageUrl(cat.image_url, cat.image)
              : fallback;

            return {
              id: `cat-${cat.id}`,
              label: cat.title,
              icon: icons[idx % icons.length],
              headline: cat.title,
              subline: cat.description || `Luxury ${cat.title} treatments at Jugnu's Saloon.`,
              services: matchedServices,
              image: categoryImage,
              fallbackImage: fallback,
              servicesCount: cat.services_count ?? matchedServices.length,
            };
          });
        }

        if (updatedCategories.length > 0) {
          setCategoriesList(updatedCategories);
          setActiveId(updatedCategories[0].id);
        }
      } catch (err) {
        console.error("Error populating live services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadApiData();
  }, []);

  const current = categoriesList.find((c) => c.id === activeId) || categoriesList[0];

  return (
    <section
      id="services"
      className="relative bg-[#FAFAFA] text-[#111111] overflow-hidden border-t border-slate-200"
      style={{ padding: "100px 0 120px" }}
    >
      {/* ── Background Gold Flare & Ambient Atmosphere ─────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        {/* Top-Left Radiant Gold Flare */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.05) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Bottom-Right Soft Gold Flare */}
        <div
          className="absolute -bottom-32 -right-32 w-[550px] h-[550px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,175,55,0.20) 0%, rgba(212,175,55,0.04) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        {/* Center Golden Beam */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[650px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(ellipse, rgba(212,175,55,0.10) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
        {/* Top Gold Divider Line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)",
          }}
        />
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">

        {/* ── Section Heading ──────────────────────────────────── */}
        <div className="text-center mb-16 space-y-3">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#996515]"
          >
            OUR SIGNATURE SERVICES
          </p>
          <h2
            className="font-sans font-extrabold leading-tight text-[#111111] uppercase"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
          >
            BEAUTY, BRIDAL & SPA SERVICES
          </h2>
          <div
            className="w-16 h-[3px] mx-auto rounded-full bg-[#D4AF37]"
          />
        </div>

        {/* ── Skeleton Loading State ───────────────────────────── */}
        {loading ? (
          <div className="space-y-12 animate-pulse">
            {/* Skeleton Category Tabs */}
            <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-11 w-40 bg-slate-200 rounded-lg border border-slate-300"
                />
              ))}
            </div>

            {/* Skeleton Main Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden border border-slate-200 rounded-3xl bg-white p-8 lg:p-12 shadow-xl">
              <div className="space-y-6 pr-0 lg:pr-8">
                <div className="h-8 w-64 bg-slate-200 rounded" />
                <div className="h-4 w-80 bg-slate-100 rounded" />
                <div className="space-y-4 pt-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div className="space-y-2">
                        <div className="h-4 w-48 bg-slate-200 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </div>
                      <div className="h-8 w-24 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[450px] bg-slate-100 rounded-2xl hidden lg:block" />
            </div>
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-medium">
            No active categories available at the moment.
          </div>
        ) : (
          <>
            {/* ── Category Tabs (Light Theme with Gold Accent) ────────────────── */}
            <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
              {categoriesList.map((cat) => {
                const active = cat.id === activeId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveId(cat.id)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      padding: "11px 28px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      border: active
                        ? "2px solid #D4AF37"
                        : "1.5px solid rgba(0,0,0,0.12)",
                      backgroundColor: active
                        ? "#111111"
                        : "#FFFFFF",
                      color: active ? "#D4AF37" : "#111111",
                      boxShadow: active
                        ? "0 6px 20px rgba(212,175,55,0.30)"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#996515";
                        e.currentTarget.style.borderColor = "#D4AF37";
                        e.currentTarget.style.backgroundColor = "#FFFDF7";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#111111";
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)";
                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                      }
                    }}
                  >
                    <span style={{ marginRight: "8px", color: active ? "#D4AF37" : "#996515" }}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* ── Main Panel (White Canvas & Gold Flare Glow) ──────────────────── */}
            {current && (
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden relative"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  borderRadius: "24px",
                  background: "#FFFFFF",
                  boxShadow: "0 20px 60px rgba(212,175,55,0.15), 0 10px 30px rgba(0,0,0,0.05)",
                }}
              >
                {/* Gold Flare Corner Accent */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />

                {/* LEFT — Service List */}
                <div
                  className="flex flex-col justify-between relative z-10"
                  style={{
                    padding: "44px 48px",
                    borderRight: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  {/* heading */}
                  <div className="mb-8 space-y-1">
                    <h3
                      className="font-sans font-extrabold text-[#111111] uppercase leading-snug"
                      style={{ fontSize: "clamp(1.35rem, 2.2vw, 1.75rem)" }}
                    >
                      {current.headline}
                    </h3>
                    <p
                      className="text-xs text-slate-600 font-normal leading-relaxed"
                    >
                      {current.subline}
                    </p>
                  </div>

                  {/* service rows */}
                  <div
                    className="flex-1"
                    style={{
                      borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    {current.services.map((item, idx) => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between gap-4 transition-all duration-200 hover:bg-[#FAF8F2] px-3 -mx-3 rounded-xl"
                        style={{
                          paddingTop: "16px",
                          paddingBottom: "16px",
                          borderBottom:
                            idx < current.services.length - 1
                              ? "1px solid rgba(0,0,0,0.06)"
                              : "none",
                        }}
                      >
                        {/* name + duration + discount badge */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <p
                              className="font-bold text-[#111111] text-sm leading-snug group-hover:text-[#996515] transition-colors"
                            >
                              {item.name}
                            </p>

                            {item.discount && item.discount > 0 ? (
                              <span className="bg-[#111111] text-[#D4AF37] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#D4AF37]/40 shadow-sm">
                                {item.discount}% OFF
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* price + book */}
                        <div className="flex items-center gap-5 flex-shrink-0">
                          <div className="text-right">
                            <span
                              className="font-bold font-mono text-base block text-[#996515]"
                            >
                              {item.price}
                            </span>
                            {item.originalPrice ? (
                              <span className="font-mono text-[11px] text-slate-400 line-through block">
                                {item.originalPrice}
                              </span>
                            ) : null}
                          </div>

                          <button
                            onClick={() => onOpenBooking(item.name)}
                            className="cursor-pointer transition-all duration-200"
                            style={{
                              padding: "8px 20px",
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              border: "1.5px solid #111111",
                              borderRadius: "6px",
                              background: "#111111",
                              color: "#FFFFFF",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#D4AF37";
                              e.currentTarget.style.borderColor = "#D4AF37";
                              e.currentTarget.style.color = "#111111";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,175,55,0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#111111";
                              e.currentTarget.style.borderColor = "#111111";
                              e.currentTarget.style.color = "#FFFFFF";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                            }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                    <button
                      onClick={() => onOpenBooking()}
                      className="w-full cursor-pointer font-bold uppercase tracking-widest transition-all duration-300"
                      style={{
                        padding: "16px 0",
                        fontSize: "11px",
                        borderRadius: "8px",
                        background: "#111111",
                        color: "#FFFFFF",
                        border: "2px solid #111111",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#D4AF37";
                        e.currentTarget.style.borderColor = "#D4AF37";
                        e.currentTarget.style.color = "#111111";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(212,175,55,0.35)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#111111";
                        e.currentTarget.style.borderColor = "#111111";
                        e.currentTarget.style.color = "#FFFFFF";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                      }}
                    >
                      Book a Consultation
                    </button>
                  </div>
                </div>

                {/* RIGHT — Category Hero Image & Gold Frame */}
                <div className="relative min-h-[400px] lg:min-h-[580px] overflow-hidden bg-[#F8F8F6]">
                  <Image
                    key={`${current.id}-${failedImages[current.id] ? 'fallback' : 'primary'}`}
                    src={failedImages[current.id] ? current.fallbackImage : current.image}
                    alt={current.headline}
                    fill
                    priority
                    onError={() => {
                      setFailedImages((prev) => ({ ...prev, [current.id]: true }));
                    }}
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 40%)",
                    }}
                  />

                  {/* Gold Glowing Card Overlay */}
                  <div
                    className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md bg-white/90 text-[#111111] space-y-2 shadow-xl"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#996515]">
                        Signature Treatment
                      </span>
                    </div>
                    <h4 className="font-sans text-xl font-bold uppercase text-[#111111]">
                      {current.headline}
                    </h4>
                    <p className="text-xs text-slate-600 font-normal">
                      Reserve your session with senior artists & hydrafacial experts.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Workflow Steps Sub-section ────────────────────────── */}
        <div className="mt-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#996515]"
              >
                HOW IT WORKS
              </p>
              <h3
                className="font-sans font-extrabold text-[#111111] leading-tight uppercase"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                YOUR LUXURY JOURNEY IN 4 SIMPLE STEPS
              </h3>
              <div
                className="w-16 h-[3px] rounded-full bg-[#D4AF37]"
              />
            </div>

            <button
              onClick={() => onOpenBooking()}
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
              Get a Consultation
            </button>
          </div>

          {/* steps grid */}
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
                  <span
                    className="font-mono font-extrabold text-3xl text-[#996515]"
                  >
                    {step.num}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full bg-[#D4AF37]"
                  />
                </div>

                <h4 className="font-sans font-bold text-[#111111] text-base mb-2 uppercase">
                  {step.title}
                </h4>

                <p
                  className="text-xs font-normal leading-relaxed text-slate-600"
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
