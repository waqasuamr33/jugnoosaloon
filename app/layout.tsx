import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jugnu's Saloon | Full Luxury Beauty, Bridal & Hair Saloon",
  description:
    "Jugnu's Saloon is a full-service luxury beauty lounge offering HD Bridal Makeup, Party Glam, Hydrafacials, Hair Styling & Color, Nail Extensions, and Spa rituals. Book your appointment online today.",
  keywords: [
    "Jugnu's Saloon",
    "Beauty Saloon",
    "Bridal Makeup",
    "HD Makeup",
    "Party Glam",
    "Hydrafacial",
    "Hair Styling",
    "Nail Art",
    "Beauty Lounge",
    "Book Online",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};


import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import AuthModal from "./components/AuthModal";
import CartDrawer from "./components/CartDrawer";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-[#D4AF37] selection:text-black"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <AuthModal />
            <CartDrawer />
            <WhatsAppFloatingButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
