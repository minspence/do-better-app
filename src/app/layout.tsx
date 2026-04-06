import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Do Better",
  description: "Level up your life, one habit at a time.",
  // PWA manifest — create public/manifest.json when ready
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  // Prevents zoom on input focus on iOS
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Makes the status bar area part of the app on iOS (edge-to-edge)
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
