import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Toaster from "@/components/Toaster";
import HeaderSection from "@/components/HeaderSection";
import FooterSection from "@/components/FooterSection";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর — বাজারের সর্বশেষ দাম এক নজরে",
  description:
    "চাল, ডাল, তেল, সবজি, মাছ, মাংস ও নিত্যপণ্যের আজকের দাম এবং দামের পরিবর্তন এক নজরে।",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f0f6f1]">
        <Suspense
          fallback={
            <header className="border-b border-gray-200 p-4">
              <div className="mx-auto max-w-6xl text-sm text-gray-500">
                বাজার দর লোড হচ্ছে...
              </div>
            </header>
          }
        >
          <HeaderSection />
        </Suspense>

        {children}

        <FooterSection />

        <Toaster />
      </body>
    </html>
  );
}
