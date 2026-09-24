"use client";

import Image from "next/image";
import Link from "next/link";

interface WhyChooseUsProps {
  onOpenBooking?: (serviceName?: string) => void;
}

const highlights = [
  "Well-respected and trusted reputation in luxury beauty",
  "Highly experienced team of certified master stylists",
  "Outstanding artistry and exceptional service for every client",
  "Private VIP suites & personalised bridal consultations",
];

export default function WhyChooseUs({ onOpenBooking }: WhyChooseUsProps) {
  return (
    <section id="why-us" className="py-20 bg-[#FFFFFF] relative overflow-hidden">
      {/* Subtle gold bloom */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT: Image card with overlay heading ── */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl group" style={{ minHeight: "480px" }}>
            <Image
              src="/images/22.jpeg"
              alt="Diverse Styling at Jugnu's Saloon"
              fill
              className="object-cover scale-110 -translate-x-5 group-hover:scale-115 transition-transform duration-700"
              style={{ objectPosition: "60% center" }}
            />

            {/* Dark gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(10,10,10,0.50) 0%, rgba(10,10,10,0.72) 55%, rgba(10,10,10,0.92) 100%)",
              }}
            />

            {/* Subtle gold inner border */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.25)" }}
            />

            {/* Text overlay — anchored to bottom */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-10">
              <div className="w-10 h-[2px] mb-5" style={{ backgroundColor: "#D4AF37" }} />

              <h2
                className="font-sans font-extrabold text-white uppercase leading-tight mb-4"
                style={{ fontSize: "clamp(2rem, 3.2vw, 2.8rem)", letterSpacing: "-0.01em" }}
              >
                Diverse<br />
                <span style={{ color: "#D4AF37" }}>Styling</span>
              </h2>

              <p className="font-georgia text-white/75 text-sm sm:text-[15px] leading-relaxed max-w-sm">
                The ethos of Jugnu&apos;s Saloon is to provide a haven of indulgent satisfaction — a place to soothe the mind, the body and soul.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Content ── */}
          <div className="flex flex-col justify-center space-y-7">

            {/* Description */}
            <p className="font-georgia text-slate-700 text-base sm:text-[17px] leading-relaxed">
              Jugnu&apos;s Saloon is a full-service beauty salon dedicated to providing high customer satisfaction through excellent services. Our beauty and hair salon is a top-of-the-line brand, and has become one of the biggest luxury salon names in the region.
            </p>

            {/* Gold checkmark bullet list */}
            <ul className="space-y-4">
              {highlights.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.50)" }}
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#D4AF37" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-[#111111] text-sm font-medium leading-snug">{point}</span>
                </li>
              ))}
            </ul>

            {/* Thin divider */}
            <div className="w-full h-px bg-slate-200" />

            {/* Italic pull-quote */}
            <p className="font-georgia text-slate-500 text-sm leading-relaxed italic">
              &ldquo;Whilst at the leading edge of trends and artistry, Jugnu&apos;s Saloon prides itself on listening and satisfying clients — creating effortless, wearable beauty with creative flair that never goes out of style.&rdquo;
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/services"
                className="cursor-pointer inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.18em] transition-all"
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  padding: "14px 32px",
                  borderRadius: "3px",
                  border: "2px solid #111111",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D4AF37";
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.color = "#111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#111111";
                  e.currentTarget.style.borderColor = "#111111";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
              >
                Book an Appointment
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


