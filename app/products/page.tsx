"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingModal from "../components/BookingModal";
import Image from "next/image";
import { getProducts, ProductItem } from "../lib/api";

export default function ProductsPage() {
  const [bookingOpen, setBookingOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProductsData() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load store products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductsData();
  }, []);

  const handleOpenBooking = (productTitle: string = "") => {
    setSelectedProduct(productTitle ? `Product Order: ${productTitle}` : "");
    setBookingOpen(true);
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111] relative">
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Hero Header Banner */}
      <section className="relative pt-32 pb-20 bg-[#111111] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/hair_products.png"
            alt="Salon Products at Jugnu's Saloon"
            fill
            className="object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            Official Saloon Store Catalog
          </p>
          <h1 className="font-sans text-4xl sm:text-6xl font-extrabold uppercase tracking-tight">
            LUXURY SALON CARE PRODUCTS
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Discover our curated collection of professional haircare, styling pomades, hydrafacial serums, and beauty essentials.
          </p>
        </div>
      </section>

      {/* Main Content & Products Grid */}
      <section className="py-20 bg-[#FFFFFF]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Toolbar */}
          <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#F8F8F6] border border-slate-200 shadow-sm">
            <div className="w-full sm:w-96">
              <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                Search Products
              </label>
              <input
                type="text"
                placeholder="Search by product name e.g. Pomade, Shampoo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none font-medium"
              />
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing <strong className="text-[#111111]">{filteredProducts.length}</strong> products
            </div>
          </div>

          {/* Skeleton Loading State or Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm"
                >
                  <div className="w-full h-64 rounded-2xl bg-slate-100" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-100 rounded" />
                  <div className="h-12 w-full bg-slate-200 rounded-xl pt-4" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-500 font-medium">
              No products found matching &quot;{searchQuery}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
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

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 group"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#F8F8F6] mb-6 flex items-center justify-center p-4">
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
                      <h3 className="font-sans font-bold text-lg text-[#111111] line-clamp-2 mb-2 group-hover:text-[#996515] transition-colors">
                        {product.title}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-6 space-y-4">
                      {/* Pricing */}
                      <div className="flex items-baseline space-x-3">
                        <span className="font-sans text-2xl font-extrabold text-[#111111]">
                          Rs. {displayPrice?.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <span className="font-sans text-sm text-slate-400 line-through">
                            Rs. {product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Action Button: WhatsApp Order Link */}
                      <a
                        href={`https://wa.me/923194415757?text=${encodeURIComponent(
                          `Hello Jugnu's Saloon, I would like to order this product: *${product.title}* (Price: Rs. ${displayPrice?.toLocaleString()}). Link: ${
                            typeof window !== "undefined" ? window.location.href : "https://software.jugnussaloon.com/products"
                          }`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-[#111111] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 group/wa"
                      >
                        <svg className="w-4 h-4 fill-current text-[#D4AF37] group-hover/wa:text-white transition-colors" viewBox="0 0 24 24">
                          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.341a9.946 9.946 0 004.882 1.28h.003c5.505 0 9.988-4.478 9.989-9.984 0-2.668-1.037-5.176-2.922-7.062A9.92 9.92 0 0012.012 2zm5.74 14.184c-.244.688-1.42 1.314-1.96 1.396-.505.076-1.162.107-1.874-.12-.435-.138-1.002-.324-1.74-.645-3.096-1.348-5.115-4.492-5.27-4.698-.153-.205-1.258-1.674-1.258-3.192 0-1.517.794-2.264 1.077-2.553.282-.288.614-.36.819-.36.205 0 .41.002.589.011.19.01.442-.072.693.53.256.615.872 2.128.948 2.282.077.153.128.333.026.538-.103.205-.154.333-.308.512-.154.18-.323.402-.461.54-.154.153-.314.321-.135.628.18.307.798 1.316 1.713 2.13 1.177 1.047 2.167 1.371 2.474 1.525.307.153.487.128.667-.077.179-.205.768-.897.973-1.205.205-.307.41-.256.692-.153.282.102 1.794.846 2.102 1.001.307.153.512.23.589.36.077.128.077.742-.167 1.43z"/>
                        </svg>
                        <span>Book on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer onOpenBooking={() => handleOpenBooking()} />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={selectedProduct}
      />
    </main>
  );
}
