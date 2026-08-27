"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CustomerProfile,
  CustomerLoginPayload,
  CustomerSignupPayload,
  customerLogin,
  customerSignup,
} from "../lib/api";

const STORAGE_KEY = "jugnu_customer_session";

interface AuthContextType {
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  login: (payload: CustomerLoginPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  signup: (payload: CustomerSignupPayload) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (promptMessage?: string, onAuthSuccess?: (customer: CustomerProfile) => void) => void;
  closeAuthModal: () => void;
  authPromptMessage: string;
  onAuthSuccessCallback: ((customer: CustomerProfile) => void) | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState("");
  const [onAuthSuccessCallback, setOnAuthSuccessCallback] = useState<((customer: CustomerProfile) => void) | null>(null);

  // Initialize from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCustomer(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load customer session from localStorage:", e);
    }
  }, []);

  const login = useCallback(async (payload: CustomerLoginPayload) => {
    const res = await customerLogin(payload);
    if (res.success && res.data) {
      setCustomer(res.data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
      } catch (e) {
        console.error("Failed to save customer session:", e);
      }
      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(res.data);
        setOnAuthSuccessCallback(null);
      }
      setIsAuthModalOpen(false);
      return { success: true, message: res.message || "Logged in successfully" };
    }
    return { success: false, error: res.error || res.message || "Login failed" };
  }, [onAuthSuccessCallback]);

  const signup = useCallback(async (payload: CustomerSignupPayload) => {
    const res = await customerSignup(payload);
    if (res.success && res.data) {
      setCustomer(res.data);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data));
      } catch (e) {
        console.error("Failed to save customer session:", e);
      }
      if (onAuthSuccessCallback) {
        onAuthSuccessCallback(res.data);
        setOnAuthSuccessCallback(null);
      }
      setIsAuthModalOpen(false);
      return { success: true, message: res.message || "Registered successfully" };
    }
    return { success: false, error: res.error || res.message || "Signup failed" };
  }, [onAuthSuccessCallback]);

  const logout = useCallback(() => {
    setCustomer(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Error removing customer session:", e);
    }
  }, []);

  const openAuthModal = useCallback((
    promptMessage = "",
    onAuthSuccess?: (cust: CustomerProfile) => void
  ) => {
    setAuthPromptMessage(promptMessage);
    if (onAuthSuccess) {
      setOnAuthSuccessCallback(() => onAuthSuccess);
    } else {
      setOnAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthPromptMessage("");
    setOnAuthSuccessCallback(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        login,
        signup,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authPromptMessage,
        onAuthSuccessCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
