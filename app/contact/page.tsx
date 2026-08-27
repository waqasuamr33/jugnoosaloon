"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import NewsPress from "../components/NewsPress";
import LocationMap from "../components/LocationMap";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function ContactPage() {
  const { customer } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Bridal & Beauty Inquiry",
    message: "",
  });

  // Autofill name and phone if logged in
  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || customer.name || "",
        phone: prev.phone || customer.phone_no1 || "",
      }));
    }
  }, [customer]);

  const getWhatsAppUrl = () => {
    const formattedMessage = `Name: ${formData.name.trim()}
Gmail: ${formData.email.trim()}
Phone Num: ${formData.phone.trim() || "Not provided"}
Inquiry: ${formData.subject}
Message:
${formData.message.trim()}`;

    return `https://wa.me/923194415757?text=${encodeURIComponent(formattedMessage)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please provide your name, email, and message.");
      return;
    }

    setErrorMessage("");
    const url = getWhatsAppUrl();

    // Open WhatsApp in a new tab/app
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      <Navbar onOpenBooking={() => setBookingOpen(true)} />

      {/* Hero Header Banner */}
      <section className="relative pt-36 pb-24 bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/images/hero_salon.png"
            alt="Contact Jugnu's Saloon"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            GET IN TOUCH WITH US
          </h1>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Have questions about our bridal packages, hydrafacials, or appointments? Our beauty concierges are here to assist you.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Grid */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#F8F8F6] p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#111111] uppercase mb-2">
                SEND US A MESSAGE
              </h2>
              <div className="w-12 h-1 bg-[#D4AF37] mb-4 rounded-full" />
              <p className="text-xs text-slate-600 font-normal mb-8">
                Fill out the form below and send directly via WhatsApp to chat with our concierge instantly.
              </p>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}

              {submitted ? (
                <div className="p-8 rounded-3xl bg-white border border-[#25D366] text-center space-y-4 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#25D366] mx-auto flex items-center justify-center font-bold text-2xl shadow-sm">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                    </svg>
                  </div>
                  <h3 className="font-sans text-xl font-bold text-[#111111] uppercase">OPENED IN WHATSAPP!</h3>
                  <p className="text-xs text-slate-600 font-normal max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-black">{formData.name}</strong>. Your formatted inquiry has been prepared in WhatsApp. Simply tap send in your WhatsApp app to start chatting with our concierge.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>Re-Open WhatsApp</span>
                      <span>↗</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: customer?.name || "",
                          email: "",
                          phone: customer?.phone_no1 || "",
                          subject: "Bridal & Beauty Inquiry",
                          message: "",
                        });
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-sm"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-bold text-slate-700">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-bold text-slate-700">
                        Email Address (Gmail) *
                      </label>
                      <input
                        type="email"
                        placeholder="xyz@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-bold text-slate-700">
                        Phone Number (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs uppercase font-bold text-slate-700">
                        Inquiry Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium"
                      >
                        <option value="Bridal & Beauty Inquiry">Bridal & Beauty Inquiry</option>
                        <option value="Hair Styling & Balayage">Hair Styling & Balayage</option>
                        <option value="Skincare & Facials">Skincare & Facials</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-slate-700">
                      Your Message *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about your requested dates, bridal package preferences, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium resize-none"
                      required
                      maxLength={2000}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2.5 group"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                    </svg>
                    <span>Send Message via WhatsApp</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#FAFAFA] p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="font-sans text-xl font-extrabold uppercase text-[#111111]">
                  CONTACT INFORMATION
                </h3>
                <div className="w-10 h-0.5 bg-[#D4AF37] rounded-full" />

                <div className="space-y-5 text-xs font-normal">
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#F5E8C7] text-[#856404] flex items-center justify-center font-bold shrink-0">
                      📍
                    </div>
                    <div>
                      <p className="font-bold text-[#111111] uppercase">Jugnu&apos;s Saloon Phalia</p>
                      <p className="text-slate-600 text-xs">Phalia, Mandi Bahauddin, Punjab, Pakistan</p>
                      <a
                        href="https://maps.app.goo.gl/HfbmMwJ6ugTEAmPv8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#996515] font-bold text-xs hover:underline inline-block mt-1"
                      >
                        Open Pin in Google Maps ↗
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-9 h-9 rounded-full bg-[#F5E8C7] text-[#856404] flex items-center justify-center font-bold">
                      📞
                    </div>
                    <div>
                      <p className="font-bold text-[#111111] uppercase">Phone & WhatsApp Hotline</p>
                      <a href="tel:+923194415757" className="text-slate-700 hover:text-[#996515] font-semibold text-sm">
                        +92 319 4415757
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <div className="w-9 h-9 rounded-full bg-[#F5E8C7] text-[#856404] flex items-center justify-center font-bold">
                      ✉️
                    </div>
                    <div>
                      <p className="font-bold text-[#111111] uppercase">Email Inquiries</p>
                      <a href="mailto:info@jugnusaloon.com" className="text-slate-700 hover:text-[#996515] font-semibold">
                        info@jugnusaloon.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  <p className="font-bold text-xs text-[#111111] uppercase tracking-wider">
                    Follow Jugnu&apos;s Saloon Online
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/jugnus_saloon_phalia/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-black font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </a>

                    <a
                      href="https://www.tiktok.com/@jugnusaloonphalia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#111111] text-white hover:bg-[#D4AF37] hover:text-black font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 003 15.57 6.33 6.33 0 009.33 22 6.33 6.33 0 0015.66 15.67V9.4a8.16 8.16 0 004.84 1.57v-3.53a4.85 4.85 0 01-.91-.75z" />
                      </svg>
                      <span>TikTok</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="w-full py-3 rounded-full border-2 border-[#111111] text-[#111111] font-bold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
                  >
                    Reserve Appointment Directly
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google 5-Star Reviews & Testimonials Section */}
      <NewsPress />

      {/* Saloon Location & Interactive Google Map Section */}
      <LocationMap />

      <Footer onOpenBooking={() => setBookingOpen(true)} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </main>
  );
}
