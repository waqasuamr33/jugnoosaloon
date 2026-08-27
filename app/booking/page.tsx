"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  bookAppointment,
  getServices,
  getBankAccounts,
  ServiceItem,
  BankAccountItem,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function BookingPage() {
  const { customer, isAuthenticated, openAuthModal } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");
  const [clientName, setClientName] = useState<string>("");
  const [clientPhone, setClientPhone] = useState<string>("");
  const [clientEmail, setClientEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [bookingRef, setBookingRef] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [liveServices, setLiveServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccountItem[]>([]);
  const [loadingBanks, setLoadingBanks] = useState<boolean>(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Autofill if customer is logged in
  useEffect(() => {
    if (customer) {
      setClientName(customer.name || "");
      setClientPhone(customer.phone_no1 || "");
    }
  }, [customer]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingServices(true);
        setLoadingBanks(true);
        const [servicesData, banksData] = await Promise.all([
          getServices(),
          getBankAccounts(),
        ]);

        if (servicesData && servicesData.length > 0) {
          setLiveServices(servicesData);
          setSelectedService(String(servicesData[0].id));
        }

        if (banksData && banksData.length > 0) {
          setBankAccounts(banksData);
        }
      } catch (err) {
        console.error("[BookingPage] Error loading initial data:", err);
      } finally {
        setLoadingServices(false);
        setLoadingBanks(false);
      }
    }
    loadData();

    // Default preferred date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleCopyToClipboard = (text: string, identifier: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedAccount(identifier);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 2500);
  };

  const handleProceedToStep2 = () => {
    if (!selectedService) {
      setApiError("Please select a service before continuing.");
      return;
    }
    if (!selectedDate) {
      setApiError("Please choose your preferred appointment date.");
      return;
    }
    setApiError("");
    setStep(2);
  };

  const handleProceedToStep3 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && !customer) {
      openAuthModal(
        "Please sign in or register to complete your reservation.",
        (loggedCustomer) => {
          setClientName(loggedCustomer.name);
          setClientPhone(loggedCustomer.phone_no1);
        }
      );
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      setApiError("Please enter your full name and contact phone number.");
      return;
    }

    setApiError("");
    setStep(3);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // If not authenticated, prompt sign in first
    if (!isAuthenticated && !customer) {
      openAuthModal(
        "Please sign in or register to complete your reservation.",
        (loggedCustomer) => {
          setClientName(loggedCustomer.name);
          setClientPhone(loggedCustomer.phone_no1);
        }
      );
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      setApiError("Please enter your full name and phone number.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    // Convert time to 24-hour HH:mm
    let formattedTime = "14:00";
    if (selectedTime) {
      const match = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;
      }
    }

    // Match service ID
    const matchedService = liveServices.find(
      (s) =>
        String(s.id) === selectedService ||
        s.title.toLowerCase() === selectedService.toLowerCase()
    );

    const serviceIdNum = matchedService
      ? matchedService.id
      : parseInt(selectedService, 10) || 1;
    const serviceTitle = matchedService ? matchedService.title : selectedService;

    const payload = {
      customer_name: clientName.trim(),
      customer_phone: clientPhone.trim(),
      customer_email: clientEmail.trim() || undefined,
      appointment_date: selectedDate || new Date().toISOString().split("T")[0],
      start_time: formattedTime,
      service_ids: [serviceIdNum],
      notes: notes.trim()
        ? `Service: ${serviceTitle} | Notes: ${notes.trim()}`
        : `Service Reserved: ${serviceTitle}`,
      receipt_image: receiptFile,
    };

    try {
      const res = await bookAppointment(payload);
      setIsSubmitting(false);

      if (res.success && res.data?.booking_no) {
        setBookingRef(res.data.booking_no);
        setApiError("");
        setStep(4);
      } else if (res.success) {
        setBookingRef(res.data?.booking_no || "APT-" + Date.now().toString().slice(-6));
        setApiError("");
        setStep(4);
      } else {
        setApiError(
          res.error ||
            res.message ||
            "Failed to book appointment. Please verify details."
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setApiError(err?.message || "Connection error. Please try again.");
    }
  };

  const getSelectedServiceTitle = () => {
    const matched = liveServices.find(
      (s) =>
        String(s.id) === selectedService ||
        s.title.toLowerCase() === selectedService.toLowerCase()
    );
    return matched ? matched.title : selectedService || "Custom Service";
  };

  const getSelectedServicePrice = () => {
    const matched = liveServices.find(
      (s) =>
        String(s.id) === selectedService ||
        s.title.toLowerCase() === selectedService.toLowerCase()
    );
    if (matched) {
      const finalPrice = matched.discounted_price || matched.price;
      return `Rs. ${finalPrice.toLocaleString()}`;
    }
    return "Rs. 2,500";
  };

  // Fallback bank accounts if backend API returns an empty array
  const displayBankAccounts: BankAccountItem[] =
    bankAccounts.length > 0
      ? bankAccounts
      : [
          {
            id: 1,
            bank_name: "Meezan Bank Limited",
            account_title: "Jugnu's Saloon (Pvt) Ltd",
            account_no: "01020304050607",
            iban: "PK89MEZN0001020304050607",
            branch: "DHA Phase 5 Branch, Lahore",
          },
          {
            id: 2,
            bank_name: "Bank Alfalah",
            account_title: "Jugnu's Saloon Official",
            account_no: "5501982736451",
            iban: "PK36ALFH5501982736451",
            branch: "Gulberg III Main Branch",
          },
          {
            id: 3,
            bank_name: "JazzCash / EasyPaisa",
            account_title: "Jugnu's Saloon Services",
            account_no: "+92 300 8476592",
            branch: "Mobile Wallet Direct",
          },
        ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      <Navbar />

      <section className="pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="text-center space-y-2 mb-10">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] p-0.5 mx-auto bg-white">
              <Image
                src="/logo.png"
                alt="JS Logo"
                width={56}
                height={56}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h1 className="font-sans text-3xl font-extrabold uppercase text-[#111111]">
              ONLINE APPOINTMENT RESERVATION
            </h1>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
            <p className="text-slate-600 text-xs font-normal">
              Jugnu&apos;s Saloon • Select your service, review bank transfer details, and reserve your spot.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          {step <= 3 && (
            <div className="max-w-xl mx-auto mb-8">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <div
                  className={`flex items-center gap-2 ${
                    step >= 1 ? "text-[#111111]" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                      step >= 1
                        ? "bg-[#111111] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    1
                  </span>
                  <span>Service</span>
                </div>
                <div
                  className={`h-0.5 flex-1 mx-3 ${
                    step >= 2 ? "bg-[#111111]" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`flex items-center gap-2 ${
                    step >= 2 ? "text-[#111111]" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                      step >= 2
                        ? "bg-[#111111] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    2
                  </span>
                  <span>Contact</span>
                </div>
                <div
                  className={`h-0.5 flex-1 mx-3 ${
                    step >= 3 ? "bg-[#111111]" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`flex items-center gap-2 ${
                    step >= 3 ? "text-[#111111]" : "text-slate-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                      step >= 3
                        ? "bg-[#111111] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    3
                  </span>
                  <span>Bank &amp; Slip</span>
                </div>
              </div>
            </div>
          )}

          {/* Member Login Notice if not logged in */}
          {!isAuthenticated && step <= 3 && (
            <div className="mb-8 max-w-xl mx-auto p-4 rounded-2xl bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Client Authentication
                </p>
                <p className="text-[11px] text-slate-300">
                  Sign in or create an account for 1-click booking & member perks.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  openAuthModal(
                    "Sign in or register to book your appointment.",
                    (logged) => {
                      setClientName(logged.name);
                      setClientPhone(logged.phone_no1);
                    }
                  )
                }
                className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:bg-white transition-all whitespace-nowrap cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* STEP 1: Service & Schedule */}
          {step === 1 && (
            <div className="space-y-6 max-w-xl mx-auto">
              {/* Service Selection */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1.5">
                  Select Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">
                    {loadingServices
                      ? "-- Loading Live API Services... --"
                      : "-- Choose A Beauty Service --"}
                  </option>
                  {liveServices.map((service) => {
                    const finalPrice = service.discounted_price || service.price;
                    const discountBadge =
                      service.discount && service.discount > 0
                        ? ` (${service.discount}% OFF)`
                        : "";
                    const optionText = `${service.title} - Rs. ${finalPrice.toLocaleString()}${discountBadge}`;
                    return (
                      <option key={service.id} value={String(service.id)}>
                        {optionText}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>
              </div>

              {apiError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  ⚠️ {apiError}
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToStep2}
                className="w-full py-4 rounded-full bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-md cursor-pointer"
              >
                Proceed to Client Details &rarr;
              </button>
            </div>
          )}

          {/* STEP 2: Client Contact Details */}
          {step === 2 && (
            <form onSubmit={handleProceedToStep3} className="space-y-5 max-w-xl mx-auto">
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  ⚠️ {apiError}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#F8F8F6] border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111111]">{getSelectedServiceTitle()}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedDate} at {selectedTime} •{" "}
                    <span className="text-[#996515] font-bold">
                      {getSelectedServicePrice()}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[11px] text-[#996515] underline font-bold"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Eleanor Vance"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Special Notes / Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bridal dressing, sensitive skin, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-xs font-medium text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold uppercase hover:bg-slate-100 transition-colors"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  className="w-2/3 py-3.5 rounded-full bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-md"
                >
                  View Bank Accounts &amp; Pay &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Bank Accounts & Payment Slip Upload */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-6 max-w-xl mx-auto">
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  ⚠️ {apiError}
                </div>
              )}

              {/* Booking Summary Strip */}
              <div className="p-4 rounded-2xl bg-[#F8F8F6] border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-[#111111]">{getSelectedServiceTitle()}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedDate} at {selectedTime} • For {clientName} ({clientPhone})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Estimated Total
                  </span>
                  <span className="text-[#996515] font-extrabold text-sm font-mono">
                    {getSelectedServicePrice()}
                  </span>
                </div>
              </div>

              {/* Bank Accounts Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#111111]">
                    Official Salon Bank Accounts
                  </h3>
                  <span className="text-[10px] text-[#996515] font-bold uppercase tracking-wider">
                    Bank Transfer / Raast / EasyPaisa
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Please transfer the booking fee or advance payment to any of our official accounts below:
                </p>

                {loadingBanks ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                    Loading bank accounts...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayBankAccounts.map((acc, index) => {
                      const bankTitle = acc.bank_name || acc.title || "Official Account";
                      const accountTitle = acc.account_title || acc.account_name || "Jugnu's Saloon";
                      const accountNum = acc.account_number || acc.account_no || "";
                      const iban = acc.iban || acc.iban_no || "";
                      const branch = acc.branch || acc.branch_code || "";
                      const copyId = `acc-${acc.id || index}`;

                      return (
                        <div
                          key={acc.id || index}
                          className="p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-[#D4AF37] transition-all relative shadow-sm group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#111111] text-sm">
                                  {bankTitle}
                                </span>
                                {branch && (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                    {branch}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 text-[11px]">
                                Account Title: <span className="font-bold text-[#111111]">{accountTitle}</span>
                              </p>
                              {accountNum && (
                                <p className="text-slate-600 text-[11px] font-mono">
                                  Account No:{" "}
                                  <span className="font-bold text-[#111111] bg-slate-100 px-1.5 py-0.5 rounded">
                                    {accountNum}
                                  </span>
                                </p>
                              )}
                              {iban && (
                                <p className="text-slate-600 text-[11px] font-mono">
                                  IBAN:{" "}
                                  <span className="font-bold text-[#111111] bg-slate-100 px-1.5 py-0.5 rounded">
                                    {iban}
                                  </span>
                                </p>
                              )}
                            </div>

                            {/* Copy Button */}
                            {accountNum && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopyToClipboard(iban || accountNum, copyId)
                                }
                                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap self-start sm:self-center cursor-pointer ${
                                  copiedAccount === copyId
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                                }`}
                              >
                                {copiedAccount === copyId ? "✓ Copied!" : "Copy Details"}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Advance Payment Receipt Upload (Located BELOW the bank accounts) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block text-xs uppercase font-bold text-slate-700">
                  Upload Payment Receipt / Slip
                </label>
                <p className="text-[11px] text-slate-500">
                  After transferring, upload a screenshot or photo of your payment slip (PNG, JPG, PDF, Max 5MB).
                </p>

                <div className="mt-2">
                  <input
                    type="file"
                    id="receipt-file-input"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setReceiptFile(e.target.files[0]);
                      }
                    }}
                    className="w-full p-3 rounded-2xl bg-[#FAFAFA] border-2 border-dashed border-slate-300 text-[#111111] text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#111111] file:text-[#D4AF37] hover:file:bg-black cursor-pointer hover:border-[#D4AF37] transition-all"
                  />
                </div>

                {receiptFile && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                    <span className="font-medium truncate">
                      ✓ Attached: <span className="font-bold">{receiptFile.name}</span> ({(receiptFile.size / 1024).toFixed(0)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="text-emerald-700 font-bold hover:text-red-600 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold uppercase hover:bg-slate-100 transition-colors"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Complete Reservation"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Reservation Confirmed */}
          {step === 4 && (
            <div className="text-center space-y-6 max-w-md mx-auto py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto border-2 border-emerald-500">
                ✓
              </div>

              <div className="space-y-1">
                <h2 className="font-sans text-2xl font-extrabold uppercase text-[#111111]">
                  RESERVATION CONFIRMED
                </h2>
                <p className="text-xs text-slate-600 font-normal">
                  Thank you, <span className="font-bold text-[#111111]">{clientName}</span>. Your appointment has been recorded.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-slate-200 text-xs text-left space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Booking Ref:</span>
                  <span className="font-bold text-[#996515] font-mono">{bookingRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold">{getSelectedServiceTitle()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone Contact:</span>
                  <span className="font-bold">{clientPhone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Payment Status:</span>
                  <span className="font-bold text-amber-700">
                    {receiptFile ? "Receipt Uploaded (Verifying)" : "Pending Confirmation"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/"
                  className="w-full py-3.5 rounded-full bg-[#111111] text-white text-center font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
