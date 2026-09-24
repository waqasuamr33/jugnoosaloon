"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import ServiceAndWorkflowSection from "./components/ServiceAndWorkflowSection";
import ProductsShowcase from "./components/ProductsShowcase";
import WorkShowcase from "./components/WorkShowcase";
import NewsPress from "./components/NewsPress";
import LocationMap from "./components/LocationMap";
import BookingModal from "./components/BookingModal";
import Footer from "./components/Footer";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleOpenBooking = (serviceName: string = "") => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
    setSelectedService("");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      {/* Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Benefits & Signature Experience */}
      <WhyChooseUs />

      {/* Combined Services & How It Works Master Section (Inspiration Design) */}
      <ServiceAndWorkflowSection />

      {/* Signature Work & Transformations Showcase (Top 6 Pinterest-Style) */}
      <WorkShowcase />

      {/* Products Showcase Section (Home Page) */}
      <ProductsShowcase />

      {/* Google 5-Star Reviews Section */}
      <NewsPress />

      {/* Saloon Location & Map Section */}
      <LocationMap />


      {/* Footer */}
      <Footer />

      {/* Interactive Booking Drawer / Modal (fallback if opened programmatically) */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={handleCloseBooking}
        initialService={selectedService}
      />
    </main>
  );
}
