"use client";

import Link from "next/link";

interface HowItWorksProps {
  onOpenBooking?: () => void;
}

export default function HowItWorks({ onOpenBooking }: HowItWorksProps) {
  const steps = [
    {
      num: "1",
      title: "Consultation",
      desc: "Detailed hair health evaluation and style analysis with our artists.",
    },
    {
      num: "2",
      title: "Choose Your Service",
      desc: "Select from bridal makeovers, facials, keratin smoothing, or nails.",
    },
    {
      num: "3",
      title: "Book an Appointment",
      desc: "Pick your preferred date, time slot, and master beauty artist in seconds.",
    },
    {
      num: "4",
      title: "Enjoy the Experience",
      desc: "Relax with complimentary beverages and leave with a radiant glow.",
    },
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-t border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F8F6] rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Text */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#111111] leading-tight">
                AT JUGNU&apos;S SALOON, ACHIEVING YOUR IDEAL LOOK IS EASY
              </h2>
              <p className="text-slate-600 text-sm font-normal leading-relaxed">
                Select your service, schedule an appointment, and receive top-notch care from our skilled artists.
              </p>
              <div className="pt-2">
                <Link
                  href="/services"
                  className="px-8 py-3.5 rounded-full bg-[#111111] hover:bg-[#D4AF37] hover:text-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer inline-block text-center"
                >
                  Book an Appointment
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Numbered Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {steps.map((item) => (
                <div
                  key={item.num}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-[#D4AF37] transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#F5E8C7] border border-[#D4AF37]/50 text-[#856404] font-bold text-sm flex items-center justify-center">
                    {item.num}
                  </div>
                  <h3 className="font-sans text-base font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
