"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import GoogleReviews from "../components/GoogleReviews";
import LocationMap from "../components/LocationMap";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
export default function AboutPage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleOpenBooking = (serviceName: string = "") => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Hero Header Banner */}
      <section className="relative pt-36 pb-24 bg-[#0A0A0B] text-white overflow-hidden border-b border-[#D4AF37]/20">
        {/* Golden Flare & Ambient Glow Effects */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] sm:w-[900px] h-[350px] sm:h-[450px] bg-gradient-to-b from-[#D4AF37]/25 via-[#D4AF37]/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px]" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        </div>

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-white">
            ABOUT JUGNU&apos;S SALOON
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto rounded-full" />
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Step into our sanctuary of high-end beauty, HD bridal artistry, skincare facials, and luxury salon care.
          </p>
        </div>
      </section>

      {/* Main Brand Story */}
      <AboutSection onOpenBooking={() => handleOpenBooking("Beauty Consultation")} />

      {/* Why Choose Us */}
      <WhyChooseUs onOpenBooking={handleOpenBooking} />

      {/* Google 5-Star Reviews Section */}
      <GoogleReviews />

      {/* Saloon Location & Google Map */}
      <LocationMap />

      <Footer onOpenBooking={() => handleOpenBooking()} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={selectedService}
      />
    </main>
  );
}
