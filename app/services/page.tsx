"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ServiceAndWorkflowSection from "../components/ServiceAndWorkflowSection";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import PageHero from "../components/PageHero";

export default function ServicesPage() {
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
        title="BEAUTY & BRIDAL SERVICES MENU"
        subtitle="Explore our complete menu of HD Bridal makeovers, skincare hydrafacials, haircuts, balayage, gel nails, and spa rituals."
      />

      {/* Services & How It Works Master Section */}
      <ServiceAndWorkflowSection onOpenBooking={handleOpenBooking} />

      <Footer onOpenBooking={() => handleOpenBooking()} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={selectedService}
      />
    </main>
  );
}
