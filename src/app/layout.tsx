import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@/components/analytics";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ExperienceControls } from "@/components/ui/ExperienceControls";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Creative Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <MotionProvider>
          <Header />
          <div className="min-h-screen pt-20">
            {/* pt-20 to account for fixed header */}
            {children}
          </div>
          <Footer />
          <ExperienceControls />
          <Toaster />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </MotionProvider>
      </body>
    </html>
  );
}
