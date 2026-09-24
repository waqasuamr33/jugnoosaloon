"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONSULT_TOPICS = [
  "Bridal Makeover",
  "Party Glam & Hair",
  "Hair Color & Balayage",
  "HydraFacial & Skin",
  "Keratin Smoothing",
  "General Advice",
];

export default function ConsultationModal({
  isOpen,
  onClose,
}: ConsultationModalProps) {
  const { customer, isAuthenticated, openAuthModal } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  // Auto-fill fields from authenticated customer session
  useEffect(() => {
    if (customer) {
      if (customer.name) setName(customer.name);
      const userPhone = customer.phone_no1 || customer.username || "";
      if (userPhone) setPhone(userPhone);
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName) {
      setError("Please enter your name or sign in to continue.");
      return;
    }

    if (!cleanPhone || cleanPhone.length < 7) {
      setError("Please enter a valid phone number so our team can reach you.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const consultReason = reason.trim() || "General beauty & styling advice";

    // Format clean professional WhatsApp message without emojis and lines
    const formattedMessage = [
      "*JUGNU'S SALOON — CONSULTATION REQUEST*",
      "",
      `*Client Name:* ${cleanName}`,
      `*Contact Phone:* ${cleanPhone}`,
      topic ? `*Topic of Interest:* ${topic}` : null,
      `*Reason for Consultation:*`,
      consultReason,
      "",
      `*Request Date:* ${todayStr}`,
      `*Location:* Phalia Branch`,
      "",
      "Hello Jugnu's Saloon team, I would like to schedule a consultation with your beauty & styling specialists. Looking forward to your guidance!",
    ]
      .filter((line) => line !== null)
      .join("\n");

    const whatsappUrl = `https://wa.me/923194415757?text=${encodeURIComponent(
      formattedMessage
    )}`;

    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop dismissal */}
      <div
        className="fixed inset-0 pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-[#FFFFFF] border border-slate-200 rounded-3xl overflow-hidden max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl z-10">
        {/* Header Ribbon */}
        <div className="bg-[#111111] text-white p-5 sm:p-7 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Consultation Form"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Jugnu's Saloon"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                JUGNU&apos;S SALOON
              </span>
            </div>
          </div>

          <h2 className="font-sans text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
            BOOK A CONSULTATION
          </h2>

          <p className="text-slate-300 text-xs mt-1 font-normal leading-relaxed">
            Get personalized advice on bridal packages, customized hair coloring, and advanced skin rejuvenation.
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {/* User Sign-In Status Callout */}
          {isAuthenticated && customer ? (
            <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#D4AF37]/40 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Auto-filled from your account:
                  </p>
                  <p className="text-xs font-bold text-[#111111] truncate">
                    {customer.name}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#996515] bg-[#D4AF37]/15 px-2.5 py-1 rounded-full border border-[#D4AF37]/30 shrink-0">
                VIP Profile
              </span>
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F2] border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Not logged in yet?</span>
                </p>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                  Sign in or create an account to auto-fill your contact details instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  openAuthModal(
                    "Sign in to auto-fill your name & contact details for consultation",
                    (loggedInCustomer) => {
                      if (loggedInCustomer.name) setName(loggedInCustomer.name);
                      const userPhone =
                        loggedInCustomer.phone_no1 ||
                        loggedInCustomer.username ||
                        "";
                      if (userPhone) setPhone(userPhone);
                    }
                  );
                }}
                className="px-4 py-2 rounded-xl bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[11px] font-extrabold uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-auto border border-[#D4AF37]/30"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <span className="text-sm">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-[#111111] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-[#F8F8F6] text-xs font-semibold text-[#111111] focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-[#111111] mb-1.5">
                WhatsApp Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0319 4415757"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-[#F8F8F6] text-xs font-semibold text-[#111111] focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            {/* Quick Topic Selector */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-700 mb-1.5">
                Consultation Topic <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CONSULT_TOPICS.map((item) => {
                  const isSelected = topic === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(isSelected ? "" : item)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#111111] text-[#D4AF37] border-[#D4AF37] shadow-xs"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#D4AF37] hover:text-[#111111]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason for Consultation Field (Optional) */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-700 mb-1.5">
                Reason for Consultation <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us what you'd like advice on (e.g. bridal makeup look, balayage tone, skin rejuvenation recommendation)..."
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-[#F8F8F6] text-xs font-normal text-[#111111] focus:bg-white focus:border-[#D4AF37] focus:outline-none transition-all resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#25D366]/25 flex items-center justify-center space-x-2.5 active:scale-[0.99] border border-white/20"
              >
                {/* Official WhatsApp Icon */}
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.341a9.946 9.946 0 004.882 1.28h.003c5.505 0 9.988-4.478 9.989-9.984 0-2.668-1.037-5.176-2.922-7.062A9.92 9.92 0 0012.012 2zm5.74 14.184c-.244.688-1.42 1.314-1.96 1.396-.505.076-1.162.107-1.874-.12-.435-.138-1.002-.324-1.74-.645-3.096-1.348-5.115-4.492-5.27-4.698-.153-.205-1.258-1.674-1.258-3.192 0-1.517.794-2.264 1.077-2.553.282-.288.614-.36.819-.36.205 0 .41.002.589.011.19.01.442-.072.693.53.256.615.872 2.128.948 2.282.077.153.128.333.026.538-.103.205-.154.333-.308.512-.154.18-.323.402-.461.54-.154.153-.314.321-.135.628.18.307.798 1.316 1.713 2.13 1.177 1.047 2.167 1.371 2.474 1.525.307.153.487.128.667-.077.179-.205.768-.897.973-1.205.205-.307.41-.256.692-.153.282.102 1.794.846 2.102 1.001.307.153.512.23.589.36.077.128.077.742-.167 1.43z" />
                </svg>
                <span>Continue on WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium">
                Direct chat with Jugnu&apos;s Saloon customer care • No waiting required
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
