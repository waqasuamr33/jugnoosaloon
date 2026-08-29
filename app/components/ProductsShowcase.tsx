"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProducts, ProductItem } from "../lib/api";
import { useCart } from "../context/CartContext";

interface ProductsShowcaseProps {
  onOpenBooking?: (productName?: string) => void;
}

export default function ProductsShowcase({ onOpenBooking }: ProductsShowcaseProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { cart, addToCart } = useCart();

  useEffect(() => {
    async function fetchProductsData() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load showcase products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductsData();
  }, []);

  return (
    <section className="py-24 bg-[#FAFAFA] text-[#111111] relative overflow-hidden border-t border-slate-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#996515]">
              SALON CARE COLLECTION
            </p>
            <h2 className="font-sans text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#111111]">
              LUXURY BEAUTY & HAIRCARE PRODUCTS
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
            <p className="text-slate-600 text-sm leading-relaxed">
              Take home the exact professional formulas used by our master artists for long-lasting glow, hair vitality, and flawless styling.
            </p>
          </div>

          <div>
            <Link
              href="/products"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-[#111111] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all shadow-md group"
            >
              <span>VIEW ALL PRODUCTS</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Skeleton Loading or Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
                <div className="w-full h-56 rounded-2xl bg-slate-100" />
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
                <div className="h-10 w-full bg-slate-200 rounded-xl pt-4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No products available currently in store.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => {
              const hasDiscount = Boolean(
                product.discount &&
                product.discount > 0 &&
                product.discounted_price &&
                product.discounted_price < product.price
              );
              const displayPrice = hasDiscount
                ? product.discounted_price
                : product.price;
              const imageSrc =
                product.image_url && product.image_url.startsWith("http")
                  ? product.image_url
                  : "/images/hair_products.png";

              const cartItem = cart.find((i) => i.product.id === product.id);
              const inCartQty = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 group"
                >
                  <div>
                    {/* Image Frame */}
                    <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-[#F8F8F6] mb-6 flex items-center justify-center p-4">
                      <Image
                        src={imageSrc}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-[#111111] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4AF37]/40 shadow-sm">
                          {product.discount}% OFF
                        </div>
                      )}

                      {/* Stock Status */}
                      {product.stock !== undefined && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                          {product.stock > 0 ? `${product.stock} in stock` : "Pre-order"}
                        </div>
                      )}
                    </div>

                    {/* Product Title */}
                    <h3 className="font-sans font-bold text-base text-[#111111] line-clamp-2 mb-2 group-hover:text-[#996515] transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                    {/* Pricing */}
                    <div className="flex items-baseline space-x-3">
                      <span className="font-sans text-xl font-extrabold text-[#111111]">
                        Rs. {displayPrice?.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="font-sans text-xs text-slate-400 line-through">
                          Rs. {product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: Add to Cart & Direct WhatsApp */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="w-full py-3 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 group/cart"
                      >
                        <svg className="w-4 h-4 text-[#D4AF37] group-hover/cart:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>
                          {inCartQty > 0 ? `In Cart (${inCartQty}) • Add More` : "Add to Cart"}
                        </span>
                      </button>

                      <a
                        href={`https://wa.me/923194415757?text=${encodeURIComponent(
                          `Hello Jugnu's Saloon, I would like to inquire about this product: *${product.title}* (Price: Rs. ${displayPrice?.toLocaleString()}). Link: ${
                            typeof window !== "undefined" ? window.location.origin + "/products" : "https://software.jugnussaloon.com/products"
                          }`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/5 transition-all cursor-pointer flex items-center justify-center space-x-1.5 group/wa"
                      >
                        <svg className="w-3.5 h-3.5 fill-current text-[#25D366]" viewBox="0 0 24 24">
                          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.341a9.946 9.946 0 004.882 1.28h.003c5.505 0 9.988-4.478 9.989-9.984 0-2.668-1.037-5.176-2.922-7.062A9.92 9.92 0 0012.012 2zm5.74 14.184c-.244.688-1.42 1.314-1.96 1.396-.505.076-1.162.107-1.874-.12-.435-.138-1.002-.324-1.74-.645-3.096-1.348-5.115-4.492-5.27-4.698-.153-.205-1.258-1.674-1.258-3.192 0-1.517.794-2.264 1.077-2.553.282-.288.614-.36.819-.36.205 0 .41.002.589.011.19.01.442-.072.693.53.256.615.872 2.128.948 2.282.077.153.128.333.026.538-.103.205-.154.333-.308.512-.154.18-.323.402-.461.54-.154.153-.314.321-.135.628.18.307.798 1.316 1.713 2.13 1.177 1.047 2.167 1.371 2.474 1.525.307.153.487.128.667-.077.179-.205.768-.897.973-1.205.205-.307.41-.256.692-.153.282.102 1.794.846 2.102 1.001.307.153.512.23.589.36.077.128.077.742-.167 1.43z"/>
                        </svg>
                        <span>Direct WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-[#111111] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-sans text-xl font-bold uppercase text-white">
              NEED HELP SELECTING THE RIGHT FORMULA FOR YOUR HAIR OR SKIN?
            </h4>
            <p className="text-slate-400 text-xs font-normal">
              Our beauty concierges are available for personalized skincare & hair type consultations.
            </p>
          </div>
          <Link
            href="/products"
            className="px-8 py-3.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all whitespace-nowrap"
          >
            Explore Complete Store Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
