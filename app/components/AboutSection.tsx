"use client";

import Image from "next/image";

interface AboutSectionProps {
  onOpenBooking?: () => void;
}

export default function AboutSection({ onOpenBooking }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-[#FFFFFF] border-t border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Asymmetrical Images */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative items-start">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl mt-6 h-64 sm:h-80">
                <Image
                  src="/images/hair_styling.png"
                  alt="Precision Styling at Jugnu's Saloon"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl -mt-6 h-64 sm:h-80">
                <Image
                  src="/images/about-1.jpeg"
                  alt="Jugnu's Saloon Treatment"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Gold Emblem Crest Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-2xl flex items-center justify-center z-20 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Jugnu's Saloon Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase tracking-tight leading-tight">
              ELEVATE YOUR LOOK IN AN OASIS OF CALM & BEAUTY
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed font-georgia">
              <strong className="text-[#111111] font-semibold">Jugnu&apos;s Saloon</strong> is an award-winning hair & beauty salon. Our salon offers a sanctuary of calm and indulgent luxury with no limits to makeup, skin treatments, colouring, and hairdressing.
            </p>

            <p className="text-slate-500 text-sm font-normal leading-relaxed font-georgia">
              Whether working based on your inspiration or from our master imagination, you will receive a signature salon experience designed to elevate your self-esteem and highlight your best features.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-800">
              {[
                "Customized Makeup Design",
                "Certified Master Artists",
                "Organic Skincare Nutrients",
                "Private VIP Styling Rooms",
                "Precision Color Blending",
                "24K Gold Hydrafacials",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
