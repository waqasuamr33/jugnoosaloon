"use client";

export default function LocationMap() {
  const mapLink = "https://maps.app.goo.gl/HfbmMwJ6ugTEAmPv8";
  const embedUrl =
    "https://maps.google.com/maps?q=Jugnu+Saloon+Phalia&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="location-map" className="py-20 bg-[#FAFAFA] border-t border-slate-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - STRICT DESIGN RULE: NO PILL TAGS OVER HEADINGS */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111111] uppercase tracking-tight">
            VISIT OUR SALOON IN PHALIA
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal font-georgia">
            Find our exact location on Google Maps and experience luxury bridal & salon artistry in person.
          </p>
        </div>

        {/* Map & Location Card Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Google Map Box (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-3 shadow-sm overflow-hidden flex flex-col min-h-[380px] sm:min-h-[440px] relative group">
            <iframe
              title="Jugnu's Saloon Phalia Google Maps Location"
              src={embedUrl}
              className="w-full h-full min-h-[360px] sm:min-h-[420px] rounded-2xl border-0"
              loading="lazy"
              allowFullScreen
            />
            {/* Quick Map Link Bar */}
            <div className="mt-3 flex items-center justify-between px-3 py-2 bg-[#FAFAFA] rounded-xl text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Jugnu&apos;s Saloon Phalia
              </span>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#996515] font-bold hover:underline flex items-center gap-1"
              >
                Open in Full Google Maps ↗
              </a>
            </div>
          </div>

          {/* Location Info & Hours Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-[#111111] text-white rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/30 shadow-md flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Title & Badge */}
              <div className="border-b border-white/10 pb-6 space-y-2">
                <h3 className="font-sans text-2xl font-extrabold tracking-tight text-white uppercase">
                  JUGNU&apos;S SALOON PHALIA
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                  Premier Beauty, Spa & Bridal Lounge
                </p>
              </div>

              {/* Address Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Salon Location</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    Phalia, Mandi Bahauddin, Punjab, Pakistan
                  </p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] text-[#D4AF37] hover:underline font-bold mt-1"
                  >
                    View Exact Pin on Google Maps &rarr;
                  </a>
                </div>
              </div>

              {/* Phone & WhatsApp Item */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Phone & Appointments</h4>
                  <a
                    href="tel:+923194415757"
                    className="text-base font-extrabold text-[#D4AF37] hover:underline block mt-0.5"
                  >
                    +92 319 4415757
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1D] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-400">Working Hours</h4>
                  <p className="text-xs font-semibold text-slate-200 mt-0.5">
                    Monday – Sunday: 9:00 AM – 9:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-6 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest text-center hover:bg-[#F3E5AB] transition-all shadow-sm"
              >
                Get Directions ↗
              </a>
              <a
                href="https://wa.me/923194415757"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest text-center hover:bg-emerald-600 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
