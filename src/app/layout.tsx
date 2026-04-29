import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Estate BOS | Lumen Labs",
  description: "Bespoke Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-[#050505] text-[#F5F5F5] overflow-x-hidden selection:bg-[#D4AF37]/30`}
      >
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <div className="relative z-20">
          <Footer />
        </div>
      </body>
    </html>
  );
}
