"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroProps {
  onOpenBooking: () => void;
}

const slides = [
  {
    id: 1,
    titleLine1: "WHERE BEAUTY",
    titleLine2: "MEETS ARTISTRY",
    desc: "We're a full-service beauty saloon dedicated to helping you look and feel your best.",
    image: "/images/hero_salon.png",
    alt: "Jugnu's Saloon luxury interior",
    objectPosition: "center center",
  },
  {
    id: 2,
    titleLine1: "ROYAL BRIDAL",
    titleLine2: "TRANSFORMATIONS",
    desc: "Step into your dream bridal look with airbrush precision, glowing complexion sculpting, and traditional draping excellence.",
    image: "/images/hero-1.jpeg",
    mobileImage: "/images/hero-m.jpeg",
    alt: "Royal HD Airbrush Bridal Makeup",
    objectPosition: "center top",
    mobileObjectPosition: "center 45px",
  },
  {
    id: 3,
    titleLine1: "PROFESSIONAL",
    titleLine2: "AESTHETIC LOUNGE",
    desc: "Where you reveal the best version of you with signature skin therapy, custom aesthetic care & organic radiance rituals.",
    image: "/images/hero-3.png",
    alt: "Professional Aesthetic Lounge at Jugnu's Saloon",
    objectPosition: "center center",
  },
];

export default function Hero({ onOpenBooking }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rating, setRating] = useState<number | null>(null);

  // Automatic slide transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live Google rating dynamically
  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await fetch("/api/google-reviews");
        if (res.ok) {
          const json = await res.json();
          if (typeof json.rating === "number") {
            setRating(json.rating);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Google rating for Hero component:", err);
      }
    }
    fetchRating();
  }, []);

  const slide = slides[currentSlide];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0B] text-white"
    >
      {/* ── Background Carousel Images ── */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          {/* Desktop Image */}
          <Image
            src={s.image}
            alt={s.alt}
            fill
            priority={index === 0}
            className={`object-cover ${s.mobileImage ? "hidden sm:block" : ""}`}
            style={{ objectPosition: s.objectPosition || "center center" }}
          />

          {/* Mobile Specific Image */}
          {s.mobileImage && (
            <Image
              src={s.mobileImage}
              alt={s.alt}
              fill
              className="object-cover block sm:hidden"
              style={{ objectPosition: s.mobileObjectPosition || "center 60px" }}
            />
          )}

          {/* Heavy Dark Left Gradient: Prevents text-image collision */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.75) 45%, rgba(10,10,11,0.40) 80%, rgba(10,10,11,0.25) 100%)",
            }}
          />

          {/* Top & Bottom Shading */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,11,0.60) 0%, transparent 25%, transparent 75%, rgba(10,10,11,0.80) 100%)",
            }}
          />

          {/* Golden Ambient Glare Accent */}
          <div
            className="absolute -top-24 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-30"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>
      ))}

      {/* ── Foreground Content ── */}
      <div className="max-w-[1480px] mx-auto px-5 sm:px-10 lg:px-16 w-full relative z-10 pt-28 pb-20">
        <div className="max-w-2xl lg:max-w-3xl space-y-6">

          {/* Main Headline */}
          <h1 className="font-sans font-extrabold leading-[1.08] text-white uppercase tracking-tight text-[1.85rem] sm:text-[clamp(2.5rem,5vw,4.75rem)]">
            {slide.titleLine1}
            <br />
            <span className="text-[#D4AF37] drop-shadow-md">{slide.titleLine2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed font-normal max-w-lg">
            {slide.desc}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 cursor-pointer shadow-lg shadow-[#D4AF37]/20 border-2 border-[#D4AF37]"
            >
              Book Appointment
            </button>

            <a
              href="tel:+923194415757"
              className="px-5 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-black/50 border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-black/70 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <svg
                className="w-4 h-4 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+92 319 4415757</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 border-t border-white/15 flex items-center space-x-8">
            <div>
              <p className="text-2xl font-extrabold text-white">30K+</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                Happy Clients
              </p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="text-2xl font-extrabold text-white">
                {rating !== null ? rating.toFixed(1) : "5.0"} ★
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                Google Rating
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Slide Representing Three Dots at Exact Bottom Center ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-xl">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-500 cursor-pointer ${idx === currentSlide
              ? "w-8 h-2.5 bg-[#D4AF37] rounded-full shadow-md shadow-[#D4AF37]/30"
              : "w-2.5 h-2.5 bg-white/40 hover:bg-white/80 rounded-full"
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
