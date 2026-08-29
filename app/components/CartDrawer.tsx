"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotalAmount,
    generateWhatsAppOrderUrl,
  } = useCart();

  const { customer, isAuthenticated } = useAuth();
  const [customerName, setCustomerName] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Sync logged in customer name
  useEffect(() => {
    if (isAuthenticated && customer?.name && !customerName) {
      setCustomerName(customer.name);
    }
  }, [isAuthenticated, customer, customerName]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const whatsappCheckoutUrl = generateWhatsAppOrderUrl(customerName, notes);

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200">
          
          {/* Header */}
          <div className="p-6 bg-[#111111] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#FAFAFA]/10 flex items-center justify-center border border-[#D4AF37]/40 text-[#D4AF37]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-sans font-extrabold text-base uppercase tracking-wider text-white">
                  Shopping Cart
                </h2>
                <p className="text-[11px] text-slate-300 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? "Product" : "Products"} Selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA]">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-lg text-[#111111]">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore our salon care collection and take home professional salon grade formulas.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="inline-block px-6 py-3 rounded-full bg-[#111111] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all shadow-sm"
                >
                  Browse Store Catalog
                </Link>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="space-y-4">
                  {cart.map((item) => {
                    const itemTotal = item.unitPrice * item.quantity;
                    const imageSrc =
                      item.product.image_url && item.product.image_url.startsWith("http")
                        ? item.product.image_url
                        : "/images/hair_products.png";

                    return (
                      <div
                        key={item.product.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#D4AF37]/50 transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F8F8F6] flex-shrink-0 border border-slate-100">
                          <Image
                            src={imageSrc}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-sans font-bold text-xs text-[#111111] line-clamp-2 leading-tight">
                              {item.product.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                              title="Remove item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <p className="text-[11px] font-semibold text-slate-500 mt-1">
                            Rs. {item.unitPrice.toLocaleString()} each
                          </p>

                          {/* Quantity Controls & Line Total */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                            <div className="flex items-center border border-slate-200 rounded-lg bg-[#FAFAFA] overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                                aria-label="Decrease quantity"
                              >
                                &minus;
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-[#111111]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-sm"
                                aria-label="Increase quantity"
                              >
                                &#43;
                              </button>
                            </div>

                            <span className="font-sans font-extrabold text-sm text-[#111111]">
                              Rs. {itemTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Optional Customer Information for Fast Ordering */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-700">
                    Order Details (Optional)
                  </p>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fatima / Ahmed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAFAFA] border border-slate-200 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-slate-500 mb-1">
                      Delivery Address / Special Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. House #, Street, City or special delivery requests..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#FAFAFA] border border-slate-200 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Actions */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-200 space-y-4 shadow-lg">
              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-bold text-[#111111]">
                    Rs. {subtotalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Delivery / Confirmation</span>
                  <span className="font-semibold text-emerald-600">Confirmed on WhatsApp</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-sans font-bold text-sm text-[#111111] uppercase tracking-wide">
                    Estimated Total
                  </span>
                  <span className="font-sans font-extrabold text-xl text-[#111111]">
                    Rs. {subtotalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* WhatsApp Checkout Button */}
              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all transform active:scale-98 cursor-pointer group"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.764.459 3.487 1.332 5.006l-1.417 5.176 5.297-1.389c1.468.802 3.129 1.224 4.775 1.225h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.178-2.925-7.064s-4.395-2.924-7.065-2.924zm0 18.232h-.003c-1.494 0-2.962-.401-4.246-1.161l-.305-.181-3.158.828.842-3.078-.199-.316c-.836-1.33-1.278-2.871-1.278-4.45 0-4.526 3.682-8.209 8.212-8.209 2.194 0 4.256.855 5.807 2.407s2.406 3.614 2.406 5.808c-.001 4.527-3.683 8.209-8.21 8.209zm4.506-6.148c-.247-.124-1.462-.722-1.689-.804-.227-.082-.392-.124-.557.124-.165.247-.641.804-.785.969-.144.165-.289.185-.536.062-.247-.124-1.043-.385-1.987-1.227-.735-.656-1.232-1.467-1.376-1.714-.144-.247-.015-.38.109-.503.111-.11.247-.289.371-.433.124-.144.165-.247.247-.412.082-.165.041-.309-.021-.433-.062-.124-.557-1.341-.763-1.836-.201-.482-.405-.417-.557-.425-.144-.008-.309-.009-.474-.009s-.433.062-.659.309c-.227.247-.866.846-.866 2.063s.886 2.392 1.01 2.557c.124.165 1.744 2.663 4.225 3.734.59.255 1.051.407 1.411.521.593.188 1.132.161 1.558.098.475-.07 1.462-.598 1.669-1.176.206-.578.206-1.073.144-1.176-.062-.103-.227-.165-.474-.289z" />
                </svg>
                <span>Send Order on WhatsApp</span>
              </a>

              {/* Auxiliary actions */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="font-bold text-[#111111] hover:text-[#996515] transition-colors"
                >
                  Continue Shopping &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
