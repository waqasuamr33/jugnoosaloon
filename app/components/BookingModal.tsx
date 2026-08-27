"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  bookAppointment,
  getServices,
  getServiceCategories,
  getBankAccounts,
  ServiceItem,
  ServiceCategoryItem,
  BankAccountItem,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const FALLBACK_SERVICES: ServiceItem[] = [
  { id: 1, title: "Signature HD Bridal Makeup", price: 35000, description: "Full bridal makeup with hairstyle, eyelashes and draping." },
  { id: 2, title: "Party Glam Makeup & Hair", price: 8500, description: "Event makeup, lashes and custom hair styling." },
  { id: 3, title: "Hydra Deep Cleanse Facial", price: 6500, description: "Hydra-dermabrasion with serum infusion." },
  { id: 4, title: "Balayage & Ombre Hair Color", price: 18000, description: "Custom hair coloring with protective bond treatment." },
  { id: 5, title: "Keratin Smooth Treatment", price: 15000, description: "Intense frizz control and protein smoothing." },
  { id: 6, title: "Gel Nail Extensions & Pedicure", price: 4500, description: "Nail extensions, custom art and spa pedicure." },
];

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "12:30 PM",
  "02:00 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
  "06:30 PM",
  "07:30 PM",
  "08:00 PM",
];

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSlotPassed(slotStr: string, dateStr: string): boolean {
  if (!dateStr) return false;
  const todayStr = getTodayDateString();
  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  const match = slotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const now = new Date();
  const slotDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

  return slotDate.getTime() <= now.getTime();
}

