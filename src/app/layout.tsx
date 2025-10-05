import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/components/common/Providers"; // wrapper for redux provider & persist gate
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maestro AI",
  description: "Maestro AI: Master Your Interview. Turn Fear into Confidence.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps  ) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto p-4">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
