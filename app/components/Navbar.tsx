"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenBooking?: (serviceName?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { customer, isAuthenticated, logout, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Our work", href: "/our-work" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md py-3 border-b border-slate-200 shadow-sm"
          : "bg-white py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#D4AF37] p-0.5 group-hover:scale-105 transition-transform bg-white">
            <Image
              src="/logo.png"
              alt="Jugnu's Saloon Logo"
              width={44}
              height={44}
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-lg sm:text-xl font-bold tracking-tight text-[#111111] group-hover:text-[#D4AF37] transition-colors">
              JUGNU&apos;S
            </span>
            <span className="text-[9px] tracking-[0.25em] text-[#996515] uppercase font-bold">
              SALOON
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-slate-800">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? "text-[#996515] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#D4AF37]"
                    : "hover:text-[#D4AF37] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Phone Call Link */}
          <a
            href="tel:+923194415757"
            className="text-xs tracking-wider uppercase text-slate-800 hover:text-[#996515] font-bold px-2 py-2 flex items-center space-x-1.5 transition-colors"
            title="Call Jugnu's Saloon at +92 319 4415757"
          >
            <svg
              className="w-3.5 h-3.5 text-[#D4AF37]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>+92 319 4415757</span>
          </a>

          {/* Customer Auth Button / Profile Menu */}
          {isAuthenticated && customer ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAFAFA] hover:bg-[#F5E8C7]/30 transition-all text-xs font-bold text-[#111111]"
              >
                <span className="w-6 h-6 rounded-full bg-[#111111] text-[#D4AF37] text-[10px] flex items-center justify-center font-bold uppercase">
                  {customer.name.charAt(0)}
                </span>
                <span className="max-w-[100px] truncate">{customer.name}</span>
                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <p className="text-xs font-bold text-[#111111] truncate">{customer.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">@{customer.username}</p>
                    {customer.card_type && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-[#F5E8C7] text-[#856404]">
                        {customer.card_type} Member
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("Sign in to manage bookings and VIP salon perks")}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#111111] border border-slate-300 hover:border-[#D4AF37] hover:bg-[#FAFAFA] transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}

          {onOpenBooking ? (
            <button
              onClick={() => onOpenBooking()}
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Book Online
            </button>
          ) : (
            <Link
              href="/booking"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D4AF37] hover:text-black transition-all shadow-md active:scale-95 text-center"
            >
              Book Online
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal("Sign in to book")}
              className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase text-[#111111] border border-slate-300"
            >
              Sign In
            </button>
          )}

          {onOpenBooking ? (
            <button
              onClick={() => onOpenBooking()}
              className="sm:hidden px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-[#111111]"
            >
              Book
            </button>
          ) : (
            <Link
              href="/booking"
              className="sm:hidden px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white bg-[#111111]"
            >
              Book
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 hover:text-[#D4AF37] focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {isAuthenticated && customer && (
            <div className="p-3 mb-2 rounded-2xl bg-[#F8F8F6] border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#111111]">{customer.name}</p>
                <p className="text-[10px] text-slate-500">@{customer.username}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-bold text-red-600 uppercase"
              >
                Log Out
              </button>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-bold tracking-widest uppercase text-slate-800 hover:text-[#D4AF37] border-b border-slate-100"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            {onOpenBooking ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider text-white bg-[#111111]"
              >
                Book Appointment Now
              </button>
            ) : (
              <Link
                href="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider text-white bg-[#111111]"
              >
                Book Appointment Now
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

