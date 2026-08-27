"use client";

import { useState } from "react";

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "923194415757";
  const defaultMessage = encodeURIComponent(
    "Hello Jugnu's Saloon! I would like to inquire about your services & appointments."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-auto select-none font-sans">
      {/* Expanded Quick Chat Popup */}
      {isOpen && (
        <div className="mb-3 w-[310px] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn transition-all duration-300">
          {/* Header */}
          <div className="bg-[#111111] p-4 text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#111111] rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white tracking-wide">Jugnu&apos;s Saloon</h4>
                <p className="text-[11px] text-emerald-400 font-medium">Online & Ready to Help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Chat Window"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body Message */}
          <div className="p-4 bg-[#F8F9FA] space-y-3">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm max-w-[85%]">
              <p className="text-xs text-slate-800 leading-relaxed">
                👋 Welcome to <strong className="font-semibold text-black">Jugnu&apos;s Saloon</strong>! How can we assist you with your beauty or appointment inquiry today?
              </p>
              <span className="text-[10px] text-slate-400 mt-1.5 block text-right">Just now</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
              </svg>
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}




      {/* Floating Round Action Button */}
      <div className="relative group">
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-sm animate-ping pointer-events-none" />

        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#20ba59] to-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 cursor-pointer"
          aria-label="Contact us on WhatsApp"
        >
          {isOpen ? (
            <svg className="w-7 h-7 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
