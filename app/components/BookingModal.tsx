"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  bookAppointment,
  getServices,
  getBankAccounts,
  ServiceItem,
  BankAccountItem,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

export default function BookingModal({
  isOpen,
  onClose,
  initialService = "",
}: BookingModalProps) {
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

  // Autofill client details when customer logs in or is authenticated
  useEffect(() => {
    if (customer) {
      setClientName(customer.name || "");
      setClientPhone(customer.phone_no1 || "");
    }
  }, [customer]);

  // Load services and bank accounts live from backend API
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoadingServices(true);
        setLoadingBanks(true);
        const [servicesData, banksData] = await Promise.all([
          getServices(),
          getBankAccounts(),
        ]);

        if (servicesData && servicesData.length > 0) {
          setLiveServices(servicesData);

          if (initialService) {
            const matched = servicesData.find(
              (s) =>
                s.title.toLowerCase() === initialService.toLowerCase() ||
                String(s.id) === initialService
            );
            if (matched) {
              setSelectedService(String(matched.id));
            } else {
              setSelectedService(initialService);
            }
          } else {
            setSelectedService(String(servicesData[0].id));
          }
        }

        if (banksData && banksData.length > 0) {
          setBankAccounts(banksData);
        }
      } catch (err) {
        console.error("[Modal] Error fetching initial data:", err);
      } finally {
        setLoadingServices(false);
        setLoadingBanks(false);
      }
    }

    if (isOpen) {
      loadInitialData();
      // Default to tomorrow's date if empty
      if (!selectedDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow.toISOString().split("T")[0]);
      }

      // If user is not authenticated, prompt sign in modal
      if (!isAuthenticated) {
        openAuthModal(
          "Please sign in or create an account to reserve and track your appointment at Jugnu's Saloon.",
          (loggedCustomer) => {
            setClientName(loggedCustomer.name);
            setClientPhone(loggedCustomer.phone_no1);
          }
        );
      }
    }
  }, [isOpen, initialService, isAuthenticated, openAuthModal, selectedDate]);

  if (!isOpen) return null;

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
      setApiError("Please choose a service to proceed.");
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
        "Please sign in or register to finalize your booking.",
        (loggedCustomer) => {
          setClientName(loggedCustomer.name);
          setClientPhone(loggedCustomer.phone_no1);
        }
      );
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      setApiError("Please provide your full name and contact phone number.");
      return;
    }

    setApiError("");
    setStep(3);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // If not authenticated, require login first
    if (!isAuthenticated && !customer) {
      openAuthModal(
        "Please sign in or register to finalize your booking.",
        (loggedCustomer) => {
          setClientName(loggedCustomer.name);
          setClientPhone(loggedCustomer.phone_no1);
        }
      );
      return;
    }

    if (!clientName.trim() || !clientPhone.trim()) {
      setApiError("Please provide your full name and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    // Format time to 24-hour HH:mm
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
        : `Service Requested: ${serviceTitle}`,
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
            "Failed to book appointment. Please check your details."
        );
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setApiError(err?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setBookingRef("");
    setApiError("");
    setReceiptFile(null);
    onClose();
  };

  const getSelectedServiceTitle = () => {
    const matched = liveServices.find(
      (s) =>
        String(s.id) === selectedService ||
        s.title.toLowerCase() === selectedService.toLowerCase()
    );
    return matched ? matched.title : selectedService || "Custom Salon Service";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-[#111111] max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-6 bg-[#FAFAFA] border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] p-0.5 bg-white">
              <Image
                src="/logo.png"
                alt="JS Logo"
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-[#111111] uppercase">
                RESERVE BEAUTY APPOINTMENT
              </h3>
              <p className="text-[10px] text-[#996515] uppercase tracking-widest font-bold">
                Jugnu&apos;s Saloon Online Booking
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Auth Banner if not logged in */}
          {!isAuthenticated && step <= 3 && (
            <div className="mb-5 p-4 rounded-2xl bg-[#111111] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                  Member Privileges
                </p>
                <p className="text-[11px] text-slate-300">
                  Sign in or register to save booking history & VIP discounts.
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
                className="px-4 py-2 rounded-full bg-[#D4AF37] text-black font-bold text-[11px] uppercase tracking-wider hover:bg-white transition-all whitespace-nowrap cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Stepper Indicator */}
          {step <= 3 && (
            <div className="mb-6 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
              <div
                className={`flex items-center gap-1.5 ${
                  step >= 1 ? "text-[#111111]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
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
                className={`h-0.5 flex-1 mx-2 ${
                  step >= 2 ? "bg-[#111111]" : "bg-slate-200"
                }`}
              />
              <div
                className={`flex items-center gap-1.5 ${
                  step >= 2 ? "text-[#111111]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step >= 2
                      ? "bg-[#111111] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  2
                </span>
                <span>Details</span>
              </div>
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  step >= 3 ? "bg-[#111111]" : "bg-slate-200"
                }`}
              />
              <div
                className={`flex items-center gap-1.5 ${
                  step >= 3 ? "text-[#111111]" : "text-slate-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    step >= 3
                      ? "bg-[#111111] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  3
                </span>
                <span>Payment &amp; Slip</span>
              </div>
            </div>
          )}

          {/* STEP 1: Select Service & Date */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#996515] font-bold">
                  Step 1 of 3
                </span>
                <h4 className="font-sans text-lg font-bold">Select Service &amp; Date</h4>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                  Choose Service
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs font-medium"
                >
                  <option value="">
                    {loadingServices
                      ? "-- Loading Live API Services... --"
                      : "-- Select A Service --"}
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

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs font-medium"
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="w-full py-4 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-md"
                >
                  Continue to Contact Details &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Client Contact Details */}
          {step === 2 && (
            <form onSubmit={handleProceedToStep3} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-[#996515] font-bold">
                  Step 2 of 3
                </span>
                <h4 className="font-sans text-lg font-bold">Client Contact Information</h4>
              </div>

              {/* Error Banner */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  ⚠️ {apiError}
                </div>
              )}

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-[#111111]">
                    {getSelectedServiceTitle()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold text-[#111111]">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-500">Estimated Total:</span>
                  <span className="font-extrabold text-[#996515] font-mono">
                    {getSelectedServicePrice()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ayesha Khan"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1">
                  Special Notes / Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sensitive skin, bridal veil setting, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3.5 px-5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-md"
                >
                  View Bank Accounts &amp; Pay &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Bank Accounts & Payment Slip Upload */}
          {step === 3 && (
            <form onSubmit={handleConfirmBooking} className="space-y-5">
              <div className="text-center space-y-1 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-[#996515] font-bold">
                  Step 3 of 3
                </span>
                <h4 className="font-sans text-lg font-bold">Bank Details &amp; Payment Slip</h4>
              </div>

              {/* Error Banner */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                  ⚠️ {apiError}
                </div>
              )}

              {/* Summary Card */}
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-[#111111]">
                    {getSelectedServiceTitle()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule:</span>
                  <span className="font-bold text-[#111111]">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1">
                  <span className="text-slate-500">Total:</span>
                  <span className="font-extrabold text-[#996515] font-mono">
                    {getSelectedServicePrice()}
                  </span>
                </div>
              </div>

              {/* Bank Accounts Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs uppercase font-extrabold tracking-wider text-[#111111]">
                    Official Bank Accounts
                  </h5>
                  <span className="text-[10px] text-[#996515] font-bold uppercase">
                    Bank / Raast / EasyPaisa
                  </span>
                </div>

                <p className="text-[11px] text-slate-500">
                  Transfer booking amount to any account below:
                </p>

                {loadingBanks ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                    Loading bank accounts...
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1">
                    {displayBankAccounts.map((acc, index) => {
                      const bankTitle = acc.bank_name || acc.title || "Official Account";
                      const accountTitle = acc.account_title || acc.account_name || "Jugnu's Saloon";
                      const accountNum = acc.account_number || acc.account_no || "";
                      const iban = acc.iban || acc.iban_no || "";
                      const copyId = `modal-acc-${acc.id || index}`;

                      return (
                        <div
                          key={acc.id || index}
                          className="p-3 rounded-xl bg-white border-2 border-slate-200 hover:border-[#D4AF37] transition-all flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-[#111111] text-xs">{bankTitle}</p>
                            <p className="text-slate-600 text-[11px]">
                              Title: <span className="font-bold text-[#111111]">{accountTitle}</span>
                            </p>
                            {accountNum && (
                              <p className="text-slate-600 text-[11px] font-mono">
                                A/C: <span className="font-bold text-[#111111]">{accountNum}</span>
                              </p>
                            )}
                            {iban && (
                              <p className="text-slate-600 text-[10px] font-mono">
                                IBAN: <span className="font-bold text-[#111111]">{iban}</span>
                              </p>
                            )}
                          </div>

                          {accountNum && (
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyToClipboard(iban || accountNum, copyId)
                              }
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                                copiedAccount === copyId
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#111111] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                              }`}
                            >
                              {copiedAccount === copyId ? "✓ Copied" : "Copy"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Receipt Upload (Below bank accounts) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <label className="block text-xs uppercase font-bold text-slate-700">
                  Upload Payment Receipt / Slip
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setReceiptFile(e.target.files[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl bg-[#FAFAFA] border-2 border-dashed border-slate-300 text-[#111111] text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#111111] file:text-[#D4AF37] hover:file:bg-black cursor-pointer hover:border-[#D4AF37]"
                />

                {receiptFile && (
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                    <span className="truncate">✓ {receiptFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="text-emerald-700 font-bold hover:text-red-600 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3.5 px-5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  &larr; Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Complete Reservation"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Appointment Confirmed */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto border-2 border-emerald-500">
                ✓
              </div>

              <div className="space-y-1">
                <h4 className="font-sans text-xl font-extrabold uppercase text-[#111111]">
                  APPOINTMENT CONFIRMED!
                </h4>
                <p className="text-xs text-slate-600 font-normal">
                  Thank you, <span className="font-bold text-[#111111]">{clientName}</span>. Your appointment has been registered with Jugnu&apos;s Saloon.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-2 text-xs text-left max-w-sm mx-auto">
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
                  <span className="text-slate-500">Client Phone:</span>
                  <span className="font-bold">{clientPhone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Payment Slip:</span>
                  <span className="font-bold text-amber-700">
                    {receiptFile ? "Uploaded (Under Verification)" : "Pending Confirmation"}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-normal max-w-xs mx-auto">
                Our team will contact you on WhatsApp / Phone to confirm your arrival time.
              </p>

              <button
                onClick={resetAndClose}
                className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
