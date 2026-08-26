import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Nest by Diya — The Home of Heartfelt Gifting",
  description:
    "Handmade with love. Explore thoughtfully curated gift hampers, crochet flower bouquets, handcrafted DIY plates, custom name plates, memory frames, and personalized photo gifts.",
  keywords: [
    "Creative Nest by Diya",
    "handmade gifts",
    "customised hampers",
    "crochet bouquets",
    "DIY plates",
    "custom name plates",
    "photo frames",
    "heartfelt gifting",
    "handcrafted gifts India",
  ],
  authors: [{ name: "Diya" }],
  openGraph: {
    title: "Creative Nest by Diya — The Home of Heartfelt Gifting",
    description:
      "Handmade with love. Explore thoughtfully curated gift hampers, crochet bouquets, DIY plates, custom name plates, and personalized gifts.",
    type: "website",
    locale: "en_IN",
    siteName: "Creative Nest by Diya",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="font-body bg-brand-white text-brand-charcoal min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