export default function BookingModal({
  isOpen,
  onClose,
  initialService = "",
}: BookingModalProps) {
  const { customer, isAuthenticated, openAuthModal } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>("02:00 PM");
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
  const [serviceSearch, setServiceSearch] = useState<string>("");
  const [liveCategories, setLiveCategories] = useState<ServiceCategoryItem[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

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
        const [servicesData, banksData, categoriesData] = await Promise.all([
          getServices(),
          getBankAccounts(),
          getServiceCategories(),
        ]);

        if (categoriesData && categoriesData.length > 0) {
          setLiveCategories(categoriesData);
          setExpandedCategory(categoriesData[0].id); // auto-open first
        }

        if (servicesData && servicesData.length > 0) {
          setLiveServices(servicesData);

          if (initialService) {
            const matched = servicesData.find(
              (s) =>
                s.title.toLowerCase() === initialService.toLowerCase() ||
                String(s.id) === initialService
            );
            if (matched) {
              setSelectedServices([matched.id]);
            }
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
    }
  }, [isOpen, initialService]);

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
    if (!isAuthenticated && !customer) {
      openAuthModal(
        "Please sign in or register your account before booking an appointment.",
        (loggedCustomer) => {
          setClientName(loggedCustomer.name);
          setClientPhone(loggedCustomer.phone_no1);
          setStep(2);
        }
      );
      return;
    }
    if (selectedServices.length === 0) {
      setApiError("Please select at least one service to proceed.");
      return;
    }
    if (!selectedDate) {
      setApiError("Please choose your preferred appointment date.");
      return;
    }
    const todayStr = getTodayDateString();
    if (selectedDate < todayStr) {
      setApiError("Appointment date cannot be in the past. Please select today or a future date.");
      return;
    }
    if (isSlotPassed(selectedTime, selectedDate)) {
      setApiError("The chosen time slot has already passed for today. Please select an upcoming slot or a future date.");
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

    // Build service list from selected IDs
    const displayServices = liveServices.length > 0 ? liveServices : FALLBACK_SERVICES;
    const selectedServiceObjects = displayServices.filter((s) => selectedServices.includes(s.id));
    const serviceTitle = selectedServiceObjects.map((s) => s.title).join(", ") || "General Salon Service";

    const payload = {
      order_type: "Online",
      customer_name: clientName.trim(),
      customer_phone: clientPhone.trim(),
      customer_email: clientEmail.trim() || undefined,
      appointment_date: selectedDate || new Date().toISOString().split("T")[0],
      start_time: formattedTime,
      service_ids: selectedServices,
      notes: notes.trim()
        ? `Services: ${serviceTitle} | Notes: ${notes.trim()}`
        : `Services Requested: ${serviceTitle}`,
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
    setSelectedServices([]);
    setServiceSearch("");
    setExpandedCategory(null);
    setBookingRef("");
    setApiError("");
    setReceiptFile(null);
    onClose();
  };

  const getSelectedServiceTitles = () => {
    const displayServices = liveServices.length > 0 ? liveServices : FALLBACK_SERVICES;
    const matched = displayServices.filter((s) => selectedServices.includes(s.id));
    return matched.length > 0 ? matched.map((s) => s.title).join(", ") : "General Salon Service";
  };

  const getSelectedServicesTotal = () => {
    const displayServices = liveServices.length > 0 ? liveServices : FALLBACK_SERVICES;
    const matched = displayServices.filter((s) => selectedServices.includes(s.id));
    if (matched.length === 0) return "Rs. 0";
    const total = matched.reduce((sum, s) => sum + (s.discounted_price || s.price), 0);
    return `Rs. ${total.toLocaleString()}`;
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

              {!isAuthenticated && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-900">
                    <span className="text-base">🔒</span>
                    <span className="font-semibold">Sign-in required to book appointments.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      openAuthModal(
                        "Please sign in or create an account to book your appointment.",
                        (loggedCustomer) => {
                          setClientName(loggedCustomer.name);
                          setClientPhone(loggedCustomer.phone_no1);
                        }
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#111111] text-[#D4AF37] font-bold text-[11px] uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-colors shrink-0"
                  >
                    Sign In / Register
                  </button>
                </div>
              )}

              {/* Service Selection — Category Accordion + Search */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-slate-700 font-bold">
                    Choose Services
                  </label>
                  {selectedServices.length > 0 && (
                    <span className="text-[10px] font-bold text-[#996515] uppercase tracking-wider">
                      {selectedServices.length} selected
                    </span>
                  )}
                </div>

                {/* Search bar */}
                <div className="relative mb-3">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-[#FAFAFA] border border-slate-200 text-[#111111] placeholder-slate-400 focus:border-[#D4AF37] focus:outline-none text-xs font-medium"
                  />
                  {serviceSearch && (
                    <button
                      type="button"
                      onClick={() => setServiceSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm leading-none"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {loadingServices ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-11 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (() => {
                  const allServices = liveServices.length > 0 ? liveServices : FALLBACK_SERVICES;

                  // --- SEARCH MODE: flat filtered list ---
                  if (serviceSearch.trim()) {
                    const filtered = allServices.filter((s) =>
                      s.title.toLowerCase().includes(serviceSearch.toLowerCase())
                    );
                    return filtered.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs font-medium">
                        No services found for &ldquo;{serviceSearch}&rdquo;
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {filtered.map((service) => {
                          const finalPrice = service.discounted_price || service.price;
                          const isChecked = selectedServices.includes(service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => {
                                setSelectedServices((prev) =>
                                  prev.includes(service.id)
                                    ? prev.filter((id) => id !== service.id)
                                    : [...prev, service.id]
                                );
                                setApiError("");
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                                isChecked
                                  ? "bg-[#111111] border-[#D4AF37] text-white shadow-md"
                                  : "bg-[#FAFAFA] border-slate-200 text-[#111111] hover:border-[#D4AF37] hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                  isChecked ? "bg-[#D4AF37] border-[#D4AF37]" : "border-slate-300"
                                }`}>
                                  {isChecked && (
                                    <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </span>
                                <div>
                                  <span className="text-xs font-semibold leading-tight block">{service.title}</span>
                                  {service.category && (
                                    <span className="text-[9px] text-slate-400 font-medium">{service.category.title}</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0 ml-2">
                                <span className={`text-xs font-bold font-mono ${
                                  isChecked ? "text-[#D4AF37]" : "text-[#996515]"
                                }`}>
                                  Rs. {finalPrice.toLocaleString()}
                                </span>
                                {!!service.discount && service.discount > 0 && (
                                  <span className="block text-[9px] text-emerald-400 font-bold">{service.discount}% OFF</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  }

                  // --- BROWSE MODE: category accordion ---
                  // Build category list: live categories + an "Uncategorized" bucket
                  const categorized = new Set(allServices.map((s) => s.category?.id).filter(Boolean));
                  const uncategorized = allServices.filter((s) => !s.category?.id);

                  // Ordered: live categories first, then uncategorized if any
                  const categoryList: { id: number; title: string; services: ServiceItem[] }[] = [];

                  if (liveCategories.length > 0) {
                    liveCategories.forEach((cat) => {
                      const catServices = allServices.filter((s) => s.category?.id === cat.id);
                      if (catServices.length > 0) {
                        categoryList.push({ id: cat.id, title: cat.title, services: catServices });
                      }
                    });
                  } else {
                    // Fallback: group by category from service data
                    const seen = new Map<number, { id: number; title: string; services: ServiceItem[] }>();
                    allServices.forEach((s) => {
                      if (s.category) {
                        if (!seen.has(s.category.id)) seen.set(s.category.id, { id: s.category.id, title: s.category.title, services: [] });
                        seen.get(s.category.id)!.services.push(s);
                      }
                    });
                    seen.forEach((v) => categoryList.push(v));
                  }

                  if (uncategorized.length > 0) {
                    categoryList.push({ id: -1, title: "Other Services", services: uncategorized });
                  }

                  if (categoryList.length === 0) {
                    return <div className="py-6 text-center text-slate-400 text-xs">No services available.</div>;
                  }

                  return (
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {categoryList.map((cat) => {
                        const isOpen = expandedCategory === cat.id;
                        const selectedInCat = cat.services.filter((s) => selectedServices.includes(s.id)).length;
                        return (
                          <div key={cat.id} className="rounded-xl border border-slate-200 overflow-hidden">
                            {/* Category Header */}
                            <button
                              type="button"
                              onClick={() => setExpandedCategory(isOpen ? null : cat.id)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all cursor-pointer ${
                                isOpen ? "bg-[#111111] text-white" : "bg-[#FAFAFA] text-[#111111] hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide">{cat.title}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                  isOpen ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {cat.services.length}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {selectedInCat > 0 && (
                                  <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                                    {selectedInCat} added
                                  </span>
                                )}
                                <svg
                                  className={`w-4 h-4 transition-transform ${
                                    isOpen ? "rotate-180 text-[#D4AF37]" : "text-slate-400"
                                  }`}
                                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Services inside category */}
                            {isOpen && (
                              <div className="border-t border-slate-200 divide-y divide-slate-100 bg-white">
                                {cat.services.map((service) => {
                                  const finalPrice = service.discounted_price || service.price;
                                  const isChecked = selectedServices.includes(service.id);
                                  return (
                                    <button
                                      key={service.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedServices((prev) =>
                                          prev.includes(service.id)
                                            ? prev.filter((id) => id !== service.id)
                                            : [...prev, service.id]
                                        );
                                        setApiError("");
                                      }}
                                      className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer ${
                                        isChecked
                                          ? "bg-[#D4AF37]/10"
                                          : "hover:bg-slate-50"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                          isChecked ? "bg-[#D4AF37] border-[#D4AF37]" : "border-slate-300"
                                        }`}>
                                          {isChecked && (
                                            <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </span>
                                        <span className="text-xs font-semibold text-[#111111] leading-tight">{service.title}</span>
                                      </div>
                                      <div className="text-right shrink-0 ml-2">
                                        <span className={`text-xs font-bold font-mono ${
                                          isChecked ? "text-[#996515]" : "text-slate-500"
                                        }`}>
                                          Rs. {finalPrice.toLocaleString()}
                                        </span>
                                        {!!service.discount && service.discount > 0 && (
                                          <span className="block text-[9px] text-emerald-500 font-bold">{service.discount}% OFF</span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {selectedServices.length > 0 && (
                  <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-xl bg-[#111111] text-white text-xs">
                    <span className="font-semibold text-slate-300">Combined Total:</span>
                    <span className="font-extrabold text-[#D4AF37] font-mono">{getSelectedServicesTotal()}</span>
                  </div>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-700 font-bold mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={selectedDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setSelectedDate(newDate);
                      setApiError("");
                      if (isSlotPassed(selectedTime, newDate)) {
                        const nextValid = TIME_SLOTS.find((s) => !isSlotPassed(s, newDate));
                        if (nextValid) {
                          setSelectedTime(nextValid);
                        }
                      }
                    }}
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
                    onChange={(e) => {
                      setSelectedTime(e.target.value);
                      setApiError("");
                    }}
                    className="w-full p-3.5 rounded-xl bg-[#FAFAFA] border border-slate-300 text-[#111111] focus:border-[#D4AF37] focus:outline-none text-xs font-medium"
                  >
                    {TIME_SLOTS.map((slot) => {
                      const passed = isSlotPassed(slot, selectedDate);
                      return (
                        <option key={slot} value={slot} disabled={passed}>
                          {slot} {passed ? "(Passed for Today)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {selectedDate === getTodayDateString() && TIME_SLOTS.every((s) => isSlotPassed(s, selectedDate)) && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium text-center">
                  ⚠️ All appointment slots for today have passed. Please select a future date.
                </div>
              )}

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
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Services:</span>
                  <span className="font-bold text-[#111111] text-right">
                    {getSelectedServiceTitles()}
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
                    {getSelectedServicesTotal()}
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
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Services:</span>
                  <span className="font-bold text-[#111111] text-right">
                    {getSelectedServiceTitles()}
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
                    {getSelectedServicesTotal()}
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
                  {isSubmitting ? "Submitting Request..." : "Submit Reservation Request"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Appointment Submitted (Approval Pending) */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto border-2 border-amber-400">
                ⏳
              </div>

              <div className="space-y-1">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[10px] uppercase tracking-widest mb-1">
                  Status: Approval Pending
                </div>
                <h4 className="font-sans text-xl font-extrabold uppercase text-[#111111]">
                  BOOKING REQUEST SUBMITTED
                </h4>
                <p className="text-xs text-slate-600 font-normal">
                  Thank you, <span className="font-bold text-[#111111]">{clientName}</span>. Your appointment request has been recorded and is currently under review.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-2 text-xs text-left max-w-sm mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-bold uppercase">Booking Ref:</span>
                  <span className="font-bold text-[#996515] font-mono">{bookingRef}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">Services:</span>
                  <span className="font-bold text-right">{getSelectedServiceTitles()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Slot:</span>
                  <span className="font-bold">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Phone:</span>
                  <span className="font-bold">{clientPhone}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 items-center">
                  <span className="text-slate-500">Booking Status:</span>
                  <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 text-[10px] uppercase tracking-wider">
                    ⏳ Approval Pending
                  </span>
                </div>
                {receiptFile && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Slip:</span>
                    <span className="font-bold text-emerald-700">Uploaded (Under Review)</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 max-w-sm mx-auto">
                <p className="text-xs text-amber-900 font-medium leading-relaxed">
                  Our team will contact you on <strong>WhatsApp / Phone ASAP</strong> to confirm your slot and arrival time.
                </p>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <a
                  href={`https://wa.me/923194415757?text=${encodeURIComponent(
                    `Hello Jugnu's Saloon! I just submitted an appointment request (Ref: ${bookingRef}) for *${getSelectedServiceTitles()}* on *${selectedDate}* at *${selectedTime}*. My Name: *${clientName}*. Please confirm my booking!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
