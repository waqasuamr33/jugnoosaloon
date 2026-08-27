"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  onOpenBooking?: () => void;
}

interface BusinessHours {
  weekday_text: string[];
  open_now: boolean | null;
  is_live: boolean;
}

export default function Footer({ onOpenBooking }: FooterProps) {
  const [hours, setHours] = useState<BusinessHours | null>(null);

  useEffect(() => {
    fetch("/api/business-hours")
      .then((r) => r.json())
      .then((data: BusinessHours) => setHours(data))
      .catch(() => setHours(null));
  }, []);
  return (
    <footer id="contact" className="bg-[#0A0A0B] border-t border-[#D4AF37]/20 pt-20 pb-12 text-slate-300">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Logo & Newsletter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-16 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <Image
                src="/logo.png"
                alt="Jugnu's Saloon Emblem"
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-sans text-2xl font-bold text-white tracking-wider">
                JUGNU&apos;S SALOON
              </h3>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                EXQUISITE BEAUTY & BRIDAL ARTISTRY
              </p>
            </div>
          </div>


        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-16 text-xs">
          {/* Column 1: Our Salon Location */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              OUR LOCATION
            </h4>
            <div className="space-y-3 font-light text-slate-400">
              <div>
                <p className="font-semibold text-white uppercase tracking-wider">
                  Jugnu&apos;s Saloon Phalia
                </p>
                <p>Phalia, Mandi Bahauddin, Punjab, Pakistan</p>
                <a
                  href="https://maps.app.goo.gl/HfbmMwJ6ugTEAmPv8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#D4AF37] font-bold hover:underline inline-block mt-1"
                >
                  View on Google Maps ↗
                </a>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#D4AF37] font-semibold text-[11px]">Opening Hours:</span>
                  {hours?.open_now === true && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                      Open
                    </span>
                  )}
                  {hours?.open_now === false && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/30 px-1.5 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-red-400" />
                      Closed
                    </span>
                  )}
                </div>
                {hours && hours.weekday_text.length > 1 ? (
                  <ul className="space-y-0.5">
                    {hours.weekday_text.map((line, i) => (
                      <li key={i} className="text-[10px] text-slate-300">{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-slate-300">
                    {hours?.weekday_text[0] ?? "Monday – Sunday: 9:00 AM – 9:00 PM"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              EXPLORE
            </h4>
            <ul className="space-y-2 font-light">
              <li>
                <Link href="/" className="hover:text-[#D4AF37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#D4AF37] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:text-[#D4AF37] transition-colors">
                  Our work
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              HELP & POLICIES
            </h4>
            <ul className="space-y-2 font-light">
              <li>
                <Link href="/booking" className="hover:text-[#D4AF37] transition-colors">
                  Online Booking Pass
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
                  About Jugnu&apos;s Saloon
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:text-[#D4AF37] transition-colors">
                  Press & Reviews
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#D4AF37]">
                  Privacy Policy & Hygiene
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[#D4AF37]">
                  Cancellation Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="space-y-4">
            <h4 className="font-sans text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
              STAY CONNECTED
            </h4>
            <div className="space-y-2 font-light text-slate-300">
              <p className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+923194415757" className="hover:text-[#D4AF37] font-semibold text-white">
                  +92 319 4415757
                </a>
                <a href="tel:+920546558633" className="hover:text-[#D4AF37] font-semibold text-white">
                  +92 054 6558633
                </a>
              </p>

              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-[#D4AF37] mt-1 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div className="flex flex-col space-y-1">
                  <a href="mailto:info@jugnussaloon.com" className="hover:text-[#D4AF37] transition-colors">
                    info@jugnussaloon.com
                  </a>
                  <a href="mailto:jugnussaloon5757@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                    jugnussaloon5757@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Official Social Media Icons */}
            <div className="flex items-center space-x-3 pt-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/jugnus_saloon_phalia/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1D] border border-white/10 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] hover:scale-110 flex items-center justify-center transition-all shadow-sm"
                title="Follow Jugnu's Saloon on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@jugnusaloonphalia"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1D] border border-white/10 hover:border-[#D4AF37] text-slate-300 hover:text-[#D4AF37] hover:scale-110 flex items-center justify-center transition-all shadow-sm"
                title="Follow Jugnu's Saloon on TikTok"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.57 6.33 6.33 0 009.33 22 6.33 6.33 0 0015.66 15.67V9.4a8.16 8.16 0 004.84 1.57v-3.53a4.85 4.85 0 01-.91-.75z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/923194415757"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1A1A1D] border border-white/10 hover:border-[#25D366] text-slate-300 hover:text-[#25D366] hover:scale-110 flex items-center justify-center transition-all shadow-sm"
                title="Chat on WhatsApp (+92 319 4415757)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Developer Credit */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-slate-400 text-xs gap-4">
          <p>© 2026 Jugnu&apos;s Saloon. All Rights Reserved.</p>
          <p className="text-[12px] font-medium text-slate-300">
            Developed by{" "}
            <a
              href="https://rapidtechpro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4AF37] hover:text-[#F3E5AB] font-bold underline underline-offset-4 transition-colors"
            >
              Rapidtechpro
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
