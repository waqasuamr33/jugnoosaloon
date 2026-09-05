import React from "react";

interface PageHeroProps {
  title: string;
  subtitle: string;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative pt-36 pb-24 bg-[#0A0A0B] text-white overflow-hidden border-b border-[#D4AF37]/25">
      {/* Golden Light Ray & Ambient Flare Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Intense Golden Light Source Origin on Top-Left */}
        <div
          className="absolute -top-16 -left-16 w-72 h-72 sm:w-88 sm:h-88 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 250, 225, 0.95) 0%, rgba(245, 215, 110, 0.7) 25%, rgba(212, 175, 55, 0.3) 55%, transparent 75%)",
            filter: "blur(18px)",
          }}
        />

        {/* Primary Radiant Golden Light Ray Beam cutting diagonally across from the side */}
        <div
          className="absolute -top-24 -left-12 w-[900px] sm:w-[1400px] h-[220px] sm:h-[320px] -rotate-[24deg] origin-top-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(255, 245, 195, 0.8) 0%, rgba(212, 175, 55, 0.45) 30%, rgba(212, 175, 55, 0.12) 65%, transparent 100%)",
            filter: "blur(26px)",
          }}
        />

        {/* Secondary Sharper Light Beam Streak */}
        <div
          className="absolute -top-8 -left-8 w-[700px] sm:w-[1100px] h-[100px] sm:h-[150px] -rotate-[34deg] origin-top-left opacity-80"
          style={{
            background:
              "linear-gradient(90deg, rgba(255, 250, 210, 0.75) 0%, rgba(245, 215, 110, 0.35) 40%, rgba(212, 175, 55, 0.08) 75%, transparent 100%)",
            filter: "blur(16px)",
          }}
        />

        {/* Atmospheric Golden Mist & Volumetric Light Spread */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[1000px] sm:w-[1500px] h-[500px] -rotate-[20deg]"
          style={{
            background:
              "radial-gradient(ellipse at 12% 25%, rgba(212, 175, 55, 0.35) 0%, rgba(180, 130, 20, 0.12) 40%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />

        {/* Soft Warm Ambient Glow on bottom-right for balanced luxury lighting */}
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        {/* Delicate Top & Bottom Golden Accent Lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-[#D4AF37]/70 via-[#D4AF37]/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {title}
        </h1>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full shadow-[0_0_12px_rgba(212,175,55,0.7)]" />
        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
