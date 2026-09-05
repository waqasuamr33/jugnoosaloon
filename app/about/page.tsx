"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import WhyChooseUs from "../components/WhyChooseUs";
import GoogleReviews from "../components/GoogleReviews";
import LocationMap from "../components/LocationMap";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import PageHero from "../components/PageHero";

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

      {/* Hero Header Banner with Golden Light Ray */}
      <PageHero
        title="ABOUT JUGNU'S SALOON"
        subtitle="Step into our sanctuary of high-end beauty, HD bridal artistry, skincare facials, and luxury salon care."
      />

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
