"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authPromptMessage,
    login,
    signup,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    phone_no1: "",
    username: "",
    password: "",
    father_name: "",
    address: "",
    date_of_birth: "",
    date_of_anniversary: "",
    card_type: "No Card",
    card_no: "",
    phone_no2: "",
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.username.trim() || !loginForm.password) {
      setErrorMessage("Please enter both your username/phone and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await login({
      username: loginForm.username.trim(),
      password: loginForm.password,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid username or password. Please try again.");
    } else {
      setSuccessMessage("Welcome back to Jugnu's Saloon!");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!signupForm.phone_no1.trim()) {
      setErrorMessage("Please enter your primary phone number.");
      return;
    }
    if (!signupForm.username.trim()) {
      setErrorMessage("Please choose a unique username.");
      return;
    }
    if (signupForm.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await signup({
      name: signupForm.name.trim(),
      phone_no1: signupForm.phone_no1.trim(),
      username: signupForm.username.trim().toLowerCase(),
      password: signupForm.password,
      father_name: signupForm.father_name.trim() || undefined,
      address: signupForm.address.trim() || undefined,
      date_of_birth: signupForm.date_of_birth || undefined,
      date_of_anniversary: signupForm.date_of_anniversary || undefined,
      card_type: signupForm.card_type || "No Card",
      card_no: signupForm.card_no.trim() || undefined,
      phone_no2: signupForm.phone_no2.trim() || undefined,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || "Registration failed. Please verify details.");
    } else {
      setSuccessMessage("Account created successfully!");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-[#FFFFFF] border border-slate-200 rounded-3xl overflow-hidden max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-[#111111] text-white p-6 sm:p-8 relative">
          {/* Close Button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D4AF37] bg-white p-0.5">
              <Image
                src="/logo.png"
                alt="Jugnu's Saloon"
                width={36}
                height={36}
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                JUGNU&apos;S SALOON
              </span>
            </div>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            {activeTab === "login" ? "CLIENT PORTAL LOGIN" : "CREATE CLIENT ACCOUNT"}
          </h2>

          <p className="text-slate-300 text-xs mt-1 font-normal">
            Access VIP appointment booking, loyalty privileges, and personalized care.
          </p>

          {/* Prompt Message Callout */}
          {authPromptMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5E8C7] text-xs font-medium flex items-center space-x-2">
              <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{authPromptMessage}</span>
            </div>
          )}

          {/* Tabs Selector */}
          <div className="flex mt-6 bg-black/40 p-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "login"
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === "signup"
                  ? "bg-[#D4AF37] text-black shadow-md"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Register New Account
            </button>
          </div>
        </div>

        {/* Form Body Container (Scrollable) */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#FFFFFF]">
          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2 animate-shake">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === "login" ? (
            /* ================= SIGN IN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Username or Mobile Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +92 319 4415757 or ayesha_khan"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F6] border border-slate-200 text-sm text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111111]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] font-semibold text-[#996515] hover:text-black transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F6] border border-slate-200 text-sm text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In & Continue &rarr;</span>
                )}
              </button>

              <div className="pt-4 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("signup");
                      setErrorMessage("");
                    }}
                    className="font-bold text-[#111111] underline hover:text-[#996515] transition-colors"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= SIGN UP FORM ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Johnson"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Primary Phone No *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +92 312 3456789"
                    value={signupForm.phone_no1}
                    onChange={(e) => setSignupForm({ ...signupForm, phone_no1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Unique Username *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. sarah_j"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Password * (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="Create secure password"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Father / Guardian Name
                </label>
                <input
                  type="text"
                  placeholder="Optional"
                  value={signupForm.father_name}
                  onChange={(e) => setSignupForm({ ...signupForm, father_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                  Residential Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. House #, Street, City"
                  value={signupForm.address}
                  onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={signupForm.date_of_birth}
                    onChange={(e) => setSignupForm({ ...signupForm, date_of_birth: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111]">
                    Anniversary Date
                  </label>
                  <input
                    type="date"
                    value={signupForm.date_of_anniversary}
                    onChange={(e) => setSignupForm({ ...signupForm, date_of_anniversary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8F8F6] border border-slate-200 text-xs text-[#111111] focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Complete Registration & Continue &rarr;</span>
                )}
              </button>

              <div className="pt-3 text-center border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setErrorMessage("");
                    }}
                    className="font-bold text-[#111111] underline hover:text-[#996515] transition-colors"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
